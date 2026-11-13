// Lee de un componente de Angular lo que su contrato describe: entradas, salidas y contenido.
// Usa el compilador de TypeScript: recorre la clase y lee cada input(), model() y output().
//
// Cómo se corresponde Angular con el contrato, que es el mismo en todas las tecnologías:
// - una entrada `input()`            → una prop del contrato;
// - una salida `output()` `change`   → la prop función `onChange`;
// - el contenido (`<ng-content />`)  → la prop `children`, de tipo node;
// - una entrada que no está en el contrato y que es un atributo del elemento nativo que
//   dice `extends` (disabled, type, value…) → nada: el contrato la da por heredada.
import { readFileSync } from 'node:fs'
import ts from 'typescript'

const capitalize = (text) => text[0].toUpperCase() + text.slice(1)

/** El comentario /** … *\/ que hay justo encima de un miembro de la clase. */
function docOf(member, source) {
  const ranges = ts.getLeadingCommentRanges(source.text, member.getFullStart()) ?? []
  const last = ranges.at(-1)
  if (!last) return ''
  const text = source.text.slice(last.pos, last.end)
  return text.startsWith('/**') ? text.replace(/^\/\*\*\s*|\s*\*\/$/g, '').replace(/\s*\n\s*\*\s?/g, ' ').trim() : ''
}

function typeOf(typeNode, initial, transform) {
  if (transform === 'booleanAttribute') return { type: 'boolean' }
  if (transform === 'numberAttribute') return { type: 'number' }
  if (typeNode) {
    const parts = (ts.isUnionTypeNode(typeNode) ? typeNode.types : [typeNode]).filter((t) => t.kind !== ts.SyntaxKind.UndefinedKeyword)
    if (parts.every((t) => ts.isLiteralTypeNode(t) && ts.isStringLiteral(t.literal))) return { type: 'enum', values: parts.map((t) => t.literal.text) }
    if (parts.length === 1 && ts.isArrayTypeNode(parts[0])) return { type: 'array' }
    return { type: parts.map((t) => t.getText()).join(' | ') } // boolean, string, number
  }
  if (!initial) return { type: 'unknown' }
  if (initial.kind === ts.SyntaxKind.TrueKeyword || initial.kind === ts.SyntaxKind.FalseKeyword) return { type: 'boolean' }
  if (ts.isStringLiteralLike(initial)) return { type: 'string' }
  if (ts.isNumericLiteral(initial)) return { type: 'number' }
  return { type: 'unknown' }
}

function literal(node) {
  if (node.kind === ts.SyntaxKind.TrueKeyword) return true
  if (node.kind === ts.SyntaxKind.FalseKeyword) return false
  if (ts.isStringLiteralLike(node)) return node.text
  if (ts.isNumericLiteral(node)) return Number(node.text)
  return undefined
}

/** `transform: booleanAttribute` en las opciones de la entrada. */
function transformOf(options) {
  if (!options || !ts.isObjectLiteralExpression(options)) return undefined
  const property = options.properties.find((p) => ts.isPropertyAssignment(p) && p.name.getText() === 'transform')
  return property?.initializer.getText()
}

/**
 * Las entradas, las salidas y el contenido de un componente, en la forma del contrato.
 * Cada elemento lleva `kind`: 'input', 'model', 'output' o 'content'.
 */
export function membersFromCode(file) {
  const source = ts.createSourceFile(file, readFileSync(file, 'utf8'), ts.ScriptTarget.ES2022, true)
  const out = []
  const visit = (node) => {
    if (ts.isClassDeclaration(node)) {
      for (const member of node.members) {
        if (!ts.isPropertyDeclaration(member) || !member.initializer || !ts.isCallExpression(member.initializer)) continue
        const call = member.initializer
        const callee = call.expression.getText() // input, input.required, model, model.required, output
        const [fn, required] = callee.split('.')
        if (!['input', 'model', 'output'].includes(fn)) continue
        const name = member.name.getText()
        const description = docOf(member, source)
        if (fn === 'output') {
          out.push({ kind: 'output', prop: { name: `on${capitalize(name)}`, type: 'function' }, description })
          continue
        }
        const [first, second] = call.arguments
        const initial = required ? undefined : first
        const options = required ? first : second
        const prop = { name, ...typeOf(call.typeArguments?.[0], initial, transformOf(options)) }
        if (required) prop.required = true
        const value = initial && literal(initial)
        if (value !== undefined) prop.default = value
        out.push({ kind: fn, prop, description })
      }
    }
    ts.forEachChild(node, visit)
  }
  visit(source)

  // El contenido: <ng-content />, con su comentario HTML justo encima.
  // Es opcional si su contenedor se oculta cuando no hay nada dentro (clase `empty:hidden`).
  const content = /(<[^<>]*>)?\s*<!--\s*(.+?)\s*-->\s*<ng-content\b|<ng-content\b/.exec(source.text)
  if (content) {
    const prop = { name: 'children', type: 'node' }
    if (!content[1]?.includes('empty:hidden')) prop.required = true
    out.push({ kind: 'content', prop, description: content[2] ?? '' })
  }
  return out
}

const nativeCache = {}
/** Los nombres, en minúsculas, de las propiedades del elemento nativo `tag` (button, input…). */
export function nativeAttributes(tag) {
  if (nativeCache[tag]) return nativeCache[tag]
  const fileName = 'native.ts'
  const text = `export type Native = HTMLElementTagNameMap['${tag}']`
  const host = ts.createCompilerHost({})
  const original = { getSourceFile: host.getSourceFile, fileExists: host.fileExists, readFile: host.readFile }
  host.getSourceFile = (name, ...rest) => (name === fileName ? ts.createSourceFile(name, text, ts.ScriptTarget.ES2022, true) : original.getSourceFile(name, ...rest))
  host.fileExists = (name) => name === fileName || original.fileExists(name)
  host.readFile = (name) => (name === fileName ? text : original.readFile(name))
  const program = ts.createProgram([fileName], { lib: ['lib.es2022.d.ts', 'lib.dom.d.ts'], noEmit: true, types: [] }, host)
  const checker = program.getTypeChecker()
  const alias = program.getSourceFile(fileName).statements[0]
  const names = checker.getTypeFromTypeNode(alias.type).getProperties().map((symbol) => symbol.name.toLowerCase())
  return (nativeCache[tag] = new Set(names))
}

/**
 * Las props propias del componente, en la forma del contrato, con el comentario de cada una.
 * `contract` decide qué entradas son heredadas del elemento nativo.
 */
export function propsFromCode(file, contract) {
  const declared = new Set((contract.props ?? []).map((p) => p.name))
  const native = contract.extends ? nativeAttributes(contract.extends) : new Set()
  const out = []
  for (const member of membersFromCode(file)) {
    const { kind, prop, description } = member
    const inherited = (kind === 'input' || kind === 'model') && !declared.has(prop.name) && native.has(prop.name.toLowerCase())
    if (inherited) continue
    // model() crea también la salida `<nombre>Change`: forma parte del enlace [(nombre)], no es un evento aparte.
    out.push({ prop, description, event: kind === 'output' })
  }
  return out
}

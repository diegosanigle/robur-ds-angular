// Comprueba que el contrato de cada componente dice lo mismo que su código.
// Uso: node scripts/check-contracts.mjs
import { existsSync, readFileSync } from 'node:fs'
import { propsFromCode } from './lib/angular-meta.mjs'
import { pascal, pieces } from './lib/pieces.mjs'
import { colorClasses, primitives, themes, typography } from './lib/tokens.mjs'

const REQUIRED = ['name', 'description', 'useWhen', 'avoidWhen', 'props', 'states', 'tokens', 'composes', 'rules', 'accessibility']
const errors = []

// Qué clases de Tailwind delatan el uso de cada token.
const used = (pattern) => (code) => new RegExp(`(?<![\\w-])${pattern}(?![\\w-])`).test(code)
const detectors = {}
for (const name of Object.keys(themes.light)) detectors[name] = used(`(${colorClasses(name).join('|')})`)
for (const name of Object.keys(typography)) detectors[name] = used(`text-${name.slice(5)}`)
for (const name of Object.keys(primitives)) {
  if (name.startsWith('radius.')) detectors[name] = used(`rounded(-[a-z]{1,2})?-${name.slice(7)}`)
  if (name.startsWith('shadow.')) detectors[name] = used(`shadow-${name.slice(7)}`)
}

const same = (a, b) => JSON.stringify([...a].sort()) === JSON.stringify([...b].sort())
const components = pieces('components')
for (const { name, slug, file } of components) {
  const fail = (message) => errors.push(`${name}: ${message}`)

  for (const suffix of [`${slug}.component.ts`, `${slug}.stories.ts`, `${name}.contract.json`, 'index.ts']) {
    if (!existsSync(file(suffix))) fail(`falta ${suffix}`)
  }
  if (!existsSync(file(`${name}.contract.json`)) || !existsSync(file(`${slug}.component.ts`))) continue

  const contract = JSON.parse(readFileSync(file(`${name}.contract.json`), 'utf8'))
  const code = readFileSync(file(`${slug}.component.ts`), 'utf8')

  for (const key of REQUIRED) if (!(key in contract)) fail(`al contrato le falta "${key}"`)
  if (contract.name !== name) fail(`el contrato se llama "${contract.name}"`)

  // Nomenclatura: la clase y la etiqueta salen del nombre del contrato.
  if (!code.includes(`export class ${name}Component`)) fail(`la clase no se llama ${name}Component`)
  if (!code.includes(`selector: 'robur-${slug}'`)) fail(`la etiqueta no es robur-${slug}`)

  // Props: mismos nombres, tipos, valores, obligatoriedad y valores por defecto.
  const fromCode = propsFromCode(file(`${slug}.component.ts`), contract)
  const inContract = Object.fromEntries((contract.props ?? []).map((p) => [p.name, p]))
  for (const { prop, description, event } of fromCode) {
    let declared = inContract[prop.name]
    // En Angular una salida no puede ser obligatoria: de una prop función solo se comparan el nombre y el tipo.
    if (declared && event) declared = { name: declared.name, type: declared.type }
    if (!declared) fail(`la prop "${prop.name}" está en el código y no en el contrato`)
    else if (JSON.stringify(declared, Object.keys(declared).sort()) !== JSON.stringify(prop, Object.keys(prop).sort())) {
      fail(`la prop "${prop.name}" no coincide. Código: ${JSON.stringify(prop)} · Contrato: ${JSON.stringify(declared)}`)
    }
    if (!description) fail(`${prop.name === 'children' ? 'el contenido (<ng-content />)' : event ? `la salida de "${prop.name}"` : `la prop "${prop.name}"`} no tiene comentario en el código`)
  }
  for (const propName of Object.keys(inContract)) {
    if (!fromCode.some(({ prop }) => prop.name === propName)) fail(`la prop "${propName}" está en el contrato y no en el código`)
  }

  // Tokens: los que el código usa de verdad.
  const usedTokens = Object.keys(detectors).filter((token) => detectors[token](code))
  const declaredTokens = contract.tokens ?? []
  for (const token of usedTokens) if (!declaredTokens.includes(token)) fail(`usa el token ${token} y el contrato no lo declara`)
  for (const token of declaredTokens) if (!usedTokens.includes(token)) fail(`el contrato declara el token ${token} y el código no lo usa`)

  // Composición: los componentes del sistema que importa.
  const imported = [...code.matchAll(/from '\.\.\/([\w-]+)'/g)].map((m) => pascal(m[1]))
  if (!same(imported, contract.composes ?? [])) fail(`importa [${imported}] y el contrato declara composes [${contract.composes}]`)

  // Una story por cada valor de variant.
  const stories = readFileSync(file(`${slug}.stories.ts`), 'utf8')
  const variant = fromCode.find(({ prop }) => prop.name === 'variant')?.prop
  for (const value of variant?.values ?? []) {
    if (value !== variant.default && !stories.includes(`variant: '${value}'`)) fail(`la variante "${value}" no tiene story`)
  }
}

if (errors.length) {
  console.error(`Contratos: ${errors.length} problema(s)\n- ${errors.join('\n- ')}`)
  process.exit(1)
}
console.log(`Contratos: ${components.length} componentes, todos coinciden con su código.`)

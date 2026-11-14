// Revisa un trozo de interfaz (una plantilla o un componente de Angular) contra el sistema. No ejecuta el código: lo lee.
// Lo usan el MCP (validate_code), la comprobación de uso (check-usage) y los evals.
// `data` es el contenido de mcp/data.json.

const RAW = { button: 'Button', input: 'Input o Checkbox', select: 'Chip o Tabs', textarea: 'Input', dialog: 'Sheet' }
const DESIGN = /^(bg|text|border|rounded|shadow|ring|outline|fill|stroke)-(.+)$/
// Clases que empiezan igual que las de diseño pero son de disposición o de forma, no de aspecto.
const NEUTRAL = {
  text: /^(left|center|right|justify|wrap|nowrap|balance|pretty|ellipsis|clip)$/,
  bg: /^(transparent|current|inherit|none)$/,
  border: /^(\d+|[trblxyse](-\d+)?|dashed|dotted|solid|none|collapse|separate|transparent|current)$/,
  rounded: /^$/,
  shadow: /^none$/,
  ring: /^(\d+|inset|offset-\d+)$/,
  outline: /^(\d+|none|hidden|dashed|dotted|offset-\d+)$/,
  fill: /^(none|current)$/,
  stroke: /^(none|current|\d+)$/,
}
// Atributos que Angular admite en cualquier etiqueta y que no son props de la pieza.
const STRUCTURAL = /^(#|\*|\[(attr|class|style)\.|\[(class|ngClass|style|ngStyle)\]$)/
// Atributos que se quedan en la etiqueta de la pieza y no necesitan llegar al elemento nativo.
const HOST = /^(class|id|role|aria-[\w-]+|data-[\w-]+)$/
const capitalize = (text) => text[0].toUpperCase() + text.slice(1)
const BLAME = /\b(objetivos?|metas?|fallaste|fallado|fracas\w+|no has (entrenado|cumplido|hecho)|deberías|te falta[n]?)\b|¡/i
const eventOf = (prop) => prop.name[2].toLowerCase() + prop.name.slice(3)

export function validate(code, data, { level = 'screen' } = {}) {
  const issues = []
  const add = (rule, severity, message, index) =>
    issues.push({ rule, severity, message, line: index === undefined ? undefined : code.slice(0, index).split('\n').length })
  const pieces = { ...data.components, ...data.patterns }
  // En una plantilla de Angular una pieza se escribe con su etiqueta: Button es <robur-button>.
  const byTag = Object.fromEntries(Object.values(pieces).map((piece) => [piece.tag, piece]))
  const tagOf = (name) => pieces[name].tag

  // 1. Valores a mano.
  for (const m of code.matchAll(/#[0-9a-fA-F]{3,8}\b/g)) add('no-hex', 'error', `Color a mano ${m[0]}: usa una clase de token (get_tokens).`, m.index)
  for (const m of code.matchAll(/(?<![\w-])[a-z][\w:-]*-\[[^\]]+\]/g)) add('no-arbitrary', 'error', `Valor arbitrario "${m[0]}": usa una clase de la escala o propón un token.`, m.index)
  if (level !== 'component') {
    for (const m of code.matchAll(/(?<![\w-])(?:style=["']|\[style[.\]]|\[ngStyle\])/g)) add('no-inline-style', 'error', 'Estilo en línea: usa clases de tokens.', m.index)
  }

  // 2. Clases de diseño que no existen en el sistema.
  const checkClass = (word, index) => {
    const cls = word.split(':').pop().split('/')[0]
    const match = DESIGN.exec(cls)
    if (!match || !/^[a-z0-9-]+$/.test(cls)) return
    const [, prefix, rest] = match
    const side = prefix === 'rounded' ? rest.replace(/^[trblse]{1,2}-/, '') : rest
    if (data.classes.includes(`${prefix}-${side}`) || data.classes.includes(cls) || NEUTRAL[prefix].test(rest)) return
    add('unknown-class', 'error', `La clase "${cls}" no existe en el sistema. Consulta get_tokens.`, index)
  }
  for (const literal of code.matchAll(/(['"`])((?:(?!\1)[^\\\n]|\\.)*)\1/g)) {
    for (const word of literal[2].split(/\s+/)) checkClass(word, literal.index)
  }
  // [class.bg-action]="condición": la clase va en el nombre del atributo.
  for (const m of code.matchAll(/\[class\.([\w:/-]+)\]/g)) checkClass(m[1], m.index)
  if (level === 'component') return issues

  // De un componente .ts, lo que sigue solo mira la plantilla: en la clase, `input<Tipo>()` parece una etiqueta.
  const templates = [...code.matchAll(/\btemplate:\s*`((?:[^`\\]|\\.)*)`/g)]
  const parts = templates.length ? templates.map((m) => ({ text: m[1], offset: m.index + m[0].indexOf('`') + 1 })) : [{ text: code, offset: 0 }]
  // Las etiquetas de los componentes que el propio fichero declara no son piezas inventadas.
  const local = new Set([...code.matchAll(/selector:\s*['"]([\w-]+)['"]/g)].map((m) => m[1]))
  const all = parts.map((part) => part.text).join('\n')

  for (const { text: template, offset } of parts) {
    const at = (index) => index + offset

    // 3. Controles dibujados a mano.
    for (const m of template.matchAll(/<(button|input|select|textarea|dialog)[\s>/]/g)) {
      add('no-raw-control', 'error', `<${m[1]}> dibujado a mano: usa ${RAW[m[1]]} (<${tagOf(RAW[m[1]].split(' ')[0])}>).`, at(m.index))
    }

    // 4. Piezas, props y salidas que no existen.
    for (const m of template.matchAll(/<([a-z][a-z0-9]*(?:-[a-z0-9]+)+)((?:\s+[\w.:\-#*@()[\]]+(?:=(?:"[^"]*"|'[^']*'))?)*)\s*\/?>/g)) {
      const piece = byTag[m[1]]
      if (!piece) {
        if (!local.has(m[1]) && !m[1].startsWith('ng-')) add('unknown-component', 'error', `<${m[1]}> no existe en el sistema. Mira get_catalog; si falta, proponlo.`, at(m.index))
        continue
      }
      const name = piece.name
      const given = new Set()
      for (const attr of m[2].matchAll(/\s([\w.:\-#*@()[\]]+)(?:=(?:"([^"]*)"|'([^']*)'))?/g)) {
        const raw = attr[1]
        const text = attr[2] ?? attr[3]
        if (STRUCTURAL.test(raw)) continue // referencias, directivas estructurales y enlaces de clase, estilo o atributo
        const twoWay = /^\[\((.+)\)\]$/.exec(raw)
        const event = !twoWay && /^\((.+)\)$/.exec(raw)
        const bound = !twoWay && /^\[(.+)\]$/.exec(raw)
        const bare = (twoWay ?? event ?? bound)?.[1] ?? raw
        // Una salida `change` es, en el contrato, la prop función `onChange`.
        const propName = event ? `on${capitalize(bare)}` : bare
        given.add(propName)
        const prop = piece.props.find((p) => p.name === propName)
        // Un valor enlazado solo se puede comprobar si es un texto literal: [variant]="'danger'".
        const value = bound ? /^'([^']*)'$/.exec(text ?? '')?.[1] : event || twoWay ? undefined : text
        if (!prop) {
          if (piece.extends) {
            // Angular no pasa los atributos de la etiqueta al elemento nativo: solo llegan los que la pieza declara.
            const native = (piece.nativeAttributes ?? []).map((n) => n.replace(/[[\]()]/g, ''))
            if (event || native.includes(bare) || HOST.test(bare)) continue
            add('unknown-prop', 'error', `${name} no admite "${bare}": no llegaría al <${piece.extends}> de dentro. Props: ${piece.props.filter((p) => p.type !== 'function' && p.name !== 'children').map((p) => p.name).join(', ')}. Atributos nativos: ${native.join(', ')}.`, at(m.index))
            continue
          }
          if (event) add('unknown-prop', 'error', `${name} no tiene la salida "${bare}". Salidas: ${piece.props.filter((p) => p.type === 'function').map(eventOf).join(', ') || 'ninguna'}.`, at(m.index))
          else add('unknown-prop', 'error', `${name} no tiene la prop "${bare}". Props: ${piece.props.filter((p) => p.type !== 'function' && p.name !== 'children').map((p) => p.name).join(', ')}.`, at(m.index))
        } else if (prop.type === 'enum' && value !== undefined && !prop.values.includes(value)) {
          add('invalid-value', 'error', `${name}: ${bare}="${value}" no existe. Valores: ${prop.values.join(', ')}.`, at(m.index))
        }
      }
      for (const prop of piece.props.filter((p) => p.required && p.name !== 'children')) {
        if (given.has(prop.name)) continue
        const label = prop.type === 'function' ? `la salida obligatoria "${eventOf(prop)}"` : `la prop obligatoria "${prop.name}"`
        add('missing-prop', 'error', `A ${name} le falta ${label}.`, at(m.index))
      }
    }

    // 6. Textos: Robur registra, no juzga.
    for (const m of template.matchAll(/>([^<>{}]+)</g)) {
      const found = BLAME.exec(m[1])
      if (found) add('neutral-copy', 'warning', `Texto "${m[1].trim()}": "${found[0]}" suena a meta, a fallo o a exclamación. Robur registra, no juzga.`, at(m.index))
    }
    for (const m of template.matchAll(/(?<![[\w-])(?:title|description|label|hint|error|actionLabel|submitLabel)="([^"]+)"/g)) {
      const found = BLAME.exec(m[1])
      if (found) add('neutral-copy', 'warning', `Texto "${m[1]}": "${found[0]}" suena a meta, a fallo o a exclamación. Robur registra, no juzga.`, at(m.index))
    }
  }

  // 5. Reglas de composición que se pueden contar.
  const tags = (name) => [...all.matchAll(new RegExp(`<${tagOf(name)}(?![\\w-])([^>]*)>`, 'g'))].map((m) => m[1])
  const primaries = tags('Button').filter((a) => !/variant\]?=/.test(a) || /variant\]?=["']'?primary/.test(a)).length
  if (primaries > 1) add('one-primary', 'warning', `Hay ${primaries} botones primary. La regla es uno por pantalla.`)
  const inverse = [...tags('Card'), ...tags('StatCard')].filter((a) => /variant\]?=["']'?inverse/.test(a)).length
  if (inverse > 1) add('one-inverse', 'warning', `Hay ${inverse} tarjetas inverse. La regla es como mucho una por pantalla.`)

  return issues
}

export const format = (issues) =>
  issues.length
    ? issues.map((i) => `${i.severity === 'error' ? '✗' : '!'} [${i.rule}]${i.line ? ` línea ${i.line}:` : ''} ${i.message}`).join('\n')
    : '✓ Sin problemas: el código usa solo piezas y clases del sistema.'

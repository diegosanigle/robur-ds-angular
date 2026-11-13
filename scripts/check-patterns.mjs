// Comprueba los patrones: que solo combinan componentes del sistema y que su contrato dice la verdad.
// Uso: node scripts/check-patterns.mjs
import { existsSync, readFileSync } from 'node:fs'
import { propsFromCode } from './lib/angular-meta.mjs'
import { pascal, pieces } from './lib/pieces.mjs'

const REQUIRED = ['name', 'description', 'useWhen', 'avoidWhen', 'props', 'components', 'rules', 'accessibility']
// Un patrón no dibuja controles: los pone el sistema.
const RAW = ['button', 'input', 'select', 'textarea', 'a', 'dialog']
// Ni decide el aspecto de las superficies: fondos, bordes, radios y sombras son de los componentes.
const SURFACE = /(?<![\w-])(bg|border|rounded|shadow|ring|outline)-[a-z]/
const errors = []
const patterns = pieces('patterns')
const same = (a, b) => JSON.stringify([...a].sort()) === JSON.stringify([...b].sort())

for (const { name, slug, file } of patterns) {
  const fail = (message) => errors.push(`${name}: ${message}`)
  for (const suffix of [`${slug}.component.ts`, `${slug}.stories.ts`, `${name}.pattern.json`, 'index.ts']) {
    if (!existsSync(file(suffix))) fail(`falta ${suffix}`)
  }
  if (!existsSync(file(`${name}.pattern.json`)) || !existsSync(file(`${slug}.component.ts`))) continue

  const contract = JSON.parse(readFileSync(file(`${name}.pattern.json`), 'utf8'))
  const code = readFileSync(file(`${slug}.component.ts`), 'utf8')

  for (const key of REQUIRED) if (!(key in contract)) fail(`al contrato le falta "${key}"`)
  if (contract.name !== name) fail(`el contrato se llama "${contract.name}"`)
  if (!code.includes(`export class ${name}Component`)) fail(`la clase no se llama ${name}Component`)
  if (!code.includes(`selector: 'robur-${slug}'`)) fail(`la etiqueta no es robur-${slug}`)

  const imported = [...code.matchAll(/from '\.\.\/\.\.\/components\/([\w-]+)'/g)].map((m) => pascal(m[1]))
  if (!same(imported, contract.components ?? [])) fail(`importa [${imported}] y el contrato declara components [${contract.components}]`)
  if (!imported.length) fail('no usa ningún componente del sistema')

  for (const tag of RAW) if (new RegExp(`<${tag}[\\s>]`).test(code)) fail(`dibuja un <${tag}> propio: usa el componente del sistema`)
  const surface = SURFACE.exec(code)
  if (surface) fail(`usa la clase "${surface[0]}…": fondos, bordes, radios y sombras los ponen los componentes`)

  // Entradas, salidas (onX) y contenido (children), con los nombres neutros del contrato.
  const fromCode = propsFromCode(file(`${slug}.component.ts`), contract)
  const inCode = fromCode.map(({ prop }) => prop.name)
  if (!same(inCode, (contract.props ?? []).map((p) => p.name))) fail(`las props del código [${inCode}] no coinciden con las del contrato`)
  for (const { prop, description } of fromCode) if (!description) fail(`"${prop.name}" no tiene comentario`)
}

if (errors.length) {
  console.error(`Patrones: ${errors.length} problema(s)\n- ${errors.join('\n- ')}`)
  process.exit(1)
}
console.log(`Patrones: ${patterns.length} patrones, todos combinan solo componentes del sistema.`)

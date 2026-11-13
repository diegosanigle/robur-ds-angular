// Lee el sistema entero (componentes, patrones y sus contratos) para los generadores:
// el catálogo, la documentación y, más adelante, el MCP.
import { existsSync, readFileSync } from 'node:fs'
import { membersFromCode, propsFromCode } from './angular-meta.mjs'
import { kebab, pieces } from './pieces.mjs'

function read(kind, folder, suffix) {
  return pieces(folder)
    .filter(({ name, file }) => existsSync(file(`${name}.${suffix}.json`)))
    .map(({ name, slug, file }) => {
      const contract = JSON.parse(readFileSync(file(`${name}.${suffix}.json`), 'utf8'))
      const code = file(`${slug}.component.ts`)
      const stories = readFileSync(file(`${slug}.stories.ts`), 'utf8')
      const title = /title: '([^']+)'/.exec(stories)[1]
      const own = propsFromCode(code, contract)
      return {
        ...contract,
        kind,
        // Cómo se escribe en Angular: carpeta y ficheros en kebab-case, etiqueta con el prefijo del sistema.
        slug,
        tag: `robur-${slug}`,
        path: `src/${folder}/${slug}`,
        // Las descripciones de las props viven en el código: aquí se juntan con el contrato.
        propDocs: Object.fromEntries(own.map(({ prop, description }) => [prop.name, description ?? ''])),
        // Las entradas que no están en el contrato: los atributos del elemento nativo que el componente deja pasar.
        native: membersFromCode(code)
          .filter(({ kind: member, prop }) => (member === 'input' || member === 'model') && !own.some((o) => o.prop.name === prop.name))
          .map(({ kind: member, prop }) => ({ name: prop.name, twoWay: member === 'model' })),
        stories: [...stories.matchAll(/^export const (\w+)/gm)].map((m) => ({
          name: m[1],
          id: `${title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}--${kebab(m[1])}`,
        })),
      }
    })
}

export const components = read('component', 'components', 'contract')
export const patterns = read('pattern', 'patterns', 'pattern')

---
paths:
  - "src/components/**"
---

# Componentes

- Cada componente vive en `src/components/<nombre>/`, en kebab-case, con cuatro ficheros:
  `<nombre>.component.ts`, `<nombre>.stories.ts`, `<Nombre>.contract.json` e `index.ts`. Se
  exporta desde `src/index.ts`.
- Para crear uno nuevo, sigue la skill `/nuevo-componente`: primero el contrato, después el código.
- El contrato se cambia en el mismo commit que el código. `npm run check` compara los dos.
- Un componente solo usa clases de tokens semánticos. Si necesitas un color, un radio o un
  tamaño que no existe, para y propón el token.
- Nombres: el componente en PascalCase (`StatCard`) en el contrato, en Figma y en la
  documentación; su clase añade `Component` (`StatCardComponent`) y su etiqueta es
  `robur-stat-card`. Props en camelCase; variantes por función (`danger`, no `red`); booleanos
  como adjetivo sin `is` (`selected`). La selección y el deshabilitado son estados, no variantes.
- Un componente es standalone, con `ChangeDetectionStrategy.OnPush` y la plantilla dentro del
  fichero. Las props van en `input()`, los eventos en `output()` y el contenido en
  `<ng-content />`. Sin `@Input()`, sin `@Output()` y sin NgModules.
- Cada entrada y cada salida llevan un comentario de una línea encima, y el contenido un
  comentario HTML justo encima de `<ng-content />`: es su documentación. Lo que solo usa la
  plantilla va `protected` y marcado con `@internal`.
- El contrato usa nombres neutros: una salida `change` se anota como la prop función `onChange`
  y el contenido como la prop `children`.
- Angular no pasa los atributos de la etiqueta al elemento nativo de dentro. Los que hagan
  falta (`disabled`, `type`, `placeholder`) se declaran como entradas y se pasan a mano; el
  valor de un campo, con `model()`. No se anotan en el contrato: los cubre `extends`. El clic no
  se declara: `(click)` en la etiqueta recibe el del elemento de dentro.
- Si la caja es el elemento nativo de dentro (`<button>`, `<dialog>`), la etiqueta lleva
  `host: { class: 'contents' }`. Si no hay elemento nativo, la caja es la propia etiqueta y sus
  clases van en `host`.
- `[class]` recibe un texto, no una lista: une las clases con `join(' ')`.
- No llames a una salida como un evento nativo que pueda subir desde el contenido (`change`,
  `submit`, `input`). Si el contrato obliga, detén el evento nativo dentro del componente.
- Cada variante y cada estado tienen su story. Los componentes interactivos tienen además una
  story `Interaccion` que usa el componente como lo haría una persona y comprueba el resultado.
- Antes de programar un comportamiento, usa el que ya da el navegador: `<dialog>`, `<input>`,
  `<button>`, `<nav>`.
- Zona pulsable de 44 px de alto como mínimo. Todo control tiene un nombre accesible.
- Si un componente usa otro del sistema, se importa y se declara en `composes`. No se copian estilos.
- Si cambian las props, hay que llevar el cambio a Figma: skill `/sincronizar-figma`.

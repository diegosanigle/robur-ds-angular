// url=https://www.figma.com/design/lTMwgNScwy7MEq8CaafRGC?node-id=3-161
// source=src/components/exercise-row/exercise-row.component.ts
// component=ExerciseRowComponent
// Generado por scripts/build-code-connect.mjs desde el contrato y figma/library.json. No se edita a mano.
import figma from 'figma'

const instance = figma.selectedInstance
const checkbox = instance.findInstance('Checkbox')
const name = checkbox.getString('label')
const target = checkbox.getString('hint')
const completed = instance.getEnum('completed', { 'false': false, 'true': true })
const children = instance.getSlot('children')

export default {
  example: figma.code`<robur-exercise-row${' name="' + name + '"' + (target ? ' target="' + target + '"' : '') + ' [completed]="' + completed + '"' + ' (completedChange)="onCompletedChange($event)"'}>
  ${children}
</robur-exercise-row>`,
  imports: ['import { ExerciseRowComponent } from "robur-ds"'],
  id: 'ExerciseRow',
  metadata: { nestable: true },
}

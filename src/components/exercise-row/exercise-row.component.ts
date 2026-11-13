import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core'
import { CheckboxComponent } from '../checkbox'

@Component({
  selector: 'robur-exercise-row',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CheckboxComponent],
  host: { '[class]': 'classes()' },
  template: `
    <robur-checkbox [label]="name()" [hint]="target()" [checked]="completed()" (checkedChange)="completedChange.emit($event)" />
    <div class="grid grid-cols-3 gap-2 empty:hidden">
      <!-- Los campos de registro: series, repeticiones, peso. Máximo tres. -->
      <ng-content />
    </div>
  `,
})
export class ExerciseRowComponent {
  /** Nombre del ejercicio. */
  readonly name = input.required<string>()
  /** Objetivo del ejercicio, ya formateado: «3 series × 12 reps». */
  readonly target = input<string>()
  /** El ejercicio está hecho. */
  readonly completed = input.required<boolean>()
  /** Se emite con el nuevo estado al marcar o desmarcar. */
  readonly completedChange = output<boolean>()

  /** @internal */
  protected readonly classes = computed(
    () => 'flex flex-col gap-3 rounded-md border border-default p-3.5 ' + (this.completed() ? 'bg-action-soft' : 'bg-surface'),
  )
}

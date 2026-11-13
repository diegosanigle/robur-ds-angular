import { ChangeDetectionStrategy, Component, booleanAttribute, input, output } from '@angular/core'
import { ButtonComponent } from '../../components/button'
import { ChipComponent } from '../../components/chip'
import { ExerciseRowComponent } from '../../components/exercise-row'

export interface SessionExercise {
  id: string
  name: string
  target?: string
  completed: boolean
}

@Component({
  selector: 'robur-session-log',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ButtonComponent, ChipComponent, ExerciseRowComponent],
  host: { class: 'block' },
  template: `
    <section class="flex flex-col gap-6">
      <h2 class="text-h2 text-primary">Registrar sesión</h2>
      <div role="group" aria-label="Tipo de día" class="flex flex-wrap gap-2">
        @for (type of dayTypes(); track type) {
          <robur-chip [selected]="type === dayType()" (click)="dayTypeChange.emit(type)">{{ type }}</robur-chip>
        }
      </div>
      <ul class="flex flex-col gap-4">
        @for (exercise of exercises(); track exercise.id) {
          <li>
            <robur-exercise-row
              [name]="exercise.name"
              [target]="exercise.target"
              [completed]="exercise.completed"
              (completedChange)="exerciseChange.emit({ id: exercise.id, completed: $event })"
            />
          </li>
        }
      </ul>
      <robur-button fullWidth [loading]="saving()" (click)="save.emit()">Guardar sesión</robur-button>
    </section>
  `,
})
export class SessionLogComponent {
  /** Los tipos de día entre los que elegir, en orden. */
  readonly dayTypes = input.required<string[]>()
  /** El tipo de día elegido. */
  readonly dayType = input.required<string>()
  /** Los ejercicios del día elegido. */
  readonly exercises = input.required<SessionExercise[]>()
  /** El guardado está en curso. */
  readonly saving = input(false, { transform: booleanAttribute })
  /** Se emite con el tipo de día pulsado. */
  readonly dayTypeChange = output<string>()
  /** Se emite al marcar o desmarcar un ejercicio, con su `id` y su nuevo estado. */
  readonly exerciseChange = output<{ id: string; completed: boolean }>()
  /** Se emite al guardar la sesión. */
  readonly save = output<void>()
}

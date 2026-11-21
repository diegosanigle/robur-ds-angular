import { Component, output, signal } from '@angular/core'
import { FormLayoutComponent, InputComponent } from 'robur-ds'

@Component({
  selector: 'app-new-exercise-form',
  standalone: true,
  imports: [FormLayoutComponent, InputComponent],
  template: `
    <robur-form-layout
      title="Nuevo ejercicio"
      submitLabel="Guardar ejercicio"
      cancelLabel="Cancelar"
      [submitting]="submitting()"
      (submit)="save()"
      (cancel)="cancelled.emit()"
    >
      <robur-input
        label="Nombre del ejercicio"
        placeholder="Sentadilla"
        [(value)]="name"
        [error]="nameError()"
      />
      <robur-input
        label="Series"
        [numeric]="true"
        [(value)]="sets"
        [error]="setsError()"
      />
      <robur-input
        label="Repeticiones"
        [numeric]="true"
        [(value)]="reps"
        [error]="repsError()"
      />
    </robur-form-layout>
  `,
})
export class NewExerciseFormComponent {
  readonly saved = output<{ name: string; sets: number; reps: number }>()
  readonly cancelled = output<void>()

  readonly name = signal('')
  readonly sets = signal('')
  readonly reps = signal('')
  readonly submitting = signal(false)
  readonly nameError = signal('')
  readonly setsError = signal('')
  readonly repsError = signal('')

  save() {
    const name = this.name().trim()
    const sets = Number(this.sets())
    const reps = Number(this.reps())
    this.nameError.set(name ? '' : 'Escribe un nombre para el ejercicio')
    this.setsError.set(Number.isInteger(sets) && sets > 0 ? '' : 'Escribe un número de series mayor que 0')
    this.repsError.set(Number.isInteger(reps) && reps > 0 ? '' : 'Escribe un número de repeticiones mayor que 0')
    if (this.nameError() || this.setsError() || this.repsError()) return
    this.saved.emit({ name, sets, reps })
  }
}

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
      (submit)="save()"
      (cancel)="cancelled.emit()"
    >
      <robur-input
        label="Nombre del ejercicio"
        placeholder="Sentadilla goblet"
        [value]="name()"
        (input)="name.set($any($event.target).value)"
        [error]="nameError()"
      />
      <robur-input
        label="Series"
        [numeric]="true"
        [value]="sets()"
        (input)="sets.set($any($event.target).value)"
        [error]="setsError()"
      />
      <robur-input
        label="Repeticiones"
        [numeric]="true"
        [value]="reps()"
        (input)="reps.set($any($event.target).value)"
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

  private readonly submitted = signal(false)

  private isCount(value: string): boolean {
    const n = Number(value)
    return Number.isInteger(n) && n > 0
  }

  nameError(): string | undefined {
    return this.submitted() && !this.name().trim() ? 'Escribe un nombre para el ejercicio' : undefined
  }

  setsError(): string | undefined {
    return this.submitted() && !this.isCount(this.sets()) ? 'Escribe un número de series mayor que 0' : undefined
  }

  repsError(): string | undefined {
    return this.submitted() && !this.isCount(this.reps()) ? 'Escribe un número de repeticiones mayor que 0' : undefined
  }

  save(): void {
    this.submitted.set(true)
    if (this.nameError() || this.setsError() || this.repsError()) return
    this.saved.emit({
      name: this.name().trim(),
      sets: Number(this.sets()),
      reps: Number(this.reps()),
    })
  }
}

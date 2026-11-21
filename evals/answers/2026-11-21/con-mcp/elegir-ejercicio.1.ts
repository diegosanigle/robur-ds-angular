import { Component, input } from '@angular/core';
import { SelectComponent } from 'robur-ds';

export interface ExerciseOption {
  value: string;
  label: string;
}

@Component({
  selector: 'app-exercise-picker',
  standalone: true,
  imports: [SelectComponent],
  template: `
    <robur-select
      label="Ejercicio de la sesión"
      placeholder="Elige un ejercicio"
      hint="Elige entre tus ejercicios guardados."
      name="exercise"
      [options]="exercises()"
      [(value)]="selected"
    />
  `,
})
export class ExercisePickerComponent {
  /** Los 40 ejercicios guardados de la persona. */
  exercises = input.required<ExerciseOption[]>();
  selected = '';
}

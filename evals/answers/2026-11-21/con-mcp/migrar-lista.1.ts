import { Component, input, output } from '@angular/core'
import { ButtonComponent, ListRowComponent, StatCardComponent } from 'robur-ds'

export interface Exercise {
  id: string
  name: string
  sets: number
}

@Component({
  selector: 'app-exercise-list',
  standalone: true,
  imports: [ListRowComponent, ButtonComponent, StatCardComponent],
  template: `
    <ul>
      @for (exercise of exercises(); track exercise.id) {
        <robur-list-row [title]="exercise.name" [detail]="exercise.sets + ' series'">
          <robur-button variant="text" (click)="edit.emit(exercise)">Editar</robur-button>
        </robur-list-row>
      }
    </ul>
    <robur-stat-card label="Volumen total" [value]="formatted()" unit="kg" />
  `,
})
export class ExerciseListComponent {
  readonly exercises = input.required<Exercise[]>()
  readonly totalVolume = input.required<number>()
  readonly edit = output<Exercise>()

  formatted(): string {
    return String(Math.round(this.totalVolume())).replace(/\B(?=(\d{3})+(?!\d))/g, '.')
  }
}

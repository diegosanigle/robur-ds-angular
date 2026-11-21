import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';
import { ButtonComponent, ListRowComponent, StatCardComponent } from 'robur-ds';

export interface ExerciseItem {
  id: string;
  name: string;
  series: number;
}

@Component({
  selector: 'app-exercise-list',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ListRowComponent, ButtonComponent, StatCardComponent],
  template: `
    <ul class="flex flex-col">
      @for (exercise of exercises(); track exercise.id) {
        <li>
          <robur-list-row
            [title]="exercise.name"
            [detail]="exercise.series + (exercise.series === 1 ? ' serie' : ' series')"
          >
            <robur-button variant="text" (click)="edit.emit(exercise.id)">Editar</robur-button>
          </robur-list-row>
        </li>
      }
    </ul>

    <robur-stat-card label="Volumen total" [value]="formattedVolume()" unit="kg" />
  `,
})
export class ExerciseListComponent {
  /** Ejercicios que se muestran, en orden. */
  readonly exercises = input.required<ExerciseItem[]>();

  /** Volumen total de la sesión, en kg. */
  readonly volume = input.required<number>();

  /** Se emite con el id del ejercicio cuando se pulsa Editar. */
  readonly edit = output<string>();

  /** @internal */
  protected readonly formattedVolume = computed(() =>
    this.volume().toLocaleString('es-ES', { useGrouping: 'always' }),
  );
}

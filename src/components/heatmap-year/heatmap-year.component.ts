import { ChangeDetectionStrategy, Component, input, output } from '@angular/core'
import { HeatmapCellComponent } from '../heatmap-cell'

// Una clase por nivel, escrita entera: Tailwind solo genera las clases que encuentra en el código.
const LEGEND = ['bg-heat-0', 'bg-heat-1', 'bg-heat-2', 'bg-heat-3', 'bg-heat-4']

@Component({
  selector: 'robur-heatmap-year',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [HeatmapCellComponent],
  host: { class: 'flex flex-col gap-4' },
  template: `
    <div role="group" [attr.aria-label]="'Semanas de ' + year()" class="grid grid-cols-13 gap-1">
      @for (week of weeks(); track week.week) {
        <robur-heatmap-cell
          [week]="week.week"
          [sessions]="week.sessions"
          [level]="week.level"
          [rest]="week.rest ?? false"
          [current]="week.current ?? false"
          (click)="weekSelect.emit(week.week)"
        />
      }
    </div>
    <div aria-hidden="true" class="flex items-center justify-end gap-1.5 text-label text-tertiary">
      <span>menos</span>
      @for (level of legend; track level) {
        <span [class]="'size-2.5 rounded-xs ' + level"></span>
      }
      <span>más</span>
    </div>
  `,
})
export class HeatmapYearComponent {
  /** Año ISO de las semanas. Da nombre a la rejilla. */
  readonly year = input.required<number>()
  /** Una entrada por semana ISO del año, en orden: 52 o 53. */
  readonly weeks = input.required<{ week: number; sessions: number; level?: number; rest?: boolean; current?: boolean }[]>()
  /** Se emite con el número de semana al pulsar una celda. */
  readonly weekSelect = output<number>()

  /** @internal */
  protected readonly legend = LEGEND
}

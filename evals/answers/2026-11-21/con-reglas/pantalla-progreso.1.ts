import { ChangeDetectionStrategy, Component, computed, input, model, output } from '@angular/core';
import {
  BarChartComponent,
  ButtonComponent,
  HeatmapYearComponent,
  ScreenStateComponent,
  StatCardComponent,
  TabsComponent,
} from '../../index';

type Range = 'week' | 'month' | 'year';

@Component({
  selector: 'app-progress-screen',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    BarChartComponent,
    ButtonComponent,
    HeatmapYearComponent,
    ScreenStateComponent,
    StatCardComponent,
    TabsComponent,
  ],
  template: `
    <div class="flex flex-col gap-4 p-4">
      <h1 class="text-h1 text-primary">Progreso</h1>

      @if (status() !== 'ready') {
        <robur-screen-state [state]="status()" (retry)="retry.emit()" />
      } @else {
        <robur-tabs
          label="Periodo"
          [tabs]="ranges"
          [value]="range()"
          (change)="range.set($event)"
        >
          <div class="flex flex-col gap-4">
            <div class="grid grid-cols-3 gap-2">
              <robur-stat-card label="Sesiones" [value]="sessionsText()" />
              <robur-stat-card label="Tiempo" [value]="minutesText()" unit="min" />
              <robur-stat-card label="Volumen total" [value]="volumeText()" unit="kg" />
            </div>

            <robur-bar-chart title="Sesiones por semana" [data]="weeklySessions()" />

            <robur-heatmap-year [year]="year()" [weeks]="heatmapWeeks()" />
          </div>
        </robur-tabs>

        <robur-button [fullWidth]="true" (click)="registerSession.emit()">
          Registrar sesión
        </robur-button>
      }
    </div>
  `,
})
export class ProgressScreenComponent {
  /** Estado de la carga: cargando, con error o listo. */
  readonly status = input<'loading' | 'error' | 'ready'>('loading');

  /** Periodo que se está viendo. */
  readonly range = model<Range>('week');

  /** Año que muestra el heatmap. */
  readonly year = input.required<number>();

  /** Número de sesiones del periodo. */
  readonly sessions = input(0);

  /** Minutos entrenados en el periodo. */
  readonly minutes = input(0);

  /** Volumen total del periodo, en kg. */
  readonly volume = input(0);

  /** Sesiones de cada semana, para la gráfica. */
  readonly weeklySessions = input<{ label: string; value: number }[]>([]);

  /** Una entrada por semana ISO del año, para el heatmap. */
  readonly heatmapWeeks = input<{ week: number; sessions: number }[]>([]);

  /** Se pide volver a cargar los datos. */
  readonly retry = output<void>();

  /** Se pide registrar una sesión. */
  readonly registerSession = output<void>();

  /** @internal */
  protected readonly ranges = [
    { value: 'week', label: 'Semana' },
    { value: 'month', label: 'Mes' },
    { value: 'year', label: 'Año' },
  ];

  private readonly format = new Intl.NumberFormat('es-ES', {
    useGrouping: 'always',
    maximumFractionDigits: 1,
  });

  /** @internal */
  protected readonly sessionsText = computed(() => this.format.format(this.sessions()));
  /** @internal */
  protected readonly minutesText = computed(() => this.format.format(this.minutes()));
  /** @internal */
  protected readonly volumeText = computed(() => this.format.format(this.volume()));
}

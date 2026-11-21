import { Component, signal } from '@angular/core';
import {
  BarChartComponent,
  ButtonComponent,
  CardComponent,
  HeatmapYearComponent,
  ScreenStateComponent,
  StatCardComponent,
  TabsComponent,
} from 'robur-ds';

type Period = 'week' | 'month' | 'year';
type LoadState = 'loading' | 'error' | 'ready';

@Component({
  selector: 'app-progress-screen',
  standalone: true,
  imports: [BarChartComponent, ButtonComponent, CardComponent, HeatmapYearComponent, ScreenStateComponent, StatCardComponent, TabsComponent],
  template: `
    <section class="flex flex-col gap-4">
      <h1 class="text-h1 text-primary">Progreso</h1>

      @if (state() === 'loading') {
        <robur-screen-state state="loading" />
      } @else if (state() === 'error') {
        <robur-screen-state
          state="error"
          message="No hemos podido cargar tu progreso. Revisa la conexión e inténtalo de nuevo."
          (retry)="load()"
        />
      } @else {
        <robur-tabs label="Periodo" [tabs]="periods" [value]="period()" (change)="period.set($any($event))" />

        <div class="grid grid-cols-3 gap-4">
          <robur-stat-card label="Sesiones" [value]="sessions()" />
          <robur-stat-card label="Minutos" [value]="minutes()" unit="min" />
          <robur-stat-card label="Volumen total" [value]="volume()" unit="kg" />
        </div>

        <robur-bar-chart title="Sesiones por semana, últimas 8 semanas" [data]="weeklySessions()" />

        <robur-card>
          <robur-heatmap-year [year]="year" [weeks]="yearWeeks()" />
        </robur-card>

        <robur-button variant="primary" [fullWidth]="true" (click)="registerSession()">Registrar sesión</robur-button>
      }
    </section>
  `,
})
export class ProgressScreenComponent {
  readonly year = 2026;
  readonly periods = [
    { value: 'week', label: 'Semana' },
    { value: 'month', label: 'Mes' },
    { value: 'year', label: 'Año' },
  ];

  readonly state = signal<LoadState>('loading');
  readonly period = signal<Period>('week');

  // Cifras ya formateadas en español: «2.480», «62,5».
  readonly sessions = signal('0');
  readonly minutes = signal('0');
  readonly volume = signal('0');
  readonly weeklySessions = signal<{ label: string; value: number }[]>([]);
  readonly yearWeeks = signal<{ week: number; sessions: number }[]>([]);

  load(): void {
    this.state.set('loading');
    // Llamada al servicio; al resolver: this.state.set('ready'), o 'error' si falla.
  }

  registerSession(): void {
    // Abre el registro de sesión (SessionLog).
  }
}

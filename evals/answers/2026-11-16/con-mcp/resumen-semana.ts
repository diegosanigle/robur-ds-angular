import { Component } from '@angular/core';
import { StatCardComponent } from 'robur-ds';

@Component({
  selector: 'app-weekly-summary',
  standalone: true,
  imports: [StatCardComponent],
  template: `
    <section class="flex flex-col gap-4" aria-label="Resumen de la semana">
      <robur-stat-card variant="inverse" label="Sesiones" [value]="sessions" />
      <div class="grid grid-cols-2 gap-4">
        <robur-stat-card label="Volumen total" [value]="volume" unit="kg" />
        <robur-stat-card label="Peso máximo" [value]="maxWeight" unit="kg" />
      </div>
    </section>
  `,
})
export class WeeklySummaryComponent {
  sessions = '4';
  volume = '2.480';
  maxWeight = '62,5';
}

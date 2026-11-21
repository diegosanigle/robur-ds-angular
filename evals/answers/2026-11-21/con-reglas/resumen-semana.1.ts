import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { StatCardComponent } from 'robur-ds';

const formatter = new Intl.NumberFormat('es-ES', {
  useGrouping: 'always' as unknown as boolean,
  maximumFractionDigits: 1,
});

@Component({
  selector: 'app-week-summary',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [StatCardComponent],
  template: `
    <section class="flex flex-col gap-4" aria-labelledby="week-summary-title">
      <h2 id="week-summary-title" class="text-h2 text-primary">Resumen de la semana</h2>

      <div class="grid grid-cols-2 gap-4">
        <div class="col-span-2">
          <robur-stat-card
            label="Sesiones"
            [value]="sessionsText()"
            variant="inverse"
          />
        </div>
        <robur-stat-card
          label="Volumen total"
          [value]="volumeText()"
          unit="kg"
        />
        <robur-stat-card
          label="Peso máximo"
          [value]="maxWeightText()"
          unit="kg"
        />
      </div>
    </section>
  `,
})
export class WeekSummaryComponent {
  /** Número de sesiones registradas esta semana. */
  readonly sessions = input.required<number>();

  /** Volumen total de la semana, en kg. */
  readonly volume = input.required<number>();

  /** Peso máximo levantado en la semana, en kg. */
  readonly maxWeight = input.required<number>();

  /** @internal */
  protected readonly sessionsText = computed(() => formatter.format(this.sessions()));

  /** @internal */
  protected readonly volumeText = computed(() => formatter.format(this.volume()));

  /** @internal */
  protected readonly maxWeightText = computed(() => formatter.format(this.maxWeight()));
}

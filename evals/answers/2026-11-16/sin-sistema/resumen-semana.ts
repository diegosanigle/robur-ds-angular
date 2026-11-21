import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { DecimalPipe } from '@angular/common';

@Component({
  selector: 'app-weekly-summary',
  standalone: true,
  imports: [DecimalPipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm" aria-labelledby="weekly-summary-title">
      <h2 id="weekly-summary-title" class="text-sm font-medium text-neutral-500">
        Resumen de la semana
      </h2>

      <dl class="mt-4 grid grid-cols-2 gap-4">
        <!-- Dato principal: sesiones -->
        <div class="col-span-2 rounded-xl bg-neutral-900 p-5 text-white">
          <dt class="text-sm font-medium text-neutral-300">Sesiones</dt>
          <dd class="mt-1 text-6xl font-bold leading-none tracking-tight">
            {{ sessions() }}
          </dd>
          <p class="mt-2 text-sm text-neutral-300">{{ sessionsLabel() }}</p>
        </div>

        <!-- Datos secundarios -->
        <div class="rounded-xl border border-neutral-200 p-4">
          <dt class="text-xs font-medium text-neutral-500">Volumen total</dt>
          <dd class="mt-1 text-xl font-semibold text-neutral-900">
            {{ totalVolumeKg() | number: '1.0-0' : 'es' }}
            <span class="text-sm font-normal text-neutral-500">kg</span>
          </dd>
        </div>

        <div class="rounded-xl border border-neutral-200 p-4">
          <dt class="text-xs font-medium text-neutral-500">Peso máximo</dt>
          <dd class="mt-1 text-xl font-semibold text-neutral-900">
            {{ maxWeightKg() | number: '1.0-1' : 'es' }}
            <span class="text-sm font-normal text-neutral-500">kg</span>
          </dd>
        </div>
      </dl>
    </section>
  `,
})
export class WeeklySummaryComponent {
  /** Número de sesiones completadas en la semana. */
  readonly sessions = input.required<number>();
  /** Volumen total levantado en la semana, en kg. */
  readonly totalVolumeKg = input.required<number>();
  /** Peso máximo levantado en la semana, en kg. */
  readonly maxWeightKg = input.required<number>();

  protected readonly sessionsLabel = computed(() =>
    this.sessions() === 1 ? 'sesión esta semana' : 'sesiones esta semana',
  );
}

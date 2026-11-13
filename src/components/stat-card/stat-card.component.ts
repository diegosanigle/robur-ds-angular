import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core'
import { CardComponent } from '../card'

const SERIES = { primary: 'text-data-1', secondary: 'text-data-2' }

@Component({
  selector: 'robur-stat-card',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CardComponent],
  host: { class: 'block' },
  template: `
    <robur-card [variant]="variant()">
      <p [class]="'text-label uppercase ' + muted()">{{ label() }}</p>
      <p [class]="'mt-2 text-h1 tabular-nums ' + figure()">
        {{ value() }}@if (unit(); as text) {<span [class]="'ml-1 text-title ' + muted()">{{ text }}</span>}
      </p>
    </robur-card>
  `,
})
export class StatCardComponent {
  /** Qué mide la cifra. */
  readonly label = input.required<string>()
  /** La cifra, ya formateada. */
  readonly value = input.required<string>()
  /** Unidad, junto a la cifra y más pequeña. */
  readonly unit = input<string>()
  /** `surface` es la tarjeta normal; `inverse` es la destacada oscura, máximo una por pantalla. */
  readonly variant = input<'surface' | 'inverse'>('surface')
  /** Color de la cifra en la variante `inverse`: serie principal o segunda serie. */
  readonly series = input<'primary' | 'secondary'>('primary')

  /** @internal */
  protected readonly muted = computed(() => (this.variant() === 'inverse' ? 'text-on-inverse-muted' : 'text-tertiary'))
  /** @internal */
  protected readonly figure = computed(() => (this.variant() === 'inverse' ? SERIES[this.series()] : ''))
}

import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core'
import { CardComponent } from '../card'

const SERIES = { primary: 'bg-data-1', secondary: 'bg-data-2' }
const number = new Intl.NumberFormat('es-ES', { maximumFractionDigits: 1 })

@Component({
  selector: 'robur-bar-chart',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CardComponent],
  host: { class: 'block' },
  template: `
    <robur-card [variant]="variant()">
      <figure [attr.aria-label]="title()" class="flex flex-col gap-3">
        <figcaption [class]="'text-title ' + muted()">{{ title() }}</figcaption>
        <div aria-hidden="true" class="flex h-40 items-end gap-1 pt-5">
          @for (bar of bars(); track bar.label) {
            <div class="flex h-full min-w-0 flex-1 flex-col items-center justify-end gap-1">
              <span [class]="'text-label tabular-nums ' + muted()">{{ bar.text }}</span>
              <span [class]="'w-full shrink-0 rounded-t-xs ' + fill()" [style.height.%]="bar.height"></span>
            </div>
          }
        </div>
        <div aria-hidden="true" class="flex gap-1">
          @for (bar of bars(); track bar.label) {
            <span [class]="'min-w-0 flex-1 truncate text-center text-label tabular-nums ' + muted()">{{ bar.label }}</span>
          }
        </div>
        <table class="sr-only">
          <tbody>
            @for (bar of bars(); track bar.label) {
              <tr>
                <th scope="row">{{ bar.label }}</th>
                <td>{{ bar.value }}</td>
              </tr>
            }
          </tbody>
        </table>
      </figure>
    </robur-card>
  `,
})
export class BarChartComponent {
  /** Qué mide la gráfica. Es su título visible y su nombre. */
  readonly title = input.required<string>()
  /** Una barra por elemento, en orden: la etiqueta va debajo y la cifra encima. */
  readonly data = input.required<{ label: string; value: number }[]>()
  /** `surface` es la tarjeta normal; `inverse` es la destacada oscura, máximo una por pantalla. */
  readonly variant = input<'surface' | 'inverse'>('surface')
  /** Color de las barras: serie principal o segunda serie (solo en `inverse`). */
  readonly series = input<'primary' | 'secondary'>('primary')

  /** @internal */
  protected readonly muted = computed(() => (this.variant() === 'inverse' ? 'text-on-inverse-muted' : 'text-tertiary'))
  /** @internal */
  protected readonly fill = computed(() => SERIES[this.series()])
  /** @internal */
  protected readonly bars = computed(() => {
    const data = this.data()
    const max = Math.max(...data.map((d) => d.value), 0) || 1
    return data.map((d) => ({
      label: d.label,
      value: number.format(d.value),
      text: d.value > 0 ? number.format(d.value) : '',
      height: (d.value / max) * 100,
    }))
  })
}

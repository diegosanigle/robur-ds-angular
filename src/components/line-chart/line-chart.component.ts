import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core'
import { CardComponent } from '../card'

const LINE = { primary: 'text-data-1', secondary: 'text-data-2' }
const DOT = { primary: 'bg-data-1', secondary: 'bg-data-2' }
const number = new Intl.NumberFormat('es-ES', { maximumFractionDigits: 1 })

@Component({
  selector: 'robur-line-chart',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CardComponent],
  host: { class: 'block' },
  template: `
    <robur-card [variant]="variant()">
      <figure [attr.aria-label]="title()" class="flex flex-col gap-3">
        <figcaption [class]="'text-title ' + muted()">{{ title() }}</figcaption>
        <div aria-hidden="true" class="flex h-40 gap-3">
          <div [class]="'relative min-w-0 flex-1 ' + line()">
            <svg viewBox="0 0 100 100" preserveAspectRatio="none" class="absolute inset-0 size-full overflow-visible">
              <polyline
                [attr.points]="chart().polyline"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linejoin="round"
                vector-effect="non-scaling-stroke"
              />
            </svg>
            @for (point of chart().points; track point.label) {
              <span
                [class]="'absolute size-2 -translate-x-1/2 -translate-y-1/2 rounded-pill ' + dot()"
                [style.left.%]="point.x"
                [style.top.%]="point.y"
              ></span>
            }
          </div>
          @if (data().length) {
            <div [class]="'flex flex-col justify-between text-right text-label tabular-nums ' + muted()">
              <span>{{ chart().max }}</span>
              <span>{{ chart().min }}</span>
            </div>
          }
        </div>
        @if (data().length) {
          <div aria-hidden="true" [class]="'flex justify-between text-label tabular-nums ' + muted()">
            <span>{{ data()[0].label }}</span>
            @if (data().length > 1) {
              <span>{{ data()[data().length - 1].label }}</span>
            }
          </div>
        }
        <table class="sr-only">
          <tbody>
            @for (point of chart().points; track point.label) {
              <tr>
                <th scope="row">{{ point.label }}</th>
                <td>{{ point.value }}</td>
              </tr>
            }
          </tbody>
        </table>
      </figure>
    </robur-card>
  `,
})
export class LineChartComponent {
  /** Qué mide la gráfica, con su unidad. Es su título visible y su nombre. */
  readonly title = input.required<string>()
  /** Un punto por registro, en orden: la etiqueta es la fecha y value la cifra. */
  readonly data = input.required<{ label: string; value: number }[]>()
  /** `surface` es la tarjeta normal; `inverse` es la destacada oscura, máximo una por pantalla. */
  readonly variant = input<'surface' | 'inverse'>('surface')
  /** Color de la línea: serie principal o segunda serie (solo en `inverse`). */
  readonly series = input<'primary' | 'secondary'>('primary')

  /** @internal */
  protected readonly muted = computed(() => (this.variant() === 'inverse' ? 'text-on-inverse-muted' : 'text-tertiary'))
  /** @internal */
  protected readonly line = computed(() => LINE[this.series()])
  /** @internal */
  protected readonly dot = computed(() => DOT[this.series()])
  /** @internal */
  protected readonly chart = computed(() => {
    const data = this.data()
    const values = data.map((d) => d.value)
    const min = Math.min(...values)
    const max = Math.max(...values)
    // Un margen del 10 % arriba y abajo para que los puntos no toquen el borde.
    const pad = (max - min || Math.abs(max) || 1) * 0.1
    const top = max + pad
    const bottom = min - pad
    const points = data.map((d, i) => ({
      label: d.label,
      value: number.format(d.value),
      x: data.length === 1 ? 50 : (i / (data.length - 1)) * 100,
      y: ((top - d.value) / (top - bottom)) * 100,
    }))
    return {
      points,
      polyline: points.map((p) => `${p.x},${p.y}`).join(' '),
      min: number.format(min),
      max: number.format(max),
    }
  })
}

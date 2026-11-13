import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core'

const VARIANTS = {
  surface: 'bg-surface text-primary',
  inverse: 'bg-inverse text-on-inverse',
}

const PADDINGS = { md: 'p-5', lg: 'p-6' }

@Component({
  selector: 'robur-card',
  changeDetection: ChangeDetectionStrategy.OnPush,
  // La tarjeta es la propia etiqueta <robur-card>: no hace falta una caja más dentro.
  host: { '[class]': 'classes()' },
  template: `
    <!-- El contenido de la tarjeta. -->
    <ng-content />
  `,
})
export class CardComponent {
  /** `surface` es la tarjeta normal; `inverse` es la destacada oscura, máximo una por pantalla. */
  readonly variant = input<'surface' | 'inverse'>('surface')
  /** Espacio interior: `md` son 20 px y `lg` son 24 px, para la tarjeta destacada. */
  readonly padding = input<'md' | 'lg'>('md')

  /** @internal */
  protected readonly classes = computed(() => ['block rounded-lg', PADDINGS[this.padding()], VARIANTS[this.variant()]].join(' '))
}

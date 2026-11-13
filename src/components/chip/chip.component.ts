import { ChangeDetectionStrategy, Component, booleanAttribute, computed, input } from '@angular/core'

const VARIANTS = {
  default: 'border-default bg-surface text-tertiary',
  accent: 'border-transparent bg-action-soft text-action',
}

@Component({
  selector: 'robur-chip',
  changeDetection: ChangeDetectionStrategy.OnPush,
  // La etiqueta <robur-chip> no pinta caja propia: la caja es el <button> de dentro.
  host: { class: 'contents' },
  template: `
    <button type="button" [disabled]="disabled()" [attr.aria-pressed]="selected()" [class]="classes()">
      <!-- El texto del chip. -->
      <ng-content />
    </button>
  `,
})
export class ChipComponent {
  /** `default` para elegir entre opciones; `accent` para destacar una sin seleccionarla. */
  readonly variant = input<'default' | 'accent'>('default')
  /** La opción está elegida. */
  readonly selected = input(false, { transform: booleanAttribute })

  // Atributos nativos del <button>. El clic no hace falta declararlo: `(click)` en <robur-chip> recibe el del <button>.
  /** Atributo nativo `disabled` del botón. */
  readonly disabled = input(false, { transform: booleanAttribute })

  /** @internal */
  protected readonly classes = computed(() =>
    [
      'inline-flex min-h-11 items-center justify-center rounded-pill border px-4',
      'text-control transition active:scale-95',
      'disabled:cursor-not-allowed disabled:opacity-50 disabled:active:scale-100',
      this.selected() ? 'border-transparent bg-selected text-on-selected' : VARIANTS[this.variant()],
    ].join(' '),
  )
}

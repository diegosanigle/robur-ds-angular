import { ChangeDetectionStrategy, Component, booleanAttribute, computed, input } from '@angular/core'

const VARIANTS = {
  primary: 'bg-action text-on-action',
  secondary: 'bg-transparent text-primary border border-strong',
  danger: 'bg-transparent text-danger border border-danger',
}

@Component({
  selector: 'robur-button',
  changeDetection: ChangeDetectionStrategy.OnPush,
  // La etiqueta <robur-button> no pinta caja propia: la caja es el <button> de dentro.
  host: { class: 'contents' },
  template: `
    <button [type]="type()" [disabled]="disabled() || loading()" [attr.aria-busy]="loading() || null" [class]="classes()">
      @if (loading()) {
        Guardando…
      } @else {
        <ng-content />
      }
    </button>
  `,
})
export class ButtonComponent {
  /** Jerarquía visual. Solo un `primary` por pantalla. */
  readonly variant = input<'primary' | 'secondary' | 'danger'>('primary')
  /** Ocupa todo el ancho del contenedor. */
  readonly fullWidth = input(false, { transform: booleanAttribute })
  /** Muestra que la acción está en curso y bloquea nuevos clics. */
  readonly loading = input(false, { transform: booleanAttribute })

  // Atributos nativos del <button>. Angular no los pasa solos al elemento de dentro: se declaran aquí.
  // El clic no hace falta declararlo: `(click)` en <robur-button> recibe el del <button>.
  /** Atributo nativo `type` del botón. */
  readonly type = input<'button' | 'submit' | 'reset'>('button')
  /** Atributo nativo `disabled` del botón. */
  readonly disabled = input(false, { transform: booleanAttribute })

  /** @internal */
  protected readonly classes = computed(() =>
    [
      'inline-flex min-h-11 items-center justify-center gap-2 rounded-pill px-6 py-3.5',
      'text-title transition active:scale-98',
      'disabled:cursor-not-allowed disabled:opacity-50 disabled:active:scale-100',
      this.fullWidth() ? 'w-full' : '',
      VARIANTS[this.variant()],
    ].join(' '),
  )
}

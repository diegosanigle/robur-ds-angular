import { ChangeDetectionStrategy, Component, input, output } from '@angular/core'
import { ButtonComponent } from '../../components/button'
import { listenersOf } from '../../utils/outputs'

@Component({
  selector: 'robur-screen-state',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ButtonComponent],
  host: { class: 'block' },
  template: `
    @if (state() === 'loading') {
      <div role="status" class="px-5 py-8 text-center text-body text-tertiary">Cargando…</div>
    } @else {
      <div role="alert" class="flex flex-col items-center gap-2 px-5 py-8 text-center">
        <h2 class="text-h3 text-primary">No se han podido cargar los datos</h2>
        <p class="text-body text-secondary">{{ message() ?? 'Comprueba la conexión y vuelve a intentarlo.' }}</p>
        @if (retryable) {
          <div class="mt-4">
            <robur-button variant="secondary" (click)="retry.emit()">Reintentar</robur-button>
          </div>
        }
      </div>
    }
  `,
})
export class ScreenStateComponent {
  /** `loading` mientras llegan los datos; `error` si no han podido llegar. */
  readonly state = input.required<'loading' | 'error'>()
  /** Qué ha pasado y qué hacer, en una frase. Solo en `error`. */
  readonly message = input<string>()
  /** Se emite al pulsar Reintentar. Si nadie lo escucha, el error no ofrece reintento. */
  readonly retry = output<void>()

  /** @internal Solo hay reintento si alguien escucha (retry). Se lee al pintar: las suscripciones ya existen. */
  protected get retryable() {
    return listenersOf(this.retry) > 0
  }
}

import { ChangeDetectionStrategy, Component, input, output } from '@angular/core'
import { ButtonComponent } from '../../components/button'

@Component({
  selector: 'robur-empty-state',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ButtonComponent],
  host: { class: 'flex flex-col items-center gap-2 px-5 py-8 text-center' },
  template: `
    <h2 class="text-h3 text-primary">{{ title() }}</h2>
    <p class="text-body text-secondary">{{ description() }}</p>
    @if (actionLabel(); as label) {
      <div class="mt-4">
        <robur-button (click)="action.emit()">{{ label }}</robur-button>
      </div>
    }
  `,
})
export class EmptyStateComponent {
  /** Qué habrá aquí. En neutro: nunca como un fallo de la persona. */
  readonly title = input.required<string>()
  /** Una frase que dice cómo empezar. */
  readonly description = input.required<string>()
  /** Texto del botón. Si no se pasa, no hay acción. */
  readonly actionLabel = input<string>()
  /** Se emite al pulsar el botón. */
  readonly action = output<void>()
}

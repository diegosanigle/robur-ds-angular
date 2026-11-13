import { ChangeDetectionStrategy, Component, booleanAttribute, input, output } from '@angular/core'
import { ButtonComponent } from '../../components/button'

@Component({
  selector: 'robur-form-layout',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ButtonComponent],
  host: { class: 'block' },
  // El submit nativo se detiene en el formulario: quien escucha (submit) recibe solo la salida del patrón.
  template: `
    <form novalidate class="flex flex-col gap-6" (submit)="$event.preventDefault(); $event.stopPropagation(); submit.emit()">
      <h2 class="text-h2 text-primary">{{ title() }}</h2>
      <div class="flex flex-col gap-4">
        <!-- Los campos, en el orden en que se rellenan. -->
        <ng-content />
      </div>
      <div class="flex flex-col gap-2">
        <robur-button type="submit" fullWidth [loading]="submitting()">{{ submitLabel() }}</robur-button>
        @if (cancelLabel(); as label) {
          <robur-button variant="secondary" fullWidth (click)="cancel.emit()">{{ label }}</robur-button>
        }
      </div>
    </form>
  `,
})
export class FormLayoutComponent {
  /** Título del formulario. Dice qué se está creando o editando. */
  readonly title = input.required<string>()
  /** Texto del botón principal: un verbo que dice qué pasa. */
  readonly submitLabel = input.required<string>()
  /** Texto del botón para salir sin guardar. Si no se pasa, no hay botón. */
  readonly cancelLabel = input<string>()
  /** El envío está en curso: bloquea el botón principal. */
  readonly submitting = input(false, { transform: booleanAttribute })
  /** Se emite al enviar el formulario, con el botón o con la tecla Intro. */
  readonly submit = output<void>()
  /** Se emite al pulsar el botón de cancelar. */
  readonly cancel = output<void>()
}

import { ChangeDetectionStrategy, Component, booleanAttribute, computed, input, model } from '@angular/core'
import type { FormValueControl } from '@angular/forms/signals'
import { IconComponent } from '../icon'

let nextId = 0

@Component({
  selector: 'robur-select',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [IconComponent],
  host: { class: 'flex flex-col gap-1.5' },
  template: `
    <label [attr.for]="selectId" class="text-control text-primary">{{ label() }}</label>
    <div class="relative">
      <select
        [id]="selectId"
        (change)="value.set($any($event.target).value)"
        [attr.name]="name() || null"
        [disabled]="disabled()"
        [required]="required()"
        [attr.aria-invalid]="error() ? true : null"
        [attr.aria-describedby]="message() ? messageId : null"
        [class]="classes()"
      >
        @if (placeholder() !== undefined) {
          <option value="" [selected]="value() === ''">{{ placeholder() }}</option>
        }
        @for (option of options(); track option.value) {
          <option [value]="option.value" [selected]="option.value === value()">{{ option.label }}</option>
        }
      </select>
      <span class="pointer-events-none absolute top-1/2 right-3.5 -translate-y-1/2 text-tertiary">
        <robur-icon name="chevron-down" />
      </span>
    </div>
    @if (message(); as text) {
      <p [id]="messageId" [class]="['text-sm', error() ? 'text-danger' : 'text-tertiary']">{{ text }}</p>
    }
  `,
})
// FormValueControl: el campo funciona con los formularios de señales de Angular (`[formField]`).
export class SelectComponent implements FormValueControl<string> {
  /** Texto visible que nombra el campo. Obligatorio: un campo sin etiqueta no es accesible. */
  readonly label = input.required<string>()
  /** Las opciones, en el orden en que se muestran. */
  readonly options = input.required<{ value: string; label: string }[]>()
  /** Texto de la opción vacía inicial. Si no se pasa, no hay opción vacía. */
  readonly placeholder = input<string>()
  /** Ayuda breve bajo el campo. */
  readonly hint = input<string>()
  /** Mensaje de error. Si existe, el campo se marca como inválido. */
  readonly error = input<string>()

  // Atributos nativos del <select>. Angular no los pasa solos al elemento de dentro: se declaran aquí.
  /** El valor elegido: `[(value)]` enlaza con el `value` del <select> nativo. */
  readonly value = model('')
  /** Atributo nativo `name` del campo. */
  readonly name = input('')
  /** Atributo nativo `disabled` del campo. */
  readonly disabled = input(false, { transform: booleanAttribute })
  /** Atributo nativo `required` del campo. */
  readonly required = input(false, { transform: booleanAttribute })

  /** @internal */
  protected readonly selectId = `robur-select-${nextId++}`
  /** @internal */
  protected readonly messageId = `${this.selectId}-message`
  /** @internal */
  protected readonly message = computed(() => this.error() ?? this.hint())

  /** @internal */
  protected readonly classes = computed(() =>
    [
      'min-h-11 w-full appearance-none rounded-md border bg-surface py-3.5 pr-11 pl-3.5 text-body text-primary shadow-sm',
      'focus:border-action focus:outline-none focus:ring-3 focus:ring-focus-ring/20',
      'disabled:cursor-not-allowed disabled:opacity-50',
      this.error() ? 'border-danger' : 'border-control',
    ].join(' '),
  )
}

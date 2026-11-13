import { ChangeDetectionStrategy, Component, booleanAttribute, computed, input, model } from '@angular/core'
import type { FormValueControl } from '@angular/forms/signals'

let nextId = 0

@Component({
  selector: 'robur-input',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'flex flex-col gap-1.5' },
  template: `
    <label [attr.for]="inputId" class="text-control text-primary">{{ label() }}</label>
    <input
      [id]="inputId"
      [type]="type()"
      [value]="value()"
      (input)="value.set($any($event.target).value)"
      [attr.name]="name() || null"
      [attr.placeholder]="placeholder() ?? null"
      [attr.autocomplete]="autocomplete() ?? null"
      [disabled]="disabled()"
      [readOnly]="readonly()"
      [required]="required()"
      [attr.inputmode]="numeric() ? 'decimal' : null"
      [attr.aria-invalid]="error() ? true : null"
      [attr.aria-describedby]="message() ? messageId : null"
      [class]="classes()"
    />
    @if (message(); as text) {
      <p [id]="messageId" [class]="['text-sm', error() ? 'text-danger' : 'text-tertiary']">{{ text }}</p>
    }
  `,
})
// FormValueControl: el campo funciona con los formularios de señales de Angular (`[formField]`).
export class InputComponent implements FormValueControl<string> {
  /** Texto visible que nombra el campo. Obligatorio: un campo sin etiqueta no es accesible. */
  readonly label = input.required<string>()
  /** Ayuda breve bajo el campo. */
  readonly hint = input<string>()
  /** Mensaje de error. Si existe, el campo se marca como inválido. */
  readonly error = input<string>()
  /** Campo de cifra de sesión: texto grande, alineado a la derecha y teclado numérico. */
  readonly numeric = input(false, { transform: booleanAttribute })

  // Atributos nativos del <input>. Angular no los pasa solos al elemento de dentro: se declaran aquí.
  /** El valor del campo: `[(value)]` enlaza con el `value` del <input> nativo. */
  readonly value = model('')
  /** Atributo nativo `type` del campo. */
  readonly type = input('text')
  /** Atributo nativo `name` del campo. */
  readonly name = input('')
  /** Atributo nativo `placeholder`: un ejemplo, nunca la etiqueta. */
  readonly placeholder = input<string>()
  /** Atributo nativo `autocomplete` del campo. */
  readonly autocomplete = input<string>()
  /** Atributo nativo `disabled` del campo. */
  readonly disabled = input(false, { transform: booleanAttribute })
  /** Atributo nativo `readonly` del campo. */
  readonly readonly = input(false, { transform: booleanAttribute })
  /** Atributo nativo `required` del campo. */
  readonly required = input(false, { transform: booleanAttribute })

  /** @internal */
  protected readonly inputId = `robur-input-${nextId++}`
  /** @internal */
  protected readonly messageId = `${this.inputId}-message`
  /** @internal */
  protected readonly message = computed(() => this.error() ?? this.hint())

  /** @internal */
  protected readonly classes = computed(() =>
    [
      'min-h-11 w-full rounded-md border bg-surface p-3.5 text-primary shadow-sm',
      'placeholder:text-tertiary',
      'focus:border-action focus:outline-none focus:ring-3 focus:ring-focus-ring/20',
      'disabled:cursor-not-allowed disabled:opacity-50',
      this.error() ? 'border-danger' : 'border-control',
      this.numeric() ? 'text-right text-h3 tabular-nums' : 'text-body',
    ].join(' '),
  )
}

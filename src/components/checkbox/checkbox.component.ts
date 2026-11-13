import { ChangeDetectionStrategy, Component, booleanAttribute, input, model } from '@angular/core'
import type { FormCheckboxControl } from '@angular/forms/signals'

let nextId = 0

@Component({
  selector: 'robur-checkbox',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'block' },
  template: `
    <label [attr.for]="inputId" class="flex min-h-11 cursor-pointer items-center gap-3">
      <span class="grid size-6 shrink-0 place-items-center">
        <input
          [id]="inputId"
          type="checkbox"
          [checked]="checked()"
          (change)="checked.set($any($event.target).checked)"
          [attr.name]="name() || null"
          [disabled]="disabled()"
          [attr.aria-labelledby]="labelId"
          [attr.aria-describedby]="hint() ? hintId : null"
          class="peer col-start-1 row-start-1 size-6 cursor-pointer appearance-none rounded-xs border border-control bg-surface checked:border-transparent checked:bg-action disabled:cursor-not-allowed disabled:opacity-50"
        />
        <svg
          aria-hidden="true"
          viewBox="0 0 16 16"
          fill="none"
          stroke="currentColor"
          stroke-width="2.5"
          stroke-linecap="round"
          stroke-linejoin="round"
          class="pointer-events-none col-start-1 row-start-1 hidden size-4 text-on-action peer-checked:block"
        >
          <path d="M3 8.5l3.5 3.5L13 5" />
        </svg>
      </span>
      <span class="flex flex-col">
        <span [id]="labelId" class="text-title text-primary">{{ label() }}</span>
        @if (hint(); as text) {
          <span [id]="hintId" class="text-sm text-secondary">{{ text }}</span>
        }
      </span>
    </label>
  `,
})
// FormCheckboxControl: la casilla funciona con los formularios de señales de Angular (`[formField]`).
export class CheckboxComponent implements FormCheckboxControl {
  /** Texto visible que nombra la casilla. Obligatorio: una casilla sin etiqueta no es accesible. */
  readonly label = input.required<string>()
  /** Detalle breve bajo la etiqueta. */
  readonly hint = input<string>()

  // Atributos nativos del <input>. Angular no los pasa solos al elemento de dentro: se declaran aquí.
  /** Si está marcada: `[(checked)]` enlaza con el `checked` del <input> nativo. */
  readonly checked = model(false)
  /** Atributo nativo `name` de la casilla. */
  readonly name = input('')
  /** Atributo nativo `disabled` de la casilla. */
  readonly disabled = input(false, { transform: booleanAttribute })

  /** @internal */
  protected readonly inputId = `robur-checkbox-${nextId++}`
  /** @internal */
  protected readonly labelId = `${this.inputId}-label`
  /** @internal */
  protected readonly hintId = `${this.inputId}-hint`
}

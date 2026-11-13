import { ChangeDetectionStrategy, Component, ElementRef, input, output, viewChild } from '@angular/core'

export interface Tab {
  value: string
  label: string
}

let nextId = 0

@Component({
  selector: 'robur-tabs',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'flex flex-col gap-4' },
  template: `
    <div #list role="tablist" [attr.aria-label]="label()" class="flex gap-1 rounded-pill bg-surface p-1" (keydown)="onKeydown($event)">
      @for (tab of tabs(); track tab.value) {
        <button
          [id]="id + '-tab-' + tab.value"
          type="button"
          role="tab"
          [attr.aria-selected]="tab.value === value()"
          [attr.aria-controls]="tab.value === value() ? id + '-panel' : null"
          [tabIndex]="tab.value === value() ? 0 : -1"
          [class]="'min-h-11 flex-1 rounded-pill px-4 text-control transition active:scale-95 ' + (tab.value === value() ? 'bg-selected text-on-selected' : 'text-tertiary')"
          (click)="change.emit(tab.value)"
        >
          {{ tab.label }}
        </button>
      }
    </div>
    <!-- Un change nativo del contenido (un campo, una casilla) no debe llegar a quien escucha la salida (change) de las pestañas. -->
    <div
      [id]="id + '-panel'"
      role="tabpanel"
      [attr.aria-labelledby]="id + '-tab-' + value()"
      tabindex="0"
      class="empty:hidden"
      (change)="$event.stopPropagation()"
    >
      <!-- Contenido de la pestaña activa. -->
      <ng-content />
    </div>
  `,
})
export class TabsComponent {
  /** Nombre del grupo de pestañas para lectores de pantalla. */
  readonly label = input.required<string>()
  /** Las pestañas, en orden. Entre dos y cuatro. */
  readonly tabs = input.required<Tab[]>()
  /** Valor de la pestaña activa. */
  readonly value = input.required<string>()
  /** Se emite con el valor de la pestaña elegida. */
  readonly change = output<string>()

  /** @internal */
  protected readonly id = `robur-tabs-${nextId++}`
  private readonly list = viewChild.required<ElementRef<HTMLElement>>('list')

  /**
   * Patrón de pestañas de WAI-ARIA: las flechas mueven el foco y la selección a la vez.
   * @internal
   */
  protected onKeydown(event: KeyboardEvent) {
    const tabs = this.tabs()
    const index = tabs.findIndex((tab) => tab.value === this.value())
    const moves: Record<string, number> = {
      ArrowRight: (index + 1) % tabs.length,
      ArrowLeft: (index - 1 + tabs.length) % tabs.length,
      Home: 0,
      End: tabs.length - 1,
    }
    const next = moves[event.key]
    if (next === undefined) return
    event.preventDefault()
    this.change.emit(tabs[next].value)
    this.list().nativeElement.querySelectorAll<HTMLElement>('[role="tab"]')[next]?.focus()
  }
}

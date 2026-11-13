import { ChangeDetectionStrategy, Component, ElementRef, afterRenderEffect, input, output, viewChild } from '@angular/core'

let nextId = 0

@Component({
  selector: 'robur-sheet',
  changeDetection: ChangeDetectionStrategy.OnPush,
  // La etiqueta <robur-sheet> no pinta caja propia: la hoja es el <dialog> de dentro.
  host: { class: 'contents' },
  template: `
    <dialog
      #dialog
      [attr.aria-labelledby]="titleId"
      class="fixed inset-x-0 top-auto bottom-0 m-0 mx-auto w-full max-w-120 rounded-t-xl bg-surface text-primary shadow-md backdrop:bg-overlay"
      (close)="close.emit()"
      (click)="$event.target === dialog && close.emit()"
    >
      <div class="p-5 pb-8">
        <div aria-hidden="true" class="mx-auto mb-2 w-9 rounded-pill border-t-4 border-default"></div>
        <div class="mb-3 flex items-center justify-between gap-3">
          <h2 [id]="titleId" class="text-h3">{{ title() }}</h2>
          <button
            type="button"
            aria-label="Cerrar"
            class="grid size-11 shrink-0 place-items-center rounded-pill text-tertiary transition active:scale-95"
            (click)="close.emit()"
          >
            <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" class="size-6">
              <path d="M6 6l12 12M18 6L6 18" />
            </svg>
          </button>
        </div>
        <!-- El contenido de la hoja. -->
        <ng-content />
      </div>
    </dialog>
  `,
})
export class SheetComponent {
  /** La hoja está abierta. */
  readonly open = input.required<boolean>()
  /** Título visible. Obligatorio: es el nombre de la hoja para lectores de pantalla. */
  readonly title = input.required<string>()
  /** Se emite cuando la persona cierra la hoja: botón, tecla Escape o toque fuera. */
  readonly close = output<void>()

  /** @internal */
  protected readonly titleId = `robur-sheet-${nextId++}-title`
  private readonly dialog = viewChild.required<ElementRef<HTMLDialogElement>>('dialog')

  constructor() {
    // <dialog> con showModal() ya atrapa el foco, cierra con Escape y devuelve el foco al cerrar.
    afterRenderEffect(() => {
      const element = this.dialog().nativeElement
      const open = this.open()
      if (open && !element.open) element.showModal()
      if (!open && element.open) element.close()
    })
  }
}

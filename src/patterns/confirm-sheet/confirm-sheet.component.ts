import { ChangeDetectionStrategy, Component, booleanAttribute, input, output } from '@angular/core'
import { ButtonComponent } from '../../components/button'
import { SheetComponent } from '../../components/sheet'

@Component({
  selector: 'robur-confirm-sheet',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ButtonComponent, SheetComponent],
  host: { class: 'contents' },
  template: `
    <robur-sheet [open]="open()" [title]="title()" (close)="cancel.emit()">
      <p class="text-body text-secondary">{{ description() }}</p>
      <div class="mt-6 flex flex-col gap-3">
        <robur-button variant="danger" fullWidth [loading]="loading()" (click)="confirm.emit()">{{ confirmLabel() }}</robur-button>
        <robur-button variant="secondary" fullWidth [disabled]="loading()" (click)="cancel.emit()">Cancelar</robur-button>
      </div>
    </robur-sheet>
  `,
})
export class ConfirmSheetComponent {
  /** La hoja está abierta. */
  readonly open = input.required<boolean>()
  /** Qué se va a hacer, como pregunta: «¿Borrar esta sesión?». */
  readonly title = input.required<string>()
  /** Una frase con lo que se pierde. */
  readonly description = input.required<string>()
  /** Texto del botón que confirma: el verbo de la acción («Borrar sesión»). */
  readonly confirmLabel = input.required<string>()
  /** La confirmación está en curso: bloquea los botones. */
  readonly loading = input(false, { transform: booleanAttribute })
  /** Se emite al confirmar. */
  readonly confirm = output<void>()
  /** Se emite al cancelar o al cerrar la hoja. */
  readonly cancel = output<void>()
}

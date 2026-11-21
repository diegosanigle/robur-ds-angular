import { Component, input, output } from '@angular/core';
import { ConfirmSheetComponent } from 'robur-ds';

@Component({
  selector: 'app-delete-session-sheet',
  standalone: true,
  imports: [ConfirmSheetComponent],
  template: `
    <robur-confirm-sheet
      [open]="open()"
      [loading]="loading()"
      title="¿Borrar esta sesión?"
      description="Se perderán sus ejercicios y cifras. No se puede recuperar."
      confirmLabel="Borrar sesión"
      (confirm)="confirmed.emit()"
      (cancel)="cancelled.emit()"
    />
  `,
})
export class DeleteSessionSheetComponent {
  readonly open = input.required<boolean>();
  readonly loading = input<boolean>(false);
  readonly confirmed = output<void>();
  readonly cancelled = output<void>();
}

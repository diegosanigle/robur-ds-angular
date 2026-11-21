import { Component, signal } from '@angular/core';
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
      description="Se pierden los ejercicios y las cifras que registraste en ella."
      confirmLabel="Borrar sesión"
      (confirm)="onConfirm()"
      (cancel)="onCancel()"
    />
  `,
})
export class DeleteSessionSheetComponent {
  readonly open = signal(true);
  readonly loading = signal(false);

  onConfirm(): void {
    this.loading.set(true);
    // Aquí va la llamada que borra la sesión.
    this.loading.set(false);
    this.open.set(false);
  }

  onCancel(): void {
    this.open.set(false);
  }
}

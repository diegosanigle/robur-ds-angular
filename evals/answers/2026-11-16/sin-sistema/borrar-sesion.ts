import {
  ChangeDetectionStrategy,
  Component,
  HostListener,
  input,
  output,
} from '@angular/core';

@Component({
  selector: 'app-confirm-delete-session-sheet',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (open()) {
      <div class="fixed inset-0 z-50 flex items-end justify-center">
        <div
          class="absolute inset-0 bg-black/60"
          aria-hidden="true"
          (click)="cancelled.emit()"
        ></div>

        <section
          role="alertdialog"
          aria-modal="true"
          aria-labelledby="delete-session-title"
          aria-describedby="delete-session-desc"
          class="relative w-full max-w-md rounded-t-2xl bg-white p-6 shadow-xl dark:bg-neutral-900"
        >
          <div class="mx-auto mb-4 h-1 w-10 rounded-full bg-neutral-300 dark:bg-neutral-700"></div>

          <h2
            id="delete-session-title"
            class="text-lg font-semibold text-neutral-900 dark:text-neutral-50"
          >
            ¿Borrar esta sesión?
          </h2>

          <p
            id="delete-session-desc"
            class="mt-2 text-sm text-neutral-600 dark:text-neutral-300"
          >
            @if (sessionName()) {
              Se eliminará «<strong>{{ sessionName() }}</strong>» de tu historial.
            } @else {
              Se eliminará la sesión de tu historial.
            }
            Esta acción no se puede deshacer.
          </p>

          <div class="mt-6 flex flex-col gap-3">
            <button
              type="button"
              class="w-full rounded-xl bg-red-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-red-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-400 focus-visible:ring-offset-2 disabled:opacity-50"
              [disabled]="busy()"
              (click)="confirmed.emit()"
            >
              {{ busy() ? 'Borrando…' : 'Borrar sesión' }}
            </button>
            <button
              type="button"
              class="w-full rounded-xl border border-neutral-300 px-4 py-3 text-sm font-semibold text-neutral-800 transition hover:bg-neutral-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-neutral-400 focus-visible:ring-offset-2 dark:border-neutral-700 dark:text-neutral-100 dark:hover:bg-neutral-800"
              [disabled]="busy()"
              (click)="cancelled.emit()"
            >
              Cancelar
            </button>
          </div>
        </section>
      </div>
    }
  `,
})
export class ConfirmDeleteSessionSheetComponent {
  readonly open = input(false);
  readonly sessionName = input<string | null>(null);
  readonly busy = input(false);

  readonly confirmed = output<void>();
  readonly cancelled = output<void>();

  @HostListener('document:keydown.escape')
  onEscape(): void {
    if (this.open() && !this.busy()) {
      this.cancelled.emit();
    }
  }
}

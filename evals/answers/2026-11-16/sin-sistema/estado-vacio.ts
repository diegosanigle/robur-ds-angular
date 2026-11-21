import { ChangeDetectionStrategy, Component, output } from '@angular/core';

@Component({
  selector: 'app-historial-vacio',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section
      class="flex flex-col items-center justify-center gap-4 px-6 py-12 text-center"
      role="status"
      aria-live="polite"
    >
      <div
        class="flex h-16 w-16 items-center justify-center rounded-full bg-neutral-100 text-neutral-500"
        aria-hidden="true"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="1.8"
          stroke-linecap="round"
          stroke-linejoin="round"
          class="h-8 w-8"
        >
          <rect x="3" y="5" width="18" height="16" rx="2" />
          <path d="M16 3v4M8 3v4M3 11h18" />
        </svg>
      </div>

      <div class="flex flex-col gap-1">
        <h2 class="text-lg font-semibold text-neutral-900">
          Aún no hay sesiones esta semana
        </h2>
        <p class="max-w-xs text-sm text-neutral-600">
          Registra tu primer entrenamiento y empieza a construir tu racha.
        </p>
      </div>

      <button
        type="button"
        class="inline-flex items-center justify-center rounded-lg bg-neutral-900 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-neutral-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-900"
        (click)="registrar.emit()"
      >
        Registrar sesión
      </button>
    </section>
  `,
})
export class HistorialVacioComponent {
  readonly registrar = output<void>();
}

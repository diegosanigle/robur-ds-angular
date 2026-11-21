import { ChangeDetectionStrategy, Component, computed, output, signal } from '@angular/core';

type DayType = 'empuje' | 'tiron' | 'pierna' | 'cuerpo-completo';

interface Exercise {
  id: string;
  name: string;
  detail: string;
}

interface DayOption {
  id: DayType;
  label: string;
  exercises: Exercise[];
}

export interface SessionLog {
  date: string;
  dayType: DayType;
  completedExerciseIds: string[];
}

@Component({
  selector: 'app-log-session',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <form
      class="mx-auto flex max-w-md flex-col gap-6 p-4"
      (submit)="save($event)"
      aria-labelledby="log-title"
    >
      <header class="flex flex-col gap-1">
        <h1 id="log-title" class="text-2xl font-bold">Sesión de hoy</h1>
        <p class="text-sm text-gray-500">{{ today }}</p>
      </header>

      <fieldset class="flex flex-col gap-3">
        <legend class="mb-1 text-sm font-semibold uppercase tracking-wide text-gray-600">
          Tipo de día
        </legend>
        <div class="grid grid-cols-2 gap-2">
          @for (day of days; track day.id) {
            <button
              type="button"
              class="rounded-xl border px-3 py-3 text-sm font-medium transition focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
              [class.bg-black]="selectedDay()?.id === day.id"
              [class.text-white]="selectedDay()?.id === day.id"
              [class.border-black]="selectedDay()?.id === day.id"
              [class.border-gray-300]="selectedDay()?.id !== day.id"
              [attr.aria-pressed]="selectedDay()?.id === day.id"
              (click)="selectDay(day)"
            >
              {{ day.label }}
            </button>
          }
        </div>
      </fieldset>

      @if (selectedDay(); as day) {
        <fieldset class="flex flex-col gap-2">
          <legend class="mb-1 flex w-full items-center justify-between text-sm font-semibold uppercase tracking-wide text-gray-600">
            <span>Ejercicios</span>
            <span class="font-normal normal-case text-gray-500">
              {{ completedCount() }} / {{ day.exercises.length }}
            </span>
          </legend>

          <div
            class="h-2 w-full overflow-hidden rounded-full bg-gray-200"
            role="progressbar"
            aria-label="Progreso de la sesión"
            [attr.aria-valuenow]="progress()"
            aria-valuemin="0"
            aria-valuemax="100"
          >
            <div class="h-full bg-green-600 transition-all" [style.width.%]="progress()"></div>
          </div>

          <ul class="mt-2 flex flex-col gap-2">
            @for (ex of day.exercises; track ex.id) {
              <li>
                <label
                  class="flex cursor-pointer items-center gap-3 rounded-xl border border-gray-300 p-3 has-[:checked]:border-green-600 has-[:checked]:bg-green-50"
                >
                  <input
                    type="checkbox"
                    class="h-5 w-5 accent-green-600"
                    [checked]="isDone(ex.id)"
                    (change)="toggle(ex.id)"
                  />
                  <span class="flex flex-col">
                    <span class="font-medium" [class.line-through]="isDone(ex.id)">{{ ex.name }}</span>
                    <span class="text-xs text-gray-500">{{ ex.detail }}</span>
                  </span>
                </label>
              </li>
            }
          </ul>
        </fieldset>
      }

      @if (saved()) {
        <p role="status" class="rounded-lg bg-green-50 p-3 text-sm text-green-800">
          Sesión guardada. ¡Buen trabajo!
        </p>
      }

      <button
        type="submit"
        class="rounded-xl bg-black px-4 py-3 font-semibold text-white disabled:cursor-not-allowed disabled:opacity-40"
        [disabled]="!canSave()"
      >
        Guardar sesión
      </button>
    </form>
  `,
})
export class LogSessionComponent {
  readonly sessionSaved = output<SessionLog>();

  readonly today = new Date().toLocaleDateString('es-ES', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  });

  readonly days: DayOption[] = [
    {
      id: 'empuje',
      label: 'Empuje',
      exercises: [
        { id: 'flexiones', name: 'Flexiones', detail: '4 × 12' },
        { id: 'fondos', name: 'Fondos en silla', detail: '3 × 10' },
        { id: 'pike', name: 'Flexiones pike', detail: '3 × 8' },
        { id: 'plancha-hombro', name: 'Toques de hombro en plancha', detail: '3 × 20' },
      ],
    },
    {
      id: 'tiron',
      label: 'Tirón',
      exercises: [
        { id: 'remo-mesa', name: 'Remo invertido', detail: '4 × 10' },
        { id: 'superman', name: 'Superman', detail: '3 × 15' },
        { id: 'curl-toalla', name: 'Curl con toalla', detail: '3 × 12' },
        { id: 'dominadas', name: 'Dominadas / negativas', detail: '3 × 5' },
      ],
    },
    {
      id: 'pierna',
      label: 'Pierna',
      exercises: [
        { id: 'sentadillas', name: 'Sentadillas', detail: '4 × 15' },
        { id: 'zancadas', name: 'Zancadas', detail: '3 × 12 por pierna' },
        { id: 'puente-gluteo', name: 'Puente de glúteo', detail: '3 × 15' },
        { id: 'gemelos', name: 'Elevación de gemelos', detail: '4 × 20' },
      ],
    },
    {
      id: 'cuerpo-completo',
      label: 'Cuerpo completo',
      exercises: [
        { id: 'burpees', name: 'Burpees', detail: '4 × 10' },
        { id: 'mountain', name: 'Mountain climbers', detail: '3 × 30 s' },
        { id: 'plancha', name: 'Plancha', detail: '3 × 45 s' },
        { id: 'sentadilla-salto', name: 'Sentadilla con salto', detail: '3 × 12' },
      ],
    },
  ];

  readonly selectedDay = signal<DayOption | null>(null);
  readonly done = signal<ReadonlySet<string>>(new Set());
  readonly saved = signal(false);

  readonly completedCount = computed(() => this.done().size);
  readonly progress = computed(() => {
    const total = this.selectedDay()?.exercises.length ?? 0;
    return total ? Math.round((this.done().size / total) * 100) : 0;
  });
  readonly canSave = computed(() => !!this.selectedDay() && this.done().size > 0);

  selectDay(day: DayOption): void {
    if (this.selectedDay()?.id === day.id) return;
    this.selectedDay.set(day);
    this.done.set(new Set());
    this.saved.set(false);
  }

  isDone(id: string): boolean {
    return this.done().has(id);
  }

  toggle(id: string): void {
    const next = new Set(this.done());
    if (!next.delete(id)) next.add(id);
    this.done.set(next);
    this.saved.set(false);
  }

  save(event: Event): void {
    event.preventDefault();
    const day = this.selectedDay();
    if (!day || !this.canSave()) return;

    this.sessionSaved.emit({
      date: new Date().toISOString(),
      dayType: day.id,
      completedExerciseIds: day.exercises.filter((e) => this.done().has(e.id)).map((e) => e.id),
    });
    this.saved.set(true);
  }
}

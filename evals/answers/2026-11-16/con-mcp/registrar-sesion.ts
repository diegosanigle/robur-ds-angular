import { Component, signal } from '@angular/core';
import { SessionLogComponent } from 'robur-ds';

interface Exercise {
  id: string;
  name: string;
  target: string;
  completed: boolean;
}

@Component({
  selector: 'app-log-session',
  standalone: true,
  imports: [SessionLogComponent],
  template: `
    <main class="bg-page min-h-screen p-4">
      <robur-session-log
        [dayTypes]="dayTypes"
        [dayType]="dayType()"
        (dayTypeChange)="selectDayType($event)"
        [exercises]="exercises()"
        (exerciseChange)="toggleExercise($event)"
        [saving]="saving()"
        (save)="save()"
      />
    </main>
  `,
})
export class LogSessionComponent {
  readonly dayTypes = ['Empuje', 'Tirón', 'Pierna', 'Descanso activo'];

  private readonly plan: Record<string, Exercise[]> = {
    Empuje: [
      { id: 'flexiones', name: 'Flexiones', target: '3 series × 12 reps', completed: false },
      { id: 'fondos', name: 'Fondos en silla', target: '3 series × 10 reps', completed: false },
    ],
    Tirón: [
      { id: 'remo', name: 'Remo con mochila', target: '3 series × 12 reps', completed: false },
      { id: 'dominadas', name: 'Dominadas asistidas', target: '3 series × 8 reps', completed: false },
    ],
    Pierna: [
      { id: 'sentadillas', name: 'Sentadillas', target: '4 series × 15 reps', completed: false },
      { id: 'zancadas', name: 'Zancadas', target: '3 series × 12 reps', completed: false },
    ],
    'Descanso activo': [
      { id: 'movilidad', name: 'Movilidad', target: '10 min', completed: false },
    ],
  };

  readonly dayType = signal(this.dayTypes[0]);
  readonly exercises = signal<Exercise[]>(this.plan[this.dayTypes[0]]);
  readonly saving = signal(false);

  selectDayType(type: string): void {
    this.dayType.set(type);
    this.exercises.set(this.plan[type].map((e) => ({ ...e, completed: false })));
  }

  toggleExercise(event: { id: string; completed: boolean }): void {
    this.exercises.update((list) =>
      list.map((e) => (e.id === event.id ? { ...e, completed: event.completed } : e)),
    );
  }

  save(): void {
    this.saving.set(true);
    setTimeout(() => this.saving.set(false), 600);
  }
}

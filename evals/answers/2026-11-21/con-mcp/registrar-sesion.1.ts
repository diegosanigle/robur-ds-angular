import { Component, signal } from '@angular/core';
import { SessionLogComponent } from 'robur-ds';

interface Exercise {
  id: string;
  name: string;
  target?: string;
  completed: boolean;
}

@Component({
  selector: 'app-log-session',
  standalone: true,
  imports: [SessionLogComponent],
  template: `
    <robur-session-log
      [dayTypes]="dayTypes"
      [dayType]="dayType()"
      (dayTypeChange)="selectDayType($event)"
      [exercises]="exercises()"
      (exerciseChange)="toggleExercise($event)"
      [saving]="saving()"
      (save)="save()"
    />
  `,
})
export class LogSessionComponent {
  readonly dayTypes = ['Empuje', 'Tirón', 'Pierna'];
  private readonly plan: Record<string, Exercise[]> = {
    Empuje: [
      { id: 'press-banca', name: 'Press de banca', target: '3 series × 10 reps', completed: false },
      { id: 'fondos', name: 'Fondos', target: '3 series × 12 reps', completed: false },
    ],
    Tirón: [
      { id: 'dominadas', name: 'Dominadas', target: '3 series × 8 reps', completed: false },
      { id: 'remo', name: 'Remo con mancuerna', target: '3 series × 10 reps', completed: false },
    ],
    Pierna: [
      { id: 'sentadilla', name: 'Sentadilla', target: '4 series × 10 reps', completed: false },
      { id: 'zancadas', name: 'Zancadas', target: '3 series × 12 reps', completed: false },
    ],
  };

  readonly dayType = signal('Empuje');
  readonly exercises = signal<Exercise[]>(this.plan['Empuje']);
  readonly saving = signal(false);

  selectDayType(type: string) {
    this.dayType.set(type);
    this.exercises.set(this.plan[type].map((e) => ({ ...e, completed: false })));
  }

  toggleExercise(change: { id: string; completed: boolean }) {
    this.exercises.update((list) =>
      list.map((e) => (e.id === change.id ? { ...e, completed: change.completed } : e)),
    );
  }

  save() {
    this.saving.set(true);
    setTimeout(() => this.saving.set(false), 600);
  }
}

import { Component, signal } from '@angular/core';
import { ChipComponent } from 'robur-ds';

@Component({
  selector: 'app-day-type-picker',
  standalone: true,
  imports: [ChipComponent],
  template: `
    <div role="group" aria-label="Tipo de día" class="flex flex-wrap gap-2">
      @for (type of dayTypes; track type) {
        <robur-chip [selected]="dayType() === type" (click)="dayType.set(type)">{{ type }}</robur-chip>
      }
    </div>
  `,
})
export class DayTypePickerComponent {
  readonly dayTypes = ['Empuje', 'Tirón', 'Pierna'];
  readonly dayType = signal('Empuje');
}

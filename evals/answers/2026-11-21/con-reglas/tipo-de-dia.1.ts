import { ChangeDetectionStrategy, Component, model } from '@angular/core';
import { ChipComponent } from 'robur-ds';

type DayType = 'empuje' | 'tiron' | 'pierna';

@Component({
  selector: 'app-day-type-picker',
  standalone: true,
  imports: [ChipComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="flex flex-col gap-2">
      <span id="day-type-label" class="text-label text-secondary">Tipo de día</span>
      <div class="flex flex-wrap gap-2" role="radiogroup" aria-labelledby="day-type-label">
        @for (option of options; track option.value) {
          <robur-chip
            role="radio"
            [selected]="value() === option.value"
            [attr.aria-checked]="value() === option.value"
            (click)="value.set(option.value)"
          >
            {{ option.label }}
          </robur-chip>
        }
      </div>
    </div>
  `,
})
export class DayTypePickerComponent {
  /** Tipo de día elegido; vacío hasta que se elige uno. */
  readonly value = model<DayType | null>(null);

  /** @internal */
  protected readonly options: { value: DayType; label: string }[] = [
    { value: 'empuje', label: 'Empuje' },
    { value: 'tiron', label: 'Tirón' },
    { value: 'pierna', label: 'Pierna' },
  ];
}

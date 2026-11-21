import { ChangeDetectionStrategy, Component, model } from '@angular/core';

export type DayType = 'empuje' | 'tiron' | 'pierna';

interface DayTypeOption {
  readonly value: DayType;
  readonly label: string;
}

@Component({
  selector: 'app-day-type-selector',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div
      role="radiogroup"
      aria-label="Tipo de día"
      class="inline-flex w-full gap-1 rounded-xl bg-neutral-100 p-1 dark:bg-neutral-800"
    >
      @for (option of options; track option.value; let i = $index) {
        <button
          type="button"
          role="radio"
          class="flex-1 rounded-lg px-4 py-2 text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
          [class]="
            value() === option.value
              ? 'bg-white text-neutral-900 shadow dark:bg-neutral-700 dark:text-white'
              : 'text-neutral-600 hover:text-neutral-900 dark:text-neutral-300 dark:hover:text-white'
          "
          [attr.aria-checked]="value() === option.value"
          [attr.tabindex]="isTabStop(option.value) ? 0 : -1"
          (click)="select(option.value)"
          (keydown)="onKeydown($event, i)"
        >
          {{ option.label }}
        </button>
      }
    </div>
  `,
})
export class DayTypeSelectorComponent {
  /** Valor seleccionado; admite two-way binding: [(value)]="dayType" */
  readonly value = model<DayType | null>(null);

  protected readonly options: readonly DayTypeOption[] = [
    { value: 'empuje', label: 'Empuje' },
    { value: 'tiron', label: 'Tirón' },
    { value: 'pierna', label: 'Pierna' },
  ];

  protected select(value: DayType): void {
    this.value.set(value);
  }

  protected isTabStop(value: DayType): boolean {
    const current = this.value();
    return current === null ? value === this.options[0].value : current === value;
  }

  protected onKeydown(event: KeyboardEvent, index: number): void {
    const last = this.options.length - 1;
    let next: number;

    switch (event.key) {
      case 'ArrowRight':
      case 'ArrowDown':
        next = index === last ? 0 : index + 1;
        break;
      case 'ArrowLeft':
      case 'ArrowUp':
        next = index === 0 ? last : index - 1;
        break;
      case 'Home':
        next = 0;
        break;
      case 'End':
        next = last;
        break;
      default:
        return;
    }

    event.preventDefault();
    this.select(this.options[next].value);
    const buttons = (event.currentTarget as HTMLElement).parentElement?.querySelectorAll<HTMLElement>('[role="radio"]');
    buttons?.[next]?.focus();
  }
}

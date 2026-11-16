import { ChangeDetectionStrategy, Component, input } from '@angular/core'
import { IconComponent } from '../icon'

@Component({
  selector: 'robur-week-strip',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [IconComponent],
  host: { class: 'block' },
  template: `
    <ul class="flex justify-between">
      @for (day of days(); track day.name) {
        <li class="flex flex-col items-center gap-2">
          <span class="sr-only">{{ day.name }}{{ day.done ? ', con sesión' : '' }}{{ day.current ? ', hoy' : '' }}</span>
          <span
            aria-hidden="true"
            [class]="
              [
                'flex size-9 items-center justify-center rounded-pill',
                day.done ? 'bg-data-1 text-on-action' : 'border-2 border-inverse',
                day.current ? 'outline-2 outline-offset-2 outline-data-1' : '',
              ].join(' ')
            "
          >
            @if (day.done) {
              <robur-icon name="check" />
            }
          </span>
          <span aria-hidden="true" [class]="'text-label ' + (day.current ? 'text-on-inverse' : 'text-on-inverse-muted')">{{ day.label }}</span>
        </li>
      }
    </ul>
  `,
})
export class WeekStripComponent {
  /** Los siete días de la semana, de lunes a domingo. */
  readonly days = input.required<{ label: string; name: string; done?: boolean; current?: boolean }[]>()
}

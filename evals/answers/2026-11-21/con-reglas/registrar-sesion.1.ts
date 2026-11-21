import { ChangeDetectionStrategy, Component } from '@angular/core';
import { SessionLogComponent } from 'robur-ds';

@Component({
  selector: 'app-today-session',
  standalone: true,
  imports: [SessionLogComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <main class="flex flex-col gap-4 p-4">
      <robur-session-log />
    </main>
  `,
})
export class TodaySessionComponent {}

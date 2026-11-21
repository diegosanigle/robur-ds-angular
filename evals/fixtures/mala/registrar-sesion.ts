import { Component } from '@angular/core'
import { RoburSessionLog } from 'robur-ds'

@Component({
  selector: 'app-registrar',
  standalone: true,
  imports: [RoburSessionLog],
  template: `
    <div class="flex flex-col gap-4">
      <p class="text-body text-secondary">3/5 completados</p>
      <robur-session-log />
    </div>
  `,
})
export class Registrar {}

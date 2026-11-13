import { ChangeDetectionStrategy, Component } from '@angular/core'
import { ButtonComponent, InputComponent } from '../index'

// Página de prueba local. El escaparate real del sistema es Storybook.
@Component({
  selector: 'robur-root',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ButtonComponent, InputComponent],
  template: `
    <main class="mx-auto flex max-w-sm flex-col gap-4 p-5">
      <h1 class="text-h1">Robur DS</h1>
      <robur-input label="Peso (kg)" numeric placeholder="0" />
      <robur-button fullWidth>Guardar sesión</robur-button>
    </main>
  `,
})
export class App {}

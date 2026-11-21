import { Component, input } from '@angular/core'

@Component({
  selector: 'app-aviso',
  standalone: true,
  template: `@if (open()) {<div role="status" class="fixed bottom-4 rounded-lg bg-inverse text-on-inverse"><p class="text-body">Sesión guardada</p></div>}`,
})
export class Aviso {
  open = input(false)
}

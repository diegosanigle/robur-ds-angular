import { NgComponentOutlet } from '@angular/common'
import { ChangeDetectionStrategy, Component, input } from '@angular/core'
import type { Type } from '@angular/core'

export interface NavItem {
  value: string
  label: string
  href: string
  /** Un icono es un componente que pinta un SVG. */
  icon: Type<unknown>
}

@Component({
  selector: 'robur-bottom-nav',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgComponentOutlet],
  host: { class: 'block' },
  template: `
    <nav [attr.aria-label]="label()" class="flex justify-between bg-surface px-4 py-2 shadow-sm">
      @for (item of items(); track item.value) {
        <a
          [href]="item.href"
          [attr.aria-current]="item.value === value() ? 'page' : null"
          [class]="'flex min-h-11 min-w-11 flex-col items-center justify-center gap-1 rounded-md px-3 py-1.5 text-label transition active:scale-95 ' + (item.value === value() ? 'bg-page text-primary' : 'text-tertiary')"
        >
          <span aria-hidden="true" class="size-6"><ng-container *ngComponentOutlet="item.icon" /></span>
          {{ item.label }}
        </a>
      }
    </nav>
  `,
})
export class BottomNavComponent {
  /** Nombre de la navegación para lectores de pantalla. */
  readonly label = input('Principal')
  /** Las secciones, en orden. Máximo cinco. */
  readonly items = input.required<NavItem[]>()
  /** Valor de la sección en la que está la persona. */
  readonly value = input.required<string>()
}

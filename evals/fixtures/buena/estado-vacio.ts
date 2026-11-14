import { ChangeDetectionStrategy, Component, output } from '@angular/core'
import { EmptyStateComponent } from 'robur-ds'

@Component({
  selector: 'app-sin-sesiones',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [EmptyStateComponent],
  template: `
    <robur-empty-state
      title="Aún no hay sesiones esta semana"
      description="Cuando registres una, aparecerá aquí."
      actionLabel="Registrar sesión"
      (action)="add.emit()"
    />
  `,
})
export class SinSesionesComponent {
  readonly add = output<void>()
}

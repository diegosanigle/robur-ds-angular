import { Component } from '@angular/core';
import { EmptyStateComponent } from 'robur-ds';

@Component({
  selector: 'app-history-empty-week',
  standalone: true,
  imports: [EmptyStateComponent],
  template: `
    <robur-empty-state
      title="Aún no hay sesiones esta semana"
      description="Aquí verás tus sesiones de los últimos siete días. Registra una para empezar."
      actionLabel="Registrar sesión"
      (action)="registerSession()"
    />
  `,
})
export class HistoryEmptyWeekComponent {
  registerSession(): void {
    // Navegar o abrir el registro de sesión
  }
}

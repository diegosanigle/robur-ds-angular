import { Component } from '@angular/core';
import { EmptyStateComponent } from 'robur-ds';

@Component({
  selector: 'app-history-empty',
  standalone: true,
  imports: [EmptyStateComponent],
  template: `
    <robur-empty-state
      title="Aún no hay sesiones esta semana"
      description="Aquí verás tus sesiones de los últimos siete días. Registra la primera para empezar."
      actionLabel="Registrar sesión"
      (action)="registerSession()"
    />
  `,
})
export class HistoryEmptyComponent {
  registerSession(): void {
    // Navega o abre el registro de sesión.
  }
}

import { ChangeDetectionStrategy, Component, input, output } from '@angular/core'
import { CardComponent } from '../../components/card'
import { StatCardComponent } from '../../components/stat-card'
import { TabsComponent } from '../../components/tabs'
import { EmptyStateComponent } from '../../patterns/empty-state'

const PERIODS = [
  { value: 'semana', label: 'Semana' },
  { value: 'mes', label: 'Mes' },
  { value: 'ano', label: 'Año' },
]

export interface HistorySummary {
  sessions: string
  volume: string
  maxWeight: string
}

export interface HistorySession {
  id: string
  date: string
  dayType: string
  detail: string
}

@Component({
  selector: 'robur-history',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CardComponent, StatCardComponent, TabsComponent, EmptyStateComponent],
  host: { class: 'block' },
  template: `
    <main class="mx-auto flex max-w-120 flex-col gap-8 px-5 py-6">
      <h1 class="text-h1 text-primary">Historial</h1>
      <robur-tabs label="Periodo" [tabs]="periods" [value]="period()" (change)="periodChange.emit($event)">
        <div class="flex flex-col gap-8">
          <div class="grid grid-cols-2 gap-4">
            <div class="col-span-2">
              <robur-stat-card variant="inverse" label="Sesiones" [value]="summary().sessions" />
            </div>
            <robur-stat-card label="Volumen" [value]="summary().volume" unit="kg" />
            <robur-stat-card label="Peso máximo" [value]="summary().maxWeight" unit="kg" />
          </div>
          @if (sessions().length) {
            <ul class="flex flex-col gap-4">
              @for (session of sessions(); track session.id) {
                <li>
                  <robur-card>
                    <p class="text-label uppercase text-tertiary">{{ session.date }}</p>
                    <p class="mt-1 text-title">{{ session.dayType }}</p>
                    <p class="text-sm text-secondary">{{ session.detail }}</p>
                  </robur-card>
                </li>
              }
            </ul>
          } @else {
            <robur-empty-state
              title="Aún no hay sesiones en este periodo"
              description="Cuando registres una, aparecerá aquí."
              actionLabel="Registrar sesión"
              (action)="logSession.emit()"
            />
          }
        </div>
      </robur-tabs>
    </main>
  `,
})
export class HistoryComponent {
  /** Periodo que se está viendo. */
  readonly period = input.required<string>()
  /** Las tres cifras del periodo, ya formateadas. */
  readonly summary = input.required<HistorySummary>()
  /** Las sesiones del periodo, de la más reciente a la más antigua. */
  readonly sessions = input.required<HistorySession[]>()
  /** Se emite con el periodo elegido. */
  readonly periodChange = output<string>()
  /** Se emite al pulsar la acción del estado vacío. */
  readonly logSession = output<void>()

  /** @internal */
  protected readonly periods = PERIODS
}

import { ChangeDetectionStrategy, Component } from '@angular/core'
import history from '../../metrics/history.json'
import metrics from '../../metrics/latest.json'
import { CardComponent, StatCardComponent } from '..'

type App = null | { files: number; filesUsingSystem: number; rawControls: number; classesOutsideSystem: number; hexColors: number; arbitraryValues: number }

// La última medición del sistema, pintada con sus propios componentes. Ningún número se escribe a mano.
@Component({
  selector: 'robur-metrics-view',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CardComponent, StatCardComponent],
  host: { class: 'flex max-w-240 flex-col gap-8' },
  template: `
    <p class="text-sm text-tertiary">Medición del {{ metrics.date }}</p>
    <section [class]="section">
      <h2 class="text-h3 text-primary">Tamaño del sistema</h2>
      <div [class]="grid">
        <robur-stat-card variant="inverse" label="Componentes" [value]="number(metrics.system.components)" />
        <robur-stat-card label="Patrones" [value]="number(metrics.system.patterns)" />
        <robur-stat-card label="Tokens semánticos" [value]="number(metrics.system.semanticTokens)" />
        <robur-stat-card label="Stories con test" [value]="number(metrics.system.stories)" />
      </div>
    </section>
    <section [class]="section">
      <h2 class="text-h3 text-primary">Coherencia</h2>
      <div [class]="grid">
        <robur-stat-card label="Piezas con contrato" [value]="number(metrics.coverage.contracts)" unit="%" />
        <robur-stat-card label="Props documentadas" [value]="number(metrics.coverage.documentedProps)" unit="%" />
        <robur-stat-card label="Paridad con Figma" [value]="number(metrics.coverage.figmaParity)" unit="%" />
        <robur-stat-card label="Antigüedad de la foto de Figma" [value]="number(metrics.coverage.figmaSnapshotAgeDays)" unit="días" />
      </div>
    </section>
    <section [class]="section">
      <h2 class="text-h3 text-primary">Accesibilidad</h2>
      <div [class]="grid">
        <robur-stat-card label="Parejas de contraste comprobadas" [value]="number(metrics.accessibility.contrastPairs)" />
        <robur-stat-card label="Margen de la pareja más justa" [value]="number(metrics.accessibility.tightestPair.margin)" unit="×" />
      </div>
    </section>
    <section [class]="section">
      <h2 class="text-h3 text-primary">Evals: ¿usa bien el agente el sistema?</h2>
      <div [class]="grid">
        @if (evals) {
          @for (e of evals; track e.name) {
            <robur-stat-card [label]="e.name" [value]="number(e.rate)" unit="%" />
          }
        } @else {
          <div class="col-span-2">
            <robur-card>
              <p class="text-title">Aún no se han ejecutado</p>
              <p class="text-sm text-secondary">Se ejecutan con npm run evals y aparecen aquí en la siguiente medición.</p>
            </robur-card>
          </div>
        }
      </div>
    </section>
    @if (app; as app) {
      <section [class]="section">
        <h2 class="text-h3 text-primary">La app: interfaz que sigue fuera del sistema</h2>
        <div [class]="grid">
          <robur-stat-card label="Ficheros que usan el sistema" [value]="number(app.filesUsingSystem) + ' de ' + number(app.files)" />
          <robur-stat-card label="Controles dibujados a mano" [value]="number(app.rawControls)" />
          <robur-stat-card label="Clases fuera del sistema" [value]="number(app.classesOutsideSystem)" />
          <robur-stat-card label="Colores y valores a mano" [value]="number(app.hexColors + app.arbitraryValues)" />
        </div>
      </section>
    }
    <section [class]="section">
      <h2 class="text-h3 text-primary">Historial</h2>
      <robur-card>
        <table class="w-full text-left text-sm">
          <thead>
            <tr class="text-tertiary">
              <th class="pb-2 font-semibold">Fecha</th>
              <th class="pb-2 font-semibold">Componentes</th>
              <th class="pb-2 font-semibold">Stories</th>
              <th class="pb-2 font-semibold">Paridad</th>
              <th class="pb-2 font-semibold">Evals con MCP</th>
              <th class="pb-2 font-semibold">Controles a mano en la app</th>
            </tr>
          </thead>
          <tbody class="tabular-nums">
            @for (row of history; track row.date) {
              <tr>
                <td class="py-1">{{ row.date }}</td>
                <td>{{ number(row.components) }}</td>
                <td>{{ number(row.stories) }}</td>
                <td>{{ number(row.figmaParity) }} %</td>
                <td>{{ row.evalsWithMcp === null ? '—' : row.evalsWithMcp + ' %' }}</td>
                <td>{{ number(row.appRawControls) }}</td>
              </tr>
            }
          </tbody>
        </table>
      </robur-card>
    </section>
  `,
})
export class MetricsViewComponent {
  protected readonly metrics = metrics
  protected readonly history = history as { date: string; components: number; stories: number; figmaParity: number; evalsWithMcp: number | null; appRawControls: number | null }[]
  protected readonly section = 'flex flex-col gap-4'
  protected readonly grid = 'grid grid-cols-2 gap-4 md:grid-cols-4'
  protected readonly evals = metrics.evals
    ? Object.entries(metrics.evals as Record<string, unknown>)
        .filter(([, value]) => typeof value === 'object')
        .map(([name, value]) => ({ name, rate: (value as { rate: number }).rate }))
    : null
  protected readonly app = metrics.app as App

  protected number(value: number | null | undefined) {
    return value === null || value === undefined ? '—' : value.toLocaleString('es-ES')
  }
}

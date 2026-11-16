import { ChangeDetectionStrategy, Component } from '@angular/core'
import {
  BarChartComponent,
  ButtonComponent,
  CardComponent,
  CheckboxComponent,
  ChipComponent,
  ExerciseRowComponent,
  HeatmapCellComponent,
  HeatmapYearComponent,
  IconComponent,
  InputComponent,
  LineChartComponent,
  ListRowComponent,
  SelectComponent,
  StatCardComponent,
  TabsComponent,
  WeekStripComponent,
} from '..'

// Una muestra con todos los componentes, para verlos juntos en los dos temas.
@Component({
  selector: 'robur-sampler',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    BarChartComponent,
    ButtonComponent,
    CardComponent,
    CheckboxComponent,
    ChipComponent,
    ExerciseRowComponent,
    HeatmapCellComponent,
    HeatmapYearComponent,
    IconComponent,
    InputComponent,
    LineChartComponent,
    ListRowComponent,
    SelectComponent,
    StatCardComponent,
    TabsComponent,
    WeekStripComponent,
  ],
  host: { class: 'flex flex-col gap-4 bg-page p-5 text-primary' },
  template: `
    <h2 class="text-h2">Tu semana</h2>
    <robur-tabs label="Periodo" value="semana" [tabs]="tabs" />
    <div class="grid grid-cols-2 gap-4">
      <robur-stat-card label="Sesiones" value="3" />
      <robur-stat-card variant="inverse" label="Volumen" value="2.480" unit="kg" />
      <robur-stat-card variant="inverse" series="secondary" label="Peso máximo" value="62,5" unit="kg" />
      <robur-card>
        <p class="text-title">Descanso</p>
        <p class="text-sm text-tertiary">Sin sesiones previstas.</p>
      </robur-card>
    </div>
    <div class="grid grid-cols-7 gap-1">
      @for (sessions of levels; track sessions) {
        <robur-heatmap-cell [week]="10 + sessions" [sessions]="sessions" />
      }
      <robur-heatmap-cell [week]="15" [sessions]="0" rest />
      <robur-heatmap-cell [week]="16" [sessions]="2" current />
    </div>
    <robur-heatmap-year [year]="2026" [weeks]="year" />
    <robur-card variant="inverse"><robur-week-strip [days]="days" /></robur-card>
    <robur-bar-chart title="Volumen semanal" [data]="bars" />
    <robur-line-chart variant="inverse" title="Press de hombro, peso (kg)" [data]="line" />
    <ul>
      <robur-list-row title="Empuje" detail="Lun 9 nov · 6 ejercicios" (select)="noop()" />
      <robur-list-row title="Press de hombro" detail="3 × 12"><robur-button variant="text">Quitar</robur-button></robur-list-row>
      <robur-list-row title="Pierna" value="12" />
    </ul>
    <robur-select label="Ejercicio" placeholder="Elige un ejercicio" [options]="options" />
    <div class="flex gap-3 text-primary">
      <robur-icon name="home" size="lg" />
      <robur-icon name="plus" size="lg" />
      <robur-icon name="check" size="lg" />
    </div>
    <div class="flex gap-2">
      <robur-chip selected>Empuje</robur-chip>
      <robur-chip>Tirón</robur-chip>
      <robur-chip variant="accent">Nuevo</robur-chip>
    </div>
    <robur-exercise-row name="Press de hombro" target="3 series × 12 reps" [completed]="true">
      <robur-input numeric label="Series" value="3" />
      <robur-input numeric label="Reps" value="12" />
      <robur-input numeric label="Peso (kg)" value="20" />
    </robur-exercise-row>
    <robur-checkbox label="Plancha" hint="60 s" />
    <robur-input label="Notas" hint="Opcional." placeholder="Cómo te has sentido" />
    <robur-input label="Nombre" error="Escribe un nombre para el ejercicio." />
    <div class="flex flex-wrap gap-2">
      <robur-button>Guardar sesión</robur-button>
      <robur-button variant="secondary">Cancelar</robur-button>
      <robur-button variant="danger">Borrar sesión</robur-button>
      <robur-button variant="text">Añadir ejercicio</robur-button>
    </div>
  `,
})
export class SamplerComponent {
  /** @internal */
  protected readonly tabs = [
    { value: 'semana', label: 'Semana' },
    { value: 'mes', label: 'Mes' },
  ]
  /** @internal */
  protected readonly levels = [0, 1, 2, 3, 4]
  /** @internal */
  protected readonly year = Array.from({ length: 52 }, (_, i) => ({ week: i + 1, sessions: (i * 7) % 5, current: i === 45 }))
  /** @internal */
  protected readonly days = ['L', 'M', 'X', 'J', 'V', 'S', 'D'].map((label, i) => ({ label, name: `día ${i + 1}`, done: i % 3 === 0, current: i === 3 }))
  /** @internal */
  protected readonly bars = [3, 1.5, 0, 2.5, 4, 2].map((value, i) => ({ label: String(40 + i), value }))
  /** @internal */
  protected readonly line = [20, 22.5, 22.5, 25, 27.5].map((value, i) => ({ label: `0${i + 1}-11`, value }))
  /** @internal */
  protected readonly options = [{ value: 'press', label: 'Press de hombro' }]
  /** @internal */
  protected readonly noop = () => {}
}

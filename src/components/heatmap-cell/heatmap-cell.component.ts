import { ChangeDetectionStrategy, Component, booleanAttribute, computed, input } from '@angular/core'

// Una clase por nivel, escrita entera: Tailwind solo genera las clases que encuentra en el código.
const LEVELS = ['bg-heat-0', 'bg-heat-1', 'bg-heat-2', 'bg-heat-3', 'bg-heat-4']

@Component({
  selector: 'robur-heatmap-cell',
  changeDetection: ChangeDetectionStrategy.OnPush,
  // La etiqueta <robur-heatmap-cell> no pinta caja propia: la celda de la rejilla es el <button> de dentro.
  host: { class: 'contents' },
  template: `<button type="button" [disabled]="disabled()" [attr.aria-label]="name()" [class]="classes()"></button>`,
})
export class HeatmapCellComponent {
  /** Número de semana ISO, del 1 al 53. */
  readonly week = input.required<number>()
  /** Sesiones registradas esa semana. Decide el nivel de color. */
  readonly sessions = input.required<number>()
  /** Semana marcada como descanso: se distingue por el borde discontinuo, no por un color. */
  readonly rest = input(false, { transform: booleanAttribute })
  /** Es la semana en curso. */
  readonly current = input(false, { transform: booleanAttribute })

  // Atributos nativos del <button>. El clic no hace falta declararlo: `(click)` en la etiqueta recibe el del <button>.
  /** Atributo nativo `disabled` del botón. */
  readonly disabled = input(false, { transform: booleanAttribute })

  /** @internal */
  protected readonly name = computed(() => {
    const sessions = this.sessions()
    const detail = this.rest() ? 'descanso' : `${sessions} ${sessions === 1 ? 'sesión' : 'sesiones'}`
    return `Semana ${this.week()}, ${detail}${this.current() ? ', semana actual' : ''}`
  })

  /** @internal */
  protected readonly classes = computed(() =>
    [
      'aspect-square min-h-3.5 rounded-xs transition-transform active:scale-95',
      this.rest() ? 'border border-dashed border-control bg-surface' : LEVELS[Math.min(Math.max(this.sessions(), 0), 4)],
      this.current() ? 'outline-2 outline-offset-2 outline-heat-current' : '',
    ].join(' '),
  )
}

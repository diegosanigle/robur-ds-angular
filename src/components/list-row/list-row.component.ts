import { ChangeDetectionStrategy, Component, ElementRef, afterNextRender, input, output, signal, viewChild } from '@angular/core'
import { NgTemplateOutlet } from '@angular/common'
import { listenersOf } from '../../utils/outputs'
import { IconComponent } from '../icon'

@Component({
  selector: 'robur-list-row',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [IconComponent, NgTemplateOutlet],
  host: { role: 'listitem', class: 'flex items-center gap-3 border-b border-default last:border-b-0' },
  template: `
    @if (selectable) {
      <button
        type="button"
        class="flex min-h-11 flex-1 items-center gap-3 py-3.5 text-left transition active:scale-99"
        (click)="select.emit()"
      >
        <ng-container *ngTemplateOutlet="content" />
        @if (!hasActions()) {
          <span class="text-tertiary"><robur-icon name="chevron-right" /></span>
        }
      </button>
    } @else {
      <div class="flex min-h-11 flex-1 items-center gap-3 py-3.5"><ng-container *ngTemplateOutlet="content" /></div>
    }
    <ng-template #content>
      <span class="flex min-w-0 flex-1 flex-col">
        <span class="text-title text-primary">{{ title() }}</span>
        @if (detail(); as text) {
          <span class="text-sm text-tertiary tabular-nums">{{ text }}</span>
        }
      </span>
      @if (value(); as text) {
        <span class="text-title text-primary tabular-nums">{{ text }}</span>
      }
    </ng-template>
    <div #actions class="flex shrink-0 items-center gap-1 empty:hidden">
      <!-- Acciones de la fila, al final: botones \`text\` («Editar», «Quitar»). -->
      <ng-content />
    </div>
  `,
})
export class ListRowComponent {
  /** Lo que nombra la fila: un ejercicio, una sesión, un día tipo. */
  readonly title = input.required<string>()
  /** Una línea de detalle bajo el título: fecha, series, grupo muscular. */
  readonly detail = input<string>()
  /** Una cifra a la derecha, ya formateada. */
  readonly value = input<string>()
  /** Se emite al pulsar la fila. Si se escucha, la fila se puede pulsar; sin acciones, lleva una flecha. */
  readonly select = output<void>()

  /** @internal La fila solo es pulsable si alguien escucha (select). Se lee al pintar: las suscripciones ya existen. */
  protected get selectable() {
    return listenersOf(this.select) > 0
  }

  /** @internal */
  private readonly actions = viewChild.required<ElementRef<HTMLElement>>('actions')
  /** @internal */
  protected readonly hasActions = signal(false)

  constructor() {
    afterNextRender(() => this.hasActions.set(this.actions().nativeElement.childElementCount > 0))
  }
}

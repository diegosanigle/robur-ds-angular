import { Component, input } from '@angular/core'
import { DecimalPipe } from '@angular/common'
import { RoburStatCard } from 'robur-ds'

@Component({
  selector: 'app-resumen',
  standalone: true,
  imports: [RoburStatCard, DecimalPipe],
  template: `
    <div class="flex flex-col gap-4">
      <robur-stat-card label="Volumen" [value]="volume() | number" unit="kg" />
      <robur-stat-card label="Peso máximo" [value]="max().toFixed(1)" unit="kg" />
      <robur-stat-card label="Sesiones" [value]="sessions().toLocaleString()" />
      <robur-stat-card label="Media" [value]="decimal.format(max())" unit="kg" />
      <p class="text-body text-secondary">Récord anterior: 2480 kg</p>
    </div>
  `,
})
export class Resumen {
  volume = input(0)
  max = input(0)
  sessions = input(0)
  decimal = new Intl.NumberFormat('es-ES', { maximumFractionDigits: 1 })
}

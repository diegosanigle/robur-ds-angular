import { Component, input } from '@angular/core'
import { DecimalPipe } from '@angular/common'
import { RoburStatCard } from 'robur-ds'

@Component({
  selector: 'app-resumen',
  standalone: true,
  imports: [RoburStatCard, DecimalPipe],
  template: `
    <div class="flex flex-col gap-4">
      <h2 class="text-title text-primary">Temporada 2026</h2>
      <robur-stat-card label="Volumen" [value]="volume() | number: '1.0-0' : 'es-ES'" unit="kg" />
      <robur-stat-card label="Peso máximo" [value]="nf.format(max())" unit="kg" />
      <p class="text-body text-secondary">Récord anterior: 2.480 kg</p>
    </div>
  `,
})
export class Resumen {
  volume = input(0)
  max = input(0)
  nf = new Intl.NumberFormat('es-ES', { useGrouping: 'always', maximumFractionDigits: 1 })
}

import { Component } from '@angular/core';
import { LineChartComponent } from 'robur-ds';

@Component({
  selector: 'app-press-banca-progreso',
  standalone: true,
  imports: [LineChartComponent],
  template: `
    <robur-line-chart
      variant="inverse"
      title="Press banca, peso máximo (kg)"
      [data]="registros"
    />
  `,
})
export class PressBancaProgresoComponent {
  registros = [
    { label: '02/09', value: 80 },
    { label: '09/09', value: 80 },
    { label: '16/09', value: 82.5 },
    { label: '23/09', value: 82.5 },
    { label: '30/09', value: 85 },
    { label: '07/10', value: 85 },
    { label: '14/10', value: 87.5 },
    { label: '21/10', value: 85 },
    { label: '28/10', value: 87.5 },
    { label: '04/11', value: 90 },
    { label: '11/11', value: 90 },
    { label: '18/11', value: 92.5 },
  ];
}

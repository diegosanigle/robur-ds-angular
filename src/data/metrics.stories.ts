import type { Meta, StoryObj } from '@storybook/angular-vite'
import { moduleMetadata } from '@storybook/angular-vite'
import { MetricsViewComponent } from './metrics-view.component'

const meta: Meta = {
  title: 'Datos/Métricas',
  parameters: { layout: 'padded' },
  decorators: [moduleMetadata({ imports: [MetricsViewComponent] })],
}

export default meta
type Story = StoryObj

/** La última medición del sistema. Se actualiza con `npm run metrics`; ningún número se escribe a mano. */
export const Resumen: Story = {
  render: () => ({ template: '<robur-metrics-view />' }),
}

import type { Meta, StoryObj } from '@storybook/angular-vite'
import { componentWrapperDecorator } from '@storybook/angular-vite'
import { StatCardComponent } from './stat-card.component'

const meta: Meta<StatCardComponent> = {
  title: 'Componentes/StatCard',
  component: StatCardComponent,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
  args: { label: 'Sesiones este mes', value: '14' },
  decorators: [componentWrapperDecorator((story) => `<div class="w-56">${story}</div>`)],
}

export default meta
type Story = StoryObj<StatCardComponent>

export const Surface: Story = {}

export const ConUnidad: Story = { args: { label: 'Volumen semanal', value: '2.480', unit: 'kg' } }

export const Inverse: Story = { args: { variant: 'inverse' } }

export const InverseSecondary: Story = {
  args: { variant: 'inverse', series: 'secondary', label: 'Peso máximo', value: '62,5', unit: 'kg' },
}

import type { Meta, StoryObj } from '@storybook/angular-vite'
import { componentWrapperDecorator } from '@storybook/angular-vite'
import { expect, within } from 'storybook/test'
import { HeatmapCellComponent } from './heatmap-cell.component'

const meta: Meta<HeatmapCellComponent> = {
  title: 'Componentes/HeatmapCell',
  component: HeatmapCellComponent,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
  args: { week: 14, sessions: 3 },
  decorators: [componentWrapperDecorator((story) => `<div class="grid w-64 grid-cols-7 gap-1">${story}</div>`)],
}

export default meta
type Story = StoryObj<HeatmapCellComponent>

export const Default: Story = {}

export const SinSesiones: Story = { args: { sessions: 0 } }

export const Rest: Story = { args: { rest: true, sessions: 0 } }

export const Current: Story = { args: { current: true } }

/** Los cinco niveles, el descanso y la semana en curso. Comprueba que cada celda dice su dato en texto. */
export const Niveles: Story = {
  render: () => ({
    props: { levels: [0, 1, 2, 3, 4] },
    template: `
      @for (sessions of levels; track sessions) {
        <robur-heatmap-cell [week]="10 + sessions" [sessions]="sessions" />
      }
      <robur-heatmap-cell [week]="15" [sessions]="0" rest />
      <robur-heatmap-cell [week]="16" [sessions]="2" current />`,
  }),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getByRole('button', { name: 'Semana 11, 1 sesión' })).toBeVisible()
    await expect(canvas.getByRole('button', { name: 'Semana 15, descanso' })).toBeVisible()
    await expect(canvas.getByRole('button', { name: 'Semana 16, 2 sesiones, semana actual' })).toBeVisible()
  },
}

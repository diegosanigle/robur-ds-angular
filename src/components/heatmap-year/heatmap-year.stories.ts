import type { Meta, StoryObj } from '@storybook/angular-vite'
import { componentWrapperDecorator } from '@storybook/angular-vite'
import { expect, fn, userEvent, within } from 'storybook/test'
import { HeatmapYearComponent } from './heatmap-year.component'

// Las entradas y la salida `weekSelect`.
type Args = {
  year: number
  weeks: { week: number; sessions: number; level?: number; rest?: boolean; current?: boolean }[]
  weekSelect: (week: number) => void
}

// Un año de muestra: el dato de cada semana sale de una fórmula fija para que la story no cambie.
const year = (total: number, current: number) =>
  Array.from({ length: total }, (_, i) => {
    const week = i + 1
    if (week > current) return { week, sessions: 0 }
    return { week, sessions: (week * 7) % 5, rest: week === 20 || week === 33, current: week === current }
  })

const meta: Meta<Args> = {
  title: 'Componentes/HeatmapYear',
  component: HeatmapYearComponent,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
  args: { year: 2026, weeks: year(53, 46), weekSelect: fn() },
  decorators: [componentWrapperDecorator((story) => `<div class="w-96 rounded-xl bg-surface p-6">${story}</div>`)],
}

export default meta
type Story = StoryObj<Args>

export const Default: Story = {}

export const CincuentaYDosSemanas: Story = { args: { year: 2027, weeks: year(52, 3) } }

/** Comprueba que la rejilla tiene nombre y que pulsar una semana avisa con su número. */
export const Interaccion: Story = {
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement)
    const grid = canvas.getByRole('group', { name: 'Semanas de 2026' })
    await expect(within(grid).getAllByRole('button')).toHaveLength(53)
    await userEvent.click(canvas.getByRole('button', { name: /^Semana 14,/ }))
    await expect(args.weekSelect).toHaveBeenCalledWith(14)
  },
}

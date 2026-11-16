import type { Meta, StoryObj } from '@storybook/angular-vite'
import { componentWrapperDecorator } from '@storybook/angular-vite'
import { expect, within } from 'storybook/test'
import { WeekStripComponent } from './week-strip.component'

const NAMES = ['lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado', 'domingo']
const LETTERS = ['L', 'M', 'X', 'J', 'V', 'S', 'D']
const week = (done: number[], current: number) =>
  NAMES.map((name, i) => ({ name, label: LETTERS[i], done: done.includes(i), current: i === current }))

const meta: Meta<WeekStripComponent> = {
  title: 'Componentes/WeekStrip',
  component: WeekStripComponent,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
  args: { days: week([0, 2], 3) },
  decorators: [componentWrapperDecorator((story) => `<div class="w-96 rounded-lg bg-inverse p-6">${story}</div>`)],
}

export default meta
type Story = StoryObj<WeekStripComponent>

export const Default: Story = {}

export const SinSesiones: Story = { args: { days: week([], 0) } }

/** Comprueba que cada día dice en texto si tuvo sesión y cuál es hoy. */
export const Lectura: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const items = canvas.getAllByRole('listitem')
    await expect(items).toHaveLength(7)
    await expect(items[0]).toHaveTextContent('lunes, con sesión')
    await expect(items[1]).toHaveTextContent('martes')
    await expect(items[1]).not.toHaveTextContent('con sesión')
    await expect(items[3]).toHaveTextContent('jueves, hoy')
  },
}

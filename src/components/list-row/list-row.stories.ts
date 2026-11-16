import type { Meta, StoryObj } from '@storybook/angular-vite'
import { argsToTemplate, componentWrapperDecorator, moduleMetadata } from '@storybook/angular-vite'
import { expect, fn, userEvent, within } from 'storybook/test'
import { ButtonComponent } from '../button'
import { ListRowComponent } from './list-row.component'

// Las entradas y la salida `select`.
type Args = {
  title: string
  detail?: string
  value?: string
  select?: () => void
}

// Con `select` en los args, la plantilla lo escucha; sin él, la fila no es pulsable.
const row = (actions = '') => (args: Args) => ({
  props: args,
  template: args.select
    ? `<robur-list-row ${argsToTemplate(args, { exclude: ['select'] })} (select)="select()">${actions}</robur-list-row>`
    : `<robur-list-row ${argsToTemplate(args)}>${actions}</robur-list-row>`,
})

const meta: Meta<Args> = {
  title: 'Componentes/ListRow',
  component: ListRowComponent,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
  args: { title: 'Press de hombro', detail: '3 × 12' },
  render: row(),
  decorators: [moduleMetadata({ imports: [ButtonComponent] }), componentWrapperDecorator((story) => `<ul class="w-96">${story}</ul>`)],
}

export default meta
type Story = StoryObj<Args>

export const Default: Story = {}

export const WithValue: Story = { args: { title: 'Empuje', detail: undefined, value: '12' } }

export const Selectable: Story = { args: { title: 'Empuje', detail: 'Lun 9 nov · 6 ejercicios', select: fn() } }

export const WithActions: Story = {
  render: row('<robur-button variant="text">Editar</robur-button><robur-button variant="text">Quitar</robur-button>'),
}

/** Una lista de tres filas: la última no lleva línea debajo. */
export const Lista: Story = {
  render: () => ({
    props: { noop: () => {} },
    template: `<robur-list-row title="Empuje" detail="Lun 9 nov · 6 ejercicios" (select)="noop()" />
      <robur-list-row title="Tirón" detail="Mié 11 nov · 5 ejercicios" (select)="noop()" />
      <robur-list-row title="Pierna" detail="Vie 13 nov · 6 ejercicios" (select)="noop()" />`,
  }),
}

/** Comprueba que pulsar la fila llama a onSelect y que las acciones son botones aparte. */
export const Interaccion: Story = {
  args: { select: fn() },
  render: row('<robur-button variant="text">Quitar</robur-button>'),
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement)
    await userEvent.click(canvas.getByRole('button', { name: /Press de hombro/ }))
    await expect(args.select).toHaveBeenCalledOnce()
    await expect(canvas.getByRole('button', { name: 'Quitar' })).toBeVisible()
  },
}

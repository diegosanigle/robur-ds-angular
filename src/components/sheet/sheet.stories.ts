import type { Meta, StoryObj } from '@storybook/angular-vite'
import { argsToTemplate, componentWrapperDecorator, moduleMetadata } from '@storybook/angular-vite'
import { expect, fn, userEvent, waitFor, within } from 'storybook/test'
import { ButtonComponent } from '../button'
import { SheetComponent } from './sheet.component'

const content = '<p class="text-body">Tres sesiones: empuje, tirón y pierna.</p>'

// Las entradas y la salida `close`.
type Args = {
  open: boolean
  title: string
  close: () => void
}

const meta: Meta<Args> = {
  title: 'Componentes/Sheet',
  component: SheetComponent,
  parameters: { layout: 'fullscreen' },
  tags: ['autodocs'],
  args: { open: true, close: fn(), title: 'Semana 14' },
  render: (args) => ({ props: args, template: `<robur-sheet ${argsToTemplate(args)}>${content}</robur-sheet>` }),
  decorators: [moduleMetadata({ imports: [ButtonComponent] }), componentWrapperDecorator((story) => `<div class="min-h-80 p-5">${story}</div>`)],
}

export default meta
type Story = StoryObj<Args>

export const Open: Story = {}

/** Comprueba el ciclo completo: se abre desde un botón, se cierra y el foco vuelve al botón que la abrió. */
export const Interaccion: Story = {
  args: { open: false },
  render: (args) => ({
    props: { ...args, open: false },
    template: `<robur-button (click)="open = true">Ver semana</robur-button><robur-sheet [title]="title" [open]="open" (close)="open = false">${content}</robur-sheet>`,
  }),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const trigger = canvas.getByRole('button', { name: 'Ver semana' })
    await userEvent.click(trigger)
    const sheet = canvas.getByRole('dialog', { name: 'Semana 14' })
    await expect(sheet).toBeVisible()
    await userEvent.click(canvas.getByRole('button', { name: 'Cerrar' }))
    await waitFor(() => expect(sheet).not.toBeVisible())
    await expect(trigger).toHaveFocus()
  },
}

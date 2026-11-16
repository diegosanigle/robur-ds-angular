import type { Meta, StoryObj } from '@storybook/angular-vite'
import { expect, fn, userEvent, within } from 'storybook/test'
import { ConfirmSheetComponent } from './confirm-sheet.component'

// Las entradas y las salidas `confirm` y `cancel`.
type Args = {
  open: boolean
  title: string
  description: string
  confirmLabel: string
  loading?: boolean
  confirm: () => void
  cancel: () => void
}

const meta: Meta<Args> = {
  title: 'Patrones/ConfirmSheet',
  component: ConfirmSheetComponent,
  parameters: { layout: 'fullscreen' },
  tags: ['autodocs'],
  args: {
    open: true,
    title: '¿Borrar esta sesión?',
    description: 'Se borran también sus ejercicios y deja de contar en el heatmap.',
    confirmLabel: 'Borrar sesión',
    confirm: fn(),
    cancel: fn(),
  },
}

export default meta
type Story = StoryObj<Args>

export const Default: Story = {}

export const Loading: Story = { args: { loading: true } }

/** Comprueba que confirmar y cancelar llaman cada uno a lo suyo. */
export const Interaccion: Story = {
  play: async ({ canvasElement, args }) => {
    const dialog = within(canvasElement.ownerDocument.body).getByRole('dialog', { name: '¿Borrar esta sesión?' })
    await userEvent.click(within(dialog).getByRole('button', { name: 'Borrar sesión' }))
    await expect(args.confirm).toHaveBeenCalledOnce()
    await userEvent.click(within(dialog).getByRole('button', { name: 'Cancelar' }))
    await expect(args.cancel).toHaveBeenCalled()
  },
}

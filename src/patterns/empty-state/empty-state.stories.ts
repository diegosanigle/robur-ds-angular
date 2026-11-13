import type { Meta, StoryObj } from '@storybook/angular-vite'
import { componentWrapperDecorator } from '@storybook/angular-vite'
import { expect, fn, userEvent, within } from 'storybook/test'
import { EmptyStateComponent } from './empty-state.component'

// Las entradas y la salida `action`.
type Args = {
  title: string
  description: string
  actionLabel?: string
  action: () => void
}

const meta: Meta<Args> = {
  title: 'Patrones/EmptyState',
  component: EmptyStateComponent,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
  args: {
    title: 'Aún no hay sesiones esta semana',
    description: 'Cuando registres una, aparecerá aquí.',
    actionLabel: 'Registrar sesión',
    action: fn(),
  },
  decorators: [componentWrapperDecorator((story) => `<div class="w-96">${story}</div>`)],
}

export default meta
type Story = StoryObj<Args>

export const Default: Story = {}

export const SinAccion: Story = {
  args: { title: 'Ningún ejercicio coincide', description: 'Prueba con otro nombre.', actionLabel: undefined },
}

/** Comprueba que la acción se puede pulsar y avisa. */
export const Interaccion: Story = {
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getByRole('heading', { name: 'Aún no hay sesiones esta semana' })).toBeVisible()
    await userEvent.click(canvas.getByRole('button', { name: 'Registrar sesión' }))
    await expect(args.action).toHaveBeenCalledOnce()
  },
}

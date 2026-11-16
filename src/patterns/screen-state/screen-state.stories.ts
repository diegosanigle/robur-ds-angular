import type { Meta, StoryObj } from '@storybook/angular-vite'
import { argsToTemplate, componentWrapperDecorator } from '@storybook/angular-vite'
import { expect, fn, userEvent, within } from 'storybook/test'
import { ScreenStateComponent } from './screen-state.component'

// Las entradas y la salida `retry`.
type Args = {
  state: 'loading' | 'error'
  message?: string
  retry?: () => void
}

const meta: Meta<Args> = {
  title: 'Patrones/ScreenState',
  component: ScreenStateComponent,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
  args: { state: 'loading' },
  // Con `retry` en los args, la plantilla lo escucha; sin él, el error no ofrece reintento.
  render: (args) => ({
    props: args,
    template: args.retry
      ? `<robur-screen-state ${argsToTemplate(args, { exclude: ['retry'] })} (retry)="retry()" />`
      : `<robur-screen-state ${argsToTemplate(args)} />`,
  }),
  decorators: [componentWrapperDecorator((story) => `<div class="w-96">${story}</div>`)],
}

export default meta
type Story = StoryObj<Args>

export const Loading: Story = {}

export const WithError: Story = { args: { state: 'error', retry: fn() } }

/** Comprueba que el error se anuncia y que Reintentar avisa. */
export const Interaccion: Story = {
  args: { state: 'error', message: 'No hay conexión. Vuelve a intentarlo cuando la tengas.', retry: fn() },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getByRole('alert')).toHaveTextContent('No hay conexión')
    await userEvent.click(canvas.getByRole('button', { name: 'Reintentar' }))
    await expect(args.retry).toHaveBeenCalledOnce()
  },
}

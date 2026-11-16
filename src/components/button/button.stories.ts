import type { Meta, StoryObj } from '@storybook/angular-vite'
import { argsToTemplate } from '@storybook/angular-vite'
import { expect, fn, userEvent, within } from 'storybook/test'
import { ButtonComponent } from './button.component'

// Las entradas del componente, el contenido del botón y el clic nativo.
type Args = {
  variant?: 'primary' | 'secondary' | 'danger' | 'text'
  fullWidth?: boolean
  loading?: boolean
  disabled?: boolean
  content: string
  onClick: (event: Event) => void
}

const meta: Meta<Args> = {
  title: 'Componentes/Button',
  component: ButtonComponent,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
  args: { content: 'Guardar sesión', onClick: fn() },
  // `content` es lo que va entre las etiquetas (<ng-content>), no una entrada del componente.
  argTypes: { content: { control: 'text', table: { category: 'content' } } },
  render: (args) => ({
    props: args,
    template: `<robur-button ${argsToTemplate(args, { exclude: ['content', 'onClick'] })} (click)="onClick($event)">{{ content }}</robur-button>`,
  }),
}

export default meta
type Story = StoryObj<Args>

export const Primary: Story = {}

export const Secondary: Story = { args: { variant: 'secondary', content: 'Cancelar' } }

export const Danger: Story = { args: { variant: 'danger', content: 'Borrar sesión' } }

export const Text: Story = { args: { variant: 'text', content: 'Añadir ejercicio' } }

export const Disabled: Story = { args: { disabled: true } }

export const Loading: Story = { args: { loading: true } }

export const FullWidth: Story = {
  args: { fullWidth: true },
  parameters: { layout: 'padded' },
}

/** Comprueba que un clic llama a `onClick` y que un botón deshabilitado no lo hace. */
export const Interaccion: Story = {
  play: async ({ canvasElement, args }) => {
    const button = within(canvasElement).getByRole('button', { name: 'Guardar sesión' })
    await userEvent.click(button)
    await expect(args.onClick).toHaveBeenCalledOnce()
  },
}

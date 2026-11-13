import type { Meta, StoryObj } from '@storybook/angular-vite'
import { componentWrapperDecorator } from '@storybook/angular-vite'
import { expect, userEvent, within } from 'storybook/test'
import { InputComponent } from './input.component'

const meta: Meta<InputComponent> = {
  title: 'Componentes/Input',
  component: InputComponent,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
  args: { label: 'Nombre del ejercicio', placeholder: 'Press de hombro' },
  decorators: [componentWrapperDecorator((story) => `<div class="w-80">${story}</div>`)],
}

export default meta
type Story = StoryObj<InputComponent>

export const Default: Story = {}

export const ConAyuda: Story = { args: { hint: 'Tal y como aparecerá en tu biblioteca.' } }

export const ConError: Story = { args: { error: 'Escribe un nombre para el ejercicio.' } }

export const Numerico: Story = { args: { label: 'Peso (kg)', numeric: true, placeholder: '0' } }

export const Disabled: Story = { args: { disabled: true } }

/** Comprueba que la etiqueta está asociada al campo y que se puede escribir en él. */
export const Interaccion: Story = {
  play: async ({ canvasElement }) => {
    const input = within(canvasElement).getByLabelText('Nombre del ejercicio')
    await userEvent.type(input, 'Sentadilla')
    await expect(input).toHaveValue('Sentadilla')
  },
}

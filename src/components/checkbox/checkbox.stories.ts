import type { Meta, StoryObj } from '@storybook/angular-vite'
import { expect, userEvent, within } from 'storybook/test'
import { CheckboxComponent } from './checkbox.component'

const meta: Meta<CheckboxComponent> = {
  title: 'Componentes/Checkbox',
  component: CheckboxComponent,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
  args: { label: 'Flexiones' },
}

export default meta
type Story = StoryObj<CheckboxComponent>

export const Default: Story = {}

export const Checked: Story = { args: { checked: true } }

export const ConDetalle: Story = { args: { hint: '3 series × 12 reps' } }

export const Disabled: Story = { args: { disabled: true } }

/** Comprueba que se puede marcar pulsando la etiqueta, no solo la casilla. */
export const Interaccion: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await userEvent.click(canvas.getByText('Flexiones'))
    await expect(canvas.getByRole('checkbox', { name: 'Flexiones' })).toBeChecked()
  },
}

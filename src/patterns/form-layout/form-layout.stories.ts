import type { Meta, StoryObj } from '@storybook/angular-vite'
import { argsToTemplate, componentWrapperDecorator, moduleMetadata } from '@storybook/angular-vite'
import { expect, fn, userEvent, within } from 'storybook/test'
import { InputComponent } from '../../components/input'
import { FormLayoutComponent } from './form-layout.component'

// Las entradas y las salidas `submit` y `cancel`.
type Args = {
  title: string
  submitLabel: string
  cancelLabel?: string
  submitting?: boolean
  submit: () => void
  cancel: () => void
}

const form = (fields: string) => (args: Args) => ({
  props: args,
  template: `<robur-form-layout ${argsToTemplate(args)}>${fields}</robur-form-layout>`,
})

const meta: Meta<Args> = {
  title: 'Patrones/FormLayout',
  component: FormLayoutComponent,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
  args: {
    title: 'Nuevo ejercicio',
    submitLabel: 'Guardar ejercicio',
    cancelLabel: 'Cancelar',
    submit: fn(),
    cancel: fn(),
  },
  render: form(
    '<robur-input label="Nombre" placeholder="Press de hombro" /><robur-input label="Series" numeric placeholder="0" /><robur-input label="Repeticiones" numeric placeholder="0" />',
  ),
  decorators: [moduleMetadata({ imports: [InputComponent] }), componentWrapperDecorator((story) => `<div class="w-96">${story}</div>`)],
}

export default meta
type Story = StoryObj<Args>

export const Default: Story = {}

export const ConError: Story = {
  render: form('<robur-input label="Nombre" error="Escribe un nombre para el ejercicio." /><robur-input label="Series" numeric value="3" />'),
}

export const Enviando: Story = { args: { submitting: true } }

/** Comprueba que el formulario se envía con la tecla Intro desde un campo. */
export const Interaccion: Story = {
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement)
    await userEvent.type(canvas.getByLabelText('Nombre'), 'Sentadilla{Enter}')
    await expect(args.submit).toHaveBeenCalledOnce()
  },
}

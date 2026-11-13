import type { Meta, StoryObj } from '@storybook/angular-vite'
import { argsToTemplate, componentWrapperDecorator, moduleMetadata } from '@storybook/angular-vite'
import { expect, fn, userEvent, within } from 'storybook/test'
import { InputComponent } from '../input'
import { ExerciseRowComponent } from './exercise-row.component'

const fields =
  '<robur-input numeric label="Series" value="3" /><robur-input numeric label="Reps" value="12" /><robur-input numeric label="Peso (kg)" value="20" />'

// Las entradas y la salida `completedChange`.
type Args = {
  name: string
  target?: string
  completed: boolean
  completedChange: (completed: boolean) => void
}

const meta: Meta<Args> = {
  title: 'Componentes/ExerciseRow',
  component: ExerciseRowComponent,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
  args: { name: 'Press de hombro', target: '3 series × 12 reps', completed: false, completedChange: fn() },
  render: (args) => ({
    props: args,
    template: `<robur-exercise-row ${argsToTemplate(args)}>${fields}</robur-exercise-row>`,
  }),
  decorators: [moduleMetadata({ imports: [InputComponent] }), componentWrapperDecorator((story) => `<div class="w-96">${story}</div>`)],
}

export default meta
type Story = StoryObj<Args>

export const Default: Story = {}

export const Completed: Story = { args: { completed: true } }

export const SinCampos: Story = {
  args: { name: 'Plancha', target: '60 s' },
  render: (args) => ({ props: args, template: `<robur-exercise-row ${argsToTemplate(args)} />` }),
}

/** Comprueba que marcar el ejercicio avisa con el nuevo estado. */
export const Interaccion: Story = {
  render: (args) => ({
    props: { ...args, completed: false },
    template: `<robur-exercise-row [name]="name" [target]="target" [completed]="completed" (completedChange)="completed = $event; completedChange($event)">${fields}</robur-exercise-row>`,
  }),
  play: async ({ canvasElement, args }) => {
    const checkbox = within(canvasElement).getByRole('checkbox', { name: 'Press de hombro' })
    await userEvent.click(checkbox)
    await expect(checkbox).toBeChecked()
    await expect(args.completedChange).toHaveBeenCalledWith(true)
  },
}

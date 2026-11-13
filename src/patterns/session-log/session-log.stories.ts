import type { Meta, StoryObj } from '@storybook/angular-vite'
import { componentWrapperDecorator } from '@storybook/angular-vite'
import { expect, fn, userEvent, within } from 'storybook/test'
import { SessionLogComponent } from './session-log.component'
import type { SessionExercise } from './session-log.component'

const PLAN: Record<string, { id: string; name: string; target: string }[]> = {
  Empuje: [
    { id: 'press', name: 'Press de hombro', target: '3 series × 12 reps' },
    { id: 'flexiones', name: 'Flexiones', target: '3 series × 15 reps' },
  ],
  Tirón: [{ id: 'remo', name: 'Remo con banda', target: '3 series × 12 reps' }],
  Pierna: [{ id: 'sentadilla', name: 'Sentadilla', target: '4 series × 10 reps' }],
}

const build = (dayType: string, done: string[]): SessionExercise[] =>
  PLAN[dayType].map((exercise) => ({ ...exercise, completed: done.includes(exercise.id) }))
const toggle = (done: string[], change: { id: string; completed: boolean }) =>
  change.completed ? [...done, change.id] : done.filter((id) => id !== change.id)

// Las entradas y las salidas `dayTypeChange`, `exerciseChange` y `save`.
type Args = {
  dayTypes: string[]
  dayType: string
  exercises: SessionExercise[]
  saving?: boolean
  dayTypeChange: (dayType: string) => void
  exerciseChange: (change: { id: string; completed: boolean }) => void
  save: () => void
}

const meta: Meta<Args> = {
  title: 'Patrones/SessionLog',
  component: SessionLogComponent,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
  args: {
    dayTypes: Object.keys(PLAN),
    dayType: 'Empuje',
    exercises: build('Empuje', []),
    dayTypeChange: fn(),
    exerciseChange: fn(),
    save: fn(),
  },
  decorators: [componentWrapperDecorator((story) => `<div class="w-96">${story}</div>`)],
}

export default meta
type Story = StoryObj<Args>

export const Default: Story = {}

export const Guardando: Story = { args: { saving: true } }

/** Comprueba la regla de los tres toques: tipo de día, ejercicio hecho y guardar. */
export const TresToques: Story = {
  render: (args) => ({
    props: { ...args, dayType: 'Empuje', done: [] as string[], exercises: build('Empuje', []), build, toggle },
    template: `
      <robur-session-log
        [dayTypes]="dayTypes"
        [dayType]="dayType"
        [exercises]="exercises"
        (dayTypeChange)="dayType = $event; exercises = build(dayType, done)"
        (exerciseChange)="done = toggle(done, $event); exercises = build(dayType, done)"
        (save)="save()"
      />`,
  }),
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement)
    await userEvent.click(within(canvas.getByRole('group', { name: 'Tipo de día' })).getByRole('button', { name: 'Pierna' }))
    await userEvent.click(canvas.getByRole('checkbox', { name: 'Sentadilla' }))
    await userEvent.click(canvas.getByRole('button', { name: 'Guardar sesión' }))
    await expect(canvas.getByRole('checkbox', { name: 'Sentadilla' })).toBeChecked()
    await expect(args.save).toHaveBeenCalledOnce()
  },
}

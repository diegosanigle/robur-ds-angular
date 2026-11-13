import type { Meta, StoryObj } from '@storybook/angular-vite'
import { argsToTemplate } from '@storybook/angular-vite'
import { expect, userEvent, within } from 'storybook/test'
import { ChipComponent } from './chip.component'

// Las entradas del componente y el contenido del chip.
type Args = {
  variant?: 'default' | 'accent'
  selected?: boolean
  disabled?: boolean
  content: string
}

const meta: Meta<Args> = {
  title: 'Componentes/Chip',
  component: ChipComponent,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
  args: { content: 'Empuje' },
  // `content` es lo que va entre las etiquetas (<ng-content>), no una entrada del componente.
  argTypes: { content: { control: 'text', table: { category: 'content' } } },
  render: (args) => ({
    props: args,
    template: `<robur-chip ${argsToTemplate(args, { exclude: ['content'] })}>{{ content }}</robur-chip>`,
  }),
}

export default meta
type Story = StoryObj<Args>

export const Default: Story = {}

export const Selected: Story = { args: { selected: true } }

export const Accent: Story = { args: { variant: 'accent', content: 'Nuevo' } }

export const Disabled: Story = { args: { disabled: true } }

/** Un grupo de chips para elegir el tipo de día. Comprueba que al pulsar cambia la selección. */
export const Interaccion: Story = {
  render: () => ({
    props: { day: 'Empuje', days: ['Empuje', 'Tirón', 'Pierna'] },
    template: `
      <div class="flex gap-2">
        @for (d of days; track d) {
          <robur-chip [selected]="day === d" (click)="day = d">{{ d }}</robur-chip>
        }
      </div>`,
  }),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await userEvent.click(canvas.getByRole('button', { name: 'Pierna' }))
    await expect(canvas.getByRole('button', { name: 'Pierna' })).toHaveAttribute('aria-pressed', 'true')
    await expect(canvas.getByRole('button', { name: 'Empuje' })).toHaveAttribute('aria-pressed', 'false')
  },
}

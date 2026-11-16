import type { Meta, StoryObj } from '@storybook/angular-vite'
import { moduleMetadata } from '@storybook/angular-vite'
import { expect, within } from 'storybook/test'
import { ICONS, IconComponent } from './icon.component'

const meta: Meta<IconComponent> = {
  title: 'Componentes/Icon',
  component: IconComponent,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
  args: { name: 'home' },
}

export default meta
type Story = StoryObj<IconComponent>

export const Default: Story = {}

export const Small: Story = { args: { size: 'sm' } }

export const Large: Story = { args: { size: 'lg' } }

/** El juego completo, en su tamaño mayor. */
export const Juego: Story = {
  decorators: [moduleMetadata({ imports: [IconComponent] })],
  render: () => ({
    props: { names: Object.keys(ICONS) },
    template: `<ul class="grid grid-cols-4 gap-6 text-primary">
      @for (name of names; track name) {
        <li class="flex flex-col items-center gap-2 text-label text-tertiary">
          <span class="text-primary"><robur-icon [name]="name" size="lg" /></span>{{ name }}
        </li>
      }
    </ul>`,
  }),
}

/** Con label se anuncia como imagen; sin él, queda oculto a los lectores de pantalla. */
export const ConNombre: Story = {
  args: { name: 'check', label: 'Hecho' },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getByRole('img', { name: 'Hecho' })).toBeVisible()
  },
}

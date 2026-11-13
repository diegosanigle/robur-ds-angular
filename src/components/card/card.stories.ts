import type { Meta, StoryObj } from '@storybook/angular-vite'
import { argsToTemplate, componentWrapperDecorator } from '@storybook/angular-vite'
import { CardComponent } from './card.component'

const meta: Meta<CardComponent> = {
  title: 'Componentes/Card',
  component: CardComponent,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
  render: (args) => ({
    props: args,
    template: `<robur-card ${argsToTemplate(args)}><p class="text-title">Tu semana</p><p class="text-sm">Tres sesiones completadas.</p></robur-card>`,
  }),
  decorators: [componentWrapperDecorator((story) => `<div class="w-80">${story}</div>`)],
}

export default meta
type Story = StoryObj<CardComponent>

export const Surface: Story = {}

export const Inverse: Story = { args: { variant: 'inverse' } }

export const PaddingLg: Story = { args: { padding: 'lg' } }

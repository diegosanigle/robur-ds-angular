import type { Meta, StoryObj } from '@storybook/angular-vite'
import { argsToTemplate, componentWrapperDecorator } from '@storybook/angular-vite'
import { expect, fn, userEvent, within } from 'storybook/test'
import { TabsComponent } from './tabs.component'
import type { Tab } from './tabs.component'

const TABS: Tab[] = [
  { value: 'semana', label: 'Semana' },
  { value: 'mes', label: 'Mes' },
  { value: 'ano', label: 'Año' },
]

// Las entradas y la salida `change`.
type Args = {
  label: string
  tabs: Tab[]
  value: string
  change: (value: string) => void
}

const meta: Meta<Args> = {
  title: 'Componentes/Tabs',
  component: TabsComponent,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
  args: { label: 'Periodo', tabs: TABS, value: 'semana', change: fn() },
  decorators: [componentWrapperDecorator((story) => `<div class="w-80">${story}</div>`)],
}

export default meta
type Story = StoryObj<Args>

export const Default: Story = {}

export const DosPestanas: Story = { args: { tabs: TABS.slice(0, 2) } }

export const ConContenido: Story = {
  render: (args) => ({
    props: args,
    template: `<robur-tabs ${argsToTemplate(args)}><p class="text-body">Tres sesiones esta semana.</p></robur-tabs>`,
  }),
}

/** Comprueba el uso con teclado: la flecha derecha pasa a la pestaña siguiente y le da el foco. */
export const Interaccion: Story = {
  render: (args) => ({
    props: { ...args, value: 'semana' },
    template: `<robur-tabs [label]="label" [tabs]="tabs" [value]="value" (change)="value = $event"><p class="text-body">Periodo: {{ value }}</p></robur-tabs>`,
  }),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await userEvent.click(canvas.getByRole('tab', { name: 'Semana' }))
    await userEvent.keyboard('{ArrowRight}')
    const mes = canvas.getByRole('tab', { name: 'Mes' })
    await expect(mes).toHaveAttribute('aria-selected', 'true')
    await expect(mes).toHaveFocus()
    await expect(canvas.getByRole('tabpanel')).toHaveTextContent('Periodo: mes')
  },
}

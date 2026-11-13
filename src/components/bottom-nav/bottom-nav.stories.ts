import { Component } from '@angular/core'
import type { Meta, StoryObj } from '@storybook/angular-vite'
import { componentWrapperDecorator } from '@storybook/angular-vite'
import { expect, within } from 'storybook/test'
import { BottomNavComponent } from './bottom-nav.component'
import type { NavItem } from './bottom-nav.component'

// Un icono es un componente: aquí, cinco componentes que pintan un SVG de un solo trazo.
const SVG = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="'
const END = '" /></svg>'

@Component({ template: SVG + 'M4 11l8-7 8 7v9H4z' + END })
class HomeIcon {}
@Component({ template: SVG + 'M4 12h16M7 8v8M17 8v8' + END })
class SessionIcon {}
@Component({ template: SVG + 'M9 6h11M9 12h11M9 18h11M4 6h.01M4 12h.01M4 18h.01' + END })
class PlanIcon {}
@Component({ template: SVG + 'M4 19V5M4 19h16M8 15l4-5 3 3 4-6' + END })
class ProgressIcon {}
@Component({ template: SVG + 'M5 7h14M5 12h14M5 17h14' + END })
class SettingsIcon {}

const ITEMS: NavItem[] = [
  { value: 'inicio', label: 'Inicio', href: '#inicio', icon: HomeIcon },
  { value: 'sesion', label: 'Sesión', href: '#sesion', icon: SessionIcon },
  { value: 'plan', label: 'Plan', href: '#plan', icon: PlanIcon },
  { value: 'progreso', label: 'Progreso', href: '#progreso', icon: ProgressIcon },
  { value: 'ajustes', label: 'Ajustes', href: '#ajustes', icon: SettingsIcon },
]

const meta: Meta<BottomNavComponent> = {
  title: 'Componentes/BottomNav',
  component: BottomNavComponent,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
  args: { items: ITEMS, value: 'inicio' },
  decorators: [componentWrapperDecorator((story) => `<div class="w-96">${story}</div>`)],
}

export default meta
type Story = StoryObj<BottomNavComponent>

export const Default: Story = {}

export const TresSecciones: Story = { args: { items: ITEMS.slice(0, 3) } }

/** Comprueba que solo la sección actual se anuncia como página actual. */
export const SeccionActual: Story = {
  args: { value: 'progreso' },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getByRole('link', { name: 'Progreso' })).toHaveAttribute('aria-current', 'page')
    await expect(canvas.getByRole('link', { name: 'Inicio' })).not.toHaveAttribute('aria-current')
  },
}

import type { Meta, StoryObj } from '@storybook/angular-vite'
import { moduleMetadata } from '@storybook/angular-vite'
import { SamplerComponent } from './sampler.component'

const meta: Meta = {
  title: 'Resumen/Todos los componentes',
  parameters: { layout: 'fullscreen' },
  decorators: [moduleMetadata({ imports: [SamplerComponent] })],
}

export default meta
type Story = StoryObj

/**
 * Todos los componentes en los dos temas a la vez.
 * Sirve para ver el sistema de un vistazo y para que los tests de accesibilidad cubran también el tema oscuro.
 */
export const ClaroYOscuro: Story = {
  render: () => ({
    template: '<div class="grid md:grid-cols-2"><div data-theme="light"><robur-sampler /></div><div data-theme="dark"><robur-sampler /></div></div>',
  }),
}

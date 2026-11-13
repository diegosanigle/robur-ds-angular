import type { Meta, StoryObj } from '@storybook/angular-vite'
import { cssVar, primitiveTokens, primitiveVar, semanticTokens, textStyles } from './tokens'

const meta: Meta = {
  title: 'Fundamentos/Tokens',
  parameters: { layout: 'padded' },
}

export default meta
type Story = StoryObj

const swatch = 'inline-block size-10 shrink-0 rounded-sm border border-default'
const GROUPS = { text: 'Texto', bg: 'Fondos', border: 'Bordes', focus: 'Foco', heat: 'Heatmap', data: 'Datos' }

/** Los tokens que usan los componentes. Cambia el tema en la barra superior para ver sus valores en oscuro. */
export const ColoresSemanticos: Story = {
  render: () => ({
    props: {
      swatch,
      groups: Object.entries(GROUPS).map(([group, title]) => ({
        group,
        title,
        tokens: semanticTokens
          .filter((token) => token.name.startsWith(`color.${group}.`))
          .map((token) => ({ ...token, color: cssVar(token.name) })),
      })),
    },
    template: `
      <div class="flex flex-col gap-8">
        @for (g of groups; track g.group) {
          <section>
            <h2 class="mb-3 text-h3">{{ g.title }}</h2>
            <ul class="flex flex-col gap-2">
              @for (token of g.tokens; track token.name) {
                <li class="flex items-center gap-3">
                  <span [class]="swatch" [style.background]="token.color"></span>
                  <div>
                    <p class="text-sm font-semibold">{{ token.name }}</p>
                    <p class="text-sm text-tertiary">{{ token.description ? token.description + ' ' : '' }}Claro: {{ token.light }} · Oscuro: {{ token.dark }}</p>
                  </div>
                </li>
              }
            </ul>
          </section>
        }
      </div>`,
  }),
}

/** La paleta en bruto. Los componentes no la usan: solo sirve para dar valor a los semánticos. */
export const ColoresPrimitivos: Story = {
  render: () => ({
    props: {
      swatch,
      tokens: primitiveTokens
        .filter((token) => token.name.startsWith('color.'))
        .map((token) => ({ name: token.name.replace('color.', ''), value: token.value, color: primitiveVar(token.name) })),
    },
    template: `
      <ul class="grid grid-cols-2 gap-3 sm:grid-cols-4">
        @for (token of tokens; track token.name) {
          <li class="flex items-center gap-3">
            <span [class]="swatch" [style.background]="token.color"></span>
            <div>
              <p class="text-sm font-semibold">{{ token.name }}</p>
              <p class="text-sm text-tertiary">{{ token.value }}</p>
            </div>
          </li>
        }
      </ul>`,
  }),
}

export const Tipografia: Story = {
  render: () => ({
    props: {
      styles: textStyles.map((token) => {
        const name = token.name.replace('text.', '')
        return {
          name,
          value: token.value as { fontSize: string; fontWeight: number; lineHeight: number },
          style: {
            'font-size': `var(--text-${name})`,
            'font-weight': `var(--text-${name}--font-weight)`,
            'line-height': `var(--text-${name}--line-height)`,
            'letter-spacing': `var(--text-${name}--letter-spacing)`,
          },
        }
      }),
    },
    template: `
      <ul class="flex flex-col gap-6">
        @for (s of styles; track s.name) {
          <li>
            <p [style]="s.style">Tres sesiones esta semana</p>
            <p class="text-sm text-tertiary">text-{{ s.name }} · {{ s.value.fontSize }} · peso {{ s.value.fontWeight }} · interlineado {{ s.value.lineHeight }}</p>
          </li>
        }
      </ul>`,
  }),
}

export const RadiosYSombras: Story = {
  render: () => ({
    props: {
      tokens: primitiveTokens
        .filter((token) => /^(radius|shadow)\./.test(token.name))
        .map((token) => {
          const name = token.name.replace('.', '-')
          const isRadius = token.name.startsWith('radius.')
          return {
            key: token.name,
            label: isRadius ? name.replace('radius', 'rounded') : name,
            value: isRadius ? String(token.value) : '',
            style: isRadius
              ? { 'border-radius': `var(--${name})` }
              : { 'box-shadow': `var(--${name})`, 'border-radius': 'var(--radius-md)' },
          }
        }),
    },
    template: `
      <ul class="flex flex-wrap gap-6">
        @for (token of tokens; track token.key) {
          <li class="flex flex-col items-center gap-2">
            <span class="block size-20 border border-control bg-surface" [style]="token.style"></span>
            <p class="text-sm font-semibold">{{ token.label }}</p>
            <p class="text-sm text-tertiary">{{ token.value }}</p>
          </li>
        }
      </ul>`,
  }),
}

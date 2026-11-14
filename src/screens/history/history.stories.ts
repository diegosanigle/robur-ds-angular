import type { Meta, StoryObj } from '@storybook/angular-vite'
import { expect, fn, userEvent, within } from 'storybook/test'
import { HistoryComponent } from './history.component'
import type { HistorySession, HistorySummary } from './history.component'

const SESSIONS: HistorySession[] = [
  { id: '1', date: 'Lun 9 nov', dayType: 'Empuje', detail: '5 ejercicios · 1.240 kg' },
  { id: '2', date: 'Mié 4 nov', dayType: 'Pierna', detail: '4 ejercicios · 1.860 kg' },
  { id: '3', date: 'Lun 2 nov', dayType: 'Tirón', detail: '5 ejercicios · 980 kg' },
]
const SUMMARY: HistorySummary = { sessions: '3', volume: '4.080', maxWeight: '62,5' }
const EMPTY: HistorySummary = { sessions: '0', volume: '0', maxWeight: '0' }

// Las entradas y las salidas `periodChange` y `logSession`.
type Args = {
  period: string
  summary: HistorySummary
  sessions: HistorySession[]
  periodChange: (period: string) => void
  logSession: () => void
}

const meta: Meta<Args> = {
  title: 'Pantallas/Historial',
  component: HistoryComponent,
  parameters: { layout: 'fullscreen' },
  args: {
    period: 'mes',
    periodChange: fn(),
    logSession: fn(),
    summary: SUMMARY,
    sessions: SESSIONS,
  },
}

export default meta
type Story = StoryObj<Args>

export const ConSesiones: Story = {}

export const SinSesiones: Story = {
  args: { period: 'semana', summary: EMPTY, sessions: [] },
}

/** Comprueba que se puede cambiar de periodo y que un periodo sin sesiones ofrece registrar una. */
export const CambioDePeriodo: Story = {
  render: (args) => ({
    props: {
      ...args,
      period: 'mes',
      sessionsOf: (period: string) => (period === 'semana' ? [] : SESSIONS),
      summaryOf: (period: string) => (period === 'semana' ? EMPTY : SUMMARY),
    },
    template: `
      <robur-history
        [period]="period"
        [sessions]="sessions"
        [summary]="summary"
        (periodChange)="period = $event; sessions = sessionsOf($event); summary = summaryOf($event)"
        (logSession)="logSession()"
      />`,
  }),
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement)
    await userEvent.click(canvas.getByRole('tab', { name: 'Semana' }))
    await userEvent.click(canvas.getByRole('button', { name: 'Registrar sesión' }))
    await expect(args.logSession).toHaveBeenCalledOnce()
  },
}

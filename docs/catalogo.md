<!-- GENERADO por scripts/build-catalog.mjs. No editar a mano. -->
# Catálogo de Robur DS

Todo lo que existe en el sistema. Si algo no está aquí, no existe: no lo inventes, proponlo.

## Patrones

Empieza por aquí: si un patrón resuelve la pantalla, úsalo antes de combinar componentes.

| Patrón | Etiqueta | Qué resuelve | Detalle |
|---|---|---|---|
| `ConfirmSheet` | `<robur-confirm-sheet>` | Pedir confirmación antes de una acción que no se puede deshacer, como borrar. | `src/patterns/confirm-sheet/ConfirmSheet.pattern.json` |
| `EmptyState` | `<robur-empty-state>` | Lo que se ve cuando una lista o una sección todavía no tiene contenido. | `src/patterns/empty-state/EmptyState.pattern.json` |
| `FormLayout` | `<robur-form-layout>` | Un formulario corto: título, campos en columna y las acciones al final. | `src/patterns/form-layout/FormLayout.pattern.json` |
| `ScreenState` | `<robur-screen-state>` | Lo que se ve mientras una pantalla carga sus datos o cuando no han podido llegar. | `src/patterns/screen-state/ScreenState.pattern.json` |
| `SessionLog` | `<robur-session-log>` | Registrar una sesión de entrenamiento: elegir el tipo de día, marcar los ejercicios y guardar. | `src/patterns/session-log/SessionLog.pattern.json` |

## Componentes

| Componente | Etiqueta | Qué es | Props | Detalle |
|---|---|---|---|---|
| `BarChart` | `<robur-bar-chart>` | Gráfica de barras en una tarjeta: una cifra por periodo, con su valor encima. | `title`, `data`, `variant` (surface · inverse), `series` (primary · secondary) | `src/components/bar-chart/BarChart.contract.json` |
| `BottomNav` | `<robur-bottom-nav>` | Navegación principal entre las secciones de la app. | `label`, `items`, `value` | `src/components/bottom-nav/BottomNav.contract.json` |
| `Button` | `<robur-button>` | Lanza una acción: guardar, cancelar, borrar. | `variant` (primary · secondary · danger · text), `fullWidth`, `loading`, `children` | `src/components/button/Button.contract.json` |
| `Card` | `<robur-card>` | Superficie que agrupa contenido relacionado. | `variant` (surface · inverse), `padding` (md · lg), `children` | `src/components/card/Card.contract.json` |
| `Checkbox` | `<robur-checkbox>` | Casilla para marcar algo como hecho o activado. | `label`, `hint` | `src/components/checkbox/Checkbox.contract.json` |
| `Chip` | `<robur-chip>` | Opción compacta que se puede seleccionar. | `variant` (default · accent), `selected`, `children` | `src/components/chip/Chip.contract.json` |
| `ExerciseRow` | `<robur-exercise-row>` | Fila de un ejercicio dentro de una sesión: se marca como hecho y se registran sus cifras. | `name`, `target`, `completed`, `children` | `src/components/exercise-row/ExerciseRow.contract.json` |
| `HeatmapCell` | `<robur-heatmap-cell>` | Una semana del heatmap anual. Su color dice cuántas sesiones hubo. | `week`, `sessions`, `level`, `rest`, `current` | `src/components/heatmap-cell/HeatmapCell.contract.json` |
| `HeatmapYear` | `<robur-heatmap-year>` | El heatmap anual: una celda por semana ISO, en rejilla de trece columnas, con su leyenda. | `year`, `weeks` | `src/components/heatmap-year/HeatmapYear.contract.json` |
| `Icon` | `<robur-icon>` | Un icono del juego cerrado de Robur, de trazo y del color del texto. | `name` (home · dumbbell · list-checks · line-chart · settings · check · chevron-right · chevron-down · plus), `size` (sm · md · lg), `label` | `src/components/icon/Icon.contract.json` |
| `Input` | `<robur-input>` | Campo de una línea para escribir texto o una cifra. | `label`, `hint`, `error`, `numeric` | `src/components/input/Input.contract.json` |
| `LineChart` | `<robur-line-chart>` | Gráfica de línea en una tarjeta: cómo cambia una cifra registro a registro. | `title`, `data`, `variant` (surface · inverse), `series` (primary · secondary) | `src/components/line-chart/LineChart.contract.json` |
| `ListRow` | `<robur-list-row>` | Una fila de una lista: título, detalle, una cifra opcional y sus acciones. | `title`, `detail`, `value`, `children` | `src/components/list-row/ListRow.contract.json` |
| `Select` | `<robur-select>` | Desplegable para elegir una opción de una lista larga o que cambia. | `label`, `options`, `placeholder`, `hint`, `error` | `src/components/select/Select.contract.json` |
| `Sheet` | `<robur-sheet>` | Hoja modal anclada abajo para un detalle o una tarea corta. | `open`, `title`, `children` | `src/components/sheet/Sheet.contract.json` |
| `StatCard` | `<robur-stat-card>` | Una cifra grande con la etiqueta que dice qué mide. | `label`, `value`, `unit`, `variant` (surface · inverse), `series` (primary · secondary) | `src/components/stat-card/StatCard.contract.json` |
| `Tabs` | `<robur-tabs>` | Cambia entre vistas del mismo contenido dentro de una pantalla. | `label`, `tabs`, `value`, `children` | `src/components/tabs/Tabs.contract.json` |
| `WeekStrip` | `<robur-week-strip>` | Los siete días de la semana en curso, con una marca en los que tuvieron sesión. | `days` | `src/components/week-strip/WeekStrip.contract.json` |

Antes de usar un componente, lee su contrato: `useWhen`, `avoidWhen` y `rules` dicen cuándo y cómo.

En una plantilla, cada pieza se escribe con su etiqueta y se importa su clase (`ButtonComponent`) desde `src/index.ts`.
Una prop de tipo función del contrato (`onChange`) es una salida: `(change)`. La prop `children` es lo que va entre las etiquetas.

## Tokens

Clases de Tailwind disponibles. No existe ninguna otra clase de color, radio, sombra o tamaño de texto.

| Para | Clases |
|---|---|
| Texto | `text-primary` `text-secondary` `text-tertiary` `text-action` `text-on-action` `text-on-selected` `text-on-inverse` `text-on-inverse-muted` `text-danger` `text-success` `text-info` |
| Fondos | `bg-page` `bg-surface` `bg-inverse` `bg-action` `bg-action-soft` `bg-selected` `bg-danger-soft` `bg-success-soft` `bg-info-soft` `bg-overlay` |
| Bordes | `border-default` `border-control` `border-strong` `border-action` `border-danger` `border-inverse` |
| Foco | `*-focus-ring` |
| Heatmap | `*-heat-0` `*-heat-1` `*-heat-2` `*-heat-3` `*-heat-4` `*-heat-current` |
| Datos | `*-data-1` `*-data-2` |
| Estilos de texto | `text-display` `text-h1` `text-h2` `text-h3` `text-title` `text-body` `text-sm` `text-control` `text-label` |
| Radios | `rounded-xs` `rounded-sm` `rounded-md` `rounded-lg` `rounded-xl` `rounded-pill` |
| Sombras | `shadow-sm` `shadow-md` |

Qué texto puede ir sobre qué fondo: `tokens/contrast.json`.

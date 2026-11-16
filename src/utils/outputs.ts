/**
 * Cuántos escuchan una salida. `output()` no lo publica: se lee de su lista interna de suscriptores.
 * Sirve para piezas cuyo aspecto cambia si alguien escucha, como ListRow (fila pulsable) o
 * ScreenState (botón Reintentar). Las suscripciones del padre ya existen cuando se pinta la plantilla.
 */
export const listenersOf = (ref: unknown) => (ref as { listeners: unknown[] | null }).listeners?.length ?? 0

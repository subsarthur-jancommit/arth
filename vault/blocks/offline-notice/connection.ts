/**
 * The connection, as the notice needs to know it — pure enough to test
 * without a browser.
 *
 * Three states rather than the platform's two: `restored` is the moment
 * between the connection coming back and the notice letting go of it, so a
 * reader who was told "offline" is also told when that stopped being true.
 */

export type Connection = 'online' | 'offline' | 'restored'

/** What can happen: the two platform events, and the hold running out. */
export type ConnectionEvent = 'offline' | 'online' | 'settled'

export function nextConnection(
  current: Connection,
  event: ConnectionEvent
): Connection {
  switch (event) {
    case 'offline':
      return 'offline'
    case 'online':
      // Only a connection that was lost can be restored; an `online` the
      // reader was never told the opposite of says nothing.
      return current === 'offline' ? 'restored' : current
    case 'settled':
      return current === 'restored' ? 'online' : current
  }
}

/** The slice of `window` the store reads: a flag and two events. */
export interface ConnectionTarget {
  readonly navigator: { readonly onLine: boolean }
  addEventListener(type: 'online' | 'offline', listener: () => void): void
  removeEventListener(type: 'online' | 'offline', listener: () => void): void
}

export interface ConnectionStore {
  subscribe: (onChange: () => void) => () => void
  getSnapshot: () => Connection
}

/**
 * A `useSyncExternalStore` source for the connection.
 *
 * The state is taken from `navigator.onLine` when the first subscriber
 * arrives and then moved only by events. Reading the flag afresh on every
 * snapshot would be wrong in a quiet way: by the time an `offline` event
 * runs, the flag already says offline, so the store would see no change and
 * tell no one.
 *
 * `target` is a getter so the store can be created on the server, where it is
 * never subscribed to and there is no `window` to name.
 */
export function createConnectionStore(
  target: () => ConnectionTarget,
  holdRestored: number
): ConnectionStore {
  let state: Connection | null = null
  let settle: ReturnType<typeof setTimeout> | null = null
  const listeners = new Set<() => void>()

  const fromFlag = (): Connection =>
    target().navigator.onLine ? 'online' : 'offline'

  const clearSettle = () => {
    if (settle !== null) clearTimeout(settle)
    settle = null
  }

  const dispatch = (event: ConnectionEvent) => {
    const current = state ?? fromFlag()
    const next = nextConnection(current, event)
    if (next === current) return

    state = next
    clearSettle()
    if (next === 'restored') {
      settle = setTimeout(() => dispatch('settled'), holdRestored)
    }
    for (const listener of listeners) listener()
  }
  const onOffline = () => dispatch('offline')
  const onOnline = () => dispatch('online')

  return {
    subscribe(onChange) {
      listeners.add(onChange)
      if (listeners.size === 1) {
        state = fromFlag()
        target().addEventListener('offline', onOffline)
        target().addEventListener('online', onOnline)
      }
      return () => {
        listeners.delete(onChange)
        if (listeners.size > 0) return
        target().removeEventListener('offline', onOffline)
        target().removeEventListener('online', onOnline)
        clearSettle()
        state = null
      }
    },
    getSnapshot: () => state ?? fromFlag(),
  }
}

import { describe, expect, it } from 'bun:test'

import {
  type ConnectionTarget,
  createConnectionStore,
  nextConnection,
} from './connection'

/** A stand-in `window`: a flag the test flips, and real events. */
function fakeWindow(onLine: boolean) {
  const events = new EventTarget()
  const navigator = { onLine }
  const target: ConnectionTarget = {
    navigator,
    addEventListener: (type, listener) =>
      events.addEventListener(type, listener),
    removeEventListener: (type, listener) =>
      events.removeEventListener(type, listener),
  }
  const go = (online: boolean) => {
    navigator.onLine = online
    events.dispatchEvent(new Event(online ? 'online' : 'offline'))
  }
  return { target, go }
}

const tick = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

describe('the connection', () => {
  it('is restored only after it was lost, and settles back to online', () => {
    expect(nextConnection('online', 'offline')).toBe('offline')
    expect(nextConnection('offline', 'online')).toBe('restored')
    expect(nextConnection('online', 'online')).toBe('online')
    expect(nextConnection('restored', 'settled')).toBe('online')
    expect(nextConnection('offline', 'settled')).toBe('offline')
    expect(nextConnection('restored', 'offline')).toBe('offline')
  })

  it('tells its subscribers when the connection goes and comes back', async () => {
    const { target, go } = fakeWindow(true)
    const store = createConnectionStore(() => target, 5)
    const seen: string[] = []
    const unsubscribe = store.subscribe(() => seen.push(store.getSnapshot()))

    expect(store.getSnapshot()).toBe('online')
    // The flag is already false when the event runs: the store must still
    // see a change.
    go(false)
    go(true)
    await tick(20)
    expect(seen).toEqual(['offline', 'restored', 'online'])

    unsubscribe()
    go(false)
    expect(seen).toHaveLength(3)
  })

  it('starts from the flag, so a page opened offline says so', () => {
    const { target } = fakeWindow(false)
    const store = createConnectionStore(() => target, 5)
    const unsubscribe = store.subscribe(() => undefined)
    expect(store.getSnapshot()).toBe('offline')
    unsubscribe()
  })

  it('keeps saying offline if the connection drops again while restored', async () => {
    const { target, go } = fakeWindow(true)
    const store = createConnectionStore(() => target, 5)
    const unsubscribe = store.subscribe(() => undefined)
    go(false)
    go(true)
    go(false)
    await tick(20)
    expect(store.getSnapshot()).toBe('offline')
    unsubscribe()
  })
})

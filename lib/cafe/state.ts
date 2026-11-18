/**
 * The café's state: the small surface the page drives the illustration by.
 *
 * Provenance: original work for this project. No third-party code copied.
 *
 * Three things, and only three, as G3's brief asks for G4:
 *
 * - **`assemble()`** plays the assembly again from the start: 600–900 ms,
 *   then still (`assembly.ts`). The page arrives with one already running,
 *   the still's own, in CSS.
 * - **`phase`**, `'assembling'` or `'assembled'`. Whichever renderer plays a
 *   run reports its end with `settle(run)`; a run that a newer one replaced
 *   reports nothing.
 * - **`setNeed(need)`**, the per-need change. G3 ships the hook and one
 *   default response in the WebGL renderer (the need's own parts rise a
 *   little, interruptibly; `vault/webgl/cafe/scene.tsx`); G4 decides what a
 *   need really does to the picture. The still does not change per need.
 *
 * Outside React, a page can reach the same three through DOM events on the
 * illustration (`vault/webgl/cafe/index.tsx`): `cafe:assemble`, and
 * `cafe:need` with the need, or `null`, as its `detail`.
 *
 * One module-level store, because there is one café on a page. The server
 * only ever reads its first state.
 */

import { useSyncExternalStore } from 'react'

import type { CafeNeed } from './model'

export type { CafeNeed } from './model'

export type CafePhase = 'assembling' | 'assembled'

export interface CafeState {
  readonly phase: CafePhase
  /** Counts assemblies. Each `assemble()` starts a new one. */
  readonly run: number
  readonly need: CafeNeed | null
}

const INITIAL: CafeState = { phase: 'assembling', run: 0, need: null }

let state: CafeState = INITIAL
const listeners = new Set<() => void>()

function set(next: CafeState) {
  state = next
  for (const listener of listeners) listener()
}

export const cafe = {
  getSnapshot: (): CafeState => state,
  getServerSnapshot: (): CafeState => INITIAL,
  subscribe(listener: () => void): () => void {
    listeners.add(listener)
    return () => {
      listeners.delete(listener)
    }
  },
  /** Plays the assembly from the start; returns the new run's number. */
  assemble(): number {
    set({ ...state, phase: 'assembling', run: state.run + 1 })
    return state.run
  },
  /** The run `run` has arrived. Ignored if a newer run has started. */
  settle(run: number): void {
    if (run !== state.run || state.phase === 'assembled') return
    set({ ...state, phase: 'assembled' })
  },
  /** The per-need change: the need the picture answers, or none. */
  setNeed(need: CafeNeed | null): void {
    if (need === state.need) return
    set({ ...state, need })
  },
}

/** The café's state, for a component. */
export function useCafe(): CafeState {
  return useSyncExternalStore(
    cafe.subscribe,
    cafe.getSnapshot,
    cafe.getServerSnapshot
  )
}

/** Whether a value names one of the three needs. */
export function isCafeNeed(value: unknown): value is CafeNeed {
  return value === 'building' || value === 'systems' || value === 'market'
}

/**
 * The assembly: how the café puts itself together, once, and then holds.
 *
 * Provenance: original work for this project. No third-party code copied.
 * `cubicBezier` solves the CSS timing function by Newton's method with a
 * bisection fallback, the textbook way; written here from the definition.
 *
 * The owner's reference (§6) gives an illustration that changes after a
 * choice 600–900 ms, once: one main action, then still. Five stages arrive in
 * order (the ground, the shell, the roof, the fit-out, the furniture), each
 * dropping into place and fading in over `STAGE_MS`, each starting `STEP_MS`
 * after the one before. The total is `ASSEMBLY_MS`, inside that band
 * (`assembly.test.ts` holds it there).
 *
 * Both renderers read this file. The still writes each stage's delay, drop
 * and duration into its CSS animation (`vault/webgl/cafe/still.tsx`); the
 * WebGL renderer evaluates `stageAt` every frame it assembles. The curve is
 * the site's `--ease-out-expo`, the same control points the CSS token names,
 * so the two move alike.
 */

import { ROOF_STAGE, type Stage, STAGES } from './model'

/** One stage's travel and fade. */
export const STAGE_MS = 420
/** Between one stage's start and the next's. */
export const STEP_MS = 110
/** The whole assembly. */
export const ASSEMBLY_MS = STAGE_MS + STEP_MS * (STAGES.length - 1)

/**
 * How far each stage drops, in metres: the ground rises from below, the rest
 * come down from above. Short drops; a fade carries most of the arrival.
 */
export const DROP: Record<Stage, number> = {
  0: -0.35,
  1: 0.9,
  2: 1.1,
  3: 0.6,
  4: 0.45,
}

/** `--ease-out-expo` (`lib/styles/css/easings.css`). */
export const EASE_OUT_EXPO = [0.19, 1, 0.22, 1] as const

/** A CSS `cubic-bezier()` timing function, evaluated at `x` (0–1). */
export function cubicBezier(
  [x1, y1, x2, y2]: readonly [number, number, number, number],
  x: number
): number {
  if (x <= 0) return 0
  if (x >= 1) return 1
  const curve = (t: number, a: number, b: number) =>
    3 * a * t * (1 - t) ** 2 + 3 * b * t ** 2 * (1 - t) + t ** 3
  const slope = (t: number, a: number, b: number) =>
    3 * a * (1 - t) ** 2 + 6 * (b - a) * t * (1 - t) + 3 * (1 - b) * t ** 2

  let t = x
  for (let index = 0; index < 8; index++) {
    const error = curve(t, x1, x2) - x
    const d = slope(t, x1, x2)
    if (Math.abs(error) < 1e-6) return curve(t, y1, y2)
    if (Math.abs(d) < 1e-6) break
    t -= error / d
  }
  // Bisection, for the flat ends Newton's method can stall on.
  let lo = 0
  let hi = 1
  t = x
  for (let index = 0; index < 40; index++) {
    const value = curve(t, x1, x2)
    if (Math.abs(value - x) < 1e-7) break
    if (value < x) lo = t
    else hi = t
    t = (lo + hi) / 2
  }
  return curve(t, y1, y2)
}

/** When a stage starts, from the start of the assembly. */
export const stageDelay = (stage: Stage) => stage * STEP_MS

export interface StagePose {
  /** 0 before the stage starts, 1 once it has arrived. */
  readonly progress: number
  /** Metres still to travel, along y. */
  readonly lift: number
  /** Opacity, 0–1. */
  readonly alpha: number
}

/** A stage's pose `elapsed` ms into the assembly. */
export function stageAt(stage: Stage, elapsed: number): StagePose {
  const local = Math.min(
    1,
    Math.max(0, (elapsed - stageDelay(stage)) / STAGE_MS)
  )
  const progress = cubicBezier(EASE_OUT_EXPO, local)
  const lift = progress >= 1 ? 0 : DROP[stage] * (1 - progress)
  return { progress, lift, alpha: progress }
}

/** How far the roof's shade has fallen over the interior, 0–1. */
export const roofShadeAt = (elapsed: number) =>
  stageAt(ROOF_STAGE, elapsed).alpha

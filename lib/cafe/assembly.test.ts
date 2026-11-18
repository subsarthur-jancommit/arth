/**
 * The assembly is the reference's illustration class (§6): 600–900 ms, once,
 * one main action, then still. And it moves on the site's own curve, so the
 * still's CSS and the WebGL renderer move alike.
 */

import { describe, expect, it } from 'bun:test'
import { readFileSync } from 'node:fs'

import {
  ASSEMBLY_MS,
  cubicBezier,
  DROP,
  EASE_OUT_EXPO,
  STAGE_MS,
  stageAt,
  stageDelay,
  STEP_MS,
} from './assembly'
import { type Stage, STAGES } from './model'

const stages = STAGES.map((_, index) => index as Stage)

describe('the assembly', () => {
  it('takes between 600 and 900 ms', () => {
    expect(ASSEMBLY_MS).toBeGreaterThanOrEqual(600)
    expect(ASSEMBLY_MS).toBeLessThanOrEqual(900)
    expect(ASSEMBLY_MS).toBe(STAGE_MS + STEP_MS * (STAGES.length - 1))
  })

  it('starts empty and ends whole, every stage at rest', () => {
    for (const stage of stages) {
      const before = stageAt(stage, stageDelay(stage))
      expect(before.alpha).toBe(0)
      expect(before.lift).toBe(DROP[stage])
      const after = stageAt(stage, ASSEMBLY_MS)
      expect(after.alpha).toBe(1)
      expect(after.lift).toBe(0)
    }
  })

  it('brings the stages in order, each after the one before', () => {
    for (const stage of stages.slice(1)) {
      expect(stageDelay(stage)).toBe(stageDelay((stage - 1) as Stage) + STEP_MS)
    }
    // Halfway through, the ground is further on than the furniture.
    const half = ASSEMBLY_MS / 2
    expect(stageAt(0, half).progress).toBeGreaterThan(stageAt(4, half).progress)
  })

  it('holds still once it has arrived', () => {
    for (const stage of stages) {
      expect(stageAt(stage, ASSEMBLY_MS * 3)).toEqual(
        stageAt(stage, ASSEMBLY_MS)
      )
    }
  })

  it("eases out on the site's --ease-out-expo", () => {
    const css = readFileSync('lib/styles/css/easings.css', 'utf8')
    const match = /--ease-out-expo:\s*cubic-bezier\(([^)]+)\)/.exec(css)
    const points = (match?.[1] ?? '').split(',').map((value) => Number(value))
    expect(points).toEqual([...EASE_OUT_EXPO])
    // A sane curve: pinned ends, rising, fast out of the start.
    expect(cubicBezier(EASE_OUT_EXPO, 0)).toBe(0)
    expect(cubicBezier(EASE_OUT_EXPO, 1)).toBe(1)
    let last = 0
    for (let x = 0.05; x <= 1; x += 0.05) {
      const y = cubicBezier(EASE_OUT_EXPO, x)
      expect(y).toBeGreaterThanOrEqual(last)
      last = y
    }
    expect(cubicBezier(EASE_OUT_EXPO, 0.25)).toBeGreaterThan(0.6)
  })
})

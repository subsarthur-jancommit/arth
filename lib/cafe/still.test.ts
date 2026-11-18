/**
 * The still is a well-formed picture of the café: inside its box, every
 * reference resolving, each stage in few groups, light enough to inline.
 */

import { describe, expect, it } from 'bun:test'

import { STAGES } from './model'
import { clipConvex, still } from './still'

const points = (value: string) =>
  value
    .split(' ')
    .map((pair) => pair.split(',').map(Number) as [number, number])

describe('the still', () => {
  const picture = still()

  it('draws inside its 4:3 box', () => {
    expect(picture.width / picture.height).toBeCloseTo(4 / 3, 9)
    const outside: string[] = []
    for (const run of picture.runs) {
      for (const face of run.faces) {
        for (const [x, y] of points(face.base.points)) {
          if (x < 0 || y < 0 || x > picture.width || y > picture.height) {
            outside.push(`${face.id} at ${x},${y}`)
          }
        }
      }
    }
    expect(outside).toEqual([])
  })

  it('refers only to gradients, filters and clips it defines, each once', () => {
    const gradients = picture.gradients.map((gradient) => gradient.id)
    const clips = picture.clips.map((clip) => clip.id)
    expect(new Set(gradients).size).toBe(gradients.length)
    expect(new Set(clips).size).toBe(clips.length)
    for (const run of picture.runs) {
      for (const face of run.faces) {
        for (const shape of [face.base, face.shade]) {
          if (shape?.gradient) expect(gradients).toContain(shape.gradient)
        }
        for (const contact of face.contacts) {
          if (contact.clip) expect(clips).toContain(contact.clip)
          expect(picture.blurs[contact.blur]).toBeDefined()
        }
      }
    }
    for (const contact of picture.ground) {
      expect(picture.blurs[contact.blur]).toBeDefined()
    }
  })

  it('keeps each stage of the assembly in few groups', () => {
    for (const [stage] of STAGES.entries()) {
      expect(
        picture.runs.some((run) => run.stage === stage),
        `stage ${stage} draws nothing`
      ).toBe(true)
    }
    expect(picture.runs.length).toBeLessThanOrEqual(16)
  })

  it('drops every stage from above but the ground, which rises', () => {
    expect(picture.drops[0].y).toBeGreaterThan(0)
    for (const stage of [1, 2, 3, 4] as const) {
      expect(picture.drops[stage].y).toBeLessThan(0)
    }
  })

  it('is light enough to write into the page', () => {
    // The markup's bulk: every polygon's points and paint, with the tag.
    let bytes = 0
    const polygon = (value: string) => {
      bytes += value.length + 40
    }
    polygon(picture.pool.points)
    for (const run of picture.runs) {
      for (const face of run.faces) {
        polygon(face.base.points)
        if (face.shade) polygon(face.shade.points)
        for (const contact of face.contacts) polygon(contact.points)
      }
    }
    for (const clip of picture.clips) polygon(clip.points)
    expect(bytes).toBeLessThan(45_000)
  })

  it('clips one convex polygon by another', () => {
    const square = [
      [0, 0],
      [10, 0],
      [10, 10],
      [0, 10],
    ] as const
    const shifted = [
      [5, 5],
      [15, 5],
      [15, 15],
      [5, 15],
    ] as const
    const overlap = clipConvex(square, shifted)
    const xs = overlap.map(([x]) => x)
    const ys = overlap.map(([, y]) => y)
    expect(Math.min(...xs)).toBeCloseTo(5, 9)
    expect(Math.max(...xs)).toBeCloseTo(10, 9)
    expect(Math.min(...ys)).toBeCloseTo(5, 9)
    expect(Math.max(...ys)).toBeCloseTo(10, 9)
    // Either winding of the clip gives the same answer.
    expect(clipConvex(square, [...shifted].reverse()).length).toBe(
      overlap.length
    )
  })
})

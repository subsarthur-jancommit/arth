/**
 * The café model holds together: convex solids with outward faces, every
 * stage and need represented, shadows on surfaces that exist.
 *
 * Both renderers rely on these: the still's depth order assumes a solid's
 * faces never cover each other (convex, outward), the WebGL renderer culls
 * by winding, and a contact shadow is clipped to its receiver's top face.
 */

import { describe, expect, it } from 'bun:test'

import { centroid, cross, dot, length, sub } from './geometry'
import { FOOTPRINTS, PARTS, PLINTH_TOP, STAGES } from './model'

describe('the café model', () => {
  it('is made of convex solids whose faces are planar and turn outward', () => {
    const bad: string[] = []
    for (const part of PARTS) {
      part.solid.faces.forEach((face, index) => {
        const where = `${part.id} face ${index}`
        const [anchor] = face.points
        if (!anchor || face.points.length < 3) {
          bad.push(`${where}: fewer than three points`)
          return
        }
        if (Math.abs(length(face.normal) - 1) > 1e-9) {
          bad.push(`${where}: normal is not unit length`)
        }
        for (const point of face.points) {
          if (Math.abs(dot(face.normal, sub(point, anchor))) > 1e-6) {
            bad.push(`${where}: not planar`)
          }
        }
        if (
          dot(face.normal, sub(centroid(face.points), part.solid.center)) <= 0
        ) {
          bad.push(`${where}: faces inward`)
        }
        // Counter-clockwise from outside, and convex: every turn agrees with
        // the normal.
        face.points.forEach((point, i) => {
          const next = face.points[(i + 1) % face.points.length] ?? point
          const after = face.points[(i + 2) % face.points.length] ?? point
          const turn = cross(sub(next, point), sub(after, next))
          if (dot(turn, face.normal) < -1e-9) bad.push(`${where}: not convex`)
        })
        // Every other point of the solid is behind the face's plane.
        for (const other of part.solid.faces) {
          for (const point of other.points) {
            if (dot(face.normal, sub(point, anchor)) > 1e-6) {
              bad.push(`${where}: the solid is not convex here`)
            }
          }
        }
      })
    }
    expect(bad).toEqual([])
  })

  it('has parts in every stage of the assembly', () => {
    for (const [stage] of STAGES.entries()) {
      expect(
        PARTS.some((part) => part.stage === stage),
        `stage ${stage} is empty`
      ).toBe(true)
    }
  })

  it('gives each of the three needs parts of its own', () => {
    for (const need of ['building', 'systems', 'market'] as const) {
      expect(
        PARTS.some((part) => part.need === need),
        `${need} has no parts`
      ).toBe(true)
    }
  })

  it('names every part once', () => {
    const ids = PARTS.map((part) => part.id)
    expect(new Set(ids).size).toBe(ids.length)
  })

  it('stands on the ground, inside the plinth', () => {
    const plinth = PARTS.find((part) => part.id === 'plinth')
    expect(plinth).toBeDefined()
    const plan = plinth?.solid.faces.flatMap((face) => face.points) ?? []
    const minX = Math.min(...plan.map(([x]) => x))
    const maxX = Math.max(...plan.map(([x]) => x))
    const minZ = Math.min(...plan.map(([, , z]) => z))
    const maxZ = Math.max(...plan.map(([, , z]) => z))
    const outside: string[] = []
    for (const part of PARTS) {
      for (const [x, y, z] of part.solid.faces.flatMap((face) => face.points)) {
        // The roof overhangs the plinth at the glazed end, as roofs do.
        const overhang = part.id === 'roof' ? 0.5 : 0
        if (y < -1e-9) outside.push(`${part.id}: below the ground`)
        if (
          x < minX - overhang - 1e-9 ||
          x > maxX + 1e-9 ||
          z < minZ - 1e-9 ||
          z > maxZ + 1e-9
        ) {
          outside.push(`${part.id}: outside the plinth`)
        }
      }
    }
    expect([...new Set(outside)]).toEqual([])
  })

  it('lays every contact shadow on a part that has a top at its height', () => {
    for (const print of FOOTPRINTS) {
      expect(print.x1).toBeGreaterThan(print.x0)
      expect(print.z1).toBeGreaterThan(print.z0)
      expect(print.strength).toBeGreaterThan(0)
      expect(print.strength).toBeLessThanOrEqual(1)
      if (print.receiver === null) {
        expect(print.y).toBe(0)
        continue
      }
      const receiver = PARTS.find((part) => part.id === print.receiver)
      expect(receiver, `${print.id}: no part ${print.receiver}`).toBeDefined()
      const top = receiver?.solid.faces.find((face) => face.normal[1] > 0.9)
      expect(top, `${print.id}: ${print.receiver} has no top`).toBeDefined()
      const height = top?.points[0]?.[1] ?? Number.NaN
      expect(Math.abs(height - print.y)).toBeLessThan(1e-6)
    }
  })

  it('keeps the terrace at the plinth top', () => {
    const terrace = PARTS.find((part) => part.id === 'terrace')
    const top = terrace?.solid.faces.find((face) => face.normal[1] > 0.9)
    expect(top?.points[0]?.[1]).toBe(PLINTH_TOP)
  })
})

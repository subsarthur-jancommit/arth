import { describe, expect, it } from 'bun:test'

import { UNITS } from '@/lib/content/units'

import { MARK_STYLES, PLATES, TEXT_STYLES } from './index'

/**
 * What a plate has to be for both of its renderers to draw it: finite, inside
 * its own frame, and written only in the roles the two style tables know.
 */

/** Every coordinate in a path, read back from its data. */
function coordinates(d: string): number[][] {
  const points: number[][] = []
  for (const command of d.matchAll(/([MLA])([^MLAZ]*)/g)) {
    const numbers = (command[2] ?? '')
      .trim()
      .split(/[\s,]+/)
      .map(Number)
    // An arc's endpoint is its last two numbers; the rest are its shape.
    if (command[1] === 'A') points.push(numbers.slice(-2))
    else points.push(numbers)
  }
  return points
}

describe('working-drawing plates', () => {
  it('has one plate per unit, drawn for that unit', () => {
    expect(Object.keys(PLATES).toSorted()).toEqual([...UNITS].toSorted())
    for (const unit of UNITS) expect(PLATES[unit].unit).toBe(unit)
  })

  for (const unit of UNITS) {
    const plate = PLATES[unit]
    const [left, top, width, height] = plate.viewBox

    it(`${unit}: draws something, in roles both renderers know`, () => {
      // Anti-vacuum: an empty plate would pass every bound below.
      expect(plate.marks.length).toBeGreaterThan(5)
      expect(plate.texts.length).toBeGreaterThan(5)
      for (const mark of plate.marks) {
        expect(MARK_STYLES[mark.role]).toBeDefined()
        expect(mark.d).not.toContain('NaN')
      }
      for (const text of plate.texts) {
        expect(TEXT_STYLES[text.role]).toBeDefined()
        expect(Number.isFinite(text.x) && Number.isFinite(text.y)).toBe(true)
        expect(text.lines.every((line) => line.trim() !== '')).toBe(true)
      }
    })

    it(`${unit}: one path per role`, () => {
      const roles = plate.marks.map((mark) => mark.role)
      expect(new Set(roles).size).toBe(roles.length)
    })

    it(`${unit}: everything sits inside the frame it is shown in`, () => {
      const outside: string[] = []
      for (const mark of plate.marks) {
        for (const [x = 0, y = 0] of coordinates(mark.d)) {
          if (x < left || x > left + width || y < top || y > top + height) {
            outside.push(`${mark.role} at ${x},${y}`)
          }
        }
      }
      for (const text of plate.texts) {
        if (
          text.x < left ||
          text.x > left + width ||
          text.y < top ||
          text.y > top + height
        ) {
          outside.push(`“${text.lines.join(' ')}” at ${text.x},${text.y}`)
        }
      }
      expect(outside).toEqual([])
    })

    it(`${unit}: no dash between words, the mark the owner asked to retire`, () => {
      // "A-A" names a cutting plane and is the one hyphen a drawing needs.
      const words = plate.texts.flatMap((text) => text.lines)
      expect(words.filter((line) => /[–—]|\s-\s/u.test(line))).toEqual([])
    })
  }
})

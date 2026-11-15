import { describe, expect, it } from 'bun:test'

import { UNITS } from '@/lib/content/units'

import { MARK_STYLES, plateFor, PLATES, PLATES_EN, TEXT_STYLES } from './index'

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
    const byName = (a: string, b: string) => a.localeCompare(b)
    expect(Object.keys(PLATES).toSorted(byName)).toEqual(
      [...UNITS].toSorted(byName)
    )
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

/*
 * The English plates (R7, block L4, approved 15 November 2026): the same
 * drawing, only the words changed, and no Indonesian left in them.
 */
describe('working-drawing plates in English', () => {
  /** Lines that read the same in both languages: numbers and the cut letter. */
  const NEUTRAL = new Set(['1', '2', '3', '4', '01', 'A', 'BAR'])

  it('picks the plate by locale', () => {
    for (const unit of UNITS) {
      expect(plateFor(unit, 'id')).toBe(PLATES[unit])
      expect(plateFor(unit, 'en')).toBe(PLATES_EN[unit])
    }
  })

  for (const unit of UNITS) {
    const id = PLATES[unit]
    const en = PLATES_EN[unit]

    it(`${unit}: draws the same marks, with its text in the same places`, () => {
      expect(en.viewBox).toEqual(id.viewBox)
      expect(en.marks).toEqual(id.marks)
      expect(en.parts).toEqual(id.parts)
      expect(en.texts.map(({ role, x }) => [role, x])).toEqual(
        id.texts.map(({ role, x }) => [role, x])
      )
      // A run with more lines may move up by half a line to stay centred.
      const moved = en.texts.filter(
        (text, i) => Math.abs(text.y - (id.texts[i]?.y ?? text.y)) > 8
      )
      expect(moved).toEqual([])
    })

    it(`${unit}: keeps no Indonesian line`, () => {
      const indonesian = new Set(id.texts.flatMap((text) => text.lines))
      const left = en.texts
        .flatMap((text) => text.lines)
        .filter((line) => indonesian.has(line) && !NEUTRAL.has(line))
      expect(left).toEqual([])
    })

    it(`${unit}: writes decimals with a point, and no dash between words`, () => {
      const lines = en.texts.flatMap((text) => text.lines)
      expect(lines.filter((line) => /\d,\d/u.test(line))).toEqual([])
      expect(lines.filter((line) => /[–—]|\s-\s/u.test(line))).toEqual([])
    })
  }
})

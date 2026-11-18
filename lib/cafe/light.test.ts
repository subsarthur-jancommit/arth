/**
 * The light on the café does what the owner's reference (§5, path B) asks:
 * one broad key above and to the left, a fill at 0.25–0.4 of it, exposure
 * fixed on a reference material, nothing patched with intensity, and a
 * silhouette that reads in grayscale against the hero's ground.
 */

import { describe, expect, it } from 'bun:test'

import { contrast, luminance, type Linear, oklch, toLinear } from './color'
import { centroid, sub } from './geometry'
import {
  ALBEDO,
  FILL_RATIO,
  KEY,
  REFERENCE_LUMINANCE,
  shadedFaces,
  shadeOpen,
} from './light'
import { MATERIALS, REFERENCE_MATERIAL } from './model'
import { facesEye, TARGET, toCamera } from './view'

/**
 * The hero's ground behind the art viewport: the wash's lighter end
 * (`--hero-wash-to`, 12% paper in ink, `lib/styles/css/global.css`), which
 * is the harder ground for a dark face to stand out from.
 */
const INK = oklch(0.17, 0.006, 66)
const PAPER = oklch(0.964, 0.006, 92)
const GROUND: Linear = toLinear(
  oklch(INK.l + (PAPER.l - INK.l) * 0.12, 0.006, 70)
)

const colours = () =>
  shadedFaces().flatMap(({ paint }) =>
    [paint.base, paint.shade].flatMap((fill) =>
      fill ? [fill.from, fill.to] : []
    )
  )

describe('the light', () => {
  it('fixes the exposure on the reference material', () => {
    const lit = shadeOpen(ALBEDO[REFERENCE_MATERIAL], KEY)
    const authored = toLinear(MATERIALS[REFERENCE_MATERIAL])
    lit.forEach((channel, index) => {
      expect(channel).toBeCloseTo(authored[index] ?? Number.NaN, 9)
    })
    expect(luminance(lit)).toBeCloseTo(REFERENCE_LUMINANCE, 9)
  })

  it('keeps the fill between a quarter and two fifths of the key', () => {
    expect(FILL_RATIO).toBeGreaterThanOrEqual(0.25)
    expect(FILL_RATIO).toBeLessThanOrEqual(0.4)
  })

  it('puts the key above and to the left of the picture', () => {
    const [x, y] = sub(
      toCamera([TARGET[0] + KEY[0], TARGET[1] + KEY[1], TARGET[2] + KEY[2]]),
      toCamera(TARGET)
    )
    expect(x).toBeLessThan(-0.3)
    expect(y).toBeGreaterThan(0.5)
  })

  it('clips no colour: every face stays inside what sRGB can show', () => {
    for (const colour of colours()) {
      for (const channel of colour) {
        expect(channel).toBeGreaterThanOrEqual(0)
        expect(channel).toBeLessThanOrEqual(1)
      }
    }
  })

  it('lets the outline read in grayscale against the hero ground', () => {
    // The parts that make the café's outline: its plinth, its roofs, its walls.
    const outline = new Set([
      'plinth',
      'terrace',
      'roof',
      'kitchen',
      'kitchen-roof',
    ])
    const weak: string[] = []
    for (const { part, face, paint } of shadedFaces()) {
      if (!outline.has(part.id)) continue
      if (!facesEye(face.normal, centroid(face.points))) continue
      const fill = paint.shade ?? paint.base
      for (const colour of [fill.from, fill.to]) {
        const ratio = contrast(colour, GROUND)
        if (ratio < 1.4)
          weak.push(`${part.id} ${face.normal.join(',')}: ${ratio.toFixed(2)}`)
      }
    }
    expect(weak).toEqual([])
  })

  it('puts the room under the roof in shade once the roof is on', () => {
    const floor = shadedFaces().find(
      ({ part, face }) => part.id === 'floor' && face.normal[1] > 0.9
    )
    expect(floor?.paint.shade).not.toBeNull()
    const base = floor?.paint.base.from ?? [0, 0, 0]
    const shade = floor?.paint.shade?.from ?? [1, 1, 1]
    expect(luminance(shade)).toBeLessThan(luminance(base) * 0.7)
  })

  it('reads the same in every material: a face square to the key shows its own colour', () => {
    for (const name of Object.keys(MATERIALS) as (keyof typeof MATERIALS)[]) {
      const lit = shadeOpen(ALBEDO[name], KEY)
      expect(luminance(lit)).toBeCloseTo(luminance(ALBEDO[name]), 9)
    }
  })
})

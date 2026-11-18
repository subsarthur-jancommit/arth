/**
 * Colour for the café illustration: authored in OKLCH, lit in linear sRGB,
 * shown in encoded sRGB.
 *
 * Provenance: original work for this project. No third-party code copied.
 * The OKLab matrices are the published constants from Björn Ottosson's
 * definition of OKLab (2020), which are facts, not code.
 *
 * ## One conversion each way, and where each happens
 *
 * The materials are written the way the site writes colour, in `oklch()`.
 * Light is added in linear sRGB, because light adds linearly and encoded
 * values do not. The result is encoded to sRGB once, by `encode`, and both
 * renderers draw that encoded value: the still writes it as an SVG fill, and
 * the WebGL renderer writes it into its target unchanged (`vault/webgl/cafe`).
 * Nothing compensates for a colour space with light intensity
 * (the owner's reference, §5 path B): the lights are set in `light.ts`, on
 * linear values, and the encoding is the standard sRGB transfer function.
 */

/** A colour in linear sRGB, each channel 0–1 (and above 1 before clamping). */
export type Linear = readonly [number, number, number]

/** OKLCH, the way the site's tokens are written: L 0–1, C, h in degrees. */
export interface Oklch {
  readonly l: number
  readonly c: number
  readonly h: number
}

/** An OKLCH colour, written as the CSS function would read. */
export const oklch = (l: number, c: number, h: number): Oklch => ({ l, c, h })

/** OKLCH to linear sRGB, through OKLab. */
export function toLinear({ l, c, h }: Oklch): Linear {
  const hue = (h * Math.PI) / 180
  const a = c * Math.cos(hue)
  const b = c * Math.sin(hue)

  const lp = l + 0.396_337_777_4 * a + 0.215_803_757_3 * b
  const mp = l - 0.105_561_345_8 * a - 0.063_854_172_8 * b
  const sp = l - 0.089_484_177_5 * a - 1.291_485_548 * b

  const lc = lp ** 3
  const mc = mp ** 3
  const sc = sp ** 3

  return [
    4.076_741_662_1 * lc - 3.307_711_591_3 * mc + 0.230_969_929_2 * sc,
    -1.268_438_004_6 * lc + 2.609_757_401_1 * mc - 0.341_319_396_5 * sc,
    -0.004_196_086_3 * lc - 0.703_418_614_7 * mc + 1.707_614_701 * sc,
  ]
}

/** Relative luminance of a linear colour (Rec. 709 primaries, as sRGB's). */
export const luminance = ([r, g, b]: Linear) =>
  0.2126 * r + 0.7152 * g + 0.0722 * b

const clamp01 = (value: number) => Math.min(1, Math.max(0, value))

/** One channel through the sRGB transfer function. */
export function encodeChannel(value: number): number {
  const c = clamp01(value)
  return c <= 0.003_130_8 ? 12.92 * c : 1.055 * c ** (1 / 2.4) - 0.055
}

/** Linear sRGB to encoded sRGB, the one conversion on the way out. */
export const encode = ([r, g, b]: Linear): Linear => [
  encodeChannel(r),
  encodeChannel(g),
  encodeChannel(b),
]

/** Encoded sRGB, 0–1 per channel, as `#rrggbb`. */
export function hex([r, g, b]: Linear): string {
  const byte = (value: number) =>
    Math.round(clamp01(value) * 255)
      .toString(16)
      .padStart(2, '0')
  return `#${byte(r)}${byte(g)}${byte(b)}`
}

/** Encoded sRGB rounded to the 8-bit values both renderers can show. */
export const quantize = ([r, g, b]: Linear): Linear => [
  Math.round(clamp01(r) * 255) / 255,
  Math.round(clamp01(g) * 255) / 255,
  Math.round(clamp01(b) * 255) / 255,
]

/** WCAG contrast ratio between two linear colours. */
export function contrast(a: Linear, b: Linear): number {
  const la = luminance(a)
  const lb = luminance(b)
  return (Math.max(la, lb) + 0.05) / (Math.min(la, lb) + 0.05)
}

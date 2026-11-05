/**
 * Unit dialects, the script side: the name a page's dialect goes by, and how
 * a script takes the same values its stylesheet does.
 *
 * Provenance: original work for this project. No third-party code copied.
 *
 * `docs/MOTION-SPEC.md` §12.1: Arthur has one motion grammar and speaks it in
 * a dialect per unit. The values live in one token file,
 * `lib/styles/css/dialects.css`, keyed on `data-dialect`. `<Wrapper
 * dialect={unit}>` writes that attribute on the page's `<main>`, and only the
 * unit routes pass one, so every other page speaks the base grammar.
 *
 * A stylesheet reads a dialect through `var()`. A moment a script drives (a
 * GSAP tween, a Web Animations call) cannot, so it reads the computed custom
 * property here, from its own element. It then takes the dialect of the page
 * it is on, and no value is written down a second time.
 */

import type { Unit } from '@/lib/content/units'

import { easing } from './tokens'

/** A dialect is named after the unit that speaks it. */
export type Dialect = Unit

/** The four numbers of a `cubic-bezier()`, or `null` for anything else. */
function bezierOf(value: string): number[] | null {
  const inner = /cubic-bezier\(([^)]*)\)/u.exec(value)?.[1]
  if (inner === undefined) return null
  const numbers = inner.split(',').map((part) => Number(part.trim()))
  return numbers.length === 4 && numbers.every(Number.isFinite) ? numbers : null
}

function sameCurve(a: readonly number[], b: readonly number[]) {
  return a.every(
    (value, index) => Math.abs(value - (b[index] ?? Number.NaN)) < 1e-6
  )
}

/**
 * The GSAP ease for the dialect `element` is in, or `undefined` in the base
 * grammar, where the caller keeps its own.
 *
 * `--dialect-ease` computes to the curve itself, and GSAP does not take a
 * `cubic-bezier()`. So the curve is matched, number by number (a minifier
 * may write `.19` for `0.19`), against the curves `tokens.ts` already pairs
 * with a GSAP name. A curve outside that table answers `undefined` rather
 * than a guess: the tween keeping its own ease is a smaller error than an
 * invented one.
 */
export function dialectGsapEase(element: Element): string | undefined {
  const curve = bezierOf(
    getComputedStyle(element).getPropertyValue('--dialect-ease')
  )
  if (!curve) return undefined

  return Object.values(easing).find((token) => {
    const known = bezierOf(token.bezier)
    return known !== null && sameCurve(known, curve)
  })?.gsap
}

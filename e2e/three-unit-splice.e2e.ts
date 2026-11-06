import { expect, type Locator, test } from '@playwright/test'

import { transitionsAtRest } from './settle'

/**
 * `three-unit-splice`, three units joined into one working order
 * (`docs/MOTION-SPEC.md` §13.5, `vault/blocks/unit-sequence`).
 *
 * Each step arrives on its own. The splice inside a step joins it to the
 * next once that step has arrived: its two halves come in from their own
 * ends (`transform`), and the plate goes on across the joint only after both
 * are home (`opacity`, delayed past the halves). The level beneath the run
 * settles last, once the item after the three steps arrives. Under reduced
 * motion every joint is made and the level is level at once.
 *
 * `home-sequence.e2e.ts` holds the block's markup on the home page; this
 * holds its motion, on `/id/layanan`, where every sequence is shown. The
 * splice is addressed by its own structure (start half, plate, end half,
 * `vault/motion/splice`), the level by its place in the block's last item
 * (`vault/motion/level`): neither carries a class a test could trust.
 */

const PAGE = '/id/layanan'
const SEQUENCE = '[data-epic="three-unit-splice"]'
const SPLICE = 'span:has(> [data-side="start"] + span + [data-side="end"])'

declare global {
  var __arrived: number[]
}

/**
 * Each step's joint and the level, as a reader would see them now. Numbers
 * are rounded to three places and made positive, so a settled value compares
 * as exactly 0 or 1 rather than as float noise or `-0`; timings are in ms.
 */
async function joints(sequence: Locator) {
  return sequence.evaluate((root, splice) => {
    const round = (value: number) => Number(Math.abs(value).toFixed(3))
    const steps = [
      ...root.querySelectorAll(':scope > ol > li[data-reveal-item]'),
    ]
    const completion = root.querySelector(':scope > div[data-reveal-item]')
    const beam = completion?.querySelector(
      ':scope > [aria-hidden="true"] > div'
    )

    return {
      steps: steps.map((step) => {
        const joint = step.querySelector(splice)
        const [start, plate, end] = joint ? [...joint.children] : []
        const scale = (half: Element | undefined) =>
          half
            ? round(new DOMMatrixReadOnly(getComputedStyle(half).transform).a)
            : null
        const timing = (element: Element | undefined) => {
          if (!element) return null
          const style = getComputedStyle(element)
          return {
            delay: Math.round(Number.parseFloat(style.transitionDelay) * 1000),
            duration: Math.round(
              Number.parseFloat(style.transitionDuration) * 1000
            ),
          }
        }
        return {
          arrived: step.getAttribute('data-reveal-item') === 'visible',
          halves: joint ? [scale(start), scale(end)] : null,
          plate: plate ? round(Number(getComputedStyle(plate).opacity)) : null,
          halfTiming: timing(start),
          plateTiming: timing(plate),
        }
      }),
      level: {
        arrived: completion?.getAttribute('data-reveal-item') === 'visible',
        // A level beam's matrix has no `b`; a tilted one does.
        tilt: beam
          ? round(new DOMMatrixReadOnly(getComputedStyle(beam).transform).b)
          : null,
      },
    }
  }, SPLICE)
}

test.describe('three-unit-splice', () => {
  test('each joint is made as its step arrives, and the level settles after all three', async ({
    page,
  }) => {
    await page.goto(PAGE)

    const sequence = page.locator(SEQUENCE).last()
    await expect(sequence, 'the page has no sequence').toHaveAttribute(
      'data-reveal',
      'hidden'
    )

    // The last sequence on the page, so its end is still below the fold.
    const before = await joints(sequence)
    const waiting = before.steps.filter(
      (step) => step.halves !== null && !step.arrived
    )
    expect(
      waiting.length,
      'no joint was still waiting at load, so none can be seen being made'
    ).toBeGreaterThan(0)
    for (const step of waiting) {
      expect(step.halves, 'a waiting joint already has its halves').toEqual([
        0, 0,
      ])
      expect(step.plate, 'a waiting joint already has its plate').toBe(0)
    }
    expect(before.level.tilt, 'the sequence has no level').not.toBeNull()
    expect(before.level.arrived, 'the level arrived at load').toBe(false)
    expect(
      before.level.tilt,
      'the level is level before the run'
    ).toBeGreaterThan(0)

    // The plate goes on only once both halves are home.
    for (const step of before.steps) {
      if (!step.halfTiming || !step.plateTiming) continue
      expect(
        step.plateTiming.delay,
        'the plate is timed to go on before the halves meet'
      ).toBeGreaterThanOrEqual(step.halfTiming.delay + step.halfTiming.duration)
    }

    // Read in order, the way a reader scrolls: record when each item arrives.
    await sequence.evaluate((root) => {
      const items = [
        ...root.querySelectorAll(
          ':scope > ol > li[data-reveal-item], :scope > div[data-reveal-item]'
        ),
      ]
      const arrived: number[] = items.map((item) =>
        item.getAttribute('data-reveal-item') === 'visible' ? 0 : -1
      )
      globalThis.__arrived = arrived
      new MutationObserver(() => {
        for (const [index, item] of items.entries()) {
          if (
            arrived[index] === -1 &&
            item.getAttribute('data-reveal-item') === 'visible'
          ) {
            arrived[index] = performance.now()
          }
        }
      }).observe(root, {
        subtree: true,
        attributes: true,
        attributeFilter: ['data-reveal-item'],
      })
    })
    await page.evaluate(async () => {
      const step = window.innerHeight * 0.5
      for (let y = 0; y <= document.documentElement.scrollHeight; y += step) {
        window.scrollTo({ top: y, behavior: 'instant' })
        await new Promise((resolve) => setTimeout(resolve, 120))
      }
    })
    await transitionsAtRest(page)

    const arrived = await page.evaluate(() => globalThis.__arrived)
    expect(arrived, 'an item never arrived').not.toContain(-1)
    const level = arrived.at(-1) ?? 0
    expect(
      arrived.slice(0, -1).every((step) => step <= level),
      `the level arrived before a step it rests on: ${arrived.join(', ')}`
    ).toBe(true)

    const after = await joints(sequence)
    for (const step of after.steps) {
      if (step.halves === null) continue
      expect(step.halves, 'a joint was left open').toEqual([1, 1])
      expect(step.plate, 'a joint has no plate').toBe(1)
    }
    expect(after.level.tilt, 'the level never came to level').toBe(0)
  })

  test('under reduced motion every joint is made and the level is level at once', async ({
    browser,
  }) => {
    const context = await browser.newContext({ reducedMotion: 'reduce' })
    const page = await context.newPage()

    try {
      await page.goto(PAGE)
      expect(
        await page.evaluate(
          () => matchMedia('(prefers-reduced-motion: reduce)').matches
        ),
        'reduced-motion emulation did not apply'
      ).toBe(true)

      const sequences = page.locator(SEQUENCE)
      await expect(sequences.first()).toHaveAttribute('data-reveal', 'visible')
      const count = await sequences.count()

      for (let index = 0; index < count; index += 1) {
        const now = await joints(sequences.nth(index))
        const made = now.steps.filter((step) => step.halves !== null)
        expect(made.length, 'a sequence has no joint').toBeGreaterThan(0)
        for (const step of made) {
          expect(step.halves, 'a joint is open without a scroll').toEqual([
            1, 1,
          ])
          expect(step.plate, 'a joint has no plate without a scroll').toBe(1)
        }
        expect(now.level.tilt, 'a level is tilted without a scroll').toBe(0)
      }
    } finally {
      await context.close()
    }
  })
})

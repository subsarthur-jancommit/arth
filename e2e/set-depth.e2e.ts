import { expect, type Page, test } from '@playwright/test'

import { SIDES, sideTemplate } from '../lib/content/units'
import { localizedPath } from '../lib/i18n/paths'

/**
 * `set-depth`, the detail circle (`docs/MOTION-SPEC.md` §13.10, R6).
 *
 * A link press draws a ring round the point that was pressed, opens a circle
 * out of it until it covers the screen, and fades it off the new page while
 * the new title settles. A prefetched route commits long before a 400ms
 * circle closes, so the old page is held as a view-transition snapshot under
 * the circle: `vault/motion/page-transition` marks the root
 * `data-depth="rising"` and then `"covered"`, and `global.css` swaps the
 * held picture for the new page only once the circle is whole.
 *
 * The card's planned verification is what this file covers: the sequence
 * itself, a keyboard press opening from its link, Back keeping the faster
 * closing panel, a double press leaving nothing behind, and reduced motion
 * changing the page with no transition at all. `instant-navigation` and
 * `navigation-landing` stay as they were and must stay green.
 *
 * Measured from a side page to the contact page: a plain `<Link>` in `main`
 * (the first-step pill), and no shared element between the two pages, so no
 * morph or sheet takes precedence over the circle.
 */

const FROM = localizedPath(
  'id',
  sideTemplate('konstruksi', SIDES.konstruksi[0])
)
const TO = '/id/kontak'
const OVERLAY = '[data-page-transition]'

interface DepthRecord {
  /** `state:kind:depth:arrival` at every change of any of the four. */
  marks: string[]
  /** The transition types of every view transition the page started. */
  types: string[][]
  /** Where the circle opened, read the moment the overlay began covering. */
  origin: { x: number; y: number } | null
}

declare global {
  var __depth: DepthRecord
}

/**
 * Records the overlay's state and kind, the root's two attributes, and the
 * types of every view transition, for the whole life of the document.
 *
 * A `MutationObserver`, not a frame poll: `e2e/journey.e2e.ts` records how a
 * per-frame sample lost the `covering` state of a fast navigation.
 *
 * The observers attach once the document exists. An init script runs before
 * `<html>` is parsed, so observing `document.documentElement` there throws on
 * `null` and records nothing at all (e2e run 41275281002). The overlay is
 * looked for until it renders, since it may arrive after the first parse.
 */
async function record(page: Page) {
  await page.addInitScript(() => {
    const seen: DepthRecord = { marks: [], types: [], origin: null }
    globalThis.__depth = seen

    const original = document.startViewTransition?.bind(document)
    if (original) {
      document.startViewTransition = (argument) => {
        const types =
          argument && typeof argument === 'object'
            ? [...(argument.types ?? [])]
            : []
        seen.types.push(types)
        return original(argument)
      }
    }

    let overlay: Element | null = null
    const note = () => {
      const root = document.documentElement
      const state = overlay?.getAttribute('data-state') ?? '-'
      const kind = overlay?.getAttribute('data-kind') ?? '-'
      seen.marks.push(
        `${state}:${kind}:${root.dataset.depth ?? '-'}:${root.dataset.arrival ?? '-'}`
      )
      if (state === 'covering' && overlay instanceof HTMLElement) {
        seen.origin = {
          x: Number.parseFloat(overlay.style.getPropertyValue('--depth-x')),
          y: Number.parseFloat(overlay.style.getPropertyValue('--depth-y')),
        }
      }
    }

    const watchOverlay = (tries: number) => {
      overlay = document.querySelector('[data-page-transition]')
      if (overlay) {
        new MutationObserver(note).observe(overlay, {
          attributes: true,
          attributeFilter: ['data-state', 'data-kind'],
        })
      } else if (tries > 0) {
        setTimeout(() => watchOverlay(tries - 1), 100)
      }
    }

    const start = () => {
      new MutationObserver(note).observe(document.documentElement, {
        attributes: true,
        attributeFilter: ['data-depth', 'data-arrival'],
      })
      watchOverlay(100)
    }
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', start)
    } else {
      start()
    }
  })
}

/** What a finished navigation must leave behind: nothing. */
async function leftBehind(page: Page) {
  return page.evaluate(() => {
    const root = document.documentElement
    const overlay = document.querySelector('[data-page-transition]')
    const title = document.querySelector('main h1')
    return {
      depth: root.dataset.depth ?? null,
      arrival: root.dataset.arrival ?? null,
      parked: overlay
        ? overlay.getBoundingClientRect().top >= window.innerHeight
        : true,
      settling:
        title
          ?.getAnimations()
          .some(
            (animation) =>
              animation instanceof CSSAnimation &&
              animation.animationName === 'set-depth-settle'
          ) ?? false,
    }
  })
}

async function pressContact(page: Page, press: 'click' | 'dblclick') {
  const link = page.locator(`main a[href^="${TO}"]`).first()
  await expect(link, `no contact link in main on ${FROM}`).toBeVisible()
  await link[press]()
  await page.waitForURL((url) => url.pathname === TO)
}

const CLEAN = { depth: null, arrival: null, parked: true, settling: false }

test.describe('set-depth', () => {
  test('a press opens a detail circle over the swap, then the title settles', async ({
    page,
  }) => {
    await record(page)
    await page.goto(FROM)
    await page.waitForTimeout(1500)

    await pressContact(page, 'click')
    await expect(page.locator(OVERLAY)).toHaveAttribute('data-state', 'idle', {
      timeout: 5000,
    })
    await page.waitForTimeout(1200)

    const { marks, types } = await page.evaluate(() => globalThis.__depth)
    const trail = marks.join(', ')

    expect(
      marks.some((mark) => mark.startsWith('covering:depth:rising')),
      `the circle never opened over a held page: ${trail}`
    ).toBe(true)
    expect(
      marks.some((mark) => mark.startsWith('revealing:depth:covered')),
      `the circle faded before it had closed: ${trail}`
    ).toBe(true)
    expect(
      marks.some((mark) => mark.endsWith(':depth')),
      `the new title was never settled: ${trail}`
    ).toBe(true)
    /*
     * The hold. Without a view transition carrying `set-depth`, the swap
     * happens under a circle that has barely started, and the reader sees
     * the new page arrive before the circle covers it.
     */
    expect(
      types.some((list) => list.includes('set-depth')),
      `no view transition held the old page: ${JSON.stringify(types)}`
    ).toBe(true)

    expect(await leftBehind(page)).toEqual(CLEAN)
    await expect(page.locator('main h1').first()).toBeVisible()
  })

  test('a keyboard press opens the circle from the link it pressed', async ({
    page,
  }) => {
    await record(page)
    await page.goto(FROM)
    await page.waitForTimeout(1500)

    const link = page.locator(`main a[href^="${TO}"]`).first()
    await link.scrollIntoViewIfNeeded()
    await page.waitForTimeout(400)
    const box = await link.boundingBox()
    expect(box, 'the contact link has no box').not.toBeNull()

    await link.focus()
    await page.keyboard.press('Enter')
    await page.waitForURL((url) => url.pathname === TO)

    const { origin } = await page.evaluate(() => globalThis.__depth)
    expect(origin, 'the circle never opened').not.toBeNull()
    if (!box || !origin) return

    // The link's own centre stands in for a pointer a keyboard does not have.
    expect(origin.x).toBeGreaterThanOrEqual(box.x - 1)
    expect(origin.x).toBeLessThanOrEqual(box.x + box.width + 1)
    expect(origin.y).toBeGreaterThanOrEqual(box.y - 1)
    expect(origin.y).toBeLessThanOrEqual(box.y + box.height + 1)
  })

  test('back closes with the faster panel, not a circle', async ({ page }) => {
    await record(page)
    await page.goto(FROM)
    await page.waitForTimeout(1500)

    await pressContact(page, 'click')
    const overlay = page.locator(OVERLAY)
    await expect(overlay).toHaveAttribute('data-state', 'idle', {
      timeout: 5000,
    })
    await page.waitForTimeout(1000)
    await page.evaluate(() => {
      globalThis.__depth.marks = []
    })

    await page.goBack()
    await page.waitForURL((url) => url.pathname === FROM)
    // Long enough for the panel to have run, so `idle` below is its end and
    // not the moment before it started.
    await page.waitForTimeout(900)
    await expect(overlay).toHaveAttribute('data-state', 'idle', {
      timeout: 5000,
    })

    const { marks } = await page.evaluate(() => globalThis.__depth)
    const trail = marks.join(', ')
    expect(
      marks.some((mark) => mark.startsWith('covering:cover')),
      `going back ran no closing panel: ${trail}`
    ).toBe(true)
    expect(
      marks.some((mark) => mark.startsWith('covering:depth')),
      `going back opened a circle: ${trail}`
    ).toBe(false)
    await expect(overlay).toHaveAttribute('data-source', 'history')
    expect(await leftBehind(page)).toEqual(CLEAN)
  })

  test('a double press resolves to the destination and leaves nothing covering', async ({
    page,
  }) => {
    await page.goto(FROM)
    await page.waitForTimeout(1500)

    await pressContact(page, 'dblclick')
    await expect(page.locator(OVERLAY)).toHaveAttribute('data-state', 'idle', {
      timeout: 5000,
    })
    await page.waitForTimeout(1200)

    expect(await leftBehind(page)).toEqual(CLEAN)
    await expect(page.locator('main h1').first()).toBeVisible()
  })

  test('under reduced motion the page simply changes', async ({ browser }) => {
    const context = await browser.newContext({ reducedMotion: 'reduce' })
    const page = await context.newPage()

    try {
      await record(page)
      await page.goto(FROM)
      await page.waitForTimeout(1000)
      await expect(page.locator(OVERLAY)).toHaveCount(0)

      await pressContact(page, 'click')
      await page.waitForTimeout(1000)

      const { marks } = await page.evaluate(() => globalThis.__depth)
      expect(
        marks,
        'a circle or a settle ran for a reader who asked for no motion'
      ).toEqual([])
      expect(await leftBehind(page)).toEqual(CLEAN)
      await expect(page.locator('main h1').first()).toBeVisible()
    } finally {
      await context.close()
    }
  })
})

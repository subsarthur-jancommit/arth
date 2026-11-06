import type { Browser, BrowserContextOptions, Page } from '@playwright/test'
import { expect, test } from '@playwright/test'

import { waitForEntrance } from './page-settled'
import { webglIntent } from './webgl-intent'

/**
 * The home page's working drawings on each path a reader can be on — R4.
 *
 * `vault/blocks/passage` runs the three plates through a pinned frame, and on
 * a desktop with WebGL `vault/webgl/plate-material` lights them as a model.
 * Neither is allowed to cost a reader a plate: under reduced motion and with
 * scripting off every plate must sit in the flow, whole and visible (CLAUDE.md
 * #5), and where the lit plate takes over, the flat one may only step aside
 * once a frame has been drawn (#14).
 */

const PLATE = '[data-passage-plate]'

interface PlateFacts {
  top: number
  bottom: number
  opacity: number
  drawingOpacity: number
  transform: string
  named: boolean
}

function plateFacts(page: Page): Promise<PlateFacts[]> {
  return page.evaluate((selector) => {
    return [...document.querySelectorAll(selector)].map((plate) => {
      const box = plate.getBoundingClientRect()
      const drawing = plate.querySelector('svg[role="img"]')
      return {
        top: box.top + window.scrollY,
        bottom: box.bottom + window.scrollY,
        opacity: Number(getComputedStyle(plate).opacity),
        drawingOpacity: drawing ? Number(getComputedStyle(drawing).opacity) : 0,
        transform: getComputedStyle(plate).transform,
        named: Boolean(drawing?.querySelector('title')?.textContent?.trim()),
      }
    })
  }, PLATE)
}

async function factsWith(browser: Browser, options: BrowserContextOptions) {
  const context = await browser.newContext(options)
  const page = await context.newPage()
  try {
    await page.goto('/id', { waitUntil: 'domcontentloaded' })
    await page.waitForTimeout(1000)
    return await plateFacts(page)
  } finally {
    await context.close()
  }
}

function expectWhole(plates: PlateFacts[], path: string) {
  // Anti-vacuum: a home page with no reel would pass every check below.
  expect(plates.length, `${path}: no plates on the home page`).toBeGreaterThan(
    1
  )
  plates.forEach((plate, index) => {
    expect(plate.named, `${path}: plate ${index + 1} has no alt text`).toBe(
      true
    )
    expect(plate.opacity, `${path}: plate ${index + 1} is faded`).toBe(1)
    expect(plate.drawingOpacity, `${path}: drawing ${index + 1} hidden`).toBe(1)
    expect(plate.transform, `${path}: plate ${index + 1} is parked`).toBe(
      'none'
    )
    const previous = plates[index - 1]
    if (previous) {
      expect(
        plate.top,
        `${path}: plate ${index + 1} overlaps the one before it`
      ).toBeGreaterThanOrEqual(previous.bottom - 1)
    }
  })
}

test.describe('the plates are whole on every path', () => {
  test('under reduced motion every plate is in the flow', async ({
    browser,
  }) => {
    expectWhole(
      await factsWith(browser, { reducedMotion: 'reduce' }),
      'reduced motion'
    )
  })

  test('without JavaScript every plate is in the flow', async ({ browser }) => {
    expectWhole(
      await factsWith(browser, { javaScriptEnabled: false }),
      'no JavaScript'
    )
  })

  test('the lit plate takes over only once it has drawn', async ({ page }) => {
    await page.goto('/id', { waitUntil: 'domcontentloaded' })
    const intent = await webglIntent(page)
    test.skip(!intent.intended, intent.reason)

    // Before the passage is reached, every flat plate is still drawn.
    const before = await plateFacts(page)
    expect(before.length).toBeGreaterThan(1)

    await page.locator('[data-epic="arth-passage"]').scrollIntoViewIfNeeded()
    const live = page.locator('[data-plate-live]').first()
    await expect(live, 'the first plate was never lit').toBeAttached({
      timeout: 20_000,
    })

    // The flat drawing steps aside by opacity alone: it keeps its box, which
    // the lit plate measures, and its alt text.
    const flat = live.locator('svg[role="img"]')
    await expect(flat).toHaveCSS('opacity', '0')
    await expect(flat.locator('title')).not.toBeEmpty()
  })

  /*
   * Nothing waiting below the frame shows inside it — F4-04.
   *
   * A parked plate's drawing carries its entry pose (shifted up by 30%,
   * scaled by 1.2) from the moment the timeline is built. Until each plate
   * clipped its own drawing, plates two and three reached back up into the
   * frame and were drawn over plate one for its whole dwell: over its drawing
   * at 1440 × 900, over its caption at 390 × 844. Measured on production
   * before the fix: 35 of these 96 points landed on a parked plate.
   *
   * Hit-testing respects a clip, so a point in the frame that lands on a
   * plate other than the first is a plate showing where it must not. The
   * canvas-drawn plates clip to the same boxes in
   * `vault/webgl/plate-material/scene.tsx`; that half is not visible to
   * hit-testing and is not asserted here.
   */
  test('while the first plate rests, no other plate shows in the frame', async ({
    page,
  }) => {
    await page.goto('/id', { waitUntil: 'domcontentloaded' })
    await waitForEntrance(page)

    // The timeline exists once the second drawing carries its entry pose.
    const posed = await page
      .waitForFunction(
        () => {
          const drawing = document.querySelectorAll<HTMLElement>(
            '[data-passage-drawing]'
          )[1]
          return drawing?.style.transform.includes('translate') ?? false
        },
        undefined,
        { timeout: 15_000 }
      )
      .then(() => true)
      .catch(() => false)
    test.skip(!posed, 'the passage built no timeline, so nothing is parked')

    await page.evaluate(() => {
      const section = document.querySelector('section[data-passage]')
      if (!section) return
      const top = section.getBoundingClientRect().top + window.scrollY
      // Inside the first plate's share: the pin has begun, the next has not.
      window.scrollTo(0, top + window.innerHeight * 0.35)
    })
    // The pin scrubs with half a second of catch-up.
    await page.waitForTimeout(1500)

    const facts = await page.evaluate(() => {
      const frame = document
        .querySelector('[data-passage-frame]')
        ?.getBoundingClientRect()
      const plates = [...document.querySelectorAll('[data-passage-plate]')]
      if (!frame || plates.length < 2) return null
      const reach = Math.max(
        0,
        ...plates.slice(1).map((plate) => {
          const box = plate
            .querySelector('[data-passage-drawing]')
            ?.getBoundingClientRect()
          return box ? frame.bottom - box.top : 0
        })
      )
      let sampled = 0
      let first = 0
      let parked = 0
      for (let column = 1; column <= 8; column += 1) {
        for (let row = 1; row <= 12; row += 1) {
          const stack = document.elementsFromPoint(
            frame.left + (frame.width * column) / 9,
            frame.top + (frame.height * row) / 13
          )
          const owners = stack.map((element) =>
            element.closest('[data-passage-plate]')
          )
          sampled += 1
          if (owners.includes(plates[0] ?? null)) first += 1
          if (owners.some((owner) => owner && owner !== plates[0])) {
            parked += 1
          }
        }
      }
      return { reach: Math.round(reach), sampled, first, parked }
    })

    expect(facts, 'the home page has no reel').not.toBeNull()
    if (!facts) return
    expect(
      facts.first,
      'no point in the frame lands on the first plate, so this measured nothing'
    ).toBeGreaterThan(0)
    expect(
      facts.parked,
      `points, of ${facts.sampled} in the frame, that land on a plate still waiting below it (its drawing reaches ${facts.reach}px up into the frame)`
    ).toBe(0)
  })
})

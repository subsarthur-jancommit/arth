import type { Browser, BrowserContextOptions, Page } from '@playwright/test'
import { expect, test } from '@playwright/test'

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
})

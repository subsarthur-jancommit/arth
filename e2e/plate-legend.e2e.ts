import type { Browser, BrowserContextOptions, Page } from '@playwright/test'
import { expect, test } from '@playwright/test'

import { PLATE_NOTE, plateFor } from '../lib/plates'
import { waitForEntrance } from './page-settled'
import {
  WEBGL_ARRIVAL_MS,
  WEBGL_TEST_BUDGET_MS,
  webglIntent,
} from './webgl-intent'

/**
 * A plate's words are HTML a reader can read, on every path — G2.
 *
 * Inside the drawing a label is set at the plate's own scale: about seven
 * CSS pixels on a 1440 screen, four on a phone, less again once the lit
 * model leans back (`docs/G2-MATRIKS-RENDER.md`). So every plate shown
 * carries a legend (`vault/blocks/plate/legend.tsx`): the drawing's own
 * words at 16px, its headings and the note at 14px. This holds it:
 *
 * - beside the lit plate on the home page, whole inside the frame that clips
 *   it, at 1440 × 900 and at 1280 × 720;
 * - on a phone while the reel is pinned, where it names its groups;
 * - with reduced motion, without JavaScript and without WebGL, every plate's
 *   legend whole (`CLAUDE.md` #5 and #14);
 * - on `/layanan`, with the approved sentence that the café is an example;
 * - in English with English words, the plate's own (R7, block L4).
 */

interface LegendWord {
  kind: 'heading' | 'item' | 'statement' | 'note'
  text: string
  px: number
  visible: boolean
  /** Inside every box that clips it: the passage's frame and plate. */
  unclipped: boolean
}

const FIRST_PLATE = '[data-passage-plate]'

/** The legend words inside `scope`, as the page shows them. */
function legendWords(page: Page, scope: string): Promise<LegendWord[]> {
  return page.evaluate((selector) => {
    const root = document.querySelector(selector)
    if (!root) return []
    const kinds = {
      'data-plate-legend-heading': 'heading',
      'data-plate-legend-item': 'item',
      'data-plate-legend-statement': 'statement',
      'data-plate-legend-note': 'note',
    } as const
    const words: LegendWord[] = []
    for (const [attribute, kind] of Object.entries(kinds)) {
      for (const element of root.querySelectorAll(`[${attribute}]`)) {
        const box = element.getBoundingClientRect()
        let unclipped = true
        let clip = element.closest('[data-plate-clip]')
        while (clip) {
          const edge = clip.getBoundingClientRect()
          if (
            box.left < edge.left - 1 ||
            box.right > edge.right + 1 ||
            box.top < edge.top - 1 ||
            box.bottom > edge.bottom + 1
          ) {
            unclipped = false
          }
          clip = clip.parentElement?.closest('[data-plate-clip]') ?? null
        }
        words.push({
          kind,
          text: element.textContent?.trim() ?? '',
          px: Number.parseFloat(getComputedStyle(element).fontSize),
          visible: element.checkVisibility({
            opacityProperty: true,
            visibilityProperty: true,
          }),
          unclipped,
        })
      }
    }
    return words
  }, scope)
}

/** Each word's size floor: 16px for what the plate names, 14 for the rest. */
function expectReadable(words: LegendWord[], where: string, kinds: string[]) {
  const shown = words.filter((word) => kinds.includes(word.kind))
  // Anti-vacuum: a legend that rendered nothing would pass every floor.
  expect(shown.length, `${where}: no legend words`).toBeGreaterThan(0)
  for (const word of shown) {
    const floor = word.kind === 'item' || word.kind === 'statement' ? 16 : 14
    expect(word.visible, `${where}: "${word.text}" is not visible`).toBe(true)
    expect(word.unclipped, `${where}: "${word.text}" is clipped`).toBe(true)
    expect(
      word.px,
      `${where}: "${word.text}" is set at ${word.px}px`
    ).toBeGreaterThanOrEqual(floor)
  }
}

async function withPage<T>(
  browser: Browser,
  options: BrowserContextOptions,
  run: (page: Page) => Promise<T>
): Promise<T> {
  const context = await browser.newContext(options)
  try {
    return await run(await context.newPage())
  } finally {
    await context.close()
  }
}

/** Scrolls the home page's pin to the first plate's rest. */
async function restOnFirstPlate(page: Page) {
  // The pin is GSAP's, built once the page has hydrated.
  await page
    .locator('.pin-spacer > section[data-passage]')
    .waitFor({ state: 'attached', timeout: 15_000 })
    .catch(() => {
      // Reported by the check below.
    })
  const pinned = await page.evaluate(() => {
    const section = document.querySelector<HTMLElement>('section[data-passage]')
    const spacer = section?.parentElement
    if (!section || !spacer?.classList.contains('pin-spacer')) return false
    const top = spacer.getBoundingClientRect().top + window.scrollY
    window.scrollTo(
      0,
      Math.round(top + (spacer.offsetHeight - section.offsetHeight) * 0.16)
    )
    return true
  })
  expect(pinned, 'the passage is not pinned').toBe(true)
}

test.describe('plate legends', () => {
  test.describe.configure({ timeout: WEBGL_TEST_BUDGET_MS })

  for (const viewport of [
    { width: 1440, height: 900 },
    { width: 1280, height: 720 },
  ]) {
    test(`beside the lit plate, whole in its frame at ${viewport.width} × ${viewport.height}`, async ({
      browser,
    }) => {
      await withPage(browser, { viewport }, async (page) => {
        await page.goto('/id', { waitUntil: 'domcontentloaded' })
        await waitForEntrance(page)
        const intent = await webglIntent(page)
        expect(intent.intended, intent.reason).toBe(true)
        await restOnFirstPlate(page)
        await expect(
          page.locator(`${FIRST_PLATE} [data-plate-material]`).first()
        ).toHaveAttribute('data-plate-live', '', { timeout: WEBGL_ARRIVAL_MS })
        await page.waitForTimeout(1500)
        expectReadable(
          await legendWords(page, FIRST_PLATE),
          `home ${viewport.width}`,
          ['heading', 'item']
        )
      })
    })
  }

  test('on a phone with the reel pinned, its groups are named', async ({
    browser,
  }) => {
    await withPage(
      browser,
      {
        viewport: { width: 390, height: 844 },
        deviceScaleFactor: 3,
        isMobile: true,
        hasTouch: true,
      },
      async (page) => {
        await page.goto('/id', { waitUntil: 'domcontentloaded' })
        await waitForEntrance(page)
        await restOnFirstPlate(page)
        await page.waitForTimeout(1500)
        expectReadable(
          await legendWords(page, FIRST_PLATE),
          'home phone, pinned',
          ['heading']
        )
      }
    )
  })

  for (const [path, options] of [
    ['reduced motion', { reducedMotion: 'reduce' }],
    ['no JavaScript', { javaScriptEnabled: false }],
  ] as const) {
    for (const viewport of [
      { width: 1440, height: 900 },
      { width: 390, height: 844 },
    ]) {
      test(`${path} at ${viewport.width}: every plate's legend is whole`, async ({
        browser,
      }) => {
        await withPage(browser, { ...options, viewport }, async (page) => {
          await page.goto('/id', { waitUntil: 'domcontentloaded' })
          await page.waitForTimeout(1000)
          const plates = await page.locator('[data-passage-plate]').count()
          expect(plates, 'no plates on the home page').toBeGreaterThan(1)
          for (let index = 1; index <= plates; index += 1) {
            expectReadable(
              await legendWords(
                page,
                `[data-passage-plate]:nth-child(${index})`
              ),
              `${path}, plate ${index}`,
              ['heading', 'item', 'statement']
            )
          }
        })
      })
    }
  }

  test('without WebGL the flat plate and its legend stand together', async ({
    browser,
  }) => {
    await withPage(
      browser,
      { viewport: { width: 1440, height: 900 } },
      async (page) => {
        // A browser without WebGL: the site's own test then mounts no canvas.
        await page.addInitScript(() => {
          const original = HTMLCanvasElement.prototype.getContext
          Object.defineProperty(HTMLCanvasElement.prototype, 'getContext', {
            configurable: true,
            writable: true,
            value: function getContext(
              this: HTMLCanvasElement,
              kind: string,
              ...rest: unknown[]
            ) {
              if (kind.includes('webgl')) return null
              return Reflect.apply(original, this, [kind, ...rest])
            },
          })
        })
        await page.goto('/id', { waitUntil: 'domcontentloaded' })
        await waitForEntrance(page)
        await restOnFirstPlate(page)
        await page.waitForTimeout(1500)
        await expect(page.locator('[data-plate-live]')).toHaveCount(0)
        await expect(
          page.locator(`${FIRST_PLATE} svg[data-plate]`).first()
        ).toHaveCSS('opacity', '1')
        expectReadable(
          await legendWords(page, FIRST_PLATE),
          'home without WebGL',
          ['heading', 'item']
        )
      }
    )
  })

  for (const locale of ['id', 'en'] as const) {
    for (const viewport of [
      { width: 1440, height: 900 },
      { width: 390, height: 844 },
    ]) {
      test(`/${locale}/layanan at ${viewport.width}: the legend and the note`, async ({
        browser,
      }) => {
        await withPage(browser, { viewport }, async (page) => {
          await page.goto(`/${locale}/layanan`, {
            waitUntil: 'domcontentloaded',
          })
          const step = page.locator('li:has(svg[data-plate])').first()
          await step.scrollIntoViewIfNeeded()
          await page.waitForTimeout(1500)
          const words = await legendWords(page, 'li:has(svg[data-plate])')
          expectReadable(words, `/${locale}/layanan`, [
            'heading',
            'item',
            'note',
          ])
          expect(
            words.filter((word) => word.kind === 'note').map((w) => w.text)
          ).toEqual([PLATE_NOTE[locale]])
        })
      })
    }
  }

  test('in English, the legend is the plate’s own English', async ({
    browser,
  }) => {
    await withPage(
      browser,
      { viewport: { width: 1440, height: 900 }, reducedMotion: 'reduce' },
      async (page) => {
        await page.goto('/en', { waitUntil: 'domcontentloaded' })
        const unit = await page
          .locator(`${FIRST_PLATE} svg[data-plate]`)
          .first()
          .getAttribute('data-plate')
        expect(unit).toBe('konstruksi')
        const expected = plateFor('konstruksi', 'en').legend.groups.flatMap(
          (group) => [group.heading, ...group.items]
        )
        const shown = (await legendWords(page, FIRST_PLATE))
          .filter((word) => word.kind === 'heading' || word.kind === 'item')
          .map((word) => word.text)
        expect(shown.toSorted()).toEqual(expected.toSorted())
      }
    )
  })
})

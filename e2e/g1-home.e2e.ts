import type { Browser, Page, TestInfo } from '@playwright/test'
import { expect, test } from '@playwright/test'

import { SIDES } from '../lib/content/units'

/**
 * G1's home page (`docs/RENCANA-VISUAL-GERAK.md`, the reference's §3 and §4):
 * the hero as a scene shell, the need chooser straight after it, a solid
 * headline at rest, and the screenshots the owner judges it by.
 *
 * Desktop project only: each test sets the viewport it is about, and the
 * phone and zoom cases open contexts of their own.
 *
 * ## The screenshots
 *
 * Written to `testInfo.outputPath()` and attached by path, so CI's
 * `playwright-report` artifact carries them under `test-results/` for a
 * passing run too.
 */

const LOCALES = ['id', 'en'] as const
const WIDTHS = [360, 390, 768, 1024, 1440] as const

/** The five buyer routes, in the chooser's order, and Bergabung's. */
const BUYER_SIDES = [
  ['konstruksi', SIDES.konstruksi[0]],
  ['konstruksi', SIDES.konstruksi[1]],
  ['teknologi', SIDES.teknologi[0]],
  ['teknologi', SIDES.teknologi[1]],
  ['peekabo', SIDES.peekabo[0]],
] as const
const JOIN_SIDE = ['peekabo', SIDES.peekabo[1]] as const

const routeOf = (locale: string, [unit, side]: readonly [string, string]) =>
  `/${locale}/${unit}/${side}`

/** Waits for the faces, the entrance and the headline's rise. */
async function settle(page: Page) {
  await page.waitForLoadState('networkidle')
  await page.evaluate(async () => {
    await document.fonts.ready
  })
  await page.waitForTimeout(2600)
}

async function shoot(
  page: Page,
  testInfo: TestInfo,
  name: string,
  fullPage = false
) {
  const target = testInfo.outputPath(`${name}.png`)
  await page.screenshot({ path: target, fullPage })
  await testInfo.attach(name, { path: target, contentType: 'image/png' })
}

async function phone(browser: Browser, options: { javaScript?: boolean } = {}) {
  const context = await browser.newContext({
    viewport: { width: 390, height: 844 },
    deviceScaleFactor: 3,
    isMobile: true,
    hasTouch: true,
    javaScriptEnabled: options.javaScript ?? true,
  })
  return { context, page: await context.newPage() }
}

/** The chooser's links, in document order. */
function chooserLinks(page: Page) {
  return page
    .locator('[data-need-chooser]')
    .evaluate((chooser) =>
      [...chooser.querySelectorAll('a[href]')].map((link) =>
        link.getAttribute('href')
      )
    )
}

test.describe('no sideways scroll', () => {
  for (const locale of LOCALES) {
    for (const width of WIDTHS) {
      test(`/${locale} at ${width}px`, async ({ page }) => {
        await page.setViewportSize({ width, height: 900 })
        await page.goto(`/${locale}`)
        await settle(page)

        const measured = await page.evaluate(() => {
          const out = (selector: string) =>
            [...document.querySelectorAll(selector)]
              .filter((node) => node.getClientRects().length > 0)
              .filter((node) => {
                const rect = node.getBoundingClientRect()
                return rect.left < -1 || rect.right > window.innerWidth + 1
              })
              .map((node) => (node.textContent ?? '').trim().slice(0, 40))
          return {
            sideways: document.documentElement.scrollWidth - window.innerWidth,
            outside: [
              ...out('header a, header button'),
              ...out('main h1'),
              ...out('[data-need-chooser] a, [data-need-chooser] h2'),
            ],
          }
        })

        expect(
          measured.sideways,
          'the page scrolls sideways'
        ).toBeLessThanOrEqual(0)
        expect(measured.outside, 'past the screen edge').toEqual([])
      })
    }
  }
})

test.describe('the need chooser', () => {
  test.use({ viewport: { width: 1440, height: 900 } })

  test('the five buyer routes and Bergabung, in order', async ({ page }) => {
    await page.goto('/id')
    await settle(page)

    expect(await chooserLinks(page)).toEqual([
      ...BUYER_SIDES.map((side) => routeOf('id', side)),
      routeOf('id', JOIN_SIDE),
    ])
    // Three needs, with two, two and one routes.
    const counts = await page
      .locator('[data-need-chooser] [data-need]')
      .evaluateAll((needs) =>
        needs
          .filter((need) => need.tagName === 'LI')
          .map((need) => need.querySelectorAll('a[href]').length)
      )
    expect(counts).toEqual([2, 2, 1])
  })

  test('it starts in the first screen at 1440 × 900', async ({ page }) => {
    await page.goto('/id')
    await settle(page)
    const top = await page
      .locator('[data-need-chooser]')
      .evaluate((node) => node.getBoundingClientRect().top)
    expect(top, 'the needs start below the first screen').toBeLessThan(900)
  })

  test('every route is reached by Tab, and each is at least 44px tall', async ({
    page,
  }) => {
    await page.goto('/id')
    await settle(page)
    const expected = [
      ...BUYER_SIDES.map((side) => routeOf('id', side)),
      routeOf('id', JOIN_SIDE),
    ]

    const reached: string[] = []
    for (let i = 0; i < 40 && reached.length < expected.length; i += 1) {
      await page.keyboard.press('Tab')
      const stop = await page.evaluate(() => {
        const active = document.activeElement
        if (!active?.closest('[data-need-chooser]')) return null
        const rect = active.getBoundingClientRect()
        return { href: active.getAttribute('href') ?? '', height: rect.height }
      })
      if (!stop) continue
      expect(stop.height, `${stop.href} is under 44px`).toBeGreaterThanOrEqual(
        44
      )
      reached.push(stop.href)
    }
    expect(reached).toEqual(expected)
  })

  test('a route leads to its page', async ({ page }) => {
    await page.goto('/id')
    await settle(page)
    const target = routeOf('id', BUYER_SIDES[2])
    await page.locator(`[data-need-chooser] a[href="${target}"]`).click()
    await expect(page).toHaveURL(new RegExp(`${target}$`))
  })

  test('without JavaScript every route is there and leads somewhere', async ({
    browser,
  }) => {
    const { context, page } = await phone(browser, { javaScript: false })
    try {
      await page.goto('/id', { waitUntil: 'load' })
      expect(await chooserLinks(page)).toEqual([
        ...BUYER_SIDES.map((side) => routeOf('id', side)),
        routeOf('id', JOIN_SIDE),
      ])
      const join = routeOf('id', JOIN_SIDE)
      await page.locator(`[data-need-chooser] a[href="${join}"]`).click()
      await expect(page).toHaveURL(new RegExp(`${join}$`))
    } finally {
      await context.close()
    }
  })

  test('in English the routes keep their English pages', async ({ page }) => {
    await page.goto('/en')
    await settle(page)
    expect(await chooserLinks(page)).toEqual([
      ...BUYER_SIDES.map((side) => routeOf('en', side)),
      routeOf('en', JOIN_SIDE),
    ])
  })
})

test.describe('the hero', () => {
  test('on a phone: headline, scope, action, then the needs', async ({
    browser,
  }) => {
    const { context, page } = await phone(browser)
    try {
      await page.goto('/id')
      await settle(page)
      const order = await page.evaluate(() => {
        const top = (selector: string) => {
          const node = document.querySelector(selector)
          return node && node.getClientRects().length > 0
            ? node.getBoundingClientRect().top
            : null
        }
        return {
          h1: top('main h1'),
          scope: top('main h1 ~ p'),
          action: top('main a[data-press="cta"]'),
          needs: top('[data-need-chooser]'),
          art: top('[data-art-viewport]'),
        }
      })
      expect(order.h1).not.toBeNull()
      expect(order.scope ?? 0).toBeGreaterThan(order.h1 ?? 0)
      expect(order.action ?? 0).toBeGreaterThan(order.scope ?? 0)
      expect(order.needs ?? 0).toBeGreaterThan(order.action ?? 0)
      // The illustration is optional on a phone, and here it is left out,
      // so nothing comes between the action and the needs.
      expect(order.art).toBeNull()
    } finally {
      await context.close()
    }
  })

  test('on desktop: the title in 7 columns, the art in 5', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 })
    await page.goto('/id')
    await settle(page)
    const boxes = await page.evaluate(() => {
      const box = (selector: string) =>
        document.querySelector(selector)?.getBoundingClientRect() ?? null
      const reading = document.querySelector('main h1')?.parentElement ?? null
      return {
        reading: reading?.getBoundingClientRect() ?? null,
        art: box('[data-art-viewport]'),
      }
    })
    expect(boxes.reading).not.toBeNull()
    expect(boxes.art).not.toBeNull()
    if (!boxes.reading || !boxes.art) return
    // 7 of 12 columns against 5: the reading layer is the wider one, and
    // the two do not overlap.
    expect(boxes.reading.width).toBeGreaterThan(boxes.art.width)
    expect(boxes.reading.right).toBeLessThanOrEqual(boxes.art.left)
    // The art's box is fixed by its ratio, 4:3.
    expect(Math.abs(boxes.art.width / boxes.art.height - 4 / 3)).toBeLessThan(
      0.02
    )
  })

  test('the headline is solid at rest: weight, fill, no mask, no layer', async ({
    page,
  }) => {
    await page.setViewportSize({ width: 1440, height: 900 })
    await page.goto('/id')
    await settle(page)
    const headline = await page.locator('main h1').evaluate((h1) => {
      const style = getComputedStyle(h1)
      const masks = [...h1.querySelectorAll('*')].filter(
        (node) => getComputedStyle(node).overflow === 'clip'
      ).length
      return {
        weight: Number(style.fontWeight),
        opacity: Number(style.opacity),
        filter: style.filter,
        stroke: style.getPropertyValue('-webkit-text-stroke-width'),
        fill: style.getPropertyValue('-webkit-text-fill-color'),
        color: style.color,
        willChange: style.willChange,
        masks,
        text: (h1.textContent ?? '').trim(),
      }
    })
    expect(headline.text).not.toBe('')
    expect(headline.weight).toBeGreaterThanOrEqual(700)
    expect(headline.opacity).toBe(1)
    expect(headline.filter).toBe('none')
    expect(Number.parseFloat(headline.stroke || '0')).toBe(0)
    expect(headline.fill).toBe(headline.color)
    expect(headline.willChange).toBe('auto')
    expect(headline.masks, 'line masks left on the headline at rest').toBe(0)
  })

  /*
   * The split's own stylesheet, applied. G2's render matrix found that
   * `text-reveal.module.css` named classes SplitText never wrote, so its
   * clip had matched nothing. Caught while the headline is still split:
   * each mask is a `split-line-mask` and stays clipped with SplitText's
   * inline clip taken off, so the clip is the stylesheet's; each line is a
   * `split-line` that clips nothing itself, so no line cuts its own
   * descenders. The test above holds the other half: at rest no mask is
   * left at all.
   */
  test('while the headline rises, its masks clip and its lines do not', async ({
    page,
  }) => {
    await page.setViewportSize({ width: 1440, height: 900 })
    await page.goto('/id', { waitUntil: 'domcontentloaded' })
    const split = await page
      .waitForFunction(
        () => {
          const h1 = document.querySelector('main h1')
          // Split, the headline's children are its masks; plain, it has none.
          const masks = h1 ? [...h1.children] : []
          if (masks.length === 0) return false
          const lines = masks.flatMap((mask) => [...mask.children])
          for (const mask of masks) {
            if (mask instanceof HTMLElement) {
              mask.style.removeProperty('overflow')
            }
          }
          const clipped = (node: Element) =>
            getComputedStyle(node).overflow !== 'visible'
          return {
            masks: masks.length,
            namedMasks: masks.filter((mask) =>
              mask.classList.contains('split-line-mask')
            ).length,
            clippedMasks: masks.filter(clipped).length,
            lines: lines.length,
            namedLines: lines.filter((line) =>
              line.classList.contains('split-line')
            ).length,
            clippedLines: lines.filter(clipped).length,
          }
        },
        undefined,
        { timeout: 15_000, polling: 16 }
      )
      .then((handle) => handle.jsonValue())
      .catch(() => null)
    expect(split, 'the headline was never caught split').toBeTruthy()
    if (!split) return
    expect(split.lines).toBeGreaterThan(0)
    expect(split.namedMasks).toBe(split.masks)
    expect(split.clippedMasks, 'a mask clipped by SplitText alone').toBe(
      split.masks
    )
    expect(split.namedLines).toBe(split.lines)
    expect(split.clippedLines, 'a line that clips its own glyphs').toBe(0)
  })

  test('under reduced motion everything is there, still', async ({
    browser,
  }) => {
    const context = await browser.newContext({
      viewport: { width: 1440, height: 900 },
      reducedMotion: 'reduce',
    })
    const page = await context.newPage()
    try {
      await page.goto('/id')
      await page.waitForLoadState('networkidle')
      await page.waitForTimeout(800)
      const hidden = await page.evaluate(() =>
        [
          ...document.querySelectorAll(
            'main h1, main h1 ~ *, [data-need-chooser] a, [data-need-chooser] h2'
          ),
        ]
          .filter((node) => {
            const style = getComputedStyle(node)
            return (
              Number(style.opacity) < 1 ||
              style.visibility === 'hidden' ||
              node.getClientRects().length === 0
            )
          })
          .map((node) => (node.textContent ?? '').trim().slice(0, 40))
      )
      expect(hidden, 'left invisible under reduced motion').toEqual([])
    } finally {
      await context.close()
    }
  })
})

test.describe('at 200% zoom', () => {
  /*
   * A 1440 × 900 screen at 200%: the layout viewport is 720 × 450 CSS
   * pixels at a device pixel ratio of 2, which is what browser zoom does to
   * layout. The headline, the action and the needs must neither clip nor
   * collide, and nothing may scroll sideways.
   */
  for (const locale of LOCALES) {
    test(`/${locale}: nothing clips or collides`, async ({
      browser,
    }, testInfo) => {
      const context = await browser.newContext({
        viewport: { width: 720, height: 450 },
        deviceScaleFactor: 2,
      })
      const page = await context.newPage()
      try {
        await page.goto(`/${locale}`)
        await settle(page)
        const measured = await page.evaluate(() => {
          const h1 = document.querySelector('main h1')
          const cta = document.querySelector('main a[data-press="cta"]')
          const header = document.querySelector('header')
          const rect = (node: Element | null) =>
            node?.getBoundingClientRect() ?? null
          return {
            sideways: document.documentElement.scrollWidth - window.innerWidth,
            h1: rect(h1),
            h1Clipped: h1 ? h1.scrollWidth > h1.clientWidth + 1 : true,
            cta: rect(cta),
            headerBottom: rect(header)?.bottom ?? 0,
          }
        })
        expect(measured.sideways).toBeLessThanOrEqual(0)
        expect(measured.h1Clipped, 'the headline is clipped').toBe(false)
        expect(measured.h1?.top ?? 0).toBeGreaterThanOrEqual(
          measured.headerBottom
        )
        expect(measured.cta?.top ?? 0).toBeGreaterThan(measured.h1?.bottom ?? 0)
        await shoot(page, testInfo, `home-zoom-200-${locale}`)
      } finally {
        await context.close()
      }
    })
  }
})

test.describe('for the owner to look at', () => {
  for (const locale of LOCALES) {
    test(`/${locale} at 1440 × 900`, async ({ page }, testInfo) => {
      await page.setViewportSize({ width: 1440, height: 900 })
      await page.goto(`/${locale}`)
      await settle(page)
      await page.mouse.move(1, 899)
      await shoot(page, testInfo, `home-1440-${locale}`)
    })

    test(`/${locale} at 390 × 844`, async ({ browser }, testInfo) => {
      const { context, page } = await phone(browser)
      try {
        await page.goto(`/${locale}`)
        await settle(page)
        await shoot(page, testInfo, `home-390-${locale}`)
        // The first screen and the one after it: the needs on a phone.
        await page.evaluate(() => window.scrollTo(0, window.innerHeight * 0.8))
        await page.waitForTimeout(1200)
        await shoot(page, testInfo, `home-390-${locale}-needs`)
      } finally {
        await context.close()
      }
    })
  }
})

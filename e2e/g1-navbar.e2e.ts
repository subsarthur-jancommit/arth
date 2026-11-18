import type { Browser, Page, TestInfo } from '@playwright/test'
import { expect, test } from '@playwright/test'

/**
 * G1's header contract (`docs/RENCANA-VISUAL-GERAK.md`, the reference's §4):
 * three zones that never collide, one current route, a keyboard path from
 * the skip link through the capsule to the action, a layout that holds at
 * 200% zoom, and the screenshots the owner judges it by.
 *
 * Desktop project only: each test sets the viewport it is about, and the
 * phone screenshot opens a phone context of its own.
 *
 * ## The screenshots
 *
 * Written to `testInfo.outputPath()` and attached by path, so CI's
 * `playwright-report` artifact carries them under `test-results/` for a
 * passing run too (`.github/workflows/ci.yml`, "Upload Playwright report").
 */

const ROW_WIDTHS = [1024, 1280, 1440] as const

/** Waits for the faces and for the header's own script. */
async function settle(page: Page) {
  await page.waitForLoadState('networkidle')
  await page.evaluate(async () => {
    await document.fonts.ready
  })
  await page.waitForTimeout(400)
}

async function shoot(
  page: Page,
  testInfo: TestInfo,
  name: string,
  clip?: { x: number; y: number; width: number; height: number }
) {
  const target = testInfo.outputPath(`${name}.png`)
  await page.screenshot({ path: target, ...(clip && { clip }) })
  await testInfo.attach(name, { path: target, contentType: 'image/png' })
}

/** The boxes of the three zones, and whether the bar overflows. */
function zones(page: Page) {
  return page.getByRole('banner').evaluate((bar) => {
    const box = (node: Element | null) => {
      if (!node || node.getClientRects().length === 0) return null
      const rect = node.getBoundingClientRect()
      return { left: rect.left, right: rect.right, width: rect.width }
    }
    const nav = bar.querySelector('nav[aria-label] > ul')
    const tools = [...bar.children].find(
      (child) => child.querySelector('[data-press="cta"]') !== null
    )
    return {
      brand: box(bar.querySelector('a')),
      capsule: box(nav),
      tools: box(tools ?? null),
      menu: box(bar.querySelector('button[aria-controls="header-nav"]')),
      overflow: bar.scrollWidth - bar.clientWidth,
      viewport: window.innerWidth,
    }
  })
}

test.describe('the three zones', () => {
  for (const path of ['/id/konstruksi', '/en/konstruksi']) {
    for (const width of ROW_WIDTHS) {
      test(`${path} at ${width}px: wordmark, capsule and action never meet`, async ({
        page,
      }) => {
        await page.setViewportSize({ width, height: 900 })
        await page.goto(path)
        await settle(page)

        const z = await zones(page)
        expect(z.brand, 'no wordmark').not.toBeNull()
        expect(z.capsule, 'no capsule on the row').not.toBeNull()
        expect(z.tools, 'no right zone').not.toBeNull()
        expect(z.menu, 'Menu shows beside the row').toBeNull()
        if (!z.brand || !z.capsule || !z.tools) return

        // At least 24px between zones (the reference's §4).
        expect(z.capsule.left - z.brand.right).toBeGreaterThanOrEqual(23.5)
        expect(z.tools.left - z.capsule.right).toBeGreaterThanOrEqual(23.5)
        expect(z.tools.right).toBeLessThanOrEqual(z.viewport)
        expect(z.overflow, 'the bar scrolls sideways').toBeLessThanOrEqual(0)
      })
    }
  }

  test('below 1024px the row folds into Menu', async ({ page }) => {
    await page.setViewportSize({ width: 1023, height: 800 })
    await page.goto('/en/konstruksi')
    await settle(page)

    const z = await zones(page)
    expect(z.menu, 'no Menu below the row').not.toBeNull()
    expect(z.capsule, 'the capsule is still on the bar').toBeNull()
    expect(z.overflow).toBeLessThanOrEqual(0)
  })
})

test.describe('one current route', () => {
  test.use({ viewport: { width: 1440, height: 900 } })

  const current = (page: Page) =>
    page
      .getByRole('banner')
      .evaluate((bar) =>
        [...bar.querySelectorAll('[aria-current="page"]')].map((node) =>
          (node.textContent ?? '').trim()
        )
      )

  test('none on the home page', async ({ page }) => {
    await page.goto('/id')
    await settle(page)
    expect(await current(page)).toEqual([])
  })

  for (const [path, name] of [
    ['/id/konstruksi', 'Konstruksi'],
    ['/id/metode', 'Cara kerja'],
    ['/en/teknologi', 'Teknologi'],
    ['/en/metode', 'How we work'],
  ] as const) {
    test(`exactly one on ${path}: ${name}`, async ({ page }) => {
      await page.goto(path)
      await settle(page)
      expect(await current(page)).toEqual([name])
    })
  }

  test('it moves with the page, and the wordmark is never current', async ({
    page,
  }) => {
    await page.goto('/id/konstruksi')
    await settle(page)
    await page
      .getByRole('navigation', { name: 'Utama' })
      .getByRole('link', { name: 'Teknologi', exact: true })
      .click()
    await expect(page).toHaveURL(/\/id\/teknologi$/)
    await settle(page)
    expect(await current(page)).toEqual(['Teknologi'])

    await page.getByRole('banner').getByRole('link', { name: /home$/ }).click()
    await expect(page).toHaveURL(/\/id\/?$/)
    await settle(page)
    expect(await current(page)).toEqual([])
  })
})

test.describe('from the keyboard', () => {
  test.use({ viewport: { width: 1440, height: 900 } })

  test('the skip link, the wordmark, the four routes in order, then the action', async ({
    page,
  }) => {
    await page.goto('/id', { waitUntil: 'domcontentloaded' })
    await settle(page)

    const stops: { name: string; href: string; ring: boolean }[] = []
    for (let i = 0; i < 14; i += 1) {
      await page.keyboard.press('Tab')
      const stop = await page.evaluate(() => {
        const active = document.activeElement as HTMLElement | null
        if (!active || active === document.body) return null
        const style = getComputedStyle(active)
        return {
          name: (
            active.getAttribute('aria-label') ??
            active.textContent ??
            ''
          ).trim(),
          href: active.getAttribute('href') ?? '',
          ring:
            style.outlineStyle !== 'none' &&
            Number.parseFloat(style.outlineWidth) >= 2,
        }
      })
      if (!stop) break
      stops.push(stop)
      if (stop.name === 'Ceritakan kebutuhan') break
    }

    const names = stops.map((stop) => stop.name)
    expect(stops[0]?.href, 'the skip link is not the first stop').toBe(
      '#main-content'
    )
    expect(names[1], 'the wordmark is not second').toMatch(/home$/)
    expect(names.slice(2, 6)).toEqual([
      'Konstruksi',
      'Teknologi',
      'Peekabo',
      'Cara kerja',
    ])
    expect(names, 'the action was never reached').toContain(
      'Ceritakan kebutuhan'
    )
    const unringed = stops.slice(1).filter((stop) => !stop.ring)
    expect(
      unringed.map((stop) => stop.name),
      'stops without a 2px ring'
    ).toEqual([])
  })

  test('focus is a ring, not the current pill', async ({ page }) => {
    await page.goto('/id/konstruksi')
    await settle(page)
    await page.keyboard.press('Tab')
    const link = page
      .getByRole('navigation', { name: 'Utama' })
      .getByRole('link', { name: 'Konstruksi', exact: true })
    await link.focus()

    const ring = await link.evaluate((node) => {
      const style = getComputedStyle(node)
      return {
        width: Number.parseFloat(style.outlineWidth),
        offset: Number.parseFloat(style.outlineOffset),
        style: style.outlineStyle,
      }
    })
    expect(ring.style).toBe('solid')
    expect(ring.width).toBe(2)
    expect(ring.offset).toBe(3)
  })
})

test.describe('at 200% zoom', () => {
  /*
   * Emulated as a 1440 × 900 screen at 200%: the page lays out in 720 × 450
   * CSS pixels at a device pixel ratio of 2, which is what browser zoom does
   * to the layout viewport. The bar folds into Menu there, and nothing on it
   * may overlap or scroll sideways.
   */
  async function zoomed(browser: Browser, path: string) {
    const context = await browser.newContext({
      viewport: { width: 720, height: 450 },
      deviceScaleFactor: 2,
    })
    const page = await context.newPage()
    await page.goto(path)
    await settle(page)
    return { context, page }
  }

  for (const path of ['/id', '/en/konstruksi']) {
    test(`${path}: the bar folds and nothing collides`, async ({
      browser,
    }, testInfo) => {
      const { context, page } = await zoomed(browser, path)
      try {
        const z = await zones(page)
        expect(z.menu, 'no Menu at 200%').not.toBeNull()
        expect(z.overflow).toBeLessThanOrEqual(0)
        if (z.brand && z.tools && z.menu) {
          expect(z.tools.left - z.brand.right).toBeGreaterThanOrEqual(8)
          expect(z.menu.left - z.tools.right).toBeGreaterThanOrEqual(0)
          expect(z.menu.right).toBeLessThanOrEqual(z.viewport)
        }
        const sideways = await page.evaluate(
          () => document.documentElement.scrollWidth - window.innerWidth
        )
        expect(
          sideways,
          'the page scrolls sideways at 200%'
        ).toBeLessThanOrEqual(0)

        await page.getByRole('button', { name: 'Menu' }).click()
        await expect(
          page.getByRole('button', { name: /Tutup|Close/ })
        ).toBeInViewport()
        await shoot(page, testInfo, `zoom-200-menu${path.replaceAll('/', '-')}`)
      } finally {
        await context.close()
      }
    })
  }
})

test.describe('the states, for the owner to look at', () => {
  test.use({ viewport: { width: 1440, height: 900 } })

  test('default, hover, focus and current on a unit page', async ({
    page,
  }, testInfo) => {
    await page.goto('/id/konstruksi')
    await settle(page)
    const bar = await page.getByRole('banner').boundingBox()
    const clip = {
      x: 0,
      y: 0,
      width: 1440,
      height: Math.ceil(bar?.height ?? 72) + 16,
    }

    // Default, with Konstruksi current.
    await page.mouse.move(720, 600)
    await page.waitForTimeout(300)
    await shoot(page, testInfo, 'header-1440-default-current', clip)

    const nav = page.getByRole('navigation', { name: 'Utama' })
    await nav.getByRole('link', { name: 'Teknologi', exact: true }).hover()
    await page.waitForTimeout(400)
    await shoot(page, testInfo, 'header-1440-hover', clip)

    await page.mouse.move(720, 600)
    await page.keyboard.press('Tab')
    await nav.getByRole('link', { name: 'Peekabo', exact: true }).focus()
    await page.waitForTimeout(400)
    await shoot(page, testInfo, 'header-1440-focus', clip)
  })

  test('the home page bar, and the light bar on a document page', async ({
    page,
  }, testInfo) => {
    for (const [path, name] of [
      ['/id', 'header-1440-home-id'],
      ['/en', 'header-1440-home-en'],
      ['/id/pembayaran', 'header-1440-light'],
    ] as const) {
      await page.goto(path)
      await settle(page)
      await shoot(page, testInfo, name, {
        x: 0,
        y: 0,
        width: 1440,
        height: 96,
      })
    }
  })

  test('the menu, open on a phone', async ({ browser }, testInfo) => {
    for (const locale of ['id', 'en'] as const) {
      const context = await browser.newContext({
        viewport: { width: 390, height: 844 },
        deviceScaleFactor: 3,
        isMobile: true,
        hasTouch: true,
      })
      const page = await context.newPage()
      try {
        await page.goto(`/${locale}`)
        await settle(page)
        await page.getByRole('button', { name: 'Menu' }).click()
        await page.waitForTimeout(800)
        await shoot(page, testInfo, `menu-390-open-${locale}`)
      } finally {
        await context.close()
      }
    }
  })
})

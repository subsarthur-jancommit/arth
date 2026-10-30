import type { Page } from '@playwright/test'
import { expect, test } from '@playwright/test'

/**
 * The header as R4 built it (`docs/RENCANA-REVISI-F3.md`, the navbar plan):
 * the rule previews what is pointed at and comes back, the bar takes the
 * ground of the section under it, and on a phone each route word is its own
 * size (E8.1) and Close fits its box (E8.5).
 *
 * `/id/konstruksi` because it is the page with both grounds: a dark opening
 * on a light document.
 */

const UNIT = '/id/konstruksi'

const navOf = (page: Page) => page.getByRole('navigation', { name: 'Utama' })

/** How far the rule is from standing exactly under `name`, in pixels. */
async function offFrom(page: Page, name: string) {
  const link = navOf(page).getByRole('link', { name, exact: true })
  const marker = page.locator('[data-epic="route-marker"]:visible')
  const [word, rule] = await Promise.all([
    link.boundingBox(),
    marker.boundingBox(),
  ])
  return word && rule
    ? Math.abs(word.x - rule.x) + Math.abs(word.width - rule.width)
    : Number.POSITIVE_INFINITY
}

/** Which ground the bar shows: 1 the ink one, 0 the paper one. */
function barGround(page: Page) {
  return page
    .getByRole('banner')
    .evaluate((bar) =>
      getComputedStyle(bar).getPropertyValue('--header-dark').trim()
    )
}

test.describe('the desktop bar', () => {
  test.use({ viewport: { width: 1440, height: 900 } })

  test('the rule previews the route pointed at, then comes back', async ({
    page,
    isMobile,
  }) => {
    test.skip(isMobile, 'a pointer preview, on the desktop row')
    await page.goto(UNIT)
    await expect(
      page.locator('[data-epic="route-marker"]:visible')
    ).toHaveAttribute('data-on', '', { timeout: 15_000 })
    await expect.poll(() => offFrom(page, 'Konstruksi')).toBeLessThan(2)

    await navOf(page)
      .getByRole('link', { name: 'Teknologi', exact: true })
      .hover()
    await expect.poll(() => offFrom(page, 'Teknologi')).toBeLessThan(2)

    // Away from the row: back under the page's own route.
    await page.mouse.move(720, 640)
    await expect.poll(() => offFrom(page, 'Konstruksi')).toBeLessThan(2)
  })

  test('the bar takes the ground of the section under it', async ({ page }) => {
    await page.goto(UNIT)

    // The opening is a dark band; the bar over it takes the ink ground.
    await expect(page.getByRole('banner')).toHaveAttribute(
      'data-theme',
      'dark',
      {
        timeout: 15_000,
      }
    )
    await expect.poll(() => barGround(page)).toBe('1')

    // Past the band, into the light document: the bar goes back to the
    // page's own theme (no attribute of its own) and its paper ground.
    await page.evaluate(() => {
      const band = document.querySelector('main [data-theme="dark"]')
      if (!band) return
      const bottom = band.getBoundingClientRect().bottom + window.scrollY
      window.scrollTo(0, bottom + 240)
    })
    await expect.poll(() => barGround(page), { timeout: 10_000 }).toBe('0')
  })
})

test.describe('the phone sheet', () => {
  test('each route word is its own size, and fits the sheet', async ({
    page,
    isMobile,
  }) => {
    test.skip(!isMobile, 'the sheet is the phone layout')
    await page.goto(UNIT)
    await page.getByRole('button', { name: 'Menu' }).click()
    await expect(navOf(page)).toBeVisible()
    // The measured sizes land once the face has loaded.
    await page.waitForTimeout(1000)

    const words = await navOf(page).evaluate((nav) => {
      const list = nav.querySelector('ul')
      return [...nav.querySelectorAll<HTMLElement>('[data-route-word]')].map(
        (link) => ({
          text: (link.textContent ?? '').trim(),
          size: Number.parseFloat(getComputedStyle(link).fontSize),
          fits: link.scrollWidth <= (list?.clientWidth ?? 0) + 1,
        })
      )
    })

    expect(words.length, 'no route words on the sheet').toBeGreaterThan(2)
    for (const word of words) {
      expect(word.fits, `"${word.text}" runs out of the sheet`).toBe(true)
      expect(word.size, `"${word.text}" is ${word.size}px`).toBeGreaterThan(44)
    }
    // Per word, not one size for all: a short word is set larger.
    expect(
      Math.max(...words.map((word) => word.size)) -
        Math.min(...words.map((word) => word.size)),
      'every route word is the same size'
    ).toBeGreaterThan(2)
  })

  test('Close fits the box Menu drew', async ({ page, isMobile }) => {
    test.skip(!isMobile, 'the menu button is the phone layout')
    await page.goto(UNIT)
    const menu = page.getByRole('button', { name: 'Menu' })
    const closed = await menu.boundingBox()
    await menu.click()

    const close = page.getByRole('button', { name: 'Tutup' })
    await expect(close).toBeVisible()
    const open = await close.boundingBox()
    expect(open?.width).toBe(closed?.width)
    expect(
      await close.evaluate((button) => button.scrollWidth <= button.clientWidth)
    ).toBe(true)
  })
})

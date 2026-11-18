import type { Page } from '@playwright/test'
import { expect, test } from '@playwright/test'

/**
 * The header as G1 builds it (`docs/SOLUSI-TEKNIS-VISUAL-GERAK.md` §4): a
 * capsule of four routes between the wordmark and the action, a pill behind
 * the label on hover, a contrasting pill on the current route, a ring for
 * focus, and a bar that takes the ground of the section under it (R4).
 *
 * `/id/konstruksi` because it is the page with both grounds — a dark opening
 * on a light document — and a current route in the capsule.
 *
 * Until G1 the first test here followed R4's sliding rule under the current
 * route; the rule left the bar with G1, and the current route is now the
 * pill below.
 */

const UNIT = '/id/konstruksi'

const navOf = (page: Page) => page.getByRole('navigation', { name: 'Utama' })

/** Which ground the bar shows: 1 the ink one, 0 the paper one. */
function barGround(page: Page) {
  return page
    .getByRole('banner')
    .evaluate((bar) =>
      getComputedStyle(bar).getPropertyValue('--header-dark').trim()
    )
}

/** A link's box, and how strongly its pill shows. */
function linkState(page: Page, name: string) {
  return navOf(page)
    .getByRole('link', { name, exact: true })
    .evaluate((link) => {
      const glow = link.querySelector<HTMLElement>('[data-glow]')
      const label = link.querySelector<HTMLElement>('[data-label]')
      const box = link.getBoundingClientRect()
      const words = label?.getBoundingClientRect()
      return {
        x: box.x,
        y: box.y,
        width: box.width,
        height: box.height,
        labelX: words?.x ?? Number.NaN,
        labelY: words?.y ?? Number.NaN,
        glow: Number.parseFloat(glow ? getComputedStyle(glow).opacity : 'NaN'),
        fill: glow ? getComputedStyle(glow).backgroundColor : '',
        current: link.getAttribute('aria-current'),
      }
    })
}

test.describe('the desktop bar', () => {
  test.use({ viewport: { width: 1440, height: 900 } })

  test('hover shows a pill behind the label, and nothing moves', async ({
    page,
    isMobile,
  }) => {
    test.skip(isMobile, 'a pointer hover, on the desktop row')
    await page.goto(UNIT, { waitUntil: 'networkidle' })

    const before = await linkState(page, 'Teknologi')
    expect(before.glow, 'the pill shows before any hover').toBe(0)

    await navOf(page)
      .getByRole('link', { name: 'Teknologi', exact: true })
      .hover()
    await expect
      .poll(async () => (await linkState(page, 'Teknologi')).glow)
      .toBe(1)

    const after = await linkState(page, 'Teknologi')
    // The label and the hit box hold still: the state is the pill's alone.
    expect(Math.abs(after.x - before.x)).toBeLessThan(0.5)
    expect(Math.abs(after.width - before.width)).toBeLessThan(0.5)
    expect(Math.abs(after.labelX - before.labelX)).toBeLessThan(0.5)
    expect(Math.abs(after.labelY - before.labelY)).toBeLessThan(0.5)
  })

  test('the current route keeps its pill when the pointer leaves', async ({
    page,
    isMobile,
  }) => {
    test.skip(isMobile, 'the capsule is the desktop row')
    await page.goto(UNIT, { waitUntil: 'networkidle' })

    const current = await linkState(page, 'Konstruksi')
    expect(current.current).toBe('page')
    expect(current.glow).toBe(1)

    // Point at a neighbour, then away from the bar altogether.
    await navOf(page)
      .getByRole('link', { name: 'Peekabo', exact: true })
      .hover()
    await page.mouse.move(720, 640)
    await page.waitForTimeout(400)

    const after = await linkState(page, 'Konstruksi')
    expect(after.glow, 'the current pill went with the pointer').toBe(1)
    expect(after.fill).toBe(current.fill)
  })

  test('the capsule and its links keep the reference sizes', async ({
    page,
    isMobile,
  }) => {
    test.skip(isMobile, 'the capsule is the desktop row')
    await page.goto(UNIT, { waitUntil: 'networkidle' })

    const sizes = await navOf(page).evaluate((nav) => {
      const capsule = nav.querySelector('ul')
      const cta = document.querySelector('header [data-press="cta"]')
      return {
        capsule: capsule?.getBoundingClientRect().height ?? 0,
        links: [...nav.querySelectorAll('ul a')]
          .filter((link) => link.getClientRects().length > 0)
          .map((link) => link.getBoundingClientRect().height),
        cta: cta?.getBoundingClientRect().height ?? 0,
      }
    })

    expect(Math.round(sizes.capsule)).toBe(52)
    expect(sizes.links.length).toBeGreaterThanOrEqual(4)
    for (const height of sizes.links) expect(Math.round(height)).toBe(44)
    expect(Math.round(sizes.cta)).toBe(48)
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
  test('its links are 24 to 32px and fit the sheet', async ({
    page,
    isMobile,
  }) => {
    test.skip(!isMobile, 'the sheet is the phone layout')
    await page.goto(UNIT)
    await page.getByRole('button', { name: 'Menu' }).click()
    await expect(navOf(page)).toBeVisible()

    const words = await navOf(page).evaluate((nav) =>
      [...nav.querySelectorAll<HTMLElement>('[data-sheet-link]')]
        .filter((link) => link.getClientRects().length > 0)
        .map((link) => ({
          text: (link.textContent ?? '').trim(),
          size: Number.parseFloat(getComputedStyle(link).fontSize),
          fits: link.scrollWidth <= nav.clientWidth + 1,
        }))
    )

    // Four routes and the second list's three.
    expect(words.length, 'too few links on the sheet').toBeGreaterThanOrEqual(7)
    for (const word of words) {
      expect(word.fits, `"${word.text}" runs out of the sheet`).toBe(true)
      expect(
        word.size,
        `"${word.text}" is ${word.size}px`
      ).toBeGreaterThanOrEqual(24)
      expect(word.size, `"${word.text}" is ${word.size}px`).toBeLessThanOrEqual(
        32
      )
    }
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

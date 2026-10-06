import { expect, type Page, test } from '@playwright/test'

import { FEATURED_WORK } from './fixtures'

/**
 * The pages a client takes into a meeting, on paper
 * (`lib/styles/css/print.css`, and each block's own `@media print`).
 *
 * The sheet is A4-wide and the page is read to its end before it is printed,
 * so whatever reading leaves behind — a pin's spacer, a word the scrub had
 * not reached, a held column, a heading never scrolled to — is on the page
 * when the media turns to print. `print-essay.e2e.ts` holds the essay.
 */
const A4 = { width: 794, height: 1123 }

const ROUTES = [
  '/en/studio',
  '/id/practice/consulting',
  '/en/work',
  `/en/work/${FEATURED_WORK}`,
] as const

async function readThenPrint(page: Page, path: string) {
  await page.setViewportSize(A4)
  await page.goto(path)
  await page.waitForLoadState('networkidle')
  await page.evaluate(async () => {
    const step = window.innerHeight / 2
    for (let y = 0; y <= document.documentElement.scrollHeight; y += step) {
      window.scrollTo(0, y)
      await new Promise((resolve) => setTimeout(resolve, 40))
    }
  })
  // Printed straight after reading, while the last reveals are still under
  // way: the sheet, not a pause, is what has to settle them.
  await page.emulateMedia({ media: 'print' })
}

for (const path of ROUTES) {
  test(`${path} prints as ink on paper, every part at its final state`, async ({
    page,
  }) => {
    await readThenPrint(page, path)

    const sheet = await page.evaluate(() => {
      const root = getComputedStyle(document.documentElement)
      // The page's ground, not `<html>`, which mirrors it after hydration.
      const ground = document.querySelector('[data-theme]:not(html)')
      const theme = ground ? getComputedStyle(ground) : null
      const opacityOf = (selector: string) =>
        [...document.querySelectorAll(`main ${selector}`)].map(
          (node) => getComputedStyle(node).opacity
        )
      return {
        primary: theme?.getPropertyValue('--color-primary').trim(),
        secondary: theme?.getPropertyValue('--color-secondary').trim(),
        paper: root.getPropertyValue('--color-paper').trim(),
        ink: root.getPropertyValue('--color-ink').trim(),
        dimmed: [
          ...opacityOf('[data-reveal-item]'),
          ...opacityOf('[data-step]'),
          ...opacityOf('[data-capability]'),
          ...opacityOf('[class*="progressText"] [class*="word"]'),
        ].filter((opacity) => opacity !== '1').length,
        moved: [...document.querySelectorAll('main h1 *, [data-run-track]')]
          .map((node) => getComputedStyle(node).transform)
          .filter((transform) => transform !== 'none').length,
        spacers: [...document.querySelectorAll('.pin-spacer')].map(
          (spacer) => getComputedStyle(spacer).paddingBlockEnd
        ),
        held: [
          ...document.querySelectorAll(
            '[data-step-index], [data-capability-active]'
          ),
        ].map((node) => getComputedStyle(node).position),
      }
    })

    // Anti-vacuum: the page has a themed ground and the palette to compare.
    expect(sheet.ink, 'no ink token to compare with').not.toBe('')
    expect(sheet.secondary, `${path} prints in paper-coloured type`).toBe(
      sheet.ink
    )
    expect(sheet.primary).toBe(sheet.paper)

    expect(sheet.dimmed, `${path} prints parts still dimmed`).toBe(0)
    expect(sheet.moved, `${path} prints parts still displaced`).toBe(0)
    expect(sheet.spacers.filter((padding) => padding !== '0px')).toEqual([])
    expect(sheet.held.filter((position) => position !== 'static')).toEqual([])

    await expect(page.getByRole('banner')).toBeHidden()
    // Paper has no clipboard: no copy control is printed.
    expect(
      await page
        .locator('[data-epic="section-link"]')
        .evaluateAll(
          (controls) =>
            controls.filter((control) => control.checkVisibility()).length
        )
    ).toBe(0)
  })
}

test('a case prints without its index', async ({ page }) => {
  await readThenPrint(page, `/en/work/${FEATURED_WORK}`)

  // Anti-vacuum: on screen this case has the index.
  await expect(page.locator('[data-project-spine]')).toBeAttached()
  await expect(page.locator('[data-project-spine]')).toBeHidden()
})

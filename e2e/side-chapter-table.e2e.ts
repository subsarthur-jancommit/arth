import { expect, type Page, test } from '@playwright/test'

import { SITUATION_ROUTES } from './fixtures'
import { transitionsAtRest } from './settle'

/**
 * `side-chapter-table`, a side's map to its situations
 * (`vault/blocks/side-chapter-table`, listed under "Moments as built" in
 * `docs/MOTION-SPEC.md`).
 *
 * A semantic table, complete without a script, and two pieces of decoration
 * over it: a crosshair whose hairlines run from the table's edges to the row
 * in hand (`vault/motion/crosshair`), and a plate that previews that row's
 * entry offer (`vault/motion/cover-preview`). INTENT is the row pointed at or
 * focused: both arrive on it, and leave when the reader does. Only the lines'
 * `transform` and `opacity` change. Under reduced motion the lines reach the
 * same point at once.
 *
 * The side pages are the parents of the situations `fixtures.ts` names, so
 * each one has a chapter, and the chapter's own page is one of its links.
 */

function sideOf(chapter: string) {
  return { side: chapter.slice(0, chapter.lastIndexOf('/')), chapter }
}

const SIDES = SITUATION_ROUTES.map(sideOf)
/** The side the INTENT and reduced-motion tests read. */
const FIRST = sideOf(SITUATION_ROUTES[0])

const TABLE = '[data-epic="side-chapter-table"]'
/** The crosshair: the one element that carries its point as `--cross-x`. */
const CROSSHAIR = `${TABLE} [style*="--cross-x"]`
const PREVIEW = `${TABLE} [data-epic="cover-preview"]`

/** The crosshair's two lines: how far each reaches, and how visible it is. */
async function lines(page: Page) {
  return page.locator(CROSSHAIR).evaluate((crosshair) =>
    [...crosshair.children].map((line, index) => {
      const style = getComputedStyle(line)
      const matrix = new DOMMatrixReadOnly(style.transform)
      return {
        opacity: Number(style.opacity),
        // The row line comes first and scales on x; the column line on y.
        reach: index === 0 ? matrix.a : matrix.d,
        duration: Math.max(
          ...style.transitionDuration
            .split(',')
            .map((duration) => Number.parseFloat(duration))
        ),
      }
    })
  )
}

test.describe('side-chapter-table', () => {
  for (const { side, chapter } of SIDES)
    test(`${side} names the table and maps the side to its situations`, async ({
      page,
    }) => {
      await page.goto(side)

      const table = page.locator(TABLE)
      await expect(table, 'the side has no chapter table').toHaveCount(1)
      await expect(
        table.locator('tr[data-side-chapter]'),
        'the table lists no chapter'
      ).not.toHaveCount(0)
      await expect(
        table.locator(`a[href="${chapter}"]`),
        `the table does not lead to ${chapter}`
      ).not.toHaveCount(0)
      await expect(
        page.locator(CROSSHAIR),
        'the table draws no crosshair'
      ).toHaveCount(1)
    })

  test('a row pointed at draws the crosshair to it and previews its entry', async ({
    page,
  }) => {
    const { side, chapter } = FIRST
    await page.goto(side)

    const row = page.locator(`${TABLE} tr:has(a[href="${chapter}"])`)
    await row.hover()

    await expect(
      page.locator(CROSSHAIR),
      'pointing at a row did not draw the crosshair'
    ).toHaveAttribute('data-on', '')
    await expect(
      page.locator(PREVIEW),
      'pointing at a row did not open the preview'
    ).toHaveAttribute('data-on', '')
    await expect(
      page.locator(`${PREVIEW} [data-shown]`),
      'the preview shows no entry for the row'
    ).toHaveCount(1)

    await transitionsAtRest(page)
    const drawn = await lines(page)
    expect(drawn, 'the crosshair is not two lines').toHaveLength(2)
    for (const line of drawn) {
      expect(line.opacity, 'a crosshair line is not visible').toBe(1)
      expect(
        line.reach,
        'a crosshair line does not reach the row'
      ).toBeGreaterThan(0)
    }

    // The reader moves on, and the decoration leaves with them.
    await page.mouse.move(2, 2)
    await expect(
      page.locator(CROSSHAIR),
      'the crosshair stayed after the pointer left'
    ).not.toHaveAttribute('data-on', '')
  })

  test('a row reached by the keyboard draws the crosshair too', async ({
    page,
  }) => {
    const { side, chapter } = FIRST
    await page.goto(side)

    const link = page.locator(`${TABLE} a[href="${chapter}"]`).first()
    await link.focus()
    await expect(
      page.locator(CROSSHAIR),
      'focusing a row did not draw the crosshair'
    ).toHaveAttribute('data-on', '')

    await link.blur()
    await expect(
      page.locator(CROSSHAIR),
      'the crosshair stayed after focus left'
    ).not.toHaveAttribute('data-on', '')
  })

  test('under reduced motion the lines reach the row at once', async ({
    browser,
  }) => {
    const context = await browser.newContext({ reducedMotion: 'reduce' })
    const page = await context.newPage()

    try {
      const { side, chapter } = FIRST
      await page.goto(side)
      expect(
        await page.evaluate(
          () => matchMedia('(prefers-reduced-motion: reduce)').matches
        ),
        'reduced-motion emulation did not apply'
      ).toBe(true)

      await page.locator(`${TABLE} tr:has(a[href="${chapter}"])`).hover()
      await expect(page.locator(CROSSHAIR)).toHaveAttribute('data-on', '')

      // Read at once: with the beat dropped there is nothing to wait for.
      const drawn = await lines(page)
      expect(drawn).toHaveLength(2)
      for (const line of drawn) {
        expect(line.duration, 'a line still transitions').toBeLessThan(0.02)
        expect(line.opacity, 'a line is not there at once').toBe(1)
        expect(line.reach, 'a line does not reach the row').toBeGreaterThan(0)
      }
    } finally {
      await context.close()
    }
  })
})

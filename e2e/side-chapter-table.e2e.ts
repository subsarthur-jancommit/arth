import {
  type Browser,
  expect,
  type Page,
  test,
  type TestInfo,
} from '@playwright/test'

import { SITUATION_ROUTES } from './fixtures'
import { waitForEntrance } from './page-settled'
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
 *
 * On a phone the rows stack into blocks and the decoration is not drawn: a
 * finger that lands on a row is scrolling the page, and on production it
 * aimed the crosshair at every row it touched (2026-11-18). The phone tests
 * open a phone context of their own, so this file stays in the desktop
 * project. Their screenshots go to `testInfo.outputPath()`, which CI's
 * `playwright-report` artifact carries under `test-results/` for a passing
 * run too.
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

/** A phone at the owner's review width: touch, and nothing that hovers. */
async function phone(browser: Browser) {
  const context = await browser.newContext({
    viewport: { width: 390, height: 844 },
    deviceScaleFactor: 2,
    isMobile: true,
    hasTouch: true,
  })
  return { context, page: await context.newPage() }
}

async function settle(page: Page) {
  await page.waitForLoadState('networkidle')
  await page.evaluate(async () => {
    await document.fonts.ready
  })
  await waitForEntrance(page)
}

async function shoot(page: Page, testInfo: TestInfo, name: string) {
  const target = testInfo.outputPath(`${name}.png`)
  await page.screenshot({ path: target })
  await testInfo.attach(name, { path: target, contentType: 'image/png' })
}

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

test.describe('side-chapter-table on a phone', () => {
  test('each row stacks into one block, and the table is still a table', async ({
    browser,
  }) => {
    const { context, page } = await phone(browser)

    try {
      await page.goto(FIRST.side)
      await settle(page)
      const table = page.locator(`${TABLE} table`)

      const layout = await table.evaluate((node) => {
        const head = node.querySelector('thead')?.getBoundingClientRect()
        return {
          head: head ? { width: head.width, height: head.height } : null,
          rows: [...node.querySelectorAll('tbody tr')].map((row) => {
            const box = row.getBoundingClientRect()
            return {
              width: box.width,
              cells: [...row.children].map((cell) => {
                const at = cell.getBoundingClientRect()
                return { top: at.top, bottom: at.bottom, width: at.width }
              }),
            }
          }),
        }
      })
      expect(layout.head, 'the table lost its head row').not.toBeNull()
      expect(
        layout.head?.width ?? 0,
        'the head row is still drawn above the stacked rows'
      ).toBeLessThanOrEqual(1)
      expect(layout.rows.length, 'the table lists no chapter').toBeGreaterThan(
        0
      )
      for (const row of layout.rows) {
        expect(row.cells, 'a row is not three cells').toHaveLength(3)
        for (const [index, cell] of row.cells.entries()) {
          expect(
            Math.abs(cell.width - row.width),
            'a cell is narrower than its row: the row did not stack'
          ).toBeLessThanOrEqual(1)
          const above = row.cells[index - 1]
          if (above)
            expect(
              cell.top,
              'a cell sits beside the one before it'
            ).toBeGreaterThanOrEqual(above.bottom - 1)
        }
      }

      // Each stacked cell names its column for the eye, in the column's words.
      const heads = (await table.locator('thead th').allTextContents()).map(
        (head) => head.trim()
      )
      const labels = table
        .locator('tbody tr')
        .first()
        .locator('td > [aria-hidden="true"]')
      await expect(
        labels,
        'a stacked cell does not name its column with the column heading'
      ).toHaveText(heads.slice(1))
      for (const label of await labels.all()) await expect(label).toBeVisible()

      /*
       * And the browser still exposes a table. Read from Chromium's own
       * accessibility tree rather than Playwright's reading of the DOM: rows
       * set to `display: block` are exactly where browsers have dropped table
       * semantics, and the reason the head row is hidden with a clip rather
       * than `display: none`. The labels above stay out of every cell's name,
       * since the head row already names the cell. Compared without case,
       * in case the head row's `text-transform` reaches the tree.
       */
      const cdp = await context.newCDPSession(page)
      const { nodes } = await cdp.send('Accessibility.getFullAXTree')
      const named = (role: string) =>
        nodes
          .filter((node) => !node.ignored && node.role?.value === role)
          .map((node) =>
            String(node.name?.value ?? '')
              .trim()
              .toLowerCase()
          )
      const lower = heads.map((head) => head.toLowerCase())
      expect(
        named('table').length,
        'the table is not exposed as a table'
      ).toBeGreaterThan(0)
      expect(
        named('columnheader'),
        'the hidden head row no longer names the columns'
      ).toEqual(lower)
      expect(
        named('rowheader'),
        'a chapter no longer heads its row'
      ).toHaveLength(layout.rows.length)
      const cells = named('cell')
      expect(cells.length, 'no cell is exposed').toBeGreaterThan(0)
      for (const cell of cells)
        for (const head of lower.slice(1))
          expect(
            cell.startsWith(head),
            `a cell reads its column's name twice: "${cell}"`
          ).toBe(false)
    } finally {
      await context.close()
    }
  })

  test('a finger that lands on a row moves nothing', async ({ browser }) => {
    const { context, page } = await phone(browser)

    try {
      await page.goto(FIRST.side)
      await settle(page)
      await expect(
        page.locator(CROSSHAIR),
        'the crosshair is drawn where nothing hovers'
      ).toBeHidden()
      await expect(
        page.locator(PREVIEW),
        'the preview is drawn where nothing hovers'
      ).toBeHidden()

      // Counts every time either is switched on, even for a single frame:
      // on production a tap switched the crosshair on and off again.
      await page.evaluate(
        (decoration) => {
          const root = document.documentElement
          root.dataset.aimed = '0'
          const observer = new MutationObserver((records) => {
            for (const record of records)
              if (
                record.target instanceof Element &&
                record.target.hasAttribute('data-on')
              )
                root.dataset.aimed = String(Number(root.dataset.aimed) + 1)
          })
          for (const selector of decoration) {
            const node = document.querySelector(selector)
            if (node)
              observer.observe(node, {
                attributes: true,
                attributeFilter: ['data-on'],
              })
          }
        },
        [CROSSHAIR, PREVIEW]
      )
      const aimed = () =>
        page.evaluate(() => Number(document.documentElement.dataset.aimed))

      // The row's own words, not a link: the tap stays on the page.
      const words = page
        .locator(`${TABLE} tbody tr`)
        .first()
        .locator('th > span')
        .first()
      await words.scrollIntoViewIfNeeded()
      const box = await words.boundingBox()
      expect(box, 'the row has no words to land on').not.toBeNull()
      if (box)
        await page.touchscreen.tap(
          box.x + box.width / 2,
          box.y + Math.min(box.height / 2, 8)
        )
      // An absence is read after a pause: a handler would have run by now.
      await page.waitForTimeout(500)
      expect(await aimed(), 'a finger on a row aimed the decoration').toBe(0)

      // Anti-vacuum: the same watch sees a mouse that points at the row.
      await words.hover()
      await expect
        .poll(aimed, { message: 'the watch did not see a mouse' })
        .toBeGreaterThan(0)
    } finally {
      await context.close()
    }
  })

  for (const path of [FIRST.side, FIRST.side.replace(/^\/id\//, '/en/')])
    test(`${path} at 390x844, for the owner to look at`, async ({
      browser,
    }, testInfo) => {
      const { context, page } = await phone(browser)

      try {
        await page.goto(path)
        await settle(page)
        const name = `after${path.replaceAll('/', '-')}-390x844`

        // The table's opening, where the owner's own screenshot was taken.
        await page.locator(TABLE).evaluate((node) => {
          window.scrollTo(
            0,
            node.getBoundingClientRect().top + window.scrollY - 100
          )
        })
        await transitionsAtRest(page)
        expect(
          await page.evaluate(
            () =>
              document.documentElement.scrollWidth -
              document.documentElement.clientWidth
          ),
          `${path} scrolls sideways`
        ).toBeLessThanOrEqual(0)
        await shoot(page, testInfo, name)

        // Further in, where the rows read as blocks one after another.
        await page
          .locator(`${TABLE} tbody tr`)
          .nth(2)
          .evaluate((node) => {
            window.scrollTo(
              0,
              node.getBoundingClientRect().top + window.scrollY - 80
            )
          })
        await transitionsAtRest(page)
        await shoot(page, testInfo, `${name}-rows`)
      } finally {
        await context.close()
      }
    })
})

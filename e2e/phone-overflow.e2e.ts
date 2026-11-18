import { type Browser, expect, type Page, test } from '@playwright/test'

import { SIDES, sideTemplate, UNITS } from '../lib/content/units'
import { localizedPath } from '../lib/i18n/paths'
import { localesForTemplate } from '../lib/i18n/public-locale-redirect'
import { routing } from '../lib/i18n/routing'

/**
 * Nothing on a side page reaches past a phone's screen. G1 asks for no
 * sideways scroll from 360 to 1440px; this file holds the phone end, from
 * 320.
 *
 * ## What it caught
 *
 * The situations table (`vault/blocks/side-chapter-table`) sat in a grid with
 * no column template. Its implicit `auto` track grew to the table's
 * min-content, three columns of mono, letter-spaced headings, and took the
 * table and its heading past the page's edge. Measured on production
 * (`4f68cb2`, 2026-11-18) in this file's phone context: ten of the twelve
 * side pages at 320 and 360px, seven at 390 and three at 430, by up to 61px.
 * A phone either let the page slide under the reader's thumb or zoomed it
 * out to fit; the owner, reviewing at about 325px, saw the slide.
 *
 * The same sweep found every Peekabo situation and work page reaching 9 to
 * 19px past the edge until its cards arrived. Peekabo's rows arrive from the
 * inline end, two gutters out (`lib/styles/css/dialects.css`), and a card
 * still waiting stood there. One situation and its entry offer are checked
 * here too, read from the Peekabo side's own table, so a renamed chapter does
 * not take the check with it.
 *
 * ## How it measures
 *
 * A phone (touch, no hover, the mobile project's pixel ratio), each width
 * loaded fresh, measured once the page's script has run, because a card
 * waits to arrive only after it has. The root's `scrollWidth` against its
 * `clientWidth` is the whole document's reach, whatever reaches it. A
 * failure names the outermost boxes past the edge that nothing clips.
 */

const WIDTHS = [320, 360, 390, 430] as const

/**
 * One load to network idle and a settle per width. Fifteen seconds each is
 * several times what a side page takes on a CI runner.
 */
const BUDGET_MS = WIDTHS.length * 15_000

/** Every side page, in each language it is served in (`side-page.e2e.ts`). */
const SIDE_PAGES = routing.locales.flatMap((locale) =>
  UNITS.flatMap((unit) =>
    SIDES[unit].flatMap((side) => {
      const template = sideTemplate(unit, side)
      return localesForTemplate(template).includes(locale)
        ? [localizedPath(locale, template)]
        : []
    })
  )
)

/** The side whose situations arrive sideways. */
const PEEKABO_SIDE = localizedPath(
  'id',
  sideTemplate('peekabo', 'pemilik-usaha')
)

async function phone(browser: Browser) {
  const context = await browser.newContext({
    viewport: { width: WIDTHS[0], height: 844 },
    deviceScaleFactor: 3,
    isMobile: true,
    hasTouch: true,
  })
  return { context, page: await context.newPage() }
}

async function load(page: Page, path: string) {
  const response = await page.goto(path)
  expect(response?.status(), `${path} did not answer 200`).toBe(200)
  await page.waitForLoadState('networkidle')
  await page.evaluate(async () => {
    await document.fonts.ready
  })
  await page.waitForTimeout(400)
}

/** How far the document reaches past the screen, and what reaches there. */
function reach(page: Page) {
  return page.evaluate(() => {
    const root = document.documentElement
    const edge = root.clientWidth
    const past = (node: Element) =>
      node.getBoundingClientRect().right > edge + 0.5
    /** Whether an ancestor that clips sideways ends inside the screen. */
    const clipped = (node: Element) => {
      for (
        let up = node.parentElement;
        up && up !== root;
        up = up.parentElement
      ) {
        const style = getComputedStyle(up)
        if (style.position === 'fixed') return true
        if (style.overflowX !== 'visible' && !past(up)) return true
      }
      return false
    }
    const boxes: string[] = []
    if (root.scrollWidth > edge) {
      for (const node of document.body.querySelectorAll('*')) {
        const box = node.getBoundingClientRect()
        if (box.width === 0 && box.height === 0) continue
        if (!past(node) || getComputedStyle(node).position === 'fixed') continue
        const parent = node.parentElement
        if (parent && parent !== document.body && past(parent)) continue
        if (clipped(node)) continue
        const epic = node.closest('[data-epic]')?.getAttribute('data-epic')
        const name = `${node.tagName.toLowerCase()}.${String(node.className).split(' ')[0]}`
        boxes.push(
          `${name}${epic ? ` in ${epic}` : ''} to ${Math.round(box.right)}px`
        )
        if (boxes.length === 5) break
      }
    }
    return { overflow: root.scrollWidth - edge, boxes }
  })
}

/** Whether a card still waits to arrive, standing off to the inline end. */
function waitingAside(page: Page) {
  return page.evaluate(() =>
    [
      ...document.querySelectorAll(
        '[data-reveal="hidden"] [data-reveal-item]:not([data-reveal-item="visible"])'
      ),
    ].some(
      (item) => new DOMMatrixReadOnly(getComputedStyle(item).transform).m41 > 0
    )
  )
}

async function measure(page: Page, path: string, width: number) {
  const { overflow, boxes } = await reach(page)
  expect
    .soft(
      overflow,
      `${path} at ${width}px reaches ${overflow}px past the screen: ${boxes.join('; ') || 'nothing unclipped found'}`
    )
    .toBeLessThanOrEqual(0)
}

test.describe('side pages at phone widths', () => {
  for (const path of SIDE_PAGES) {
    test(`${path} stays inside the screen from ${WIDTHS[0]} to ${WIDTHS[3]}px`, async ({
      browser,
    }) => {
      test.setTimeout(BUDGET_MS)
      const { context, page } = await phone(browser)
      try {
        for (const width of WIDTHS) {
          await page.setViewportSize({ width, height: 844 })
          await load(page, path)
          await measure(page, path, width)
        }
      } finally {
        await context.close()
      }
    })
  }
})

test.describe('a Peekabo situation and its entry offer at phone widths', () => {
  test('neither reaches past the screen while its cards wait to arrive', async ({
    browser,
  }) => {
    test.setTimeout(BUDGET_MS * 2 + 15_000)
    const { context, page } = await phone(browser)
    try {
      await load(page, PEEKABO_SIDE)
      const row = page.locator(
        '[data-epic="side-chapter-table"] tbody tr:has(td a[href])'
      )
      await expect(
        row.first(),
        `${PEEKABO_SIDE} lists no situation with an entry offer of its own page; this check has nothing to measure`
      ).toBeAttached()
      const situation = await row.first().locator('th a').getAttribute('href')
      const offer = await row.first().locator('td a').getAttribute('href')
      expect(situation, 'the row names no situation').toBeTruthy()
      expect(offer, 'the row names no entry offer').toBeTruthy()

      for (const path of [situation ?? '', offer ?? '']) {
        for (const width of WIDTHS) {
          await page.setViewportSize({ width, height: 844 })
          await load(page, path)
          // Anti-vacuum: the defect exists only while a card waits off to
          // the side, so a page with none waiting would pass either way.
          await expect
            .poll(() => waitingAside(page), {
              message: `nothing on ${path} at ${width}px waits to arrive from the side, so its reach was not measured`,
            })
            .toBe(true)
          await measure(page, path, width)
        }
      }
    } finally {
      await context.close()
    }
  })
})

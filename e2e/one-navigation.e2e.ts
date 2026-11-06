import { type Browser, expect, type Page, test } from '@playwright/test'

import { BRAND_NAME } from '../lib/brand'
import { SIDES, sideTemplate } from '../lib/content/units'
import { localizedPath } from '../lib/i18n/paths'
import { SITUATION_ROUTES } from './fixtures'
import { unitSettleMs } from './settle'

/**
 * One navigation, one transition: F4-03, `docs/MOTION-SPEC.md` §13.11.
 *
 * The table: Home to unit is `practice-morph`; a side to the other side is
 * `side-sheet-swap`; a chapter to its offer is `offer-arrival`; any other
 * Arthur page is `set-depth`; Back and Forward close with the quick panel and
 * never replay the first-session curtain; a new navigation mid-transition
 * cancels the old one and goes straight to the new end state.
 *
 * Already proved elsewhere, and not repeated here: `set-depth.e2e.ts` (the
 * circle, Back's quick panel, a double press), `motion.e2e.ts` (the overlay
 * stands aside for a morph, a double click and Back mid-transition strand
 * nothing, the overlay always uncovers), `side-sheet-swap.e2e.ts` and
 * `journey.e2e.ts`. This file adds what F4-03 asked for that nothing proved:
 *
 * - `offer-arrival` runs, and it is the only transition the press makes;
 * - a double click on the side switcher leaves nothing stranded;
 * - rapid Back and Forward end on the right page with nothing left over;
 * - the curtain is Arthur's, and it runs once a session.
 */

const CHAPTER = SITUATION_ROUTES[0]
const OFFER_LINK = 'main a[data-press="offer"]:visible'
const TITLE = 'main h1:visible'

/** One `animate()` call for an exchange, with the page it moved. */
interface Half {
  id: string
  sheet: string
  duration: number
  endOpacity: number | null
}

interface NavigationRecord {
  halves: Half[]
  /** The transition types of every view transition the page started. */
  types: string[][]
  /** Every `data-state` the page overlay passed through. */
  states: string[]
}

declare global {
  var __navigation: NavigationRecord
}

/**
 * Records every exchange animation (`offer-arrival-*`, `side-sheet-*`), the
 * types of every view transition and the overlay's states, as
 * `side-sheet-swap.e2e.ts` does. The overlay is looked for once the document
 * exists, never before `<html>` is parsed.
 */
async function record(page: Page) {
  await page.addInitScript(() => {
    const seen: NavigationRecord = { halves: [], types: [], states: [] }
    globalThis.__navigation = seen

    const animate = Element.prototype.animate
    Element.prototype.animate = function (keyframes, options) {
      const animation = animate.call(this, keyframes, options)
      const id = typeof options === 'object' ? (options.id ?? '') : ''
      if (id.startsWith('offer-arrival') || id.startsWith('side-sheet')) {
        const frames = Array.isArray(keyframes) ? keyframes : []
        const last = frames.at(-1)
        seen.halves.push({
          id,
          sheet:
            this.closest('article')?.querySelector('h1')?.textContent?.trim() ??
            '',
          duration:
            typeof options === 'object' ? Number(options.duration ?? 0) : 0,
          endOpacity:
            last && last.opacity !== undefined ? Number(last.opacity) : null,
        })
      }
      return animation
    }

    const original = document.startViewTransition?.bind(document)
    if (original) {
      document.startViewTransition = (argument) => {
        seen.types.push(
          argument && typeof argument === 'object'
            ? [...(argument.types ?? [])]
            : []
        )
        return original(argument)
      }
    }

    const watch = (tries: number) => {
      const overlay = document.querySelector('[data-page-transition]')
      if (overlay) {
        new MutationObserver(() =>
          seen.states.push(overlay.getAttribute('data-state') ?? '-')
        ).observe(overlay, {
          attributes: true,
          attributeFilter: ['data-state'],
        })
      } else if (tries > 0) {
        setTimeout(() => watch(tries - 1), 100)
      }
    }
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => watch(100))
    } else {
      watch(100)
    }
  })
}

/** Whether focus is on the title of the page now on screen. */
async function titleHasFocus(page: Page) {
  return page.evaluate(() => {
    const active = document.activeElement
    return active instanceof HTMLElement && active.tagName === 'H1'
      ? active.checkVisibility()
      : false
  })
}

/**
 * What a stuck screen would leave behind, on the page now shown: the root's
 * transition attributes, an overlay not at rest, a block of the live sheet
 * held below full opacity, an exchange animation still running.
 */
async function leftovers(page: Page) {
  return page.evaluate(() => {
    const root = document.documentElement
    const main = [...document.querySelectorAll('main')].find(
      (element) => element.getBoundingClientRect().height > 0
    )
    const overlay = document.querySelector('[data-page-transition]')
    const faded = [...(main?.querySelectorAll('article > *') ?? [])]
      .filter(
        (block) =>
          block instanceof HTMLElement &&
          block.checkVisibility() &&
          Number(getComputedStyle(block).opacity) < 0.99
      )
      .map((block) => block.tagName)
    const running = document
      .getAnimations()
      .filter(
        (animation) =>
          /^(?:offer-arrival|side-sheet)/.test(animation.id) &&
          animation.playState === 'running'
      )
      .map((animation) => animation.id)
    return {
      depth: root.getAttribute('data-depth'),
      arrival: root.getAttribute('data-arrival'),
      overlay: overlay?.getAttribute('data-state') ?? 'idle',
      faded,
      running,
      title: Boolean(main?.querySelector('h1')),
    }
  })
}

const AT_REST = {
  depth: null,
  arrival: null,
  overlay: 'idle',
  faded: [],
  running: [],
  title: true,
}

test.describe('offer-arrival', () => {
  test('a card press is offer-arrival, and only offer-arrival', async ({
    page,
  }) => {
    await record(page)
    await page.goto(CHAPTER)
    await page.waitForTimeout(1500)
    const chapter = (await page.locator(TITLE).textContent())?.trim() ?? ''
    const settle = await unitSettleMs(page)

    const link = page.locator(OFFER_LINK).first()
    const href = await link.getAttribute('href')
    expect(href, `${CHAPTER} lists no offer with its own page`).toBeTruthy()
    await link.scrollIntoViewIfNeeded()
    await page.waitForTimeout(400)
    await link.click()
    await page.waitForURL((url) => url.pathname === href)
    await page.waitForTimeout(1500)

    const offer = (await page.locator(TITLE).textContent())?.trim() ?? ''
    const { halves, types, states } = await page.evaluate(
      () => globalThis.__navigation
    )
    const ran = JSON.stringify(halves)
    const lifts = halves.filter((half) => half.id === 'offer-arrival-lift')
    const settles = halves.filter((half) => half.id === 'offer-arrival-settle')

    // TRANSPORT: the pressed card lifts out of the chapter's list.
    expect(lifts, `the card did not lift: ${ran}`).toHaveLength(1)
    expect(lifts[0]?.sheet, 'the lift moved another page').toBe(chapter)
    expect(lifts[0]?.endOpacity, 'the lift does not fade').toBe(0)
    // SETTLE: the offer's title block rises into place, by transform alone.
    expect(settles, `the title did not settle: ${ran}`).toHaveLength(1)
    expect(settles[0]?.sheet, 'the settle moved another page').toBe(offer)
    expect(settles[0]?.endOpacity, 'the settle fades the title').toBeNull()
    // Both at the unit's tempo (F4-02), or the base grammar outside one.
    expect(lifts[0]?.duration).toBe(settle ?? 400)
    expect(settles[0]?.duration).toBe(settle ?? 800)

    // One transition: no set-depth circle, no overlay over the exchange.
    expect(
      types.some((list) => list.includes('set-depth')),
      'the press also opened a set-depth circle'
    ).toBe(false)
    expect(
      states.filter((state) => state !== 'idle'),
      'the page overlay covered the exchange'
    ).toEqual([])

    await expect(page.locator(TITLE)).toBeVisible()
    expect(await titleHasFocus(page), 'focus was not handed to the title').toBe(
      true
    )
    expect(await leftovers(page)).toEqual(AT_REST)
  })

  test('under reduced motion the offer arrives still, its title focused', async ({
    browser,
  }) => {
    const context = await browser.newContext({ reducedMotion: 'reduce' })
    const page = await context.newPage()
    try {
      await record(page)
      await page.goto(CHAPTER)
      await page.waitForTimeout(1000)

      const link = page.locator(OFFER_LINK).first()
      const href = await link.getAttribute('href')
      await link.scrollIntoViewIfNeeded()
      await link.click()
      await page.waitForURL((url) => url.pathname === href)
      await page.waitForTimeout(1000)

      const { halves } = await page.evaluate(() => globalThis.__navigation)
      expect(halves, 'something moved for a reader who asked for none').toEqual(
        []
      )
      await expect(page.locator(TITLE)).toBeVisible()
      expect(
        await titleHasFocus(page),
        'focus was not handed to the title'
      ).toBe(true)
    } finally {
      await context.close()
    }
  })
})

test.describe('never stuck', () => {
  const [FIRST, SECOND] = SIDES.konstruksi
  const FROM = localizedPath('id', sideTemplate('konstruksi', FIRST))
  const TO = localizedPath('id', sideTemplate('konstruksi', SECOND))
  const OTHER = `[data-epic="side-sheet-swap"]:visible a[href="${TO}"]`

  test('a double click on the side switcher leaves nothing stranded', async ({
    page,
  }) => {
    await record(page)
    await page.goto(FROM)
    await page.waitForTimeout(1500)
    const lift = (await unitSettleMs(page)) ?? 400

    await page.locator(OTHER).dblclick()
    await page.waitForURL((url) => url.pathname === TO)
    // The lift, the settle and their play-back, with a margin.
    await page.waitForTimeout(2 * lift + 1200)

    await expect(page.locator(TITLE)).toBeVisible()
    expect(await leftovers(page)).toEqual(AT_REST)
  })

  test('rapid Back and Forward end on the right page, at rest', async ({
    page,
  }) => {
    const unit = localizedPath('id', '/konstruksi')
    await page.goto(unit)
    await page.waitForTimeout(1500)

    // Three pages deep by links: the unit, one side, the other side.
    await page.locator(`main a[href="${FROM}"]`).first().click()
    await page.waitForURL((url) => url.pathname === FROM)
    await page.waitForTimeout(1500)
    await page.locator(OTHER).click()
    await page.waitForURL((url) => url.pathname === TO)
    await page.waitForTimeout(1500)

    // Back, Forward, Back, each before the last could finish.
    await page.goBack({ waitUntil: 'commit' })
    await page.goForward({ waitUntil: 'commit' })
    await page.goBack({ waitUntil: 'commit' })
    await page.waitForURL((url) => url.pathname === FROM)
    await page.waitForTimeout(2500)

    expect(new URL(page.url()).pathname).toBe(FROM)
    await expect(page.locator(TITLE)).toBeVisible()
    expect(await leftovers(page)).toEqual(AT_REST)
  })
})

test.describe('the first-session curtain', () => {
  async function freshPage(browser: Browser) {
    const context = await browser.newContext()
    return { context, page: await context.newPage() }
  }

  test('is Arthur`s, and runs once a session', async ({ browser }) => {
    const { context, page } = await freshPage(browser)
    try {
      await page.goto(localizedPath('id', '/'))
      const first = await page.evaluate(() => {
        const curtain = document.querySelector('[data-curtain]')
        return {
          name: curtain?.textContent?.trim() ?? null,
          shown: curtain ? getComputedStyle(curtain).display !== 'none' : false,
          entered: document.documentElement.hasAttribute('data-entered'),
        }
      })
      expect(first.name, 'the curtain carries another name').toBe(BRAND_NAME)
      expect(first.entered, 'a new session was taken for an old one').toBe(
        false
      )
      expect(first.shown, 'the first page of a session had no curtain').toBe(
        true
      )

      // A full load later in the same session: not replayed.
      await page.goto(localizedPath('id', '/metode'))
      const second = await page.evaluate(() => {
        const curtain = document.querySelector('[data-curtain]')
        return {
          shown: curtain ? getComputedStyle(curtain).display !== 'none' : false,
          entered: document.documentElement.hasAttribute('data-entered'),
        }
      })
      expect(second.entered, 'the session was forgotten').toBe(true)
      expect(second.shown, 'the curtain ran a second time').toBe(false)
    } finally {
      await context.close()
    }
  })
})

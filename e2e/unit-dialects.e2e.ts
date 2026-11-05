import { type Browser, expect, type Page, test } from '@playwright/test'

import { UNITS } from '../lib/content/units'
import { SITUATION_ROUTES, WORK_ROUTES } from './fixtures'

/**
 * Unit dialects on the rendered page: F4-02, `docs/MOTION-SPEC.md` §12.1.
 *
 * One grammar, three dialects. `lib/styles/css/dialects.css` writes each
 * unit's tempo once, a unit route selects its own with `data-dialect` on
 * `<main>`, and every reader names the base grammar as its fallback. This
 * measures what that is supposed to produce, on the pages a reader opens:
 *
 * - a representative moment, `unit-method`, moves at a different duration
 *   and on a different curve on each of the three unit pages, and each is
 *   the one §12.1 gives that unit;
 * - Arthur's own pages (home, /layanan, /metode) carry no dialect at all, so
 *   every moment there is the base grammar it was before dialects existed;
 * - a unit's situation and work pages speak that unit's dialect;
 * - under `prefers-reduced-motion` every unit page ends fully visible and in
 *   place (`CLAUDE.md` #5), with the dialect itself collapsed to stillness.
 *
 * `lib/styles/scripts/dialects.test.ts` holds the token file to the table;
 * this holds the pages to the token file.
 */

/** The `<main>` a reader is looking at, past Next's hidden `<Activity>`. */
async function installLiveMain(page: Page) {
  await page.addInitScript(() => {
    globalThis.dialectMain = () => {
      for (const main of document.querySelectorAll('main')) {
        const box = main.getBoundingClientRect()
        if (box.width > 0 && box.height > 0) return main
      }
      return null
    }
  })
}

declare global {
  /** Installed in the page by `installLiveMain`. */
  var dialectMain: () => HTMLElement | null
}

/**
 * What a token resolves to on the live `<main>`, written the way computed
 * style writes it, so a moment's computed value can be compared with it
 * rather than with a number copied out of the stylesheet.
 */
async function resolved(page: Page, duration: string, ease: string) {
  return page.evaluate(
    ([durationValue, easeValue]) => {
      const main = dialectMain()
      if (!main) return null
      const probe = document.createElement('i')
      probe.style.transitionDuration = durationValue ?? ''
      probe.style.transitionTimingFunction = easeValue ?? ''
      main.append(probe)
      const style = getComputedStyle(probe)
      const result = {
        duration: style.transitionDuration,
        ease: style.transitionTimingFunction,
      }
      probe.remove()
      return result
    },
    [duration, ease]
  )
}

/**
 * A moment's timing on the live page: `unit-method`'s first statement, or
 * the first arrival through the shared reveal contract that is not also a
 * pressable noun (whose transition carries its COMMIT).
 */
async function momentTiming(page: Page, selector: string) {
  return page.evaluate((query) => {
    const main = dialectMain()
    const item = main?.querySelector(query)
    if (!main || !item) return null
    const style = getComputedStyle(item)
    return {
      dialect: main.dataset.dialect ?? null,
      duration: style.transitionDuration,
      ease: style.transitionTimingFunction,
      delay: style.transitionDelay,
    }
  }, selector)
}

const UNIT_METHOD = '[data-epic="unit-method"] [data-capability]'
const REVEAL = '[data-reveal] [data-reveal-item]:not([data-press])'

/** The representative moment: `unit-method`'s first statement. */
async function unitMethod(page: Page) {
  return momentTiming(page, UNIT_METHOD)
}

const seconds = (value: string | undefined) =>
  Number.parseFloat(value ?? '') * (value?.endsWith('ms') ? 0.001 : 1)

/** Every dialect parameter that reaches anything on the page, by element. */
async function dialectReach(page: Page) {
  return page.evaluate(() => {
    const main = dialectMain()
    if (!main) return ['no rendered <main>']
    const names = [
      '--dialect-settle',
      '--dialect-ease',
      '--dialect-step',
      '--dialect-travel',
    ]
    const reached: string[] = []
    for (const element of [
      main,
      ...main.querySelectorAll('[data-reveal-item], [data-epic]'),
    ]) {
      const style = getComputedStyle(element)
      for (const name of names) {
        const value = style.getPropertyValue(name).trim()
        if (value !== '') reached.push(`${element.tagName} ${name}: ${value}`)
      }
    }
    return reached
  })
}

/** Walks the page so every IntersectionObserver has fired. */
async function scrollThrough(page: Page) {
  await page.evaluate(async () => {
    const step = window.innerHeight * 0.8
    for (let y = 0; y <= document.body.scrollHeight; y += step) {
      window.scrollTo({ top: y, behavior: 'instant' })
      await new Promise((resolve) => setTimeout(resolve, 120))
    }
  })
  await page.waitForTimeout(1500)
}

test.describe('unit dialects', () => {
  test('unit-method moves at each unit`s own tempo', async ({ page }) => {
    await installLiveMain(page)

    /*
     * §12.1's tempo column, as the curve each unit names and the band its
     * settle must fall in. The curves are resolved in the page, so this
     * compares against the stylesheet's own token, not a copied number.
     */
    const SPEC = {
      konstruksi: { ease: 'var(--ease-out-expo)', min: 0.8, max: 1.2 },
      teknologi: { ease: 'var(--ease-out-quart)', min: 0.15, max: 0.2 },
      peekabo: {
        ease: 'var(--ease-gleasing)',
        min: 0,
        max: Number.POSITIVE_INFINITY,
      },
    } as const

    const seen: { unit: string; duration: string; ease: string }[] = []
    for (const unit of UNITS) {
      await page.goto(`/id/${unit}`)
      await expect(page.locator('main h1').first()).toBeVisible()

      const moment = await unitMethod(page)
      expect(moment, `/id/${unit} has no unit-method`).not.toBeNull()
      expect(moment?.dialect, `/id/${unit} selects no dialect`).toBe(unit)

      // The moment takes its page's dialect, both values.
      const dialect = await resolved(
        page,
        'var(--dialect-settle)',
        'var(--dialect-ease)'
      )
      expect(moment?.duration).toBe(dialect?.duration)
      expect(moment?.ease).toBe(dialect?.ease)

      // And the dialect is the one §12.1 gives this unit.
      const spec = SPEC[unit]
      const curve = await resolved(page, '0s', spec.ease)
      expect(moment?.ease, `${unit} moves on the wrong curve`).toBe(curve?.ease)
      const duration = seconds(moment?.duration)
      expect(duration).toBeGreaterThanOrEqual(spec.min)
      expect(duration).toBeLessThanOrEqual(spec.max)

      seen.push({
        unit,
        duration: moment?.duration ?? '',
        ease: moment?.ease ?? '',
      })
    }

    // The three units are told apart by their motion.
    expect(new Set(seen.map(({ duration }) => duration)).size).toBe(3)
    expect(new Set(seen.map(({ ease }) => ease)).size).toBe(3)
  })

  /*
   * The shared reveal contract carries most of a unit page's motion, so it
   * is the second representative: the unit's own name and eyebrow arrive
   * on the unit's settle and curve, and a step apart. The contract in
   * `global.css` is not edited; `dialects.css` retimes it inside a dialect.
   */
  test('the reveal contract arrives at each unit`s tempo', async ({ page }) => {
    await installLiveMain(page)

    const seen = new Set<string>()
    for (const unit of UNITS) {
      await page.goto(`/id/${unit}`)
      await expect(page.locator('main h1').first()).toBeVisible()
      // `data-reveal` and each item's `--reveal-index` arrive with hydration.
      await expect(page.locator(`main ${REVEAL}`).first()).toBeAttached()

      const arrival = await momentTiming(page, REVEAL)
      expect(arrival, `/id/${unit} has no reveal`).not.toBeNull()
      const dialect = await resolved(
        page,
        'var(--dialect-settle)',
        'var(--dialect-ease)'
      )
      expect(arrival?.duration).toBe(dialect?.duration)
      expect(arrival?.ease).toBe(dialect?.ease)

      // The second item of the same block waits one step of this unit.
      const second = await page.evaluate((query) => {
        const item = dialectMain()?.querySelectorAll(query)[1]
        return item ? getComputedStyle(item).transitionDelay : null
      }, REVEAL)
      const step = await resolved(page, 'var(--dialect-step)', 'ease')
      expect(second, `/id/${unit}: the second arrival`).toBe(step?.duration)

      seen.add(`${arrival?.duration} ${arrival?.ease}`)
    }

    expect(seen.size, 'two units arrive alike').toBe(3)
  })

  for (const path of ['/id', '/id/layanan', '/id/metode']) {
    test(`${path} speaks the base grammar`, async ({ page }) => {
      await installLiveMain(page)
      await page.goto(path)
      await expect(page.locator('main h1').first()).toBeVisible()

      expect(
        await page.evaluate(() => dialectMain()?.dataset.dialect ?? null),
        `${path} selects a dialect`
      ).toBeNull()

      // Not vacuous: the page has moments for a dialect to have reached.
      expect(
        await page.evaluate(
          () =>
            dialectMain()?.querySelectorAll('[data-reveal-item]').length ?? 0
        ),
        `${path} has nothing that moves`
      ).toBeGreaterThan(0)
      expect(await dialectReach(page)).toEqual([])
    })
  }

  for (const path of [...SITUATION_ROUTES, ...WORK_ROUTES]) {
    const unit = path.split('/')[2]
    test(`${path} speaks ${unit}'s dialect`, async ({ page }) => {
      await installLiveMain(page)
      await page.goto(path)
      await expect(page.locator('main h1').first()).toBeVisible()

      expect(
        await page.evaluate(() => dialectMain()?.dataset.dialect ?? null)
      ).toBe(unit)
    })
  }

  /*
   * The work page on the older steps (`WORK_ROUTES[1]`, Konstruksi) carries
   * the offer scope's measure. It is drawn on Konstruksi's beat, and it is
   * drawn at all: in per-item mode its container never stops being `hidden`,
   * and keyed on the container alone the measure stayed undrawn.
   */
  test('the offer measure is drawn, on Konstruksi`s beat', async ({ page }) => {
    await installLiveMain(page)
    await page.goto(WORK_ROUTES[1])
    await expect(page.locator('main h1').first()).toBeVisible()

    const rule = page.locator(
      'main [class*="dimension-module"][class*="__rule"]'
    )
    await expect(rule, 'the work page lost its measure').toHaveCount(1)
    await rule.scrollIntoViewIfNeeded()
    await page.evaluate(() => window.scrollBy(0, window.innerHeight / 4))

    await expect
      .poll(
        () => rule.evaluate((element) => getComputedStyle(element).transform),
        {
          message: 'the measure was never drawn',
          timeout: 5000,
        }
      )
      .toMatch(/^(none|matrix\(1, 0, 0, 1, 0, 0\))$/)

    const timing = await rule.evaluate((element) => {
      const style = getComputedStyle(element)
      return {
        delay: style.transitionDelay,
        ease: style.transitionTimingFunction,
      }
    })
    const konstruksi = await resolved(
      page,
      'calc(var(--dialect-step) * 2)',
      'var(--dialect-ease)'
    )
    expect(timing.delay).toBe(konstruksi?.duration)
    expect(timing.ease).toBe(konstruksi?.ease)
  })

  /*
   * Rule #5, for the dialects. `e2e/motion.e2e.ts` already proves no reveal
   * is left at `opacity: 0` on these routes; this adds what a dialect could
   * break that opacity cannot see: a reveal left off its place by the
   * unit's travel, and a dialect that kept its tempo when asked for none.
   */
  async function reducedMotionPage(browser: Browser, path: string) {
    const context = await browser.newContext({ reducedMotion: 'reduce' })
    const page = await context.newPage()
    await installLiveMain(page)
    await page.goto(path)
    expect(
      await page.evaluate(
        () => matchMedia('(prefers-reduced-motion: reduce)').matches
      ),
      'reduced-motion emulation did not apply'
    ).toBe(true)
    return { context, page }
  }

  for (const path of [
    ...UNITS.map((unit) => `/id/${unit}`),
    ...SITUATION_ROUTES,
    ...WORK_ROUTES,
  ]) {
    test(`${path} ends visible and in place under reduced motion`, async ({
      browser,
    }) => {
      const { context, page } = await reducedMotionPage(browser, path)
      try {
        await expect(page.locator('main h1').first()).toBeVisible()
        await scrollThrough(page)

        const state = await page.evaluate(() => {
          const main = dialectMain()
          if (!main) return null
          const style = getComputedStyle(main)
          const items = [
            ...main.querySelectorAll<HTMLElement>(
              '[data-reveal-item], [data-capability]'
            ),
          ]
          return {
            travel: style.getPropertyValue('--dialect-travel').trim(),
            step: style.getPropertyValue('--dialect-step').trim(),
            unseen: items
              .filter((item) => Number(getComputedStyle(item).opacity) < 0.99)
              .map((item) => `${item.tagName}.${item.className.split(' ')[0]}`),
            moved: items
              .filter((item) => getComputedStyle(item).transform !== 'none')
              .map((item) => `${item.tagName}.${item.className.split(' ')[0]}`),
          }
        })

        expect(state, `${path} rendered no <main>`).not.toBeNull()
        expect(state?.travel, 'the dialect kept its travel').toBe('none')
        expect(state?.step, 'the dialect kept its step').toBe('0s')
        expect(state?.unseen, `${path} left content unseen`).toEqual([])
        expect(state?.moved, `${path} left content off its place`).toEqual([])
      } finally {
        await context.close()
      }
    })
  }
})

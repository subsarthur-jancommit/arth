import { expect, type Page, test } from '@playwright/test'

/**
 * R6's last two page moments (`docs/MOTION-SPEC.md` §13.4 and §13.6).
 *
 * - `network-money-flow`, `/id/peekabo/jaringan`: the plumb line follows the
 *   reader down the four steps on a CSS view timeline; as its tip passes each
 *   step a node lands on the line and a branch runs out to the step, and the
 *   step's stamp is struck. The card's verification is the no-JavaScript and
 *   reduced-motion states, and that the step prose never moves.
 * - `promise-stamp`, `/id/metode`: "Tertulis" is struck onto each promise the
 *   first time it is read and never replayed. The card's verification is the
 *   reduced-motion state.
 */

const NETWORK = '/id/peekabo/jaringan'
const METHOD = '/id/metode'
const FLOW = '[data-epic="network-money-flow"]'
const STEPS = `${FLOW} ol > li`
const PROMISES = '[data-epic="promise-stamp"] ol > li'

/** How far the plumb line is let down: 1 when it hangs its full length. */
async function lineLength(page: Page) {
  return page.evaluate((flow) => {
    const line = document.querySelector(`${flow} ol`)?.parentElement
      ?.firstElementChild
    if (!line) return -1
    const transform = getComputedStyle(line).transform
    return transform === 'none' ? 1 : new DOMMatrixReadOnly(transform).d
  }, FLOW)
}

/** Each step's branch and node, as scales: 1 when drawn. */
async function branches(page: Page) {
  return page.evaluate(
    (steps) =>
      [...document.querySelectorAll(steps)].map((step) => {
        const scale = (transform: string) =>
          transform === 'none' ? 1 : new DOMMatrixReadOnly(transform).a
        return {
          branch: scale(getComputedStyle(step, '::before').transform),
          node: scale(getComputedStyle(step, '::after').transform),
        }
      }),
    STEPS
  )
}

/** Every step's words, as their transforms and their row's. */
async function proseTransforms(page: Page) {
  return page.evaluate(
    (steps) =>
      [...document.querySelectorAll(steps)].flatMap((step) => [
        getComputedStyle(step).transform,
        getComputedStyle(step.querySelector('h3') ?? step).transform,
      ]),
    STEPS
  )
}

/** The stamps in a list's rows: visible, slanted, and still striking. */
async function stamps(page: Page, rows: string) {
  return page.evaluate(
    (selector) =>
      [...document.querySelectorAll(selector)].map((row) => {
        const stamp = row.lastElementChild
        if (!(stamp instanceof HTMLElement)) return null
        return {
          text: stamp.textContent?.trim() ?? '',
          opacity: Number(getComputedStyle(stamp).opacity),
          rotate: getComputedStyle(stamp).rotate,
          striking: stamp
            .getAnimations({ subtree: true })
            .some((animation) => animation.playState === 'running'),
        }
      }),
    rows
  )
}

/** Scrolls so the flow's top sits `above` px over the bottom of the screen. */
async function flowAt(page: Page, above: number) {
  await page.evaluate(
    ({ flow, offset }) => {
      const list = document.querySelector(`${flow} ol`)
      if (!list) return
      const top = list.getBoundingClientRect().top + window.scrollY
      window.scrollTo(0, top - window.innerHeight + offset)
    },
    { flow: FLOW, offset: above }
  )
  await page.waitForTimeout(400)
}

/** Scrolls until the flow's last step is wholly on screen. */
async function pastFlow(page: Page) {
  await page.locator(STEPS).last().scrollIntoViewIfNeeded()
  await page.evaluate(() => window.scrollBy(0, window.innerHeight / 3))
  await page.waitForTimeout(800)
}

test.describe('network-money-flow', () => {
  test('the line follows the reader down, and each step branches off it', async ({
    page,
  }) => {
    await page.goto(NETWORK)
    await page.waitForTimeout(1000)
    await expect(page.locator(STEPS)).toHaveCount(4)

    await flowAt(page, 120)
    const early = await lineLength(page)
    const firstPass = await branches(page)
    await flowAt(page, 420)
    const later = await lineLength(page)

    expect(early, 'the line is not let down with the scroll').toBeLessThan(1)
    expect(later, 'the line did not follow the reader').toBeGreaterThan(early)
    expect(
      firstPass.at(-1),
      'the last step branched before it was reached'
    ).toEqual({ branch: 0, node: 0 })

    // The words never move, whatever the scroll position.
    for (const transform of await proseTransforms(page)) {
      expect(transform, 'step prose has a scroll-linked transform').toBe('none')
    }

    await pastFlow(page)
    expect(await lineLength(page), 'the line never hung its length').toBe(1)
    expect(await branches(page)).toEqual(
      Array.from({ length: 4 }, () => ({ branch: 1, node: 1 }))
    )
    for (const transform of await proseTransforms(page)) {
      expect(transform).toBe('none')
    }
    for (const stamp of await stamps(page, STEPS)) {
      expect(stamp?.opacity, `stamp "${stamp?.text}" never landed`).toBe(1)
      expect(stamp?.rotate).toBe('-3deg')
    }
  })
})

test.describe('promise-stamp', () => {
  test('each promise is stamped once, and never again on the way back', async ({
    page,
  }) => {
    await page.goto(METHOD)
    await page.waitForTimeout(1000)
    const rows = page.locator(PROMISES)
    const count = await rows.count()
    expect(count, `${METHOD} lists no promise`).toBeGreaterThan(0)

    for (let i = 0; i < count; i += 1) {
      await rows.nth(i).scrollIntoViewIfNeeded()
      await page.waitForTimeout(300)
    }
    await page.waitForTimeout(600)
    for (const stamp of await stamps(page, PROMISES)) {
      expect(stamp?.text, 'a promise has no stamp').not.toBe('')
      expect(stamp?.opacity, `stamp "${stamp?.text}" never landed`).toBe(1)
      expect(stamp?.rotate).toBe('-3deg')
    }

    // Back up the list and down again: nothing strikes a second time.
    for (let i = count - 1; i >= 0; i -= 1) {
      await rows.nth(i).scrollIntoViewIfNeeded()
      await page.waitForTimeout(60)
      const striking = (await stamps(page, PROMISES)).filter(
        (stamp) => stamp?.striking
      )
      expect(striking, 'a stamp was struck again').toEqual([])
    }
  })
})

test.describe('flow and promises under reduced motion', () => {
  test('the drawing is finished and every stamp is in place at once', async ({
    browser,
  }) => {
    const context = await browser.newContext({ reducedMotion: 'reduce' })
    const page = await context.newPage()

    try {
      await page.goto(NETWORK)
      await page.waitForTimeout(600)
      await flowAt(page, 120)
      expect(await lineLength(page)).toBe(1)
      expect(await branches(page)).toEqual(
        Array.from({ length: 4 }, () => ({ branch: 1, node: 1 }))
      )
      for (const stamp of await stamps(page, STEPS)) {
        expect(stamp?.opacity).toBe(1)
        expect(stamp?.striking).toBe(false)
      }

      await page.goto(METHOD)
      await page.waitForTimeout(600)
      const marks = await stamps(page, PROMISES)
      expect(marks.length, `${METHOD} lists no promise`).toBeGreaterThan(0)
      for (const stamp of marks) {
        expect(stamp?.opacity, `stamp "${stamp?.text}" is not in place`).toBe(1)
        expect(stamp?.striking).toBe(false)
      }
    } finally {
      await context.close()
    }
  })
})

test.describe('flow and promises without JavaScript', () => {
  test.use({ javaScriptEnabled: false })

  test('the steps, the stamps and, once read, the whole line are there', async ({
    page,
  }) => {
    await page.goto(NETWORK)
    await expect(page.locator(STEPS)).toHaveCount(4)
    for (const stamp of await stamps(page, STEPS)) {
      expect(stamp?.text).not.toBe('')
      expect(stamp?.opacity).toBe(1)
    }
    // The view timeline is CSS: it needs no script to let the line down.
    await pastFlow(page)
    expect(await lineLength(page)).toBe(1)

    await page.goto(METHOD)
    for (const stamp of await stamps(page, PROMISES)) {
      expect(stamp?.opacity, `stamp "${stamp?.text}" is not in place`).toBe(1)
    }
  })
})

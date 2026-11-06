import { expect, type Page, test } from '@playwright/test'

/**
 * The catalogue's filter, and the motion that answers it.
 *
 * ## What left this file in the fork, and why
 *
 * It opened with two layout assertions: every card on `/work` shares one
 * column span, and the home page keeps a mix of spans. Both pinned a
 * composition — the first forbade a catalogue with an editorial rhythm, the
 * second forbade a home page without one — so the fork (`docs/FORK.md`, step
 * 5) removed them. The history that produced them is kept below, because the
 * defect it describes (rows of dead space) is still worth knowing about when
 * the catalogue is redesigned; it is no longer enforced as one layout.
 *
 * ## The layout history
 *
 * ## What this caught, and why nothing else could
 *
 * `ProjectGrid` places each card by the work's own `span` — 6 or 12 of the
 * 12 desktop columns. That is a *composition* choice, made by the studio so a
 * chosen piece runs full width among a handful of neighbours on the home
 * page. Tahap 8 pointed the same block at `/work`, which lists everything.
 *
 * Measured on the built site at 1440px, with three works spanning 6, 12, 6:
 *
 *   card 1   691px wide
 *   card 2  1398px wide   <- cannot sit beside a span-6, so a new row
 *   card 3   691px wide   <- another new row
 *
 * Three rows for three works, two of them carrying ~700px of dead space, and
 * a page 3802px tall. Twenty works would run past 18,000px with the same
 * holes. Every gate passed: axe is clean, nothing overflows, the HTML is
 * complete without JavaScript, the headers are cacheable. It took looking at
 * a screenshot — which is the point `docs/AUDIT-2026-08.md` keeps making
 * about this project, that a green gate is not a correct page.
 *
 * The fix was `layout="catalogue"`, which gives every card the same column.
 */

/**
 * The filter filters — Tahap 39.
 *
 * ## What was wrong, measured before any of this was built
 *
 * `vault/blocks/practice-filter` renders "All" plus one chip per unit, in
 * a `<nav>`, with `aria-current` on the selected one. It looks exactly like a
 * filter. It was not one:
 *
 *   - `app/[locale]/work/page.tsx` hardcoded the active filter to `null`, so the
 *     `active` prop was **always** `null` — "All" was permanently current and
 *     **no chip could ever appear selected**;
 *   - pressing a chip **left the catalogue** for `/practice/<value>`, a
 *     different kind of page with its own hero and statement;
 *   - the filtered branch of `catalogue.tsx` — the `key`, the
 *     `t(`${practice}Title`)` lookup, the empty state — was **dead code**.
 *
 * A control that looks like a filter, behaves like navigation, and never
 * shows a selected state is a usability failure, and more to the point it
 * lies to the reader.
 *
 * ## Why the selected-chip assertion is scoped to the filter's own nav
 *
 * `aria-current` is not unique on this page. Proving these red caught the
 * instrument before it caught the site: a selector of
 * `nav:has(a[href$="/work"])` matched the **header's** route navigation —
 * which Tahap 38 had just added — and reported the current chip as `Work`,
 * the header's own link. The language switcher carries `aria-current="true"`
 * too.
 *
 * So the filter marks itself with `data-practice-filter`, and this queries
 * that. A test hook rather than a structural guess: the same reasoning
 * `data-statement` and `data-site-facts` already carry elsewhere in this
 * suite, and the alternative is an assertion that passes on the wrong
 * element.
 */
/*
 * The first unit, and its reader-facing label.
 *
 * Spelled out rather than read from `messages/*.json`, because for a unit the
 * two happen to coincide — `konstruksi` and "Konstruksi" — and a test that
 * imported the dictionary to prove the dictionary is what the chip shows
 * would be asserting against itself. `lib/content/units.test.ts` is where the
 * key-to-label agreement is checked.
 *
 * The filter's attribute is still `data-practice-filter`: `vault/blocks/` is
 * a library of the practice-era blocks that the F3 unit templates replace,
 * and renaming its hooks now would be churn with no reader behind it.
 * Recorded in `docs/PROGRES-ARTHUR.md`.
 */
const UNIT_LABEL = 'Konstruksi'

test.describe('the filter filters', () => {
  const FILTER = '[data-practice-filter]'

  test('a unit chip narrows the catalogue in place', async ({ page }) => {
    await page.goto('/en/work')

    const all = await page.locator('article[data-span]').count()
    expect(all, 'no work to filter').toBeGreaterThan(1)

    await page.goto('/en/work?unit=konstruksi')
    await page.waitForLoadState('networkidle')

    // Still the catalogue, not another page: same route, narrower list.
    expect(new URL(page.url()).pathname).toBe('/en/work')

    const narrowed = await page.locator('article[data-span]').count()
    expect(
      narrowed,
      `filtering to konstruksi changed nothing: ${all} -> ${narrowed}`
    ).toBeLessThan(all)
    // Anti-vacuum: narrowing to nothing would also satisfy "fewer".
    expect(narrowed).toBeGreaterThan(0)
  })

  test('the selected chip says so, and only it does', async ({ page }) => {
    await page.goto('/en/work?unit=konstruksi')
    await page.waitForLoadState('networkidle')

    const chips = page.locator(FILTER).locator('a')
    expect(await chips.count(), 'no filter chips').toBeGreaterThan(2)

    /*
     * The chip's *name*, not its `textContent` — Tahap 43.
     *
     * Since Tahap 43 a chip also renders how many works it narrows to, in an
     * `aria-hidden` span, so `textContent` reads "Konstruksi02" while the
     * control's accessible name is still "Konstruksi". This assertion is
     * about which chip is marked current, and the answer to that question is
     * the name a reader is given, so the count is excluded here rather than
     * baked into the expectation — an expectation of "Konstruksi02" would go
     * red the next time a work is published, which is not a defect.
     */
    const current = await chips.evaluateAll((nodes) =>
      nodes
        .filter((node) => node.getAttribute('aria-current') !== null)
        .map((node) =>
          [...node.childNodes]
            .filter(
              (child) =>
                !(
                  child instanceof Element &&
                  child.getAttribute('aria-hidden') === 'true'
                )
            )
            .map((child) => child.textContent ?? '')
            .join('')
            .trim()
        )
    )

    expect(current, `chips marked current: ${current.join(', ')}`).toEqual([
      UNIT_LABEL,
    ])
  })

  test('an unknown unit falls back to the whole catalogue', async ({
    page,
  }) => {
    // Not a 404: `?unit=nonsense` is a request that cannot be met, not a
    // page that is missing. The full catalogue is the honest answer.
    await page.goto('/en/work')
    const all = await page.locator('article[data-span]').count()

    await page.goto('/en/work?unit=nonsense')
    await page.waitForLoadState('networkidle')

    expect(await page.locator('article[data-span]').count()).toBe(all)
    expect(await page.locator('h1').first().textContent()).toContain('Work')
  })

  test('the filter works with JavaScript disabled', async ({ browser }) => {
    /*
     * The measurement that decided this stage's shape.
     *
     * Tahap 10 removed the query filter because, behind the Suspense boundary
     * `cacheComponents` then required, `/en/work` rendered its heading, the
     * word "Loading", and zero projects. `export const instant = false` did
     * not exist yet. With it, measured on the production build:
     *
     *   /en/work                      813 chars  <h1>Work</h1>        6 links
     *   /en/work?unit=konstruksi  612 chars  <h1>Konstruksi</h1>  2 links
     *
     * Those numbers are what this pins.
     */
    const context = await browser.newContext({ javaScriptEnabled: false })
    const page = await context.newPage()
    try {
      await page.goto('/en/work?unit=konstruksi', {
        waitUntil: 'domcontentloaded',
      })

      const rendered = await page.evaluate(() => ({
        chars: (document.body.innerText || '').trim().length,
        heading: document.querySelector('h1')?.textContent?.trim() ?? '',
        cards: document.querySelectorAll('article[data-span]').length,
      }))

      expect(
        rendered.chars,
        `only rendered ${rendered.chars} characters`
      ).toBeGreaterThan(400)
      expect(rendered.heading).toBe('Konstruksi')
      expect(
        rendered.cards,
        'the filtered catalogue rendered no work server-side'
      ).toBeGreaterThan(0)
    } finally {
      await context.close()
    }
  })
})

/**
 * `catalogue-sift` — the choreography, measured rather than assumed.
 *
 * ## What was verified by hand before these were written
 *
 * On the production build, filtering `/en/work` by unit (6 cards -> 2):
 *
 * ```
 * survivor fixture-arus-balik   from translate3d(0, -33.22px, 0)  800ms  delay 0
 * survivor fixture-pusat-beban  from translate3d(0, -33.22px, 0)  800ms  delay 70
 * easing   cubic-bezier(0.77, 0, 0.175, 1)   = --ease-in-out-quart
 * ghosts   4 detached cards in one aria-hidden overlay, 0 after it settles
 * ```
 *
 * 800ms is `--duration-slow`; 70ms is `--stagger-cards`; the curve is
 * `--ease-in-out-quart`. All three had **zero** consumers before this stage
 * (`docs/stages/TAHAP-34.md` D3 counted them), which is the whole point of
 * spending them here rather than adding new values.
 *
 * `in-out` is used deliberately and is the one case `CLAUDE.md` #2 allows: a
 * card leaves one position and arrives at another. Everything else on this
 * site is `out-*`.
 *
 * ## When the sift is read
 *
 * On the frame the grid changes, never a fixed time after the press. The
 * sift starts in the commit that swaps the list (`vault/motion/flip` builds
 * the ghosts and the moves in that commit's layout effect), and the commit
 * waits on the navigation to `?unit=`, a dynamic render. How long that takes
 * is the machine's business: from a prefetch made at load it is immediate,
 * and without one it is a round trip.
 *
 * Each test used to sleep 90 to 120ms after the press and read whatever was
 * there. On e2e run 42205072919 the departure test's first attempt ran beside
 * the other two on one server, and its read found no ghosts (`mid.ghosts`
 * 0). The screenshot taken a moment later already shows the filtered list,
 * with the heading on `Konstruksi` and the count on 2. Ghosts are made in
 * the same effect run as the moves the survivors test found in that run, and
 * they outlast every move, so the read came before the commit. It was not a
 * sift that made none. The retry's trace has all three `?unit=` URLs
 * prefetched at load and the commit straight after the press. Now the read
 * is taken on the first frame the grid's count changes. The end is the
 * ghost layer's own removal, then each card's own arrival (the departure
 * test says why the second one is needed).
 */

/** The live grid's cards; a departing card is an `<li>` too, outside it. */
const CARDS = 'ul li[data-flip-id]'
/** The departing cards, in the overlay `vault/motion/flip` builds for them. */
const GHOSTS = 'body > div[aria-hidden="true"] > li'
/** That overlay, which goes once every animation of the sift has settled. */
const GHOST_LAYER = 'body > div[aria-hidden="true"][style*="fixed"]'

/**
 * `/en/work`, hydrated: the masthead's reveal has run its layout effect, so
 * React owns the page, a chip navigates in place, and the grid has measured
 * where its cards stand. Returns how many cards it shows.
 */
async function openCatalogue(page: Page) {
  await page.goto('/en/work')
  await page.waitForLoadState('networkidle')
  await expect(
    page.locator('main [data-reveal]').first(),
    'the catalogue never hydrated'
  ).toHaveAttribute('data-reveal', /^(hidden|visible)$/)
  return page.locator(CARDS).count()
}

/** Presses the unit chip. What follows waits on the grid, not on a clock. */
async function pressUnit(page: Page) {
  await page
    .locator('[data-practice-filter] a', { hasText: UNIT_LABEL })
    .click()
}

/** What a frame read is handed: the selectors, and the count before. */
interface FrameArg {
  cards: string
  ghosts: string
  count: number
}

/**
 * The first frame on which `read` returns a value, and that value.
 *
 * `waitForFunction` polls once per animation frame and resolves only on a
 * truthy return, so the `null` its type allows never arrives; the check
 * below says so rather than asserting it away.
 */
async function onFrame<Value>(
  page: Page,
  read: (arg: FrameArg) => Value | null,
  count: number
): Promise<Value> {
  const arg: FrameArg = { cards: CARDS, ghosts: GHOSTS, count }
  const handle = await page.waitForFunction(read, arg, { timeout: 15_000 })
  const value = await handle.jsonValue()
  if (value === null) throw new Error('waitForFunction resolved on null')
  return value
}

test.describe('catalogue-sift', () => {
  test('surviving cards animate from where they were', async ({ page }) => {
    const before = await openCatalogue(page)
    await pressUnit(page)

    /*
     * `ul li[...]`, not `li[...]`. The departing cards are real `<li>`
     * elements too, re-parented into the exit overlay and carrying their own
     * `scale(1)` -> `scale(0.98)` animation — so an unscoped selector reads
     * them as failed FLIPs. Caught by this assertion going red with
     * "started from scale(1)", which is the exit animation working correctly.
     *
     * Read on the first frame the grid has changed. An empty list is truthy,
     * so a sift that animated nothing still resolves here, and fails below.
     */
    const moving = await onFrame(
      page,
      ({ cards, count }) => {
        const live = [...document.querySelectorAll(cards)]
        if (live.length === count) return null
        return live.flatMap((node) =>
          node.getAnimations().map((animation) => {
            const timing = animation.effect?.getTiming() ?? {}
            /*
             * `getKeyframes` lives on `KeyframeEffect`, not on the
             * `AnimationEffect` base type the DOM lib gives `animation.effect`.
             * Every animation on this page is created by `element.animate()`,
             * which returns exactly that subtype — narrowed with `instanceof`
             * rather than asserted, so the check is earned instead of claimed.
             */
            const effect = animation.effect
            const frames =
              effect instanceof KeyframeEffect ? effect.getKeyframes() : []
            return {
              from: String(frames[0]?.transform ?? ''),
              duration: Number(timing.duration ?? 0),
              delay: Number(timing.delay ?? 0),
              easing: String(timing.easing ?? ''),
            }
          })
        )
      },
      before
    )

    expect(
      moving.length,
      'nothing animated on a filter change'
    ).toBeGreaterThan(0)

    for (const animation of moving) {
      // A FLIP that starts at identity is a FLIP that measured nothing.
      expect(animation.from, `started from ${animation.from}`).toMatch(
        /translate3d\((?!0px, 0px, 0px)/
      )
      expect(animation.duration, 'not the choreographed band').toBe(800)
      expect(animation.easing).toBe('cubic-bezier(0.77, 0, 0.175, 1)')
    }

    // Distance-ranked stagger: at least two different delays, all multiples
    // of the token. One delay for everything is a simultaneous move, which is
    // the thing this choreography exists not to be.
    const delays = [...new Set(moving.map((animation) => animation.delay))]
    for (const delay of delays) expect(delay % 70).toBe(0)
  })

  test('departing cards leave, and leave nothing behind', async ({ page }) => {
    const before = await openCatalogue(page)
    await pressUnit(page)

    // The commit's own frame. Its layout effect has built the ghosts, and they
    // stay until every move of the sift has settled, so a sift that made none
    // reads 0 here.
    const mid = await onFrame(
      page,
      ({ cards, ghosts, count }) => {
        const inGrid = document.querySelectorAll(cards).length
        if (inGrid === count) return null
        return { inGrid, ghosts: document.querySelectorAll(ghosts).length }
      },
      before
    )

    expect(mid.ghosts, 'no cards were animated out').toBeGreaterThan(0)
    expect(mid.ghosts + mid.inGrid).toBe(before)

    // The end of the ghosts' own lifecycle: the layer goes once every
    // animation of the sift has finished.
    await expect
      .poll(() => page.locator(GHOST_LAYER).count(), {
        message: 'the ghost layer was not cleaned up',
      })
      .toBe(0)

    /*
     * Then the cards' own arrival, which is not the sift's to wait for.
     *
     * `/work` reveals card by card (`useReveal({ perItem: true })`), and the
     * Konstruksi survivors are the last two works, far below the fold at load
     * and never revealed. The sift carries them up at opacity 0, their reveal
     * starts as they cross its line near the end of the move, and its 400ms
     * fade outlasts the moves. Measured on production at this viewport (same
     * dataset as CI): when the layer went, both were 200ms into that fade
     * (0.978, 0.984), the same tail e2e run 42209223291 read (0.993, 0.999).
     * 1.5s later both were at 1 with nothing running. So this waits until
     * every card has arrived and nothing moves it any more, and fails if
     * that never happens. A card stranded below 1 still fails below.
     */
    await expect
      .poll(
        () =>
          page.evaluate((cards) => {
            const live = [...document.querySelectorAll(cards)]
            return live.every(
              (node) =>
                node.getAttribute('data-reveal-item') === 'visible' &&
                node.getAnimations().length === 0
            )
          }, CARDS),
        { message: 'a card never finished arriving after the sift' }
      )
      .toBe(true)

    const settled = await page.evaluate(
      (cards) => ({
        opacities: [...document.querySelectorAll(cards)].map(
          (node) => getComputedStyle(node).opacity
        ),
        // A ghost layer left behind would sit over the page invisibly.
        overflows: document.documentElement.scrollWidth > window.innerWidth,
      }),
      CARDS
    )

    expect(settled.opacities.every((value) => value === '1')).toBe(true)
    expect(settled.overflows).toBe(false)
  })

  test('reduced motion cuts it, and the filter still works', async ({
    browser,
  }) => {
    const context = await browser.newContext({ reducedMotion: 'reduce' })
    const page = await context.newPage()
    try {
      const before = await openCatalogue(page)
      await pressUnit(page)

      // The commit's own frame: the list has changed, and nothing moved it.
      const settled = await onFrame(
        page,
        ({ cards, ghosts, count }) => {
          const live = [...document.querySelectorAll(cards)]
          if (live.length === count) return null
          return {
            cards: live.length,
            opacities: live.map((node) => getComputedStyle(node).opacity),
            ghosts: document.querySelectorAll(ghosts).length,
          }
        },
        before
      )

      // The filter is a feature, not an animation: it works identically.
      expect(settled.cards).toBe(2)
      // `CLAUDE.md` #5 — content ends fully visible, never stranded.
      expect(settled.opacities.every((value) => value === '1')).toBe(true)
      expect(settled.ghosts).toBe(0)

      // Two frames on, still well inside the 200 to 800ms a sift's animations
      // run for: nothing on the grid is animating.
      const running = await page.evaluate(
        (cards) =>
          new Promise<number>((resolve) => {
            requestAnimationFrame(() =>
              requestAnimationFrame(() =>
                resolve(
                  [...document.querySelectorAll(cards)].flatMap((node) =>
                    node.getAnimations()
                  ).length
                )
              )
            )
          }),
        CARDS
      )
      expect(running, 'reduced motion still animated the grid').toBe(0)
    } finally {
      await context.close()
    }
  })
})

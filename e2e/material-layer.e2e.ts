import type { Locator, Page } from '@playwright/test'
import { expect, test } from '@playwright/test'

import {
  plateSkipReason,
  waitForCanvas,
  waitForPlate,
  WEBGL_ARRIVAL_MS,
  WEBGL_TEST_BUDGET_MS,
  webglIntent,
} from './webgl-intent'

/**
 * The material layer draws, and it gets out of the way before a navigation.
 *
 * ## Why the first test measures pixels and not the DOM
 *
 * `vault/webgl/material-image` hides the DOM `<img>` and lets a WebGL mesh
 * stand in for it. Every DOM-shaped assertion about that arrangement passes
 * whether or not the mesh renders a single pixel: the wrapper is there, the
 * attribute is there, the image is correctly at `opacity: 0`. The first build
 * of this stage did exactly that — four covers on the home page were **empty
 * boxes**, with a green typecheck, a green lint, a green build, and every
 * existing e2e gate passing.
 *
 * The cause was two layers deep and invisible from the DOM: the shared canvas
 * already contains a full-viewport background quad (the hero's
 * `GradientScene`) sitting at the same depth as every DOM-anchored mesh and
 * writing depth, so it occluded the plates; and the card's own placeholder
 * background sat over the canvas besides. Neither is expressible as a DOM
 * assertion. See `docs/stages/TAHAP-14.md` §11.2 and §11.3.
 *
 * So this reads the rendered page. A plate that is actually drawn has a wide
 * spread of colour across its box; a plate that is missing is one flat value,
 * whatever that value happens to be. The threshold is on *range*, not on any
 * particular colour, so it keeps meaning the same thing if the palette or the
 * fixtures change.
 *
 * ## On `/work` since the follow-up to F4-04
 *
 * These gates were written against the home page's work grid. V1 removed that
 * grid (decision D1, `docs/RENCANA-KONTEKS-V2.md`), and all four sat behind
 * `test.fixme` from then on, while the same material kept running on `/work`
 * (`app/[locale]/work/catalogue.tsx` passes `material` to `ProjectGrid`) and
 * on every work page. They now measure the catalogue, through the same
 * `project-card` and `material-image` they were written for; their claims are
 * unchanged. The fourth was rebuilt, and says why.
 */

/** Where the material lives now: the catalogue's grid. */
const WORK = '/id/work'

/** A catalogue card, the control that owns a plate. */
const CARD = 'article[data-span] a[data-press="card"]'

/**
 * Buffers and textures alive in each WebGL context, as counted by the probe in
 * the last test.
 *
 * A real global rather than an assertion at each use: an assertion chain
 * hides a typo in the shape, and this shape is written here and read inside
 * the browser, where nothing would catch it.
 */
declare global {
  interface Window {
    __glLive?: Map<
      WebGL2RenderingContext,
      { buffers: number; textures: number }
    >
  }
}

/**
 * Put the catalogue's grid on screen and let the canvas draw.
 *
 * ## Why the wait is a parameter
 *
 * The leak test below comes back to this page several times. Four
 * `networkidle` waits on the old home page blew a **90-second** budget twice
 * on one CI runner, on a commit that touched nothing on that route; raising
 * the budget again would only have moved the number the next slow runner had
 * to beat. `networkidle` stays the default, because the single-visit tests
 * each navigate once and the wait costs them nothing: the first visit fetches
 * the plate's texture and leaves it warm in the HTTP cache. The wait was
 * never the assertion.
 *
 * ## Scrolled by Playwright, not by the page — Tahap 91
 *
 * `scrollIntoViewIfNeeded` re-checks until the element is really in view.
 * One in-page `scrollIntoView` did not land on the old home page, whose pin
 * moved the plate while it was being scrolled to; the catalogue has no pin,
 * and the retrying scroll costs nothing here.
 */
async function showWorkGrid(
  page: Page,
  wait: 'networkidle' | 'load' = 'networkidle'
) {
  await page.goto(WORK, { waitUntil: wait })
  const plate = page.locator(CARD).first().locator('[data-material-shell]')
  await expect(plate, `${WORK} renders no material plate`).toBeAttached()
  await plate.scrollIntoViewIfNeeded()

  // The mesh needs its texture decoded and at least one frame advanced. The
  // canvas runs on Tempus, not on Playwright's idea of idle.
  await page.waitForTimeout(2500)
}

/** The first catalogue card, and the plate it owns. */
function firstCard(page: Page) {
  const card = page.locator(CARD).first()
  // The stable shell, not the state attribute: `[data-material]` is removed
  // the instant the handoff happens, so a locator built from it stops
  // matching exactly when the behaviour under test starts working.
  return { card, root: card.locator('[data-material-shell]') }
}

/**
 * Reads a plate once nothing about it is still moving — Tahap 91.
 *
 * The handover is an attribute flip, and `material-image.module.css` gives
 * `.root` a 150ms opacity transition, so for a moment the plate is marked
 * handed over and still fully opaque. Measured on this laptop, six replicas of
 * the sequence below: the attribute lands at 0.3s with a warm HTTP cache and
 * at 2.3s with a cold one, and one run in six flipped it **218ms before** the
 * gate read the shell. `getAnimations()` at that instant reported the opacity
 * transition `running` at `currentTime: 0` — created, and not advanced by a
 * millisecond, because the mesh's first frame had the main thread. That is
 * why the failure always read exactly `"1"` and never an intermediate value.
 *
 * So this waits for the transition rather than for a duration. Reading the
 * computed value first is the flush: a transition started by an attribute
 * does not exist until the next style recalculation, and `getComputedStyle`
 * forces one.
 */
async function readSettled(shell: Locator) {
  return shell.evaluate(async (node) => {
    const snapshot = () => ({
      active: node.hasAttribute('data-material'),
      // Reading the computed value is also the flush that starts a pending
      // transition, so the check below sees one that exists but has not run.
      opacity: getComputedStyle(node).opacity,
      hasImage: Boolean(node.querySelector('img')),
    })
    // Bounded rather than timed, and re-taken each pass: a plate that flips
    // while this waits is caught by the next snapshot rather than mixed into
    // the last one.
    for (let pass = 0; pass < 4; pass++) {
      const taken = snapshot()
      const running = node
        .getAnimations()
        .filter((animation) => animation.playState === 'running')
      if (running.length === 0) return taken
      await Promise.all(
        running.map((animation) => animation.finished.catch(() => undefined))
      )
    }
    return snapshot()
  })
}

/**
 * Waits until the plate reads `opacity` once settled, or fails after the
 * WebGL budget: polled through `readSettled`, so a transition the mesh's
 * first frames are holding back is waited for, never read half way.
 */
async function expectSettledOpacity(
  root: Locator,
  opacity: '0' | '1',
  message: string
) {
  await expect
    .poll(async () => (await readSettled(root)).opacity, {
      message,
      timeout: WEBGL_ARRIVAL_MS,
    })
    .toBe(opacity)
}

/**
 * The catalogue on screen with its first plate handed over to the canvas, or
 * the reason this run cannot ask for that — decided, then waited for
 * (Tahap 90, `e2e/webgl-intent.ts`). Each caller sets its own budget first;
 * this sets none, so it never shortens a longer one.
 */
async function drawnFirstPlate(page: Page) {
  await showWorkGrid(page)
  const intent = await webglIntent(page)
  test.skip(!intent.intended, intent.reason)
  await waitForCanvas(page)

  const { card, root } = firstCard(page)
  const plate = await waitForPlate(root)
  test.skip(plate !== 'drawn', plateSkipReason(plate))
  await expectSettledOpacity(
    root,
    '0',
    'the material should be drawing before the press'
  )
  return { card, root }
}

test.describe('material layer', () => {
  test('no plate is ever a blank box', async ({ page }) => {
    /*
     * ## What this asserts, and what it deliberately does not
     *
     * The failure this stage kept producing was a *blank card*: the DOM image
     * hidden at `opacity: 0` while the mesh that was supposed to replace it
     * drew nothing. It happened twice, for two unrelated reasons — a
     * full-viewport background quad writing depth over the plates, and a
     * placement bug reading Lenis' eased scroll instead of the real one — and
     * both times the build, the types, the lint and every existing gate were
     * green.
     *
     * The obvious gate is a pixel comparison: render the plate with the
     * material and with `prefers-reduced-motion`, and require the two to
     * carry the same spread of colour. That was written, and it does not
     * hold up **as an automated gate in this environment**: on a headless
     * software renderer the WebGL layer is present in some captures and
     * absent from others, run to run, with the page in an identical state.
     * A flaky gate is worse than no gate, because it teaches you to re-run.
     * The comparison was therefore made by hand and recorded with its numbers
     * in `docs/stages/TAHAP-14.md` §11.6 — material `178/159/120` against the
     * DOM's `177/157/120` in the same box — and what is automated here is the
     * invariant that makes the blank box impossible in the first place.
     *
     * ## The invariant
     *
     * `data-material` is written only after the mesh has reported a frame it
     * could actually have been drawn in — texture bound, rect measured,
     * matrix written (`vault/webgl/material-image/scene.tsx`). So the DOM
     * image is never hidden on the *assumption* that something replaced it.
     * If the mesh never draws, the attribute never lands, and the plate stays
     * the plain image, which is the documented fallback.
     *
     * That turns "the material is broken" from a silent visual defect into a
     * no-op. This test holds the two halves of it: a hidden image always has
     * a canvas behind it, and a plate without a material is always visible.
     *
     * ## What it does not catch, stated plainly
     *
     * This test would **not** have caught either original defect on its own.
     * With the old speculative hiding, a non-drawing mesh still produced
     * `data-material` on a page that had a canvas, and every assertion below
     * would have passed over four blank rectangles. What prevents that is the
     * component contract, not this file. This is the regression guard for the
     * contract; the contract is the fix.
     */
    test.setTimeout(WEBGL_TEST_BUDGET_MS)
    await showWorkGrid(page)

    const intent = await webglIntent(page)
    test.skip(!intent.intended, intent.reason)

    const shells = page.locator('[data-material-shell]')
    const count = await shells.count()
    expect(
      count,
      'the catalogue renders no material shells at all'
    ).toBeGreaterThan(0)

    /*
     * The decision is waited for on the plate that was put on screen, and on
     * that one only — Tahap 91.
     *
     * A plate well below the fold is not asked to draw, and a gate that
     * demands it anyway fails against a working site. So the wait is on the
     * plate `showWorkGrid` scrolled to, and the rest are held to the invariant
     * that survives either answer: marked means hidden, unmarked means
     * visible.
     */
    const onScreen = await waitForPlate(firstCard(page).root)
    test.skip(onScreen !== 'drawn', plateSkipReason(onScreen))

    const plates = await Promise.all(
      (await shells.all()).map((shell) => readSettled(shell))
    )

    const canvases = await page.locator('canvas').count()

    for (const [index, plate] of plates.entries()) {
      expect(plate.hasImage, `plate ${index} has no <img> at all`).toBe(true)

      if (plate.active) {
        // Hidden, so something must be drawing in its place.
        expect(
          canvases,
          `plate ${index} hid its image with no canvas on the page`
        ).toBeGreaterThan(0)
        expect(
          plate.opacity,
          `plate ${index} is marked active but is not handed over`
        ).toBe('0')
      } else {
        // Not hidden — the plain plate, fully visible. Either it was never
        // asked to draw, or its picture never arrived; both keep the image.
        expect(
          plate.opacity,
          `plate ${index} has no material and is still invisible — a blank box`
        ).toBe('1')
      }
    }
  })

  test('COMMIT hands the plate back to the DOM before navigating', async ({
    page,
  }) => {
    test.setTimeout(WEBGL_TEST_BUDGET_MS)
    const { card, root } = await drawnFirstPlate(page)

    /*
     * `pointerdown` alone, deliberately — not `click()`.
     *
     * The claim is that the DOM image is back *before* the navigation, so the
     * measurement has to land in the window between the press and the route
     * change. A full click closes that window.
     */
    const box = await card.boundingBox()
    if (!box) throw new Error('no card to press')

    /*
     * In the middle of the part of the card that is on screen. A tall card's
     * geometric centre can sit below the fold, and a mouse event aimed there
     * lands on nothing at all — the same shape of mistake as the Tahap 12
     * press gate that reported four working cards as silent. Clamping that
     * centre to the bottom of the viewport is not enough either: for a card
     * whose top sits just above the fold, the clamped point is above it.
     */
    const viewportHeight = page.viewportSize()?.height ?? 720
    const visibleTop = Math.max(box.y, 0)
    const visibleBottom = Math.min(box.y + box.height, viewportHeight)
    if (visibleBottom - visibleTop < 2) {
      throw new Error('the card that owns the plate is not on screen to press')
    }
    await page.mouse.move(
      box.x + box.width / 2,
      (visibleTop + visibleBottom) / 2
    )
    await page.mouse.down()

    await expect(
      root,
      'the press did not reach the card that owns the plate'
    ).not.toHaveAttribute('data-material')
    await expectSettledOpacity(
      root,
      '1',
      'COMMIT did not stand the material down — a ViewTransition would photograph an empty box'
    )

    await page.mouse.up()
  })

  test('the keyboard reaches COMMIT too', async ({ page }) => {
    test.setTimeout(WEBGL_TEST_BUDGET_MS)
    const { card, root } = await drawnFirstPlate(page)

    await card.focus()

    /*
     * Enter on a link synthesises a click, and the navigation that follows
     * would take the page this measures away mid-read. That click is
     * cancelled here, in the capture phase on the card itself, which `Link`
     * honours: the claim is about the keydown, which reaches COMMIT before
     * any click exists (`project-card`'s `onKeyDown`), and the route change is
     * the next stage's business, not this one's.
     */
    await card.evaluate((link) => {
      link.addEventListener('click', (event) => event.preventDefault(), {
        capture: true,
        once: true,
      })
    })
    await page.keyboard.down('Enter')

    await expect(
      root,
      'the keydown did not reach the card that owns the plate'
    ).not.toHaveAttribute('data-material')
    await expectSettledOpacity(
      root,
      '1',
      'a keyboard press reaches TRANSPORT without ever producing a pointer event, and must stand the material down too'
    )
    await page.keyboard.up('Enter')
  })

  test('repeated mounts do not grow GPU memory', async ({ page }) => {
    /*
     * ## Rebuilt in the follow-up to F4-04, and why the old one proved nothing
     *
     * The old version counted `createBuffer` against `deleteBuffer` from an
     * init script and moved between pages with `page.goto`. A `goto` is a new
     * document: the init script runs again and the counter starts again at
     * zero, so "after one visit" and "after four" were two unrelated single
     * loads. It could not see a leak, because a full navigation destroys the
     * whole WebGL context, and everything in it, before the next count begins.
     *
     * Memory can only build up across navigations that keep the document, and
     * on this site those are the client-side ones: the root canvas lives in
     * the page tree, `cachedNavigations` keeps the page just left alive but
     * hidden, and coming back rebuilds the r3f root in a new context
     * (Tahap 85, `lib/webgl/components/canvas/webgl.tsx`). So this goes away
     * from `/work` and back three times through links and Back, in one
     * document, and counts buffers and textures **per context**: a rebuilt
     * root is a new context with its own count, and a context the browser has
     * dropped takes everything in it along.
     *
     * Three claims, after the last return:
     *
     * 1. one live context on screen, never two;
     * 2. no context still alive on a canvas that has left the document — the
     *    leak `e2e/webgl-lifecycle.e2e.ts` holds for the home page, held here
     *    for the material layer;
     * 3. the live context holds no more buffers or textures than the first
     *    visit's did, give or take a small allowance: growth with the number of
     *    visits is the leak. drei's texture cache keeps one texture per
     *    distinct URL for the page's lifetime by design
     *    (`vault/webgl/material-image/scene.tsx`), which is a cache, not a
     *    leak, and why the allowance is not zero.
     *
     * `renderer.info` is unreachable from a production page, so this counts at
     * the API boundary instead, whoever made the object.
     */
    test.setTimeout(WEBGL_TEST_BUDGET_MS * 2)

    await page.addInitScript(() => {
      const live = new Map<
        WebGL2RenderingContext,
        { buffers: number; textures: number }
      >()
      window.__glLive = live
      const of = (context: WebGL2RenderingContext) => {
        let entry = live.get(context)
        if (!entry) {
          entry = { buffers: 0, textures: 0 }
          live.set(context, entry)
        }
        return entry
      }

      const proto = WebGL2RenderingContext.prototype
      const makeBuffer = proto.createBuffer
      const dropBuffer = proto.deleteBuffer
      const makeTexture = proto.createTexture
      const dropTexture = proto.deleteTexture

      proto.createBuffer = function createBuffer() {
        of(this).buffers++
        return makeBuffer.call(this)
      }
      proto.deleteBuffer = function deleteBuffer(buffer: WebGLBuffer | null) {
        if (buffer) of(this).buffers--
        return dropBuffer.call(this, buffer)
      }
      proto.createTexture = function createTexture() {
        of(this).textures++
        return makeTexture.call(this)
      }
      proto.deleteTexture = function deleteTexture(
        texture: WebGLTexture | null
      ) {
        if (texture) of(this).textures--
        return dropTexture.call(this, texture)
      }
    })

    /*
     * What each context holds right now. Only contexts that allocated
     * something count: a probe like `webglIntent`'s makes a context on a
     * canvas that never enters the page, and allocates nothing.
     */
    const census = () =>
      page.evaluate(() => {
        const entries = [...(window.__glLive ?? new Map()).entries()].filter(
          ([, held]) => held.buffers > 0 || held.textures > 0
        )
        const alive = entries.filter(([context]) => !context.isContextLost())
        const onScreen = alive.filter(
          ([context]) =>
            context.canvas instanceof HTMLCanvasElement &&
            context.canvas.isConnected
        )
        const held = onScreen.reduce(
          (sum, [, counts]) => ({
            buffers: sum.buffers + counts.buffers,
            textures: sum.textures + counts.textures,
          }),
          { buffers: 0, textures: 0 }
        )
        return {
          contexts: entries.length,
          onScreen: onScreen.length,
          detachedAlive: alive.length - onScreen.length,
          ...held,
        }
      })

    /** Until the context on screen has uploaded the plate's picture. */
    const drawing = () =>
      expect
        .poll(
          async () => {
            const now = await census()
            return now.onScreen === 1 && now.textures > 0
          },
          {
            message: `${WORK}: no live context on screen holding a texture`,
            timeout: WEBGL_ARRIVAL_MS,
          }
        )
        .toBe(true)

    await drawnFirstPlate(page)
    await drawing()
    const first = await census()

    for (let visit = 0; visit < 3; visit++) {
      /*
       * Away through a link, back through history: client-side both ways, so
       * the document — and the counter — survive. `/id/kontak` carries no
       * canvas (`e2e/route-budget.e2e.ts`), and the header links it from
       * every page.
       */
      const away = page.locator('a[href$="/id/kontak"]').first()
      await away.scrollIntoViewIfNeeded()
      await away.click()
      await page.waitForURL('**/id/kontak', { timeout: 30_000 })
      await page.waitForTimeout(700)
      await page.goBack()
      await page.waitForURL((url) => url.pathname === WORK, {
        timeout: 30_000,
      })
      await firstCard(page).root.scrollIntoViewIfNeeded()
      await drawing()
      await page.waitForTimeout(2500)
      /*
       * Counted like for like: the rebuilt context starts with the flowmap's
       * own targets and uploads the plates' pictures as they draw. Given a
       * bounded while to reach the first visit's texture count, so the
       * comparison below is between two contexts that drew the same plates,
       * not between a full one and one still filling up. Falling short is
       * not a failure here: fewer objects cannot be a leak.
       */
      for (let check = 0; check < 20; check++) {
        if ((await census()).textures >= first.textures) break
        await page.waitForTimeout(500)
      }
    }
    const last = await census()

    expect(
      last.onScreen,
      `${last.onScreen} live contexts on screen after three returns`
    ).toBe(1)
    expect(
      last.detachedAlive,
      `a context is still alive on a canvas that left the document (${last.contexts} contexts seen)`
    ).toBe(0)
    expect(
      last.buffers,
      `WebGL buffers in the live context grew ${first.buffers} → ${last.buffers} across 3 returns`
    ).toBeLessThanOrEqual(first.buffers + 8)
    expect(
      last.textures,
      `WebGL textures in the live context grew ${first.textures} → ${last.textures} across 3 returns`
    ).toBeLessThanOrEqual(first.textures + 8)
  })
})

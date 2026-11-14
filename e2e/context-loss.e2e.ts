import type { Locator, Page } from '@playwright/test'
import { expect, test } from '@playwright/test'

import { waitForEntrance } from './page-settled'
import {
  plateSkipReason,
  waitForCanvas,
  waitForPlate,
  WEBGL_ARRIVAL_MS,
  WEBGL_TEST_BUDGET_MS,
  webglIntent,
} from './webgl-intent'
import { installWebglProbe } from './webgl-probe'

/**
 * A real WebGL context loss: every fallback shows until the context is back,
 * and then everything draws again. The owner's "Ya, perbaiki", for the third
 * of three findings left after #86.
 *
 * ## The defect this exists for
 *
 * The scenes report their first frame from r3f's frame loop, and that loop
 * keeps running when the GPU drops the context. three stops drawing, but
 * `useFrame` keeps being called. Two consequences:
 *
 * - **A plate already handed over stayed hidden through the loss**, over a
 *   canvas that could draw nothing, until the context came back, or for good
 *   if it never did.
 * - **A plate first brought on screen during the loss reported a frame that
 *   drew nothing**, and hid its picture over an empty box.
 *
 * `vault/webgl/material-image`, `vault/webgl/scene-shell` and
 * `vault/webgl/plate-material` all hand over this way.
 *
 * ## How it is asked
 *
 * `WEBGL_lose_context` does to the page what a GPU reset does, through the
 * probe in `e2e/webgl-probe.ts`. The app keeps a lost context restorable
 * (`ContextLossHandler` in `lib/webgl/components/canvas/webgl.tsx` takes the
 * loss's default away), so the test restores it as the browser would.
 */

const WORK = '/id/work'

/** How long a fallback may take to come back once the context is lost. */
const FALLBACK_MS = 5000

/** How long a plate brought on screen during the loss is watched. */
const WATCH_MS = 1500

/** Whether a plate is marked handed over, and its opacity once settled. */
function plateState(shell: Locator) {
  return shell.evaluate((node) => ({
    marked: node.hasAttribute('data-material'),
    opacity: getComputedStyle(node).opacity,
  }))
}

/** True when a live context has drawn `picture` since the last `clear()`. */
function drawnSinceClear(page: Page, picture: string) {
  return page.evaluate(
    (url) => window.__gl?.liveDrawn().has(url) === true,
    picture
  )
}

test.describe('a lost WebGL context', () => {
  test('/work: the plates show their pictures while it is lost, and draw again once it is back', async ({
    page,
  }) => {
    test.setTimeout(WEBGL_TEST_BUDGET_MS * 2)
    await page.addInitScript(installWebglProbe)
    await page.goto(WORK, { waitUntil: 'networkidle' })
    const intent = await webglIntent(page)
    test.skip(!intent.intended, intent.reason)
    await waitForCanvas(page)

    const shells = await page
      .locator('[data-material-shell]')
      .filter({ visible: true })
      .all()
    // The plates on screen at the top, handed over before anything is lost.
    const atTop: number[] = []
    for (const [index, shell] of shells.entries()) {
      const box = await shell.boundingBox()
      if (box && box.y < (page.viewportSize()?.height ?? 720)) atTop.push(index)
    }
    expect(
      atTop.length,
      `${WORK}: no plate on screen at the top`
    ).toBeGreaterThan(0)
    for (const index of atTop) {
      const shell = shells[index]
      if (!shell) continue
      const state = await waitForPlate(shell)
      test.skip(state !== 'drawn', plateSkipReason(state))
    }

    // 1. Lost: every plate on screen shows its picture again.
    expect(
      await page.evaluate(() => window.__gl?.lose() ?? false),
      'there was no live context to lose'
    ).toBe(true)
    for (const index of atTop) {
      const shell = shells[index]
      if (!shell) continue
      await expect
        .poll(() => plateState(shell), {
          message: `plate ${index} stayed handed over to a lost context, its picture hidden over a canvas that cannot draw`,
          timeout: FALLBACK_MS,
        })
        .toEqual({ marked: false, opacity: '1' })
    }

    // 2. Still lost: a plate brought on screen now must not hand over.
    const handedOverWhileLost: number[] = []
    for (const [index, shell] of shells.entries()) {
      if (atTop.includes(index)) continue
      await shell.scrollIntoViewIfNeeded()
      const loaded = await shell.locator('img').evaluate(
        (img, timeout) =>
          new Promise<boolean>((resolve) => {
            const started = performance.now()
            const tick = () => {
              if (!(img instanceof HTMLImageElement)) return resolve(false)
              if (img.complete) return resolve(img.naturalWidth > 0)
              if (performance.now() - started > timeout) return resolve(false)
              setTimeout(tick, 100)
            }
            tick()
          }),
        WEBGL_ARRIVAL_MS
      )
      if (!loaded) continue
      const handedOver = await shell.evaluate(
        (node, watch) =>
          new Promise<boolean>((resolve) => {
            const started = performance.now()
            const tick = () => {
              if (node.hasAttribute('data-material')) return resolve(true)
              if (performance.now() - started > watch) return resolve(false)
              requestAnimationFrame(tick)
            }
            tick()
          }),
        WATCH_MS
      )
      if (handedOver) handedOverWhileLost.push(index)
    }
    expect
      .soft(
        handedOverWhileLost,
        'plates that hid their picture while the context was lost: a frame that drew nothing was reported as drawn'
      )
      .toEqual([])

    // 3. Restored: every plate draws again in the restored context.
    await page.evaluate(() => window.__gl?.clear())
    expect(
      await page.evaluate(() => window.__gl?.restore() ?? false),
      'the lost context could not be restored'
    ).toBe(true)
    const deadline = Date.now() + WEBGL_ARRIVAL_MS
    const notRedrawn: number[] = []
    for (const [index, shell] of shells.entries()) {
      const picture = await shell
        .locator('img')
        .evaluate((img) =>
          img instanceof HTMLImageElement && img.naturalWidth > 0
            ? img.currentSrc
            : ''
        )
      if (!picture) continue
      await shell.scrollIntoViewIfNeeded()
      const redrawn = await expect
        .poll(
          async () =>
            (await drawnSinceClear(page, picture)) &&
            (await plateState(shell)).marked,
          { timeout: Math.max(1000, deadline - Date.now()) }
        )
        .toBe(true)
        .then(() => true)
        .catch(() => false)
      if (!redrawn) notRedrawn.push(index)
    }
    expect(
      notRedrawn,
      `plates the restored context did not draw again and hand over within ${WEBGL_ARRIVAL_MS / 1000}s`
    ).toEqual([])
  })

  test('home: the wash and the flat drawing come back while it is lost, and hand over again once it is back', async ({
    page,
  }) => {
    test.setTimeout(WEBGL_TEST_BUDGET_MS * 2)
    await page.addInitScript(installWebglProbe)
    await page.goto('/id', { waitUntil: 'domcontentloaded' })
    const intent = await webglIntent(page)
    test.skip(!intent.intended, intent.reason)
    await waitForEntrance(page)
    await waitForCanvas(page)

    const wash = page.locator('[data-accent-region]').first()
    await expect(
      wash,
      'the hero wash never handed over to the canvas'
    ).toHaveAttribute('data-accent-live', '', { timeout: WEBGL_ARRIVAL_MS })

    // Lost at the top: the CSS wash comes back.
    expect(
      await page.evaluate(() => window.__gl?.lose() ?? false),
      'there was no live context to lose'
    ).toBe(true)
    await expect(
      wash,
      'the hero kept no wash while the context was lost: the CSS wash stayed away over a canvas that cannot draw'
    ).not.toHaveAttribute('data-accent-live', { timeout: FALLBACK_MS })

    // Still lost: the passage's flat drawing stays, since nothing can light it.
    await page.evaluate(() => {
      const section = document.querySelector('section[data-passage]')
      if (!section) return
      const top = section.getBoundingClientRect().top + window.scrollY
      window.scrollTo(0, top + window.innerHeight * 0.35)
    })
    await page.waitForTimeout(1500)
    const plate = page.locator('[data-plate-material]').first()
    const litWhileLost = await plate.evaluate(
      (node, watch) =>
        new Promise<boolean>((resolve) => {
          const started = performance.now()
          const tick = () => {
            if (node.hasAttribute('data-plate-live')) return resolve(true)
            if (performance.now() - started > watch) return resolve(false)
            requestAnimationFrame(tick)
          }
          tick()
        }),
      WATCH_MS
    )
    expect
      .soft(
        litWhileLost,
        'the first plate hid its flat drawing while the context was lost: a frame that drew nothing was reported as drawn'
      )
      .toBe(false)

    // Restored: the lit plate draws and takes over again, then the wash.
    await page.evaluate(() => window.__gl?.clear())
    expect(
      await page.evaluate(() => window.__gl?.restore() ?? false),
      'the lost context could not be restored'
    ).toBe(true)
    await expect(
      plate,
      'the restored context never lit the first plate again'
    ).toHaveAttribute('data-plate-live', '', { timeout: WEBGL_ARRIVAL_MS })
    await page.evaluate(() => window.scrollTo(0, 0))
    await expect(
      wash,
      'the restored context never drew the hero wash again'
    ).toHaveAttribute('data-accent-live', '', { timeout: WEBGL_ARRIVAL_MS })
    expect(
      await page.evaluate(() => [...(window.__gl?.liveKinds() ?? [])].sort()),
      'the probe saw no wash or no lit plate drawn by the restored context'
    ).toEqual(expect.arrayContaining(['plate', 'wash']))
  })
})

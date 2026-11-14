import { mkdir, writeFile } from 'node:fs/promises'
import path from 'node:path'

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
import { installWebglProbe } from './webgl-probe'

/**
 * Coming back to `/work` with the browser's Back button: no call reaches a
 * dead WebGL context, no plate goes blank, and every plate draws again. The
 * owner's "Ya, perbaiki /work".
 *
 * ## The path
 *
 * `cachedNavigations` keeps `/work` alive but hidden while the reader is on
 * another page, and React runs the hidden tree's effect cleanups. r3f's
 * cleanup unmounts its root and, 500 ms later, kills the root's context.
 * Three defects lived on that path, all found while rebuilding the memory
 * gate in `e2e/material-layer.e2e.ts` (PR #79):
 *
 * 1. **Calls into dead contexts.** The hidden `<Canvas>` kept its root.
 *    Showing the page again re-rendered that root, disposed and with its
 *    context killed, before Tahap 85 swapped in a new canvas. Plate scenes
 *    mounted into it and uploaded their pictures there, and the stale tree
 *    was never unmounted, so plates mounted later, on scroll, went there too.
 * 2. **A blank moment after Back.** A plate marked as handed over stayed
 *    marked: `MaterialImage`'s `drew` never reset. Its picture was hidden from
 *    the first frame back, while the new canvas had drawn nothing yet.
 * 3. **The first two plates never redrew**, seen once on production. A return
 *    inside r3f's 500 ms finds the old root's context still alive, so
 *    Tahap 85 has nothing to replace; then the timer kills it with the page
 *    on screen, and the plates already handed over stay hidden over nothing.
 *
 * ## How it is measured
 *
 * - **Calls.** The probe in `e2e/webgl-probe.ts` wraps the WebGL2 calls three
 *   makes to create, bind, upload and draw. A call made on a context that is
 *   already lost is counted by method, and the gate allows none.
 * - **What was drawn.** The same probe records the picture a plate's program
 *   drew, by URL, leaving out drei's cube-map preload. A picture counts as
 *   drawn again only when a live context drew it, on a canvas the reader can
 *   see, after the reader left the page.
 * - **Blank.** On every frame from the click away until the page settles, a
 *   sampler looks at each plate on screen. A plate is blank when it is hidden
 *   as handed over (`data-material`, opacity under 0.5) and no live, visible
 *   canvas has drawn its picture since the reader left. That reads the same
 *   whatever the component does, so one gate measures the defect and the fix.
 *
 * Returns alternate. A **slow** return waits on `/kontak` past r3f's 500 ms, so
 * the context left behind is dead by Back. A **quick** one comes back inside
 * that window. Every frame painted around each Back, and the record, go to
 * `test-results/work-return/`, which CI uploads as the `playwright-report`
 * artifact.
 */

const WORK = '/id/work'

/**
 * The returns, in order, and how long each one stays on `/kontak` before
 * Back: past r3f's 500 ms teardown, or well inside it.
 */
const RETURNS = [
  { kind: 'slow', wait: 900 },
  { kind: 'quick', wait: 100 },
  { kind: 'slow', wait: 900 },
  { kind: 'quick', wait: 100 },
  { kind: 'slow', wait: 900 },
  { kind: 'quick', wait: 100 },
] as const

/** How long the sampler keeps going once every plate on screen is drawn. */
const SETTLE_MS = 1000

/** The longest the sampler waits after Back for the plates on screen. */
const SAMPLE_MS = 15_000

/**
 * How much longer than `SAMPLE_MS` after leaving the sampler waits for Back
 * before it stops on its own. Back follows the leaving by at most a second
 * here, so this is only ever reached when Back was never seen.
 */
const GIVE_UP_AFTER_BACK_MS = 5000

/** Frames kept around each Back: from this long before it... */
const FRAMES_BEFORE_MS = 300
/** ...to this long after it, and no more than this many. */
const FRAMES_AFTER_MS = 3000
const FRAME_CAP = 150

/** One frame of the sampler. */
interface Sample {
  /** `performance.now()`. */
  at: number
  /** On `/work` again, after the reader left it. */
  back: boolean
  /** Plates on screen with a loaded picture. */
  onScreen: number
  /** Of those, hidden as handed over with nothing drawn in their place. */
  blank: number
}

/*
 * Real globals rather than assertions at each use, for the reason
 * `e2e/material-layer.e2e.ts` gives: these shapes are written here and read
 * inside the browser, where nothing else would catch a typo.
 */
declare global {
  interface Window {
    __sampler?: {
      samples: Sample[]
      done: boolean
      /** When the reader left `/work`, as `performance.now()`. */
      awayAt: number | null
      /** When `/work` was on screen again. */
      backAt: number | null
      /** Called by the test once it has seen the URL leave `/work`. */
      markAway: () => void
    }
  }
}

/** A plate that drew on the first visit, and the picture it drew. */
interface Plate {
  index: number
  shell: Locator
  picture: string
}

/** The dead-context count so far, copied out of the page. */
function deadCalls(page: Page) {
  return page.evaluate(() => ({ ...window.__gl?.dead }))
}

/** What `after` added to `before`, by method. */
function added(before: Record<string, number>, after: Record<string, number>) {
  return Object.fromEntries(
    Object.entries(after)
      .map(([name, count]) => [name, count - (before[name] ?? 0)] as const)
      .filter(([, count]) => count > 0)
  )
}

/**
 * Starts sampling every frame: through the click away, the time on
 * `/kontak`, and Back, until every plate on screen has been drawn again and
 * the page has held still for `SETTLE_MS`, or until `SAMPLE_MS` after Back.
 * Clears what the probe counts as drawn the moment the reader leaves.
 *
 * ## Leaving is marked by the test, not only seen by a frame
 *
 * The first version noticed the reader leaving only when a frame read the
 * URL. On a quick return the whole stay on `/kontak` can fall between two
 * frames when the main thread is busy with the navigation, and then the
 * sampler never knew the reader had left: no `backAt`, so no `SAMPLE_MS` cap,
 * and the wait for it ran out at 45 s while the page sat there drawn (#86,
 * run 43557398828, first attempt, on a quick return). The test now marks the
 * leaving itself, once it has seen the URL change and before it presses
 * Back, and a sampler that never sees Back stops on its own and says so.
 */
async function startSampler(page: Page) {
  await page.evaluate(
    ({ settleMs, sampleMs, giveUpMs }) => {
      const gl = window.__gl
      if (!gl) throw new Error('the WebGL probe is not installed')
      const sampler: NonNullable<Window['__sampler']> = {
        samples: [],
        done: false,
        awayAt: null,
        backAt: null,
        markAway: () => undefined,
      }
      /** What counts as drawn again is what is drawn after this moment. */
      const leave = (at: number) => {
        if (sampler.awayAt !== null) return
        sampler.awayAt = at
        gl.clear()
      }
      sampler.markAway = () => leave(performance.now())
      window.__sampler = sampler
      let settledAt: number | null = null

      const tick = () => {
        const now = performance.now()
        const onWork = location.pathname.endsWith('/work')
        if (!onWork) leave(now)
        const back = onWork && sampler.awayAt !== null
        if (back && sampler.backAt === null) sampler.backAt = now

        let onScreen = 0
        let blank = 0
        let waiting = 0
        if (back) {
          const drawn = gl.liveDrawn()
          for (const shell of document.querySelectorAll<HTMLElement>(
            '[data-material-shell]'
          )) {
            const box = shell.getBoundingClientRect()
            if (
              box.width === 0 ||
              box.bottom <= 0 ||
              box.top >= innerHeight ||
              !shell.checkVisibility()
            ) {
              continue
            }
            // A plate with no picture to draw is never handed over.
            const img = shell.querySelector('img')
            if (!img?.complete || img.naturalWidth === 0) continue
            onScreen++
            const isDrawn = drawn.has(img.currentSrc)
            if (!isDrawn) waiting++
            const hidden =
              shell.hasAttribute('data-material') &&
              Number.parseFloat(getComputedStyle(shell).opacity) < 0.5
            if (hidden && !isDrawn) blank++
          }
          // A plate that loses its drawing again, as when a context dies
          // under it, restarts the wait.
          settledAt = waiting === 0 ? (settledAt ?? now) : null
        }
        sampler.samples.push({ at: now, back, onScreen, blank })

        const { awayAt, backAt } = sampler
        if (
          (settledAt !== null && now - settledAt >= settleMs) ||
          (backAt !== null && now - backAt >= sampleMs) ||
          // Back never seen: stop, and let the test name it.
          (awayAt !== null && now - awayAt >= giveUpMs)
        ) {
          sampler.done = true
          return
        }
        requestAnimationFrame(tick)
      }
      requestAnimationFrame(tick)
    },
    {
      settleMs: SETTLE_MS,
      sampleMs: SAMPLE_MS,
      giveUpMs: SAMPLE_MS + GIVE_UP_AFTER_BACK_MS,
    }
  )
}

test.describe('returning to /work', () => {
  test('no call reaches a dead context, no plate goes blank, every plate draws again', async ({
    page,
  }, testInfo) => {
    test.setTimeout(WEBGL_TEST_BUDGET_MS * 4)

    await page.addInitScript(installWebglProbe)

    await page.goto(WORK, { waitUntil: 'networkidle' })
    const intent = await webglIntent(page)
    test.skip(!intent.intended, intent.reason)
    await waitForCanvas(page)

    /*
     * The first visit: every plate brought on screen until it hands over, as
     * the memory gate does, so every picture loads and every plate has
     * something to draw again. A plate with no picture keeps its `<img>` and
     * is left out alike.
     */
    const plates: Plate[] = []
    const shells = await page
      .locator('[data-material-shell]')
      .filter({ visible: true })
      .all()
    for (const [index, shell] of shells.entries()) {
      await shell.scrollIntoViewIfNeeded()
      const state = await waitForPlate(shell)
      test.skip(state === 'image-pending', plateSkipReason(state))
      if (state !== 'drawn') continue
      const picture = await shell
        .locator('img')
        .evaluate((img) =>
          img instanceof HTMLImageElement ? img.currentSrc : ''
        )
      plates.push({ index, shell, picture })
    }
    const [firstPlate] = plates
    if (!firstPlate)
      throw new Error(`${WORK}: no plate drew on the first visit`)

    // The probe is checked before anything is read from it: on the first
    // visit it must have seen every plate that handed over being drawn.
    const unseen = await page.evaluate(
      (pictures) => {
        const drawn = window.__gl?.liveDrawn() ?? new Set<string>()
        return pictures.filter((picture) => !drawn.has(picture))
      },
      plates.map((plate) => plate.picture)
    )
    expect(
      unseen,
      'the probe never saw these pictures drawn on the first visit, so it cannot judge a return: the probe is wrong, not the page'
    ).toEqual([])

    const outputDir = path.join('test-results', 'work-return')
    await mkdir(outputDir, { recursive: true })
    const origin = await page.evaluate(() => performance.timeOrigin)
    const record: Record<string, unknown>[] = []

    for (const [turn, { kind, wait }] of RETURNS.entries()) {
      const label = `return ${turn + 1} (${kind})`
      const deadBefore = await deadCalls(page)

      // Plates on screen when the reader leaves, so some are on screen at Back.
      await firstPlate.shell.scrollIntoViewIfNeeded()

      const cdp = await page.context().newCDPSession(page)
      const frames: { at: number; data: string }[] = []
      cdp.on('Page.screencastFrame', (frame) => {
        frames.push({
          at: (frame.metadata.timestamp ?? 0) * 1000 - origin,
          data: frame.data,
        })
        void cdp
          .send('Page.screencastFrameAck', { sessionId: frame.sessionId })
          .catch(() => undefined)
      })
      await cdp.send('Page.startScreencast', {
        format: 'jpeg',
        quality: 60,
        maxWidth: 640,
        maxHeight: 360,
      })
      // Started before the click, so a quick return pays only its own wait.
      await startSampler(page)

      // Client-side both ways, so the document and the probe survive.
      // `/id/kontak` carries no canvas, and the header links it everywhere.
      const away = page.locator('a[href$="/id/kontak"]').first()
      await away.scrollIntoViewIfNeeded()
      await away.click()
      await page.waitForURL('**/id/kontak', { timeout: 30_000 })
      // Marked here, before Back, whether or not a frame has seen it yet.
      await page.evaluate(() => window.__sampler?.markAway())
      await page.waitForTimeout(wait)
      await page.goBack()
      await page.waitForURL((url) => url.pathname === WORK, {
        timeout: 30_000,
      })
      await page.waitForFunction(() => window.__sampler?.done === true, null, {
        timeout: SAMPLE_MS + WEBGL_ARRIVAL_MS,
      })
      await cdp.send('Page.stopScreencast')
      await cdp.detach()

      const sampled = await page.evaluate(() => ({
        samples: window.__sampler?.samples ?? [],
        awayAt: window.__sampler?.awayAt ?? null,
        backAt: window.__sampler?.backAt ?? null,
      }))
      expect
        .soft(
          sampled.backAt,
          `${label}: the sampler never saw /work again after Back, so this return measured nothing`
        )
        .not.toBeNull()
      const back = sampled.samples.filter((sample) => sample.back)
      // Time on screen, not frame count: each blank frame lasts until the next.
      let blankMs = 0
      for (const [index, sample] of back.entries()) {
        if (sample.blank === 0) continue
        blankMs += (back[index + 1]?.at ?? sample.at + 1000 / 60) - sample.at
      }
      const blankFrames = back.filter((sample) => sample.blank > 0)
      const onScreenMost = Math.max(0, ...back.map((sample) => sample.onScreen))

      // The frames around Back, named by their distance from it.
      const backAt = sampled.backAt ?? Number.NaN
      const around = frames.filter(
        (frame) =>
          frame.at >= backAt - FRAMES_BEFORE_MS &&
          frame.at <= backAt + FRAMES_AFTER_MS
      )
      const step = Math.max(1, Math.ceil(around.length / FRAME_CAP))
      const kept = around.filter((_, index) => index % step === 0)
      const returnDir = path.join(outputDir, `return-${turn + 1}-${kind}`)
      await mkdir(returnDir, { recursive: true })
      for (const frame of kept) {
        const at = Math.round(frame.at - backAt)
        const name = `${at < 0 ? 'before' : 'after'}-${String(Math.abs(at)).padStart(5, '0')}ms.jpg`
        await writeFile(
          path.join(returnDir, name),
          Buffer.from(frame.data, 'base64')
        )
      }

      expect
        .soft(
          onScreenMost,
          `${label}: no plate was on screen after Back, so this return could not see a blank one`
        )
        .toBeGreaterThan(0)
      expect
        .soft(
          blankFrames.length,
          `${label}: ${blankFrames.length} frames after Back showed a plate hidden as handed over with nothing drawn in its place, for about ${Math.round(blankMs)} ms`
        )
        .toBe(0)

      /*
       * Every plate draws again: brought on screen until a live canvas has
       * drawn its picture since the reader left and it has handed over,
       * within one arrival budget for the whole return.
       */
      const deadline = Date.now() + WEBGL_ARRIVAL_MS
      const notRedrawn: number[] = []
      for (const plate of plates) {
        await plate.shell.scrollIntoViewIfNeeded()
        const redrawn = await plate.shell.evaluate(
          (shell, { picture, remaining }) =>
            new Promise<boolean>((resolve) => {
              const stop = performance.now() + remaining
              const tick = () => {
                const drawn = window.__gl?.liveDrawn().has(picture) === true
                if (drawn && shell.hasAttribute('data-material')) {
                  resolve(true)
                } else if (performance.now() >= stop) {
                  resolve(false)
                } else {
                  setTimeout(tick, 100)
                }
              }
              tick()
            }),
          {
            picture: plate.picture,
            remaining: Math.max(0, deadline - Date.now()),
          }
        )
        if (!redrawn) notRedrawn.push(plate.index)
      }
      expect
        .soft(
          notRedrawn,
          `${label}: plates that a live canvas did not draw again, or that did not hand over, within ${WEBGL_ARRIVAL_MS / 1000}s`
        )
        .toEqual([])

      const live = await page.evaluate(() => window.__gl?.liveCount() ?? 0)
      expect
        .soft(live, `${label}: ${live} live canvases on screen, not one`)
        .toBe(1)

      record.push({
        return: turn + 1,
        kind,
        waitOnKontakMs: wait,
        hiddenForMs:
          sampled.awayAt === null || sampled.backAt === null
            ? null
            : Math.round(sampled.backAt - sampled.awayAt),
        framesSampledAfterBack: back.length,
        platesOnScreenMost: onScreenMost,
        blankFrames: blankFrames.length,
        blankMs: Math.round(blankMs),
        mostPlatesBlankAtOnce: Math.max(
          0,
          ...blankFrames.map((sample) => sample.blank)
        ),
        notRedrawn,
        liveCanvases: live,
        deadCallsThisReturn: added(deadBefore, await deadCalls(page)),
        framesKept: kept.length,
      })
    }

    const dead = await deadCalls(page)
    const body = `${JSON.stringify(
      {
        project: testInfo.project.name,
        retry: testInfo.retry,
        plates: plates.map(({ index }) => index),
        returns: record,
        deadCalls: dead,
      },
      null,
      2
    )}\n`
    await writeFile(path.join(outputDir, `record-${testInfo.retry}.json`), body)
    await testInfo.attach('work-return-record', {
      body,
      contentType: 'application/json',
    })
    console.log(`work-return record:\n${body}`)

    expect(
      dead,
      `calls reached a dead WebGL context across ${RETURNS.length} returns`
    ).toEqual({})
  })
})

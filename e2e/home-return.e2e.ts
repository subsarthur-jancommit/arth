import { mkdir, writeFile } from 'node:fs/promises'
import path from 'node:path'

import type { Page } from '@playwright/test'
import { expect, test } from '@playwright/test'

import { waitForEntrance } from './page-settled'
import {
  waitForCanvas,
  WEBGL_ARRIVAL_MS,
  WEBGL_TEST_BUDGET_MS,
  webglIntent,
} from './webgl-intent'
import { installWebglProbe } from './webgl-probe'

/**
 * Coming back to the home page with Back: neither the hero's wash nor the
 * passage's lit plate goes blank, and both draw again. The owner's
 * "Ya, perbaiki", for the first of three findings left after #86.
 *
 * ## The defect this exists for
 *
 * `vault/webgl/scene-shell` (the hero's wash) and `vault/webgl/plate-material`
 * (the passage's lit plates) hand over the way `material-image` did before
 * #86. A `drew` flag, raised by the scene's first frame, takes the CSS wash
 * away or hides the flat drawing. `cachedNavigations` keeps the home page
 * hidden rather than unmounted while the reader is elsewhere, and React keeps
 * a hidden tree's state, so the flag survived the trip. Back on the home
 * page, the wash and the drawing were gone from the first frame, while the
 * canvas, a new one since #86, had drawn nothing. #86 measured the same thing
 * on `/work`: about 0.65 s of blank plates on every Back.
 *
 * ## How it is measured
 *
 * The probe in `e2e/webgl-probe.ts` records which kind a live, visible
 * context has drawn since the reader left: the wash (`uColorA`) or the lit
 * plate (`uScan`). A sampler reads every frame from the click away:
 *
 * - the hero is blank when its region is marked live (`data-accent-live`, the
 *   CSS wash taken away) and no wash has been drawn since the reader left;
 * - the passage is blank when a plate the reader can see is marked live
 *   (`data-plate-live`, its flat drawing hidden) and no lit plate has been
 *   drawn since.
 *
 * Each return leaves from one of the two places a reader can be, the hero at
 * the top or the first plate resting in the passage. Back on the page it
 * reads wherever the page came back to, then goes to the other place and
 * reads that too, so both are read whatever position the page restores.
 * Returns are slow (past r3f's 500 ms teardown) or quick (inside it), as in
 * `e2e/work-return.e2e.ts`. The frames painted around each Back and a record
 * go to `test-results/home-return/`, which CI uploads as the
 * `playwright-report` artifact.
 */

const HOME = '/id'

/** Where the reader stands when leaving, and how long they stay away. */
const RETURNS = [
  { from: 'hero', kind: 'slow', wait: 900 },
  { from: 'passage', kind: 'quick', wait: 100 },
  { from: 'hero', kind: 'quick', wait: 100 },
  { from: 'passage', kind: 'slow', wait: 900 },
] as const

type Place = (typeof RETURNS)[number]['from']

/** How long everything on screen must stay drawn to count as settled. */
const SETTLE_MS = 1000

/** The longest one reading waits for everything on screen to draw again. */
const PHASE_MS = 15_000

/** Frames kept around each Back: from this long before it, to this long after. */
const FRAMES_BEFORE_MS = 300
const FRAMES_AFTER_MS = 3000
const FRAME_CAP = 150

/** One frame of the sampler. */
interface Sample {
  /** `performance.now()`. */
  at: number
  /** 1 on the page Back returned to, 2 after moving to the other place. */
  phase: number
  /** On the home page again, after the reader left it. */
  back: boolean
  heroOnScreen: number
  heroBlank: number
  platesOnScreen: number
  platesBlank: number
}

declare global {
  interface Window {
    __homeSampler?: {
      samples: Sample[]
      phase: number
      /** Everything on screen drawn again, and held for `SETTLE_MS`. */
      settled: boolean
      /** The phase ran `PHASE_MS` without settling. */
      capped: boolean
      awayAt: number | null
      backAt: number | null
      markAway: () => void
      nextPhase: () => void
      stop: () => void
    }
  }
}

/** The page's top, or the first plate resting in the passage. */
async function goTo(page: Page, place: Place) {
  if (place === 'hero') {
    await page.evaluate(() => window.scrollTo(0, 0))
    await page.waitForTimeout(800)
    return
  }
  await page.evaluate(() => {
    const section = document.querySelector('section[data-passage]')
    if (!section) return
    const top = section.getBoundingClientRect().top + window.scrollY
    // Inside the first plate's share: the pin has begun, the next has not.
    window.scrollTo(0, top + window.innerHeight * 0.35)
  })
  // The pin scrubs with half a second of catch-up (`e2e/plate-paths`).
  await page.waitForTimeout(1500)
}

/**
 * Samples every frame from now until `stop()`. Reading a phase means waiting
 * for `settled` or `capped`; `nextPhase()` starts the next reading.
 */
async function startSampler(page: Page) {
  await page.evaluate(
    ({ settleMs, phaseMs }) => {
      const gl = window.__gl
      if (!gl) throw new Error('the WebGL probe is not installed')
      const sampler: NonNullable<Window['__homeSampler']> = {
        samples: [],
        phase: 1,
        settled: false,
        capped: false,
        awayAt: null,
        backAt: null,
        markAway: () => undefined,
        nextPhase: () => undefined,
        stop: () => undefined,
      }
      let running = true
      let settledAt: number | null = null
      let phaseAt: number | null = null
      const leave = (at: number) => {
        if (sampler.awayAt !== null) return
        sampler.awayAt = at
        gl.clear()
      }
      sampler.markAway = () => leave(performance.now())
      sampler.nextPhase = () => {
        sampler.phase += 1
        sampler.settled = false
        sampler.capped = false
        settledAt = null
        phaseAt = performance.now()
      }
      sampler.stop = () => {
        running = false
      }
      window.__homeSampler = sampler

      /** The part of `element` the reader can see, inside every clip above. */
      const seen = (element: Element) => {
        const box = element.getBoundingClientRect()
        let left = Math.max(box.left, 0)
        let right = Math.min(box.right, innerWidth)
        let top = Math.max(box.top, 0)
        let bottom = Math.min(box.bottom, innerHeight)
        let clip = element.closest('[data-plate-clip]')
        while (clip) {
          const rect = clip.getBoundingClientRect()
          left = Math.max(left, rect.left)
          right = Math.min(right, rect.right)
          top = Math.max(top, rect.top)
          bottom = Math.min(bottom, rect.bottom)
          clip = clip.parentElement?.closest('[data-plate-clip]') ?? null
        }
        return right - left > 8 && bottom - top > 8
      }

      const tick = () => {
        if (!running) return
        const now = performance.now()
        const onHome = /^\/id\/?$/.test(location.pathname)
        if (!onHome) leave(now)
        const back = onHome && sampler.awayAt !== null
        if (back && sampler.backAt === null) {
          sampler.backAt = now
          phaseAt = now
        }

        let heroOnScreen = 0
        let heroBlank = 0
        let platesOnScreen = 0
        let platesBlank = 0
        let waiting = 0
        if (back) {
          const kinds = gl.liveKinds()
          for (const region of document.querySelectorAll<HTMLElement>(
            '[data-accent-region]'
          )) {
            if (!region.checkVisibility() || !seen(region)) continue
            heroOnScreen++
            const live = region.hasAttribute('data-accent-live')
            if (!live || !kinds.has('wash')) waiting++
            if (live && !kinds.has('wash')) heroBlank++
          }
          for (const material of document.querySelectorAll<HTMLElement>(
            '[data-plate-material]'
          )) {
            const drawing = material.querySelector('svg')
            if (!drawing || !material.checkVisibility() || !seen(drawing)) {
              continue
            }
            // A plate faded out by the passage is not one the reader sees.
            const fade = material.closest<HTMLElement>('[data-plate-fade]')
            if (
              fade &&
              Number.parseFloat(getComputedStyle(fade).opacity) < 0.5
            ) {
              continue
            }
            platesOnScreen++
            const live = material.hasAttribute('data-plate-live')
            if (!live || !kinds.has('plate')) waiting++
            if (live && !kinds.has('plate')) platesBlank++
          }
          settledAt = waiting === 0 ? (settledAt ?? now) : null
          if (settledAt !== null && now - settledAt >= settleMs) {
            sampler.settled = true
          }
          if (phaseAt !== null && now - phaseAt >= phaseMs) {
            sampler.capped = true
          }
        }
        sampler.samples.push({
          at: now,
          phase: sampler.phase,
          back,
          heroOnScreen,
          heroBlank,
          platesOnScreen,
          platesBlank,
        })
        requestAnimationFrame(tick)
      }
      requestAnimationFrame(tick)
    },
    { settleMs: SETTLE_MS, phaseMs: PHASE_MS }
  )
}

/** Until the current phase has settled or run out. */
async function readPhase(page: Page) {
  await page.waitForFunction(
    () => window.__homeSampler?.settled || window.__homeSampler?.capped,
    null,
    { timeout: PHASE_MS + WEBGL_ARRIVAL_MS }
  )
}

/** What one phase saw: blank frames, and for how long, by place. */
function summarise(samples: Sample[], phase: number) {
  const read = samples.filter((sample) => sample.back && sample.phase === phase)
  let heroBlankMs = 0
  let platesBlankMs = 0
  for (const [index, sample] of read.entries()) {
    const lasted = (read[index + 1]?.at ?? sample.at + 1000 / 60) - sample.at
    if (sample.heroBlank > 0) heroBlankMs += lasted
    if (sample.platesBlank > 0) platesBlankMs += lasted
  }
  return {
    frames: read.length,
    heroOnScreen: Math.max(0, ...read.map((sample) => sample.heroOnScreen)),
    heroBlankFrames: read.filter((sample) => sample.heroBlank > 0).length,
    heroBlankMs: Math.round(heroBlankMs),
    platesOnScreen: Math.max(0, ...read.map((sample) => sample.platesOnScreen)),
    platesBlankFrames: read.filter((sample) => sample.platesBlank > 0).length,
    platesBlankMs: Math.round(platesBlankMs),
  }
}

test.describe('returning to the home page', () => {
  test('neither the wash nor the lit plate goes blank, and both draw again', async ({
    page,
  }, testInfo) => {
    test.setTimeout(WEBGL_TEST_BUDGET_MS * 4)
    await page.addInitScript(installWebglProbe)

    await page.goto(HOME, { waitUntil: 'domcontentloaded' })
    const intent = await webglIntent(page)
    test.skip(!intent.intended, intent.reason)
    await waitForEntrance(page)
    await waitForCanvas(page)

    // The first visit: both handed over once, so each has something to lose.
    await expect(
      page.locator('[data-accent-region][data-accent-live]').first(),
      'the hero wash never handed over to the canvas on the first visit'
    ).toBeAttached({ timeout: WEBGL_ARRIVAL_MS })
    await goTo(page, 'passage')
    await expect(
      page.locator('[data-plate-live]').first(),
      'the first plate was never lit on the first visit'
    ).toBeAttached({ timeout: WEBGL_ARRIVAL_MS })
    // The probe is checked before anything is read from it.
    expect(
      await page.evaluate(() => [...(window.__gl?.liveKinds() ?? [])].sort()),
      'the probe never saw the wash and the lit plate drawn on the first visit, so it cannot judge a return: the probe is wrong, not the page'
    ).toEqual(expect.arrayContaining(['plate', 'wash']))

    const outputDir = path.join('test-results', 'home-return')
    await mkdir(outputDir, { recursive: true })
    const origin = await page.evaluate(() => performance.timeOrigin)
    const record: Record<string, unknown>[] = []

    for (const [turn, { from, kind, wait }] of RETURNS.entries()) {
      const label = `return ${turn + 1} (${kind}, from the ${from})`
      await goTo(page, from)

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
      await startSampler(page)

      // Client-side both ways, so the document and the probe survive.
      const away = page.locator('a[href$="/id/kontak"]').first()
      await away.scrollIntoViewIfNeeded()
      await away.click()
      await page.waitForURL('**/id/kontak', { timeout: 30_000 })
      // Marked before Back, whether or not a frame has seen it yet (#86).
      await page.evaluate(() => window.__homeSampler?.markAway())
      await page.waitForTimeout(wait)
      await page.goBack()
      await page.waitForURL((url) => /^\/id\/?$/.test(url.pathname), {
        timeout: 30_000,
      })

      // Wherever the page came back to, then the other place.
      await readPhase(page)
      const settledFirst = await page.evaluate(
        () => window.__homeSampler?.settled === true
      )
      await cdp.send('Page.stopScreencast')
      await cdp.detach()
      const restoredAt = await page.evaluate(() => window.scrollY)
      const other: Place = restoredAt < 200 ? 'passage' : 'hero'
      await page.evaluate(() => window.__homeSampler?.nextPhase())
      await goTo(page, other)
      await readPhase(page)

      const sampled = await page.evaluate(() => {
        const sampler = window.__homeSampler
        sampler?.stop()
        return {
          samples: sampler?.samples ?? [],
          awayAt: sampler?.awayAt ?? null,
          backAt: sampler?.backAt ?? null,
          settled: sampler?.settled === true,
        }
      })
      const first = summarise(sampled.samples, 1)
      const second = summarise(sampled.samples, 2)
      const live = await page.evaluate(() => window.__gl?.liveCount() ?? 0)

      // The frames around Back, named by their distance from it.
      const backAt = sampled.backAt ?? Number.NaN
      const around = frames.filter(
        (frame) =>
          frame.at >= backAt - FRAMES_BEFORE_MS &&
          frame.at <= backAt + FRAMES_AFTER_MS
      )
      const step = Math.max(1, Math.ceil(around.length / FRAME_CAP))
      const kept = around.filter((_, index) => index % step === 0)
      const returnDir = path.join(
        outputDir,
        `return-${turn + 1}-${from}-${kind}`
      )
      await mkdir(returnDir, { recursive: true })
      for (const frame of kept) {
        const at = Math.round(frame.at - backAt)
        const name = `${at < 0 ? 'before' : 'after'}-${String(Math.abs(at)).padStart(5, '0')}ms.jpg`
        await writeFile(
          path.join(returnDir, name),
          Buffer.from(frame.data, 'base64')
        )
      }

      record.push({
        return: turn + 1,
        from,
        kind,
        waitOnKontakMs: wait,
        hiddenForMs:
          sampled.awayAt === null || sampled.backAt === null
            ? null
            : Math.round(sampled.backAt - sampled.awayAt),
        restoredScrollY: Math.round(restoredAt),
        backPhase: { ...first, settled: settledFirst },
        otherPlacePhase: { ...second, settled: sampled.settled },
        liveCanvases: live,
        framesKept: kept.length,
      })

      expect
        .soft(
          sampled.backAt,
          `${label}: the sampler never saw the home page again after Back`
        )
        .not.toBeNull()
      // Both places read on every return, whichever one Back came back to.
      expect
        .soft(
          first.heroOnScreen + second.heroOnScreen,
          `${label}: the hero was never on screen, so its wash was not read`
        )
        .toBeGreaterThan(0)
      expect
        .soft(
          first.platesOnScreen + second.platesOnScreen,
          `${label}: no plate the reader could see was on screen, so the passage was not read`
        )
        .toBeGreaterThan(0)
      for (const [name, phase] of [
        ['on the page Back returned to', first],
        ['after moving to the other place', second],
      ] as const) {
        expect
          .soft(
            phase.heroBlankFrames,
            `${label}, ${name}: ${phase.heroBlankFrames} frames showed the hero with its CSS wash taken away and no wash drawn, for about ${phase.heroBlankMs} ms`
          )
          .toBe(0)
        expect
          .soft(
            phase.platesBlankFrames,
            `${label}, ${name}: ${phase.platesBlankFrames} frames showed a lit plate with its drawing hidden and no plate drawn, for about ${phase.platesBlankMs} ms`
          )
          .toBe(0)
      }
      expect
        .soft(
          settledFirst && sampled.settled,
          `${label}: the wash or the lit plate on screen did not draw again and hand over within ${PHASE_MS / 1000}s`
        )
        .toBe(true)
      expect
        .soft(live, `${label}: ${live} live canvases on screen, not one`)
        .toBe(1)
    }

    const dead = await page.evaluate(() => ({ ...window.__gl?.dead }))
    const body = `${JSON.stringify(
      {
        project: testInfo.project.name,
        retry: testInfo.retry,
        returns: record,
        deadCalls: dead,
      },
      null,
      2
    )}\n`
    await writeFile(path.join(outputDir, `record-${testInfo.retry}.json`), body)
    await testInfo.attach('home-return-record', {
      body,
      contentType: 'application/json',
    })
    console.log(`home-return record:\n${body}`)

    expect(
      dead,
      `calls reached a dead WebGL context across ${RETURNS.length} returns`
    ).toEqual({})
  })
})

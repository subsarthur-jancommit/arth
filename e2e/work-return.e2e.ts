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
 * - **Calls.** An init script wraps the WebGL2 calls three makes to create,
 *   bind, upload and draw. A call made on a context that is already lost is
 *   counted by method, and the gate allows none.
 * - **What was drawn.** The same probe follows texture units, bindings, the
 *   program in use and the draw framebuffer. When a plate's program draws, it
 *   records the picture bound to that program's `uTexture` sampler, by URL.
 *   The scene loads the `currentSrc` of the plate's own `<img>`, so the URL
 *   names the plate. Draws into a cube-map face are left out: drei's
 *   `<Preload all />` renders every mesh into one when a canvas mounts, and
 *   none of that reaches the screen. A picture counts as drawn again only
 *   when a live context drew it, on a canvas the reader can see, after the
 *   reader left the page.
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

/** Frames kept around each Back: from this long before it... */
const FRAMES_BEFORE_MS = 300
/** ...to this long after it, and no more than this many. */
const FRAMES_AFTER_MS = 3000
const FRAME_CAP = 150

/** What the probe follows in one WebGL context. */
interface GlTrack {
  /** The active texture unit, as the `TEXTURE0 + n` enum. */
  unit: number
  /** The `TEXTURE_2D` bound on each unit. */
  bound: Map<number, WebGLTexture | null>
  /** The draw framebuffer; `null` is the canvas itself. */
  framebuffer: WebGLFramebuffer | null
  program: WebGLProgram | null
  /** Pictures a plate's program drew, by URL, since the last `clear()`. */
  drawn: Set<string>
}

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
    __gl?: {
      contexts: Map<WebGL2RenderingContext, GlTrack>
      /** Calls made on a context that was already lost, by method. */
      dead: Record<string, number>
      /** Pictures drawn since `clear()` by live contexts on visible canvases. */
      liveDrawn: () => Set<string>
      /** Live contexts on visible canvases. */
      liveCount: () => number
      clear: () => void
    }
    __sampler?: {
      samples: Sample[]
      done: boolean
      /** When the reader left `/work`, as `performance.now()`. */
      awayAt: number | null
      /** When `/work` was on screen again. */
      backAt: number | null
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
 */
async function startSampler(page: Page) {
  await page.evaluate(
    ({ settleMs, sampleMs }) => {
      const gl = window.__gl
      if (!gl) throw new Error('the WebGL probe is not installed')
      const sampler: NonNullable<Window['__sampler']> = {
        samples: [],
        done: false,
        awayAt: null,
        backAt: null,
      }
      window.__sampler = sampler
      let settledAt: number | null = null

      const tick = () => {
        const now = performance.now()
        const onWork = location.pathname.endsWith('/work')
        if (!onWork && sampler.awayAt === null) {
          sampler.awayAt = now
          gl.clear()
        }
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

        const { backAt } = sampler
        if (
          (settledAt !== null && now - settledAt >= settleMs) ||
          (backAt !== null && now - backAt >= sampleMs)
        ) {
          sampler.done = true
          return
        }
        requestAnimationFrame(tick)
      }
      requestAnimationFrame(tick)
    },
    { settleMs: SETTLE_MS, sampleMs: SAMPLE_MS }
  )
}

test.describe('returning to /work', () => {
  test('no call reaches a dead context, no plate goes blank, every plate draws again', async ({
    page,
  }, testInfo) => {
    test.setTimeout(WEBGL_TEST_BUDGET_MS * 4)

    await page.addInitScript(() => {
      const TEXTURE_2D = 0x0de1
      const TEXTURE0 = 0x84c0
      const FRAMEBUFFER = 0x8d40
      const DRAW_FRAMEBUFFER = 0x8ca9
      const CUBE_FACE_FIRST = 0x8515
      const CUBE_FACE_LAST = 0x851a

      const contexts = new Map<WebGL2RenderingContext, GlTrack>()
      const dead: Record<string, number> = {}
      /** The picture last uploaded into each texture, by URL. */
      const pictureOf = new WeakMap<WebGLTexture, string>()
      /** Programs built from the plate's shader: the only ones with `uCover`. */
      const platePrograms = new WeakSet<WebGLProgram>()
      /** Each `uTexture` location, and the program it belongs to. */
      const samplerOf = new WeakMap<WebGLUniformLocation, WebGLProgram>()
      /** The unit each plate program reads `uTexture` from. */
      const unitOf = new WeakMap<WebGLProgram, number>()
      const cubeFaces = new WeakSet<WebGLFramebuffer>()

      const track = (context: WebGL2RenderingContext) => {
        let held = contexts.get(context)
        if (!held) {
          held = {
            unit: TEXTURE0,
            bound: new Map(),
            framebuffer: null,
            program: null,
            drawn: new Set(),
          }
          contexts.set(context, held)
        }
        return held
      }
      const visible = (context: WebGL2RenderingContext) =>
        !context.isContextLost() &&
        context.canvas instanceof HTMLCanvasElement &&
        context.canvas.isConnected &&
        context.canvas.checkVisibility()

      window.__gl = {
        contexts,
        dead,
        liveDrawn: () => {
          const drawn = new Set<string>()
          for (const [context, held] of contexts) {
            if (!visible(context)) continue
            for (const picture of held.drawn) drawn.add(picture)
          }
          return drawn
        },
        liveCount: () => [...contexts.keys()].filter(visible).length,
        clear: () => {
          for (const held of contexts.values()) held.drawn.clear()
        },
      }

      /** False, and counted by method, when the context is already lost. */
      const alive = (context: WebGL2RenderingContext, name: string) => {
        if (!context.isContextLost()) return true
        dead[name] = (dead[name] ?? 0) + 1
        return false
      }

      const proto = WebGL2RenderingContext.prototype
      const makeTexture = proto.createTexture
      proto.createTexture = function createTexture() {
        alive(this, 'createTexture')
        return makeTexture.call(this)
      }
      const makeBuffer = proto.createBuffer
      proto.createBuffer = function createBuffer() {
        alive(this, 'createBuffer')
        return makeBuffer.call(this)
      }
      // three asks for every active uniform's location once per program.
      const locate = proto.getUniformLocation
      proto.getUniformLocation = function getUniformLocation(program, name) {
        const live = alive(this, 'getUniformLocation')
        const location = locate.call(this, program, name)
        if (live && location) {
          if (name === 'uCover') platePrograms.add(program)
          if (name === 'uTexture') samplerOf.set(location, program)
        }
        return location
      }

      /**
       * Wraps a method that returns nothing: counted when the context is
       * already lost, and otherwise handed to `after` once the real call ran.
       */
      const wrap = (
        name:
          | 'activeTexture'
          | 'bindTexture'
          | 'useProgram'
          | 'uniform1i'
          | 'texImage2D'
          | 'texSubImage2D'
          | 'texStorage2D'
          | 'bufferData'
          | 'bindFramebuffer'
          | 'framebufferTexture2D'
          | 'drawElements'
          | 'drawArrays',
        after?: (held: GlTrack, args: unknown[]) => void
      ) => {
        const original = proto[name]
        Object.defineProperty(proto, name, {
          configurable: true,
          writable: true,
          value: function (this: WebGL2RenderingContext, ...args: unknown[]) {
            const live = alive(this, name)
            Reflect.apply(original, this, args)
            if (live) after?.(track(this), args)
          },
        })
      }

      // ...and points each sampler at its unit with `uniform1i`.
      wrap('uniform1i', (_held, [location, unit]) => {
        const program =
          location instanceof WebGLUniformLocation
            ? samplerOf.get(location)
            : undefined
        if (program && typeof unit === 'number') unitOf.set(program, unit)
      })
      wrap('useProgram', (held, [program]) => {
        held.program = program instanceof WebGLProgram ? program : null
      })
      wrap('activeTexture', (held, [unit]) => {
        if (typeof unit === 'number') held.unit = unit
      })
      wrap('bindTexture', (held, [target, texture]) => {
        if (target !== TEXTURE_2D) return
        held.bound.set(
          held.unit,
          texture instanceof WebGLTexture ? texture : null
        )
      })
      // three uploads a picture as the `<img>` it was loaded into, last
      // argument of either call.
      const remember = (held: GlTrack, args: unknown[]) => {
        const source = args.at(-1)
        const texture = held.bound.get(held.unit)
        if (
          args[0] === TEXTURE_2D &&
          texture &&
          source instanceof HTMLImageElement
        ) {
          pictureOf.set(texture, source.currentSrc || source.src)
        }
      }
      wrap('texImage2D', remember)
      wrap('texSubImage2D', remember)
      wrap('bindFramebuffer', (held, [target, framebuffer]) => {
        if (target !== FRAMEBUFFER && target !== DRAW_FRAMEBUFFER) return
        held.framebuffer =
          framebuffer instanceof WebGLFramebuffer ? framebuffer : null
      })
      wrap('framebufferTexture2D', (held, [, , face]) => {
        if (
          held.framebuffer &&
          typeof face === 'number' &&
          face >= CUBE_FACE_FIRST &&
          face <= CUBE_FACE_LAST
        ) {
          cubeFaces.add(held.framebuffer)
        }
      })
      const draw = (held: GlTrack) => {
        const { program, framebuffer } = held
        if (!program || !platePrograms.has(program)) return
        if (framebuffer && cubeFaces.has(framebuffer)) return
        const unit = unitOf.get(program)
        const texture =
          unit === undefined ? undefined : held.bound.get(TEXTURE0 + unit)
        const picture = texture ? pictureOf.get(texture) : undefined
        if (picture) held.drawn.add(picture)
      }
      wrap('drawElements', draw)
      wrap('drawArrays', draw)
      wrap('texStorage2D')
      wrap('bufferData')
    })

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

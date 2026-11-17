import { writeFile } from 'node:fs/promises'

import { expect, test } from '@playwright/test'

import { waitForEntrance } from './page-settled'
import {
  WEBGL_ARRIVAL_MS,
  WEBGL_TEST_BUDGET_MS,
  webglIntent,
} from './webgl-intent'

/**
 * The order of one frame's work: who writes, and when the canvas reads — G2.
 *
 * Lenis, GSAP and the WebGL canvas share one `requestAnimationFrame` loop,
 * Tempus (`CLAUDE.md` #6), and run in its order. The owner's technical
 * reference (§6) read that order from the code: the canvas advanced at order
 * 1, Lenis at 5, GSAP at 10, so the canvas could draw a frame from the scroll
 * and the progress the previous frame left. This logs it in the page itself.
 *
 * ## How it is logged
 *
 * Without a second loop. An init script wraps the callbacks handed to
 * `requestAnimationFrame`, which Tempus calls once per frame, and numbers the
 * frames by their timestamp. Inside a frame it records, in order:
 *
 * - `scroll`: Lenis writing the scroll (`window.scrollTo`);
 * - `progress`: GSAP writing the first plate's `data-plate-progress`;
 * - `draw`: the canvas drawing the plate (the program that declares
 *   `uClip`), with the progress it was drawn from.
 *
 * The reader's wheel drives it: Lenis smooths the scroll, the passage's pin
 * scrubs, the plate turns.
 *
 * ## What it measures, and what it does not
 *
 * It measures the order of calls inside each frame and which progress the
 * canvas drew from. It does not measure lag a reader can see: CI draws
 * WebGL through SwiftShader, a software renderer, whose frame times say
 * nothing about a reader's (`CLAUDE.md` #19).
 */

interface FrameEvent {
  frame: number
  kind: 'scroll' | 'progress' | 'draw'
  value: number
}

interface FrameLog {
  frame: number
  inFrame: boolean
  recording: boolean
  events: FrameEvent[]
}

declare global {
  interface Window {
    __frameLog?: FrameLog
  }
}

/** The init script. Self-contained: Playwright runs its source in the page. */
function installFrameLog(): void {
  const FIRST = '[data-passage-plate]:first-child [data-plate-material]'
  const log: FrameLog = {
    frame: 0,
    inFrame: false,
    recording: false,
    events: [],
  }
  window.__frameLog = log
  const push = (kind: FrameEvent['kind'], value: number) => {
    if (log.recording && log.inFrame) {
      log.events.push({ frame: log.frame, kind, value })
    }
  }
  const progressOfFirst = () =>
    Number(document.querySelector(FIRST)?.getAttribute('data-plate-progress'))

  // Frames, numbered by the timestamp every callback of a frame shares.
  const request = window.requestAnimationFrame.bind(window)
  let lastTime = Number.NaN
  window.requestAnimationFrame = (callback) =>
    request((time) => {
      if (time !== lastTime) {
        lastTime = time
        log.frame += 1
      }
      log.inFrame = true
      try {
        callback(time)
      } finally {
        log.inFrame = false
      }
    })

  // Lenis writes the scroll on `window`, its wrapper.
  const scrollTo = window.scrollTo.bind(window)
  Object.defineProperty(window, 'scrollTo', {
    configurable: true,
    writable: true,
    value: (...args: unknown[]) => {
      Reflect.apply(scrollTo, window, args)
      push('scroll', window.scrollY)
    },
  })

  // GSAP's attribute plugin writes the progress with `setAttribute`.
  const setAttribute = Element.prototype.setAttribute
  Element.prototype.setAttribute = function writeAttribute(
    this: Element,
    name: string,
    value: string
  ) {
    setAttribute.call(this, name, value)
    if (name === 'data-plate-progress' && this.matches(FIRST)) {
      push('progress', Number(value))
    }
  }

  // The plate's program is the one that declares `uClip`.
  const plates = new WeakSet<WebGLProgram>()
  const current = new WeakMap<WebGL2RenderingContext, WebGLProgram | null>()
  const proto = WebGL2RenderingContext.prototype
  const locate = proto.getUniformLocation
  proto.getUniformLocation = function getUniformLocation(
    this: WebGL2RenderingContext,
    program: WebGLProgram,
    name: string
  ) {
    if (name === 'uClip') plates.add(program)
    return locate.call(this, program, name)
  }
  const use = proto.useProgram
  proto.useProgram = function useProgram(
    this: WebGL2RenderingContext,
    program: WebGLProgram | null
  ) {
    current.set(this, program)
    use.call(this, program)
  }
  const drawElements = proto.drawElements
  proto.drawElements = function draw(
    this: WebGL2RenderingContext,
    mode: number,
    count: number,
    type: number,
    offset: number
  ) {
    const program = current.get(this)
    if (program && plates.has(program)) push('draw', progressOfFirst())
    drawElements.call(this, mode, count, type, offset)
  }
}

/** One frame, from the log: the order of its kinds, and what each saw. */
interface FrameSummary {
  frame: number
  order: string
  /** The last progress GSAP wrote in this frame. */
  written: number | null
  /** The progress the first plate draw of this frame was drawn from. */
  drawn: number | null
}

function summarise(events: FrameEvent[]): FrameSummary[] {
  const frames = new Map<number, FrameEvent[]>()
  for (const event of events) {
    const list = frames.get(event.frame) ?? []
    list.push(event)
    frames.set(event.frame, list)
  }
  return [...frames].map(([frame, list]) => {
    // Consecutive repeats collapse: a plate of two parts draws twice.
    const order = list
      .map((event) => event.kind)
      .filter((kind, index, kinds) => kind !== kinds[index - 1])
      .join(' > ')
    const written = list.findLast((event) => event.kind === 'progress')
    const drawn = list.find((event) => event.kind === 'draw')
    return {
      frame,
      order,
      written: written?.value ?? null,
      drawn: drawn?.value ?? null,
    }
  })
}

test('one frame: what is written, and when the canvas draws from it', async ({
  browser,
}, testInfo) => {
  test.setTimeout(WEBGL_TEST_BUDGET_MS)
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
  })
  const page = await context.newPage()
  try {
    await page.addInitScript(installFrameLog)
    await page.goto('/id', { waitUntil: 'domcontentloaded' })
    await waitForEntrance(page)
    const intent = await webglIntent(page)
    expect(intent.intended, intent.reason).toBe(true)

    // Into the first plate's share of the pin, where its progress runs.
    const pinned = await page.evaluate(() => {
      const section = document.querySelector<HTMLElement>(
        'section[data-passage]'
      )
      const spacer = section?.parentElement
      if (!section || !spacer?.classList.contains('pin-spacer')) return false
      const top = spacer.getBoundingClientRect().top + window.scrollY
      window.scrollTo(
        0,
        Math.round(top + (spacer.offsetHeight - section.offsetHeight) * 0.1)
      )
      return true
    })
    expect(pinned, 'the passage is not pinned').toBe(true)
    await expect(
      page.locator('[data-passage-plate] [data-plate-material]').first()
    ).toHaveAttribute('data-plate-live', '', { timeout: WEBGL_ARRIVAL_MS })
    await page.waitForTimeout(1500)

    // The reader's wheel, a little at a time, then the settle.
    await page.evaluate(() => {
      if (window.__frameLog) window.__frameLog.recording = true
    })
    await page.mouse.move(720, 450)
    for (let step = 0; step < 12; step += 1) {
      await page.mouse.wheel(0, 60)
      await page.waitForTimeout(120)
    }
    await page.waitForTimeout(1500)
    const events = await page.evaluate(() => {
      const log = window.__frameLog
      if (!log) return []
      log.recording = false
      return log.events
    })

    const frames = summarise(events)
    const both = frames.filter(
      (frame) => frame.written !== null && frame.drawn !== null
    )
    const tally = {
      frames: frames.length,
      withProgressAndDraw: both.length,
      drawAfterProgress: both.filter(
        (frame) => frame.order.indexOf('draw') > frame.order.indexOf('progress')
      ).length,
      drawnFromThisFramesProgress: both.filter(
        (frame) => frame.drawn === frame.written
      ).length,
      scrollAfterProgress: frames.filter(
        (frame) =>
          frame.order.includes('scroll') &&
          frame.order.includes('progress') &&
          frame.order.lastIndexOf('scroll') > frame.order.indexOf('progress')
      ).length,
      orders: Object.fromEntries(
        [...new Set(frames.map((frame) => frame.order))].map((order) => [
          order,
          frames.filter((frame) => frame.order === order).length,
        ])
      ),
    }
    const target = testInfo.outputPath('frame-order.json')
    await writeFile(target, JSON.stringify({ tally, frames, events }, null, 2))
    await testInfo.attach('frame-order.json', { path: target })

    // Anti-vacuum: the log saw frames in which GSAP wrote the progress and
    // the canvas drew the plate.
    expect(
      tally.withProgressAndDraw,
      `frames with both a progress write and a plate draw: ${JSON.stringify(tally)}`
    ).toBeGreaterThan(3)
  } finally {
    await context.close()
  }
})

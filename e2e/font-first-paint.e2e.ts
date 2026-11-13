import { mkdir, writeFile } from 'node:fs/promises'
import path from 'node:path'

import { expect, test } from '@playwright/test'

/**
 * The first screen's words appear in their own typeface, never in a
 * stand-in — F4-06 perbaikan, lever A1 and the owner's answer to it.
 *
 * ## Why this exists
 *
 * With the CSS inside the HTML (`inlineCss`, `next.config.ts`) a phone on a
 * slow link paints about a second and a half sooner, before Onest and Inter
 * have arrived. Under `font-display: swap` its text showed in a fallback
 * face and reflowed when they landed: a layout shift of up to 0.029 on seven
 * templates in the lab, every shifted node a line of text. The owner's
 * answer, verbatim: "SAYA INGIN DESAINNYA TERLIHAT JELAS juga". So
 * `lib/styles/fonts.ts` blocks instead: the text waits, invisible, and
 * appears in its own face.
 *
 * Blocking is honest only inside the browser's window. Chrome holds blocked
 * text for three seconds from the face's first use and then shows the
 * stand-in after all, so the claim here is the pair:
 *
 * 1. every first-screen face declares `font-display: block`;
 * 2. every preloaded font file (all four serve some first screen,
 *    `lib/styles/fonts.ts`) has arrived within three seconds of the page's
 *    first byte, on the slow link Lighthouse's `mobile-applied` profile
 *    applies. No face can be used before the HTML that declares it starts to
 *    arrive, so this bounds each block window from above, with network
 *    times Chrome records exactly rather than with main-thread callbacks,
 *    which a busy page delays.
 *
 * Together they mean no frame shows a first-screen word in a fallback face.
 * The first version of this gate timed faces by the font-set events, and
 * Chrome fires `loading` with an empty face list and `loadingdone` once for
 * the whole batch, so it measured nothing per face.
 * The layout shift while the faces arrive is recorded beside them, not held:
 * blocked text is still laid out in its fallback's metrics, so a little
 * reflow can remain when the face lands, and Lighthouse reports it as CLS.
 *
 * ## What it leaves for a person to look at
 *
 * Every frame the page paints while it loads, from Chrome's screencast, and
 * a JSON timeline of when each face started and finished loading, under
 * `test-results/f4-06-fonts/`, which CI uploads as the `playwright-report`
 * artifact. That is the visual half of the proof: the frames before a face
 * arrives show the page's frame and colours without its words. This laptop
 * takes none (`docs/PROSEDUR-KERJA.md` §3 step 2).
 */

/** The home page and one unit page, the two first screens F4-06 names. */
const PAGES = [
  { name: 'home', path: '/id' },
  { name: 'unit', path: '/id/konstruksi' },
]

/**
 * Lighthouse's applied slow 4G, as `lighthouse-ukur`'s `mobile-applied`
 * variant imposes it: DevTools throttling with Lighthouse's own constants
 * (150 ms RTT scaled to 562.5 ms of request latency, 1.6 Mbps scaled to
 * 1474.56 kbps down, 675 kbps up) and a 4x CPU slowdown.
 */
const SLOW_4G = {
  offline: false,
  latency: 562.5,
  downloadThroughput: Math.floor((1474.56 * 1024) / 8),
  uploadThroughput: Math.floor((675 * 1024) / 8),
}
const CPU_SLOWDOWN = 4

/** Lighthouse's phone screen, the one its `mobile` profiles measure. */
const PHONE = { width: 412, height: 823 }

/** Chrome's block period for `font-display: block`. */
const BLOCK_PERIOD_MS = 3000

/**
 * Whether a face's `unicode-range` covers the Latin letters a to z, which is
 * what a first screen draws with. The `latin-ext` face that the footer's
 * "ū" pulls in covers none of them and is not this gate's business. Parsed
 * rather than matched, because Chrome may write `U+0-FF` or `U+0000-00FF`.
 */
function coversBasicLatin(range: string) {
  return range.split(',').some((part) => {
    const match = /U\+([0-9A-F?]+)(?:-([0-9A-F]+))?/i.exec(part.trim())
    const start = match?.[1]
    if (!start) return false
    const from = Number.parseInt(start.replaceAll('?', '0'), 16)
    const to = Number.parseInt(match[2] ?? start.replaceAll('?', 'F'), 16)
    return from <= 0x61 && to >= 0x7a
  })
}

/**
 * next/font's metric-matched stand-ins (`local()` faces named "… Fallback")
 * load too, and declare no `font-display`. They are what blocked text is
 * laid out in, not a face the page draws its words with.
 */
const STAND_IN = /fallback/i

declare global {
  interface Window {
    __layoutShift?: number
  }
}

test.describe('the first screen draws its words in their own face', () => {
  test.use({ viewport: PHONE })

  for (const { name, path: route } of PAGES) {
    test(`${name}: no fallback face on applied slow 4G`, async ({
      page,
    }, testInfo) => {
      testInfo.setTimeout(120_000)

      await page.addInitScript(() => {
        window.__layoutShift = 0
        new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) {
            const shift = entry as PerformanceEntry & {
              value: number
              hadRecentInput: boolean
            }
            if (!shift.hadRecentInput) {
              window.__layoutShift = (window.__layoutShift ?? 0) + shift.value
            }
          }
        }).observe({ type: 'layout-shift', buffered: true })
      })

      const cdp = await page.context().newCDPSession(page)
      await cdp.send('Network.enable')
      await cdp.send('Network.emulateNetworkConditions', SLOW_4G)
      await cdp.send('Emulation.setCPUThrottlingRate', { rate: CPU_SLOWDOWN })

      // Every frame the page paints, with the wall-clock time Chrome painted
      // it, so it can be set against the font timeline below.
      const frames: { epochMs: number; data: string }[] = []
      cdp.on('Page.screencastFrame', (frame) => {
        frames.push({
          epochMs: (frame.metadata.timestamp ?? 0) * 1000,
          data: frame.data,
        })
        void cdp
          .send('Page.screencastFrameAck', { sessionId: frame.sessionId })
          .catch(() => undefined)
      })
      await cdp.send('Page.startScreencast', {
        format: 'jpeg',
        quality: 70,
        maxWidth: PHONE.width,
        maxHeight: PHONE.height,
      })

      await page.goto(route, { waitUntil: 'load', timeout: 90_000 })
      // Every face the page asked for has settled: the set reads `loaded`
      // twice, a second apart, since text mounted late starts a face late.
      await expect
        .poll(
          async () => {
            const before = await page.evaluate(() => document.fonts.status)
            await page.waitForTimeout(1000)
            const after = await page.evaluate(() => document.fonts.status)
            return before === 'loaded' && after === 'loaded'
          },
          { message: `${route}: the fonts never settled`, timeout: 60_000 }
        )
        .toBe(true)
      await cdp.send('Page.stopScreencast')

      const record = await page.evaluate(() => {
        const navigation = performance.getEntriesByType('navigation')[0] as
          | PerformanceNavigationTiming
          | undefined
        const paint = (name: string) =>
          performance.getEntriesByName(name)[0]?.startTime ?? null
        return {
          origin: performance.timeOrigin,
          shift: window.__layoutShift ?? 0,
          firstByte: navigation?.responseStart ?? 0,
          firstPaint: paint('first-paint'),
          firstContentfulPaint: paint('first-contentful-paint'),
          faces: [...document.fonts].map((face) => ({
            family: face.family,
            style: face.style,
            display: face.display,
            range: face.unicodeRange,
            status: face.status,
          })),
          files: performance
            .getEntriesByType('resource')
            .filter((entry) => /\.woff2(\?|$)/u.test(entry.name))
            .map((entry) => {
              const resource = entry as PerformanceResourceTiming
              return {
                file: resource.name.split('/').pop() ?? resource.name,
                preloaded: resource.initiatorType === 'link',
                start: resource.startTime,
                arrived: resource.responseEnd,
              }
            }),
        }
      })
      const { origin, shift } = record

      const outputDir = path.join('test-results', 'f4-06-fonts', name)
      await mkdir(outputDir, { recursive: true })
      for (const frame of frames) {
        const at = Math.round(frame.epochMs - origin)
        await writeFile(
          path.join(outputDir, `frame-${String(at).padStart(6, '0')}ms.jpg`),
          Buffer.from(frame.data, 'base64')
        )
      }
      await writeFile(
        path.join(outputDir, 'timeline.json'),
        `${JSON.stringify(
          {
            route,
            network: SLOW_4G,
            cpuSlowdown: CPU_SLOWDOWN,
            blockPeriodMs: BLOCK_PERIOD_MS,
            layoutShift: shift,
            frames: frames.map((frame) => Math.round(frame.epochMs - origin)),
            ...record,
          },
          null,
          2
        )}\n`
      )

      const firstScreen = record.faces.filter(
        (face) =>
          coversBasicLatin(face.range) &&
          !STAND_IN.test(face.family) &&
          face.status !== 'unloaded'
      )
      expect(
        firstScreen.length,
        `${route}: no basic-Latin face was used at all`
      ).toBeGreaterThan(0)
      for (const face of firstScreen) {
        const name = `${face.family} ${face.style}`
        expect(
          face.display,
          `${route}: ${name} would show its words in a fallback face first`
        ).toBe('block')
        expect(face.status, `${route}: ${name} failed to load`).toBe('loaded')
      }

      const preloaded = record.files.filter((file) => file.preloaded)
      expect(
        preloaded.length,
        `${route}: no font file was preloaded`
      ).toBeGreaterThan(0)
      for (const file of preloaded) {
        const sinceFirstByte = file.arrived - record.firstByte
        expect(
          sinceFirstByte,
          `${route}: ${file.file} arrived ${Math.round(sinceFirstByte)} ms after the first byte, past the ${BLOCK_PERIOD_MS} ms block, so a fallback face could show`
        ).toBeLessThan(BLOCK_PERIOD_MS)
      }
    })
  }
})

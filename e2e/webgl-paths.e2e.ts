import { mkdir, writeFile } from 'node:fs/promises'
import path from 'node:path'

import type { Browser, BrowserContextOptions, Page } from '@playwright/test'
import { expect, test } from '@playwright/test'

import { FEATURED_WORK } from './fixtures'
import { waitForEntrance } from './page-settled'
import { transitionsAtRest } from './settle'
import {
  waitForCanvas,
  WEBGL_TEST_BUDGET_MS,
  webglIntent,
} from './webgl-intent'

/**
 * Every route that mounts the WebGL root, on every path a reader can be on —
 * F4-04 "WebGL per halaman".
 *
 * Three routes pass `webgl` to `<Wrapper>`: the home page, `/work` and a
 * work page (`docs/MOTION-SPEC.md` §11.1). Each is visited at the two sizes
 * the plan names, 1440 × 900 and 390 × 844, on three paths:
 *
 * - **webgl**: an ordinary browser. At 1440 the site's own test
 *   (`lib/hooks/use-device-detection.ts`: WebGL2, a width of at least 800px,
 *   and no reduced motion) mounts the canvas; at 390 the same test says no,
 *   which is the path every phone takes.
 * - **no-webgl**: a browser started with `--disable-webgl`, so the page finds
 *   no WebGL2 at all, as on a desktop whose GPU is blocklisted or whose
 *   WebGL is switched off.
 * - **reduced-motion**: `prefers-reduced-motion: reduce`, which mounts no
 *   canvas at any width.
 *
 * Each visit writes two screenshots and a JSON record of what the page
 * decided to `test-results/f4-04-webgl/`, which CI uploads as the
 * `playwright-report` artifact. They are the evidence the owner reviews
 * (`docs/F4-04-WEBGL.md`); this laptop takes none
 * (`docs/PROSEDUR-KERJA.md` §3 step 2).
 *
 * Where the page decides against WebGL, the path is held to `CLAUDE.md` #14:
 * no canvas, no three.js on the wire, and every surface WebGL would have
 * taken over still painted by the DOM — the hero's CSS wash, the flat plates,
 * the plain pictures. `e2e/webgl-budget.e2e.ts` held the bytes for the home
 * page under reduced motion only; this extends that to all three routes on
 * all three paths.
 *
 * Where the page decides for WebGL, nothing new is asserted beyond the
 * canvas. The plates, the material and the wash have their own gates
 * (`plate-paths`, `material-frame`, `visual-substance`,
 * `canvas-survives-navigation`, `webgl-lifecycle`), and a headless software
 * renderer is known to drop the WebGL layer from some captures
 * (`visual-substance.e2e.ts`, Tahap 100), so a screenshot is not where that
 * path is judged. The record says whether each live marker had arrived when
 * its picture was taken.
 */

/** The surfaces WebGL takes over, as the DOM leaves them. */
interface SurfaceFacts {
  /** The hero's wash, `vault/webgl/scene-shell`. */
  regions: { live: boolean; background: string; area: number }[]
  /** The passage's working drawings, `vault/webgl/plate-material`. */
  plates: { live: boolean; drawingOpacity: string }[]
  /** The work pictures, `vault/webgl/material-image`. */
  shells: { live: boolean; opacity: string; hasImage: boolean }[]
}

interface RouteCase {
  /** File-name stem. */
  name: string
  path: string
  /**
   * The WebGL-carrying part of the page below the first screen. `start`
   * scrolls a little past the element's top, for the home page's pinned
   * passage, whose first plate already rests in the frame when the pin
   * begins; `center` centres the element.
   */
  anchor: { selector: string; align: 'start' | 'center' }
  /** The marker the WebGL path raises once a frame is drawn, per shot. */
  live: { top: string; anchor: string }
  /** What must exist for the page to be the one this was written for. */
  carries: { surface: keyof SurfaceFacts; min: number }[]
}

const ROUTES: RouteCase[] = [
  {
    name: 'home',
    path: '/id',
    anchor: { selector: 'section[data-passage]', align: 'start' },
    live: { top: '[data-accent-live]', anchor: '[data-plate-live]' },
    carries: [
      { surface: 'regions', min: 1 },
      { surface: 'plates', min: 2 },
    ],
  },
  {
    name: 'work',
    path: '/id/work',
    anchor: { selector: '[data-material-shell]', align: 'center' },
    live: { top: '[data-material]', anchor: '[data-material]' },
    carries: [{ surface: 'shells', min: 1 }],
  },
  {
    name: 'work-detail',
    path: `/id/work/${FEATURED_WORK}`,
    anchor: { selector: '[data-material-shell]', align: 'center' },
    live: { top: '[data-material]', anchor: '[data-material]' },
    carries: [{ surface: 'shells', min: 1 }],
  },
]

interface ViewportCase {
  label: string
  context: BrowserContextOptions
}

const VIEWPORTS: ViewportCase[] = [
  { label: '1440x900', context: { viewport: { width: 1440, height: 900 } } },
  {
    label: '390x844',
    // The mobile project's device in `playwright.config.ts`.
    context: {
      viewport: { width: 390, height: 844 },
      deviceScaleFactor: 3,
      hasTouch: true,
      isMobile: true,
    },
  },
]

interface PathCase {
  name: 'webgl' | 'no-webgl' | 'reduced-motion'
  label: string
  context: BrowserContextOptions
  launchArgs: string[]
}

const PATHS: PathCase[] = [
  {
    name: 'webgl',
    label: 'in an ordinary browser',
    context: {},
    launchArgs: [],
  },
  {
    name: 'no-webgl',
    label: 'in a browser without WebGL',
    context: {},
    /*
     * A browser without WebGL, rather than a patched `getContext`:
     * `webgl-lifecycle.e2e.ts` records why patching that built-in went
     * wrong here once. The premise is checked before anything else, so a
     * flag that stopped working fails the test instead of photographing the
     * WebGL path under the wrong name.
     */
    launchArgs: ['--disable-webgl'],
  },
  {
    name: 'reduced-motion',
    label: 'under reduced motion',
    context: { reducedMotion: 'reduce' },
    launchArgs: [],
  },
]

/** Same identification as `webgl-budget.e2e.ts`: by content, not by size. */
const ENGINE_MARKERS = /THREE\.|WebGLRenderer|react-three-fiber/
const SCAN_FLOOR_BYTES = 50_000

/**
 * How long a live marker is waited for before the picture is taken anyway.
 * Not an assertion: the WebGL path has its own gates (see the header).
 */
const LIVE_WAIT_MS = 20_000

/**
 * Time for a post-hydration `import()` to fire, as `webgl-budget` allows, and
 * for the passage's half-second scrub to catch up after a scroll.
 */
const SETTLE_MS = 1500

const SHOT_TIMEOUT_MS = 20_000

/** What the page decided, and on what. Written beside the screenshots. */
interface VisitRecord {
  route: string
  viewport: string
  path: PathCase['name']
  intended: boolean
  verdict: string
  device: {
    innerWidth: number
    desktopWidth: boolean
    webgl2: boolean
    reducedMotion: boolean
    touchOnly: boolean
    hardwareConcurrency: number
  }
  canvases: number
  engineChunks: string[]
  /** Whether the live marker had arrived per shot; `null` off the WebGL path. */
  live: { top: boolean | null; anchor: boolean | null }
  surfaces: SurfaceFacts
}

function readDevice(page: Page): Promise<VisitRecord['device']> {
  return page.evaluate(() => ({
    innerWidth: window.innerWidth,
    desktopWidth: matchMedia('(min-width: 800px)').matches,
    webgl2: document.createElement('canvas').getContext('webgl2') !== null,
    reducedMotion: matchMedia('(prefers-reduced-motion: reduce)').matches,
    touchOnly: matchMedia('(any-pointer: coarse) and (hover: none)').matches,
    hardwareConcurrency: navigator.hardwareConcurrency,
  }))
}

function readSurfaces(page: Page): Promise<SurfaceFacts> {
  return page.evaluate(() => {
    const all = (selector: string) => [
      ...document.querySelectorAll<HTMLElement>(selector),
    ]
    return {
      regions: all('[data-accent-region]').map((region) => {
        const box = region.getBoundingClientRect()
        return {
          live: region.hasAttribute('data-accent-live'),
          background: getComputedStyle(region).backgroundImage,
          area: Math.round(box.width * box.height),
        }
      }),
      plates: all('[data-plate-material]').map((plate) => {
        const drawing = plate.querySelector(':scope > svg')
        return {
          live: plate.hasAttribute('data-plate-live'),
          drawingOpacity: drawing ? getComputedStyle(drawing).opacity : 'none',
        }
      }),
      shells: all('[data-material-shell]').map((shell) => ({
        live: shell.hasAttribute('data-material'),
        opacity: getComputedStyle(shell).opacity,
        hasImage: shell.querySelector('img') !== null,
      })),
    }
  })
}

/** Puts the route's WebGL-carrying part on screen and lets it settle. */
async function showAnchor(page: Page, anchor: RouteCase['anchor']) {
  await page.evaluate(({ selector, align }) => {
    const element = document.querySelector(selector)
    if (!element) return
    if (align === 'center') {
      element.scrollIntoView({ block: 'center' })
      return
    }
    const top = element.getBoundingClientRect().top + window.scrollY
    window.scrollTo(0, top + window.innerHeight * 0.35)
  }, anchor)
  await page.waitForTimeout(SETTLE_MS)
  await transitionsAtRest(page)
}

function waitLive(page: Page, selector: string): Promise<boolean> {
  return page
    .locator(selector)
    .first()
    .waitFor({ state: 'attached', timeout: LIVE_WAIT_MS })
    .then(() => true)
    .catch(() => false)
}

async function visit(
  browser: Browser,
  route: RouteCase,
  viewport: ViewportCase,
  pathCase: PathCase,
  outputDir: string
): Promise<VisitRecord> {
  const context = await browser.newContext({
    ...viewport.context,
    ...pathCase.context,
  })
  const page = await context.newPage()
  const stem = `${route.name}__${viewport.label}__${pathCase.name}`

  const engineChunks: string[] = []
  const reads: Promise<void>[] = []
  page.on('response', (response) => {
    if (!response.url().includes('/_next/static/chunks')) return
    reads.push(
      response.body().then(
        (body) => {
          if (body.length < SCAN_FLOOR_BYTES) return
          if (!ENGINE_MARKERS.test(body.toString('latin1'))) return
          const name = response.url().split('/').pop() ?? '?'
          engineChunks.push(`${name} ${Math.round(body.length / 1024)}KB`)
        },
        () => {
          // A body that cannot be read (a cancelled request) weighs nothing.
        }
      )
    )
  })

  try {
    await page.goto(route.path, { waitUntil: 'domcontentloaded' })
    await waitForEntrance(page)

    const device = await readDevice(page)
    if (pathCase.name === 'no-webgl' && device.webgl2) {
      throw new Error(
        `${stem}: the browser started with --disable-webgl still offers WebGL2, so this would photograph the WebGL path under the wrong name`
      )
    }
    if (pathCase.name === 'reduced-motion' && !device.reducedMotion) {
      throw new Error(`${stem}: the reduced-motion preference did not apply`)
    }

    const intent = await webglIntent(page)
    const live: VisitRecord['live'] = { top: null, anchor: null }

    if (intent.intended) {
      await waitForCanvas(page)
      live.top = await waitLive(page, route.live.top)
    } else {
      await page.waitForTimeout(SETTLE_MS)
    }
    await transitionsAtRest(page)

    await mkdir(outputDir, { recursive: true })
    await writeFile(
      path.join(outputDir, `${stem}__1-top.png`),
      await page.screenshot({ timeout: SHOT_TIMEOUT_MS })
    )

    await showAnchor(page, route.anchor)
    if (intent.intended) {
      live.anchor = await waitLive(page, route.live.anchor)
    }
    await writeFile(
      path.join(outputDir, `${stem}__2-anchor.png`),
      await page.screenshot({ timeout: SHOT_TIMEOUT_MS })
    )

    await Promise.all(reads)
    const record: VisitRecord = {
      route: route.path,
      viewport: viewport.label,
      path: pathCase.name,
      intended: intent.intended,
      verdict: intent.intended ? 'the canvas mounts' : intent.reason,
      device,
      canvases: await page.locator('canvas').count(),
      engineChunks,
      live,
      surfaces: await readSurfaces(page),
    }
    await writeFile(
      path.join(outputDir, `${stem}.json`),
      `${JSON.stringify(record, null, 2)}\n`
    )
    return record
  } finally {
    await context.close()
  }
}

/** The claims a path without WebGL has to keep — `CLAUDE.md` #14. */
function expectFinishedWithoutWebGL(record: VisitRecord, route: RouteCase) {
  const where = `${record.route} at ${record.viewport} (${record.path})`

  for (const { surface, min } of route.carries) {
    expect(
      record.surfaces[surface].length,
      `${where}: fewer than ${min} ${surface}, so this is not the page the check was written for`
    ).toBeGreaterThanOrEqual(min)
  }

  expect(record.canvases, `${where}: a canvas mounted`).toBe(0)
  expect(
    record.engineChunks,
    `${where}: the 3D engine was downloaded by a reader who is shown none`
  ).toEqual([])

  for (const [index, region] of record.surfaces.regions.entries()) {
    expect(region.live, `${where}: wash ${index} claims a live mesh`).toBe(
      false
    )
    expect(
      region.background,
      `${where}: wash ${index} paints no CSS gradient, so the hero has none`
    ).toContain('gradient')
    expect(region.area, `${where}: wash ${index} has no size`).toBeGreaterThan(
      0
    )
  }
  for (const [index, plate] of record.surfaces.plates.entries()) {
    expect(plate.live, `${where}: plate ${index} claims a lit plate`).toBe(
      false
    )
    expect(
      plate.drawingOpacity,
      `${where}: plate ${index}'s drawing is hidden with nothing in its place`
    ).toBe('1')
  }
  for (const [index, shell] of record.surfaces.shells.entries()) {
    expect(shell.hasImage, `${where}: picture ${index} has no <img>`).toBe(true)
    expect(shell.live, `${where}: picture ${index} claims a material`).toBe(
      false
    )
    expect(
      shell.opacity,
      `${where}: picture ${index} is hidden with nothing in its place`
    ).toBe('1')
  }
}

declare global {
  interface Window {
    /** Filled by the probe in the wash test below, read back after. */
    __washGap?: { frames: number; bare: number; live: boolean }
  }
}

/*
 * The hero is never left with neither wash — F4-04.
 *
 * `vault/webgl/scene-shell` used to swap its CSS gradient for an empty shell
 * the moment the scene's chunk arrived, and the mesh drew some frames later:
 * the canvas still had to fetch its own chunk, build a renderer and render.
 * For those frames the hero showed the bare ground, and if the canvas never
 * drew, it kept showing it. Every frame from the first script to the mesh's
 * first drawn frame is read here, so a single frame of neither fails.
 */
test('the hero keeps its CSS wash until the mesh has drawn', async ({
  browser,
}) => {
  test.setTimeout(WEBGL_TEST_BUDGET_MS)
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
  })
  const page = await context.newPage()
  try {
    await page.addInitScript(() => {
      const state = { frames: 0, bare: 0, live: false }
      window.__washGap = state
      const read = () => {
        const region = document.querySelector('[data-accent-region]')
        if (region instanceof HTMLElement) {
          if (region.hasAttribute('data-accent-live')) {
            state.live = true
            return
          }
          state.frames += 1
          if (getComputedStyle(region).backgroundImage === 'none') {
            state.bare += 1
          }
        }
        requestAnimationFrame(read)
      }
      requestAnimationFrame(read)
    })
    await page.goto('/id', { waitUntil: 'domcontentloaded' })
    const intent = await webglIntent(page)
    test.skip(!intent.intended, intent.reason)

    await waitForCanvas(page)
    if (!(await waitLive(page, '[data-accent-live]'))) {
      throw new Error(
        `WebGL is intended here and the canvas arrived, but the wash never went live in ${LIVE_WAIT_MS / 1000}s`
      )
    }
    const gap = await page.evaluate(() => window.__washGap)

    expect(gap?.live, 'the probe never saw the mesh go live').toBe(true)
    expect(
      gap?.frames,
      'the probe read no frame before the mesh went live, so it proved nothing'
    ).toBeGreaterThan(0)
    expect(
      gap?.bare,
      `frames, of ${gap?.frames}, in which the hero had neither its CSS wash nor a drawn mesh`
    ).toBe(0)
  } finally {
    await context.close()
  }
})

for (const pathCase of PATHS) {
  test.describe(`the WebGL routes ${pathCase.label}`, () => {
    for (const route of ROUTES) {
      for (const viewport of VIEWPORTS) {
        test(`${route.path} at ${viewport.label}`, async ({
          browser,
          playwright,
        }, testInfo) => {
          test.setTimeout(WEBGL_TEST_BUDGET_MS)
          /*
           * A browser of its own for a path that needs launch flags.
           * `test.use({ launchOptions })` inside a describe group is refused
           * ("it forces a new worker"; CI on `56fd822`), and a top-level one
           * would take WebGL from every test in this file.
           */
          const own =
            pathCase.launchArgs.length > 0
              ? await playwright.chromium.launch({ args: pathCase.launchArgs })
              : null
          let record: VisitRecord
          try {
            record = await visit(
              own ?? browser,
              route,
              viewport,
              pathCase,
              path.join(testInfo.project.outputDir, 'f4-04-webgl')
            )
          } finally {
            await own?.close()
          }
          testInfo.annotations.push({
            type: 'webgl verdict',
            description: [
              record.verdict,
              `canvas ${record.canvases}`,
              `engine ${record.engineChunks.join(', ') || 'none'}`,
              `live at top ${String(record.live.top)}`,
              `live at anchor ${String(record.live.anchor)}`,
            ].join('; '),
          })

          if (record.intended) {
            // The WebGL path; its gates live elsewhere (see the header).
            expect(record.canvases).toBeGreaterThan(0)
            return
          }
          expectFinishedWithoutWebGL(record, route)
        })
      }
    }
  })
}

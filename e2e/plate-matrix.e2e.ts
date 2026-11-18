import { writeFile } from 'node:fs/promises'

import type { Browser, Page, TestInfo } from '@playwright/test'
import { expect, test } from '@playwright/test'

import { waitForEntrance } from './page-settled'
import {
  installPlateMatrix,
  type PlateMatrixOptions,
  type PlateMatrixState,
  type PlateVariant,
} from './plate-matrix'
import {
  WEBGL_ARRIVAL_MS,
  WEBGL_TEST_BUDGET_MS,
  webglIntent,
} from './webgl-intent'

/**
 * The render-isolation matrix for the plates and the hero's headline — G2.
 *
 * A diagnostic, written for `docs/G2-MATRIKS-RENDER.md`: it photographs each
 * state of the owner's matrix (`docs/SOLUSI-TEKNIS-VISUAL-GERAK.md` §2) and
 * keeps the pictures in `test-results/`, which CI uploads as the
 * `playwright-report` artifact. One viewport, one font, one route, one scroll
 * position and one ground for every picture of a row; one variable changed
 * per comparison; every row at DPR 1 and DPR 2.
 *
 * | Row | State | File |
 * | --- | --- | --- |
 * | A | The texture's own canvas, shown flat at the plate's reading size, added to the page as the plate adds light; and the flat SVG beside it | `A-texture.png`, `A-svg.png` |
 * | B | The texture on a frontal plane through a neutral shader, no halo, no scan | `B-neutral.png` |
 * | C | Normal alpha with the red channel as coverage, against B's additive, on the dark ground and on paper | `C-normal-dark.png`, `C-additive-paper.png`, `C-normal-paper.png` |
 * | D | The halo alone, then the scan alone | `D-halo.png`, `D-scan.png` |
 * | E | The neutral shader at the turn's start, middle, lean and end | `B-neutral.png`, `E-middle.png`, `E-lean.png`, `E-end.png` |
 * | F | The shipped plate while the reader scrolls, each picture stamped with the GL frame it shows, then at rest | `F-shipped-*.png` |
 * | G | The hero's `<h1>` moving and settled, then with its layer, its masks and its split taken away one at a time | `G-*.png` |
 *
 * Rows A to E hold the plate still by writing its `data-plate-progress`
 * after the passage has settled, so nothing moves while they are taken.
 *
 * CI renders WebGL through SwiftShader, a software rasteriser (`CLAUDE.md`
 * #19). That is a fair witness to a glyph's shape and to how layers
 * composite. It says nothing about frame timing, so no picture here is
 * evidence of how smooth anything is.
 *
 * Row G only observes. The hero and `TextReveal` belong to another goal (G1);
 * the styles this test adds are taken away with the page.
 */

const VIEWPORT = { width: 1440, height: 900 } as const
const DPRS = [1, 2] as const

/** `--color-paper` and `--color-ink` (`lib/styles/colors.ts`), sRGB-encoded. */
const PAPER = [0.9584, 0.9529, 0.9358] as const
const INK = [0.0677, 0.0585, 0.0498] as const
const PAPER_CSS = 'oklch(0.964 0.006 92)'

/** The scene's `TEXTURE_WIDTH` (`vault/webgl/plate-material/scene.tsx`). */
const TEXTURE_WIDTH = 1600

/** Where row D's scan band crosses each part: under Konstruksi's plan title. */
const SCAN_AT = 0.45

/**
 * Where in the pin the first plate rests: past the frame's settle (the first
 * 0.15) and inside the first plate's share (0.08 to 0.32).
 */
const REST = 0.16

/** The plate's text sizes, in plate units (`lib/plates/types.ts`). */
const TEXT_UNITS = { label: 14.5, figure: 13, note: 12, title: 22 } as const

const FIRST_PLATE = '[data-passage-plate]'
const FIRST_MATERIAL = `${FIRST_PLATE} [data-plate-material]`

interface Opened {
  page: Page
  close: () => Promise<void>
}

/** Scrolls to a fraction of the passage's pin, once GSAP has built it. */
async function scrollPin(page: Page, fraction: number) {
  await page
    .locator('.pin-spacer > section[data-passage]')
    .waitFor({ state: 'attached', timeout: 15_000 })
    .catch(() => {
      // Reported below, with what was found instead.
    })
  const found = await page.evaluate((at) => {
    const section = document.querySelector<HTMLElement>('section[data-passage]')
    const spacer = section?.parentElement
    if (!section || !spacer?.classList.contains('pin-spacer')) return false
    const top = spacer.getBoundingClientRect().top + window.scrollY
    const length = spacer.offsetHeight - section.offsetHeight
    window.scrollTo(0, Math.round(top + length * at))
    return true
  }, fraction)
  if (!found) throw new Error('the passage is not pinned, so it has no rest')
}

/** Waits until the canvas has rendered `count` more frames. */
async function framesPass(page: Page, count: number) {
  const from = await page.evaluate(() => window.__plateMatrix?.frames ?? 0)
  await page.waitForFunction(
    (target) => (window.__plateMatrix?.frames ?? 0) >= target,
    from + count,
    { timeout: WEBGL_ARRIVAL_MS }
  )
}

/** Holds the first plate at `progress`, and waits for it to be drawn so. */
async function holdProgress(page: Page, progress: number) {
  await page.evaluate(
    ([selector, value]) => {
      document
        .querySelector(selector)
        ?.setAttribute('data-plate-progress', String(value))
    },
    [FIRST_MATERIAL, progress] as const
  )
  await framesPass(page, 3)
}

/**
 * Paints the page's ground paper. Only the document's own ground: `<main>`
 * stays clear, because the canvas is drawn behind it. The hero's wash is
 * held back while it is on: the canvas draws it over the whole viewport, so
 * it, not the page, is the ground behind a lit plate (run #367, rows A–C).
 */
async function paperGround(page: Page, on: boolean) {
  await page.evaluate(
    ([paper, apply]) => {
      if (window.__plateMatrix) window.__plateMatrix.hideWash = apply
      const id = 'plate-matrix-paper'
      document.querySelector(`#${id}`)?.remove()
      if (!apply) return
      const style = document.createElement('style')
      style.id = id
      style.textContent = `html, body { background-color: ${paper} !important; }`
      document.head.append(style)
    },
    [PAPER_CSS, on] as const
  )
  await framesPass(page, 2)
}

async function write(testInfo: TestInfo, name: string, data: Buffer | string) {
  const target = testInfo.outputPath(name)
  await writeFile(target, data)
  await testInfo.attach(name, { path: target })
}

/** The passage's frame, which every plate picture is cropped to. */
async function frameShot(page: Page, testInfo: TestInfo, name: string) {
  const clip = await page.evaluate(() => {
    const box = document
      .querySelector('[data-passage-frame]')
      ?.getBoundingClientRect()
    return box
      ? { x: box.left, y: box.top, width: box.width, height: box.height }
      : null
  })
  if (!clip) throw new Error('the passage has no frame to photograph')
  await write(testInfo, `${name}.png`, await page.screenshot({ clip }))
}

/** What the plate looks like to the page now, for the record of each run. */
function plateFacts(page: Page) {
  return page.evaluate(
    ([selector, units]) => {
      const svg = document.querySelector(`${selector} svg[role="img"]`)
      const material = document.querySelector(selector)
      const box = svg?.getBoundingClientRect()
      const view =
        svg instanceof SVGSVGElement ? svg.viewBox.baseVal : undefined
      const fit =
        box && view
          ? Math.min(box.width / view.width, box.height / view.height)
          : 0
      const css = Object.fromEntries(
        Object.entries(units).map(([role, size]) => [
          role,
          Math.round(size * fit * 100) / 100,
        ])
      )
      return {
        unit: svg?.getAttribute('data-plate') ?? null,
        progress: material?.getAttribute('data-plate-progress') ?? null,
        live: material?.hasAttribute('data-plate-live') ?? false,
        box: box
          ? {
              left: Math.round(box.left),
              top: Math.round(box.top),
              width: Math.round(box.width),
              height: Math.round(box.height),
            }
          : null,
        viewBox: view ? [view.x, view.y, view.width, view.height] : null,
        fit: Math.round(fit * 1000) / 1000,
        /** Each text role's size on screen, in CSS pixels, with the plate flat. */
        textCssPx: css,
      }
    },
    [FIRST_MATERIAL, TEXT_UNITS] as const
  )
}

function matrixState(
  page: Page
): Promise<Omit<PlateMatrixState, 'textures'> & { textures: string[] }> {
  return page.evaluate(() => {
    const state = window.__plateMatrix
    if (!state) throw new Error('the matrix script is not installed')
    return {
      variant: state.variant,
      seen: state.seen,
      rewritten: state.rewritten,
      draws: state.draws,
      frames: state.frames,
      textures: state.textures.map(
        (canvas) => `${canvas.width}x${canvas.height}`
      ),
      errors: state.errors,
      hideWash: state.hideWash,
    }
  })
}

/**
 * Opens the home page with the plate in `variant`, scrolled to the first
 * plate's rest, once that plate has been lit.
 */
async function openPassage(
  browser: Browser,
  dpr: number,
  variant: PlateVariant,
  ink: PlateMatrixOptions['ink'] = PAPER
): Promise<Opened> {
  const context = await browser.newContext({
    viewport: VIEWPORT,
    deviceScaleFactor: dpr,
  })
  const page = await context.newPage()
  const options: PlateMatrixOptions = {
    variant,
    ink,
    scanAt: SCAN_AT,
    textureWidth: TEXTURE_WIDTH,
  }
  await page.addInitScript(installPlateMatrix, options)
  await page.goto('/id', { waitUntil: 'domcontentloaded' })
  await waitForEntrance(page)

  // Owed, not optional: at 1440 wide with motion allowed the site lights the
  // plates, and a matrix without them would be pictures of nothing.
  const intent = await webglIntent(page)
  if (!intent.intended) {
    throw new Error(`the matrix needs the lit plate: ${intent.reason}`)
  }

  await scrollPin(page, REST)
  await expect(
    page.locator(FIRST_MATERIAL).first(),
    'the first plate was never lit'
  ).toHaveAttribute('data-plate-live', '', { timeout: WEBGL_ARRIVAL_MS })
  // The pin scrubs with half a second of catch-up; then nothing writes the
  // progress until the reader scrolls again.
  await page.waitForTimeout(1500)
  await framesPass(page, 3)

  return { page, close: () => context.close() }
}

async function record(page: Page, testInfo: TestInfo, extra: object = {}) {
  const [state, plate] = await Promise.all([
    matrixState(page),
    plateFacts(page),
  ])
  await write(
    testInfo,
    'facts.json',
    JSON.stringify(
      {
        viewport: VIEWPORT,
        devicePixelRatio: await page.evaluate(() => window.devicePixelRatio),
        state,
        plate,
        ...extra,
      },
      null,
      2
    )
  )
  // Anti-vacuum: every picture above is of a plate that drew, through the
  // variant it names.
  expect(state.draws, 'the plate made no draw call').toBeGreaterThan(0)
  expect(state.seen, 'no plate shader was compiled').toBeGreaterThan(0)
  expect(state.errors, 'a plate shader did not compile').toEqual([])
  if (state.variant !== 'shipped') {
    expect(state.rewritten, 'the variant never reached the shader').toBe(
      state.seen
    )
  }
  return { state, plate }
}

for (const dpr of DPRS) {
  test.describe(`plate matrix at DPR ${dpr}`, () => {
    // Several held states per page, each waiting on a software-rendered
    // frame at up to 2880 × 1800 device pixels.
    test.describe.configure({ timeout: WEBGL_TEST_BUDGET_MS * 2 })

    /*
     * Rows B, E, C's additive half on paper, then A: the neutral shader, which
     * is the texel and nothing else, blended additively as the plate was.
     */
    test('A B E: the texture, the neutral shader, the turn', async ({
      browser,
    }, testInfo) => {
      const { page, close } = await openPassage(browser, dpr, 'neutral')
      try {
        await holdProgress(page, 0)
        await frameShot(page, testInfo, 'B-neutral')

        // Row E: the turn held still at its middle (turn 0.5), its lean
        // (turn 1, no orbit) and its end (turn 1, the orbit's full 14°).
        for (const [name, progress] of [
          ['E-middle', 0.3],
          ['E-lean', 0.6],
          ['E-end', 1],
        ] as const) {
          await holdProgress(page, progress)
          await frameShot(page, testInfo, name)
        }

        // Row C, its additive half on paper: light added to paper.
        await holdProgress(page, 0)
        await paperGround(page, true)
        await frameShot(page, testInfo, 'C-additive-paper')
        await paperGround(page, false)

        /*
         * Row A last. It hides the canvas and decodes a 1600-pixel picture of
         * the texture, and once, at DPR 2, the canvas drew too few frames
         * after it for the next held state to settle (run #381, retried
         * green). Taken last, nothing after it waits on the canvas.
         */
        // Row A. The texture's canvas over the flat plate's box, fitted the
        // way the SVG fits its view box, and added to the page the way the
        // plate adds light (`plus-lighter`), with the canvas hidden: the same
        // pixels, sampled by the browser instead of by WebGL.
        const shown = await page.evaluate(
          async ([selector, width]) => {
            const svg = document.querySelector(`${selector} svg[role="img"]`)
            if (!(svg instanceof SVGSVGElement)) return null
            const view = svg.viewBox.baseVal
            const height = Math.round((width * view.height) / view.width)
            const source = window.__plateMatrix?.textures.find(
              (canvas) => Math.abs(canvas.height - height) <= 1
            )
            if (!source) return null
            const box = svg.getBoundingClientRect()
            const image = document.createElement('img')
            image.id = 'plate-matrix-texture'
            image.alt = ''
            image.src = source.toDataURL('image/png')
            Object.assign(image.style, {
              position: 'fixed',
              left: `${box.left}px`,
              top: `${box.top}px`,
              width: `${box.width}px`,
              height: `${box.height}px`,
              objectFit: 'contain',
              mixBlendMode: 'plus-lighter',
              zIndex: '2147483647',
              pointerEvents: 'none',
            })
            document.body.append(image)
            await image.decode()
            for (const canvas of document.querySelectorAll('canvas')) {
              canvas.style.visibility = 'hidden'
            }
            return `${source.width}x${source.height}`
          },
          [FIRST_MATERIAL, TEXTURE_WIDTH] as const
        )
        expect(
          shown,
          'no texture canvas matched the first plate'
        ).not.toBeNull()
        await frameShot(page, testInfo, 'A-texture')

        // The flat SVG at the same box, with the canvas still hidden: the
        // vector drawing the texture was rasterised from.
        await page.evaluate((selector) => {
          document.querySelector('#plate-matrix-texture')?.remove()
          const svg = document.querySelector(`${selector} svg[role="img"]`)
          if (svg instanceof SVGElement) {
            svg.style.setProperty('opacity', '1', 'important')
          }
        }, FIRST_MATERIAL)
        await frameShot(page, testInfo, 'A-svg')
        await page.evaluate((selector) => {
          const svg = document.querySelector(`${selector} svg[role="img"]`)
          if (svg instanceof SVGElement) svg.style.removeProperty('opacity')
          for (const canvas of document.querySelectorAll('canvas')) {
            canvas.style.removeProperty('visibility')
          }
        }, FIRST_MATERIAL)

        await record(page, testInfo, { textureShown: shown })
      } finally {
        await close()
      }
    })

    test('C: normal alpha on the dark ground', async ({
      browser,
    }, testInfo) => {
      const { page, close } = await openPassage(browser, dpr, 'normal', PAPER)
      try {
        await holdProgress(page, 0)
        await frameShot(page, testInfo, 'C-normal-dark')
        await record(page, testInfo, { ink: 'paper', ground: 'ink' })
      } finally {
        await close()
      }
    })

    test('C: normal alpha on paper', async ({ browser }, testInfo) => {
      const { page, close } = await openPassage(browser, dpr, 'normal', INK)
      try {
        await holdProgress(page, 0)
        await paperGround(page, true)
        await frameShot(page, testInfo, 'C-normal-paper')
        await record(page, testInfo, { ink: 'ink', ground: 'paper' })
      } finally {
        await close()
      }
    })

    for (const variant of ['halo', 'scan'] as const) {
      test(`D: the ${variant} alone`, async ({ browser }, testInfo) => {
        const { page, close } = await openPassage(browser, dpr, variant)
        try {
          await holdProgress(page, 0)
          await frameShot(page, testInfo, `D-${variant}`)
          await record(
            page,
            testInfo,
            variant === 'scan' ? { scanAt: SCAN_AT } : {}
          )
        } finally {
          await close()
        }
      })
    }

    /*
     * Row F, and the shipped plate held still for comparison. The scroll is
     * the reader's own wheel, smoothed by Lenis, so the pictures are taken
     * while the plate is turning; each carries the number of the GL frame on
     * screen when it was taken.
     */
    test('F: the shipped plate, moving and then at rest', async ({
      browser,
    }, testInfo) => {
      const { page, close } = await openPassage(browser, dpr, 'shipped')
      try {
        for (const [name, progress] of [
          ['F-shipped-held-0', 0],
          ['F-shipped-held-0.3', 0.3],
          ['F-shipped-held-0.6', 0.6],
        ] as const) {
          await holdProgress(page, progress)
          await frameShot(page, testInfo, name)
        }

        await page.evaluate(() => {
          const frame = document
            .querySelector('[data-passage-frame]')
            ?.getBoundingClientRect()
          const stamp = document.createElement('div')
          stamp.id = 'plate-matrix-frame'
          Object.assign(stamp.style, {
            position: 'fixed',
            left: `${(frame?.left ?? 0) + 8}px`,
            top: `${(frame?.top ?? 0) + 8}px`,
            zIndex: '2147483647',
            padding: '2px 6px',
            font: '12px/1.4 monospace',
            color: '#000',
            background: '#ff0',
            pointerEvents: 'none',
          })
          document.body.append(stamp)
        })
        await page.mouse.move(VIEWPORT.width / 2, VIEWPORT.height / 2)
        const moving: number[] = []
        for (let step = 1; step <= 6; step += 1) {
          await page.mouse.wheel(0, 90)
          moving.push(
            await page.evaluate(() => window.__plateMatrix?.frames ?? 0)
          )
          await frameShot(page, testInfo, `F-shipped-moving-${step}`)
        }
        await page.waitForTimeout(1500)
        await framesPass(page, 3)
        await frameShot(page, testInfo, 'F-shipped-stopped')
        await record(page, testInfo, { movingFrames: moving })
      } finally {
        await close()
      }
    })

    /*
     * Row G: the hero's `<h1>`. Observed only; `vault/blocks/hero` and
     * `vault/motion/text-reveal` belong to G1.
     */
    test('G: the hero headline, one layer at a time', async ({
      browser,
    }, testInfo) => {
      const headlineShot = async (page: Page, name: string) => {
        const clip = await page.evaluate(() => {
          const box = document
            .querySelector('[data-epic="hero-arrival"] h1')
            ?.getBoundingClientRect()
          return box
            ? {
                x: Math.max(0, box.left - 8),
                y: Math.max(0, box.top - 8),
                width: box.width + 16,
                height: box.height + 16,
              }
            : null
        })
        if (!clip) throw new Error('the hero has no headline to photograph')
        await write(testInfo, `${name}.png`, await page.screenshot({ clip }))
      }
      const addStyle = (page: Page, css: string) =>
        page.evaluate((text) => {
          const style = document.createElement('style')
          style.textContent = text
          document.head.append(style)
        }, css)

      const context = await browser.newContext({
        viewport: VIEWPORT,
        deviceScaleFactor: dpr,
      })
      const quiet = await browser.newContext({
        viewport: VIEWPORT,
        deviceScaleFactor: dpr,
        reducedMotion: 'reduce',
      })
      try {
        const page = await context.newPage()
        await page.goto('/id', { waitUntil: 'domcontentloaded' })

        /*
         * Moving: the first moment a split line is still below its mask.
         * SplitText gives its lines and masks no class here (its default
         * `linesClass` is empty), so a line is any `<div>` it put inside the
         * headline: the masks are the headline's children, the lines theirs.
         */
        const splitWhileMoving = await page
          .waitForFunction(
            () => {
              const lines = [
                ...document.querySelectorAll(
                  '[data-epic="hero-arrival"] h1 > div > div'
                ),
              ]
              const moving = lines.some((part) => {
                const { transform } = getComputedStyle(part)
                return transform !== 'none' && !/,\s*0\)$/u.test(transform)
              })
              return moving ? lines.length : false
            },
            undefined,
            { timeout: 15_000, polling: 16 }
          )
          .then(async (handle) => Number(await handle.jsonValue()))
          .catch(() => 0)
        const caught = splitWhileMoving > 0
        if (caught) await headlineShot(page, 'G-moving')

        await waitForEntrance(page)
        await page.waitForTimeout(2500)
        await headlineShot(page, 'G-settled')

        // What the headline is composited through, from itself up.
        const chain = await page.evaluate(() => {
          const facts: Record<string, string>[] = []
          let node = document.querySelector('[data-epic="hero-arrival"] h1')
          while (node instanceof HTMLElement) {
            const style = getComputedStyle(node)
            const fact: Record<string, string> = {}
            for (const property of [
              'filter',
              'backdrop-filter',
              'mix-blend-mode',
              'opacity',
              'transform',
              'will-change',
              'clip-path',
              'mask-image',
              'overflow',
            ]) {
              const value = style.getPropertyValue(property)
              if (
                value &&
                !['none', 'normal', '1', 'auto', 'visible'].includes(value)
              ) {
                fact[property] = value
              }
            }
            if (Object.keys(fact).length > 0) {
              fact.element = `${node.tagName.toLowerCase()}${node.className ? `.${String(node.className).split(' ').join('.')}` : ''}`
              facts.push(fact)
            }
            node = node.parentElement
          }
          // The masks SplitText wrapped the lines in: the headline's children.
          const split = document.querySelectorAll(
            '[data-epic="hero-arrival"] h1 > div'
          ).length
          return { split, facts }
        })

        // One at a time: the compositor layer `will-change` asks for, then
        // the masks and the settled transforms.
        await addStyle(
          page,
          '[data-epic="hero-arrival"] h1 { will-change: auto !important; }'
        )
        await page.waitForTimeout(300)
        await headlineShot(page, 'G-no-layer')
        await addStyle(
          page,
          '[data-epic="hero-arrival"] h1 * { overflow: visible !important; transform: none !important; }'
        )
        await page.waitForTimeout(300)
        await headlineShot(page, 'G-no-mask')

        // Never split: reduced motion renders the headline as plain text. The
        // canvas does not mount under it either, so the ground behind the
        // headline is the CSS fallback rather than the WebGL wash.
        const plain = await quiet.newPage()
        await plain.goto('/id', { waitUntil: 'domcontentloaded' })
        await waitForEntrance(plain)
        await plain.waitForTimeout(1000)
        await headlineShot(plain, 'G-unsplit')

        await write(
          testInfo,
          'facts.json',
          JSON.stringify(
            { viewport: VIEWPORT, dpr, caught, splitWhileMoving, ...chain },
            null,
            2
          )
        )
        // Anti-vacuum: the headline was split, while it moved or once it
        // settled. A reveal may hand the plain text back when it completes
        // (SplitText's `revert()`), so settled alone cannot be required.
        expect(
          Math.max(splitWhileMoving, chain.split),
          'the headline was never split, so G measured nothing'
        ).toBeGreaterThan(0)
      } finally {
        await context.close()
        await quiet.close()
      }
    })
  })
}

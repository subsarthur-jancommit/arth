import { writeFile } from 'node:fs/promises'

import type { Browser, Page, TestInfo } from '@playwright/test'
import { expect, test } from '@playwright/test'

import { waitForEntrance } from './page-settled'
import {
  WEBGL_ARRIVAL_MS,
  WEBGL_TEST_BUDGET_MS,
  webglIntent,
} from './webgl-intent'

/**
 * A plate as a reader meets it, photographed for review — G2.
 *
 * The same pictures on the PR that changes how the plates render and on the
 * one before it, so the owner can judge the change by looking: the home
 * page's passage and `/layanan`, at 1440 × 900 and 390 × 844, in Indonesian
 * and in English, at DPR 1 and DPR 2. They are kept in `test-results/`, which
 * CI uploads as the `playwright-report` artifact.
 *
 * Each picture is the state the page itself puts the plate in at that scroll
 * position; nothing is held. At 1440 the home page lights the first plate in
 * WebGL, which CI renders through SwiftShader (`CLAUDE.md` #19): fair for a
 * glyph's shape and for compositing, and no evidence of frame timing. At 390
 * every plate is the flat SVG.
 */

const VIEWPORTS = {
  desktop: { width: 1440, height: 900 },
  phone: { width: 390, height: 844 },
} as const

type Shape = keyof typeof VIEWPORTS

/** Fractions of the passage's pin where the first plate is photographed. */
const HOME_STOPS = [
  // Past the frame's settle; the first plate a third of the way through its
  // turn.
  ['turning', 0.16],
  // Its turn done, before the second plate arrives (at 0.32).
  ['turned', 0.3],
] as const

const PLATE_TEXT_UNITS = {
  label: 14.5,
  figure: 13,
  note: 12,
  title: 22,
} as const

async function write(testInfo: TestInfo, name: string, data: Buffer | string) {
  const target = testInfo.outputPath(name)
  await writeFile(target, data)
  await testInfo.attach(name, { path: target })
}

/** The first plate's drawing on screen, and what its words measure there. */
function drawingFacts(page: Page, scope: string) {
  return page.evaluate(
    ([selector, units]) => {
      const svg = document.querySelector(`${selector} svg[data-plate]`)
      const box = svg?.getBoundingClientRect()
      const view = svg instanceof SVGSVGElement ? svg.viewBox.baseVal : null
      const fit =
        box && view
          ? Math.min(box.width / view.width, box.height / view.height)
          : 0
      return {
        unit: svg?.getAttribute('data-plate') ?? null,
        box: box
          ? { width: Math.round(box.width), height: Math.round(box.height) }
          : null,
        fit: Math.round(fit * 1000) / 1000,
        textCssPx: Object.fromEntries(
          Object.entries(units).map(([role, size]) => [
            role,
            Math.round(size * fit * 100) / 100,
          ])
        ),
        lit: Boolean(svg?.closest('[data-plate-live]')),
        /** Words set in HTML beside the drawing, with their sizes. */
        html: [
          ...document.querySelectorAll(`${selector} [data-plate-key] li`),
        ].map((item) => ({
          text: item.textContent?.trim() ?? '',
          px: Number.parseFloat(getComputedStyle(item).fontSize),
        })),
      }
    },
    [scope, PLATE_TEXT_UNITS] as const
  )
}

async function open(browser: Browser, shape: Shape, dpr: number, path: string) {
  const context = await browser.newContext({
    viewport: VIEWPORTS[shape],
    deviceScaleFactor: dpr,
    ...(shape === 'phone' && { isMobile: true, hasTouch: true }),
  })
  const page = await context.newPage()
  await page.goto(path, { waitUntil: 'domcontentloaded' })
  await waitForEntrance(page)
  return { context, page }
}

for (const shape of ['desktop', 'phone'] as const) {
  for (const locale of ['id', 'en'] as const) {
    for (const dpr of [1, 2] as const) {
      const tag = `${shape}-${locale}-dpr${dpr}`

      test(`home: the first plate, ${tag}`, async ({ browser }, testInfo) => {
        test.setTimeout(WEBGL_TEST_BUDGET_MS)
        const { context, page } = await open(browser, shape, dpr, `/${locale}`)
        try {
          const intent = await webglIntent(page)
          const facts: Record<string, unknown> = { intent }
          // The pin is GSAP's, built once the page has hydrated.
          await page
            .locator('.pin-spacer > section[data-passage]')
            .waitFor({ state: 'attached', timeout: 15_000 })
            .catch(() => {
              // Reported by the check below.
            })
          for (const [name, fraction] of HOME_STOPS) {
            const pinned = await page.evaluate((at) => {
              const section = document.querySelector<HTMLElement>(
                'section[data-passage]'
              )
              const spacer = section?.parentElement
              if (!section || !spacer?.classList.contains('pin-spacer')) {
                return false
              }
              const top = spacer.getBoundingClientRect().top + window.scrollY
              const length = spacer.offsetHeight - section.offsetHeight
              window.scrollTo(0, Math.round(top + length * at))
              return true
            }, fraction)
            expect(pinned, 'the passage is not pinned').toBe(true)

            if (intent.intended) {
              await expect(
                page
                  .locator('[data-passage-plate] [data-plate-material]')
                  .first(),
                'the first plate was never lit'
              ).toHaveAttribute('data-plate-live', '', {
                timeout: WEBGL_ARRIVAL_MS,
              })
            }
            // The pin's half second of catch-up, and Lenis after it.
            await page.waitForTimeout(2000)

            const clip = await page.evaluate(() => {
              const box = document
                .querySelector('[data-passage-frame]')
                ?.getBoundingClientRect()
              return box
                ? {
                    x: box.left,
                    y: box.top,
                    width: box.width,
                    height: box.height,
                  }
                : null
            })
            expect(clip, 'the passage has no frame').not.toBeNull()
            if (!clip) return
            await write(
              testInfo,
              `home-${tag}-${name}.png`,
              await page.screenshot({ clip })
            )
            facts[name] = await drawingFacts(page, '[data-passage-plate]')
          }
          await write(
            testInfo,
            `home-${tag}.json`,
            JSON.stringify(facts, null, 2)
          )
        } finally {
          await context.close()
        }
      })

      test(`layanan: the first plate, ${tag}`, async ({
        browser,
      }, testInfo) => {
        const { context, page } = await open(
          browser,
          shape,
          dpr,
          `/${locale}/layanan`
        )
        try {
          const step = page.locator('li:has(svg[data-plate])').first()
          await expect(step, '/layanan shows no plate').toBeAttached()
          await step.scrollIntoViewIfNeeded()
          // The step's own reveal.
          await page.waitForTimeout(1500)
          await write(testInfo, `layanan-${tag}.png`, await step.screenshot())
          await write(
            testInfo,
            `layanan-${tag}.json`,
            JSON.stringify(
              await drawingFacts(page, 'li:has(svg[data-plate])'),
              null,
              2
            )
          )
        } finally {
          await context.close()
        }
      })
    }
  }
}

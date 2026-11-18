import type {
  Browser,
  BrowserContextOptions,
  Page,
  TestInfo,
} from '@playwright/test'
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
 * G3, the matte café in the home hero (`docs/RENCANA-VISUAL-GERAK.md`, the
 * reference's §5 path B and §6): `vault/webgl/cafe`, drawn from `lib/cafe`.
 *
 * Desktop project only: each test opens the size it is about.
 *
 * ## The screenshots, for the owner
 *
 * 1440 × 900 and 390 × 844, in Indonesian and English, in four states:
 * assembling, assembled, under reduced motion, and in a browser without
 * WebGL. At 1440 the café is the hero's art: WebGL draws it where the site
 * uses WebGL, and the still everywhere else. At 390 it follows the three
 * needs, as the still only (WebGL is a desktop's). Written to
 * `testInfo.outputPath()` and attached by path, so CI's `playwright-report`
 * artifact carries them under `test-results/`.
 *
 * "Assembling" is held, not caught: the WebGL café through
 * `data-cafe-assembly`, the still by pausing its CSS animations, both at
 * `HOLD` of the assembly. A software renderer draws a few frames a second,
 * and a picture timed to land mid-assembly would land anywhere.
 *
 * ## What is asserted
 *
 * The box holds its size through the hand-over; the canvas, once at rest,
 * draws no café again until asked; nothing is drawn off screen; a lost
 * context gives the still back and a restored one takes it again; the
 * reading layer does not move with the café; the still is whole under
 * reduced motion and without WebGL; on a phone the café follows the needs.
 */

const LOCALES = ['id', 'en'] as const

/** Where "assembling" is held, as a share of the assembly. */
const HOLD = 0.42

/** The assembly, in ms (`lib/cafe/assembly.ts` `ASSEMBLY_MS`). */
const ASSEMBLY_MS = 860

const HERO = '[data-cafe]'
const ASIDE = '[data-cafe-aside]'

declare global {
  interface Window {
    /** Layout shifts inside the art viewport, by start time. */
    __cafeShifts?: number[]
  }
}

const DESKTOP: BrowserContextOptions = {
  viewport: { width: 1440, height: 900 },
}
const PHONE: BrowserContextOptions = {
  viewport: { width: 390, height: 844 },
  deviceScaleFactor: 3,
  isMobile: true,
  hasTouch: true,
}

async function shoot(page: Page, testInfo: TestInfo, name: string) {
  const target = testInfo.outputPath(`${name}.png`)
  await page.screenshot({ path: target })
  await testInfo.attach(name, { path: target, contentType: 'image/png' })
}

/** The page loaded, its faces in, the entrance curtain gone. */
async function arrive(page: Page, path: string) {
  await page.goto(path, { waitUntil: 'domcontentloaded' })
  await waitForEntrance(page)
  await page.evaluate(async () => {
    await document.fonts.ready
  })
}

/** The still under `selector` has run its assembly through. */
async function stillAtRest(page: Page, selector: string) {
  await page.waitForFunction(
    (root) => {
      const svg = document.querySelector(`${root} svg`)
      if (!svg) return false
      return svg
        .getAnimations({ subtree: true })
        .every((animation) => animation.playState === 'finished')
    },
    selector,
    { timeout: 15_000 }
  )
}

/**
 * Holds the still's CSS assembly at `share` of its length: every animation
 * under it paused at the same moment, its own delay included.
 */
async function holdStill(page: Page, selector: string, share: number) {
  await page.waitForFunction(
    (root) => {
      const svg = document.querySelector(`${root} svg`)
      return !!svg && svg.getAnimations({ subtree: true }).length > 0
    },
    selector,
    { timeout: 15_000 }
  )
  await page.evaluate(
    ({ root, at }) => {
      const svg = document.querySelector(`${root} svg`)
      if (!svg) return
      const start = Number.parseFloat(
        getComputedStyle(svg).getPropertyValue('--cafe-start') || '0'
      )
      for (const animation of svg.getAnimations({ subtree: true })) {
        animation.pause()
        animation.currentTime = start + at
      }
    },
    { root: selector, at: share * ASSEMBLY_MS }
  )
}

/** A context of its own, in a browser with or without WebGL. */
async function open(
  browser: Browser,
  options: BrowserContextOptions
): Promise<{ page: Page; close: () => Promise<void> }> {
  const context = await browser.newContext(options)
  const page = await context.newPage()
  return { page, close: () => context.close() }
}

test.describe('the café, for the owner to look at', () => {
  for (const locale of LOCALES) {
    test(`/${locale} at 1440 × 900: assembling and assembled`, async ({
      browser,
    }, testInfo) => {
      test.setTimeout(WEBGL_TEST_BUDGET_MS)
      const { page, close } = await open(browser, DESKTOP)
      try {
        await arrive(page, `/${locale}`)
        const intent = await webglIntent(page)
        const hero = page.locator(HERO)
        if (intent.intended) {
          await waitForCanvas(page)
          await expect(hero).toHaveAttribute('data-cafe-live', '', {
            timeout: WEBGL_ARRIVAL_MS,
          })
          await hero.evaluate((node, at) => {
            node.setAttribute('data-cafe-assembly', String(at))
          }, HOLD)
          // A few frames of the shared loop, so the held pose is drawn.
          await page.waitForTimeout(1200)
          await page.mouse.move(1, 899)
          await shoot(page, testInfo, `cafe-1440-${locale}-assembling`)
          await hero.evaluate((node) => {
            node.removeAttribute('data-cafe-assembly')
          })
          await page.waitForTimeout(1200)
        } else {
          // No WebGL here: the still is the café, so the still is held.
          await stillAtRest(page, HERO)
          await hero.evaluate((node) => {
            node.dispatchEvent(new CustomEvent('cafe:assemble'))
          })
          await holdStill(page, HERO, HOLD)
          await shoot(page, testInfo, `cafe-1440-${locale}-assembling`)
          await page.evaluate((root) => {
            for (const animation of document
              .querySelector(`${root} svg`)
              ?.getAnimations({ subtree: true }) ?? []) {
              animation.finish()
            }
          }, HERO)
        }
        await expect(hero).toHaveAttribute('data-cafe-state', 'assembled', {
          timeout: 15_000,
        })
        await page.mouse.move(1, 899)
        await shoot(page, testInfo, `cafe-1440-${locale}-assembled`)
        testInfo.annotations.push({
          type: 'path',
          description: intent.intended ? 'webgl' : intent.reason,
        })
      } finally {
        await close()
      }
    })

    test(`/${locale} at 1440 × 900: reduced motion`, async ({
      browser,
    }, testInfo) => {
      const { page, close } = await open(browser, {
        ...DESKTOP,
        reducedMotion: 'reduce',
      })
      try {
        await arrive(page, `/${locale}`)
        await shoot(page, testInfo, `cafe-1440-${locale}-reduced-motion`)
      } finally {
        await close()
      }
    })

    test(`/${locale} at 1440 × 900: no WebGL`, async ({
      playwright,
    }, testInfo) => {
      const own = await playwright.chromium.launch({
        args: ['--disable-webgl'],
      })
      try {
        const { page } = await open(own, DESKTOP)
        await arrive(page, `/${locale}`)
        expect(
          await page.evaluate(
            () => !!document.createElement('canvas').getContext('webgl2')
          ),
          'the browser started with --disable-webgl still offers WebGL2'
        ).toBe(false)
        await stillAtRest(page, HERO)
        await page.mouse.move(1, 899)
        await shoot(page, testInfo, `cafe-1440-${locale}-no-webgl`)
      } finally {
        await own.close()
      }
    })

    test(`/${locale} at 390 × 844: the four states`, async ({
      browser,
      playwright,
    }, testInfo) => {
      test.setTimeout(WEBGL_TEST_BUDGET_MS)
      const toAside = async (page: Page) => {
        await page.locator(ASIDE).evaluate((node) => {
          const top = node.getBoundingClientRect().top + window.scrollY
          window.scrollTo(0, top - (window.innerHeight - node.clientHeight) / 2)
        })
      }

      const plain = await open(browser, PHONE)
      try {
        await arrive(plain.page, `/${locale}`)
        await toAside(plain.page)
        await holdStill(plain.page, ASIDE, HOLD)
        await shoot(plain.page, testInfo, `cafe-390-${locale}-assembling`)
        await plain.page.evaluate((root) => {
          for (const animation of document
            .querySelector(`${root} svg`)
            ?.getAnimations({ subtree: true }) ?? []) {
            animation.finish()
          }
        }, ASIDE)
        await stillAtRest(plain.page, ASIDE)
        await shoot(plain.page, testInfo, `cafe-390-${locale}-assembled`)
      } finally {
        await plain.close()
      }

      const reduced = await open(browser, { ...PHONE, reducedMotion: 'reduce' })
      try {
        await arrive(reduced.page, `/${locale}`)
        await toAside(reduced.page)
        await reduced.page.waitForTimeout(400)
        await shoot(reduced.page, testInfo, `cafe-390-${locale}-reduced-motion`)
      } finally {
        await reduced.close()
      }

      const own = await playwright.chromium.launch({
        args: ['--disable-webgl'],
      })
      try {
        const { page } = await open(own, PHONE)
        await arrive(page, `/${locale}`)
        await toAside(page)
        await stillAtRest(page, ASIDE)
        await shoot(page, testInfo, `cafe-390-${locale}-no-webgl`)
      } finally {
        await own.close()
      }
    })
  }
})

test.describe('the café in WebGL', () => {
  test('hands over without moving, then draws itself only when asked', async ({
    browser,
  }) => {
    test.setTimeout(WEBGL_TEST_BUDGET_MS * 2)
    const { page, close } = await open(browser, DESKTOP)
    try {
      await page.addInitScript(installWebglProbe)
      await arrive(page, '/id')
      const intent = await webglIntent(page)
      test.skip(!intent.intended, intent.reason)

      const hero = page.locator(HERO)
      /*
       * Layout shifts inside the art viewport, from here to the hand-over:
       * the faces are in and the entrance is over, so a shift here is the
       * café's own, not a font's.
       */
      const watching = await page.evaluate(() => {
        const shifts: number[] = []
        window.__cafeShifts = shifts
        new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) {
            const sources =
              (
                entry as PerformanceEntry & {
                  sources?: { node?: Node | null }[]
                }
              ).sources ?? []
            if (
              sources.some(
                (source) =>
                  source.node instanceof Element &&
                  source.node.closest('[data-art-viewport]') !== null
              )
            ) {
              shifts.push(entry.startTime)
            }
          }
        }).observe({ type: 'layout-shift' })
        return !document.querySelector('[data-cafe][data-cafe-live]')
      })
      const before = await hero.boundingBox()
      await waitForCanvas(page)
      await expect(
        hero,
        'the café never handed over to the canvas'
      ).toHaveAttribute('data-cafe-live', '', { timeout: WEBGL_ARRIVAL_MS })
      await expect(hero).toHaveAttribute('data-cafe-state', 'assembled')
      // The still steps aside by opacity, keeping its box.
      await expect
        .poll(() =>
          hero.locator('svg').evaluate((svg) => getComputedStyle(svg).opacity)
        )
        .toBe('0')
      const after = await hero.boundingBox()
      expect(
        [after?.width, after?.height],
        'the box changed size through the hand-over'
      ).toEqual([before?.width, before?.height])
      if (watching) {
        expect(
          await page.evaluate(() => window.__cafeShifts?.length ?? 0),
          'a layout shift inside the art viewport during the hand-over'
        ).toBe(0)
      } else {
        test.info().annotations.push({
          type: 'layout shift',
          description: 'the café was live before the observer started',
        })
      }
      expect(
        await page.evaluate(() => [...(window.__gl?.liveKinds() ?? [])]),
        'no café drawn on the canvas'
      ).toContain('cafe')

      // At rest: the quad is shown every frame, the café is not drawn again.
      await page.evaluate(() => window.__gl?.clear())
      await page.waitForTimeout(1500)
      const atRest = await page.evaluate(() => [
        ...(window.__gl?.liveKinds() ?? []),
      ])
      expect(atRest, 'the café is not on screen at rest').toContain('cafe')
      expect(
        atRest,
        'the café was drawn again while nothing about it changed'
      ).not.toContain('cafe-model')

      // Asked to assemble: it plays in WebGL, and arrives.
      await page.evaluate(() => window.__gl?.clear())
      await hero.evaluate((node) => {
        node.dispatchEvent(new CustomEvent('cafe:assemble'))
      })
      await expect(hero).toHaveAttribute('data-cafe-state', 'assembling')
      await expect(hero).toHaveAttribute('data-cafe-state', 'assembled', {
        timeout: 15_000,
      })
      expect(
        await page.evaluate(() => [...(window.__gl?.liveKinds() ?? [])]),
        'the assembly drew no café'
      ).toContain('cafe-model')

      // The reading layer holds still while the café is mid-assembly.
      const reading = () =>
        page.evaluate(() =>
          ['main h1', 'main h1 ~ p', 'main a[data-press="cta"]'].map(
            (selector) => {
              const box = document
                .querySelector(selector)
                ?.getBoundingClientRect()
              return box ? [box.x, box.y, box.width, box.height] : null
            }
          )
        )
      const rest = await reading()
      await hero.evaluate((node) =>
        node.setAttribute('data-cafe-assembly', '0.3')
      )
      await page.waitForTimeout(800)
      expect(await reading(), 'the reading layer moved with the café').toEqual(
        rest
      )
      await hero.evaluate((node) => node.removeAttribute('data-cafe-assembly'))

      // Off screen: neither the café nor its quad is drawn.
      await page.evaluate(() => window.scrollTo(0, window.innerHeight * 2.5))
      await page.waitForTimeout(800)
      await page.evaluate(() => window.__gl?.clear())
      await page.waitForTimeout(1000)
      const away = await page.evaluate(() => [
        ...(window.__gl?.liveKinds() ?? []),
      ])
      expect(away, 'the café was drawn off screen').not.toContain('cafe')
      expect(away).not.toContain('cafe-model')

      // A lost context gives the still back; a restored one takes it again.
      await page.evaluate(() => window.scrollTo(0, 0))
      await page.waitForTimeout(800)
      expect(
        await page.evaluate(() => window.__gl?.lose() ?? false),
        'there was no live context to lose'
      ).toBe(true)
      await expect(hero).not.toHaveAttribute('data-cafe-live', {
        timeout: 5000,
      })
      await expect
        .poll(() =>
          hero.locator('svg').evaluate((svg) => getComputedStyle(svg).opacity)
        )
        .toBe('1')
      await page.evaluate(() => window.__gl?.clear())
      expect(await page.evaluate(() => window.__gl?.restore() ?? false)).toBe(
        true
      )
      await expect(
        hero,
        'the restored context never drew the café'
      ).toHaveAttribute('data-cafe-live', '', { timeout: WEBGL_ARRIVAL_MS })
      expect(
        await page.evaluate(() => [...(window.__gl?.liveKinds() ?? [])])
      ).toEqual(expect.arrayContaining(['cafe', 'cafe-model']))
    } finally {
      await close()
    }
  })
})

test.describe('the café without WebGL', () => {
  test('under reduced motion it is whole at once, and does not move', async ({
    browser,
  }) => {
    const { page, close } = await open(browser, {
      ...DESKTOP,
      reducedMotion: 'reduce',
    })
    try {
      await page.goto('/id', { waitUntil: 'domcontentloaded' })
      const still = page.locator(`${HERO} svg`)
      await expect(still).toBeVisible()
      const facts = await still.evaluate((svg) => ({
        opacity: getComputedStyle(svg).opacity,
        polygons: svg.querySelectorAll('polygon').length,
        running: svg
          .getAnimations({ subtree: true })
          .filter((animation) => animation.playState === 'running').length,
        hidden: [...svg.querySelectorAll('g')].filter(
          (group) => Number(getComputedStyle(group).opacity) < 1
        ).length,
      }))
      expect(facts.opacity).toBe('1')
      expect(facts.polygons).toBeGreaterThan(100)
      expect(facts.running, 'the still animates under reduced motion').toBe(0)
      expect(facts.hidden, 'part of the still is left hidden').toBe(0)
      expect(await page.locator('canvas').count()).toBe(0)
    } finally {
      await close()
    }
  })

  test('without WebGL the still is the café, assembled and whole', async ({
    playwright,
  }) => {
    const own = await playwright.chromium.launch({ args: ['--disable-webgl'] })
    try {
      const { page } = await open(own, DESKTOP)
      await arrive(page, '/id')
      await stillAtRest(page, HERO)
      const hero = page.locator(HERO)
      await expect(hero).toHaveAttribute('data-cafe-state', 'assembled')
      await expect(hero).toHaveAttribute('data-cafe-settled', '')
      expect(await page.locator('canvas').count()).toBe(0)
      expect(
        await hero
          .locator('svg')
          .evaluate((svg) => [
            getComputedStyle(svg).opacity,
            [...svg.querySelectorAll('g')].filter(
              (group) => Number(getComputedStyle(group).opacity) < 1
            ).length,
          ])
      ).toEqual(['1', 0])
    } finally {
      await own.close()
    }
  })

  test('on a phone it follows the three needs, and the hero leaves it out', async ({
    browser,
  }) => {
    const { page, close } = await open(browser, PHONE)
    try {
      await arrive(page, '/id')
      const order = await page.evaluate(() => {
        const top = (selector: string) => {
          const node = document.querySelector(selector)
          return node && node.getClientRects().length > 0
            ? node.getBoundingClientRect().top + window.scrollY
            : null
        }
        return {
          needs: top('[data-need-chooser]'),
          aside: top('[data-cafe-aside]'),
          art: top('[data-art-viewport]'),
          sideways: document.documentElement.scrollWidth - window.innerWidth,
        }
      })
      expect(order.art).toBeNull()
      expect(order.aside).not.toBeNull()
      expect(order.aside ?? 0).toBeGreaterThan(order.needs ?? 0)
      expect(order.sideways).toBeLessThanOrEqual(0)
    } finally {
      await close()
    }
  })
})

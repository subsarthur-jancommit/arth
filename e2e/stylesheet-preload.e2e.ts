import { expect, test } from '@playwright/test'

import { FEATURED_WORK } from './fixtures'

/**
 * No page downloads a stylesheet it already carries inline. The owner's
 * "Ya, perbaiki", for the second of three findings left after #86.
 *
 * ## The defect this exists for
 *
 * #80 turned on `experimental.inlineCss`. Each page's CSS arrives inside its
 * HTML, in one `<style data-precedence data-href="a.css b.css …">`. React's
 * stylesheet dedupe never reads that element: `preload()` and its stylesheet
 * resources look only for `<link>` elements with the same `href`. So when the
 * router prefetches a linked route that shares those files, and every page
 * links routes that share its layout's CSS, React preloads them as if they
 * were missing, and the browser downloads CSS the page has already applied.
 *
 * Measured in CI on `/en/work`, in main #308's trace: five of the six inlined
 * files were fetched again 1.9 s after navigation, together with the link
 * prefetches. Chrome answered each with "preloaded using link preload but
 * not used within a few seconds". On a phone those bytes share the
 * connection with the fonts the first screen is waiting for.
 *
 * ## How it is asked
 *
 * Each route is loaded and left alone until its prefetches have run, with
 * every stylesheet request and Chrome's warning recorded. A stylesheet named
 * in the page's own inline `data-href` must never be requested, and no
 * stylesheet may be preloaded and left unused. Each route must show that a
 * prefetch happened and that its CSS is inline, or the run proves nothing.
 */

/*
 * The red proof (#90, run 43579872514) failed on `/id/work` alone: it links
 * its own filter views, which share every page-level file it inlines. `/id`
 * and `/id/konstruksi` passed, since nothing they prefetched shared their
 * files in that run. A work page links its sibling works, which share its
 * template's files, so it is asked as well; it was added with the fix.
 */
const ROUTES = [
  '/id',
  '/id/work',
  '/id/konstruksi',
  `/id/work/${FEATURED_WORK}`,
] as const

/**
 * Time left for prefetches and Chrome's check once the network has gone quiet.
 * Chrome warns about an unused preload "within a few seconds" of `load`.
 */
const AFTER_IDLE_MS = 5000

test.describe('inline CSS is not downloaded again', () => {
  for (const route of ROUTES) {
    test(`${route}: no stylesheet the page carries inline is fetched, and none is preloaded unused`, async ({
      page,
    }) => {
      const stylesheets: string[] = []
      let prefetches = 0
      const unused: string[] = []
      page.on('request', (request) => {
        const url = new URL(request.url())
        if (url.pathname.endsWith('.css')) stylesheets.push(url.pathname)
        if (url.searchParams.has('_rsc')) prefetches += 1
      })
      page.on('console', (message) => {
        const text = message.text()
        if (
          /preloaded using link preload but not used/.test(text) &&
          /\.css\b/.test(text)
        ) {
          unused.push(text)
        }
      })

      await page.goto(route, { waitUntil: 'load' })
      await page.waitForLoadState('networkidle')
      await page.waitForTimeout(AFTER_IDLE_MS)

      const inlined = await page.evaluate(() =>
        [...document.querySelectorAll('style[data-href]')].flatMap((style) =>
          (style.getAttribute('data-href') ?? '').split(' ').filter(Boolean)
        )
      )
      expect(
        inlined.length,
        `${route}: no inline CSS at all, so this gate's premise (experimental.inlineCss) is gone`
      ).toBeGreaterThan(0)
      expect(
        prefetches,
        `${route}: the router prefetched nothing, so the case under test never arose`
      ).toBeGreaterThan(0)

      const inline = new Set(inlined)
      expect(
        [...new Set(stylesheets.filter((path) => inline.has(path)))],
        `${route}: downloaded again stylesheets the page already applies inline`
      ).toEqual([])
      expect(unused, `${route}: stylesheets preloaded and never used`).toEqual(
        []
      )
    })
  }
})

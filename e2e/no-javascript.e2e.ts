import type { Browser } from '@playwright/test'
import { expect, test } from '@playwright/test'

import { UNITS } from '../lib/content/units'
import { routing } from '../lib/i18n/routing'

/**
 * The pages that must be readable with JavaScript switched off.
 *
 * Roadmap §1.5 lists this as an exit criterion and Tahap 3 marked it passed.
 * It was not passing — it was untested against content. With a seeded dataset
 * the home page rendered **28 characters**: "Skip to main content Loading".
 * The real markup was in the DOM, inside a `<div hidden>` that only an inline
 * script reveals, so a crawler that does not execute JavaScript saw one word.
 * The header was hidden too.
 *
 * The cause was a single `app/[locale]/loading.tsx`, which put a Suspense
 * boundary around every localized route including the ones that read no
 * request data at all. Moving it down to the segments that genuinely need it
 * took the home page from 28 characters to its full 1073.
 *
 * ## The catalogue is covered here now, and that took a route change
 *
 * Tahap 9 exempted `/work` and `/work/[slug]` from this file, on the grounds
 * that they read request data — `searchParams` and `draftMode()` — and
 * therefore had to keep a Suspense boundary. The exemption was honest about
 * the limitation and wrong about its necessity. Both reads were removable:
 *
 *   - `draftMode()` bought live preview of *unpublished* project edits, which
 *     `docs/PANDUAN-STUDIO.md` never taught and nothing depended on;
 *   - `searchParams` bought `?practice=`, now `?unit=`, and the three
 *     per-unit landing pages are static routes of their own.
 *
 * Measured before the change: `/en/work/arus-balik` 28 characters,
 * `/en/work` its heading plus the word *Loading* and not one project. After:
 * 498 and 513, byte-identical to the JavaScript-enabled render. This file is
 * what stops that regressing, so it asserts on **project links**, not only
 * character counts — a fallback that grew a paragraph would satisfy a length
 * check while still showing no work.
 */

/** Enough text that the page is demonstrably rendering content, not a shell. */
const MIN_CHARS = 400

/**
 * Renders `path` in a context with no JavaScript runtime and reports what a
 * crawler would actually see.
 */
async function renderWithoutJavaScript(browser: Browser, path: string) {
  const context = await browser.newContext({ javaScriptEnabled: false })
  const page = await context.newPage()
  try {
    await page.goto(path, { waitUntil: 'domcontentloaded' })
    return await page.evaluate(() => {
      const text = (document.body.innerText || '').trim()
      return {
        chars: text.length,
        headings: document.querySelectorAll('h1').length,
        heading: document.querySelector('h1')?.textContent?.trim() ?? '',
        // Links into a project detail page — the catalogue's actual payload.
        // The `/work/practice/…` exclusion that stood here is gone with the
        // route: nothing static sits under `/work/` any more.
        projectLinks:
          document.querySelectorAll<HTMLAnchorElement>('a[href*="/work/"]')
            .length,
        // The chip the server marked active. Rendering this at all proves the
        // filter state came from the route rather than from a client effect.
        activeChip:
          document
            .querySelector('nav a[aria-current="true"]')
            ?.getAttribute('href') ?? null,
        // The sample-content label's attribute, counted rather than read:
        // `lib/content/sample-content.ts` owns the string, and a page that
        // lost the label without script is the failure this catches.
        sampleBlocks: document.querySelectorAll('[data-sample-content]').length,
        text: text.slice(0, 120),
      }
    })
  } finally {
    await context.close()
  }
}

test.describe('readable without JavaScript', () => {
  for (const locale of routing.locales) {
    test(`/${locale} renders its content server-side`, async ({ browser }) => {
      const rendered = await renderWithoutJavaScript(browser, `/${locale}`)

      expect(rendered.chars, `only rendered: ${rendered.text}`).toBeGreaterThan(
        MIN_CHARS
      )
      expect(rendered.headings, 'exactly one h1').toBe(1)
    })

    test(`/${locale}/work lists work server-side`, async ({ browser }) => {
      const rendered = await renderWithoutJavaScript(browser, `/${locale}/work`)

      expect(rendered.chars, `only rendered: ${rendered.text}`).toBeGreaterThan(
        MIN_CHARS
      )
      expect(rendered.headings, 'exactly one h1').toBe(1)
      // The assertion that matters. A Suspense fallback has a heading and
      // prose; it has no links to individual works.
      expect(
        rendered.projectLinks,
        `catalogue rendered no project links: ${rendered.text}`
      ).toBeGreaterThan(0)
    })
  }

  for (const unit of UNITS) {
    test(`/en/${unit} renders server-side`, async ({ browser }) => {
      /*
       * The unit's own page. It replaces the per-practice test that stood
       * here, which pointed at `/en/practice/<value>`.
       *
       * No `MIN_CHARS` floor, and the difference is deliberate rather than a
       * relaxation: the practice page carried a statement, and this page
       * carries a labelled sample block and an owner placeholder, because
       * Arthur's own unit statements are not written yet (F2-02 holds them,
       * F3-02 shows them). A character floor here would be a floor on how
       * much placeholder text the page must carry, which is not a property
       * worth defending. What is worth defending without JavaScript is that
       * the page renders, names itself once, and shows the label that says
       * the text is sample content — because a label that only appears with
       * script is a label that is missing exactly when the page looks most
       * finished.
       */
      const rendered = await renderWithoutJavaScript(browser, `/en/${unit}`)

      expect(rendered.headings, 'exactly one h1').toBe(1)
      expect(rendered.sampleBlocks, 'the sample-content label').toBeGreaterThan(
        0
      )
    })
  }

  test('a project page renders server-side', async ({ browser, request }) => {
    // Take a real slug from the sitemap rather than hardcoding one, so the
    // test does not silently pass against a dataset that no longer has it.
    const sitemap = await (await request.get('/sitemap.xml')).text()
    const match = sitemap.match(/<loc>[^<]*?(\/en\/work\/[^<]+)<\/loc>/)
    test.skip(!match, 'no published project in the sitemap to check')

    const rendered = await renderWithoutJavaScript(browser, match?.[1] ?? '')

    expect(rendered.chars, `only rendered: ${rendered.text}`).toBeGreaterThan(
      MIN_CHARS
    )
    expect(rendered.headings, 'exactly one h1').toBe(1)
  })
})

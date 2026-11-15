import { expect, type Page, test } from '@playwright/test'

import { localizedPath } from '../lib/i18n/paths'
import { ENGLISH_PAGES, R7_PAGES } from '../lib/i18n/public-locale-redirect'
import { type Locale, LOCALE_TAGS } from '../lib/i18n/routing'
import { markdownPathForRoute } from '../lib/seo/markdown-path'
import { indonesianWords, sameAsTwin } from './indonesian'

/**
 * R7's done-criterion, read off the rendered page: every `/en` page R7 has
 * opened (`ENGLISH_PAGES`) reads entirely in English. "Selesai bila setiap
 * halaman /en tayang seluruhnya dalam bahasa Inggris, tanpa campuran"
 * (`docs/RENCANA-REVISI-F3.md`).
 *
 * ## What is read
 *
 * Everything a reader sees or hears: every text node in the body, hidden ones
 * included (a closed menu opens, and a screen reader reads visually hidden
 * text), the `alt`, `aria-label`, `title`, `placeholder`, `aria-description`,
 * `aria-roledescription` and `aria-valuetext` of every element, the document
 * title, and the head's description and share-card text. Script, style and
 * `noscript` are not read. An element marked `lang="id-…"` is Indonesian by
 * declaration, and is left out: the language switcher's way back is the only
 * one today.
 *
 * ## Two checks
 *
 * `indonesianWords` finds Indonesian by its function words and the site's own
 * vocabulary (`e2e/indonesian.ts` records what that catches and misses).
 * `sameAsTwin` finds what slips past it, such as a short title with no function
 * word left untranslated, by comparing the page with its Indonesian twin: a
 * string of two words or more that reads the same on both is copy nobody
 * translated. The head stays out of the twin check, because the share card's
 * alt on the home page is the layout's own English on both twins; the word
 * check still reads it.
 *
 * ## What else an open page owes
 *
 * Its hreflang names both twins, the language switcher offers both from
 * either side, its Markdown mirror is English, and the English search index
 * lists it. Pages that are not open keep answering 307 to Indonesian, which
 * `e2e/awaiting-content.e2e.ts` asserts.
 */

interface Readable {
  where: string
  text: string
}

const ATTRIBUTES = [
  'alt',
  'aria-label',
  'title',
  'placeholder',
  'aria-description',
  'aria-roledescription',
  'aria-valuetext',
]

const HEAD_TEXT = [
  'meta[name="description"]',
  'meta[property="og:title"]',
  'meta[property="og:description"]',
  'meta[property="og:image:alt"]',
  'meta[name="twitter:title"]',
  'meta[name="twitter:description"]',
  'meta[name="twitter:image:alt"]',
]

/** Every string on the page a reader can see or hear, with where it was. */
async function readable(page: Page): Promise<Readable[]> {
  return page.evaluate(
    ({ attributes, head }) => {
      const found: { where: string; text: string }[] = []
      const tidy = (text: string | null | undefined) =>
        text?.replace(/\s+/g, ' ').trim() ?? ''
      const skipped = (element: Element) =>
        element.closest('script, style, noscript, template, [lang^="id"]') !==
        null

      const walker = document.createTreeWalker(
        document.body,
        NodeFilter.SHOW_TEXT
      )
      for (let node = walker.nextNode(); node; node = walker.nextNode()) {
        const parent = node.parentElement
        const text = tidy(node.textContent)
        if (!parent || !text || skipped(parent)) continue
        found.push({ where: `text in <${parent.localName}>`, text })
      }

      for (const element of document.body.querySelectorAll('*')) {
        if (skipped(element)) continue
        for (const name of attributes) {
          const text = tidy(element.getAttribute(name))
          if (text) {
            found.push({ where: `${name} on <${element.localName}>`, text })
          }
        }
      }

      found.push({ where: 'head <title>', text: tidy(document.title) })
      for (const selector of head) {
        for (const meta of document.head.querySelectorAll(selector)) {
          const text = tidy(meta.getAttribute('content'))
          if (text) found.push({ where: `head ${selector}`, text })
        }
      }
      return found
    },
    { attributes: ATTRIBUTES, head: HEAD_TEXT }
  )
}

/** The page's hreflang, as BCP 47 tag to path. */
async function hreflang(page: Page): Promise<Record<string, string>> {
  return page.evaluate(() =>
    Object.fromEntries(
      [
        ...document.head.querySelectorAll('link[rel="alternate"][hreflang]'),
      ].map((link) => [
        link.getAttribute('hreflang') ?? '',
        new URL(link.getAttribute('href') ?? '', location.href).pathname,
      ])
    )
  )
}

/** Loads a page and waits for its content, not for its motion. */
async function open(page: Page, path: string) {
  const response = await page.goto(path)
  expect(response?.status(), `${path} did not answer 200`).toBe(200)
  expect(new URL(page.url()).pathname, `${path} redirected`).toBe(path)
  await expect(page.locator('h1').first()).toBeAttached()
  // Client components render their words on hydration.
  await page.waitForTimeout(800)
}

test('every opened English page is one R7 translated', () => {
  // Anti-vacuum: a spec looping over an empty list passes.
  expect(ENGLISH_PAGES.length).toBeGreaterThan(0)
  for (const template of ENGLISH_PAGES) expect(R7_PAGES).toContain(template)
})

for (const template of ENGLISH_PAGES) {
  const english = localizedPath('en', template)
  const indonesian = localizedPath('id', template)
  const twins = { en: english, id: indonesian } satisfies Record<Locale, string>

  test.describe(english, () => {
    // Two full page loads per test, on CI's software renderer.
    test.describe.configure({ timeout: 90_000 })

    test('reads in English, with nothing Indonesian left', async ({ page }) => {
      await open(page, english)
      await expect(page.locator('html')).toHaveAttribute('lang', LOCALE_TAGS.en)

      const strings = await readable(page)
      // Anti-vacuum: a page that rendered nothing has nothing Indonesian.
      expect(
        strings.length,
        `${english} rendered almost nothing`
      ).toBeGreaterThan(20)

      const leftovers = strings.flatMap(({ where, text }) => {
        const words = indonesianWords(text)
        return words.length > 0
          ? [`${where}: "${text}" (${words.join(', ')})`]
          : []
      })
      expect(leftovers, `Indonesian on ${english}`).toEqual([])

      await open(page, indonesian)
      const twin = await readable(page)
      const untranslated = sameAsTwin(
        strings
          .filter(({ where }) => !where.startsWith('head'))
          .map(({ text }) => text),
        twin.map(({ text }) => text)
      )
      expect(
        untranslated,
        `${english} shares these strings with ${indonesian}`
      ).toEqual([])
    })

    for (const locale of ['en', 'id'] as const) {
      test(`${twins[locale]} names both twins and offers both`, async ({
        page,
      }) => {
        await open(page, twins[locale])

        expect(await hreflang(page)).toEqual({
          [LOCALE_TAGS.id]: indonesian,
          [LOCALE_TAGS.en]: english,
          'x-default': indonesian,
        })

        const sheet = page.locator('[data-epic="locale-sheet"]')
        await expect(sheet.locator('a')).toHaveCount(2)
        for (const each of ['en', 'id'] as const) {
          await expect(
            sheet.locator(`a[hreflang="${LOCALE_TAGS[each]}"]`)
          ).toHaveAttribute('href', twins[each])
        }
        await expect(
          sheet.locator(`a[hreflang="${LOCALE_TAGS[locale]}"]`)
        ).toHaveAttribute('aria-current', 'true')
      })
    }

    test('its Markdown mirror is English', async ({ request }) => {
      const path = markdownPathForRoute(english)
      const response = await request.get(path, { maxRedirects: 0 })
      expect(response.status(), path).toBe(200)
      expect(response.headers()['content-type']).toBe(
        'text/markdown; charset=utf-8'
      )

      /*
       * The page's own part: its title, the site line, what the page is, and
       * the English pages it lists. The documents listed after it are named
       * by their own titles, which are proper names in either language.
       */
      const body = await response.text()
      const pages = body.indexOf('\n## Pages\n')
      expect(pages, `${path} lists no pages`).toBeGreaterThan(0)
      const next = body.indexOf('\n## ', pages + 1)
      const own = next === -1 ? body : body.slice(0, next)
      expect(
        own.split('\n').filter((line) => indonesianWords(line).length > 0),
        `Indonesian in ${path}`
      ).toEqual([])
    })
  })
}

test('the English search index lists the open pages, in English', async ({
  request,
}) => {
  const response = await request.get('/en/search.json', { maxRedirects: 0 })
  expect(response.status()).toBe(200)

  const rows = (await response.json()) as {
    kind: string
    label: string
    description: string
    href: string
  }[]
  const pages = rows.filter(({ kind }) => kind !== 'project')
  expect(pages.map(({ href }) => href).sort()).toEqual(
    ENGLISH_PAGES.map((template) => localizedPath('en', template)).sort()
  )

  // A work's title is its name in either language ("Lantai Dua"); what the
  // row says about it is English.
  const leftovers = rows
    .flatMap((row) =>
      row.kind === 'project' ? [row.description] : [row.label, row.description]
    )
    .filter((text) => indonesianWords(text).length > 0)
  expect(leftovers).toEqual([])
})

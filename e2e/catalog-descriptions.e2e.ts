import { expect, test } from '@playwright/test'

/**
 * The machine surfaces describe a page the way its own head does.
 *
 * `/metode-kerja` and `/layanan-terpadu` read their meta description from
 * Sanity. `/llms.txt` and the search index used to print a sentence copied
 * into `lib/seo/route-catalog.ts` instead, and nothing compared the two:
 * `/metode-kerja` kept saying "menunggu tinjauan pemilik" for five days after
 * the page was approved (#35). Both surfaces now resolve the description with
 * the head's own rule on the head's own read (`lib/seo/route-descriptions.ts`),
 * so a Studio edit moves them together. This spec is what notices a surface
 * that stops doing so.
 *
 * Both pages discriminate: the catalog keeps no line of its own for them
 * (2026-10-23), so a surface that stops reading the head's description
 * prints none and fails here.
 *
 * ## Why only prerendered surfaces are compared
 *
 * The page, `/llms.txt` and `/id/search.json` are prerendered by one build
 * from the same cached read, so they agree whatever the Studio holds. The
 * Markdown mirror is rendered per request: a Studio publish between the build
 * and this spec would make it legitimately newer than the prerendered head,
 * and failing on that would be the red-on-a-Studio-edit this change exists to
 * avoid. `lib/seo/markdown-document.test.ts` holds the mirror to the rule.
 */

const HEAD_DESCRIBED_PAGES = [
  '/id/metode-kerja',
  '/id/layanan-terpadu',
] as const

/** Undoes the five escapes React writes into an attribute value. */
function unescapeAttribute(value: string): string {
  return value
    .replaceAll('&quot;', '"')
    .replaceAll('&#x27;', "'")
    .replaceAll('&lt;', '<')
    .replaceAll('&gt;', '>')
    .replaceAll('&amp;', '&')
}

test.describe('catalog descriptions follow the page head', () => {
  for (const path of HEAD_DESCRIBED_PAGES) {
    test(`${path}: /llms.txt and /id/search.json say what the head says`, async ({
      request,
    }) => {
      const page = await request.get(path, { maxRedirects: 0 })
      expect(page.status(), `${path} status`).toBe(200)
      const content = (await page.text()).match(
        /<meta name="description" content="([^"]*)"/
      )?.[1]
      // Anti-vacuum: a page with no description must not pass by comparing
      // two empty strings.
      expect(content, `${path} has no meta description`).toBeTruthy()
      const head = unescapeAttribute(content ?? '')

      const index: { href: string; description: string }[] = await (
        await request.get('/id/search.json')
      ).json()
      expect(
        index.find((entry) => entry.href === path)?.description,
        `/id/search.json row for ${path}`
      ).toBe(head)

      // `- [label](https://…/id/metode-kerja): description`, one line per page.
      const marker = `${path}): `
      const line = (await (await request.get('/llms.txt')).text())
        .split('\n')
        .find((candidate) => candidate.includes(marker))
      expect(line, `/llms.txt lists ${path}`).toBeDefined()
      expect(
        line?.slice(line.indexOf(marker) + marker.length),
        `/llms.txt line for ${path}`
      ).toBe(head)
    })
  }
})

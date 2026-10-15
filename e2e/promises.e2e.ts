import { expect, test } from '@playwright/test'

/**
 * `/en` and Arthur's untranslated English pages redirect to `/id` (K2, R0); the
 * journal is English, so it carries the English side of these checks.
 */
const LOCALE_SURFACES = ['/id', '/en/journal'] as const

/**
 * The site keeps the promises it makes about itself.
 *
 * Every assertion here corresponds to a sentence the codebase writes down and
 * then failed to honour. A broken promise is worse than a missing feature:
 * it makes someone else act on something untrue.
 *
 *   - `SITE.agentGuidance` told agents to browse /en/work. Soft-404.
 *   - The skip link said "Skip to main content". It moved nothing.
 *   - `lang="id-ID"` on pages whose every visible string was English.
 *
 * None of it was catchable by the gates in place: a soft-404 returns 200, a
 * skip link that does nothing still has the right `href`, and axe's
 * `html-has-lang` only checks the attribute exists.
 */

test.describe('URLs the site tells agents to visit', () => {
  test('every path named in the agent guidance resolves to a real page', async ({
    request,
  }) => {
    // The prose is the source of truth here on purpose: this is testing what
    // the site *says*, so reading it back out of the rendered page is the
    // point. A constant would let the two drift apart again.
    const guidance = await (await request.get('/llms.txt')).text()
    const paths = [
      ...guidance.matchAll(/(?:^|[\s(])(\/(?:en|id)\/[a-z0-9\-/]*)/gm),
    ]
      .map((match) => match[1] ?? '')
      .filter(Boolean)

    expect(
      paths.length,
      'agent guidance names no paths at all'
    ).toBeGreaterThan(0)

    for (const path of new Set(paths)) {
      const response = await request.get(path)
      expect(response.status(), `${path} status`).toBe(200)

      // A soft-404 answers 200 and renders the not-found view, so the status
      // alone proves nothing — which is exactly how /en/work passed for six
      // stages.
      const body = await response.text()
      expect(body, `${path} renders the 404 view`).not.toContain(
        'NEXT_HTTP_ERROR_FALLBACK;404'
      )
    }
  })
})

test.describe('the skip link', () => {
  for (const path of LOCALE_SURFACES) {
    test(`${path}: moves focus into main`, async ({ page }) => {
      await page.goto(path, { waitUntil: 'networkidle' })

      await page.keyboard.press('Tab')
      const focused = await page.evaluate(
        () => document.activeElement?.textContent?.trim() ?? ''
      )
      expect(
        focused.length,
        'first Tab should reach the skip link'
      ).toBeGreaterThan(0)

      await page.keyboard.press('Enter')

      // The assertion the old test never made. Checking `href` and visibility
      // passes on a link that does nothing at all.
      const landedInMain = await page.evaluate(() => {
        const main = document.getElementById('main-content')
        const active = document.activeElement
        return Boolean(
          main && active && (main === active || main.contains(active))
        )
      })

      expect(landedInMain, 'focus must land inside <main>').toBe(true)
    })
  }
})

test.describe('locale parity', () => {
  test('entity copy is stated in the language of the page', async ({
    request,
  }) => {
    /*
     * The half of a bilingual site a reader never sees.
     *
     * `lib/seo/site.ts` held one English string per fact until Tahap 10, so
     * `/id` shipped an English `<meta name="description">` and an English
     * `schema.org` `description` under `lang="id-ID"`. Nothing caught it: the
     * test above reads *visible* strings, and axe's `html-has-lang` only
     * checks the attribute exists.
     *
     * The assertion is that the two locales disagree, not that either says
     * something particular — a wording change should not break this, a
     * regression to one shared string must.
     */
    const read = async (path: string) => {
      const response = await request.get(path, { maxRedirects: 0 })
      expect(response.status(), `${path} redirected instead of rendering`).toBe(
        200
      )
      const html = await response.text()

      const meta = html.match(/<meta name="description" content="([^"]*)"/)?.[1]

      const organization = [
        ...html.matchAll(
          /<script type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/g
        ),
      ]
        .map((match) => JSON.parse(match[1] ?? '{}'))
        .find((node) => node['@type'] === 'Organization')

      return {
        meta,
        description: organization?.description as string | undefined,
        knowsAbout: JSON.stringify(organization?.knowsAbout),
      }
    }

    // Arthur's own pages have no public English address yet (K2, R0). The
    // journal index exists in both languages, so compare it.
    const en = await read('/en/journal')
    const id = await read('/id/journal')

    expect(en.meta, 'no meta description on /en').toBeTruthy()
    expect(en.description, 'no Organization description on /en').toBeTruthy()
    expect(en.knowsAbout, 'no knowsAbout on /en').toBeTruthy()

    expect(id.meta, 'meta description is not translated').not.toBe(en.meta)
    expect(id.description, 'schema.org description is not translated').not.toBe(
      en.description
    )
    expect(id.knowsAbout, 'knowsAbout is not translated').not.toBe(
      en.knowsAbout
    )

    // The `@id` must NOT move: it is the same studio in both languages, and
    // two ids would make two entities out of one.
    const organizationId = async (path: string) => {
      const html = await (await request.get(path)).text()
      return html.match(/"@id":"([^"]*#organization)"/)?.[1]
    }
    const englishId = await organizationId('/en/journal')
    const indonesianId = await organizationId('/id/journal')
    expect(englishId).toBeTruthy()
    expect(englishId).toBe(indonesianId)
  })
})

/**
 * Honesty about what the site does not yet know — Tahap 35.
 *
 * `CLAUDE.md` §Honesty says: if something was skipped or failed, say so
 * explicitly rather than quietly narrowing scope. These four assertions are
 * that rule pointed at the site's own published surfaces, and all four went
 * red against the site as it stood.
 */
test.describe('the site does not assert what it does not know', () => {
  /*
   * Reserved placeholder domains belong only on labeled human surfaces.
   * Publishing one as `schema.org/Organization.email` hands a machine a fact
   * it will index. Human-facing contact tests below require a visible note.
   */
  const MACHINE_SURFACES = ['/llms.txt', '/sitemap.xml'] as const

  for (const path of MACHINE_SURFACES) {
    test(`${path} publishes no reserved-TLD address`, async ({ request }) => {
      const body = await (await request.get(path)).text()

      // Anti-vacuum: an empty response must not pass.
      expect(body.length, `${path} returned nothing`).toBeGreaterThan(200)
      for (const domain of ['.example', '.invalid']) {
        expect(body, `${path} publishes a ${domain} address`).not.toContain(
          domain
        )
      }
      for (const placeholder of ['Example City', 'Kota Contoh']) {
        expect(body, `${path} publishes a dummy postal address`).not.toContain(
          placeholder
        )
      }
    })
  }

  for (const path of LOCALE_SURFACES) {
    test(`${path} JSON-LD publishes no reserved-TLD address`, async ({
      request,
    }) => {
      const response = await request.get(path, { maxRedirects: 0 })
      expect(response.status(), `${path} redirected`).toBe(200)
      const html = await response.text()
      const blocks = [
        ...html.matchAll(
          /<script type="application\/ld\+json">([\s\S]*?)<\/script>/g
        ),
      ].map((match) => match[1] ?? '')

      expect(blocks.length, 'no JSON-LD on the page').toBeGreaterThan(0)
      for (const block of blocks) {
        for (const domain of ['.example', '.invalid']) {
          expect(block, `JSON-LD publishes a ${domain} address`).not.toContain(
            domain
          )
        }
        for (const placeholder of ['Example City', 'Kota Contoh']) {
          expect(
            block,
            'JSON-LD publishes a dummy postal address'
          ).not.toContain(placeholder)
        }
      }
    })
  }

  /*
   * Owner decision P4 (`docs/RENCANA-REVISI-F3.md`), which reverses Tahap 35.
   *
   * Tahap 35 required a placeholder to be shown *with a label*. In practice
   * the labels were notes to the editor — "Ganti sebelum kontak Arthur
   * diterbitkan", a `NOTE:` prefix — printed three times on every page
   * (`docs/TINJAUAN-F01-F03.md` E6.5, E7.1). Now a placeholder is not shown at
   * all: the contact action points to the contact page until K5 names a real
   * channel, and an empty section is omitted.
   */
  const READER_PAGES = [
    '/id',
    '/id/konstruksi',
    '/id/konstruksi/pelaku-proyek',
    '/id/peekabo/jaringan',
    '/id/kontak',
  ] as const
  const EDITOR_NOTE =
    /NOTE:|\bdummy\b|\.invalid\b|\.example\b|Contoh No\.|Example Street|Kota Contoh|Ganti sebelum|setelah disusun di Sanity|disetujui untuk tayang|belum diterbitkan|Belum dibuka/i

  for (const path of READER_PAGES) {
    test(`${path} shows no placeholder and no note for the editor`, async ({
      page,
    }) => {
      await page.goto(path)
      await expect(page.getByRole('heading', { level: 1 })).toBeVisible()

      const text = await page.locator('body').innerText()
      // Anti-vacuum: a page that rendered nothing must not pass.
      expect(text.length, `${path} rendered almost nothing`).toBeGreaterThan(
        200
      )
      expect(text).not.toMatch(EDITOR_NOTE)
      await expect(page.locator('[data-placeholder-note]')).toHaveCount(0)
    })
  }

  test('the home page action leads to the contact page, not a dead address', async ({
    page,
  }) => {
    await page.goto('/id')
    const action = page.locator('#contact')
    await expect(action.locator('a[href="/id/kontak"]')).toHaveCount(1)
    await expect(action.locator('a[href^="mailto:"]')).toHaveCount(0)
  })

  /*
   * A 308 still answers 200 once the client follows it, which is why the
   * older assertion above passed while the guidance pointed at
   * `/en/work/practice/consulting` — a path that has redirected since the
   * route was renamed. Sending an agent to a redirect is stale guidance.
   */
  test('agent guidance names no path that redirects', async ({ request }) => {
    const guidance = await (await request.get('/llms.txt')).text()
    const paths = [
      ...guidance.matchAll(/(?:^|[\s(])(\/(?:en|id)\/[a-z0-9\-/]*)/gm),
    ]
      .map((match) => match[1] ?? '')
      .filter(Boolean)

    expect(paths.length).toBeGreaterThan(0)

    for (const path of new Set(paths)) {
      const response = await request.get(path, { maxRedirects: 0 })
      expect(
        response.status(),
        `${path} redirects; name the destination instead`
      ).toBeLessThan(300)
    }
  })
})

import { expect, test } from '@playwright/test'

/**
 * The site says what Arth actually does — measured on what it serves.
 *
 * ## Why served HTTP and not a source grep
 *
 * A grep over the repository can be satisfied by editing a comment. This
 * cannot: it reads the bytes a reader's browser and an answer engine receive.
 *
 * That distinction is not academic here. Twenty-seven files mentioned the old
 * vocabulary and only eleven carried a value; the rest were doc comments
 * explaining behaviour with the old domain as the example ("flashes white in
 * front of a painting", "`/work/mural`"). A source gate would have demanded
 * those be rewritten, which punishes documentation without protecting anyone.
 *
 * ## What it measured before Tahap 13
 *
 *   /en/ai      137        /id         84
 *   /en         113        /en/work    82
 *   /id/ai      109        /llms.txt   44
 *
 * and `knowsAbout` was five of five: "Commissioned artwork", "Mural painting",
 * "Acrylic painting", "Gouache painting", "Illustration". `/llms.txt` (and
 * the `/ai` machine view, until Tahap 84 removed it) exists to be trusted by
 * machines, so being wrong there is worse than being wrong in a paragraph a
 * person can discount.
 */

/**
 * Words this site no longer does.
 *
 * Two layers, both retired, both for the same reason: a machine surface that
 * still names them is making a claim about a business that does not exist.
 *
 *  - the *craft* vocabulary of the painting studio this was before Tahap 13;
 *  - the *practice* vocabulary of the agency it was before Arthur — the three
 *    practices were `consulting`, `ai-data` and `commission`, and F1-03
 *    retired their routes.
 *
 * Three words are deliberately **absent** from the practice half, and the
 * omissions are the interesting part:
 *
 *  - `commission` and `komisi`, because the content rules *require* a
 *    commission-disclosure sentence on any page that recommends a vendor,
 *    financier or insurer. Banning the word would ban the disclosure.
 *  - `pesanan`, which is ordinary Indonesian for an order — "pesanan masuk ke
 *    dapur tanpa lewat kasir" is one of the content rules' own examples of a
 *    sentence Arthur may write.
 *
 * `ai-data` is absent too, but only because `\b` does not bracket a hyphen
 * the way this pattern needs; `consulting` and `konsultasi` catch the same
 * drift on the surfaces below.
 */
const RETIRED = [
  'painting',
  'paintings',
  'mural',
  'murals',
  'illustration',
  'lukisan',
  'ilustrasi',
  'gouache',
  'guas',
  'acrylic',
  'akrilik',
  'artwork',
  'karya seni',
  // The practice vocabulary, retired in F1-03.
  'practice',
  'practices',
  'praktik',
  'consulting',
  'konsultasi',
]

const PATTERN = new RegExp(`\\b(${RETIRED.join('|')})\\b`, 'gi')

/**
 * The surfaces a machine takes as a claim about the business.
 *
 * **Scoped in the fork.** This list used to carry `/en`, `/id`, `/en/work`
 * and `/id/work` as well, which banned thirteen words from every human page —
 * a caption could not say "artwork", an essay could not say "illustration".
 * The fork (`docs/FORK.md`, step 5) keeps the ban where it is honesty rather
 * than copy-editing: `/llms.txt` and the sitemap here, and the JSON-LD in the
 * test below, which an answer engine acts on rather than reads.
 *
 * `/${locale}/ai` stood here after Tahap 84 removed that route — found in
 * Tahap 90. A removed route answers the site's soft-404 with a 200, so the
 * entry kept passing by scanning the "Page not found" view for retired words:
 * two tests that looked like they guarded the machine view and guarded the
 * 404 instead.
 */
const SURFACES = ['/llms.txt', '/sitemap.xml']

test.describe('vocabulary', () => {
  for (const path of SURFACES) {
    test(`${path} promises nothing the studio no longer does`, async ({
      request,
    }) => {
      const response = await request.get(path)
      expect(response.status(), `${path} did not respond`).toBe(200)

      const body = await response.text()
      // A page that failed to render would pass by having no words at all.
      expect(body.length, `${path} served almost nothing`).toBeGreaterThan(500)

      const found = body.match(PATTERN) ?? []
      const counted = [...new Set(found.map((word) => word.toLowerCase()))]
        .map(
          (word) =>
            `${word}×${found.filter((f) => f.toLowerCase() === word).length}`
        )
        .sort()

      expect(
        counted,
        `${path} still says: ${counted.join(', ')} (${found.length} in total)`
      ).toEqual([])
    })
  }

  test('the structured data advertises the practices', async ({ request }) => {
    /*
     * Checked apart from the sweep above, because this is the claim an answer
     * engine acts on rather than renders. A page can read correctly to a
     * person while its JSON-LD still describes a different business — the two
     * come from `lib/seo/site.ts` but through different fields.
     */
    const body = await (await request.get('/en')).text()

    const services = /"(?:makesOffer|hasOfferCatalog|knowsAbout)":\[[^\]]*\]/g
    const blocks = body.match(services) ?? []
    expect(blocks.length, 'no structured data to check').toBeGreaterThan(0)

    for (const block of blocks) {
      expect(
        block.match(PATTERN) ?? [],
        `structured data still describes a painting studio: ${block.slice(0, 160)}`
      ).toEqual([])
    }
  })
})

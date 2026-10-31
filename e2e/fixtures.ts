/**
 * The fixture slugs this suite navigates to by name.
 *
 * ## Why they are here and not typed out twenty times
 *
 * Tahap 13 renamed the six fixtures — the site had been seeded as a
 * commissioned-artwork studio and the sector is an agency — and eleven tests
 * across six files broke on hardcoded `arus-balik` and `arus-balik`. None of them
 * cared *which* work it was; they needed a detail page that exists.
 *
 * That is the same shape of problem `lib/content/practices.ts` solves for the
 * app: one list, many consumers. A future rename is one edit here.
 *
 * ## Why not derive every one from the sitemap
 *
 * Some tests should, and do — `media-edge.e2e.ts` walks every published work
 * precisely so it cannot pass against a dataset that no longer holds the slug
 * it was written for. But a test that needs *a particular shape* of work — the
 * square cover, a featured work that appears on the home page — cannot pick
 * one at random and still mean what it says. Those name it, and name it once.
 */

/**
 * A featured work, so it appears on the home page *and* in the catalogue.
 * The route morph is measured from `/en` to this page.
 */
export const FEATURED_WORK = 'arus-balik'

/**
 * The square cover — ratio 1.00, the boundary `isFullWidth()` turns on.
 * Kept as a named constant because a test that loses it stops testing the
 * boundary while still passing.
 */
export const SQUARE_WORK = 'bacaan-mesin'

/**
 * A work whose gallery clears `RUN_MINIMUM`, so it renders as the pinned
 * horizontal track rather than the twelve-column grid — Tahap 82.
 *
 * ## Why this had to become a third named shape
 *
 * `project-gallery` has had two layouts since Tahap 64 and, until the fixtures
 * carried four plates, only ever rendered one of them: the component's own
 * note said so — *"on today's fixtures the run never appears."* Raising every
 * project to four flipped **all six** to the track, and `project-spread.e2e.ts`
 * went red with "renders no artwork" on `FEATURED_WORK`, which is the route ten
 * files in this suite navigate to by name and every one of them was written
 * against the grid.
 *
 * So the dataset owes the suite one work of each shape, for the reason the
 * square cover is named above: a test that needs a particular shape cannot pick
 * one at random and still mean what it says. `FEATURED_WORK` keeps the grid;
 * this one takes the track.
 */
export const RUN_WORK = 'pusat-beban'

/**
 * Situation and work pages, by shape, for the sweeps R5 extended to them
 * (route-sweep, no-JavaScript, reduced motion).
 *
 * **These are production slugs, not fixtures.** The plan asks for fixtures
 * (F3-12), and none exist yet: e2e reads the live production dataset until
 * the separate `ci` dataset (F0-06) is set up by the owner. Each one is a
 * shape a test needs, checked against the published dataset on 2026-10-31:
 *
 * - a situation without the market filter (Teknologi, Kuliner);
 * - a situation with it (Konstruksi, the reader running projects);
 * - a work page with two packages, the honest sentence and the payment link
 *   (Teknologi), the one `route-status.e2e.ts` already names;
 * - a work page on the older steps and deliverables (no packages).
 */
export const SITUATION_ROUTES = [
  '/id/teknologi/siap-pakai/kuliner',
  '/id/konstruksi/pelaku-proyek/hulu-hilir',
] as const

export const WORK_ROUTES = [
  '/id/teknologi/siap-pakai/kuliner/bot-pesan-antar-whatsapp',
  '/id/konstruksi/pelaku-proyek/penyedia-instansi/pengadaan-papan-nama-signage-dan-papan-informasi',
] as const

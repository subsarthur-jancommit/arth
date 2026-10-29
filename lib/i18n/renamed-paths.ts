import { isLocale } from './routing'

/**
 * Addresses a page had before it was renamed, and the address it has now.
 *
 * ## Why these moved — R4 route names, 2026-10-30
 *
 * The owner asked for page addresses in "konteks yang formal", naming
 * `satu-klien-tiga-unit` as the example of what they should not be, and for
 * every page to stay reachable by a customer. A slogan is a poor address: it
 * cannot be guessed, it reads as a campaign line rather than a page, and it
 * ages with the campaign. Each new segment names what the page is.
 *
 * | before                 | now                    | the page                                   |
 * | ---------------------- | ---------------------- | ------------------------------------------ |
 * | `satu-klien-tiga-unit` | `layanan-terpadu`      | the three units in one order of work       |
 * | `cara-kami-dibayar`    | `ketentuan-pembayaran` | how Arthur is paid, written before work    |
 * | `cara-kerja`           | `metode-kerja`         | scope, price, target and report agreed     |
 * | `studio`               | `metode-kerja`         | the same page, under its address before F3 |
 *
 * ## Why a 308 at the proxy
 *
 * A link that was shared, printed or bookmarked keeps working, and a crawler
 * moves what it indexed to the new address instead of finding a 404. The
 * proxy runs before rendering, so the status is a real 308, for the reason
 * `lib/i18n/guessed-paths.ts` gives.
 *
 * `studio` was a page of its own that called `permanentRedirect`; it joins
 * this table so that one place knows every old address.
 *
 * The Markdown mirror moves with its page: `/id/cara-kerja.md` answers with
 * `/id/metode-kerja.md`, so an agent holding the old mirror finds the new one.
 */
export const RENAMED_SEGMENTS: ReadonlyMap<string, string> = new Map([
  ['satu-klien-tiga-unit', 'layanan-terpadu'],
  ['cara-kami-dibayar', 'ketentuan-pembayaran'],
  ['cara-kerja', 'metode-kerja'],
  ['studio', 'metode-kerja'],
])

const MARKDOWN = '.md'

/**
 * Where an old address lives now, or `null` to leave the path alone.
 *
 * Matches `/{locale}/{segment}` and its Markdown mirror only. None of these
 * pages had anything beneath it, so a deeper path is left to the router.
 */
export function renamedDestination(pathname: string): string | null {
  const parts = pathname.split('/').filter(Boolean)
  if (parts.length !== 2) return null

  const [maybeLocale, last] = parts
  if (!maybeLocale || !last || !isLocale(maybeLocale)) return null

  const markdown = last.endsWith(MARKDOWN)
  const segment = markdown ? last.slice(0, -MARKDOWN.length) : last
  const target = RENAMED_SEGMENTS.get(segment)
  if (!target) return null

  return `/${maybeLocale}/${target}${markdown ? MARKDOWN : ''}`
}

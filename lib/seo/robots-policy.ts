/**
 * Whether a deployment may be indexed, and the header that says it may not.
 *
 * Every route on this site serves labelled placeholder content while Arthur is
 * being built, so until real content ships nothing here should be indexed by a
 * search engine or harvested by an answer engine. Measured on the live site on
 * 2026-10-10: no `X-Robots-Tag` on any response and no `<meta name="robots">`
 * anywhere, so the placeholder site was fully indexable.
 *
 * ## Why an allowlist, and why it is empty
 *
 * One Vercel production deployment answers on more than one host — the
 * project's `*.vercel.app` alias and, later, a custom domain. A build-time
 * decision therefore cannot tell the final domain from the test one: both are
 * served by the same build. So the question "may this response be indexed?" is
 * answered per request, against a list of hosts that may be.
 *
 * The list lives in `INDEXABLE_HOSTS` and is **empty today**, because the final
 * domain has not been chosen. Empty means every host is noindex, which is the
 * safe direction: a host nobody listed is a host nobody vouched for.
 *
 * ## Dependency-free on purpose
 *
 * `next.config.ts` imports this by relative path, and Next's config loader
 * mis-resolves `@/*` aliases in anything it requires transitively — the same
 * constraint `lib/base-url.ts` documents and obeys. Nothing here may import.
 */

/** The response header that keeps a placeholder page out of an index. */
export const ROBOTS_HEADER = 'X-Robots-Tag'

/**
 * `nofollow` rides along with `noindex` deliberately. The pages link to each
 * other, so a crawler told only not to index would still walk the placeholder
 * site and spend its budget there.
 */
export const NOINDEX_VALUE = 'noindex, nofollow'

/**
 * AI answer-engine crawlers, refused by name in `robots.txt` while the site is
 * placeholder.
 *
 * Named rather than left to the `*` rule because several only honor a
 * directive addressed to them directly. `app/robots.ts` carries the full
 * reasoning — in short, search engines stay allowed because a crawler must be
 * able to fetch a page to see its `noindex`, while these are here to harvest
 * the text rather than index the URL, so refusing the fetch is the remedy.
 *
 * Lives here rather than in `app/robots.ts` so the gate that checks the
 * published file reads the same list the route emits, instead of a copy of it.
 */
export const AI_CRAWLERS = [
  'GPTBot',
  'OAI-SearchBot',
  'ChatGPT-User',
  'ClaudeBot',
  'Claude-User',
  'Claude-SearchBot',
  'PerplexityBot',
  'Google-Extended',
] as const

/**
 * One `missing` entry for `headers()` in `next.config.ts`.
 *
 * Re-declared rather than imported from Next's `RouteHas`, because this module
 * imports nothing (see the note above). Structurally identical, so TypeScript
 * accepts it where Next expects `RouteHas`.
 */
export interface HostCondition {
  type: 'host'
  value: string
}

/**
 * A host as `headers()` compares it: lower-case, no scheme, no path, no port,
 * no trailing dot. Returns `null` for anything that normalizes to nothing.
 *
 * Tolerant of a scheme and a port because the value is written by hand into an
 * environment variable, and `https://arth.example.com/` is the shape a person
 * copies out of a browser.
 */
export function normalizeHost(host: string | undefined | null): string | null {
  if (!host) return null

  const withoutScheme = host.trim().replace(/^https?:\/\//i, '')
  const withoutPath = withoutScheme.split('/')[0] ?? ''

  // IPv6 authorities are bracketed (`[::1]:3000`), so the colon that separates
  // the port is the one after `]` — splitting on the first colon would cut the
  // address in half.
  const closingBracket = withoutPath.indexOf(']')
  const withoutPort =
    withoutPath.startsWith('[') && closingBracket !== -1
      ? withoutPath.slice(0, closingBracket + 1)
      : (withoutPath.split(':')[0] ?? '')

  const normalized = withoutPort.toLowerCase().replace(/\.$/, '')

  return normalized === '' ? null : normalized
}

/**
 * The hosts that may be indexed, parsed from a comma-separated list.
 *
 * Unset, empty, or all-separators yields an empty list, and an empty list means
 * no host may be indexed.
 */
export function parseIndexableHosts(
  raw: string | undefined | null
): readonly string[] {
  if (!raw) return []

  const hosts = raw
    .split(',')
    .map((entry) => normalizeHost(entry))
    .filter((entry): entry is string => entry !== null)

  return [...new Set(hosts)]
}

/**
 * The `missing` conditions that make a header apply everywhere **except** the
 * indexable hosts.
 *
 * Next applies a `headers()` entry when every `has` matches and no `missing`
 * does, so one entry per indexable host reads as "this host is not any of
 * them". An empty list yields no conditions, and an entry with no conditions
 * applies to every request — which is what an empty allowlist should mean.
 *
 * Returned as a fresh array rather than a frozen one because `next.config.ts`
 * hands it straight to Next, which owns it from there.
 */
export function indexableHostConditions(
  raw: string | undefined | null
): HostCondition[] {
  return parseIndexableHosts(raw).map((value) => ({ type: 'host', value }))
}

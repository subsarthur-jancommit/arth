/**
 * The build a page was made from, read from what the build inlined.
 *
 * Pure, so the rules can be tested without a build: `next.config.ts` inlines
 * `NEXT_PUBLIC_COMMIT_SHA`, `NEXT_PUBLIC_BUILT_AT` and, when the provider
 * names it, `NEXT_PUBLIC_REPOSITORY_URL` on a Vercel build, and nothing
 * anywhere else.
 */

export interface BuildSource {
  /** The full commit hash. Absent outside a Vercel build. */
  sha?: string | undefined
  /** When the build ran, as ISO 8601. */
  builtAt?: string | undefined
  /** The repository's web address, without a trailing slash. */
  repository?: string | undefined
}

export interface Build {
  /** The hash as people quote it: its first seven characters. */
  short: string
  /** The commit's own page, or `null` when the repository is not known. */
  href: string | null
  /** The day the build ran, `YYYY-MM-DD` in UTC — the same on every screen. */
  day: string
  /** The instant, for `<time dateTime>`. */
  builtAt: string
}

/**
 * What the stamp says, or `null` when there is nothing true to say.
 *
 * A missing or malformed hash and an unreadable date both mean "not a build
 * we can name", and the stamp is then absent rather than wrong. The day is
 * taken in UTC and written as digits, so the server's render and the
 * reader's browser cannot disagree about it — a locale-formatted date can,
 * between two ICU versions, and that is a hydration mismatch in the footer of
 * every page.
 */
export function readBuild(source: BuildSource): Build | null {
  const sha = source.sha?.trim().toLowerCase()
  if (!sha || !/^[0-9a-f]{7,40}$/.test(sha)) return null

  const built = new Date(source.builtAt ?? '')
  if (Number.isNaN(built.getTime())) return null
  const instant = built.toISOString()

  const repository = source.repository?.trim().replace(/\/+$/, '')
  return {
    short: sha.slice(0, 7),
    href: repository ? `${repository}/commit/${sha}` : null,
    day: instant.slice(0, 10),
    builtAt: instant,
  }
}

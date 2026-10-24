/**
 * Structural keys for Peekabo's seller-network page.
 *
 * The reader-facing words live in the locale catalog. Keeping the shape here
 * makes the three paths and four-step money flow impossible to drift apart
 * between the page, tests, and the motion specification.
 */
export const NETWORK_PATH_KEYS = ['referrer', 'member', 'creator'] as const

export const NETWORK_MONEY_STEP_KEYS = [
  'refer',
  'buy',
  'partnerPays',
  'arthurPays',
] as const

export type NetworkPathKey = (typeof NETWORK_PATH_KEYS)[number]
export type NetworkMoneyStepKey = (typeof NETWORK_MONEY_STEP_KEYS)[number]

/**
 * Studio titles for `bab.jalurJaringan`: the path names the page shows, so an
 * editor picks the path by the words a reader sees.
 */
export const NETWORK_PATH_STUDIO_TITLES = {
  referrer: 'Rujuk transaksi',
  member: 'Jadi anggota',
  creator: 'Jadi kreator atau host',
} as const satisfies Record<NetworkPathKey, string>

/**
 * The chapter a path opens: the published one whose `jalurJaringan` names it.
 *
 * Paths used to take chapters by position, the first chapter to the first
 * path. While "Kreator, streamer, dan host" was the only chapter published,
 * that put it under "Rujuk transaksi" (found 2026-10-23). A chapter now says
 * which path it belongs to, and a path whose chapter is not published shows
 * its own description and no link.
 */
export function chapterForPath<T extends { networkPath: string | null }>(
  path: NetworkPathKey,
  chapters: readonly T[]
): T | undefined {
  return chapters.find((chapter) => chapter.networkPath === path)
}

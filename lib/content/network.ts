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

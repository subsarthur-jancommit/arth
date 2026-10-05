/**
 * `/.well-known/security.txt` (RFC 9116) — pure, so its fields can be tested
 * without a route.
 *
 * `SECURITY.md` already says how to report a vulnerability: privately,
 * through the repository's Security tab. A researcher who finds something on
 * the live site looks here first, and the site had nothing at this address
 * (it fell through to the 404). This states the same channel in the format
 * tools read. It invents no address: the contact is the repository's own
 * private-advisory form, the one `SECURITY.md` names.
 */

const REPOSITORY = 'https://github.com/subsarthur-jancommit/arth'

/** Where a report goes: the repository's private vulnerability reporting. */
export const SECURITY_CONTACT = `${REPOSITORY}/security/advisories/new`

/** The policy a reporter should read first. */
export const SECURITY_POLICY = `${REPOSITORY}/blob/main/SECURITY.md`

/**
 * RFC 9116 asks for an `Expires` under a year away. Measured from the build,
 * so every deploy renews it; a site left undeployed for a year says so.
 */
const MAX_AGE_MS = 364 * 24 * 60 * 60 * 1000

export interface SecurityTxtInput {
  /** Absolute URL this file is served at. */
  canonical: string
  /** When it is being built; `Expires` is counted from here. */
  now: Date
}

export function buildSecurityTxt({ canonical, now }: SecurityTxtInput): string {
  const expires = new Date(now.getTime() + MAX_AGE_MS)
    .toISOString()
    .replace(/\.\d{3}Z$/, 'Z')

  return [
    `Contact: ${SECURITY_CONTACT}`,
    `Expires: ${expires}`,
    `Policy: ${SECURITY_POLICY}`,
    `Preferred-Languages: en, id`,
    `Canonical: ${canonical}`,
    '',
  ].join('\n')
}

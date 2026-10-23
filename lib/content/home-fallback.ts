import { BRAND_NAME } from '@/lib/brand'
import { canRenderPublicContent } from '@/lib/content/public-content-guard'
import type { Locale } from '@/lib/i18n/routing'

/**
 * The placeholder contact until K5, and the resolver that reads
 * `siteSettings` for the home page, the footer, and the contact surfaces.
 *
 * ## No editorial copy here since V6
 *
 * This file used to carry a stand-in for the umbrella header: a headline, a
 * subline, the studio statement, the five labelled paragraphs, and the
 * fourteen situations, each shown whenever its `siteSettings` field was
 * empty. V6 of `docs/RENCANA-KONTEKS-V2.md` removed them: Sanity holds
 * Arthur's words, and a copy kept here could be revised in Studio without
 * the page ever changing, or outvote the Studio the day a field was emptied.
 * The home page now shows the not-found view without a published headline.
 * `lib/content/editorial-copy.test.ts` fails if those sentences come back.
 *
 * ## Why the contact placeholder stays
 *
 * It is not copy. The owner has not chosen a channel or a reply time yet
 * (K5), so every human surface needs an address that cannot reach a real
 * mailbox and says so, until `siteSettings` holds a real one.
 */

/**
 * The one placeholder contact, shared.
 *
 * Exported since Tahap 35. `components/layout/footer` had its own copy of the
 * same address and the same two bare domains — a third, after this file and
 * `lib/seo/site.ts` — and nothing tied them together, so a studio filling in
 * its real address would have found two of the three.
 *
 * `lib/seo/site.ts` no longer carries one at all: a reserved-TLD address is a
 * placeholder to a person and a fact to a crawler, so machine surfaces omit
 * it and every human surface labels it. The temporary `.invalid` value cannot
 * reach a real mailbox. `docs/stages/TAHAP-35.md` §3.1.
 */
export const FALLBACK_CONTACT = {
  name: BRAND_NAME,
  email: 'kontak@arth.invalid',
  address: {
    en: '0 Example Street, Example City, Indonesia',
    id: 'Jl. Contoh No. 00, Kota Contoh, Indonesia',
  },
  socials: [] as readonly { label: string; url: string }[],
} as const

/**
 * Whether an address is a placeholder rather than a mailbox: the reserved
 * `.invalid` TLD (RFC 2606) that {@link FALLBACK_CONTACT} uses until K5.
 */
export function isPlaceholderEmail(email: string): boolean {
  return /\.invalid$/i.test(email.trim())
}

export interface HomeContent {
  name: string
  /** The page's only `<h1>`, or `null` when `siteSettings` has none. */
  headline: string | null
  /** One sentence under it, or `null` when `siteSettings` has none. */
  subline: string | null
  email: string
  address: string
  socials: readonly { label: string; url: string }[]
  /** Portable Text from the CMS, or `null` when it has none. */
  statement: unknown[] | null
  /**
   * Which contact fields are this file's placeholder rather than the CMS's.
   *
   * Per field, because the resolution below is per field. It used to be one
   * boolean meaning "no `siteSettings` document exists at all", and that is
   * a different question: with a half-filled document present, the normal
   * state while a studio is onboarding, the flag read `false` while the
   * placeholder rendered anyway, so it shipped unlabelled.
   * `docs/stages/TAHAP-35.md` §2 has the measurement.
   */
  fallbacks: {
    email: boolean
    address: boolean
    socials: boolean
  }
}

/** A CMS string that is present and not merely an empty box an editor left. */
function usable(value: string | null | undefined): value is string {
  return typeof value === 'string' && value.trim() !== ''
}

/**
 * A field's value together with where it came from.
 *
 * The two have to be decided in one place. Deriving "did this fall back?"
 * from a separate `usable()` call is how the two drift, and drift here means
 * a page that renders scaffolding while reporting that it did not.
 */
function pick(
  cms: string | null | undefined,
  fallback: string
): { value: string; fromCms: boolean } {
  return usable(cms)
    ? { value: cms, fromCms: true }
    : { value: fallback, fromCms: false }
}

const RESERVED_PLACEHOLDER_TLDS = [
  'example',
  'invalid',
  'localhost',
  'test',
] as const

function isPublishableEmail(value: string | null | undefined): value is string {
  if (!usable(value)) return false

  const domain = value.slice(value.lastIndexOf('@') + 1).toLowerCase()
  return !RESERVED_PLACEHOLDER_TLDS.some(
    (tld) => domain === tld || domain.endsWith(`.${tld}`)
  )
}

/**
 * The CMS's words, and the contact placeholder per field.
 *
 * The headline, the subline, and the statement come from `siteSettings` or
 * not at all. The contact fields fall back independently to the placeholder,
 * because a half-filled document is the normal state until K5. An empty
 * string counts as absent: Sanity keeps `""` for a field an editor opened and
 * cleared, and treating that as content renders a blank heading.
 */
export function resolveHomeContent(
  locale: Locale,
  settings: {
    name?: string | null
    headline?: string | null
    subline?: string | null
    email?: string | null
    address?: string | null
    statement?: unknown[] | null
    socials?: readonly { label?: string; url?: string }[] | null
  } | null
): HomeContent {
  const safeSettings =
    settings &&
    canRenderPublicContent('site settings', [
      settings.name,
      settings.headline,
      settings.subline,
      settings.email,
      settings.address,
      JSON.stringify(settings.statement),
      ...(settings.socials?.flatMap((social) => [social.label, social.url]) ??
        []),
    ])
      ? settings
      : null

  const socials = (safeSettings?.socials ?? [])
    .filter(
      (social): social is { label: string; url: string } =>
        usable(social.label) && usable(social.url)
    )
    .map((social) => ({ label: social.label, url: social.url }))

  const name = pick(safeSettings?.name, FALLBACK_CONTACT.name)
  const headline = safeSettings?.headline
  const subline = safeSettings?.subline
  const cmsEmail = safeSettings?.email
  const email = isPublishableEmail(cmsEmail)
    ? { value: cmsEmail, fromCms: true }
    : { value: FALLBACK_CONTACT.email, fromCms: false }
  const cmsAddress = safeSettings?.address
  const isDummyAddress =
    !usable(cmsAddress) ||
    /(?:example|contoh|dummy|placeholder)/i.test(cmsAddress)
  const address = isDummyAddress
    ? { value: FALLBACK_CONTACT.address[locale], fromCms: false }
    : { value: cmsAddress, fromCms: true }
  const statement =
    safeSettings?.statement && safeSettings.statement.length > 0
      ? safeSettings.statement
      : null

  return {
    name: name.value,
    headline: usable(headline) ? headline : null,
    subline: usable(subline) ? subline : null,
    email: email.value,
    address: address.value,
    socials: socials.length > 0 ? socials : FALLBACK_CONTACT.socials,
    statement,
    fallbacks: {
      email: !email.fromCms,
      address: !address.fromCms,
      socials: socials.length === 0,
    },
  }
}

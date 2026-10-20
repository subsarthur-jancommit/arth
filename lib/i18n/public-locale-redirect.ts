import { UNITS } from '@/lib/content/units'

/**
 * First segments under `/en` whose pages carry Indonesian editorial content.
 *
 * K2 (`docs/PROGRES-ARTHUR.md`): English follows later, and an `/en` page
 * without a translation answers 307 to its `/id` twin. Until R0 only `/en`
 * itself did, so `/en/konstruksi` rendered English chrome around Indonesian
 * copy (`docs/TINJAUAN-F01-F03.md` C2).
 *
 * A denylist rather than "everything under `/en`": `/en/work` and
 * `/en/journal` are fully English and stay, and an unknown `/en/...` keeps its
 * own 404 instead of being bounced to an `/id` 404. A new Arthur route is
 * added here in the same change that adds the route.
 */
export const UNTRANSLATED_SEGMENTS: readonly string[] = [
  ...UNITS,
  'cara-kerja',
  'halaman',
  'kebijakan',
  'kontak',
  'satu-klien-tiga-unit',
]

/** The `/id` twin of an untranslated English path, or `null` to leave it. */
export function publicLocaleRedirect(pathname: string): string | null {
  if (pathname === '/en' || pathname === '/en/') return '/id'

  const match = /^\/en(\/([^/]+)(?:\/.*)?)$/.exec(pathname)
  if (!match) return null

  const [, rest, segment] = match
  return segment && UNTRANSLATED_SEGMENTS.includes(segment)
    ? `/id${rest}`
    : null
}

import { isLocale, PUBLISHED_LOCALES, type Locale } from '@/lib/i18n/routing'

/**
 * Languages that are useful to show in the current page's switcher.
 *
 * A public Indonesian page does not advertise English until its editorial
 * copy is approved. An English preview or old deep link still needs a visible
 * route back to the approved Indonesian page, though. The accepted cost is an
 * asymmetric control while only one language is public: EN can leave for ID,
 * while ID does not promise an EN destination that is not ready.
 */
export function localesForLanguageSwitcher(
  activeLocale: string
): readonly Locale[] {
  const published: readonly Locale[] = PUBLISHED_LOCALES

  if (published.length > 1) return published
  if (isLocale(activeLocale) && published.includes(activeLocale)) return []

  return published
}

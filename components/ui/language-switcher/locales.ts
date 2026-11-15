import { ENGLISH_PAGES, isEnglishPage } from '@/lib/i18n/public-locale-redirect'
import { isLocale, PUBLISHED_LOCALES, type Locale } from '@/lib/i18n/routing'

/**
 * Languages that are useful to show in the current page's switcher.
 *
 * A page whose English is open (`ENGLISH_PAGES`, R7) offers both languages,
 * from either side: both are real destinations, and the English one is served
 * rather than redirected.
 *
 * Every other public Indonesian page offers nothing. It does not advertise
 * English until that page's English is approved and open, and a switcher with
 * no choice in it is noise. An English page that is not open (an old deep
 * link, a draft preview, `/en/work`) still needs a visible route back to the
 * approved Indonesian page, though. The accepted cost is an asymmetric control
 * there: EN can leave for ID, while ID does not promise an EN destination that
 * is not ready.
 *
 * `englishPages` is a parameter only so tests can open pages; the switcher
 * uses the default.
 */
export function localesForLanguageSwitcher(
  activeLocale: string,
  template: string,
  englishPages: readonly string[] = ENGLISH_PAGES
): readonly Locale[] {
  const published: readonly Locale[] = PUBLISHED_LOCALES

  if (published.length > 1) return published
  if (isEnglishPage(template, englishPages)) return [...published, 'en']
  if (isLocale(activeLocale) && published.includes(activeLocale)) return []

  return published
}

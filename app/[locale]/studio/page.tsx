import { permanentRedirect } from 'next/navigation'
import { locale as localeRootParam } from 'next/root-params'

import { isLocale, routing } from '@/lib/i18n/routing'

/** Keep the old public address as a permanent, locale-preserving redirect. */
export default async function LegacyStudioPage() {
  const requested = await localeRootParam()
  const locale = isLocale(requested) ? requested : routing.defaultLocale

  permanentRedirect(locale === 'id' ? '/id/cara-kerja' : '/en/cara-kerja')
}

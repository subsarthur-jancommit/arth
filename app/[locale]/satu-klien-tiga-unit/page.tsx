import { draftMode } from 'next/headers'
import { locale as localeRootParam } from 'next/root-params'

import { LocalizedNotFound } from '@/app/[locale]/not-found'
import { Wrapper } from '@/components/layout/wrapper'
import { isLocale, type Locale, routing } from '@/lib/i18n/routing'
import { isConfigured } from '@/lib/integrations/registry'
import { sanityFetch } from '@/lib/integrations/sanity/live'
import { sequencesQuery } from '@/lib/integrations/sanity/queries'
import { generatePageMetadata } from '@/lib/utils/metadata'

const fetchSequences = async (
  locale: Locale,
  perspective: 'published' | 'drafts',
  stega: boolean
) => {
  'use cache'

  return sanityFetch({
    query: sequencesQuery,
    params: { locale },
    perspective,
    stega,
  })
}

async function sequencesForRequest(locale: Locale) {
  const { isEnabled } = await draftMode()
  return isEnabled
    ? fetchSequences(locale, 'drafts', true)
    : fetchSequences(locale, 'published', false)
}

export default async function ThreeUnitsPage() {
  if (!isConfigured('sanity')) return <LocalizedNotFound />

  const requested = await localeRootParam()
  const locale: Locale = isLocale(requested) ? requested : routing.defaultLocale
  const { data } = await sequencesForRequest(locale)

  if (!data || data.length === 0) return <LocalizedNotFound />

  return (
    <Wrapper theme="light">
      <article className="flex grow flex-col gap-gap dr-px-16 dr-py-32">
        <header className="gap-4 flex max-w-[60ch] flex-col">
          <p className="caption">Satu klien, tiga unit</p>
          <h1>Rangkaian kerja yang mungkin</h1>
          <p className="p-big">
            Setiap rangkaian berikut adalah cara tiga unit dapat saling
            melengkapi, bukan klaim proyek yang pernah dikerjakan.
          </p>
        </header>

        {data.map((sequence) => (
          <section
            key={sequence._id}
            className="gap-6 pt-6 flex flex-col border-t border-(--line)"
          >
            {sequence.situasi && <h2 className="h2">{sequence.situasi}</h2>}
            {sequence.langkah && (
              <ol className="gap-4 grid">
                {sequence.langkah.map((langkah) => (
                  <li key={langkah._key} className="gap-2 flex flex-col">
                    <h3 className="h3">{langkah.unit?.nama}</h3>
                    {langkah.kalimat && <p className="p">{langkah.kalimat}</p>}
                    {langkah.offer && langkah.offer.length > 0 && (
                      <ul className="gap-1 flex flex-col">
                        {langkah.offer.map((offer) => (
                          <li key={offer._key} className="caption">
                            {offer.judul}
                          </li>
                        ))}
                      </ul>
                    )}
                  </li>
                ))}
              </ol>
            )}
            {sequence.keterangan && <p className="p">{sequence.keterangan}</p>}
          </section>
        ))}
      </article>
    </Wrapper>
  )
}

export async function generateMetadata() {
  const requested = await localeRootParam()
  const locale: Locale = isLocale(requested) ? requested : routing.defaultLocale

  return generatePageMetadata({
    title: 'Satu klien, tiga unit',
    description:
      'Rangkaian kerja yang mungkin lintas Konstruksi, Teknologi, dan Peekabo.',
    url: `/${locale}/satu-klien-tiga-unit`,
  })
}

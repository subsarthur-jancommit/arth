import { draftMode } from 'next/headers'
import { locale as localeRootParam } from 'next/root-params'

import { LocalizedNotFound } from '@/app/[locale]/not-found'
import { Wrapper } from '@/components/layout/wrapper'
import { isLocale, type Locale, routing } from '@/lib/i18n/routing'
import { isConfigured } from '@/lib/integrations/registry'
import { sanityFetch } from '@/lib/integrations/sanity/live'
import { howWeWorkQuery } from '@/lib/integrations/sanity/queries'
import { generatePageMetadata } from '@/lib/utils/metadata'

const fetchHowWeWork = async (
  locale: Locale,
  perspective: 'published' | 'drafts',
  stega: boolean
) => {
  'use cache'

  return sanityFetch({
    query: howWeWorkQuery,
    params: { locale },
    perspective,
    stega,
  })
}

async function howWeWorkForRequest(locale: Locale) {
  const { isEnabled } = await draftMode()
  return isEnabled
    ? fetchHowWeWork(locale, 'drafts', true)
    : fetchHowWeWork(locale, 'published', false)
}

export default async function HowWeWorkPage() {
  if (!isConfigured('sanity')) return <LocalizedNotFound />

  const requested = await localeRootParam()
  const locale: Locale = isLocale(requested) ? requested : routing.defaultLocale
  const { data } = await howWeWorkForRequest(locale)

  if (!data) return <LocalizedNotFound />

  return (
    <Wrapper theme="light">
      <article className="flex grow flex-col gap-gap dr-px-16 dr-py-32">
        <header className="gap-4 flex max-w-[60ch] flex-col">
          <p className="caption">Cara kami bekerja</p>
          <h1>Janji yang dapat Anda pegang</h1>
        </header>

        {data.janji && data.janji.length > 0 && (
          <ol className="gap-4 grid">
            {data.janji.map((janji) => (
              <li key={janji._key} className="pt-4 border-t border-(--line)">
                <h2 className="h3">{janji.judul}</h2>
                <p className="p">{janji.kalimat}</p>
              </li>
            ))}
          </ol>
        )}

        {data.hakMilikKlien && (
          <section className="gap-2 flex max-w-[60ch] flex-col">
            <h2 className="h3">Hak milik klien</h2>
            <p className="p">{data.hakMilikKlien}</p>
          </section>
        )}
        {data.pengungkapanKomisi && (
          <section className="gap-2 flex max-w-[60ch] flex-col">
            <h2 className="h3">Pengungkapan komisi</h2>
            <p className="p">{data.pengungkapanKomisi}</p>
          </section>
        )}
        {data.yangTidakDijual && (
          <section className="gap-2 flex max-w-[60ch] flex-col">
            <h2 className="h3">Yang tidak kami jual</h2>
            <p className="p">{data.yangTidakDijual}</p>
          </section>
        )}
        {data.wilayah && data.wilayah.length > 0 && (
          <section className="gap-2 flex flex-col">
            <h2 className="h3">Wilayah kerja</h2>
            <ul className="gap-2 flex flex-wrap p">
              {data.wilayah.map((wilayah) => (
                <li key={wilayah._key}>{wilayah.nama}</li>
              ))}
            </ul>
          </section>
        )}
        {data.contohFormat && (
          <section className="gap-2 flex max-w-[60ch] flex-col">
            <h2 className="h3">Format kerja</h2>
            <p className="p">{data.contohFormat}</p>
          </section>
        )}
      </article>
    </Wrapper>
  )
}

export async function generateMetadata() {
  const requested = await localeRootParam()
  const locale: Locale = isLocale(requested) ? requested : routing.defaultLocale

  if (!isConfigured('sanity')) return { robots: { index: false } }

  const { data } = await howWeWorkForRequest(locale)
  if (!data) return { robots: { index: false } }

  return generatePageMetadata({
    title: 'Cara kami bekerja',
    ...(data.contohFormat ? { description: data.contohFormat } : {}),
    url: `/${locale}/cara-kerja`,
  })
}

import { locale as localeRootParam } from 'next/root-params'

import { LocalizedNotFound } from '@/app/[locale]/not-found'
import { Wrapper } from '@/components/layout/wrapper'
import { Link } from '@/components/ui/link'
import {
  isSideOf,
  isUnit,
  sideTemplate,
  type Side,
  type Unit,
} from '@/lib/content/units'
import { isLocale, type Locale, routing } from '@/lib/i18n/routing'
import { isConfigured } from '@/lib/integrations/registry'
import { sanityFetch } from '@/lib/integrations/sanity/live'
import {
  chapterPageQuery,
  offerPageQuery,
} from '@/lib/integrations/sanity/queries'
import { generatePageMetadata } from '@/lib/utils/metadata'

interface ArthurDetailPageProps {
  params: Promise<{ unit: string; side: string; slug: string[] }>
}

interface RouteValues {
  unit: Unit
  side: Side
  chapter: string
  offer?: string
}

function routeValues(
  unit: string,
  side: string,
  slug: string[]
): RouteValues | null {
  if (!isUnit(unit) || !isSideOf(unit, side)) return null
  if (slug.length === 1 && slug[0]) {
    return { unit, side, chapter: slug[0] }
  }
  if (slug.length === 2 && slug[0] && slug[1]) {
    return { unit, side, chapter: slug[0], offer: slug[1] }
  }
  return null
}

const fetchChapter = async (values: RouteValues, locale: Locale) => {
  'use cache'

  return sanityFetch({
    query: chapterPageQuery,
    params: { locale, ...values },
    perspective: 'published',
    stega: false,
  })
}

const fetchOffer = async (values: Required<RouteValues>, locale: Locale) => {
  'use cache'

  return sanityFetch({
    query: offerPageQuery,
    params: { locale, ...values },
    perspective: 'published',
    stega: false,
  })
}

function DetailNotFound() {
  return <LocalizedNotFound />
}

/** Reader-facing chapter and offer routes below one validated side. */
export default async function ArthurDetailPage({
  params,
}: ArthurDetailPageProps) {
  const { unit, side, slug } = await params
  const values = routeValues(unit, side, slug)

  if (!values || !isConfigured('sanity')) return <DetailNotFound />

  const requested = await localeRootParam()
  const locale: Locale = isLocale(requested) ? requested : routing.defaultLocale

  if (!values.offer) {
    const { data } = await fetchChapter(values, locale)
    if (!data) return <DetailNotFound />

    return (
      <Wrapper theme="light">
        <article className="flex grow flex-col gap-gap dr-px-16 dr-py-32">
          <p className="caption">{data.nama}</p>
          {data.kutipan && (
            <blockquote className="h2">{data.kutipan}</blockquote>
          )}
          {data.situasi && <p className="p-big">{data.situasi}</p>}
          {data.batas && <p className="p">{data.batas}</p>}
          {data.offers && data.offers.length > 0 && (
            <section className="gap-4 flex flex-col">
              <h2 className="h2">Offer di bab ini</h2>
              <ul className="gap-3 grid">
                {data.offers.map((offer) => (
                  <li key={offer._id}>
                    <Link
                      href={`/${values.unit}/${values.side}/${values.chapter}/${offer.slug}`}
                      className="gap-1 p-4 flex flex-col border border-(--line)"
                    >
                      <span className="h3">{offer.judul}</span>
                      {offer.dampak && (
                        <span className="p">{offer.dampak}</span>
                      )}
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          )}
          <Link
            href={sideTemplate(values.unit, values.side)}
            className="caption"
          >
            Kembali ke sisi
          </Link>
        </article>
      </Wrapper>
    )
  }

  const { data } = await fetchOffer(values as Required<RouteValues>, locale)
  if (!data) return <DetailNotFound />

  return (
    <Wrapper theme="light">
      <article className="flex grow flex-col gap-gap dr-px-16 dr-py-32">
        <header className="gap-2 flex flex-col">
          <p className="caption">{data.jenis}</p>
          <h1>{data.judul}</h1>
          {data.dampak && <p className="p-big">{data.dampak}</p>}
        </header>
        {data.untukSiapa && (
          <section>
            <h2 className="h3">Untuk siapa</h2>
            <p className="p">{data.untukSiapa}</p>
          </section>
        )}
        {data.situasi && (
          <section>
            <h2 className="h3">Situasi</h2>
            <p className="p">{data.situasi}</p>
          </section>
        )}
        {data.langkah && (
          <section>
            <h2 className="h3">Yang kami kerjakan</h2>
            <ol className="list-decimal pl-[1.5em] p">
              {data.langkah.map((item) => (
                <li key={item._key}>{item.teks}</li>
              ))}
            </ol>
          </section>
        )}
        {data.serahan && (
          <section>
            <h2 className="h3">Yang Anda terima</h2>
            <ul className="list-disc pl-[1.5em] p">
              {data.serahan.map((item) => (
                <li key={item._key}>{item.teks}</li>
              ))}
            </ul>
          </section>
        )}
        {data.batas && (
          <section>
            <h2 className="h3">Batas dan syarat</h2>
            <p className="p">{data.batas}</p>
          </section>
        )}
      </article>
    </Wrapper>
  )
}

export async function generateMetadata({ params }: ArthurDetailPageProps) {
  const { unit, side, slug } = await params
  const values = routeValues(unit, side, slug)

  if (!values || !isConfigured('sanity')) return { robots: { index: false } }

  const requested = await localeRootParam()
  const locale: Locale = isLocale(requested) ? requested : routing.defaultLocale
  const path = `/${unit}/${side}/${slug.join('/')}`

  if (!values.offer) {
    const { data } = await fetchChapter(values, locale)
    if (!data) return { robots: { index: false } }
    return generatePageMetadata({
      title: data.nama ?? 'Bab Arthur',
      ...(data.situasi || data.kutipan
        ? { description: data.situasi ?? data.kutipan ?? '' }
        : {}),
      url: `/${locale}${path}`,
    })
  }

  const { data } = await fetchOffer(values as Required<RouteValues>, locale)
  if (!data) return { robots: { index: false } }
  return generatePageMetadata({
    title: data.judul ?? 'Offer Arthur',
    ...(data.dampak ? { description: data.dampak } : {}),
    url: `/${locale}${path}`,
  })
}

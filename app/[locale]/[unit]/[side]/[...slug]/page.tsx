import cn from 'clsx'
import { getTranslations } from 'next-intl/server'
import { draftMode } from 'next/headers'
import { locale as localeRootParam } from 'next/root-params'
import { z } from 'zod'

import { LocalizedNotFound } from '@/app/[locale]/not-found'
import { Wrapper } from '@/components/layout/wrapper'
import { Link } from '@/components/ui/link'
import { canRenderPublicContent } from '@/lib/content/public-content-guard'
import {
  isSideOf,
  isUnit,
  sideTemplate,
  unitTemplate,
  type Side,
  type Unit,
} from '@/lib/content/units'
import { isLocale, type Locale, routing } from '@/lib/i18n/routing'
import { isConfigured } from '@/lib/integrations/registry'
import { sanityFetch } from '@/lib/integrations/sanity/live'
import {
  chapterPageQuery,
  chapterPagePreviewQuery,
  offerPageQuery,
} from '@/lib/integrations/sanity/queries'
import { generatePageMetadata } from '@/lib/utils/metadata'
import { ChapterOfferGrid } from '@/vault/blocks/chapter-offer-grid'

import s from './page.module.css'
// Bab dan offer datang dari dokumen Sanity, jadi nilainya tidak tersedia saat
// prerender statis. Blocking menjaga parameter catch-all tetap legal di bawah
// Cache Components dan tidak memaksa shell kosong untuk URL pembaca.
export const instant = false

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

const fetchChapter = async (
  values: RouteValues,
  locale: Locale,
  preview = false
) => {
  'use cache'

  return sanityFetch({
    query: preview ? chapterPagePreviewQuery : chapterPageQuery,
    params: { locale, ...values },
    perspective: preview ? 'drafts' : 'published',
    stega: preview,
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

const chapterReaderSchema = z.object({
  nama: z.string().nullable(),
  kutipan: z.string().nullable(),
  situasi: z.string().nullable(),
  batas: z.string().nullable(),
  offers: z
    .array(
      z.object({
        _id: z.string(),
        slug: z.string().nullable(),
        judul: z.string().nullable(),
        dampak: z.string().nullable(),
        untukSiapa: z.string().nullable(),
        jenis: z.string().nullable(),
        pasar: z.enum(['keduanya', 'pemerintah', 'swasta']).nullable(),
      })
    )
    .nullable(),
  jembatan: z
    .array(
      z.object({
        _key: z.string(),
        kalimat: z.string().nullable(),
        offer: z
          .object({
            slug: z.string().nullable(),
            judul: z.string().nullable(),
            bab: z
              .object({
                slug: z.string().nullable(),
                side: z
                  .object({
                    kunci: z.string().nullable(),
                    unit: z.string().nullable(),
                  })
                  .nullable(),
              })
              .nullable(),
          })
          .nullable(),
      })
    )
    .nullable(),
  ajakan: z
    .object({ label: z.string().nullable(), sesudahnya: z.string().nullable() })
    .nullable(),
})

type ChapterReaderData = z.infer<typeof chapterReaderSchema>

function chapterIsSafe(data: ChapterReaderData): boolean {
  const offers = data.offers ?? []
  const cardsAreComplete =
    offers.length >= 3 &&
    offers.length <= 7 &&
    offers.every(
      (offer) =>
        offer.slug !== null &&
        offer.judul !== null &&
        offer.dampak !== null &&
        offer.untukSiapa !== null &&
        offer.jenis !== null
    )

  if (!cardsAreComplete) return false

  return canRenderPublicContent('chapter', [
    data.nama,
    data.kutipan,
    data.situasi,
    data.batas,
    ...(offers.flatMap((offer) => [
      offer.judul,
      offer.dampak,
      offer.untukSiapa,
      offer.jenis,
    ]) ?? []),
    ...(data.jembatan?.map((bridge) => bridge.kalimat) ?? []),
    data.ajakan?.label,
    data.ajakan?.sesudahnya,
  ])
}

function chapterCards(data: ChapterReaderData) {
  return (data.offers ?? []).flatMap((offer) => {
    if (
      !offer.slug ||
      !offer.judul ||
      !offer.dampak ||
      !offer.untukSiapa ||
      !offer.jenis
    ) {
      return []
    }

    return [
      {
        id: offer._id,
        slug: offer.slug,
        title: offer.judul,
        impact: offer.dampak,
        audience: offer.untukSiapa,
        type: offer.jenis,
        market: offer.pasar,
      },
    ]
  })
}

function chapterBridges(data: ChapterReaderData) {
  return (data.jembatan ?? []).flatMap((bridge) => {
    const target = bridge.offer
    const chapter = target?.bab
    const targetSide = chapter?.side
    const targetUnit = targetSide?.unit ?? undefined
    const targetSideKey = targetSide?.kunci ?? undefined

    if (
      !bridge.kalimat ||
      !target?.slug ||
      !chapter?.slug ||
      !isUnit(targetUnit) ||
      !isSideOf(targetUnit, targetSideKey)
    ) {
      return []
    }

    return [
      {
        id: bridge._key,
        text: bridge.kalimat,
        href: `/${targetUnit}/${targetSideKey}/${chapter.slug}/${target.slug}`,
      },
    ]
  })
}

function offerIsSafe(data: {
  judul: string | null
  dampak: string | null
  untukSiapa: string | null
  situasi: string | null
  batas: string | null
  langkah: { teks: string | null }[] | null
  serahan: { teks: string | null }[] | null
}): boolean {
  return canRenderPublicContent('offer', [
    data.judul,
    data.dampak,
    data.untukSiapa,
    data.situasi,
    data.batas,
    ...(data.langkah?.map((item) => item.teks) ?? []),
    ...(data.serahan?.map((item) => item.teks) ?? []),
  ])
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
    const { isEnabled } = await draftMode()
    const [t, { data }] = await Promise.all([
      getTranslations('chapter'),
      fetchChapter(values, locale, isEnabled),
    ])
    const parsed = chapterReaderSchema.safeParse(data)
    if (!parsed.success || !chapterIsSafe(parsed.data)) {
      return <DetailNotFound />
    }

    const chapterData = parsed.data

    const cards = chapterCards(chapterData)
    const bridges = chapterBridges(chapterData)
    const isProjectMarket =
      values.unit === 'konstruksi' && values.side === 'pelaku-proyek'

    return (
      <Wrapper theme="light">
        <article className={s.page}>
          <header className={s.hero}>
            <p className="caption">{chapterData.nama}</p>
            <blockquote className={cn('h1', s.quote)}>
              {chapterData.kutipan}
            </blockquote>
            {chapterData.situasi ? (
              <p className="p-big">{chapterData.situasi}</p>
            ) : null}
          </header>

          <ChapterOfferGrid
            offers={cards}
            unit={values.unit}
            side={values.side}
            chapter={values.chapter}
            label={t('offersEyebrow')}
            marketLabel={t('marketLabel')}
            allLabel={t('marketAll')}
            governmentLabel={t('marketGovernment')}
            privateLabel={t('marketPrivate')}
            audienceLabel={t('audienceLabel')}
            typeLabel={t('typeLabel')}
            marketFilter={isProjectMarket}
            className={s.offers}
          />

          {chapterData.batas ? (
            <section className={s.boundaries}>
              <p className="caption">{t('boundariesEyebrow')}</p>
              <p className="p-big">{chapterData.batas}</p>
            </section>
          ) : null}

          {bridges.length > 0 ? (
            <section className={s.bridges}>
              <p className="caption">{t('bridgesEyebrow')}</p>
              <ul>
                {bridges.map((bridge) => (
                  <li key={bridge.id}>
                    <Link href={bridge.href} className="p-big" data-intent="">
                      {bridge.text}
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          ) : null}

          {chapterData.ajakan?.label && chapterData.ajakan.sesudahnya ? (
            <section className={s.action}>
              <p className="caption">{t('firstStepEyebrow')}</p>
              <h2 className="h2">{chapterData.ajakan.label}</h2>
              <p className="p-big">{chapterData.ajakan.sesudahnya}</p>
              <Link href="#contact" className={cn('caption', s.actionLink)}>
                {t('firstStepLink')}
              </Link>
            </section>
          ) : null}

          <nav aria-label={t('navigationLabel')} className={s.navigation}>
            <Link
              href={sideTemplate(values.unit, values.side)}
              className={cn('caption', s.route)}
              transition="sheet"
              data-press="side-sheet"
              data-intent=""
            >
              {t('backToSide')}
            </Link>
            <Link
              href={unitTemplate(values.unit)}
              className={cn('caption', s.route)}
              data-press="chip"
              data-intent=""
            >
              {t('backToUnit')}
            </Link>
          </nav>
        </article>
      </Wrapper>
    )
  }

  const { data } = await fetchOffer(values as Required<RouteValues>, locale)
  if (!data || !offerIsSafe(data)) return <DetailNotFound />

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
    const parsed = chapterReaderSchema.safeParse(data)
    if (!parsed.success || !chapterIsSafe(parsed.data)) {
      return { robots: { index: false } }
    }
    const chapterData = parsed.data
    return generatePageMetadata({
      title: chapterData.nama ?? 'Bab Arthur',
      ...(chapterData.situasi || chapterData.kutipan
        ? { description: chapterData.situasi ?? chapterData.kutipan ?? '' }
        : {}),
      url: `/${locale}${path}`,
    })
  }

  const { data } = await fetchOffer(values as Required<RouteValues>, locale)
  if (!data || !offerIsSafe(data)) return { robots: { index: false } }
  return generatePageMetadata({
    title: data.judul ?? 'Offer Arthur',
    ...(data.dampak ? { description: data.dampak } : {}),
    url: `/${locale}${path}`,
  })
}

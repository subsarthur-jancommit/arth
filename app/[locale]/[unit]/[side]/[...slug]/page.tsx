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
  offerPagePreviewQuery,
  offerPageQuery,
} from '@/lib/integrations/sanity/queries'
import { generatePageMetadata } from '@/lib/utils/metadata'
import { ChapterOfferGrid } from '@/vault/blocks/chapter-offer-grid'
import { OfferAudience } from '@/vault/blocks/offer-audience'
import { OfferBoundaries } from '@/vault/blocks/offer-boundaries'
import { OfferPrintControl } from '@/vault/blocks/offer-print-control'
import { OfferScope } from '@/vault/blocks/offer-scope'
import { TextReveal } from '@/vault/motion/text-reveal'

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

const fetchOffer = async (
  values: Required<RouteValues>,
  locale: Locale,
  preview = false
) => {
  'use cache'

  return sanityFetch({
    query: preview ? offerPagePreviewQuery : offerPageQuery,
    params: { locale, ...values },
    perspective: preview ? 'drafts' : 'published',
    stega: preview,
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

const offerReaderSchema = z.object({
  _id: z.string(),
  slug: z.string().nullable(),
  judul: z.string().nullable(),
  dampak: z.string().nullable(),
  untukSiapa: z.string().nullable(),
  jenis: z.string().nullable(),
  pasar: z.enum(['keduanya', 'pemerintah', 'swasta']).nullable(),
  situasi: z.string().nullable(),
  langkah: z
    .array(z.object({ _key: z.string(), teks: z.string().nullable() }))
    .nullable(),
  serahan: z
    .array(z.object({ _key: z.string(), teks: z.string().nullable() }))
    .nullable(),
  batas: z.string().nullable(),
  langkahPertama: z
    .object({ label: z.string().nullable(), sesudahnya: z.string().nullable() })
    .nullable(),
  jembatan: z
    .object({
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
    .nullable(),
  metadata: z
    .object({
      title: z.string().nullable(),
      description: z.string().nullable(),
      noIndex: z.boolean().nullable(),
    })
    .nullable(),
})

type OfferReaderData = z.infer<typeof offerReaderSchema>

function wordCount(value: string): number {
  return value.trim().split(/\s+/u).filter(Boolean).length
}

function offerIsSafe(data: OfferReaderData): boolean {
  const steps = data.langkah ?? []
  const deliverables = data.serahan ?? []
  const required = [
    data.judul,
    data.dampak,
    data.untukSiapa,
    data.jenis,
    data.situasi,
    data.batas,
    data.langkahPertama?.label,
    data.langkahPertama?.sesudahnya,
  ]
  const completeLists =
    steps.length > 0 &&
    deliverables.length > 0 &&
    steps.every((item) => Boolean(item.teks?.trim())) &&
    deliverables.every((item) => Boolean(item.teks?.trim()))

  if (
    !completeLists ||
    required.some((value) => !value?.trim()) ||
    !data.judul ||
    wordCount(data.judul) > 8 ||
    !data.slug
  ) {
    return false
  }

  return canRenderPublicContent('offer', [
    data.judul,
    data.dampak,
    data.untukSiapa,
    data.jenis,
    data.situasi,
    data.batas,
    ...steps.map((item) => item.teks),
    ...deliverables.map((item) => item.teks),
    data.langkahPertama?.label,
    data.langkahPertama?.sesudahnya,
    data.jembatan?.kalimat,
    data.metadata?.title,
    data.metadata?.description,
  ])
}

function offerItems(items: { _key: string; teks: string | null }[] | null) {
  return (items ?? []).flatMap((item) =>
    item.teks ? [{ id: item._key, text: item.teks }] : []
  )
}

function offerBridge(data: OfferReaderData) {
  const target = data.jembatan?.offer
  const chapter = target?.bab
  const targetSide = chapter?.side
  const targetUnit = targetSide?.unit ?? undefined
  const targetSideKey = targetSide?.kunci ?? undefined

  if (
    !data.jembatan?.kalimat ||
    !target?.slug ||
    !target.judul ||
    !chapter?.slug ||
    !isUnit(targetUnit) ||
    !isSideOf(targetUnit, targetSideKey)
  ) {
    return null
  }

  return {
    text: data.jembatan.kalimat,
    title: target.judul,
    href: `/${targetUnit}/${targetSideKey}/${chapter.slug}/${target.slug}`,
  }
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
              <Link href="/#contact" className={cn('caption', s.actionLink)}>
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

  const { isEnabled } = await draftMode()
  const [t, { data }] = await Promise.all([
    getTranslations('offer'),
    fetchOffer(values as Required<RouteValues>, locale, isEnabled),
  ])
  const parsed = offerReaderSchema.safeParse(data)
  if (!parsed.success || !offerIsSafe(parsed.data)) {
    return <DetailNotFound />
  }

  const offerData = parsed.data
  const steps = offerItems(offerData.langkah)
  const deliverables = offerItems(offerData.serahan)
  const bridge = offerBridge(offerData)
  const chapterHref = `/${values.unit}/${values.side}/${values.chapter}`

  return (
    <Wrapper theme="light">
      <article className={cn(s.page, s.offerPage)} data-offer-sheet="">
        <header className={cn(s.hero, s.offerHero)} data-epic="offer-arrival">
          <p className="caption">
            {t('eyebrow')} · {offerData.jenis}
          </p>
          <TextReveal
            as="h1"
            split="lines"
            pace="epic"
            className={s.offerTitle}
          >
            {offerData.judul ?? ''}
          </TextReveal>
          <p className={cn('p-big', s.impact)}>{offerData.dampak}</p>
        </header>

        <OfferAudience label={t('audienceEyebrow')} className={s.audience}>
          {offerData.untukSiapa ?? ''}
        </OfferAudience>

        <section className={s.situation}>
          <h2 className="caption">{t('situationEyebrow')}</h2>
          <p className="p-big">{offerData.situasi}</p>
        </section>

        <OfferScope
          workLabel={t('workEyebrow')}
          measureLabel={t('workMeasure')}
          measureFrom={t('workFrom')}
          measureTo={t('workTo')}
          steps={steps}
          deliverablesLabel={t('deliverablesEyebrow')}
          deliverables={deliverables}
          className={s.offerScope}
        />

        <OfferBoundaries
          label={t('boundariesEyebrow')}
          className={s.offerBoundaries}
        >
          {offerData.batas ?? ''}
        </OfferBoundaries>

        <section className={s.action}>
          <p className="caption">{t('firstStepEyebrow')}</p>
          <h2 className="h2">{offerData.langkahPertama?.label}</h2>
          <p className="p-big">{offerData.langkahPertama?.sesudahnya}</p>
          <Link href="/#contact" className={cn('caption', s.actionLink)}>
            {t('firstStepLink')}
          </Link>
        </section>

        {bridge ? (
          <section className={s.offerBridge}>
            <h2 className="caption">{t('bridgeEyebrow')}</h2>
            <p className="p-big">{bridge.text}</p>
            <Link href={bridge.href} className={cn('h3', s.bridgeLink)}>
              {bridge.title}
            </Link>
          </section>
        ) : null}

        <div className={s.offerUtilities}>
          <nav aria-label={t('navigationLabel')} className={s.navigation}>
            <Link
              href={chapterHref}
              className={cn('caption', s.route)}
              data-press="chip"
              data-intent=""
            >
              {t('backToChapter')}
            </Link>
            <Link
              href={sideTemplate(values.unit, values.side)}
              className={cn('caption', s.route)}
              data-press="chip"
              data-intent=""
            >
              {t('backToSide')}
            </Link>
          </nav>
          <OfferPrintControl label={t('print')} />
        </div>
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
  const parsed = offerReaderSchema.safeParse(data)
  if (!parsed.success || !offerIsSafe(parsed.data)) {
    return { robots: { index: false } }
  }
  const offerData = parsed.data
  return generatePageMetadata({
    title: offerData.metadata?.title ?? offerData.judul ?? 'Offer Arthur',
    description: offerData.metadata?.description ?? offerData.dampak ?? '',
    url: `/${locale}${path}`,
    noIndex: offerData.metadata?.noIndex ?? false,
  })
}

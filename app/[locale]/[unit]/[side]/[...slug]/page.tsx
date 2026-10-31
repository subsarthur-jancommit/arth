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
import {
  chapterQueryParams,
  offerQueryParams,
} from '@/lib/integrations/sanity/detail-params'
import { sanityFetch } from '@/lib/integrations/sanity/live'
import {
  chapterPageQuery,
  chapterPagePreviewQuery,
  offerPagePreviewQuery,
  offerPageQuery,
} from '@/lib/integrations/sanity/queries'
import { generatePageMetadata } from '@/lib/utils/metadata'
import { ChapterOfferGrid } from '@/vault/blocks/chapter-offer-grid'
import { DocHead } from '@/vault/blocks/doc-head'
import { FirstStep } from '@/vault/blocks/first-step'
import { OfferBoundaries } from '@/vault/blocks/offer-boundaries'
import { OfferPrintControl } from '@/vault/blocks/offer-print-control'
import { OfferScope } from '@/vault/blocks/offer-scope'

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
    params: chapterQueryParams(values, locale),
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
    params: offerQueryParams(values, locale),
    perspective: preview ? 'drafts' : 'published',
    stega: preview,
  })
}

function DetailNotFound() {
  return <LocalizedNotFound />
}

const chapterReaderSchema = z.object({
  nama: z.string().nullable(),
  pembeli: z.string().nullable(),
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
        syarat: z.string().nullable(),
        pasar: z.enum(['keduanya', 'pemerintah', 'swasta']).nullable(),
        pintuMasuk: z.boolean(),
        punyaHalaman: z.boolean(),
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
            punyaHalaman: z.boolean(),
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
  metadata: z
    .object({
      title: z.string().nullable(),
      description: z.string().nullable(),
      noIndex: z.boolean().nullable(),
    })
    .nullable()
    .optional(),
})

type ChapterReaderData = z.infer<typeof chapterReaderSchema>

function chapterIsSafe(data: ChapterReaderData): boolean {
  const offers = data.offers ?? []
  // A situation lists every published offer (pattern approach, section 3);
  // three is the floor below which it is not yet a situation page.
  const cardsAreComplete =
    offers.length >= 3 &&
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
    data.pembeli,
    data.kutipan,
    data.situasi,
    data.batas,
    ...(offers.flatMap((offer) => [
      offer.judul,
      offer.dampak,
      offer.untukSiapa,
      offer.jenis,
      offer.syarat,
    ]) ?? []),
    ...(data.jembatan?.map((bridge) => bridge.kalimat) ?? []),
    data.ajakan?.label,
    data.ajakan?.sesudahnya,
    data.metadata?.title,
    data.metadata?.description,
  ])
}

/**
 * The contact page, carrying where the question came from. Both values are
 * page slugs, never anything about the reader (pattern approach, section 3).
 */
function askHref(chapter: string, offer?: string) {
  const query = new URLSearchParams({ dari: chapter })
  if (offer) query.set('pekerjaan', offer)
  return `/kontak?${query.toString()}`
}

/**
 * A first step's label as a button reads it: the reader's own label
 * (`docs/R1-GLOSARIUM-PEMBACA.md` §6) without a closing full stop, which
 * would sit between the words and the arrow.
 */
function buttonLabel(label: string) {
  return label.replace(/\.$/u, '')
}

function chapterCards(
  data: ChapterReaderData,
  values: Omit<RouteValues, 'offer'>
) {
  const base = `/${values.unit}/${values.side}/${values.chapter}`
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
        title: offer.judul,
        impact: offer.dampak,
        audience: offer.untukSiapa,
        type: offer.jenis,
        market: offer.pasar,
        condition: offer.syarat,
        href: offer.punyaHalaman ? `${base}/${offer.slug}` : null,
        askHref: askHref(values.chapter, offer.slug),
        entry: offer.pintuMasuk,
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

    const situation = `/${targetUnit}/${targetSideKey}/${chapter.slug}`
    return [
      {
        id: bridge._key,
        text: bridge.kalimat,
        href: target.punyaHalaman ? `${situation}/${target.slug}` : situation,
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
  syarat: z.string().nullable(),
  tingkat: z
    .array(
      z.object({
        _key: z.string(),
        nama: z.string().nullable(),
        kalimat: z.string().nullable(),
        poin: z
          .array(z.object({ _key: z.string(), teks: z.string().nullable() }))
          .nullable(),
      })
    )
    .nullable(),
  langkahPertama: z
    .object({ label: z.string().nullable(), sesudahnya: z.string().nullable() })
    .nullable(),
  // The unit's honesty sentence (glossary section 10, rule 5). Optional so a
  // response cached before the field existed still parses.
  kalimatJujur: z.string().nullable().optional(),
  jembatan: z
    .object({
      kalimat: z.string().nullable(),
      offer: z
        .object({
          slug: z.string().nullable(),
          punyaHalaman: z.boolean(),
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

/** The two packages, when both are complete (glossary, section 10). */
function offerPackages(data: OfferReaderData) {
  const packages = (data.tingkat ?? []).flatMap((item) =>
    item.nama?.trim() && item.kalimat?.trim()
      ? [
          {
            id: item._key,
            name: item.nama,
            sentence: item.kalimat,
            points: offerItems(item.poin),
          },
        ]
      : []
  )
  return packages.length === (data.tingkat ?? []).length ? packages : []
}

function offerIsSafe(data: OfferReaderData): boolean {
  const steps = data.langkah ?? []
  const deliverables = data.serahan ?? []
  const packages = offerPackages(data)
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
  // Either the approved two packages, or the older steps and deliverables.
  const completeLists =
    packages.length > 0 ||
    (steps.length > 0 &&
      deliverables.length > 0 &&
      steps.every((item) => Boolean(item.teks?.trim())) &&
      deliverables.every((item) => Boolean(item.teks?.trim())))

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
    data.syarat,
    ...packages.flatMap((item) => [
      item.name,
      item.sentence,
      ...item.points.map((point) => point.text),
    ]),
    data.langkahPertama?.label,
    data.langkahPertama?.sesudahnya,
    data.kalimatJujur,
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

  const situation = `/${targetUnit}/${targetSideKey}/${chapter.slug}`
  return {
    text: data.jembatan.kalimat,
    title: target.judul,
    href: target.punyaHalaman ? `${situation}/${target.slug}` : situation,
  }
}

/** The situation's name, for a work page's path back and its facts. */
async function chapterNameFor(
  values: RouteValues,
  locale: Locale,
  preview: boolean
) {
  const { data } = await fetchChapter(
    { unit: values.unit, side: values.side, chapter: values.chapter },
    locale,
    preview
  )
  const parsed = chapterReaderSchema.safeParse(data)
  return parsed.success ? parsed.data.nama : null
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
    const [t, tUnit, tSide, { data }] = await Promise.all([
      getTranslations('chapter'),
      getTranslations('unit'),
      getTranslations('side'),
      fetchChapter(values, locale, isEnabled),
    ])
    const parsed = chapterReaderSchema.safeParse(data)
    if (!parsed.success || !chapterIsSafe(parsed.data)) {
      return <DetailNotFound />
    }

    const chapterData = parsed.data

    const cards = chapterCards(chapterData, {
      unit: values.unit,
      side: values.side,
      chapter: values.chapter,
    })
    const bridges = chapterBridges(chapterData)
    const isProjectMarket =
      values.unit === 'konstruksi' && values.side === 'pelaku-proyek'

    return (
      <Wrapper theme="light">
        <article className={s.page}>
          {/*
           * A document head (R5, direction A), after the approved situation
           * screen: the path back to the unit and the reader, "Situasi", the
           * situation's name as the page's title, then the buyer's own words
           * and the situation line. It replaced a hero held at 62 to 76svh
           * that set the name as a caption and gave the page no h1.
           */}
          <DocHead
            crumbs={[
              { label: tUnit(values.unit), href: unitTemplate(values.unit) },
              {
                label: tSide(values.side),
                href: sideTemplate(values.unit, values.side),
              },
            ]}
            crumbsLabel={t('crumbsLabel')}
            eyebrow={tSide('chapterLabel')}
            title={chapterData.nama ?? ''}
          >
            <blockquote className={cn('quote', s.quote)}>
              {chapterData.kutipan}
            </blockquote>
            {chapterData.situasi ? (
              <p className={cn('p-big', s.lead)}>{chapterData.situasi}</p>
            ) : null}
            {chapterData.pembeli ? (
              <p className={cn('caption', s.buyers)}>{chapterData.pembeli}</p>
            ) : null}
          </DocHead>

          <ChapterOfferGrid
            offers={cards}
            label={t('offersEyebrow')}
            marketLabel={t('marketLabel')}
            allLabel={t('marketAll')}
            governmentLabel={t('marketGovernment')}
            privateLabel={t('marketPrivate')}
            entryLabel={t('entryLabel')}
            askLabel={t('askLink')}
            readLabel={t('readLink')}
            conditionLabel={t('conditionLabel')}
            marketFilter={isProjectMarket}
            className={s.offers}
          />

          {chapterData.batas ? (
            <section className={s.doc}>
              <h2 className={cn('caption', s.label)}>
                {t('boundariesEyebrow')}
              </h2>
              <p className="p-big">{chapterData.batas}</p>
            </section>
          ) : null}

          {bridges.length > 0 ? (
            <section className={s.doc}>
              <h2 className={cn('caption', s.label)}>{t('bridgesEyebrow')}</h2>
              <ul className={s.bridgeList}>
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

          {/*
           * The reader's own label on the button, its sentence outside it
           * (glossary §6), where it was a heading over "Mulai percakapan".
           */}
          {chapterData.ajakan?.label && chapterData.ajakan.sesudahnya ? (
            <FirstStep
              label={t('firstStepEyebrow')}
              body={chapterData.ajakan.sesudahnya}
              action={{
                href: askHref(values.chapter),
                label: buttonLabel(chapterData.ajakan.label),
              }}
            />
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
  const [t, tUnit, tSide, tNav, { data }, chapterName] = await Promise.all([
    getTranslations('offer'),
    getTranslations('unit'),
    getTranslations('side'),
    getTranslations('nav'),
    fetchOffer(values as Required<RouteValues>, locale, isEnabled),
    chapterNameFor(values, locale, isEnabled),
  ])
  const parsed = offerReaderSchema.safeParse(data)
  if (!parsed.success || !offerIsSafe(parsed.data)) {
    return <DetailNotFound />
  }

  const offerData = parsed.data
  const steps = offerItems(offerData.langkah)
  const deliverables = offerItems(offerData.serahan)
  const packages = offerPackages(offerData)
  const bridge = offerBridge(offerData)
  const chapterHref = `/${values.unit}/${values.side}/${values.chapter}`

  return (
    <Wrapper theme="light">
      <article className={cn(s.page, s.offerPage)} data-offer-sheet="">
        {/*
         * A document head after the approved work screen: the path back to
         * the situation, the kind of work, the title, its impact, and the
         * facts a buyer checks first. The title had no type class and set at
         * body size, inside a hero held at 62 to 76svh.
         */}
        <DocHead
          crumbs={[
            { label: tUnit(values.unit), href: unitTemplate(values.unit) },
            {
              label: tSide(values.side),
              href: sideTemplate(values.unit, values.side),
            },
            ...(chapterName ? [{ label: chapterName, href: chapterHref }] : []),
          ]}
          crumbsLabel={t('crumbsLabel')}
          eyebrow={offerData.jenis ?? undefined}
          title={offerData.judul ?? ''}
          facts={[
            { term: t('audienceEyebrow'), detail: offerData.untukSiapa },
            {
              term: tUnit('eyebrow'),
              detail: (
                <Link href={unitTemplate(values.unit)}>
                  {tUnit(values.unit)}
                </Link>
              ),
            },
            ...(chapterName
              ? [
                  {
                    term: tSide('chapterLabel'),
                    detail: <Link href={chapterHref}>{chapterName}</Link>,
                  },
                ]
              : []),
            ...(offerData.syarat
              ? [{ term: t('conditionLabel'), detail: offerData.syarat }]
              : []),
          ]}
        >
          <p className={cn('p-big', s.impact)}>{offerData.dampak}</p>
        </DocHead>

        <section className={s.doc}>
          <h2 className={cn('caption', s.label)}>{t('situationEyebrow')}</h2>
          <p className={cn('h3', s.situationText)}>{offerData.situasi}</p>
        </section>

        {packages.length > 0 ? (
          <section className={s.doc}>
            <h2 className={cn('caption', s.label)}>{t('packagesEyebrow')}</h2>
            <ul className={s.packageList}>
              {packages.map((item) => (
                <li key={item.id} className={s.package}>
                  <h3 className="h3">{item.name}</h3>
                  <p className="p-big">{item.sentence}</p>
                  {item.points.length > 0 ? (
                    <ul className={s.packagePoints}>
                      {item.points.map((point) => (
                        <li key={point.id} className="p">
                          {point.text}
                        </li>
                      ))}
                    </ul>
                  ) : null}
                </li>
              ))}
            </ul>
          </section>
        ) : (
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
        )}

        <OfferBoundaries
          label={t('boundariesEyebrow')}
          className={s.offerBoundaries}
        >
          {offerData.batas ?? ''}
        </OfferBoundaries>

        {/*
         * The reader's own label on the button and its sentence outside it
         * (glossary §6), then the unit's honest sentence. Teknologi work
         * pages keep their commission sentence and refer to the one page
         * that explains every way Arthur is paid
         * (docs/R1-SERAH-CARA-KAMI-DIBAYAR.md, section 2).
         */}
        <FirstStep
          label={t('firstStepEyebrow')}
          body={offerData.langkahPertama?.sesudahnya ?? undefined}
          note={offerData.kalimatJujur ?? undefined}
          action={{
            href: askHref(values.chapter, offerData.slug ?? undefined),
            label: buttonLabel(offerData.langkahPertama?.label ?? ''),
          }}
        >
          {values.unit === 'teknologi' ? (
            <Link href="/pembayaran" data-payment-link="">
              {tNav('payment')}
            </Link>
          ) : null}
        </FirstStep>

        {bridge ? (
          <section className={s.doc}>
            <h2 className={cn('caption', s.label)}>{t('bridgeEyebrow')}</h2>
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
    const description =
      chapterData.metadata?.description ??
      chapterData.situasi ??
      chapterData.kutipan
    return generatePageMetadata({
      title: chapterData.metadata?.title ?? chapterData.nama ?? 'Bab Arthur',
      ...(description ? { description } : {}),
      url: `/${locale}${path}`,
      noIndex: chapterData.metadata?.noIndex ?? false,
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

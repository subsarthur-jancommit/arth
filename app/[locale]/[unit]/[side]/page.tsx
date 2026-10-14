import cn from 'clsx'
import { getTranslations } from 'next-intl/server'
import { draftMode } from 'next/headers'
import { locale as localeRootParam } from 'next/root-params'

import { LocalizedNotFound } from '@/app/[locale]/not-found'
import { Wrapper } from '@/components/layout/wrapper'
import { Link } from '@/components/ui/link'
import { NoScriptFrontDoors } from '@/components/ui/route-loading'
import { SectionHeader } from '@/components/ui/section-header'
import { sideContent } from '@/lib/content/arthur-content'
import { SIDE_FALLBACKS } from '@/lib/content/side-fallback'
import {
  isSideOf,
  isUnit,
  SIDES,
  sideTemplate,
  UNITS,
  unitTemplate,
} from '@/lib/content/units'
import { localizedPath } from '@/lib/i18n/paths'
import { isLocale, type Locale, routing } from '@/lib/i18n/routing'
import { generatePageMetadata } from '@/lib/utils/metadata'
import { SideChapterTable } from '@/vault/blocks/side-chapter-table'
import { StepSequence } from '@/vault/blocks/step-sequence'
import { RouteMarker } from '@/vault/motion/route-marker'

import s from './page.module.css'

interface SidePageProps {
  params: Promise<{ unit: string; side: string }>
}

export function generateStaticParams() {
  return UNITS.flatMap((unit) => SIDES[unit].map((side) => ({ unit, side })))
}

export default async function SidePage({ params }: SidePageProps) {
  const { unit, side } = await params

  if (!isUnit(unit) || !isSideOf(unit, side)) {
    return (
      <>
        <LocalizedNotFound />
        <NoScriptFrontDoors />
      </>
    )
  }

  const requested = await localeRootParam()
  const locale: Locale = isLocale(requested) ? requested : routing.defaultLocale
  const { isEnabled } = await draftMode()
  const [tUnit, tSide, content] = await Promise.all([
    getTranslations('unit'),
    getTranslations('side'),
    sideContent(locale, unit, side, isEnabled),
  ])
  const fallback = SIDE_FALLBACKS[side]
  const [firstSide, secondSide] = SIDES[unit]
  const otherSide = side === firstSide ? secondSide : firstSide
  const title = content?.judul ?? fallback.judul
  const steps = (content?.caraMembeli ?? []).flatMap((item) =>
    item.teks ? [{ key: item._key, title: item.teks, body: '' }] : []
  )
  const buyingSteps = steps.length
    ? steps
    : fallback.caraMembeli.map((item) => ({
        key: item._key,
        title: item.teks,
        body: '',
      }))
  const action = content?.langkahPertama ?? fallback.langkahPertama
  const chapters = (content?.bab ?? []).flatMap((chapter) => {
    if (!chapter.nama) return []
    const href = chapter.slug
      ? `${sideTemplate(unit, side)}/${chapter.slug}`
      : null
    const entryHref =
      href && chapter.pintuMasuk?.slug
        ? `${href}/${chapter.pintuMasuk.slug}`
        : null

    return [
      {
        id: chapter._id,
        href,
        name: chapter.nama,
        situation: chapter.situasi,
        types: chapter.jenis ?? [],
        offerCount: chapter.jumlahOffer,
        entryOffer: chapter.pintuMasuk?.judul
          ? {
              title: chapter.pintuMasuk.judul,
              impact: chapter.pintuMasuk.dampak,
              href: entryHref,
            }
          : null,
      },
    ]
  })
  const sideName = content?.nama ?? fallback.nama

  return (
    <Wrapper theme="light">
      <article className={s.page}>
        <nav
          aria-label={tSide('switcherLabel', { unit: tUnit(unit) })}
          className={s.switcher}
          data-epic="side-sheet-swap"
        >
          <p className={cn('caption', s.switcherLabel)}>
            {tSide('switcherEyebrow')}
          </p>
          {SIDES[unit].map((candidate) => (
            <Link
              key={candidate}
              href={sideTemplate(unit, candidate)}
              className={s.switcherLink}
              aria-current={candidate === side ? 'page' : undefined}
              transition={candidate === side ? 'cover' : 'sheet'}
              data-press="side-sheet"
              data-intent=""
            >
              {tSide(candidate)}
            </Link>
          ))}
          <RouteMarker />
        </nav>

        <header className={s.hero}>
          <p className="caption">{sideName}</p>
          <SectionHeader
            as="h1"
            eyebrow={tSide('eyebrow', { unit: tUnit(unit) })}
            title={title}
            className={s.header}
          />
        </header>

        <StepSequence
          label={tSide('buyingEyebrow')}
          steps={buyingSteps}
          data-epic="side-buying-path"
          className={s.steps}
        />

        <SideChapterTable
          label={tSide('chaptersEyebrow')}
          title={tSide('chaptersTitle')}
          chapters={chapters}
          chapterLabel={tSide('chapterLabel')}
          typeLabel={tSide('typeLabel')}
          entryLabel={tSide('entryLabel')}
          offerCountLabel={tSide('offerCount')}
          empty={tSide('chaptersEmpty')}
          className={s.chapters}
        />

        <section className={s.action}>
          <p className="caption">{tSide('firstStepEyebrow')}</p>
          <h2 className="h2">{action.label}</h2>
          <p className="p-big">{action.sesudahnya}</p>
          <Link href="#contact" className={cn('caption', s.actionLink)}>
            {tSide('firstStepLink')}
          </Link>
        </section>

        <nav
          aria-label={tSide('navigationLabel', { unit: tUnit(unit) })}
          className={s.navigation}
        >
          <Link
            href={sideTemplate(unit, otherSide)}
            className={cn('caption', s.route)}
            transition="sheet"
            data-press="side-sheet"
            data-intent=""
          >
            {tSide('otherLabel', { unit: tUnit(unit) })}: {tSide(otherSide)}
          </Link>
          <Link
            href={unitTemplate(unit)}
            className={cn('caption', s.route)}
            data-press="chip"
            data-intent=""
          >
            {tSide('backToUnit', { unit: tUnit(unit) })}
          </Link>
        </nav>
      </article>
    </Wrapper>
  )
}

export async function generateMetadata({ params }: SidePageProps) {
  const [{ unit, side }, requested] = await Promise.all([
    params,
    localeRootParam(),
  ])
  const locale: Locale = isLocale(requested) ? requested : routing.defaultLocale

  if (!isUnit(unit) || !isSideOf(unit, side)) {
    const tNotFound = await getTranslations('notFound')
    return generatePageMetadata({
      title: tNotFound('title'),
      noIndex: true,
      url: localizedPath(locale, '/'),
    })
  }

  const content = await sideContent(locale, unit, side)
  const fallback = SIDE_FALLBACKS[side]
  return generatePageMetadata({
    title: content?.judul ?? fallback.judul,
    description:
      content?.langkahPertama?.sesudahnya ?? fallback.langkahPertama.sesudahnya,
    url: localizedPath(locale, sideTemplate(unit, side)),
  })
}

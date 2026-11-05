import cn from 'clsx'
import { getTranslations } from 'next-intl/server'
import { draftMode } from 'next/headers'
import { locale as localeRootParam } from 'next/root-params'

import { LocalizedNotFound } from '@/app/[locale]/not-found'
import { Wrapper } from '@/components/layout/wrapper'
import { Link } from '@/components/ui/link'
import { NoScriptFrontDoors } from '@/components/ui/route-loading'
import { sideContent, type SideContent } from '@/lib/content/arthur-content'
import {
  chapterForPath,
  NETWORK_MONEY_STEP_KEYS,
  NETWORK_PATH_KEYS,
} from '@/lib/content/network'
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
import { DocHead } from '@/vault/blocks/doc-head'
import { FirstStep } from '@/vault/blocks/first-step'
import { NetworkSide } from '@/vault/blocks/network-side'
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

/*
 * The network's own sentences are required words (Aturan isi, kalimat wajib
 * jaringan): a network page missing one of them is not shown at all, rather
 * than shown with a gap where a promise it must make should be. The page and
 * its head both ask here, so they cannot disagree about whether it exists.
 */
function networkTerms(network: SideContent['jaringan']) {
  return network?.caraKerja &&
    network.asalKomisi &&
    network.yangTidakAda &&
    network.syarat
    ? {
        summary: network.caraKerja,
        terms: {
          source: network.asalKomisi,
          absent: network.yangTidakAda,
          condition: network.syarat,
        },
      }
    : null
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
  const [tUnit, tSide, tNetwork, content] = await Promise.all([
    getTranslations('unit'),
    getTranslations('side'),
    getTranslations('network'),
    sideContent(locale, unit, side, isEnabled),
  ])
  /*
   * Sanity is the only home of a side's words since V6
   * (docs/RENCANA-KONTEKS-V2.md). Without its published title the route shows
   * the not-found view rather than a copy kept in code, and each block below
   * renders only when its own field is filled.
   */
  if (!content?.judul) return <LocalizedNotFound />

  const [firstSide, secondSide] = SIDES[unit]
  const otherSide = side === firstSide ? secondSide : firstSide
  const title = content.judul
  // A way to buy or a workflow step has a name and a line under it. The
  // one-line `teks` is the pre-V2 shape. No published side has used it since
  // the V0 migration ran (checked 2026-10-23), so this read can go with the
  // schema field.
  const buyingSteps = (content.caraMembeli ?? []).flatMap((item) => {
    const name = item.nama ?? item.teks
    return name
      ? [{ key: item._key, title: name, body: item.keterangan ?? '' }]
      : []
  })
  const action =
    content.langkahPertama?.label && content.langkahPertama.sesudahnya
      ? {
          label: content.langkahPertama.label,
          after: content.langkahPertama.sesudahnya,
        }
      : null
  const chapters = (content.bab ?? []).flatMap((chapter) => {
    if (!chapter.nama) return []
    const href = chapter.slug
      ? `${sideTemplate(unit, side)}/${chapter.slug}`
      : null
    // An entry offer without its own page is a card on the chapter page,
    // not an address of its own; linking it would land on a 404.
    const entryHref =
      href && chapter.pintuMasuk?.slug && chapter.pintuMasuk.punyaHalaman
        ? `${href}/${chapter.pintuMasuk.slug}`
        : null

    return [
      {
        id: chapter._id,
        href,
        name: chapter.nama,
        situation: chapter.situasi,
        types: chapter.jenis ?? [],
        networkPath: chapter.jalurJaringan ?? null,
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
  const sideName = content.nama ?? tSide(side)
  const buyers = (content.pembeli ?? []).flatMap((item) =>
    item.teks ? [item.teks] : []
  )
  const isNetworkSide = unit === 'peekabo' && side === 'jaringan'
  const networkContent = networkTerms(content.jaringan)
  if (isNetworkSide && !networkContent) return <LocalizedNotFound />

  const networkPaths = NETWORK_PATH_KEYS.map((path) => {
    const chapter = chapterForPath(path, chapters)

    return {
      id: path,
      title: tNetwork(`paths.${path}.title`),
      description: chapter?.situation ?? tNetwork(`paths.${path}.description`),
      href: chapter?.href ?? null,
      chapterName: chapter?.name ?? null,
    }
  })
  const networkMoneySteps = NETWORK_MONEY_STEP_KEYS.map((step) => ({
    id: step,
    title: tNetwork(`money.steps.${step}`),
  }))

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

        {/*
         * A document head (R5, direction A): who the page is for as its
         * label, the side's own question as its title, and a title block of
         * facts beside it. It replaced a hero held at 62 to 76svh, whose
         * height was empty space above a short title.
         */}
        <DocHead
          eyebrow={sideName}
          title={title}
          titleSize="sentence"
          facts={[
            ...(buyers.length > 0
              ? [{ term: tSide('buyersLabel'), detail: buyers }]
              : []),
            {
              term: tUnit('eyebrow'),
              detail: <Link href={unitTemplate(unit)}>{tUnit(unit)}</Link>,
            },
          ]}
        />

        {isNetworkSide && networkContent ? (
          <NetworkSide
            paths={networkPaths}
            steps={buyingSteps.map((step) => ({
              id: step.key,
              text: step.body ? `${step.title}. ${step.body}` : step.title,
            }))}
            moneySteps={networkMoneySteps}
            summary={networkContent.summary}
            terms={networkContent.terms}
            labels={{
              pathsEyebrow: tNetwork('paths.eyebrow'),
              pathsTitle: tNetwork('paths.title'),
              chapterLabel: tNetwork('paths.chapterLabel'),
              openPath: tNetwork('paths.open'),
              workEyebrow: tNetwork('work.eyebrow'),
              workTitle: tNetwork('work.title'),
              moneyEyebrow: tNetwork('money.eyebrow'),
              moneyTitle: tNetwork('money.title'),
              moneyIntro: tNetwork('money.intro'),
              stamp: tNetwork('money.stamp'),
              termsEyebrow: tNetwork('terms.eyebrow'),
              termsTitle: tNetwork('terms.title'),
              sourceTitle: tNetwork('terms.source'),
              absentTitle: tNetwork('terms.absent'),
              conditionTitle: tNetwork('terms.condition'),
              registrationEyebrow: tNetwork('registration.eyebrow'),
            }}
          />
        ) : (
          <>
            {buyingSteps.length > 0 ? (
              <StepSequence
                label={tSide(`buying.${side}`)}
                steps={buyingSteps}
                data-epic="side-buying-path"
                className={s.steps}
              />
            ) : null}

            {/* Only once a chapter has published offers (P4, R0). */}
            {chapters.length > 0 && (
              <SideChapterTable
                label={tSide('chaptersEyebrow')}
                title={tSide('chaptersTitle')}
                chapters={chapters}
                chapterLabel={tSide('chapterLabel')}
                typeLabel={tSide('typeLabel')}
                entryLabel={tSide('entryLabel')}
                offerCountLabel={tSide('offerCount')}
                className={s.chapters}
              />
            )}

            {/*
             * The reader's own button label goes on the button and its
             * sentence stays outside it (`docs/R1-GLOSARIUM-PEMBACA.md` §6),
             * where it was a heading over a generic "Mulai percakapan". The
             * contact page until K5 names a channel (P4, R0).
             */}
            {action ? (
              <FirstStep
                label={tSide('firstStepEyebrow')}
                body={action.after}
                action={{
                  href: '/kontak',
                  // A label, not a sentence: a stray full stop would sit
                  // on the button before its arrow.
                  label: action.label.replace(/\.$/u, ''),
                }}
              />
            ) : null}
          </>
        )}

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
  // The page shows the not-found view without a published title, or on the
  // network side without its required sentences, and the head says so too
  // rather than describing a page that is not there.
  const isNetworkSide = unit === 'peekabo' && side === 'jaringan'
  if (!content?.judul || (isNetworkSide && !networkTerms(content.jaringan))) {
    const tNotFound = await getTranslations('notFound')
    return generatePageMetadata({
      title: tNotFound('title'),
      noIndex: true,
      url: localizedPath(locale, sideTemplate(unit, side)),
    })
  }

  const description = content.langkahPertama?.sesudahnya
  return generatePageMetadata({
    title: content.judul,
    ...(description && { description }),
    url: localizedPath(locale, sideTemplate(unit, side)),
  })
}

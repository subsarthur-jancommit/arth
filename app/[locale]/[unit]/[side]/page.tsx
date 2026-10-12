import cn from 'clsx'
import { getTranslations } from 'next-intl/server'
import { locale as localeRootParam } from 'next/root-params'

import { LocalizedNotFound } from '@/app/[locale]/not-found'
import { Wrapper } from '@/components/layout/wrapper'
import { Link } from '@/components/ui/link'
import { NoScriptFrontDoors } from '@/components/ui/route-loading'
import { SampleContent } from '@/components/ui/sample-content'
import { SectionHeader } from '@/components/ui/section-header'
import { sideContent } from '@/lib/content/arthur-content'
import { ownerPlaceholder } from '@/lib/content/sample-content'
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

import s from './page.module.css'

/**
 * `/[locale]/{unit}/{side}` — the six side scaffolds.
 *
 * A side names the reader's vantage point, not an offer. Until the matching
 * Sanity type and approved source copy exist, the page may establish that
 * orientation but must not invent the reader's problem, Arthur's answer or a
 * call to action. Those three beats still need to be visible so the future
 * template can be judged; `SampleContent` and `ownerPlaceholder` make their
 * unfinished status unmissable to both a person and the production guard.
 */
interface SidePageProps {
  params: Promise<{ unit: string; side: string }>
}

/**
 * Six valid pairs rather than the eighteen-value Cartesian product.
 *
 * Keeping the pair here matters: `pelaku-proyek` is a real side, but it is
 * not a side of Teknologi. `isSideOf` repeats that relationship at request
 * time for paths that were not prerendered.
 */
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
  const [tUnit, tSide, tSample, content] = await Promise.all([
    getTranslations('unit'),
    getTranslations('side'),
    getTranslations('sample'),
    sideContent(locale, unit, side),
  ])
  const [firstSide, secondSide] = SIDES[unit]
  const otherSide = side === firstSide ? secondSide : firstSide
  const network =
    unit === 'peekabo' && side === 'jaringan' ? content?.jaringan : null
  const networkAction = network?.ajakanDaftar ?? null
  const hasNetworkAction = Boolean(
    networkAction?.label || networkAction?.sesudahnya
  )
  const hasNetworkContent = Boolean(
    network?.caraKerja ||
    network?.asalKomisi ||
    network?.yangTidakAda ||
    network?.syarat ||
    hasNetworkAction
  )

  return (
    <Wrapper theme="light">
      <article className={s.page}>
        <SectionHeader
          as="h1"
          eyebrow={tSide('eyebrow', { unit: tUnit(unit) })}
          title={content?.judul ?? tSide(side)}
        />

        <p className={cn('p-big', s.orientation)}>
          {tSide('orientation', {
            side: tSide(side),
            unit: tUnit(unit),
          })}
        </p>

        {content ? (
          <section className={s.sample}>
            {content.caraMembeli && content.caraMembeli.length > 0 && (
              <section className={s.prompt}>
                <h2 className={cn('caption', s.promptTitle)}>Cara membeli</h2>
                <ul className={cn('p-big', s.list)}>
                  {content.caraMembeli.map((item) => (
                    <li key={item._key}>{item.teks}</li>
                  ))}
                </ul>
              </section>
            )}
            {network && hasNetworkContent && (
              <section className={cn(s.prompt, s.network)}>
                <h2 className={cn('caption', s.promptTitle)}>
                  Aturan jaringan
                </h2>
                <dl className={s.networkTerms}>
                  {network.caraKerja && (
                    <div>
                      <dt>Cara kerja</dt>
                      <dd>{network.caraKerja}</dd>
                    </div>
                  )}
                  {network.asalKomisi && (
                    <div>
                      <dt>Asal komisi</dt>
                      <dd>{network.asalKomisi}</dd>
                    </div>
                  )}
                  {network.yangTidakAda && (
                    <div>
                      <dt>Yang tidak ada</dt>
                      <dd>{network.yangTidakAda}</dd>
                    </div>
                  )}
                  {network.syarat && (
                    <div>
                      <dt>Syarat</dt>
                      <dd>{network.syarat}</dd>
                    </div>
                  )}
                </dl>
                {networkAction && hasNetworkAction && (
                  <div className={s.networkAction}>
                    {networkAction.label && (
                      <h3 className="p-big">{networkAction.label}</h3>
                    )}
                    {networkAction.sesudahnya && (
                      <p className="p">{networkAction.sesudahnya}</p>
                    )}
                  </div>
                )}
              </section>
            )}
            {content.bab && content.bab.length > 0 && (
              <section className={s.prompt}>
                <h2 className={cn('caption', s.promptTitle)}>Pilih situasi</h2>
                <ul className={s.chapters}>
                  {content.bab.map((chapter) => (
                    <li key={chapter._id}>
                      {chapter.slug ? (
                        <Link
                          href={`${sideTemplate(unit, side)}/${chapter.slug}`}
                          className={cn('p-big', s.chapterLink)}
                        >
                          {chapter.nama}
                        </Link>
                      ) : (
                        <span className="p-big">{chapter.nama}</span>
                      )}
                      {chapter.kutipan && (
                        <p className="p">{chapter.kutipan}</p>
                      )}
                    </li>
                  ))}
                </ul>
              </section>
            )}
            {content.langkahPertama && (
              <section className={s.prompt}>
                <h2 className={cn('caption', s.promptTitle)}>
                  {content.langkahPertama.label}
                </h2>
                <p className={cn('p-big', s.placeholder)}>
                  {content.langkahPertama.sesudahnya}
                </p>
              </section>
            )}
          </section>
        ) : (
          <SampleContent
            label={tSample('label')}
            note={tSample('sideNote')}
            className={s.sample}
          >
            <section className={s.prompt}>
              <h2 className={cn('caption', s.promptTitle)}>
                {tSide('problemTitle')}
              </h2>
              <p className={cn('p-big', s.placeholder)}>
                {ownerPlaceholder(
                  tSide('problemNeed'),
                  tSide('problemExample')
                )}
              </p>
            </section>

            <section className={s.prompt}>
              <h2 className={cn('caption', s.promptTitle)}>
                {tSide('answerTitle')}
              </h2>
              <p className={cn('p-big', s.placeholder)}>
                {ownerPlaceholder(tSide('answerNeed'), tSide('answerExample'))}
              </p>
            </section>

            <section className={s.prompt}>
              <h2 className={cn('caption', s.promptTitle)}>
                {tSide('firstStepTitle')}
              </h2>
              <p className={cn('p-big', s.placeholder)}>
                {ownerPlaceholder(
                  tSide('firstStepNeed'),
                  tSide('firstStepExample')
                )}
              </p>
            </section>
          </SampleContent>
        )}

        <nav
          aria-label={tSide('navigationLabel', { unit: tUnit(unit) })}
          className={s.navigation}
        >
          <Link
            href={sideTemplate(unit, otherSide)}
            className={cn('caption', s.route)}
            data-press="chip"
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

  const [tUnit, tSide, content] = await Promise.all([
    getTranslations('unit'),
    getTranslations('side'),
    sideContent(locale, unit, side),
  ])
  const unitLabel = tUnit(unit)
  const sideLabel = tSide(side)

  return generatePageMetadata({
    title: content?.judul ?? `${sideLabel} — ${unitLabel}`,
    description:
      content?.langkahPertama?.sesudahnya ??
      tSide('metaDescription', {
        side: sideLabel,
        unit: unitLabel,
      }),
    url: localizedPath(locale, sideTemplate(unit, side)),
  })
}

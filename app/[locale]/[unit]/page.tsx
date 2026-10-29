import cn from 'clsx'
import { getTranslations } from 'next-intl/server'
import { draftMode } from 'next/headers'
import { notFound } from 'next/navigation'
import { locale as localeRootParam } from 'next/root-params'

import { LocalizedNotFound } from '@/app/[locale]/not-found'
import { Wrapper } from '@/components/layout/wrapper'
import { Link } from '@/components/ui/link'
import { SectionHeader } from '@/components/ui/section-header'
import { unitContent, type UnitContent } from '@/lib/content/arthur-content'
import {
  isSideOf,
  isUnit,
  SIDES,
  type Unit,
  UNITS,
  unitSteps,
  unitTemplate,
} from '@/lib/content/units'
import { localizedPath } from '@/lib/i18n/paths'
import { isLocale, type Locale, routing } from '@/lib/i18n/routing'
import { generatePageMetadata } from '@/lib/utils/metadata'
import { CapabilitySet } from '@/vault/blocks/capability-set'
import { NextPractice } from '@/vault/blocks/next-practice'
import { SideDoors, type SideDoor } from '@/vault/blocks/side-doors'
import { UnitHero } from '@/vault/blocks/unit-hero'
import { Reveal } from '@/vault/motion/reveal'

import s from './page.module.css'

interface UnitPageProps {
  params: Promise<{ unit: string }>
}

type Offer = NonNullable<UnitContent['contohOffer']>[number]

export function generateStaticParams() {
  return UNITS.map((unit) => ({ unit }))
}

function nextUnitAfter(unit: Unit): Unit {
  const index = UNITS.indexOf(unit)
  return UNITS[(index + 1) % UNITS.length] ?? UNITS[0]
}

function offerRoute(offer: Offer): string | null {
  const unit = offer.bab?.side?.unit
  const side = offer.bab?.side?.kunci
  const chapter = offer.bab?.slug

  if (
    !offer.slug ||
    !unit ||
    !isUnit(unit) ||
    !side ||
    !isSideOf(unit, side) ||
    !chapter
  ) {
    return null
  }

  // An offer without its own page is read in its situation's list.
  const situation = `/${unit}/${side}/${chapter}`
  return offer.punyaHalaman ? `${situation}/${offer.slug}` : situation
}

function sideDoorsFor(unit: Unit, content: UnitContent): SideDoor[] {
  return SIDES[unit].flatMap((side) => {
    const door = content.sisi?.find((item) => item.kunci === side)

    return door?.nama && door.judul
      ? [{ id: door._id, key: side, name: door.nama, title: door.judul }]
      : []
  })
}

export default async function UnitPage({ params }: UnitPageProps) {
  const { unit } = await params
  if (!isUnit(unit)) notFound()

  const requested = await localeRootParam()
  const locale: Locale = isLocale(requested) ? requested : routing.defaultLocale
  const { isEnabled } = await draftMode()
  const [t, content] = await Promise.all([
    getTranslations('unit'),
    unitContent(locale, unit, isEnabled),
  ])
  /*
   * Sanity is the only home of a unit's words since V6
   * (docs/RENCANA-KONTEKS-V2.md). Without a published header the route shows
   * the not-found view, as /cara-kerja does, instead of a copy kept in code
   * that a Studio edit could never reach. Every block below it renders only
   * when its own field is filled.
   */
  if (!content?.nama || !content.judul || !content.pembuka) {
    return <LocalizedNotFound />
  }

  const name = content.nama
  const title = content.judul
  const statement = content.pembuka
  const subtitle = content.subjudul
  // The header's labelled paragraphs, word for word (Aturan isi 11).
  const pillars = (content.pilar ?? []).flatMap((pillar) =>
    pillar.lead && pillar.isi
      ? [{ key: pillar._key, lead: pillar.lead, body: pillar.isi }]
      : []
  )
  const problems = (content.masalah ?? []).flatMap((item) =>
    item.teks ? [{ key: item._key, text: item.teks }] : []
  )
  const workItems = unitSteps(content.caraKerja)
  const examples = (content.contohOffer ?? []).flatMap((offer) => {
    const href = offerRoute(offer)
    return href && offer.judul ? [{ ...offer, href }] : []
  })
  const bridges = (content.jembatan ?? []).flatMap((bridge) => {
    const href = bridge.offer ? offerRoute(bridge.offer) : null
    return href && bridge.kalimat && bridge.offer?.judul
      ? [{ ...bridge, href, label: bridge.offer.judul }]
      : []
  })
  const action =
    content.ajakan?.label && content.ajakan.sesudahnya
      ? { label: content.ajakan.label, after: content.ajakan.sesudahnya }
      : null
  const nextUnit = nextUnitAfter(unit)

  return (
    <Wrapper theme="light">
      <article className={s.page}>
        {/*
         * The opening is a stage, the rest is a document (R4): the hero sits
         * in a dark band and the page below it stays light. `data-theme` on
         * the band is enough, because the colour tokens resolve per element.
         */}
        <div data-theme="dark" className={s.stage}>
          <UnitHero
            unit={unit}
            eyebrow={t('eyebrow')}
            name={name}
            title={title}
            subtitle={subtitle}
            statement={statement}
            sideCount={t('sideCount', { count: SIDES[unit].length })}
          />
        </div>

        {pillars.length > 0 ? (
          <Reveal as="section" className={s.section} perItem>
            <SectionHeader reveal eyebrow={name} title={t('pillarsTitle')} />
            <ol className={s.problemList}>
              {pillars.map((pillar) => (
                <li key={pillar.key} data-reveal-item className={s.pillar}>
                  <p className="h3">{pillar.lead}</p>
                  <p className="p-big">{pillar.body}</p>
                </li>
              ))}
            </ol>
          </Reveal>
        ) : null}

        <SideDoors
          unit={unit}
          eyebrow={t('sideEyebrow')}
          title={t('sideTitle')}
          linkLabel={t('sideLink')}
          doors={sideDoorsFor(unit, content)}
        />

        {problems.length > 0 ? (
          <Reveal as="section" className={s.section} perItem>
            <SectionHeader
              reveal
              eyebrow={t('problemsEyebrow')}
              title={t('problemsTitle')}
            />
            <ol className={s.problemList}>
              {problems.map((problem, index) => (
                <li key={problem.key} data-reveal-item className={s.problem}>
                  <span className="caption">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  <p className="h3">{problem.text}</p>
                </li>
              ))}
            </ol>
          </Reveal>
        ) : null}

        {examples.length > 0 ? (
          <Reveal as="section" className={s.section} perItem>
            <SectionHeader
              reveal
              eyebrow={t('examplesEyebrow')}
              title={t('examplesTitle')}
            />
            <ul className={s.cardList}>
              {examples.map((offer) => (
                <li key={offer._id} data-reveal-item>
                  <Link href={offer.href} className={s.card} data-intent="">
                    <span className={cn('caption', s.cardKind)}>
                      {offer.jenis}
                    </span>
                    <span className="h3">{offer.judul}</span>
                    {offer.untukSiapa ? (
                      <span className="caption">
                        {t('forAudience', { audience: offer.untukSiapa })}
                      </span>
                    ) : null}
                    {offer.dampak ? (
                      <span className="p">{offer.dampak}</span>
                    ) : null}
                  </Link>
                </li>
              ))}
            </ul>
          </Reveal>
        ) : null}

        {workItems.length > 0 ? (
          <CapabilitySet
            label={t('workEyebrow')}
            items={workItems}
            data-epic="unit-method"
            className={s.work}
          />
        ) : null}

        {bridges.length > 0 ? (
          <Reveal as="section" className={s.section} perItem>
            <SectionHeader
              reveal
              eyebrow={t('bridgeEyebrow')}
              title={t('bridgeTitle')}
            />
            <ul className={s.bridgeList}>
              {bridges.map((bridge) => (
                <li key={bridge._key} data-reveal-item className={s.bridge}>
                  <p className="p-big">{bridge.kalimat}</p>
                  <Link href={bridge.href} className="caption" data-intent="">
                    {bridge.label}
                  </Link>
                </li>
              ))}
            </ul>
          </Reveal>
        ) : null}

        {action ? (
          <Reveal as="section" className={s.action}>
            <p data-reveal-item className="caption">
              {t('ctaEyebrow')}
            </p>
            <h2 data-reveal-item className="h2">
              {action.label}
            </h2>
            <p data-reveal-item className="p-big">
              {action.after}
            </p>
            {/* The contact page until K5 names a channel (P4, R0). */}
            <p data-reveal-item>
              <Link href="/kontak" className={cn('caption', s.actionLink)}>
                {t('ctaLink')}
              </Link>
            </p>
          </Reveal>
        ) : null}

        <NextPractice
          href={unitTemplate(nextUnit)}
          eyebrow={t('nextUnit')}
          label={t(nextUnit)}
          className={s.nextUnit}
        />
      </article>
    </Wrapper>
  )
}

export async function generateMetadata({ params }: UnitPageProps) {
  const { unit } = await params
  const requested = await localeRootParam()
  const locale: Locale = isLocale(requested) ? requested : routing.defaultLocale

  if (!isUnit(unit)) {
    const tNotFound = await getTranslations('notFound')
    return generatePageMetadata({
      title: tNotFound('title'),
      noIndex: true,
      url: localizedPath(locale, '/'),
    })
  }

  const content = await unitContent(locale, unit)
  // The same condition the page renders on, so the head never describes a
  // page that shows the not-found view.
  if (!content?.nama || !content.judul || !content.pembuka) {
    const tNotFound = await getTranslations('notFound')
    return generatePageMetadata({
      title: tNotFound('title'),
      noIndex: true,
      url: localizedPath(locale, unitTemplate(unit)),
    })
  }

  return generatePageMetadata({
    title: content.judul,
    ...(content.ringkas && { description: content.ringkas }),
    url: localizedPath(locale, unitTemplate(unit)),
  })
}

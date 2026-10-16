import cn from 'clsx'
import { getTranslations } from 'next-intl/server'
import { draftMode } from 'next/headers'
import { notFound } from 'next/navigation'
import { locale as localeRootParam } from 'next/root-params'

import { Wrapper } from '@/components/layout/wrapper'
import { Link } from '@/components/ui/link'
import { SectionHeader } from '@/components/ui/section-header'
import { unitContent, type UnitContent } from '@/lib/content/arthur-content'
import { UNIT_FALLBACKS } from '@/lib/content/unit-fallback'
import {
  isSideOf,
  isUnit,
  SIDES,
  type Unit,
  UNITS,
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

function sideDoorsFor(unit: Unit, content: UnitContent | null): SideDoor[] {
  const fallback = UNIT_FALLBACKS[unit]

  return SIDES[unit].map((side) => {
    const candidate = content?.sisi?.find((item) => item.kunci === side)
    const backup = fallback.sisi.find((item) => item.kunci === side)

    return {
      id: candidate?._id ?? backup?._id ?? side,
      key: side,
      name: candidate?.nama ?? backup?.nama ?? side,
      title: candidate?.judul ?? backup?.judul ?? side,
    }
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
  const fallback = UNIT_FALLBACKS[unit]
  const name = content?.nama ?? fallback.nama
  const title = content?.judul ?? fallback.judul
  const statement = content?.pembuka ?? fallback.pembuka
  const subtitle = content?.subjudul ?? null
  // The header's labelled paragraphs, word for word (Aturan isi 11).
  const pillars = (content?.pilar ?? []).flatMap((pillar) =>
    pillar.lead && pillar.isi
      ? [{ key: pillar._key, lead: pillar.lead, body: pillar.isi }]
      : []
  )
  const problems = content?.masalah?.length ? content.masalah : fallback.masalah
  const candidateWorkItems = (content?.caraKerja ?? []).flatMap((item) =>
    item.teks ? [item.teks] : []
  )
  const workItems = candidateWorkItems.length
    ? candidateWorkItems
    : fallback.caraKerja.map((item) => item.teks)
  const examples = (content?.contohOffer ?? []).flatMap((offer) => {
    const href = offerRoute(offer)
    return href && offer.judul ? [{ ...offer, href }] : []
  })
  const bridges = (content?.jembatan ?? []).flatMap((bridge) => {
    const href = bridge.offer ? offerRoute(bridge.offer) : null
    return href && bridge.kalimat && bridge.offer?.judul
      ? [{ ...bridge, href, label: bridge.offer.judul }]
      : []
  })
  const action = content?.ajakan ?? fallback.ajakan
  const nextUnit = nextUnitAfter(unit)

  return (
    <Wrapper theme="light">
      <article className={s.page}>
        <UnitHero
          unit={unit}
          eyebrow={t('eyebrow')}
          name={name}
          title={title}
          subtitle={subtitle}
          statement={statement}
          sideCount={t('sideCount', { count: SIDES[unit].length })}
        />

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

        <Reveal as="section" className={s.section} perItem>
          <SectionHeader
            reveal
            eyebrow={t('problemsEyebrow')}
            title={t('problemsTitle')}
          />
          <ol className={s.problemList}>
            {problems.map((problem, index) => (
              <li key={problem._key} data-reveal-item className={s.problem}>
                <span className="caption">
                  {String(index + 1).padStart(2, '0')}
                </span>
                <p className="h3">{problem.teks}</p>
              </li>
            ))}
          </ol>
        </Reveal>

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

        <CapabilitySet
          label={t('workEyebrow')}
          items={workItems}
          data-epic="unit-method"
          className={s.work}
        />

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

        <Reveal as="section" className={s.action}>
          <p data-reveal-item className="caption">
            {t('ctaEyebrow')}
          </p>
          <h2 data-reveal-item className="h2">
            {action.label}
          </h2>
          <p data-reveal-item className="p-big">
            {action.sesudahnya}
          </p>
          {/* The contact page until K5 names a channel (P4, R0). */}
          <p data-reveal-item>
            <Link href="/kontak" className={cn('caption', s.actionLink)}>
              {t('ctaLink')}
            </Link>
          </p>
        </Reveal>

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
  const fallback = UNIT_FALLBACKS[unit]

  return generatePageMetadata({
    title: content?.judul ?? fallback.judul,
    description: content?.ringkas ?? content?.pembuka ?? fallback.pembuka,
    url: localizedPath(locale, unitTemplate(unit)),
  })
}

import cn from 'clsx'
import { getTranslations } from 'next-intl/server'
import { draftMode } from 'next/headers'
import { locale as localeRootParam } from 'next/root-params'

import { Wrapper } from '@/components/layout/wrapper'
import { Link } from '@/components/ui/link'
import { SectionHeader } from '@/components/ui/section-header'
import {
  HOME_PILLAR_FALLBACKS,
  HOME_SITUATION_FALLBACKS,
  resolveHomeContent,
} from '@/lib/content/home-fallback'
import { canRenderPublicContent } from '@/lib/content/public-content-guard'
import { UNIT_FALLBACKS } from '@/lib/content/unit-fallback'
import { latestWriting } from '@/lib/content/unit-writing'
import { isSideOf, isUnit, sideTemplate, UNITS } from '@/lib/content/units'
import { isLocale, type Locale, routing } from '@/lib/i18n/routing'
import { isConfigured } from '@/lib/integrations/registry'
import { sanityFetch } from '@/lib/integrations/sanity/live'
import {
  homeUnitsPreviewQuery,
  homeUnitsQuery,
  siteSettingsPreviewQuery,
  siteSettingsQuery,
} from '@/lib/integrations/sanity/queries'
import { ContactBlock } from '@/vault/blocks/contact-block'
import { Hero } from '@/vault/blocks/hero'
import { LatestWriting } from '@/vault/blocks/latest-writing'
import { PracticeList } from '@/vault/blocks/practice-list'
import { SituationLinks } from '@/vault/blocks/situation-links'
import { StudioNote } from '@/vault/blocks/studio-note'
import { Reveal } from '@/vault/motion/reveal'

import s from './page.module.css'

async function fetchPublishedHome(locale: Locale) {
  'use cache'

  const [settings, units] = await Promise.all([
    sanityFetch({
      query: siteSettingsQuery,
      params: { locale },
      perspective: 'published',
      stega: false,
    }),
    sanityFetch({
      query: homeUnitsQuery,
      params: { locale },
      perspective: 'published',
      stega: false,
    }),
  ])

  return { settings: settings.data, units: units.data, isDraftMode: false }
}

async function fetchPreviewHome(locale: Locale) {
  'use cache'

  const [settings, units] = await Promise.all([
    sanityFetch({
      query: siteSettingsPreviewQuery,
      params: { locale },
      perspective: 'drafts',
      stega: true,
    }),
    sanityFetch({
      query: homeUnitsPreviewQuery,
      params: { locale },
      perspective: 'drafts',
      stega: true,
    }),
  ])

  return { settings: settings.data, units: units.data, isDraftMode: true }
}

async function fetchHomeForRequest(locale: Locale) {
  // A project without Sanity configured still renders a complete page: every
  // section falls back to the master brief's ready-to-publish text.
  if (!isConfigured('sanity')) {
    return { settings: null, units: [], isDraftMode: false }
  }

  const { isEnabled } = await draftMode()
  return isEnabled ? fetchPreviewHome(locale) : fetchPublishedHome(locale)
}

/**
 * The home page: `main`'s composition with Arthur's words.
 *
 * Fase 1 kept `main`'s sections; V1 of docs/RENCANA-KONTEKS-V2.md changes
 * what they carry. The fixture work grid and its passage are gone (decision
 * D1): its works, clients, and photographs were never Arthur's (Aturan isi
 * 13). The page now reads as the plan's home: the umbrella header, the three
 * units, the reader's situation, the umbrella's labelled paragraphs, and the
 * first step. The drawing plates of R4 bring a pinned passage back.
 */
export default async function Home() {
  const requested = await localeRootParam()
  const locale: Locale = isLocale(requested) ? requested : routing.defaultLocale

  const [{ settings, units, isDraftMode }, t, latest] = await Promise.all([
    fetchHomeForRequest(locale),
    getTranslations('home'),
    latestWriting(locale),
  ])

  const content = resolveHomeContent(locale, settings)

  /*
   * Each unit's name and one-line summary, from its approved document when it
   * passes the public-content guard and from the master brief's ready header
   * otherwise.
   */
  const unitEntries = UNITS.map((value) => {
    const fallback = UNIT_FALLBACKS[value]
    const candidate = units.find((unit) => unit.kunci === value)
    const label = candidate?.nama ?? fallback.nama
    const intro = candidate?.ringkas ?? fallback.ringkas
    return canRenderPublicContent(`home unit/${value}`, [label, intro])
      ? { value, label, intro }
      : { value, label: fallback.nama, intro: fallback.ringkas }
  })
  const unitLabel = (value: string) =>
    unitEntries.find((unit) => unit.value === value)?.label ?? value

  /*
   * “Pilih situasi Anda”: each situation opens its chapter once that chapter
   * is published, and its side page until then (docs/RENCANA-KONTEKS-V2.md
   * §4.2), so no situation links to a page that is not there.
   */
  const sourceSituations =
    settings?.situasi && settings.situasi.length > 0
      ? settings.situasi.map((situation) => ({
          key: situation._key,
          text: situation.teks,
          unit: situation.unit,
          side: situation.sisi,
          chapter: situation.babTujuan,
        }))
      : HOME_SITUATION_FALLBACKS.map((situation) => ({
          key: situation.key,
          text: situation.text,
          unit: situation.unit,
          side: situation.side,
          chapter: null,
        }))
  const situations = sourceSituations.flatMap((situation) => {
    const unit = situation.unit ?? undefined
    const side = situation.side ?? undefined
    if (!situation.text || !isUnit(unit) || !isSideOf(unit, side)) return []
    if (
      !canRenderPublicContent(`home situation/${situation.key}`, [
        situation.text,
      ])
    ) {
      return []
    }

    const chapter = situation.chapter
    const sidePath = sideTemplate(unit, side)
    const href =
      chapter?.slug && chapter.unit === unit && chapter.sisi === side
        ? `${sidePath}/${chapter.slug}`
        : sidePath
    return [
      {
        key: situation.key,
        text: situation.text,
        href,
        destination: unitLabel(unit),
      },
    ]
  })

  /* The umbrella header's labelled paragraphs, word for word. */
  const candidatePillars = (settings?.pilar ?? []).flatMap((pillar) =>
    pillar.lead && pillar.isi
      ? [{ key: pillar._key, lead: pillar.lead, body: pillar.isi }]
      : []
  )
  const pillars = (
    candidatePillars.length
      ? candidatePillars
      : HOME_PILLAR_FALLBACKS.map((pillar) => ({
          key: pillar.key,
          lead: pillar.lead,
          body: pillar.isi,
        }))
  ).filter((pillar) =>
    canRenderPublicContent(`home pillar/${pillar.key}`, [
      pillar.lead,
      pillar.body,
    ])
  )
  const opening = settings?.opening ?? content.statementFallback[0] ?? null

  const actionLabel = settings?.ajakan?.label ?? t('actionFallback')
  const actionAfter = settings?.ajakan?.sesudahnya ?? t('actionAfterFallback')

  return (
    /*
     * `webgl` for the hero's SceneShell, `gsap` for its timeline. No
     * `simTypes`: the flowmap's reader was the work grid's material, removed
     * here with the grid (`docs/TINJAUAN-F01-F03.md` B5).
     */
    <Wrapper theme="dark" lenis={{ anchors: true }} webgl gsap>
      <Hero
        headline={content.headline}
        subline={content.subline}
        /*
         * The hero's counterweight (Tahap 67): the index in the top right,
         * headline and action bottom left. The labels are the unit list's
         * own, so the hero names exactly what the page opens below.
         */
        index={{
          label: t('heroIndexLabel'),
          items: unitEntries.map((unit) => unit.label),
        }}
        action={
          /* oxlint-disable-next-line react/forbid-elements -- a same-page jump must keep working when JavaScript is disabled */
          <a
            href="#situasi"
            className={cn('cta', s.heroCta)}
            data-press="cta"
            data-intent=""
          >
            {t('heroCta')}
          </a>
        }
      />

      <div className={s.sections}>
        {isDraftMode && (
          <p className={cn('caption', s.previewFlag)} role="status">
            {t('draftPreview')}
          </p>
        )}

        {/*
          The three units, opened one at a time. Each panel links the unit's
          own page, which is where the sides and their situations begin.
        */}
        <PracticeList
          id="unit"
          className={s.section}
          eyebrow={t('practiceEyebrow')}
          title={t('practiceTitle')}
          linkLabel={t('practiceLink')}
          entries={unitEntries}
        />

        <SituationLinks
          className={s.section}
          situations={situations}
          eyebrow={t('situationEyebrow')}
          title={t('situationTitle')}
          destinationLabel={t('situationDestination')}
        />

        <StudioNote id="studio" className={s.section} title={t('studioTitle')}>
          <div className={s.statement} data-statement="header">
            {opening ? <p className="p-big">{opening}</p> : null}
            <ol className={s.pillars}>
              {pillars.map((pillar) => (
                <li key={pillar.key} className={s.pillar}>
                  <p className="h3">{pillar.lead}</p>
                  <p className="p">{pillar.body}</p>
                </li>
              ))}
            </ol>
          </div>
        </StudioNote>

        {latest && (
          <LatestWriting
            className={s.section}
            eyebrow={t('journalEyebrow')}
            entry={latest}
            practice={latest.unit ? unitLabel(latest.unit) : undefined}
            allLabel={t('journalAll')}
            locale={locale}
          />
        )}

        {/*
          The first step. Until K5 names a real channel the fallback address
          is a reserved `.invalid` placeholder, and P4 is that a reader never
          sees one, so the action points to the contact page instead.
        */}
        {content.fallbacks.email ? (
          <Reveal as="section" id="contact" className={s.section}>
            <SectionHeader
              eyebrow={t('actionEyebrow')}
              title={`${actionLabel} ${actionAfter}`}
            />
            <p data-reveal-item>
              <Link
                href="/kontak"
                className={cn('cta', s.heroCta)}
                data-press="cta"
                data-intent=""
              >
                {t('actionLink')}
              </Link>
            </p>
          </Reveal>
        ) : (
          <ContactBlock
            id="contact"
            className={s.section}
            eyebrow={t('actionEyebrow')}
            title={`${actionLabel} ${actionAfter}`}
            email={content.email}
            address={content.address}
            addressHeading={t('addressHeading')}
            addressIsPlaceholder={content.fallbacks.address}
            emailLabel={t('emailLabel', { name: content.name })}
            socials={content.socials}
            socialsHeading={t('socialsHeading')}
            copy={{
              label: t('copyAddress'),
              copied: t('addressCopied'),
              failed: t('copyFailed'),
            }}
          />
        )}
      </div>
    </Wrapper>
  )
}

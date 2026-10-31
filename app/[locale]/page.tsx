import cn from 'clsx'
import { getTranslations } from 'next-intl/server'
import { draftMode } from 'next/headers'
import { locale as localeRootParam } from 'next/root-params'

import { LocalizedNotFound } from '@/app/[locale]/not-found'
import { Wrapper } from '@/components/layout/wrapper'
import { SectionHeader } from '@/components/ui/section-header'
import { resolveHomeContent } from '@/lib/content/home-fallback'
import { canRenderPublicContent } from '@/lib/content/public-content-guard'
import { latestWriting } from '@/lib/content/unit-writing'
import {
  isSideOf,
  isUnit,
  sideTemplate,
  type Unit,
  UNITS,
  unitTemplate,
} from '@/lib/content/units'
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
import { FirstStepBand } from '@/vault/blocks/first-step-band'
import { Hero } from '@/vault/blocks/hero'
import { LatestWriting } from '@/vault/blocks/latest-writing'
import { Passage } from '@/vault/blocks/passage'
import { Plate } from '@/vault/blocks/plate'
import { PracticeList } from '@/vault/blocks/practice-list'
import { SituationLinks } from '@/vault/blocks/situation-links'
import { Reveal } from '@/vault/motion/reveal'
import { PlateMaterial } from '@/vault/webgl/plate-material'

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
  // Without Sanity there are no settings, and the page shows the not-found
  // view: since V6 the umbrella header lives in Sanity only.
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
 * first step. R4's working drawings bring the pinned passage back, ahead of
 * the units it introduces: one café, drawn by each of the three.
 */
export default async function Home() {
  const requested = await localeRootParam()
  const locale: Locale = isLocale(requested) ? requested : routing.defaultLocale

  const [{ settings, units, isDraftMode }, t, tUnit, tPlate, latest] =
    await Promise.all([
      fetchHomeForRequest(locale),
      getTranslations('home'),
      getTranslations('unit'),
      getTranslations('plates'),
      latestWriting(locale),
    ])

  const content = resolveHomeContent(locale, settings)

  /*
   * Sanity is the only home of the umbrella header since V6
   * (docs/RENCANA-KONTEKS-V2.md). Without a published headline the route
   * shows the not-found view instead of a copy kept in code, and every
   * section below renders only what its own field holds.
   */
  if (!content.headline) return <LocalizedNotFound />

  /*
   * Each unit's name and one-line summary, from its approved document when it
   * passes the public-content guard. A unit without one is left out.
   */
  const unitEntries = UNITS.flatMap((value) => {
    const candidate = units.find((unit) => unit.kunci === value)
    const label = candidate?.nama
    const intro = candidate?.ringkas
    // The unit header's own short line, under its name in the hero's index.
    const line = candidate?.judul ?? undefined
    return label &&
      intro &&
      canRenderPublicContent(`home unit/${value}`, [label, intro, line])
      ? [{ value, label, intro, line }]
      : []
  })
  const unitLabel = (value: Unit) =>
    unitEntries.find((unit) => unit.value === value)?.label ?? tUnit(value)

  /*
   * “Pilih situasi Anda”: each situation opens its chapter once that chapter
   * is published, and its side page until then (docs/RENCANA-KONTEKS-V2.md
   * §4.2), so no situation links to a page that is not there.
   */
  const sourceSituations = (settings?.situasi ?? []).map((situation) => ({
    key: situation._key,
    text: situation.teks,
    unit: situation.unit,
    side: situation.sisi,
    chapter: situation.babTujuan,
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
  const allPillars = (settings?.pilar ?? [])
    .flatMap((pillar) =>
      pillar.lead && pillar.isi
        ? [{ key: pillar._key, lead: pillar.lead, body: pillar.isi }]
        : []
    )
    .filter((pillar) =>
      canRenderPublicContent(`home pillar/${pillar.key}`, [
        pillar.lead,
        pillar.body,
      ])
    )
  /*
   * The header's last paragraph closes the page (R5, after the approved
   * closing screen): it is how Arthur holds the work, "Cara kami bekerja.",
   * and it sits beside the first step as the answer to it, one sentence per
   * row. Every word stays the header's; only its place moves. With a single
   * paragraph there is nothing to split off, and it stays in the statement.
   */
  const closing = allPillars.length > 1 ? allPillars.at(-1) : undefined
  const pillars = closing ? allPillars.slice(0, -1) : allPillars
  const closingTerms = closing
    ? {
        title: closing.lead.replace(/\.$/u, ''),
        items: closing.body.split(/(?<=\.)\s+/u).filter(Boolean),
      }
    : undefined
  const opening = settings?.opening ?? null

  /*
   * The pinned path (R4, E1.2): each unit's working drawing, in the order the
   * unit list reads. A unit the list leaves out (no approved name or summary)
   * is left out here too, so no plate stands for a unit the page does not
   * open.
   */
  const plates = unitEntries.map((unit) => ({
    id: unit.value,
    unit: unit.label,
    title: tPlate(`${unit.value}.job`),
    meta: tPlate(`${unit.value}.drawing`),
    /*
     * The flat plate inside its WebGL material: on a desktop with WebGL the
     * plate is lit as direction B's model and turns as the reader scrolls;
     * everywhere else the flat plate is all there is, and the whole drawing.
     */
    media: (
      <PlateMaterial unit={unit.value}>
        <Plate
          unit={unit.value}
          title={tPlate(`${unit.value}.title`)}
          description={tPlate(`${unit.value}.description`)}
        />
      </PlateMaterial>
    ),
  }))

  const actionLabel = settings?.ajakan?.label ?? t('actionFallback')
  const actionAfter = settings?.ajakan?.sesudahnya ?? t('actionAfterFallback')

  return (
    /*
     * `webgl` for the hero's SceneShell and the passage's lit plates, `gsap`
     * for their timelines. No `simTypes`: the flowmap's reader was the work
     * grid's material, removed here with the grid
     * (`docs/TINJAUAN-F01-F03.md` B5), and the plates read the reader's
     * scroll, not the pointer.
     */
    <Wrapper theme="dark" lenis={{ anchors: true }} webgl gsap>
      <Hero
        headline={content.headline}
        subline={content.subline ?? undefined}
        /*
         * The hero's counterweight (Tahap 67): the index in the top right,
         * headline and action bottom left. The labels are the unit list's
         * own, so the hero names exactly what the page opens below.
         */
        index={{
          label: t('heroIndexLabel'),
          items: unitEntries.map((unit) => ({
            label: unit.label,
            note: unit.line,
            href: unitTemplate(unit.value),
          })),
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

        <Passage plates={plates} note={tPlate('note')}>
          <SectionHeader
            eyebrow={t('passageEyebrow')}
            title={t('passageTitle')}
          />
        </Passage>

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

        {/*
          The umbrella header's labelled paragraphs, two to a row on desktop
          (R5). Inside the studio note's 65ch prose column they ran as one
          narrow stack with most of a 1440px screen empty beside it, the
          450 to 800px band R3 set out to remove; here they take the page's
          width, and each lead stays beside its own paragraph.
        */}
        {pillars.length > 0 || opening ? (
          <Reveal as="section" id="studio" className={s.section} perItem>
            <SectionHeader reveal title={t('studioTitle')} />
            <div className={s.statement} data-statement="header">
              {opening ? (
                <p data-reveal-item className={cn('p-big', s.opening)}>
                  {opening}
                </p>
              ) : null}
              <ol className={s.pillars}>
                {pillars.map((pillar) => (
                  <li key={pillar.key} data-reveal-item className={s.pillar}>
                    <p className="h3">{pillar.lead}</p>
                    <p className="p">{pillar.body}</p>
                  </li>
                ))}
              </ol>
            </div>
          </Reveal>
        ) : null}

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
          sees one, so the action points to the contact page instead. Beside
          it, the header's last paragraph as the terms the reader is offered
          in return (R5, the approved closing screen).
        */}
        {content.fallbacks.email ? (
          <FirstStepBand
            id="contact"
            className={s.section}
            terms={closingTerms}
            eyebrow={t('actionEyebrow')}
            title={`${actionLabel} ${actionAfter}`}
            action={{ href: '/kontak', label: t('actionLink') }}
          />
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

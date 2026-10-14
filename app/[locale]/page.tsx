import cn from 'clsx'
import { getTranslations } from 'next-intl/server'
import { draftMode } from 'next/headers'
import { locale as localeRootParam } from 'next/root-params'

import { Wrapper } from '@/components/layout/wrapper'
import { Link } from '@/components/ui/link'
import { SectionHeader } from '@/components/ui/section-header'
import {
  HOME_SITUATION_FALLBACKS,
  HOME_UNIT_FALLBACKS,
  resolveHomeContent,
} from '@/lib/content/home-fallback'
import { canRenderPublicContent } from '@/lib/content/public-content-guard'
import {
  isSideOf,
  isUnit,
  sideTemplate,
  UNITS,
  unitTemplate,
} from '@/lib/content/units'
import { isLocale, type Locale, routing } from '@/lib/i18n/routing'
import { isConfigured } from '@/lib/integrations/registry'
import { sanityFetch } from '@/lib/integrations/sanity/live'
import {
  homeUnitsPreviewQuery,
  homeUnitsQuery,
  howWeWorkPreviewQuery,
  howWeWorkQuery,
  siteSettingsPreviewQuery,
  siteSettingsQuery,
} from '@/lib/integrations/sanity/queries'
import { ContactBlock } from '@/vault/blocks/contact-block'
import { Hero } from '@/vault/blocks/hero'
import { SituationLinks } from '@/vault/blocks/situation-links'
import { StudioNote } from '@/vault/blocks/studio-note'
import { type UnitDoor, UnitDoors } from '@/vault/blocks/unit-doors'
import { Reveal } from '@/vault/motion/reveal'

import s from './page.module.css'

const FLOWMAP_SIM: ('fluid' | 'flowmap')[] = ['flowmap']

async function fetchPublishedHome(locale: Locale) {
  'use cache'

  const [settings, units, howWeWork] = await Promise.all([
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
    sanityFetch({
      query: howWeWorkQuery,
      params: { locale },
      perspective: 'published',
      stega: false,
    }),
  ])

  return {
    settings: settings.data,
    units: units.data,
    howWeWork: howWeWork.data,
    isDraftMode: false,
  }
}

async function fetchPreviewHome(locale: Locale) {
  'use cache'

  const [settings, units, howWeWork] = await Promise.all([
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
    sanityFetch({
      query: howWeWorkPreviewQuery,
      params: { locale },
      perspective: 'drafts',
      stega: true,
    }),
  ])

  return {
    settings: settings.data,
    units: units.data,
    howWeWork: howWeWork.data,
    isDraftMode: true,
  }
}

async function fetchHomeForRequest(locale: Locale) {
  if (!isConfigured('sanity')) {
    return {
      settings: null,
      units: [],
      howWeWork: null,
      isDraftMode: false,
    }
  }

  const { isEnabled } = await draftMode()
  return isEnabled ? fetchPreviewHome(locale) : fetchPublishedHome(locale)
}

export default async function Home() {
  const requested = await localeRootParam()
  const locale: Locale = isLocale(requested) ? requested : routing.defaultLocale
  const [{ settings, units, howWeWork, isDraftMode }, t] = await Promise.all([
    fetchHomeForRequest(locale),
    getTranslations('home'),
  ])

  const content = resolveHomeContent(locale, settings)
  const unitDoors: UnitDoor[] = UNITS.map((value) => {
    const fallback = HOME_UNIT_FALLBACKS.find((unit) => unit.value === value)
    const candidate = units.find((unit) => unit.kunci === value)
    if (
      candidate?.nama &&
      candidate.judul &&
      candidate.pembuka &&
      canRenderPublicContent(`home unit/${value}`, [
        candidate.nama,
        candidate.judul,
        candidate.pembuka,
      ])
    ) {
      return {
        value,
        label: candidate.nama,
        title: candidate.judul,
        intro: candidate.pembuka,
      }
    }

    if (!fallback) {
      throw new Error(`Missing home fallback for Arthur unit: ${value}`)
    }

    return fallback
  })

  const fallbackSituations = HOME_SITUATION_FALLBACKS.map((situation) => ({
    _key: situation.key,
    teks: situation.text,
    unit: situation.unit,
    sisi: situation.side,
    bab: null,
  }))
  const sourceSituations =
    settings?.situasi && settings.situasi.length > 0
      ? settings.situasi
      : fallbackSituations
  const situations = sourceSituations.flatMap((situation) => {
    const unit = situation.unit ?? undefined
    if (!situation.teks || !isUnit(unit)) return []

    const values = [situation.teks, situation.sisi, situation.bab]
    if (!canRenderPublicContent(`home situation/${situation._key}`, values)) {
      return []
    }

    const side = situation.sisi ?? undefined
    const sidePath = isSideOf(unit, side) ? sideTemplate(unit, side) : null
    const destination = unitDoors.find((door) => door.value === unit)?.label
    if (!destination) return []

    return [
      {
        href:
          situation.bab && sidePath
            ? `${sidePath}/${situation.bab}`
            : (sidePath ?? unitTemplate(unit)),
        key: situation._key,
        text: situation.teks,
        destination,
      },
    ]
  })

  const workPromise =
    howWeWork?.janji?.find((promise) => promise.kalimat)?.kalimat ??
    t('methodFallback')
  const actionLabel = settings?.ajakan?.label ?? t('actionFallback')
  const actionAfter = settings?.ajakan?.sesudahnya ?? t('actionAfterFallback')

  return (
    <Wrapper
      theme="dark"
      lenis={{ anchors: true }}
      webgl
      simTypes={FLOWMAP_SIM}
      gsap
    >
      <Hero
        headline={content.headline}
        subline={content.subline}
        /*
         * The hero's counterweight (Tahap 67): the index in the top right,
         * headline and action bottom left. Dropping it in F3-01 left the top
         * half of the first screen empty again. The labels are the unit
         * doors' own, so the hero names exactly what the page opens next.
         */
        index={{
          label: t('heroIndexLabel'),
          items: unitDoors.map((door) => door.label),
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

        <UnitDoors
          className={s.section}
          units={unitDoors}
          statement={content.statementFallback[0] ?? content.subline}
          datumLabel={content.headline}
          eyebrow={t('unitEyebrow')}
          title={t('unitTitle')}
          linkLabel={t('unitLink')}
        />

        <SituationLinks
          className={s.section}
          situations={situations}
          eyebrow={t('situationEyebrow')}
          title={t('situationTitle')}
          destinationLabel={t('situationDestination')}
        />

        <Reveal as="section" className={cn(s.section, s.sequence)}>
          <SectionHeader
            eyebrow={t('sequenceEyebrow')}
            title={t('sequenceTitle')}
          />
          <p data-reveal-item className={cn('p-big', s.sequenceCopy)}>
            {t('sequenceBody')}
          </p>
        </Reveal>

        <StudioNote
          id="cara-kerja"
          className={s.section}
          eyebrow={t('methodEyebrow')}
          title={t('methodTitle')}
        >
          <p className="p-big">{workPromise}</p>
          <Link href="/cara-kerja" className={cn('caption', s.textLink)}>
            {t('methodLink')}
          </Link>
        </StudioNote>

        <ContactBlock
          id="contact"
          className={s.section}
          eyebrow={t('actionEyebrow')}
          title={`${actionLabel} ${actionAfter}`}
          email={content.email}
          emailIsPlaceholder={content.fallbacks.email}
          address={content.address}
          addressHeading={t('addressHeading')}
          addressIsPlaceholder={content.fallbacks.address}
          {...(content.fallbacks.address && {
            addressNote: t('addressPlaceholderNote'),
          })}
          emailLabel={t('emailLabel', { name: content.name })}
          socials={content.socials}
          {...(content.fallbacks.email && {
            note: t('contactPlaceholderNote'),
          })}
          socialsHeading={t('socialsHeading')}
          copy={{
            label: t('copyAddress'),
            copied: t('addressCopied'),
            failed: t('copyFailed'),
          }}
        />
      </div>
    </Wrapper>
  )
}

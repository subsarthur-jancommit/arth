import cn from 'clsx'
import { getTranslations } from 'next-intl/server'
import { draftMode } from 'next/headers'
import { locale as localeRootParam } from 'next/root-params'

import { Wrapper } from '@/components/layout/wrapper'
import { Link } from '@/components/ui/link'
import { SanityImage } from '@/components/ui/sanity-image'
import { SectionHeader } from '@/components/ui/section-header'
import {
  HOME_UNIT_FALLBACKS,
  resolveHomeContent,
} from '@/lib/content/home-fallback'
import { canRenderPublicContent } from '@/lib/content/public-content-guard'
import { latestWriting } from '@/lib/content/unit-writing'
import { UNITS } from '@/lib/content/units'
import { isLocale, type Locale, routing } from '@/lib/i18n/routing'
import { isConfigured } from '@/lib/integrations/registry'
import { RichText } from '@/lib/integrations/sanity/components/rich-text'
import { sanityFetch } from '@/lib/integrations/sanity/live'
import {
  featuredProjectsQuery,
  homeUnitsPreviewQuery,
  homeUnitsQuery,
  siteSettingsPreviewQuery,
  siteSettingsQuery,
} from '@/lib/integrations/sanity/queries'
import { toImageSource } from '@/lib/integrations/sanity/utils/image'
import { ContactBlock } from '@/vault/blocks/contact-block'
import { Hero } from '@/vault/blocks/hero'
import { LatestWriting } from '@/vault/blocks/latest-writing'
import { Passage } from '@/vault/blocks/passage'
import { PracticeList } from '@/vault/blocks/practice-list'
import { ProjectGrid } from '@/vault/blocks/project-grid'
import { StudioNote } from '@/vault/blocks/studio-note'
import { Reveal } from '@/vault/motion/reveal'

import s from './page.module.css'

/*
 * Hoisted so the array identity is stable across renders — an inline literal
 * would be a new array every time and would re-run `FlowmapProvider`'s
 * effects on each one.
 */
const FLOWMAP_SIM: ('fluid' | 'flowmap')[] = ['flowmap']

async function fetchPublishedHome(locale: Locale) {
  'use cache'

  const [settings, units, projects] = await Promise.all([
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
      query: featuredProjectsQuery,
      params: { locale },
      perspective: 'published',
      stega: false,
    }),
  ])

  return {
    settings: settings.data,
    units: units.data,
    projects: projects.data,
    isDraftMode: false,
  }
}

async function fetchPreviewHome(locale: Locale) {
  'use cache'

  const [settings, units, projects] = await Promise.all([
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
      query: featuredProjectsQuery,
      params: { locale },
      perspective: 'drafts',
      stega: true,
    }),
  ])

  return {
    settings: settings.data,
    units: units.data,
    projects: projects.data,
    isDraftMode: true,
  }
}

async function fetchHomeForRequest(locale: Locale) {
  // A project without Sanity configured still renders a complete page: every
  // section falls back to `lib/content/home-fallback.ts`, and the work grid is
  // simply absent. This is the same path an empty dataset takes.
  if (!isConfigured('sanity')) {
    return { settings: null, units: [], projects: [], isDraftMode: false }
  }

  const { isEnabled } = await draftMode()
  return isEnabled ? fetchPreviewHome(locale) : fetchPublishedHome(locale)
}

/**
 * The home page: `main`'s composition with Arthur's words.
 *
 * Fase 1 of `docs/RENCANA-KONTEKS-TAYANG.md` (K-A, option B). F3 had
 * replaced this page with text-only unit doors and situation links, and the
 * page lost half its height and five of its eleven moments
 * (`docs/TINJAUAN-F01-F03.md` B1, B2, E1). Until R4 brings the drawing plates,
 * the page keeps the sections that carried those moments — the pinned
 * passage, the work grid on the WebGL material, the practice disclosure, the
 * studio note and the latest writing — and reads its text from the stack's
 * content layer: `siteSettings`, the unit headers, and P4 for the address.
 */
export default async function Home() {
  const requested = await localeRootParam()
  const locale: Locale = isLocale(requested) ? requested : routing.defaultLocale

  const [{ settings, units, projects, isDraftMode }, t, latest] =
    await Promise.all([
      fetchHomeForRequest(locale),
      getTranslations('home'),
      latestWriting(locale),
    ])

  const content = resolveHomeContent(locale, settings)
  const hasWork = projects.length > 0

  /*
   * Each unit's label and opening line, from its published document when it
   * passes the public-content guard and from the master brief's ready header
   * otherwise. The same resolution the unit pages use.
   */
  const unitEntries = UNITS.map((value) => {
    const candidate = units.find((unit) => unit.kunci === value)
    if (
      candidate?.nama &&
      candidate.pembuka &&
      canRenderPublicContent(`home unit/${value}`, [
        candidate.nama,
        candidate.pembuka,
      ])
    ) {
      return { value, label: candidate.nama, intro: candidate.pembuka }
    }

    const fallback = HOME_UNIT_FALLBACKS.find((unit) => unit.value === value)
    if (!fallback) {
      throw new Error(`Missing home fallback for Arthur unit: ${value}`)
    }
    return { value, label: fallback.label, intro: fallback.intro }
  })

  /*
   * The passage's reel: the same works the grid below lays out, reduced to
   * what a preview needs — a cover, a title, one line of facts. Nothing is
   * written for it. `alt=""` because the reel is `aria-hidden`; the card
   * that follows carries the work's real description.
   */
  const plates = projects.flatMap((project) =>
    project.cover
      ? [
          {
            id: project._id,
            title: project.title ?? '',
            meta:
              [project.engagement, project.client, project.year]
                .filter((part) => part !== null && String(part) !== '')
                .join(' · ') || undefined,
            /*
             * `sizes` follows the frame, not the viewport. On a phone the
             * frame is portrait (4:5, ~81vw wide), so a landscape cover
             * *covering* it renders ~1.6 frame-heights wide — about 160vw.
             */
            media: (
              <SanityImage
                image={toImageSource(project.cover)}
                alt=""
                maxWidth={1100}
                sizes="(max-width: 799px) 170vw, 60vw"
              />
            ),
          },
        ]
      : []
  )

  const actionLabel = settings?.ajakan?.label ?? t('actionFallback')
  const actionAfter = settings?.ajakan?.sesudahnya ?? t('actionAfterFallback')

  return (
    /*
     * `webgl` and `gsap` are mounted here, not in the layout: this is the
     * only page with a scene (the hero's `SceneShell`) and a GSAP timeline.
     * `simTypes` is back because its reader is back — the work grid's
     * material (`vault/webgl/material-image`) reads the flowmap.
     */
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
         * headline and action bottom left. The labels are the practice list's
         * own, so the hero names exactly what the page opens below.
         */
        index={{
          label: t('heroIndexLabel'),
          items: unitEntries.map((unit) => unit.label),
        }}
        action={
          /* oxlint-disable-next-line react/forbid-elements -- a same-page jump must keep working when JavaScript is disabled */
          <a
            href="#unit"
            className={cn('cta', s.heroCta)}
            data-press="cta"
            data-intent=""
          >
            {t('heroCtaUnits')}
          </a>
        }
      />

      <div className={s.sections}>
        {isDraftMode && (
          <p className={cn('caption', s.previewFlag)} role="status">
            {t('draftPreview')}
          </p>
        )}

        {hasWork && (
          <section id="work" className={s.section}>
            {/*
              The work's arrival, choreographed — `arth-passage`, Tahap 49.
              `reveal` stays off the header: a container reveal and a scrubbed
              passage would be two entrances for one element.
            */}
            <Passage plates={plates}>
              <SectionHeader
                title={t('workTitle')}
                aside={t('workCount', { count: projects.length })}
              />
            </Passage>
            <ProjectGrid projects={projects} material />
          </section>
        )}

        {/*
          The three units, opened one at a time. Each panel links the unit's
          own page, which is where the situations and the offers begin.
        */}
        <PracticeList
          id="unit"
          className={s.section}
          eyebrow={t('practiceEyebrow')}
          title={t('practiceTitle')}
          linkLabel={t('practiceLink')}
          entries={unitEntries}
        />

        <StudioNote
          id="studio"
          className={s.section}
          title={t('studioTitle')}
          portrait={settings?.portrait ?? null}
          {...(settings?.portraitAlt && { portraitAlt: settings.portraitAlt })}
        >
          <div
            className={s.statement}
            data-statement={content.statement ? 'cms' : 'fallback'}
          >
            {content.statement ? (
              // SAFETY: `statement` is the CMS's Portable Text for this
              // locale. `resolveHomeContent` widens it to `unknown[]` because
              // it also accepts the fallback shape; `RichText` renders nothing
              // for a block it does not know.
              <RichText
                content={content.statement as never}
                paragraphClassName="p-big"
              />
            ) : (
              content.statementFallback.map((paragraph) => (
                <p key={paragraph.slice(0, 32)} className="p-big">
                  {paragraph}
                </p>
              ))
            )}
          </div>
        </StudioNote>

        {latest && (
          <LatestWriting
            className={s.section}
            eyebrow={t('journalEyebrow')}
            entry={latest}
            practice={
              latest.unit
                ? unitEntries.find((unit) => unit.value === latest.unit)?.label
                : undefined
            }
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

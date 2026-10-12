'use client'

import cn from 'clsx'
import { useLocale, useTranslations } from 'next-intl'
import type { MouseEvent } from 'react'

import { Link, usePathname, useRouter } from '@/lib/i18n/navigation'
import { LOCALE_LABELS, LOCALE_TAGS, type Locale } from '@/lib/i18n/routing'
import { announceNavigation } from '@/lib/motion/navigation-signal'

import { localesForLanguageSwitcher } from './locales'
import { sectionInView } from './section'

import s from './language-switcher.module.css'

/**
 * The sections a reader can be "in": the case study's regions and the home
 * page's named sections. Both languages render them under the same ids.
 */
const SECTIONS = 'main [data-region][id], main section[id]'

/**
 * LanguageSwitcher — one link per approved public language. On an approved
 * page it disappears while only one language is public, because a switcher
 * without a choice is noise and would advertise an unavailable destination.
 * On an unpublished locale's preview or old deep link, the one approved
 * language remains visible as an exit; `locales.ts` owns that asymmetry and
 * records its cost.
 *
 * Provenance: original work for this project. No third-party code copied.
 *
 * ## Why not a `<select>`
 *
 * A select for two options adds a click and a popup without adding a choice.
 * Both languages fit on one line as links, which also means the alternate
 * language is a real anchor a crawler can follow — a `<select>` is invisible
 * to one.
 *
 * ## It keeps the reader on the page they are reading
 *
 * `usePathname` here is next-intl's, which returns the path with the locale
 * prefix stripped (`/work/ai-data`, not `/id/work/ai-data`). Handing that
 * template back to next-intl's `Link` with an explicit `locale` re-prefixes
 * it for the target language, so switching language on a project page lands
 * on the same project — not on the home page, which is what a naive
 * `href={'/' + locale}` does.
 *
 * ## …and at the part of it they were reading
 *
 * Landing on the same page was half of it. A reader halfway down a case study
 * who switches to Bahasa Indonesia — often to hand it to a colleague who reads
 * it better — used to land back at the top. Now the switch carries the section
 * being read (`section.ts`): the link goes to the same page in the other
 * language, at the same section's id. Orientasi, stage 4. The rendered `href`
 * is unchanged, so without script, in a new tab, or at the top of a page, the
 * switch is the plain link it always was.
 *
 * The moment, `locale-sheet`: the swap is covered by a panel that crosses
 * sideways, as the next sheet of a drawing set slides over the last
 * (`vault/motion/page-transition`, the `sheet` intent) — the same page, the
 * other sheet. It was the one navigation on the site with no transition at all.
 *
 * ## Accessibility
 *
 * - `aria-current="true"` marks the active language when it is one of the
 *   published choices, so it is announced rather than only shown as a
 *   different weight. An unpublished preview has no current item in this
 *   list; its only link is the approved destination.
 * - `hrefLang` states each link's destination language, which is what tells a
 *   screen reader to switch pronunciation and a crawler to pair the two.
 * - With multiple published languages, the active language stays a link
 *   rather than becoming inert text: the list keeps a stable shape, and
 *   re-selecting the current language is harmless.
 * - `lang` on each label makes the language *name* read in its own language —
 *   "Bahasa Indonesia" should not be pronounced with English phonemes.
 */
export function LanguageSwitcher({
  className,
}: {
  className?: string | undefined
}) {
  const pathname = usePathname()
  // `useLocale`, not `pathname`: the pathname has had its prefix stripped and
  // therefore no longer says which language it came from.
  const active = useLocale()
  const t = useTranslations('language')
  const router = useRouter()
  const visibleLocales = localesForLanguageSwitcher(active)

  if (visibleLocales.length === 0) return null

  /**
   * Carries the section being read across the switch. A modified click (a new
   * tab, a new window) and the current language are left to the link itself.
   */
  function keepPlace(event: MouseEvent<HTMLAnchorElement>, locale: Locale) {
    if (locale === active || event.defaultPrevented) return
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return

    // The same page in the other language: the next sheet of the set.
    announceNavigation('sheet')

    const id =
      window.scrollY > 0
        ? sectionInView(
            [...document.querySelectorAll<HTMLElement>(SECTIONS)].map(
              (section) => ({
                id: section.id,
                top: section.getBoundingClientRect().top,
              })
            ),
            window.innerHeight
          )
        : null
    if (!id) return

    event.preventDefault()
    router.push(`${pathname}#${id}`, { locale })
  }

  return (
    <nav
      aria-label={t('label')}
      className={cn(s.switcher, className)}
      data-epic="locale-sheet"
    >
      <ul className={s.list}>
        {visibleLocales.map((locale) => (
          <li key={locale}>
            <Link
              href={pathname}
              locale={locale}
              hrefLang={LOCALE_TAGS[locale]}
              lang={LOCALE_TAGS[locale]}
              aria-label={t('switchTo', { language: LOCALE_LABELS[locale] })}
              className={cn('caption', s.link)}
              onClick={(event) => keepPlace(event, locale)}
              {...(locale === active && { 'aria-current': true })}
            >
              {locale.toUpperCase()}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  )
}

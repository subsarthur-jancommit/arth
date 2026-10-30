import cn from 'clsx'
import { useTranslations } from 'next-intl'
import type { CSSProperties } from 'react'

import { Link } from '@/components/ui/link'
import { Marquee } from '@/components/ui/marquee'
import {
  FALLBACK_CONTACT,
  isPlaceholderEmail,
} from '@/lib/content/home-fallback'
import { UNITS, unitTemplate } from '@/lib/content/units'
import { isAwaitingContent } from '@/lib/seo/awaiting-content'
import { BuildStamp } from '@/vault/blocks/build-stamp'
import { readBuild } from '@/vault/blocks/build-stamp/build'
import { GridToggle } from '@/vault/motion/grid-underlay'

import { IndexLink } from './index-link'

import s from './footer.module.css'

/**
 * Site footer.
 *
 * Replaces the Satūs starter footer, which carried darkroom's logo and a "use
 * this template" link — correct for a starter, wrong for a studio's own site.
 *
 * ## The attribution stays
 *
 * What was removed is the *template* link, not the credit. Satūs is MIT
 * licensed and `docs/PROVENANCE.md` requires the attribution, so
 * darkroom.engineering is still named, as a sentence in the colophon rather
 * than as a logo lockup. The typefaces are named there too: a colophon that
 * lists its type is a convention of the field this site is trying to belong
 * to, and it costs one line.
 *
 * ## Where this runs
 *
 * The file declares no `'use client'` and holds no state, but it is imported
 * by `components/layout/wrapper`, which does — so in practice it renders as a
 * client component. `useTranslations` works either way: the layout wraps the
 * tree in `NextIntlClientProvider`. Written without state so it can move back
 * to the server the moment Wrapper stops needing to be a client component.
 */

/*
 * Read once at module scope, never during render.
 *
 * `new Date()` inside the component body is a clock read, and under Cache
 * Components that makes the enclosing boundary dynamic. Because this footer
 * renders inside `Wrapper` (a Client Component), the effect is not a slower
 * render — React bails the whole boundary to client-side rendering, and the
 * prerendered HTML for `/en` and `/id` ships with no header, no footer and no
 * page content at all. Nothing warns: the build succeeds, dev looks correct,
 * and only the served HTML shows it. Measured before and after.
 *
 * At module scope the read happens once when the bundle loads, outside any
 * render, so the prerender stays static. The value ages with the deploy
 * rather than with the calendar.
 */
const YEAR = new Date().getFullYear()

/*
 * One source, not a third copy — Tahap 35.
 *
 * This used to be a literal here: `studio@arth.example`, duplicating
 * `lib/content/home-fallback.ts`. The home page resolves
 * the same fields against the CMS; this footer cannot, because it renders
 * inside the client `Wrapper` and has no server data of its own. Sharing the
 * constant is what makes that a *fallback* rather than a second opinion, and
 * what makes wiring the CMS through later one edit instead of three. No
 * social profile is linked until Arthur's official accounts are supplied.
 *
 * Until K5 replaces it, the placeholder is not printed at all (owner decision
 * P4, R0); the column links to the contact page instead.
 */
const { name: SITE_NAME, email: EMAIL, socials: SOCIAL } = FALLBACK_CONTACT

/** Whether the only address this footer has is still the placeholder. */
const CONTACT_IS_PLACEHOLDER = isPlaceholderEmail(EMAIL)

/*
 * Fixed pages in the index, minus any still awaiting published content
 * (`lib/seo/awaiting-content.ts`): the footer is on every page, so a link
 * here to a 404 would be on every page too.
 *
 * Every fixed page is listed (R4 route names, 2026-10-30). Layanan and
 * Pembayaran were reachable only from inside other pages, and the owner
 * asked that a customer can reach each page from anywhere.
 */
const INDEX_PAGES = (
  [
    { href: '/metode', labelKey: 'studio' },
    { href: '/layanan', labelKey: 'services' },
    { href: '/pembayaran', labelKey: 'payment' },
    { href: '/kebijakan', labelKey: 'policy' },
  ] as const
).filter(({ href }) => !isAwaitingContent(href))

/*
 * The address's length, for the stylesheet to fit it to its column
 * (`footer.module.css`, `.email`). A custom property is not in React's
 * `CSSProperties`, so the object is widened — the contact block's shape.
 */
const EMAIL_STYLE = { '--email-chars': EMAIL.length } as CSSProperties

/*
 * The commit this build was made from, or `null` — read once, like the year.
 *
 * Inlined by `next.config.ts` on a Vercel build only, so on CI and in a
 * local build the colophon carries no stamp (`vault/blocks/build-stamp`).
 */
const BUILD = readBuild({
  sha: process.env.NEXT_PUBLIC_COMMIT_SHA,
  builtAt: process.env.NEXT_PUBLIC_BUILT_AT,
  repository: process.env.NEXT_PUBLIC_REPOSITORY_URL,
})

export function Footer() {
  const t = useTranslations('footer')
  /*
   * Two more namespaces rather than new strings.
   *
   * `nav.work` already names the catalogue in the header, and
   * `workIndex.<value>` already names each practice on the filter chips and on
   * the practice page's own nameplate. Writing a second set here would let the
   * footer call a practice something the rest of the site does not.
   */
  const tNav = useTranslations('nav')
  const tWork = useTranslations('workIndex')
  return (
    // No `id="contact"`. The home page's Contact section owns that id, and two
    // elements sharing one is a `duplicate-id` violation — which now fails the
    // suite outright, since Tahap 2 removed the critical/serious axe filter.
    <footer className={s.footer}>
      {/*
        The wordmark, moving with the reader — Tahap 42.

        `components/ui/marquee` shipped with the fork and had **zero**
        consumers for forty-one stages while occupying Tempus order 6 in the
        loop table. This is its first home, and the first visible spend of
        `--scroll-velocity`: the strip carries a base speed and the reader's
        own scrolling adds to it, so the footer answers movement instead of
        sitting still under it.

        `MOTION-SPEC.md` §0's third category, and the purest case of it — no
        beginning, no end, `transform` only, and switched off entirely under
        `prefers-reduced-motion` (§0.2 rule 4), which the component did not do
        until this stage.

        **One per page, never two.** `taste-skill` §4 is explicit that two
        scrolling strips read as lazy filler, and this one is in the footer,
        which every route renders — so this is the site's only slot and it is
        now spent.

        `aria-hidden` on the whole strip: it is the studio's name, which the
        page already carries in its `<title>`, its JSON-LD and the header
        wordmark. Repeating it to a screen reader three times is noise, and
        `Marquee` duplicates its children to fill the width, so the repeats
        would be announced too.
      */}
      <Marquee
        className={s.wordmark}
        /*
         * Eight copies, from the arithmetic — the fork. The strip translates
         * by one copy and wraps, so it needs `ceil(strip / copy) + 1` copies
         * to stay full at the worst offset: 5 at 390px, 6 at 1440, 7 at 2560.
         * Four left 210-480px of the signature row empty on every page (the
         * design-critique workflow); eight covers to ~3400px. The copies are
         * `aria-hidden` with the strip, so this costs assistive tech nothing.
         */
        repeat={8}
        speed={0.4}
        aria-hidden="true"
        data-nosnippet=""
      >
        <span className={cn('h1', s.wordmarkWord)}>{SITE_NAME}</span>
      </Marquee>

      <div className={s.columns}>
        {/*
          Contact. The fallback address is a reserved `.invalid` placeholder
          until K5 names a real channel, and the owner's decision P4 is that a
          reader never sees a placeholder or a note written for the editor.
          So until then this column points to the contact page instead of
          printing an address nobody answers.
        */}
        <section className={s.column}>
          <h2 className={cn('caption', s.heading)}>{t('contact')}</h2>
          {CONTACT_IS_PLACEHOLDER ? (
            <ul className={s.list}>
              <li>
                <IndexLink href="/kontak">{tNav('contact')}</IndexLink>
              </li>
            </ul>
          ) : (
            <span className={cn('p-big', s.email)} style={EMAIL_STYLE}>
              {EMAIL}
            </span>
          )}
        </section>

        {/* The footer index keeps every fixed page and the three units
            reachable everywhere. Catalogue and journal indexes remain
            addressable but are intentionally not promoted in navigation:
            their entries are still seeded fixtures, not Arthur's work. */}
        <section className={s.column}>
          <h2 className={cn('caption', s.heading)}>{t('index')}</h2>
          <ul className={s.list}>
            {INDEX_PAGES.map(({ href, labelKey }) => (
              <li key={href}>
                <IndexLink href={href}>{tNav(labelKey)}</IndexLink>
              </li>
            ))}
            {UNITS.map((value) => (
              <li key={value}>
                <IndexLink href={unitTemplate(value)}>{tWork(value)}</IndexLink>
              </li>
            ))}
          </ul>
        </section>

        {/* Shown only once there is an official account to link (P4). */}
        {SOCIAL.length > 0 && (
          <section className={s.column}>
            <h2 className={cn('caption', s.heading)}>{t('elsewhere')}</h2>
            <ul className={s.list}>
              {SOCIAL.map((item) => (
                <li key={item.url}>
                  <Link href={item.url} className={cn('caption', s.link)}>
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        )}

        <section className={s.column}>
          <h2 className={cn('caption', s.heading)}>{t('colophon')}</h2>
          <p className={cn('caption', s.note)}>{t('builtOn')}</p>
          {BUILD && <BuildStamp build={BUILD} label={t('build')} />}
          {/*
            The grid these pages are set on, drawn over the page on request —
            Tata & Gerak, stage 5 (`vault/motion/grid-underlay`). In the
            colophon, beside how the site is built, because it is part of
            that answer.
          */}
          <GridToggle label={t('showGrid')} className={s.gridToggle} />
        </section>
      </div>

      <p className={cn('caption', s.rights)}>
        {t('rights', { year: YEAR, name: SITE_NAME })}
      </p>
    </footer>
  )
}

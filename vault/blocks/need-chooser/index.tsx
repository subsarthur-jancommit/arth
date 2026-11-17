import cn from 'clsx'

import { Link } from '@/components/ui/link'

import s from './need-chooser.module.css'

/**
 * NeedChooser — three needs, and the buyer routes under each — G1.
 *
 * Provenance: original work for this project. No third-party code copied.
 *
 * ## What it is for
 *
 * The owner's technical reference, §4 (`docs/SOLUSI-TEKNIS-VISUAL-GERAK.md`):
 * a buyer starts from what they need, not from the name of a unit. Three
 * needs — "Bangunan & proyek", "Sistem & operasional", "Pasar & penjualan" —
 * lead to the five buyer pages through two, two and one routes, in the order
 * each unit opens with (`SIDES`, `lib/content/units.ts`). Joining the seller
 * network is not a need a buyer has, so "Bergabung" stands apart, after them.
 *
 * It sits straight after the hero's introduction and before any long
 * explanation, on paper (`data-theme="light"`), and the header takes the
 * paper ground as it passes over it.
 *
 * ## Editorial rows, not cards
 *
 * Each need is a heading, at most one line of the unit's own approved header
 * line under it, and its routes as rows divided by a rule, with an arrow.
 * Every route is a plain link at least 44px tall (56 here): it works without
 * a script, from the keyboard, and from a screen reader's link list, where
 * each reads by the approved reader label ("Untuk pelaku proyek").
 *
 * ## States
 *
 * Hover and keyboard focus tint the row and move the arrow 4px in 170ms; a
 * press deepens the tint in 110ms. The row itself never scales
 * (`--press-scale: 1`): a 0.97 press on a full-width row is a lurch.
 */

export interface NeedRoute {
  href: string
  /** The approved reader label, "Untuk pelaku proyek" and so on. */
  label: string
}

export interface Need {
  key: string
  title: string
  /** One line under the title, from already-approved copy, or nothing. */
  description?: string | undefined
  routes: readonly NeedRoute[]
}

interface NeedChooserProps {
  needs: readonly Need[]
  /** "Bergabung", to the seller network, apart from the needs. */
  join: NeedRoute & { title: string }
  className?: string | undefined
}

export function NeedChooser({ needs, join, className }: NeedChooserProps) {
  return (
    <section
      className={cn(s.chooser, className)}
      data-theme="light"
      data-need-chooser=""
    >
      <ul className={s.needs}>
        {needs.map((need) => (
          <li key={need.key} className={s.need} data-need={need.key}>
            <h2 className={s.title}>{need.title}</h2>
            {need.description ? (
              <p className={s.description}>{need.description}</p>
            ) : null}
            <ul className={s.routes}>
              {need.routes.map((route) => (
                <li key={route.href}>
                  <Link
                    href={route.href}
                    className={s.route}
                    data-press="need"
                    data-intent=""
                  >
                    <span className={s.routeLabel}>{route.label}</span>
                    <span aria-hidden="true" className={s.arrow}>
                      →
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ul>

      <div className={s.join}>
        <Link
          href={join.href}
          className={cn(s.route, s.joinRoute)}
          data-press="need"
          data-intent=""
          data-need="join"
        >
          <span className={s.joinTitle}>{join.title}</span>
          <span className={s.routeLabel}>{join.label}</span>
          <span aria-hidden="true" className={s.arrow}>
            →
          </span>
        </Link>
      </div>
    </section>
  )
}

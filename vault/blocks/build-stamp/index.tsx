/**
 * BuildStamp — the commit a page was built from, and the day.
 *
 * Provenance: original work for this project. No third-party code copied.
 *
 * ## What it is for
 *
 * The site went live on 2026-10-05, and from then on every change is looked
 * at twice: on its preview, and on production once it is merged. Neither page
 * said which commit it was serving, so "is this the new one?" had no answer a
 * reader could see — only a dashboard could tell. The colophon now says it:
 * the short hash, linked to the commit, and the day the build ran.
 *
 * ## Only where it is true
 *
 * The values are inlined by `next.config.ts` from what Vercel sets on every
 * build (`build.ts`). A local build or CI has no commit to name, so the
 * caller renders nothing at all rather than a placeholder — the colophon then
 * reads exactly as it did before this block.
 *
 * ## The shape
 *
 * A flex row, not a sentence: the hash is a link, and a link inside running
 * text is the pattern axe cannot judge over the page's grain
 * (`docs/HANDOFF.md` §4.3, lesson 2). It is underlined, in its own colour,
 * because nothing else in the row would say it can be followed.
 *
 * No motion. `build-stamp`.
 */

import cn from 'clsx'

import { Link } from '@/components/ui/link'

import type { Build } from './build'

import s from './build-stamp.module.css'

interface BuildStampProps {
  build: Build
  /** Already localized — "Build". */
  label: string
}

export function BuildStamp({ build, label }: BuildStampProps) {
  return (
    <p className={cn('caption', s.stamp)} data-epic="build-stamp">
      <span>{label}</span>
      {build.href ? (
        <Link href={build.href} className={s.commit}>
          {build.short}
        </Link>
      ) : (
        <span>{build.short}</span>
      )}
      <time dateTime={build.builtAt}>{build.day}</time>
    </p>
  )
}

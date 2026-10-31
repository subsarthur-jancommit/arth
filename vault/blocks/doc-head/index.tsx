/**
 * DocHead — the head of a document page, set like the head of a drawing
 * sheet (R5, direction A).
 *
 * Provenance: original work for Arthur. No third-party code copied. The
 * arrangement follows the approved document screens in
 * `docs/r4-arah-visual/` (`gabungan.py`: `.g-crumb`, `.g-head`, `.g-kop`):
 * a path back up, a label, the title, one lead paragraph, and a ruled box of
 * facts beside them, the way a sheet carries its title block.
 *
 * ## What it owns, and what the page owns
 *
 * The block owns the markup and the classes; the page owns every word. The
 * facts are `{ term, detail }` pairs so the page decides what a document
 * states about itself, and a list of names (who a page is for) is passed as
 * an array, which the block sets as a plain list.
 *
 * Server-rendered and static: nothing here moves, so there is nothing to
 * reduce under `prefers-reduced-motion` and nothing to wait for without
 * JavaScript.
 */

import cn from 'clsx'
import type { ReactNode } from 'react'

import { Link } from '@/components/ui/link'

import s from './doc-head.module.css'

export interface DocCrumb {
  label: string
  /** Where it leads. The page being read has none. */
  href?: string | undefined
}

export interface DocFact {
  term: string
  detail: ReactNode | readonly string[]
}

interface DocHeadProps {
  /** The path back up. The last crumb is the page itself. */
  crumbs?: readonly DocCrumb[] | undefined
  /** The breadcrumb's name for assistive technology. */
  crumbsLabel?: string | undefined
  eyebrow?: string | undefined
  title: string
  /**
   * `name` for a short title (a situation, a piece of work), `sentence` for
   * a title that is a whole sentence, which reads better a size down.
   */
  titleSize?: 'name' | 'sentence' | undefined
  lead?: string | undefined
  facts?: readonly DocFact[] | undefined
  className?: string | undefined
}

export function DocHead({
  crumbs,
  crumbsLabel,
  eyebrow,
  title,
  titleSize = 'name',
  lead,
  facts,
  className,
}: DocHeadProps) {
  const hasFacts = facts !== undefined && facts.length > 0

  return (
    <header className={cn(s.head, hasFacts && s.withFacts, className)}>
      {crumbs && crumbs.length > 0 ? (
        <nav aria-label={crumbsLabel} className={s.crumbs}>
          <ol className={s.crumbList}>
            {crumbs.map((crumb) => (
              <li key={crumb.label} className={cn('caption', s.crumb)}>
                {crumb.href ? (
                  <Link href={crumb.href} className={s.crumbLink}>
                    {crumb.label}
                  </Link>
                ) : (
                  <span aria-current="page">{crumb.label}</span>
                )}
              </li>
            ))}
          </ol>
        </nav>
      ) : null}

      <div className={s.main}>
        {eyebrow ? <p className={cn('caption', s.eyebrow)}>{eyebrow}</p> : null}
        <h1
          className={cn(
            titleSize === 'sentence' ? 'h2' : 'h1',
            s.title,
            titleSize === 'sentence' && s.sentence
          )}
        >
          {title}
        </h1>
        {lead ? <p className={cn('p-big', s.lead)}>{lead}</p> : null}
      </div>

      {hasFacts ? (
        <dl className={s.facts}>
          {facts.map((fact) => (
            <div key={fact.term} className={s.fact}>
              <dt className={cn('caption', s.term)}>{fact.term}</dt>
              <dd className={cn('p', s.detail)}>
                {isNameList(fact.detail) ? (
                  <ul className={s.names}>
                    {fact.detail.map((name) => (
                      <li key={name}>{name}</li>
                    ))}
                  </ul>
                ) : (
                  fact.detail
                )}
              </dd>
            </div>
          ))}
        </dl>
      ) : null}
    </header>
  )
}

function isNameList(detail: DocFact['detail']): detail is readonly string[] {
  return Array.isArray(detail)
}

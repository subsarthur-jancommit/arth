'use client'

import cn from 'clsx'
import type { ReactNode } from 'react'

import { getLinkIntent, Link } from '@/components/ui/link'
import { usePathname } from '@/lib/i18n/navigation'

import s from './footer.module.css'

interface IndexLinkProps {
  /** A locale-free route; `components/ui/link` adds the prefix. */
  href: string
  children: ReactNode
}

/**
 * One line of the footer's route index, marked when it is the page being read.
 *
 * The header has always said "you are here" on its routes (`aria-current`
 * from the same `getLinkIntent` comparison); the footer's index names more of
 * them and said nothing, so at the end of `/studio` a reader was offered
 * "Studio" as if it were somewhere else to go. The current line now carries
 * `aria-current="page"` and is inked and underlined (`footer.module.css`).
 *
 * Its own client component, so the footer itself stays free of hooks and can
 * move back to the server the day `Wrapper` does.
 *
 * No `RouteMarker`, which the header's index has: it places its rule by
 * horizontal offset and width along a row, and this index is a column.
 */
export function IndexLink({ href, children }: IndexLinkProps) {
  const pathname = usePathname()

  return (
    <Link
      href={href}
      className={cn('caption', s.link)}
      {...(getLinkIntent(href, pathname).isActive && {
        'aria-current': 'page' as const,
      })}
    >
      {children}
    </Link>
  )
}

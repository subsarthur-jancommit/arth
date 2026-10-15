/**
 * SideDoors — the two reader positions available inside one Arthur unit.
 *
 * Provenance: original work for Arthur. Each door remains a normal link, so
 * the choice works without JavaScript and preserves a visible focus target.
 */

import cn from 'clsx'

import { Link } from '@/components/ui/link'
import type { Side, Unit } from '@/lib/content/units'
import { sideTemplate } from '@/lib/content/units'
import { Reveal } from '@/vault/motion/reveal'

import s from './side-doors.module.css'

export interface SideDoor {
  id: string
  key: Side
  name: string
  title: string
}

interface SideDoorsProps {
  unit: Unit
  eyebrow: string
  title: string
  linkLabel: string
  doors: readonly SideDoor[]
  className?: string | undefined
}

export function SideDoors({
  unit,
  eyebrow,
  title,
  linkLabel,
  doors,
  className,
}: SideDoorsProps) {
  return (
    <Reveal as="section" className={cn(s.section, className)} perItem>
      <header data-reveal-item className={s.header}>
        <p className={cn('caption', s.eyebrow)}>{eyebrow}</p>
        <h2 className={cn('h2', s.heading)}>{title}</h2>
      </header>

      <ol className={s.doors}>
        {doors.map((door, index) => (
          <li key={door.id} data-reveal-item className={s.item}>
            <Link
              href={sideTemplate(unit, door.key)}
              className={s.link}
              data-press="side-door"
              data-intent=""
            >
              <span className={cn('caption', s.index)}>
                {String(index + 1).padStart(2, '0')}
              </span>
              <span className={cn('h3', s.name)}>{door.name}</span>
              <span className={cn('p', s.title)}>{door.title}</span>
              <span className={cn('caption', s.action)}>{linkLabel}</span>
            </Link>
          </li>
        ))}
      </ol>
    </Reveal>
  )
}

import cn from 'clsx'

import { Link } from '@/components/ui/link'
import { SectionHeader } from '@/components/ui/section-header'
import { Leader } from '@/vault/motion/leader'
import { Reveal } from '@/vault/motion/reveal'

import s from './situation-links.module.css'

export interface SituationLink {
  href: string
  key: string
  text: string
  destination: string
}

interface SituationLinksProps {
  situations: readonly SituationLink[]
  eyebrow: string
  title: string
  destinationLabel: string
  className?: string | undefined
}

/**
 * Buyer-language problems that point to the unit that should begin.
 *
 * `situation-leader` (`docs/MOTION-SPEC.md` §13.8, R6): on a wide screen a
 * row pointed at or focused draws a leader from the situation across to the
 * unit it names, and the unit is inked as the dot lands, 200ms in all. On a
 * phone, where nothing is pointed at, the line is drawn as the row arrives.
 * The row is a pressable noun (`data-press`), so the interaction grammar's
 * own sweep checks that its intent answers a keyboard as well as a cursor.
 * Under reduced motion no line is drawn; the unit is named in the link's
 * text either way, which is also all a reader without a script needs.
 */
export function SituationLinks({
  situations,
  eyebrow,
  title,
  destinationLabel,
  className,
}: SituationLinksProps) {
  return (
    <section
      id="situasi"
      data-epic="situation-leader"
      className={cn(s.section, className)}
    >
      <SectionHeader reveal eyebrow={eyebrow} title={title} />
      <Reveal className={s.reveal} perItem>
        <ul className={s.list}>
          {situations.map((situation) => (
            <li
              key={situation.key}
              data-reveal-item
              data-leader-target=""
              className={s.item}
            >
              <Link
                href={situation.href}
                className={s.link}
                data-press="situation"
                data-intent=""
              >
                <span className={cn('p-big', s.problem)}>{situation.text}</span>
                <span className={s.destination}>
                  <Leader trigger="intent" className={s.leader} />
                  <span className={cn('caption', s.destinationText)}>
                    {`${destinationLabel} ${situation.destination}`}
                  </span>
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </Reveal>
    </section>
  )
}

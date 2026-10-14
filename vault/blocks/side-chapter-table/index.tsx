'use client'

/**
 * SideChapterTable — a reader's map from a side to its published situations.
 *
 * A side is not a catalogue: the table gives the reader one stable route to
 * each eligible chapter, its reader-facing offer types, and its smallest
 * approved entry offer. The crosshair is decoration over that semantic table;
 * links and their labels remain complete with JavaScript unavailable.
 */

import cn from 'clsx'
import { type FocusEvent, type PointerEvent, useRef, useState } from 'react'

import { Link } from '@/components/ui/link'
import { CoverPreview, PreviewCover } from '@/vault/motion/cover-preview'
import { Crosshair } from '@/vault/motion/crosshair'

import s from './side-chapter-table.module.css'

export interface SideChapterRow {
  id: string
  href: string | null
  name: string
  situation: string | null
  types: readonly string[]
  offerCount: number
  entryOffer: {
    title: string
    impact: string | null
    href: string | null
  } | null
}

interface Aim {
  on: boolean
  x: number
  y: number
  reachX: number
  reachY: number
}

interface Plate {
  on: boolean
  x: number
  y: number
  width: number
  current: string | null
}

interface ChapterEntryProps {
  entryOffer: SideChapterRow['entryOffer']
}

const NOWHERE: Aim = { on: false, x: 0, y: 0, reachX: 0, reachY: 0 }
const NO_PLATE: Plate = { on: false, x: 0, y: 0, width: 0, current: null }

interface SideChapterTableProps {
  label: string
  title: string
  chapters: readonly SideChapterRow[]
  chapterLabel: string
  typeLabel: string
  entryLabel: string
  offerCountLabel: string
  empty: string
  className?: string | undefined
}

function aimAt(root: HTMLElement, row: HTMLElement): Aim {
  const rootBox = root.getBoundingClientRect()
  const rowBox = row.getBoundingClientRect()
  const target = row.querySelector<HTMLElement>('[data-side-type]') ?? row
  const targetBox = target.getBoundingClientRect()
  const x = targetBox.left + targetBox.width / 2 - rootBox.left
  const y = rowBox.top + rowBox.height / 2 - rootBox.top

  return {
    on: true,
    x,
    y,
    reachX: rootBox.width > 0 ? x / rootBox.width : 0,
    reachY: rootBox.height > 0 ? y / rootBox.height : 0,
  }
}

function plateAt(root: HTMLElement, row: HTMLElement, id: string): Plate {
  const rootBox = root.getBoundingClientRect()
  const rowBox = row.getBoundingClientRect()
  const width = Math.min(Math.max(rowBox.width * 0.28, 160), 260)
  const height = width * 1.25
  const x = Math.max(rowBox.right - rootBox.left - width, 0)
  const y = Math.min(
    Math.max(rowBox.top - rootBox.top - (height - rowBox.height) / 2, 0),
    Math.max(rootBox.height - height, 0)
  )

  return { on: true, x, y, width, current: id }
}

function ChapterEntry({ entryOffer }: ChapterEntryProps) {
  if (!entryOffer) return '—'

  if (entryOffer.href) {
    return (
      <Link href={entryOffer.href} className={s.entry} data-intent="">
        {entryOffer.title}
      </Link>
    )
  }

  return <span className={s.entry}>{entryOffer.title}</span>
}

export function SideChapterTable({
  label,
  title,
  chapters,
  chapterLabel,
  typeLabel,
  entryLabel,
  offerCountLabel,
  empty,
  className,
}: SideChapterTableProps) {
  const rootRef = useRef<HTMLDivElement>(null)
  const [aim, setAim] = useState<Aim>(NOWHERE)
  const [plate, setPlate] = useState<Plate>(NO_PLATE)

  function select(
    event: PointerEvent<HTMLTableRowElement> | FocusEvent<HTMLTableRowElement>
  ) {
    const root = rootRef.current
    if (!root) return
    const row = event.currentTarget
    const id = row.dataset.sideChapter
    if (!id) return
    setAim(aimAt(root, row))
    setPlate(plateAt(root, row, id))
  }

  function clear() {
    setAim((last) => ({ ...last, on: false }))
    setPlate((last) => ({ ...last, on: false }))
  }

  return (
    <section
      className={cn(s.section, className)}
      data-epic="side-chapter-table"
    >
      <header className={s.header}>
        <p className={cn('caption', s.label)}>{label}</p>
        <h2 className="h2">{title}</h2>
      </header>

      {chapters.length === 0 ? (
        <p className={cn('p-big', s.empty)}>{empty}</p>
      ) : (
        <div ref={rootRef} className={s.reader}>
          <table className={s.table}>
            <thead>
              <tr>
                <th scope="col">{chapterLabel}</th>
                <th scope="col">{typeLabel}</th>
                <th scope="col">{entryLabel}</th>
              </tr>
            </thead>
            <tbody>
              {chapters.map((chapter) => (
                <tr
                  key={chapter.id}
                  data-side-chapter={chapter.id}
                  onPointerEnter={select}
                  onPointerLeave={clear}
                  onFocus={select}
                  onBlur={clear}
                >
                  <th scope="row">
                    {chapter.href ? (
                      <Link
                        href={chapter.href}
                        className={s.chapter}
                        data-intent=""
                      >
                        {chapter.name}
                      </Link>
                    ) : (
                      <span className={s.chapter}>{chapter.name}</span>
                    )}
                    {chapter.situation ? (
                      <span className={cn('p', s.situation)}>
                        {chapter.situation}
                      </span>
                    ) : null}
                  </th>
                  <td data-side-type="">
                    <span className={s.types}>{chapter.types.join(' · ')}</span>
                    <span className={cn('caption', s.count)}>
                      {offerCountLabel.replace(
                        '{count}',
                        String(chapter.offerCount)
                      )}
                    </span>
                  </td>
                  <td>
                    <ChapterEntry entryOffer={chapter.entryOffer} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <Crosshair {...aim} />
          <CoverPreview {...plate}>
            {chapters.map((chapter) => (
              <PreviewCover key={chapter.id} id={chapter.id}>
                <span className={s.preview}>
                  <span className="caption">{entryLabel}</span>
                  <span className="h3">
                    {chapter.entryOffer?.title ?? chapter.name}
                  </span>
                  {chapter.entryOffer?.impact ? (
                    <span className="p">{chapter.entryOffer.impact}</span>
                  ) : null}
                </span>
              </PreviewCover>
            ))}
          </CoverPreview>
        </div>
      )}
    </section>
  )
}

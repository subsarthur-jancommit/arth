import type { PlateLegend as PlateLegendData } from '@/lib/plates'

import s from './plate.module.css'

/**
 * PlateLegend — a plate's words, set as HTML beside its drawing (G2).
 *
 * Provenance: original work for this project. No third-party code copied.
 *
 * ## Why the words leave the picture
 *
 * A plate sets its labels at the drawing's own scale. On the home page at
 * 1440 × 900 a 14.5-unit label is about seven CSS pixels tall, a phone shows
 * it at about four, and the lit model leans the plan back until its labels
 * are half that again (`docs/G2-MATRIKS-RENDER.md`, row E). However the
 * texture is filtered, words that small are a texture, not text. So the
 * drawing keeps them as part of the picture, and this block sets the same
 * words at a reading size: 16px for what the plate names, 14px for the
 * headings and the note, in the page's own ink, never through the canvas.
 *
 * ## What a reader is told
 *
 * The word groups repeat what the drawing's alt text already says in
 * sentences (`vault/blocks/plate`, `<desc>`), so they are hidden from
 * assistive technology, as the labels inside the drawing are: a screen reader
 * is not walked through "Teras, Jalan, Alur pelanggan" a second time. What
 * the alt text does not carry, the plate's own statements and the note that
 * the café is an example, is read.
 */

interface PlateLegendProps {
  legend: PlateLegendData
  /**
   * The approved sentence that the café is an example (`PLATE_NOTE`), where
   * nothing else beside the plate says so.
   */
  note?: string | undefined
}

export function PlateLegend({ legend, note }: PlateLegendProps) {
  return (
    <div className={s.legend} data-plate-legend="">
      <dl className={s.groups} aria-hidden="true">
        {legend.groups.map((group) => (
          <div
            key={group.heading}
            className={s.group}
            data-plate-legend-group=""
          >
            <dt className={s.heading} data-plate-legend-heading="">
              {group.heading}
            </dt>
            <dd className={s.items}>
              {group.items.map((item) => (
                <span key={item} className={s.item} data-plate-legend-item="">
                  {item}
                </span>
              ))}
            </dd>
          </div>
        ))}
      </dl>
      {legend.statements.map((statement) => (
        <p
          key={statement}
          className={s.statement}
          data-plate-legend-statement=""
        >
          {statement}
        </p>
      ))}
      {note ? (
        <p className={s.note} data-plate-legend-note="">
          {note}
        </p>
      ) : null}
    </div>
  )
}

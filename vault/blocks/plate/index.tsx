import cn from 'clsx'
import type { CSSProperties } from 'react'

import type { Unit } from '@/lib/content/units'
import {
  LABEL_HALO,
  MARK_STYLES,
  PLATES,
  type PlateMark,
  type PlateText,
  TEXT_STYLES,
} from '@/lib/plates'

import s from './plate.module.css'

/**
 * Plate — one unit's working drawing, as inline SVG.
 *
 * Provenance: original work for this project. No third-party code copied.
 * The drawings are `lib/plates`, ported from the generator of the R4 stills
 * the owner chose (`docs/r4-arah-visual/`, direction B, 24 October 2026).
 *
 * ## The flat plate is the plate
 *
 * Direction B lights these plates as WebGL material on the stage pages, and
 * this is what every reader gets first: the drawing a phone shows, the one
 * under reduced motion and without JavaScript, and the one a screen reader
 * reads. It is not a placeholder for the lit version. It is server-rendered,
 * has no script, and is already the drawing, in the ink of whatever ground it
 * sits on: paper lines with a faint glow on a stage, ink lines in a document.
 *
 * ## What a reader is told
 *
 * `role="img"` with a `<title>` and a `<desc>`, which is the SVG's own way of
 * carrying alt text and needs no `id` (two pages in one document, as Next's
 * `<Activity>` keeps them, would otherwise share one). The title names the
 * drawing; the description says what it shows, room by room or step by step.
 * The labels inside the drawing are part of the picture, so `role="img"`
 * keeps them out of the reading order: a reader is not walked through
 * "Teras, Jalan, Alur pelanggan" one word at a time.
 */

interface PlateProps {
  unit: Unit
  /** The drawing's name, which is what assistive technology announces. */
  title: string
  /** What the drawing shows, in sentences. */
  description: string
  className?: string | undefined
}

/**
 * A mark's paint, from its role. `ground` is the page colour, so a grid
 * bubble covers the axis it sits on in either theme.
 *
 * Widths go through `--plate-weight`: a phone shows a plate at about a
 * quarter of its units, and the stills' hairlines would vanish there.
 */
function markStyle({ role }: PlateMark): CSSProperties {
  const style = MARK_STYLES[role]
  const fill =
    style.fill === 'ink'
      ? 'currentColor'
      : style.fill === 'ground'
        ? 'var(--color-primary)'
        : 'none'
  return {
    fill,
    ...(style.fillOpacity !== undefined && { fillOpacity: style.fillOpacity }),
    ...(style.stroke === undefined
      ? { stroke: 'none' }
      : {
          stroke: 'currentColor',
          strokeWidth: `calc(${style.stroke}px * var(--plate-weight))`,
          strokeLinejoin: 'round' as const,
        }),
    ...(style.strokeOpacity !== undefined && {
      strokeOpacity: style.strokeOpacity,
    }),
    ...(style.dash && { strokeDasharray: style.dash.join(' ') }),
    ...(style.round && { strokeLinecap: 'round' as const }),
  }
}

function renderText(text: PlateText) {
  const style = TEXT_STYLES[text.role]
  const size = text.size ?? style.size
  const leading = text.leading ?? 1.25
  const [first, ...rest] = text.lines

  return (
    <text
      key={`${text.role}-${text.x}-${text.y}`}
      x={text.x}
      y={text.y}
      className={style.face === 'mono' ? s.mono : s.display}
      textAnchor={text.anchor}
      dominantBaseline={text.central ? 'central' : undefined}
      transform={
        text.rotate ? `rotate(${text.rotate} ${text.x} ${text.y})` : undefined
      }
      style={{
        fontSize: `${size}px`,
        fontWeight: text.weight ?? style.weight,
        ...(style.tracking !== undefined && {
          letterSpacing: `${style.tracking}px`,
        }),
        ...(style.opacity !== undefined && { fillOpacity: style.opacity }),
        /*
         * A label reads across the lines it names: a stroke of ground under
         * the glyphs, painted first, clears a gap around each letter.
         */
        ...(text.role === 'label' && {
          stroke: 'var(--color-primary)',
          strokeWidth: LABEL_HALO,
          strokeLinejoin: 'round' as const,
          paintOrder: 'stroke',
        }),
      }}
    >
      {rest.length === 0
        ? first
        : text.lines.map((line, index) => (
            // The lines of one run never repeat, so each is its own key.
            <tspan key={line} x={text.x} dy={index === 0 ? 0 : size * leading}>
              {line}
            </tspan>
          ))}
    </text>
  )
}

export function Plate({ unit, title, description, className }: PlateProps) {
  const plate = PLATES[unit]

  return (
    <svg
      viewBox={plate.viewBox.join(' ')}
      role="img"
      className={cn(s.plate, className)}
      data-plate={unit}
    >
      <title>{title}</title>
      <desc>{description}</desc>
      {plate.marks.map((mark) => (
        <path key={mark.role} d={mark.d} style={markStyle(mark)} />
      ))}
      {plate.texts.map(renderText)}
    </svg>
  )
}

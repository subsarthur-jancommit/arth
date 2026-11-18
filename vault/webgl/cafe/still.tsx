/**
 * CafeStill — the café as an SVG, written by the server.
 *
 * Provenance: original work for this project. No third-party code copied.
 *
 * The picture every reader can have: without WebGL, under reduced motion,
 * before the canvas has drawn, after a lost context, and without JavaScript
 * (CLAUDE.md #14). It is projected from the same model, camera and light as
 * the WebGL renderer (`lib/cafe/still.ts`), so the two are one picture and
 * the hand-over between them moves nothing.
 *
 * ## The assembly, in CSS
 *
 * Each run of faces is a group with its stage's delay and drop
 * (`lib/cafe/assembly.ts`), animated by `cafe.module.css` on `transform` and
 * `opacity` only (CLAUDE.md #4). The roof's shade over the interior and each
 * contact shadow fade in with the stage that casts them. The animation runs
 * once, from the first paint, with no script; under reduced motion it does
 * not run at all and the still is whole from the start (CLAUDE.md #5).
 *
 * A server component: the projection, the depth sort and the light are
 * worked out here (`still()`, once per process) and reach the browser as
 * markup, not as code.
 */

import { type CSSProperties, Fragment } from 'react'

import { STAGE_MS, stageDelay } from '@/lib/cafe/assembly'
import { ROOF_STAGE, type Stage } from '@/lib/cafe/model'
import { type StillContact, type StillPolygon, still } from '@/lib/cafe/still'

import s from './cafe.module.css'

interface CafeStillProps {
  /**
   * Prefixes the picture's gradient, filter and clip ids, which must be
   * unique in the document: the hero and the phone's aside each render one.
   */
  id: string
}

/** A stage's timing and drop, as the CSS animation reads them. */
function stageStyle(stage: Stage, drop?: { x: number; y: number }) {
  return {
    '--cafe-delay': `${stageDelay(stage)}ms`,
    ...(drop && { '--cafe-x': `${drop.x}px`, '--cafe-y': `${drop.y}px` }),
  } as CSSProperties
}

export function CafeStill({ id }: CafeStillProps) {
  const picture = still()
  const ref = (local: string) => `${id}-${local}`

  // A face's paint; a shade fades in on the roof's beat (`.fade`).
  const polygon = (shape: StillPolygon, shade = false) => (
    <polygon
      className={shade ? s.fade : undefined}
      style={shade ? stageStyle(ROOF_STAGE) : undefined}
      points={shape.points}
      fill={shape.gradient ? `url(#${ref(shape.gradient)})` : shape.fill}
    />
  )

  const contact = (shadow: StillContact) => (
    <polygon
      key={shadow.id}
      className={s.fade}
      style={stageStyle(shadow.stage)}
      points={shadow.points}
      fill="#000"
      fillOpacity={shadow.opacity}
      filter={`url(#${ref(`b${shadow.blur}`)})`}
      clipPath={shadow.clip ? `url(#${ref(shadow.clip)})` : undefined}
    />
  )

  return (
    <svg
      className={s.still}
      viewBox={`0 0 ${picture.width} ${picture.height}`}
      style={{ '--cafe-duration': `${STAGE_MS}ms` } as CSSProperties}
      aria-hidden="true"
      focusable="false"
      data-cafe-still=""
    >
      <defs>
        {picture.gradients.map((gradient) => (
          <linearGradient
            key={gradient.id}
            id={ref(gradient.id)}
            gradientUnits="userSpaceOnUse"
            x1={gradient.x1}
            y1={gradient.y1}
            x2={gradient.x2}
            y2={gradient.y2}
          >
            <stop offset="0" stopColor={gradient.from} />
            <stop offset="1" stopColor={gradient.to} />
          </linearGradient>
        ))}
        {picture.blurs.map(([x, y], index) => (
          <filter
            // oxlint-disable-next-line react/no-array-index-key -- the index is the filter's identity: contact shadows refer to it by it.
            key={index}
            id={ref(`b${index}`)}
            x="-60%"
            y="-60%"
            width="220%"
            height="220%"
            colorInterpolationFilters="sRGB"
          >
            <feGaussianBlur stdDeviation={`${x} ${y}`} />
          </filter>
        ))}
        {picture.clips.map((clip) => (
          <clipPath key={clip.id} id={ref(clip.id)}>
            <polygon points={clip.points} />
          </clipPath>
        ))}
        <radialGradient
          id={ref('pool')}
          gradientUnits="userSpaceOnUse"
          cx="0"
          cy="0"
          r="1"
          gradientTransform={picture.pool.transform}
        >
          {picture.pool.stops.map((stop) => (
            <stop
              key={stop.offset}
              offset={stop.offset}
              stopColor={picture.pool.color}
              stopOpacity={stop.opacity}
            />
          ))}
        </radialGradient>
      </defs>

      {/* The ground the model stands on: the pool, the plinth's shadow. */}
      <g className={s.fade} style={stageStyle(0)}>
        <polygon points={picture.pool.points} fill={`url(#${ref('pool')})`} />
        {picture.ground.map(contact)}
      </g>

      {picture.runs.map((run, index) => (
        <g
          // oxlint-disable-next-line react/no-array-index-key -- runs are the depth order's; they never reorder.
          key={index}
          className={s.stage}
          style={stageStyle(run.stage, picture.drops[run.stage])}
          data-stage={run.stage}
        >
          {run.faces.map((face) => (
            <Fragment key={face.id}>
              {polygon(face.base)}
              {face.shade ? polygon(face.shade, true) : null}
              {face.contacts.map(contact)}
            </Fragment>
          ))}
        </g>
      ))}
    </svg>
  )
}

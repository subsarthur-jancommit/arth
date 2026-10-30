/**
 * A plate drawn into a 2D canvas: the picture the WebGL material is lit from.
 *
 * Provenance: original work for this project. No third-party code copied.
 * Written against the browser's own Canvas 2D API (`Path2D` accepts the SVG
 * path data `lib/plates` already writes).
 *
 * The second renderer `types.ts` promises. It reads the same two style
 * tables as `vault/blocks/plate`, so a weight or a dash changed there changes
 * here too. What differs is only what a texture needs: light lines on a black
 * ground, so the material can add them to the scene, and lines a little
 * heavier than the flat plate's, because a texture is sampled down on its way
 * to the screen and a hairline averaged with its neighbours goes grey.
 */

import {
  LABEL_HALO,
  MARK_STYLES,
  type Plate,
  type PlateText,
  TEXT_STYLES,
} from './types'

/** Lines in the texture, as a multiple of the flat plate's. */
const TEXTURE_WEIGHT = 1.5

/** The page's own faces, as `font-family` lists, for the canvas to set. */
export interface PlateFaces {
  mono: string
  display: string
}

const INK = (alpha = 1) => `rgba(255, 255, 255, ${alpha})`
const GROUND = '#000'

function setText(
  context: CanvasRenderingContext2D,
  text: PlateText,
  faces: PlateFaces
) {
  const style = TEXT_STYLES[text.role]
  const size = text.size ?? style.size
  const weight = text.weight ?? style.weight
  context.font = `${weight} ${size}px ${style.face === 'mono' ? faces.mono : faces.display}`
  context.textAlign =
    text.anchor === 'middle'
      ? 'center'
      : text.anchor === 'end'
        ? 'right'
        : 'left'
  context.textBaseline = text.central ? 'middle' : 'alphabetic'
  // Tracking is a recent addition to the 2D context; without it a label is
  // set a pixel tighter, which no reader of a lit model will miss.
  if ('letterSpacing' in context) {
    context.letterSpacing = `${style.tracking ?? 0}px`
  }
  return { size, opacity: style.opacity ?? 1 }
}

/**
 * Draws `plate` into a canvas `width` pixels wide, its view box filling it.
 * Returns the canvas, or `null` where the browser offers no 2D context.
 */
export function drawPlate(
  plate: Plate,
  width: number,
  faces: PlateFaces
): HTMLCanvasElement | null {
  const [left, top, viewWidth, viewHeight] = plate.viewBox
  const scale = width / viewWidth
  const canvas = document.createElement('canvas')
  canvas.width = Math.round(width)
  canvas.height = Math.round(viewHeight * scale)
  const context = canvas.getContext('2d')
  if (!context) return null

  context.fillStyle = GROUND
  context.fillRect(0, 0, canvas.width, canvas.height)
  context.setTransform(scale, 0, 0, scale, -left * scale, -top * scale)
  context.lineJoin = 'round'

  for (const mark of plate.marks) {
    const style = MARK_STYLES[mark.role]
    const path = new Path2D(mark.d)
    if (style.fill) {
      // `ground` paints black, which adds nothing to the scene: a grid
      // bubble still hides the axis behind it.
      context.fillStyle =
        style.fill === 'ink' ? INK(style.fillOpacity ?? 1) : GROUND
      context.fill(path)
    }
    if (style.stroke !== undefined) {
      context.strokeStyle = INK(style.strokeOpacity ?? 1)
      context.lineWidth = style.stroke * TEXTURE_WEIGHT
      context.lineCap = style.round ? 'round' : 'butt'
      context.setLineDash(style.dash ? [...style.dash] : [])
      context.stroke(path)
    }
  }
  context.setLineDash([])

  for (const text of plate.texts) {
    context.save()
    const { size, opacity } = setText(context, text, faces)
    if (text.rotate) {
      context.translate(text.x, text.y)
      context.rotate((text.rotate * Math.PI) / 180)
      context.translate(-text.x, -text.y)
    }
    const leading = text.leading ?? 1.25
    text.lines.forEach((line, index) => {
      const y = text.y + index * size * leading
      if (text.role === 'label') {
        context.strokeStyle = GROUND
        context.lineWidth = LABEL_HALO
        context.strokeText(line, text.x, y)
      }
      context.fillStyle = INK(opacity)
      context.fillText(line, text.x, y)
    })
    context.restore()
  }

  return canvas
}

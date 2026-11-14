'use client'

import { useThree } from '@react-three/fiber'
import { useEffect, useRef } from 'react'

/**
 * A scene's first drawn frame, reported to its DOM side, and taken back when
 * the context is lost.
 *
 * Provenance: original work for this project. No third-party code copied.
 * Written against the public API of @react-three/fiber.
 *
 * `vault/webgl/material-image`, `vault/webgl/scene-shell` and
 * `vault/webgl/plate-material` each hide a DOM fallback (the `<img>`, the CSS
 * wash, the flat drawing) only once their scene says a frame was drawn. They
 * used to say so from r3f's frame loop and nothing else, and the frame loop
 * keeps running when the GPU drops the context: three stops drawing, but
 * `useFrame` keeps being called. So a scene could report a frame that drew
 * nothing and hide its fallback over an empty box. A scene that had already
 * reported kept its fallback hidden through the loss, over a canvas that
 * could draw nothing, until the context came back, or for good if it never
 * did. `e2e/context-loss.e2e.ts` measures both.
 *
 * So `announce`, called from the scene's frame loop once everything it needs
 * to draw is in place, reports once and only from a live context. When the
 * context is lost, `onContextLost` tells the DOM side to show its fallback
 * again, and the next frame from the restored context reports again. Must be
 * used inside the canvas, from a scene.
 */
export function useFirstFrame(
  onFirstFrame: (() => void) | undefined,
  onContextLost: (() => void) | undefined
): () => void {
  const gl = useThree((state) => state.gl)
  const announced = useRef(false)

  useEffect(() => {
    const canvas = gl.domElement
    const lost = () => {
      announced.current = false
      onContextLost?.()
    }
    canvas.addEventListener('webglcontextlost', lost)
    return () => canvas.removeEventListener('webglcontextlost', lost)
  }, [gl, onContextLost])

  return () => {
    if (announced.current || gl.getContext().isContextLost()) return
    announced.current = true
    onFirstFrame?.()
  }
}

import { useThree } from '@react-three/fiber'
import { useTempus } from 'tempus/react'

/**
 * Where the WebGL frame runs in Tempus's order: after every writer.
 *
 * The canvas reads what the rest of the frame writes: the scroll Lenis sets
 * (order 5), the marquee's and the cursor's transforms (6 and 8), GSAP's
 * tweens and the passage's `data-plate-progress` (10), the batched DOM writes
 * of `lib/utils/raf.ts` (1000). Drawn after all of them, a scene reads rects
 * and progress that belong to the frame it draws.
 *
 * It was order 1, ahead of all of them, until G2: each frame the canvas drew
 * from the state the previous frame had left, one frame behind the page it
 * sits under (the owner's technical reference, §6). `e2e/frame-order.e2e.ts`
 * logs the order inside each frame and holds this one. One loop still: this
 * is a slot in Tempus, not a second `requestAnimationFrame` (`CLAUDE.md` #6).
 */
export const WEBGL_FRAME_ORDER = 1100

/**
 * RAF (Request Animation Frame) component for controlling WebGL rendering.
 *
 * Uses tempus for frame timing and manually advances the R3F frame loop.
 * The Canvas uses `frameloop="never"` so this component controls rendering.
 *
 * @param render - Whether to render frames. Set to false to pause rendering.
 */
export function RAF({ render = true }) {
  const advance = useThree((state) => state.advance)

  useTempus(
    ({ time }) => {
      if (render) {
        advance(time / 1000)
      }
    },
    {
      order: WEBGL_FRAME_ORDER,
    }
  )

  return null
}

/**
 * The reading line — where on the screen an item in a held sequence becomes
 * the one being read.
 *
 * Provenance: original work for this project. No third-party code copied.
 *
 * One number, in one place. `use-active-in-sequence.ts` builds its triggers
 * from it (an item leads once its top passes the line), and a block that has
 * to answer the same question at a single moment — which step is a reader at
 * when they press "Copy section link" — reads layout against it here.
 *
 * The moment read matters under reduced motion: no trigger is created then,
 * and the hook stays at the first item, so an answer taken from it would
 * point every copied link at step one.
 */

/** How far down the screen the line sits, as a percentage of its height. */
export const READING_LINE_PERCENT = 60

/**
 * The item at the reading line: the last one whose top has passed it, or the
 * first while none has. `tops` are viewport offsets, in document order.
 */
export function indexAtReadingLine(
  tops: readonly number[],
  viewportHeight: number
): number {
  const line = (viewportHeight * READING_LINE_PERCENT) / 100
  let index = 0
  for (const [position, top] of tops.entries()) {
    if (top <= line) index = position
  }
  return index
}

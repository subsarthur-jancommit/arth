/**
 * The two marks that say "this text is not Arthur's yet".
 *
 * ## Why they are constants rather than strings typed per page
 *
 * The content rules this project works to require both marks and give them a
 * fixed form: dummy text carries a **sample-content label on screen**, and
 * anything the owner has not answered becomes a **placeholder** shaped
 * `[PERLU PEMILIK: what is needed · an example of the answer]`. Both are
 * promises about every page, so both are checked rather than trusted:
 * F3-11 builds a render guard that refuses to serve either mark on a page
 * that may be indexed, and a build gate that fails when one is left in code
 * that ships as real content.
 *
 * A guard can only find a mark it can recognise. Written out per page, the
 * opener drifts — `[PERLU:`, `[PERLU PEMILIK -`, `[BUTUH PEMILIK:` — and a
 * guard that misses one lets fabricated-looking text reach a reader with no
 * warning. So the shape is decided here, once, and both the pages and the
 * guard read it from this module.
 *
 * Dependency-free on purpose: the guard runs at build time and the label
 * renders in a client component, so this module has to be importable from
 * either side without dragging anything along. Same reason `lib/brand.ts`
 * is.
 */

/**
 * The attribute a labelled sample block carries.
 *
 * An attribute rather than a class name because it is read by three things
 * that must agree — the stylesheet, the render guard, and the e2e sweep that
 * asserts every unit page is honest about being sample text — and a class
 * name is free to change for visual reasons alone.
 */
export const SAMPLE_CONTENT_ATTRIBUTE = 'data-sample-content'

/**
 * The opener every owner placeholder starts with.
 *
 * `PEMILIK` ("owner") is part of the opener rather than a parameter: the
 * content rules name exactly one audience for a placeholder, and a second
 * audience would be a second rule.
 */
export const PLACEHOLDER_OPENER = '[PERLU PEMILIK:'

/** The separator between what is needed and the example answer. */
export const PLACEHOLDER_SEPARATOR = '·'

/**
 * One owner placeholder, in the one shape the rules allow.
 *
 * @param need What the owner has to supply, as a noun phrase.
 * @param example The *shape* of an answer, never a suggested fact — the rule
 *   is explicit that an example shows the form of the reply and is not a
 *   proposal about the world.
 */
export function ownerPlaceholder(need: string, example: string): string {
  return `${PLACEHOLDER_OPENER} ${need} ${PLACEHOLDER_SEPARATOR} ${example}]`
}

/** Whether a string carries either mark. The render guard's one predicate. */
export function hasUnpublishableMark(text: string): boolean {
  return text.includes(PLACEHOLDER_OPENER)
}

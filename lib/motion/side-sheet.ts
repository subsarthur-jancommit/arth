/**
 * `side-sheet-swap` (`docs/MOTION-SPEC.md` §13.1, R6): the names its three
 * ends share.
 *
 * A link from one side of a unit to the other navigates with the
 * `side-sheet` transition type (`app/[locale]/[unit]/[side]/side-switcher.tsx`).
 * For that type only, the page's `<ViewTransition>` gives the outgoing sheet
 * the class `side-sheet-out` and the incoming one `side-sheet-in`, and
 * `lib/styles/css/global.css` animates those two classes. A typo at any of
 * the three ends raises nothing and animates nothing, so the names are
 * written once, here, and `e2e/side-sheet-swap.e2e.ts` fails if no view
 * transition carries the type.
 *
 * A plain module rather than a client one, because the server-rendered side
 * page reads the two class maps, and a `'use client'` module would hand it
 * client references instead of the values.
 */

export const SIDE_SHEET_TYPE = 'side-sheet'

/** An array because that is the shape `<Link transitionTypes>` takes. */
export const SIDE_SHEET_TYPES: string[] = [SIDE_SHEET_TYPE]

/** The outgoing sheet's class, for a side-to-side press and nothing else. */
export const SIDE_SHEET_EXIT = {
  [SIDE_SHEET_TYPE]: 'side-sheet-out',
  default: 'none',
}

/** The incoming sheet's class, for a side-to-side press and nothing else. */
export const SIDE_SHEET_ENTER = {
  [SIDE_SHEET_TYPE]: 'side-sheet-in',
  default: 'none',
}

/**
 * `side-sheet-swap` (`docs/MOTION-SPEC.md` §13.1, R6): the names its ends
 * share.
 *
 * The side page's `SideSheet` (`app/[locale]/[unit]/[side]/side-switcher.tsx`)
 * gives the outgoing sheet the class `side-sheet-out` and the incoming one
 * `side-sheet-in`, and `lib/styles/css/global.css` animates those two
 * classes. A typo at either end raises nothing and animates nothing, so the
 * names are written once, here, and `e2e/side-sheet-swap.e2e.ts` fails if
 * either half does not run.
 *
 * ## Why the classes are not chosen by transition type alone
 *
 * A link between the two sides still navigates with the `side-sheet`
 * transition type, and the two maps below still resolve by it. But React
 * hands a transition's types to the first commit that transition makes
 * (`claimQueuedTransitionTypes` in react-dom), and in production that commit
 * only moves the URL: with partial prefetching, the sheets themselves change
 * in a later commit, which carries no type, so a map alone resolved to
 * `none` and nothing moved (e2e run 41983464648). `SideSheet` therefore
 * names the classes directly once a press has asked for the exchange, and
 * keeps the maps for a commit that does carry the type.
 */

export const SIDE_SHEET_TYPE = 'side-sheet'

/** An array because that is the shape `<Link transitionTypes>` takes. */
export const SIDE_SHEET_TYPES: string[] = [SIDE_SHEET_TYPE]

/** The outgoing sheet's class. */
export const SIDE_SHEET_OUT = 'side-sheet-out'

/** The incoming sheet's class. */
export const SIDE_SHEET_IN = 'side-sheet-in'

/** The outgoing class for a commit that carries the type, and none other. */
export const SIDE_SHEET_EXIT = {
  [SIDE_SHEET_TYPE]: SIDE_SHEET_OUT,
  default: 'none',
}

/** The incoming class for a commit that carries the type, and none other. */
export const SIDE_SHEET_ENTER = {
  [SIDE_SHEET_TYPE]: SIDE_SHEET_IN,
  default: 'none',
}

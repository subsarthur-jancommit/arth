/**
 * One working-drawing plate per unit, in the order the units are listed.
 *
 * Provenance: original work for this project. No third-party code copied.
 *
 * The three plates draw one café, because `/layanan` follows one buyer
 * through all three units: Konstruksi readies the rented space, Teknologi
 * takes orders and payment at the table, Peekabo invites the neighbours
 * before the doors open (`docs/r4-arah-visual/README.md`). Each is a possible
 * sequence, not a project Arthur has done, and every place a plate is shown
 * says so in words (`plates.note` in `messages/`).
 */

import type { Unit } from '@/lib/content/units'
import type { Locale } from '@/lib/i18n/routing'

import { KONSTRUKSI_PLATE, KONSTRUKSI_PLATE_EN } from './konstruksi'
import { PEEKABO_PLATE, PEEKABO_PLATE_EN } from './peekabo'
import { TEKNOLOGI_PLATE, TEKNOLOGI_PLATE_EN } from './teknologi'
import type { Plate } from './types'

export type {
  MarkRole,
  MarkStyle,
  Plate,
  PlateMark,
  PlatePart,
  PlateText,
  TextRole,
  TextStyle,
} from './types'
export { LABEL_HALO, MARK_STYLES, TEXT_STYLES } from './types'

/** The plates in Indonesian, the site's first language. */
export const PLATES: Record<Unit, Plate> = {
  konstruksi: KONSTRUKSI_PLATE,
  teknologi: TEKNOLOGI_PLATE,
  peekabo: PEEKABO_PLATE,
}

/**
 * The same plates with their words in English (R7, block L4): the same marks
 * and positions, each label upper-cased and each note wrapped in English.
 */
export const PLATES_EN: Record<Unit, Plate> = {
  konstruksi: KONSTRUKSI_PLATE_EN,
  teknologi: TEKNOLOGI_PLATE_EN,
  peekabo: PEEKABO_PLATE_EN,
}

/** A unit's plate in the reader's locale; both renderers draw this one. */
export function plateFor(unit: Unit, locale: Locale): Plate {
  return locale === 'en' ? PLATES_EN[unit] : PLATES[unit]
}

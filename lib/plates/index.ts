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

import { KONSTRUKSI_PLATE } from './konstruksi'
import { PEEKABO_PLATE } from './peekabo'
import { TEKNOLOGI_PLATE } from './teknologi'
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

export const PLATES: Record<Unit, Plate> = {
  konstruksi: KONSTRUKSI_PLATE,
  teknologi: TEKNOLOGI_PLATE,
  peekabo: PEEKABO_PLATE,
}

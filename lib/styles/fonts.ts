import { Archivo, Geist, Geist_Mono, Instrument_Serif } from 'next/font/google'

/*
 * Four roles, three families — R4, chosen with the owner on 2026-10-24
 * (`docs/r4-arah-visual/README.md`, "Huruf dan pembagian halaman").
 *
 * - `display` — Archivo. Headings. A grotesque with a width axis (62–125):
 *   the stage pages (home, unit openings, one client three units, contact)
 *   set it wide, the document pages set it at normal width, so both themes
 *   read as one site. It replaces Syne, which was chosen for an art-world
 *   portfolio this site no longer is.
 * - `text` — Geist. Running text, navigation and buttons: neutral, and easy
 *   to read at length.
 * - `serif` — Instrument Serif. Only the buyer's quote that opens a situation
 *   page: the one human voice among technical drawings.
 * - `mono` — Geist Mono, unchanged. Labels, captions, measurements: the
 *   working-drawing voice. Every site measured in `docs/TEARDOWN.md` pairs its
 *   display face with a mono that carries metadata.
 *
 * All four are SIL Open Font License 1.1, read from each family's own
 * `OFL.txt` in github.com/google/fonts on 2026-10-24 (`docs/PROVENANCE.md`).
 *
 * No `weight` on the variable families (Archivo, Geist and Geist Mono ship a
 * variable `wght` axis): one file covers every weight the styles use, and
 * pinning weights would download a static file each. Instrument Serif ships a
 * single 400, so it names it. `axes: ['wdth']` asks for Archivo's width axis
 * on top of weight.
 *
 * The serif is not preloaded: it appears on situation pages only, and a
 * preload would fetch it on every route.
 */
const display = Archivo({
  subsets: ['latin'],
  display: 'swap',
  axes: ['wdth'],
  variable: '--next-font-display',
  fallback: ['system-ui', 'Helvetica Neue', 'Arial', 'sans-serif'],
})

const text = Geist({
  subsets: ['latin'],
  display: 'swap',
  variable: '--next-font-text',
  fallback: ['system-ui', 'Helvetica Neue', 'Arial', 'sans-serif'],
})

const serif = Instrument_Serif({
  subsets: ['latin'],
  display: 'swap',
  weight: '400',
  style: ['normal', 'italic'],
  preload: false,
  variable: '--next-font-serif',
  fallback: ['Georgia', 'Times New Roman', 'serif'],
})

const mono = Geist_Mono({
  subsets: ['latin'],
  display: 'swap',
  variable: '--next-font-mono',
  fallback: ['ui-monospace', 'SFMono-Regular', 'Menlo', 'monospace'],
})

const fonts = [display, text, serif, mono]
const fontsVariable = fonts.map((font) => font.variable).join(' ')

export { fontsVariable }

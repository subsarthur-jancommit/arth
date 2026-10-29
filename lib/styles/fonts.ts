import {
  Geist,
  Instrument_Sans,
  Martian_Mono,
  Mona_Sans,
} from 'next/font/google'

/*
 * Four roles, four families — R4, revised 2026-10-30.
 *
 * The owner approved Archivo, Geist, Instrument Serif and Geist Mono on
 * 2026-10-24, then asked for type that is "lebih VARIATIF dan MODERN". Two of
 * the four were near neighbours (Archivo and Geist are both grotesques set
 * upright), so a page read as one sans; and Instrument Serif is one of the
 * two display serifs the vendored taste skill bans as an AI tell
 * (`.claude/skills/taste-skill/SKILL.md` §4.1). Compared on the live copy in
 * headless Chrome before choosing (`docs/DESIGN-SYSTEM.md` §2):
 *
 * - `stage` — Mona Sans. Headings on the dark stage pages (home, unit
 *   openings, Layanan terpadu, Kontak), set expanded: the pitch-deck register
 *   the owner chose direction B for. A width axis (75–125), so a heading can
 *   change width without changing face.
 * - `document` — Instrument Sans. Headings on the light document pages, set
 *   narrow (87.5), and the buyer's quote in its true italic: the drawing
 *   register of direction A, precise rather than loud.
 * - `text` — Geist, unchanged. Running text, navigation and buttons.
 * - `mono` — Martian Mono, set at width 75. Labels, captions, measurements:
 *   the working-drawing voice. At 75 its advance is Geist Mono's, 0.590em a
 *   character, so every label keeps the width it was laid out at.
 *
 * Which heading face a page shows follows its theme, not its route: the dark
 * theme is the stage, the light theme the document (`global.css`, "The
 * heading face follows the register").
 *
 * All four are SIL Open Font License 1.1, read from each family's own
 * `OFL.txt` in github.com/google/fonts on 2026-10-30 (`docs/PROVENANCE.md`).
 *
 * No `weight` on any of them: each ships a variable `wght` axis, so one file
 * covers every weight the styles use, and pinning weights would download a
 * static file each. `axes: ['wdth']` asks for the width axis on top.
 */
const stage = Mona_Sans({
  subsets: ['latin'],
  display: 'swap',
  axes: ['wdth'],
  variable: '--next-font-stage',
  fallback: ['system-ui', 'Helvetica Neue', 'Arial', 'sans-serif'],
})

const documentFace = Instrument_Sans({
  subsets: ['latin'],
  display: 'swap',
  axes: ['wdth'],
  style: ['normal', 'italic'],
  variable: '--next-font-document',
  fallback: ['system-ui', 'Helvetica Neue', 'Arial', 'sans-serif'],
})

const text = Geist({
  subsets: ['latin'],
  display: 'swap',
  variable: '--next-font-text',
  fallback: ['system-ui', 'Helvetica Neue', 'Arial', 'sans-serif'],
})

const mono = Martian_Mono({
  subsets: ['latin'],
  display: 'swap',
  axes: ['wdth'],
  variable: '--next-font-mono',
  fallback: ['ui-monospace', 'SFMono-Regular', 'Menlo', 'monospace'],
})

const fonts = [stage, documentFace, text, mono]
const fontsVariable = fonts.map((font) => font.variable).join(' ')

export { fontsVariable }

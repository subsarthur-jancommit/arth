import { Geist_Mono, Inter, Onest } from 'next/font/google'
import localFont from 'next/font/local'

/*
 * Three roles, three families: R4, revised 2026-10-30.
 *
 * The owner asked for the type of the Framer website to be the example to
 * follow. Measured on framer.com in the browser on 2026-10-30: headings in
 * GT Walsheim Medium (500) tracked to -0.04em on a line-height near 1, and
 * running text in Inter, with optical sizes, near -0.01em.
 *
 * - `display`: Onest. Headings. GT Walsheim is a commercial face, so it
 *   cannot ship here; of seven open faces set beside it on Arthur's own
 *   headline, Onest broke the lines where GT Walsheim did and drew the
 *   closest a, e, j, k and y (`docs/DESIGN-SYSTEM.md` §2).
 * - `text`: Inter, as on framer.com. Running text, navigation, labels and
 *   buttons, and the buyer's quote in its italic. `axes: ['opsz']` brings
 *   the optical size axis, so the browser draws Inter Display at heading
 *   sizes and the text cut at reading sizes. The vendored taste skill
 *   discourages Inter as a default and lets it through when the brief names
 *   it (`.claude/skills/taste-skill/SKILL.md` §4.1); here the brief is the
 *   site that uses it.
 * - `mono`: Geist Mono, unchanged. The few places that set measurements or
 *   codes in a monospace.
 *
 * All three are SIL Open Font License 1.1, read from each family's own
 * `OFL.txt` in github.com/google/fonts on 2026-10-30 (`docs/PROVENANCE.md`).
 *
 * No `weight` on any of them: each ships a variable `wght` axis, so one file
 * covers every weight the styles use, and pinning weights would download a
 * static file each.
 *
 * ## `display: 'block'`, not `'swap'` — F4-06 perbaikan
 *
 * With the CSS inside the HTML (`inlineCss`, `next.config.ts`) a phone on a
 * slow link paints about a second and a half sooner, before the typefaces
 * have arrived. Under `swap` the text then showed in a stand-in face and
 * reflowed when Onest and Inter landed: measured in the lab, a layout shift
 * of up to 0.029 on seven templates, every one of them text. The owner's
 * answer, verbatim: "SAYA INGIN DESAINNYA TERLIHAT JELAS juga". So the
 * text waits, invisible, and appears in its own face.
 *
 * All four files serve some first screen, so all three families block:
 * Onest every heading, Inter every label and the unit hero's italic
 * subtitle, Geist Mono the home hero's index. None is dropped from the
 * preload, and no face or axis changes.
 *
 * Chrome holds blocked text for three seconds at most. In the lab (applied
 * slow 4G, 39 page loads) the last first-screen file arrived at most 2.0 s
 * after the first paint. On a link slow enough to pass three seconds the
 * stand-in does show, then, and swaps in when the face arrives: no worse
 * than `swap` on that link. `e2e/font-first-paint.e2e.ts` holds the block
 * and the timing on the home page and a unit page.
 *
 * Each stack's first fallback is a stand-in sized to the real face
 * (`lib/styles/css/font-fallbacks.css`), so blocked text is laid out where
 * the real face will draw it and nothing settles when it lands.
 */
const display = Onest({
  subsets: ['latin'],
  display: 'block',
  variable: '--next-font-display',
  fallback: [
    'Onest Fallback',
    'system-ui',
    'Helvetica Neue',
    'Arial',
    'sans-serif',
  ],
})

const text = Inter({
  subsets: ['latin'],
  display: 'block',
  axes: ['opsz'],
  style: ['normal', 'italic'],
  variable: '--next-font-text',
  fallback: [
    'Inter Fallback',
    'system-ui',
    'Helvetica Neue',
    'Arial',
    'sans-serif',
  ],
})

const mono = Geist_Mono({
  subsets: ['latin'],
  display: 'block',
  variable: '--next-font-mono',
  fallback: [
    'Geist Mono Fallback',
    'ui-monospace',
    'SFMono-Regular',
    'Menlo',
    'monospace',
  ],
})

/*
 * Inter's "ū", from a file of its own — F4-06 perbaikan.
 *
 * The colophon says "Satūs" (`footer.builtOn`), and Inter's `latin` file has
 * no "ū", so every page downloaded Inter's whole `latin-ext` file, 133,704
 * bytes, for one letter; on a slow phone link production requested it ahead
 * of the preloaded faces. This is that same glyph cut from that same file,
 * 1,704 bytes, both axes kept (`lib/styles/font-files/README.md`). The word
 * stays exactly as written, and in Inter.
 *
 * `unicode-range` limits it to U+016B and it is never preloaded. Only the
 * colophon line names it, first in its stack, so for "ū" the browser takes
 * this file and never asks for `latin-ext`; every other letter falls through
 * to Inter. `lib/styles/glyph-coverage.test.ts` holds the copy to the glyphs
 * these files cover.
 */
const textMacron = localFont({
  src: './font-files/inter-u-macron.woff2',
  weight: '100 900',
  style: 'normal',
  display: 'block',
  preload: false,
  adjustFontFallback: false,
  variable: '--next-font-text-macron',
  declarations: [{ prop: 'unicode-range', value: 'U+016B' }],
})

const fonts = [display, text, mono, textMacron]
const fontsVariable = fonts.map((font) => font.variable).join(' ')

export { fontsVariable }

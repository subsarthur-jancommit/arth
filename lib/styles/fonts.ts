import { Geist_Mono, Inter, Onest } from 'next/font/google'

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
 */
const display = Onest({
  subsets: ['latin'],
  display: 'swap',
  variable: '--next-font-display',
  fallback: ['system-ui', 'Helvetica Neue', 'Arial', 'sans-serif'],
})

const text = Inter({
  subsets: ['latin'],
  display: 'swap',
  axes: ['opsz'],
  style: ['normal', 'italic'],
  variable: '--next-font-text',
  fallback: ['system-ui', 'Helvetica Neue', 'Arial', 'sans-serif'],
})

const mono = Geist_Mono({
  subsets: ['latin'],
  display: 'swap',
  variable: '--next-font-mono',
  fallback: ['ui-monospace', 'SFMono-Regular', 'Menlo', 'monospace'],
})

const fonts = [display, text, mono]
const fontsVariable = fonts.map((font) => font.variable).join(' ')

export { fontsVariable }

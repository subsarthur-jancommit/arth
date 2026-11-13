# `lib/styles/font-files`

Font files committed to this repository, and where each came from. Everything
else the site sets in is served by `next/font/google` (`lib/styles/fonts.ts`,
`docs/PROVENANCE.md`).

## `inter-u-macron.woff2`: Inter's "ū", alone

**What it is.** One glyph, U+016B LATIN SMALL LETTER U WITH MACRON, cut from
Inter's own `latin-ext` file, with both of Inter's axes kept (`opsz` 14–32,
`wght` 100–900). 1,704 bytes.

**Why it exists.** The footer's colophon says "Satūs" (`messages/*.json`,
`footer.builtOn`). Inter's `latin` file has no "ū", so every page downloaded
Inter's whole `latin-ext` file, 133,704 bytes, for that one letter. On a slow
phone link, production measured it requested at 0.9–1.5 s, ahead of the
preloaded fonts on the same HTTP/2 connection (`docs/F4-06-UKUR.md` §8). This
file draws the same glyph from the same source, so the word stays exactly as
written and in Inter.

**How it is used.** `lib/styles/fonts.ts` declares it with `next/font/local`,
`unicode-range: U+016B`, not preloaded. Only the colophon line names it, first
in its stack (`components/layout/footer`), so for "ū" the browser takes this
file and never asks for Inter's `latin-ext`. Every other letter in that line
falls through to Inter as before. `lib/styles/glyph-coverage.test.ts` fails if
the copy starts to need a glyph that no shipped file covers where it is used.

**Provenance.**

|                    |                                                                                                                                                                                                                                    |
| ------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Source             | Inter, normal, `latin-ext` subset as Google Fonts serves it through `next/font/google`. Fetched from production on 2026-11-13: `https://arth-test-01.vercel.app/_next/static/immutable/media/c88e89b5552bf96c.3xt4epvyjlv6l.woff2` |
| Source SHA-256     | `8bc9dee39deab5dc6599980e563c5023053387e4c391f5c419543e493e024c39` (133,704 bytes)                                                                                                                                                 |
| Tool               | fontTools 4.68.0 (`pyftsubset`), with brotli 1.2.1                                                                                                                                                                                 |
| Command            | `pyftsubset inter-latin-ext-normal.woff2 --unicodes=U+016B --flavor=woff2 --layout-features='*' --name-IDs='*' --name-languages='*' --notdef-outline`                                                                              |
| Result SHA-256     | `59e5fc7b55609b229d081ca53f665231c61f2c8ea93ba171ddb0e9b897c58ec4` (1,704 bytes)                                                                                                                                                   |
| Copied or original | A modified version (a subset) of Inter. Not original work.                                                                                                                                                                         |

**Licence.** SIL Open Font License 1.1, read from Inter's own `OFL.txt` in
github.com/google/fonts (`ofl/inter/OFL.txt`, last changed in commit
`b0928647ba26`) on 2026-11-13. It is copied beside this file as
`OFL-Inter.txt`, as the licence requires. Its copyright line names **no
Reserved Font Name** ("Copyright 2020 The Inter Project Authors"), so a
modified version may keep the name Inter. The subset keeps the font's own name
table: copyright "Copyright 2016 The Inter Project Authors" and the licence
URL. OFL permits modification and embedding; it forbids selling the font on its
own, and none of that is done here.

**To rebuild it.** Take the `latin-ext` Inter file the current build serves,
run the command above with every glyph the copy needs added to `--unicodes`,
add the same code points to the `unicode-range` in `lib/styles/fonts.ts` and to
the allowance in `lib/styles/glyph-coverage.test.ts`, and update this table.

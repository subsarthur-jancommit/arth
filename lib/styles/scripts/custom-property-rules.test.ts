import { describe, expect, it } from 'bun:test'
import { readFile } from 'node:fs/promises'

import { Glob } from 'bun'

/**
 * A stylesheet reads only custom properties that something defines — R5.
 *
 * `var(--name)` naming a property nothing defines is an error nowhere. The
 * declaration is invalid at computed-value time, so the property quietly
 * becomes `inherit` or its initial value. `--text-primary` was read in five
 * places and defined in none: on a situation page it left the chosen market
 * chip without a background, and axe measured its text at **1.1:1** the
 * first time route-sweep reached one (e2e run 41175849016). The name looks
 * like a token, so review passed it; only a gate reads every one.
 *
 * ## What counts as defined
 *
 * Generous on purpose, so the gate fails only on a name nothing could set: a
 * `--name:` declaration or `@property --name` in any stylesheet below, or a
 * `--name` anywhere in our TypeScript outside a `var(`, which covers inline
 * `style` objects, `setProperty` and the `variable` option of `next/font`.
 * Comments are blanked first, so a sentence naming a token defines nothing,
 * and tests are skipped, so a fixture naming one does not either.
 *
 * `var(--name, fallback)` is not checked: the fallback is the author saying
 * the property may be absent.
 *
 * ## Known misses
 *
 * `KNOWN_UNDEFINED` is for a name read before anything defines it, recorded
 * with its reason when the fix moves layout someone has to look at first.
 * It held `--gutter` and `--background` until both were fixed, and is empty
 * now. The second test keeps it honest: an entry whose name gains a
 * definition or loses its last reader fails until it is deleted.
 */

const STYLE_GLOBS = [
  'app/**/*.css',
  'components/**/*.css',
  'vault/**/*.css',
  'lib/**/*.css',
]
const SCRIPT_GLOBS = [
  'app/**/*.{ts,tsx}',
  'components/**/*.{ts,tsx}',
  'vault/**/*.{ts,tsx}',
  'lib/**/*.{ts,tsx,mjs}',
]

const KNOWN_UNDEFINED = {} satisfies Record<string, string>

interface Use {
  file: string
  line: number
  name: string
}

/** `Bun.Glob` yields backslash paths on Windows; see `motion-rules.test.ts`. */
const posix = (file: string) => file.replaceAll('\\', '/')

/** Blank a comment, keeping its newlines so line numbers survive. */
const blank = (comment: string) => comment.replace(/[^\n]/g, ' ')
const withoutBlockComments = (source: string) =>
  source.replace(/\/\*[\s\S]*?\*\//g, blank)
// `//` opens no comment in CSS, and none after `:` in TypeScript (a URL).
const withoutLineComments = (source: string) =>
  source.replace(/(?<!:)\/\/[^\n]*/g, blank)

const captures = (source: string, pattern: RegExp) =>
  [...source.matchAll(pattern)].map((match) => match[1] ?? '')

/**
 * Every `--name` in a script that is not part of a name or a `var(`.
 *
 * Found by its literal `--` and checked backwards by hand. Written as one
 * pattern opening with `(?<!var\(\s*)`, the lookbehind ran at every position
 * of every file and the survey took 44 s; this way it takes milliseconds.
 */
function settable(source: string): string[] {
  const names: string[] = []
  for (const match of source.matchAll(/--[a-zA-Z][\w-]*/g)) {
    const index = match.index ?? 0
    const before = source.slice(Math.max(0, index - 16), index)
    if (/[\w-]$/.test(before) || /var\(\s*$/.test(before)) continue
    names.push(match[0])
  }
  return names
}

async function read(globs: string[]): Promise<[string, string][]> {
  const files: [string, string][] = []
  for (const pattern of globs) {
    for await (const scanned of new Glob(pattern).scan('.')) {
      files.push([posix(scanned), await readFile(scanned, 'utf8')])
    }
  }
  return files
}

async function survey() {
  const defined = new Set<string>()
  const uses: Use[] = []

  for (const [file, raw] of await read(STYLE_GLOBS)) {
    const source = withoutBlockComments(raw)
    for (const name of captures(source, /(--[\w-]+)\s*:/g)) {
      defined.add(name)
    }
    for (const name of captures(source, /@property\s+(--[\w-]+)/g)) {
      defined.add(name)
    }
    for (const match of source.matchAll(/var\(\s*(--[\w-]+)\s*\)/g)) {
      uses.push({
        file,
        line: source.slice(0, match.index ?? 0).split('\n').length,
        name: match[1] ?? '',
      })
    }
  }

  for (const [file, raw] of await read(SCRIPT_GLOBS)) {
    if (/\.test\.tsx?$/.test(file)) continue
    for (const name of settable(
      withoutLineComments(withoutBlockComments(raw))
    )) {
      defined.add(name)
    }
  }

  return { defined, uses }
}

const surveyed = survey()

describe('custom properties', () => {
  it('reads only properties something defines', async () => {
    const { defined, uses } = await surveyed
    const orphaned = uses
      .filter(
        ({ name }) =>
          !defined.has(name) && !Object.hasOwn(KNOWN_UNDEFINED, name)
      )
      .map(({ file, line, name }) => `${file}:${line} reads ${name}`)

    expect(orphaned).toEqual([])
  })

  it('lists as known only names still read and still undefined', async () => {
    const { defined, uses } = await surveyed
    const stale = Object.keys(KNOWN_UNDEFINED).filter(
      (name) => defined.has(name) || !uses.some((use) => use.name === name)
    )

    expect(stale).toEqual([])
  })
})

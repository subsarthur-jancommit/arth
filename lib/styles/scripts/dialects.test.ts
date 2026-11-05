import { describe, expect, it } from 'bun:test'
import { readFile } from 'node:fs/promises'

import { Glob } from 'bun'

import { UNITS } from '@/lib/content/units'

/**
 * The unit dialects say what `docs/MOTION-SPEC.md` §12.1 says, F4-02.
 *
 * `lib/styles/css/dialects.css` is the one place a dialect is written down.
 * This reads it as text, resolves its tokens against `global.css` and
 * `easings.css`, and holds each unit to its row of the table:
 *
 * | Unit       | Tempo                                                       |
 * | ---------- | ----------------------------------------------------------- |
 * | Konstruksi | long settle, 800-1200ms, out-expo; one object at a time     |
 * | Teknologi  | short ordered steps, 150-200ms each, out-quart               |
 * | Peekabo    | gleasing, responsive to scroll velocity; rows travel sideways |
 *
 * It also holds the two promises the base grammar rests on. Every reader of
 * a dialect parameter names its own base value as a fallback, so a page with
 * no dialect is unchanged by construction; and only a unit route chooses a
 * dialect. A reader without a fallback would compute nothing on the home
 * page, and a transition with no valid duration snaps: nothing else would
 * report it, because the name *is* defined, in this file.
 *
 * `e2e/unit-dialects.e2e.ts` measures the same things on rendered pages.
 */

const DIALECTS_CSS = 'lib/styles/css/dialects.css'
const GLOBAL_CSS = 'lib/styles/css/global.css'
const EASINGS_CSS = 'lib/styles/css/easings.css'

const posix = (file: string) => file.replaceAll('\\', '/')
const withoutComments = (source: string) =>
  source.replace(/\/\*[\s\S]*?\*\//g, (comment) =>
    comment.replace(/[^\n]/g, ' ')
  )

/** `--name: value;` pairs inside one `{ … }` body, values whitespace-folded. */
function declarations(body: string): Map<string, string> {
  const found = new Map<string, string>()
  for (const match of body.matchAll(/(--[\w-]+)\s*:\s*([^;]+);/g)) {
    found.set(match[1] ?? '', (match[2] ?? '').replace(/\s+/g, ' ').trim())
  }
  return found
}

/** The body of the first `{ … }` that opens at or after `from`. */
function bodyFrom(source: string, from: number): string {
  const open = source.indexOf('{', from)
  let depth = 1
  let index = open + 1
  while (depth > 0 && index < source.length) {
    if (source[index] === '{') depth += 1
    else if (source[index] === '}') depth -= 1
    index += 1
  }
  return source.slice(open + 1, index - 1)
}

const sources = (async () => {
  const [dialects, global, easings] = await Promise.all(
    [DIALECTS_CSS, GLOBAL_CSS, EASINGS_CSS].map(async (file) =>
      withoutComments(await readFile(file, 'utf8'))
    )
  )
  return {
    dialects: dialects ?? '',
    global: global ?? '',
    easings: easings ?? '',
  }
})()

/** Each `[data-dialect='x'] { … }` block, by name, outside any `@media`. */
async function dialectBlocks(): Promise<Map<string, Map<string, string>>> {
  const { dialects } = await sources
  const media = dialects.indexOf('@media')
  const top = media === -1 ? dialects : dialects.slice(0, media)
  const blocks = new Map<string, Map<string, string>>()
  for (const match of top.matchAll(/\[data-dialect='([\w-]+)'\]\s*\{/g)) {
    blocks.set(match[1] ?? '', declarations(bodyFrom(top, match.index ?? 0)))
  }
  return blocks
}

/** The durations and staggers `global.css` declares, in milliseconds. */
async function timeTokens(): Promise<Map<string, number>> {
  const { global } = await sources
  const tokens = new Map<string, number>()
  for (const match of global.matchAll(
    /(--(?:duration|stagger)[\w-]*)\s*:\s*([\d.]+)(ms|s)\s*;/g
  )) {
    const value = Number(match[2]) * (match[3] === 's' ? 1000 : 1)
    tokens.set(match[1] ?? '', value)
  }
  return tokens
}

/** The curves `easings.css` declares. */
async function curves(): Promise<Map<string, number[]>> {
  const { easings } = await sources
  const found = new Map<string, number[]>()
  for (const match of easings.matchAll(
    /(--ease-[\w-]+)\s*:\s*cubic-bezier\(([^)]*)\)/g
  )) {
    found.set(
      match[1] ?? '',
      (match[2] ?? '').split(',').map((part) => Number(part.trim()))
    )
  }
  return found
}

/** A duration parameter in milliseconds: a literal or one token. */
async function ms(value: string | undefined): Promise<number> {
  if (value === undefined) throw new Error('no value')
  const literal = /^([\d.]+)(ms|s)$/.exec(value)
  if (literal) return Number(literal[1]) * (literal[2] === 's' ? 1000 : 1)
  const token = /^var\((--[\w-]+)\)$/.exec(value)?.[1]
  const resolved = token ? (await timeTokens()).get(token) : undefined
  if (resolved === undefined) throw new Error(`cannot resolve ${value}`)
  return resolved
}

/** The easing token a parameter names, `var(--ease-x)` → `--ease-x`. */
function easeName(value: string | undefined): string | undefined {
  return /^var\((--ease-[\w-]+)\)$/.exec(value ?? '')?.[1]
}

/** One coordinate of a cubic Bézier from (0, 0) to (1, 1), at parameter `t`. */
const along = (a: number, b: number, t: number) =>
  3 * (1 - t) ** 2 * t * a + 3 * (1 - t) * t ** 2 * b + t ** 3

/**
 * Progress of a CSS `cubic-bezier(x1, y1, x2, y2)` at time `x` (0 to 1),
 * found by bisection on the curve's parameter: `x(t)` is monotonic for
 * every curve `easings.css` declares, since their x controls lie in [0, 1].
 */
function progressAt([x1 = 0, y1 = 0, x2 = 1, y2 = 1]: number[], x: number) {
  let low = 0
  let high = 1
  for (let step = 0; step < 60; step += 1) {
    const middle = (low + high) / 2
    if (along(x1, x2, middle) < x) low = middle
    else high = middle
  }
  return along(y1, y2, (low + high) / 2)
}

describe('unit dialects (MOTION-SPEC §12.1)', () => {
  it('declares one dialect per unit, and nothing else', async () => {
    const blocks = await dialectBlocks()
    expect([...blocks.keys()].toSorted()).toEqual([...UNITS].toSorted())
  })

  it('gives every dialect all four parameters', async () => {
    for (const [unit, parameters] of await dialectBlocks()) {
      expect(
        [...parameters.keys()].toSorted(),
        `${unit} is missing a parameter`
      ).toEqual([
        '--dialect-ease',
        '--dialect-settle',
        '--dialect-step',
        '--dialect-travel',
      ])
    }
  })

  it('names only easings the stylesheet declares', async () => {
    const declared = await curves()
    for (const [unit, parameters] of await dialectBlocks()) {
      const name = easeName(parameters.get('--dialect-ease'))
      expect(name, `${unit} names its curve by token`).toBeDefined()
      expect(declared.has(name ?? ''), `${unit}: ${name}`).toBe(true)
    }
  })

  it('Konstruksi settles long on out-expo, one object at a time', async () => {
    const konstruksi = (await dialectBlocks()).get('konstruksi')
    const settle = await ms(konstruksi?.get('--dialect-settle'))
    const step = await ms(konstruksi?.get('--dialect-step'))
    const ease = easeName(konstruksi?.get('--dialect-ease'))

    expect(settle).toBeGreaterThanOrEqual(800)
    expect(settle).toBeLessThanOrEqual(1200)
    expect(ease).toBe('--ease-out-expo')

    /*
     * "One object moves at a time": by the time the next object starts, the
     * one before it has covered nearly all of its travel on its own curve.
     */
    const curve = (await curves()).get('--ease-out-expo') ?? []
    expect(progressAt(curve, step / settle)).toBeGreaterThanOrEqual(0.95)

    // Never rising from below, the light movement §12.1 rules out.
    expect(konstruksi?.get('--dialect-travel')).toMatch(
      /^translateY\(calc\(var\(--gap\) \* -/
    )
  })

  it('Teknologi moves in short ordered steps on out-quart', async () => {
    const teknologi = (await dialectBlocks()).get('teknologi')
    const settle = await ms(teknologi?.get('--dialect-settle'))
    const step = await ms(teknologi?.get('--dialect-step'))

    expect(settle).toBeGreaterThanOrEqual(150)
    expect(settle).toBeLessThanOrEqual(200)
    expect(easeName(teknologi?.get('--dialect-ease'))).toBe('--ease-out-quart')
    // Each step starts as the one before it ends: nothing moves at once.
    expect(step).toBeGreaterThanOrEqual(settle)
  })

  it('Peekabo travels sideways on gleasing, at the reader`s speed', async () => {
    const peekabo = (await dialectBlocks()).get('peekabo')
    const travel = peekabo?.get('--dialect-travel') ?? ''

    expect(easeName(peekabo?.get('--dialect-ease'))).toBe('--ease-gleasing')
    expect(travel).toStartWith('translateX(')
    expect(travel).toContain('var(--scroll-velocity')
    // A quick ripple, not a countdown.
    expect(await ms(peekabo?.get('--dialect-step'))).toBeLessThanOrEqual(
      await ms(peekabo?.get('--dialect-settle'))
    )
  })

  it('collapses every dialect to stillness under reduced motion', async () => {
    const { dialects } = await sources
    const media = /@media\s*\(--reduced-motion\)\s*\{/.exec(dialects)
    expect(media, 'dialects.css has no reduced-motion block').not.toBeNull()

    const body = bodyFrom(dialects, media?.index ?? 0)
    const collapsed = declarations(
      bodyFrom(body, body.indexOf('[data-dialect]'))
    )
    expect(collapsed.get('--dialect-travel')).toBe('none')
    expect(await ms(collapsed.get('--dialect-step'))).toBe(0)
    expect(await ms(collapsed.get('--dialect-settle'))).toBeLessThanOrEqual(
      0.01
    )
  })
})

describe('the base grammar is the absence of a dialect', () => {
  it('every reader of a dialect parameter names a fallback', async () => {
    const offenders: string[] = []
    for (const pattern of [
      'app/**/*.css',
      'components/**/*.css',
      'vault/**/*.css',
      'lib/**/*.css',
    ]) {
      for await (const scanned of new Glob(pattern).scan('.')) {
        const file = posix(scanned)
        const source = withoutComments(await readFile(scanned, 'utf8'))
        for (const match of source.matchAll(
          /var\(\s*(--dialect-[\w-]+)\s*(.)/g
        )) {
          if (match[2] === ',') continue
          const line = source.slice(0, match.index ?? 0).split('\n').length
          offenders.push(`${file}:${line} reads ${match[1]} with no fallback`)
        }
      }
    }
    expect(offenders).toEqual([])
  })

  it('only a unit route chooses a dialect', async () => {
    const choosers: string[] = []
    for await (const scanned of new Glob('app/**/*.tsx').scan('.')) {
      const source = await readFile(scanned, 'utf8')
      if (/\bdialect=\{/.test(source)) choosers.push(posix(scanned))
    }

    expect(choosers.length, 'no route chooses a dialect').toBeGreaterThan(0)
    for (const file of choosers) {
      expect(file).toStartWith('app/[locale]/[unit]/')
    }
  })
})

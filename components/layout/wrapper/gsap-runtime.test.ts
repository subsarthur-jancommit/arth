import { describe, expect, it } from 'bun:test'
import { existsSync } from 'node:fs'
import { readFile } from 'node:fs/promises'
import { dirname, join, relative } from 'node:path'

import { Glob } from 'bun'

/**
 * A page that drives GSAP mounts GSAP's runtime: `CLAUDE.md` #6.
 *
 * `<Wrapper gsap>` mounts `GSAPRuntime`, which hands GSAP's ticker to Tempus,
 * and has Lenis drive ScrollTrigger. A page that renders anything making a
 * tween or a ScrollTrigger without it gets GSAP's own `requestAnimationFrame`
 * loop beside Tempus's, the second loop rule #6 forbids, and triggers that
 * read native scroll while Lenis moves the page. The unit page shipped that
 * way from F3-02 until F4-02: `ProgressText` and `useActiveInSequence` both
 * run ScrollTriggers there, and its `<Wrapper>` passed no `gsap`. Nothing
 * failed. It only ticked on two clocks.
 *
 * ## What this reads
 *
 * Every file under `app/` that renders a `<Wrapper>`, and every module it
 * imports, followed through `@/` and relative imports. Type-only imports
 * render nothing and are skipped. A module that imports `gsap` or
 * `@gsap/react` drives GSAP's clock. One that imports only a plugin does not
 * (`vault/motion/flip` takes `gsap/ScrollTrigger` to pause other pages'
 * triggers): a plugin alone loads no core and starts no ticker. The walk
 * stops at the runtime itself, which every page reaches through `<Wrapper>`.
 *
 * ## What it cannot see
 *
 * It reads imports, not renders. A file that imports a GSAP block and
 * renders it in one branch only still asks for `gsap` on every `<Wrapper>`
 * it renders. That over-asks rather than under-asks, which is the safe side
 * for a rule about a second loop: split the file, or record it below.
 */

/** Where the walk stops: the runtime `<Wrapper gsap>` mounts. */
const RUNTIME = new Set([
  'components/effects/gsap.tsx',
  'components/layout/lenis/scroll-trigger.tsx',
])

/**
 * Pages known to drive GSAP without its runtime, each with its reason. The
 * last test fails once an entry no longer needs to be here.
 *
 * Empty. It held the side page (`StepSequence`) while another PR was editing
 * that file; F4-02 passed `gsap` there once it was free.
 */
const KNOWN_MISSING = {} satisfies Record<string, string>

const posix = (file: string) => file.replaceAll('\\', '/')
const withoutComments = (source: string) =>
  source.replace(/\/\*[\s\S]*?\*\//g, '').replace(/^\s*\/\/.*$/gm, '')

/** A module specifier as a repository file, or `null` for a package. */
function resolve(from: string, specifier: string): string | null {
  let base: string
  if (specifier.startsWith('@/')) base = specifier.slice(2)
  else if (specifier.startsWith('.')) base = join(dirname(from), specifier)
  else return null
  for (const candidate of [
    base,
    `${base}.ts`,
    `${base}.tsx`,
    join(base, 'index.ts'),
    join(base, 'index.tsx'),
  ]) {
    if (/\.tsx?$/.test(candidate) && existsSync(candidate)) {
      return posix(relative('.', candidate))
    }
  }
  return null
}

interface Module {
  imports: string[]
  drivesGsap: boolean
}

const modules = new Map<string, Promise<Module>>()

function read(file: string): Promise<Module> {
  const cached = modules.get(file)
  if (cached) return cached
  const parsed = readFile(file, 'utf8').then((raw) => {
    const source = withoutComments(raw)
    const imports: string[] = []
    let drivesGsap = false
    for (const match of source.matchAll(
      /(?:^|\n)\s*(?:import|export)\s+(type\s+)?[^;'"]*?from\s+['"]([^'"]+)['"]|import\(\s*['"]([^'"]+)['"]\s*\)/g
    )) {
      if (match[1]) continue
      const specifier = match[2] ?? match[3] ?? ''
      if (/^(?:gsap|@gsap\/react)$/.test(specifier)) drivesGsap = true
      const target = resolve(file, specifier)
      if (target) imports.push(target)
    }
    return { imports, drivesGsap }
  })
  modules.set(file, parsed)
  return parsed
}

/** Every module reachable from `file` that drives GSAP, breadth first. */
async function gsapDrivers(file: string): Promise<string[]> {
  const seen = new Set<string>([file])
  const drivers: string[] = []
  let layer = [file]
  while (layer.length > 0) {
    const parsed = await Promise.all(layer.map(read))
    const next: string[] = []
    for (const [index, module] of parsed.entries()) {
      if (module.drivesGsap) drivers.push(layer[index] ?? '')
      for (const target of module.imports) {
        if (seen.has(target) || RUNTIME.has(target)) continue
        seen.add(target)
        next.push(target)
      }
    }
    layer = next
  }
  return drivers
}

/** Each `<Wrapper …>` opening tag, read past braces in its attributes. */
function wrapperTags(source: string): string[] {
  const tags: string[] = []
  for (const match of source.matchAll(/<Wrapper\b/g)) {
    let depth = 0
    let end = match.index ?? 0
    for (; end < source.length; end += 1) {
      const character = source[end]
      if (character === '{') depth += 1
      else if (character === '}') depth -= 1
      else if (character === '>' && depth === 0) break
    }
    tags.push(source.slice(match.index ?? 0, end + 1))
  }
  return tags
}

interface Page {
  file: string
  drivers: string[]
  passesGsap: boolean
}

async function pages(): Promise<Page[]> {
  const found: Page[] = []
  for await (const scanned of new Glob('app/**/*.tsx').scan('.')) {
    const file = posix(scanned)
    const tags = wrapperTags(withoutComments(await readFile(file, 'utf8')))
    if (tags.length === 0) continue
    found.push({
      file,
      drivers: await gsapDrivers(file),
      passesGsap: tags.every((tag) => /\sgsap\b/.test(tag)),
    })
  }
  return found
}

const surveyed = pages()

describe('a page that drives GSAP mounts its runtime (CLAUDE.md #6)', () => {
  it('finds pages, and pages that drive GSAP, to check', async () => {
    const all = await surveyed
    expect(all.length).toBeGreaterThan(5)
    expect(all.some((page) => page.drivers.length > 0)).toBe(true)
  })

  it('passes `gsap` to every Wrapper of a page that drives GSAP', async () => {
    const offenders = (await surveyed)
      .filter(
        (page) =>
          page.drivers.length > 0 &&
          !page.passesGsap &&
          !Object.hasOwn(KNOWN_MISSING, page.file)
      )
      .map((page) => `${page.file} renders ${page.drivers.join(', ')}`)

    expect(offenders).toEqual([])
  })

  it('lists as known only pages that still drive GSAP without it', async () => {
    const all = await surveyed
    const stale = Object.keys(KNOWN_MISSING).filter((file) => {
      const page = all.find((candidate) => candidate.file === file)
      return !page || page.drivers.length === 0 || page.passesGsap
    })

    expect(stale).toEqual([])
  })
})

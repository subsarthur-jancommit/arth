/**
 * Refuses editorial placeholder literals in reader-facing source files.
 *
 * Studio validation and the render guard protect data that arrives through
 * Sanity. This guard covers a different path: a hard-coded placeholder in a
 * component would otherwise bypass both and could reach a page after noindex
 * is lifted. It reads only tracked source files, which keeps generated output,
 * dependencies, and local context out of the result.
 */

const PLACEHOLDER_PATTERN = /\[PERLU|isi contoh|teks sementara/i

const SOURCE_FILE_PATTERN = /\.(?:[cm]?[jt]sx?)$/

/**
 * These modules must recognize or centrally supply placeholder text.
 *
 * `sample-content.ts` remains a temporary exception while global noindex is
 * active. Its cost is that it must be deleted before F5-05 can permit
 * indexing; allowing any other reader source would hide that release risk.
 */
const ALLOWED_SOURCES = new Set([
  'lib/scripts/check-public-copy.ts',
  'lib/content/public-content-guard.ts',
  'lib/content/sample-content.ts',
  'lib/integrations/sanity/schemas/internal.ts',
])

function trackedSourceFiles(): string[] {
  const result = Bun.spawnSync(['git', 'ls-files'])
  if (result.exitCode !== 0) {
    console.error(
      'check:public-copy: `git ls-files` failed; cannot verify tracked source files.'
    )
    process.exit(1)
  }

  return result.stdout
    .toString()
    .split('\n')
    .filter(
      (path) =>
        SOURCE_FILE_PATTERN.test(path) &&
        !path.endsWith('.test.ts') &&
        !path.endsWith('.test.tsx') &&
        !ALLOWED_SOURCES.has(path)
    )
}

async function main(): Promise<void> {
  const violations: string[] = []

  for (const path of trackedSourceFiles()) {
    const lines = (await Bun.file(path).text()).split('\n')

    for (const [index, line] of lines.entries()) {
      if (PLACEHOLDER_PATTERN.test(line)) {
        violations.push(`${path}:${index + 1}`)
      }
    }
  }

  if (violations.length > 0) {
    console.error(
      'check:public-copy: editorial placeholders belong in Sanity drafts, not reader-facing source:'
    )
    for (const violation of violations) console.error(`  ${violation}`)
    process.exit(1)
  }

  console.log(
    'check:public-copy: no placeholder literals outside reviewed guards'
  )
}

if (import.meta.main) {
  await main()
}

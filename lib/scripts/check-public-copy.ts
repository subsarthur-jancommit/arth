/**
 * Refuses editorial placeholder literals in reader-facing source files.
 *
 * Studio validation and the render guard protect data that arrives through
 * Sanity. This guard covers a different path: a hard-coded placeholder in a
 * component would otherwise bypass both and could reach a page after noindex
 * is lifted. It reads only tracked source files, which keeps generated output,
 * dependencies, and local context out of the result.
 */

import { readFileSync } from 'node:fs'

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

/**
 * Notes written for the owner or the editor rather than the buyer, and the
 * placeholder contact details they annotate.
 *
 * Owner decision P4 (`docs/RENCANA-REVISI-F3.md`): a reader never sees a note
 * meant for the editor. Before R0 these reached every page from the message
 * catalogues — "Ganti sebelum kontak Arthur diterbitkan", a `NOTE:` prefix,
 * `kontak@arth.invalid` (`docs/TINJAUAN-F01-F03.md` E7.1).
 */
const EDITOR_NOTE_PATTERN =
  /\bNOTE:|\bdummy\b|Ganti sebelum|Replace it before|\.invalid\b|Contoh No\.|Example Street|setelah disusun di Sanity|disetujui untuk tayang|approved for publication|keputusan pemilik|setelah pemilik/i

/**
 * Message keys allowed to carry such a note, each with the reason no public
 * reader reaches it.
 */
const ALLOWED_MESSAGE_KEYS = new Map([
  // Rendered only inside Sanity draft mode, for the editor.
  ['home.draftPreview', 'draft mode only'],
  ['contactPage.draftPreview', 'draft mode only'],
  ['policyPage.draftPreview', 'draft mode only'],
  // Legacy fixture pages, labelled dummy by plan until F5-04 removes them.
  ['project.contactPlaceholderNote', '/work fixtures, removed at F5-04'],
  ['journal.contactPlaceholderNote', '/journal fixtures, removed at F5-04'],
  // No page reads the `studio` namespace since `/studio` became a redirect.
  ['studio.closing', 'unread namespace'],
])

/** A next-intl message catalogue: strings, nested under namespace keys. */
type MessageTree = string | { [key: string]: MessageTree }

function messageViolations(): string[] {
  const violations: string[] = []

  for (const locale of ['id', 'en']) {
    const path = `messages/${locale}.json`
    const walk = (node: MessageTree, prefix: string) => {
      if (typeof node === 'string') {
        if (
          EDITOR_NOTE_PATTERN.test(node) &&
          !ALLOWED_MESSAGE_KEYS.has(prefix)
        ) {
          violations.push(`${path} ${prefix}`)
        }
        return
      }
      for (const [key, value] of Object.entries(node)) {
        walk(value, prefix ? `${prefix}.${key}` : key)
      }
    }
    walk(JSON.parse(readFileSync(path, 'utf8')) as MessageTree, '')
  }

  return violations
}

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

  const notes = messageViolations()
  if (notes.length > 0) {
    console.error(
      'check:public-copy: notes for the editor must not reach a reader (owner decision P4):'
    )
    for (const note of notes) console.error(`  ${note}`)
    process.exit(1)
  }

  if (violations.length > 0) {
    console.error(
      'check:public-copy: editorial placeholders belong in Sanity drafts, not reader-facing source:'
    )
    for (const violation of violations) console.error(`  ${violation}`)
    process.exit(1)
  }

  console.log(
    'check:public-copy: no placeholder literals or editor notes outside reviewed guards'
  )
}

if (import.meta.main) {
  await main()
}

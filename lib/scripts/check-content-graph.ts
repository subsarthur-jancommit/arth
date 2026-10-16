/**
 * Prints the content graph report for Arthur's Sanity documents
 * (docs/RENCANA-KONTEKS-V2.md §6.4). Read-only: it never writes.
 *
 * Run it before and after every “ok tulis”, and attach the report.
 *
 * ```bash
 * # Published documents, through the public API, no token:
 * NEXT_PUBLIC_SANITY_PROJECT_ID=<id> bun lib/scripts/check-content-graph.ts
 *
 * # Drafts too, newest version of each document (needs a read token):
 * NEXT_PUBLIC_SANITY_PROJECT_ID=<id> SANITY_API_READ_TOKEN=<token> \
 *   bun lib/scripts/check-content-graph.ts --drafts
 * ```
 *
 * `--strict` exits with 1 when any error is found.
 */

import {
  checkGraph,
  type GraphDocument,
  graphReport,
  latestVersions,
} from '@/lib/content/content-graph'

const API_VERSION = '2025-03-01'

const ARTHUR_TYPES = [
  'siteSettings',
  'unit',
  'side',
  'bab',
  'offer',
  'faq',
  'sequence',
  'howWeWork',
  'page',
]

async function fetchDocuments(options: {
  projectId: string
  dataset: string
  token: string | undefined
  drafts: boolean
}): Promise<GraphDocument[]> {
  const perspective = options.drafts ? 'raw' : 'published'
  const url = `https://${options.projectId}.api.sanity.io/v${API_VERSION}/data/query/${options.dataset}?perspective=${perspective}`
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      ...(options.token && { authorization: `Bearer ${options.token}` }),
    },
    body: JSON.stringify({
      query: '*[_type in $types]',
      params: { types: ARTHUR_TYPES },
    }),
  })
  if (!response.ok) throw new Error(`Sanity answered ${response.status}`)
  const body = (await response.json()) as { result: GraphDocument[] }
  return body.result
}

async function main() {
  const drafts = process.argv.includes('--drafts')
  const strict = process.argv.includes('--strict')
  const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID
  const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET ?? 'production'
  const token = process.env.SANITY_API_READ_TOKEN

  if (!projectId) {
    console.error(
      'Usage: NEXT_PUBLIC_SANITY_PROJECT_ID=<id> bun lib/scripts/check-content-graph.ts [--drafts] [--strict]'
    )
    process.exit(1)
  }
  if (drafts && !token) {
    console.error(
      '--drafts needs SANITY_API_READ_TOKEN (set, value not printed).'
    )
    process.exit(1)
  }

  const documents = await fetchDocuments({ projectId, dataset, token, drafts })
  const findings = checkGraph(documents)

  console.log(
    `# Grafik isi Arthur\n\nDataset ${dataset}, ${drafts ? 'draf dan terbit (versi terbaru)' : 'terbit saja'}, ${new Date().toISOString()}.\n`
  )
  console.log(graphReport(findings, latestVersions(documents).length))

  if (strict && findings.some((finding) => finding.severity === 'error')) {
    process.exit(1)
  }
}

if (import.meta.main) await main()

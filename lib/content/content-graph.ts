/**
 * Coherence checks over Arthur's Sanity documents, as pure functions.
 *
 * `lib/scripts/check-content-graph.ts` fetches the documents and prints the
 * report; everything that decides whether the graph is sound lives here so it
 * can be tested without a dataset. The checks follow
 * docs/RENCANA-KONTEKS-V2.md §6.3 and §6.4: every child has a parent, a
 * chapter carries three to seven offers, references point at something a
 * reader can open, keys and slugs are unique where the URL needs them, and
 * the text passes the style gate.
 */

import { checkDocument, VERBATIM_FIELDS } from '@/lib/content/style-gate'
import { isSideOf, isUnit } from '@/lib/content/units'

export type GraphSeverity = 'error' | 'warning'

export interface GraphFinding {
  severity: GraphSeverity
  check: string
  id: string
  message: string
}

interface Reference {
  _ref?: string
}

/** The fields the checks read; the rest of each document rides along for the style gate. */
export interface GraphDocument {
  _id: string
  _type: string
  statusTinjauan?: string | null
  kunci?: string | null
  slug?: { current?: string } | null
  unit?: Reference | null
  sisi?: Reference | null
  bab?: Reference | null
  contohOffer?: readonly Reference[] | null
  jembatan?:
    | readonly { offer?: Reference | null }[]
    | { offer?: Reference | null }
    | null
  /** A list of links on `siteSettings`; prose on `bab` and `offer`. */
  situasi?: unknown
  [field: string]: unknown
}

interface HomeSituation {
  _key?: string
  babTujuan?: Reference | null
}

/** Chapter size from Peta website: a choice, not the catalogue. */
export const MIN_OFFERS_PER_CHAPTER = 3
export const MAX_OFFERS_PER_CHAPTER = 7

const publishedId = (id: string) => id.replace(/^drafts\./, '')

const isApproved = (document: GraphDocument | undefined) =>
  document?.statusTinjauan === 'disetujui'

const refsOf = (value: GraphDocument['jembatan']): Reference[] => {
  if (!value) return []
  const entries = Array.isArray(value) ? value : [value]
  return entries.flatMap((entry) => (entry.offer?._ref ? [entry.offer] : []))
}

/**
 * Collapse drafts onto their published ids: the newest version of each
 * document is the one a review is about.
 */
export function latestVersions(
  documents: readonly GraphDocument[]
): GraphDocument[] {
  const byId = new Map<string, GraphDocument>()
  for (const document of documents) {
    const id = publishedId(document._id)
    const existing = byId.get(id)
    if (!existing || document._id.startsWith('drafts.')) {
      byId.set(id, document)
    }
  }
  return [...byId.values()]
}

export function checkGraph(
  documents: readonly GraphDocument[]
): GraphFinding[] {
  const latest = latestVersions(documents)
  const byId = new Map(
    latest.map((document) => [publishedId(document._id), document])
  )
  const findings: GraphFinding[] = []
  const add = (
    severity: GraphSeverity,
    check: string,
    document: GraphDocument,
    message: string
  ) =>
    findings.push({ severity, check, id: publishedId(document._id), message })

  const parentOf = (ref: Reference | null | undefined) =>
    ref?._ref ? byId.get(publishedId(ref._ref)) : undefined

  // 1. Every child has a parent, and an approved child an approved parent.
  const parentField = { side: 'unit', bab: 'sisi', offer: 'bab' } as const
  for (const document of latest) {
    const field =
      parentField[document._type as keyof typeof parentField] ?? undefined
    if (!field) continue
    const ref = document[field] as Reference | null | undefined
    const parent = parentOf(ref)
    if (!ref?._ref || !parent) {
      add(
        'error',
        'induk-hilang',
        document,
        `${field} tidak menunjuk dokumen yang ada`
      )
    } else if (isApproved(document) && !isApproved(parent)) {
      add(
        'error',
        'induk-belum-disetujui',
        document,
        `disetujui, tetapi ${field} induknya belum; pembaca tidak akan sampai ke sini`
      )
    }
  }

  // 2. A side's key belongs to its unit.
  for (const side of latest.filter((document) => document._type === 'side')) {
    const unit = parentOf(side.unit)?.kunci ?? undefined
    if (isUnit(unit) && !isSideOf(unit, side.kunci ?? undefined)) {
      add(
        'error',
        'kunci-sisi',
        side,
        `sisi ${side.kunci} bukan sisi unit ${unit}`
      )
    }
  }

  // 3. Slugs are unique within their parent, because the URL nests them.
  for (const [type, field] of [
    ['bab', 'sisi'],
    ['offer', 'bab'],
  ] as const) {
    const seen = new Map<string, GraphDocument>()
    for (const document of latest.filter((item) => item._type === type)) {
      const slug = document.slug?.current
      const parent = (document[field] as Reference | null | undefined)?._ref
      if (!slug || !parent) continue
      const key = `${publishedId(parent)}/${slug}`
      const other = seen.get(key)
      if (other) {
        add(
          'error',
          'slug-ganda',
          document,
          `slug ${slug} juga dipakai ${publishedId(other._id)}`
        )
      } else {
        seen.set(key, document)
      }
    }
  }

  // 4. An approved chapter shows three to seven approved offers.
  const approvedOffersByChapter = new Map<string, number>()
  for (const offer of latest.filter(
    (document) => document._type === 'offer' && isApproved(document)
  )) {
    const chapter = offer.bab?._ref ? publishedId(offer.bab._ref) : undefined
    if (chapter) {
      approvedOffersByChapter.set(
        chapter,
        (approvedOffersByChapter.get(chapter) ?? 0) + 1
      )
    }
  }
  for (const chapter of latest.filter(
    (document) => document._type === 'bab' && isApproved(document)
  )) {
    const count = approvedOffersByChapter.get(publishedId(chapter._id)) ?? 0
    if (count < MIN_OFFERS_PER_CHAPTER) {
      add(
        'warning',
        'bab-terlalu-sedikit',
        chapter,
        `${count} offer disetujui; bab tampil sebagai situasi tanpa halaman sampai ada ${MIN_OFFERS_PER_CHAPTER}`
      )
    } else if (count > MAX_OFFERS_PER_CHAPTER) {
      add(
        'warning',
        'bab-terlalu-banyak',
        chapter,
        `${count} offer disetujui; daftar pendek meminta paling banyak ${MAX_OFFERS_PER_CHAPTER}`
      )
    }
  }

  // 5. Cross references point at an approved offer or chapter.
  for (const document of latest.filter(isApproved)) {
    const targets = [
      ...refsOf(document.jembatan),
      ...(document.contohOffer ?? []),
    ]
    for (const ref of targets) {
      if (!ref._ref) continue
      const target = byId.get(publishedId(ref._ref))
      if (!isApproved(target)) {
        add(
          'warning',
          'rujukan-belum-terbit',
          document,
          `menunjuk ${publishedId(ref._ref)} yang belum disetujui; tautannya tidak tampil`
        )
      }
    }
    // Only the home page's situations are a list of links; `bab.situasi`
    // and `offer.situasi` are prose with the same field name.
    const situations =
      document._type === 'siteSettings' && Array.isArray(document.situasi)
        ? (document.situasi as readonly HomeSituation[])
        : []
    for (const situation of situations) {
      const target = situation.babTujuan?._ref
        ? byId.get(publishedId(situation.babTujuan._ref))
        : undefined
      if (!situation.babTujuan?._ref) {
        add(
          'warning',
          'situasi-tanpa-bab',
          document,
          `situasi ${situation._key ?? ''} belum menunjuk bab`
        )
      } else if (!isApproved(target)) {
        add(
          'warning',
          'situasi-bab-belum-terbit',
          document,
          `situasi ${situation._key ?? ''} menunjuk bab yang belum disetujui`
        )
      }
    }
  }

  // 6. The text passes the style gate.
  for (const document of latest) {
    const verbatim =
      VERBATIM_FIELDS[document._type as keyof typeof VERBATIM_FIELDS] ?? []
    for (const finding of checkDocument(
      document as Parameters<typeof checkDocument>[0],
      verbatim
    )) {
      add(
        finding.level,
        `gaya: ${finding.rule}`,
        document,
        `${finding.path}: “${finding.excerpt}”`
      )
    }
  }

  return findings
}

/** A Markdown report: totals per check, then each finding. */
export function graphReport(
  findings: readonly GraphFinding[],
  documentCount: number,
  limit = 60
): string {
  const totals = new Map<string, { severity: GraphSeverity; count: number }>()
  for (const finding of findings) {
    const entry = totals.get(finding.check) ?? {
      severity: finding.severity,
      count: 0,
    }
    entry.count += 1
    totals.set(finding.check, entry)
  }
  const errors = findings.filter((finding) => finding.severity === 'error')

  const lines = [
    `Dokumen diperiksa: ${documentCount}. Temuan: ${findings.length} (${errors.length} error).`,
    '',
  ]
  if (findings.length === 0) return `${lines[0]}\n\nGrafik isi bersih.`

  lines.push('| Pemeriksaan | Tingkat | Jumlah |', '| --- | --- | --- |')
  for (const [check, { severity, count }] of [...totals].toSorted(
    ([, a], [, b]) => b.count - a.count
  )) {
    lines.push(`| ${check} | ${severity} | ${count} |`)
  }
  lines.push(
    '',
    '| Dokumen | Pemeriksaan | Keterangan |',
    '| --- | --- | --- |'
  )
  const rank = (finding: GraphFinding) => (finding.severity === 'error' ? 0 : 1)
  const ordered = [...findings].toSorted((a, b) => rank(a) - rank(b))
  for (const finding of ordered.slice(0, limit)) {
    lines.push(
      `| ${finding.id} | ${finding.check} | ${finding.message.replaceAll('|', '/')} |`
    )
  }
  if (findings.length > limit) {
    lines.push('', `${findings.length - limit} temuan lain tidak ditampilkan.`)
  }
  return lines.join('\n')
}

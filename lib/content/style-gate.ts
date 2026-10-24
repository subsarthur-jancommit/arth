/**
 * The style gate from "Suara dan gaya", as code.
 *
 * Two levels, because the two halves of the gate are not equally certain. An
 * error is a rule a sentence breaks on its face: a dash used as a pause, an
 * exclamation mark, a catalogue code, an emoji. A warning is a rule that needs
 * a reader to confirm: a long sentence, or a phrase from the list that every
 * agency site uses. Studio blocks publishing on errors and only flags
 * warnings; `lib/scripts/check-content-graph.ts` reports both.
 *
 * Ready-to-publish text (the umbrella and unit headers, side titles, buyer
 * quotes) is used word for word by rule 11 of "Aturan isi". The warnings do
 * not apply to it; the errors still do, because a dash or a catalogue code in
 * a header would be a copying mistake, not the owner's words.
 */

export type StyleLevel = 'error' | 'warning'

export interface StyleFinding {
  level: StyleLevel
  rule: string
  path: string
  excerpt: string
}

interface Rule {
  rule: string
  pattern: RegExp
}

const ERROR_RULES: readonly Rule[] = [
  // Suara dan gaya, aturan 9: no dash as a pause. A hyphen inside a word
  // ("itu-itu", "pesan-antar") is not a dash.
  { rule: 'tanda-pisah', pattern: /[–—]|\s-\s/u },
  { rule: 'tanda-seru', pattern: /!/u },
  // © ® ™ carry the Extended_Pictographic property too; they are not emoji.
  {
    rule: 'emoji',
    pattern: /(?![©®™])\p{Extended_Pictographic}/u,
  },
  // Catalogue IDs never reach a reader (Peta website): KUL-02, RAK-03, 3B-07.
  { rule: 'kode-katalog', pattern: /\b(?:[A-Z]{3}-\d{2}|\d[A-C]-\d{2})\b/u },
]

/** Phrases from "Frasa yang tidak dipakai", lower case, matched as words. */
export const BANNED_PHRASES: readonly string[] = [
  'di era digital',
  'dalam dunia bisnis yang semakin kompetitif',
  'selamat datang di',
  'tahukah anda',
  'apakah anda sedang mencari',
  'terbaik',
  'terpercaya',
  'profesional dan berpengalaman',
  'berkualitas tinggi',
  'terdepan',
  'terlengkap',
  'nomor satu',
  'andal',
  'solusi',
  'satu pintu untuk segalanya',
  'hasil maksimal',
  'kepuasan anda prioritas kami',
  'dijamin',
  'tingkatkan',
  'maksimalkan',
  'optimalkan',
  'dongkrak',
  'akselerasi',
  'transformasi',
  'ke level berikutnya',
  'bukan sekadar',
  'lebih dari sekadar',
  'tidak hanya',
  'inilah rahasianya',
  'selain itu',
  'tak hanya itu',
  'dengan demikian',
  'oleh karena itu',
  'hal ini memastikan',
  'perlu diingat',
  'kebutuhan anda',
  'berbagai',
  'aneka',
  'hubungi kami sekarang',
  'jangan lewatkan',
  'tunggu apa lagi',
  'percayakan kepada kami',
  'wujudkan bersama kami',
  'boost',
  'growth',
  'leverage',
  'insight',
  'level up',
  'game changer',
  'one-stop',
  'end-to-end',
  'seamless',
  'sangat',
  'benar-benar',
  'sungguh',
  'sepenuhnya',
  'tentunya',
  'pastinya',
  'secara maksimal',
  'secara signifikan',
  'efektif dan efisien',
]

/**
 * Fields that hold ready-to-publish text, per Sanity type. Studio validation
 * and the content graph checker both read this list, so the two never judge
 * the same field differently.
 */
export const VERBATIM_FIELDS = {
  siteSettings: [
    'heroJudul',
    'heroSubjudul',
    'heroPembuka',
    'pilar',
    'ringkas',
    'ajakan',
  ],
  unit: [
    'judul',
    'subjudul',
    'pembuka',
    'pilar',
    'ringkas',
    'ajakan',
    'kalimatJujur',
  ],
  side: ['judul'],
  bab: ['kutipan'],
} as const satisfies Record<string, readonly string[]>

const MAX_WORDS_PER_SENTENCE = 25

const escape = (value: string) =>
  value.replaceAll(/[.*+?^${}()|[\]\\]/g, '\\$&')

const PHRASE_PATTERNS = BANNED_PHRASES.map((phrase) => ({
  phrase,
  pattern: new RegExp(
    `(?<![\\p{L}\\p{N}-])${escape(phrase)}(?![\\p{L}\\p{N}-])`,
    'iu'
  ),
}))

const excerptAround = (text: string, index: number) =>
  text.slice(Math.max(0, index - 30), index + 40).trim()

/** Sentences, split on terminal punctuation; a question counts as one. */
export function sentences(text: string): string[] {
  return text
    .split(/(?<=[.?;:])\s+/u)
    .map((sentence) => sentence.trim())
    .filter(Boolean)
}

/** Every style finding for one reader-visible string. */
export function checkText(
  text: string,
  options: { path?: string; verbatim?: boolean } = {}
): StyleFinding[] {
  const path = options.path ?? 'teks'
  const findings: StyleFinding[] = []

  for (const { rule, pattern } of ERROR_RULES) {
    const match = pattern.exec(text)
    if (match) {
      findings.push({
        level: 'error',
        rule,
        path,
        excerpt: excerptAround(text, match.index),
      })
    }
  }

  if (options.verbatim) return findings

  for (const sentence of sentences(text)) {
    const words = sentence.split(/\s+/u).filter(Boolean).length
    if (words > MAX_WORDS_PER_SENTENCE) {
      findings.push({
        level: 'warning',
        rule: 'kalimat-panjang',
        path,
        excerpt: `${words} kata: ${sentence.slice(0, 60)}`,
      })
    }
  }

  for (const { phrase, pattern } of PHRASE_PATTERNS) {
    const match = pattern.exec(text)
    if (match) {
      findings.push({
        level: 'warning',
        rule: `frasa: ${phrase}`,
        path,
        excerpt: excerptAround(text, match.index),
      })
    }
  }

  return findings
}

/**
 * Keys that never hold reader text: Sanity's own (`_type`, `_key`), the
 * Internal group, and machine values such as slugs, keys, and URLs.
 */
const SKIPPED_KEYS = new Set([
  'jejakSumber',
  'idKatalog',
  'statusTinjauan',
  'ditulisOleh',
  'tanggalDisetujui',
  'slug',
  'kunci',
  'model',
  'pasar',
  'url',
  'email',
  'whatsapp',
  'urutan',
  'halaman',
  'name',
])

export interface StyleDocument {
  readonly [key: string]: WalkValue | undefined
}

type WalkValue =
  | StyleDocument
  | readonly WalkValue[]
  | string
  | number
  | boolean
  | null

function isWalkable(value: WalkValue | undefined): value is StyleDocument {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

/**
 * Walk a Sanity document (or any nested value) and check every reader string.
 *
 * `verbatimFields` names the top-level fields that hold ready-to-publish text.
 */
export function checkDocument(
  document: StyleDocument | undefined,
  verbatimFields: readonly string[] = []
): StyleFinding[] {
  if (!document) return []
  const verbatim = new Set(verbatimFields)
  const findings: StyleFinding[] = []

  const visit = (value: WalkValue | undefined, path: string, top: string) => {
    if (typeof value === 'string') {
      findings.push(...checkText(value, { path, verbatim: verbatim.has(top) }))
      return
    }
    if (Array.isArray(value)) {
      for (const [index, entry] of value.entries()) {
        visit(entry, `${path}[${index}]`, top)
      }
      return
    }
    if (!isWalkable(value)) return
    for (const [key, entry] of Object.entries(value)) {
      if (key.startsWith('_') || SKIPPED_KEYS.has(key)) continue
      // Internationalized arrays hold `{_key: 'id', value}`; the path names
      // the field, not the word "value".
      let next = key
      if (key === 'value') next = path
      else if (path) next = `${path}.${key}`
      visit(entry, next, top || key)
    }
  }

  visit(document, '', '')
  return findings
}

/** One line per finding, for a Studio validation message. */
export function describeFindings(findings: readonly StyleFinding[]): string {
  return findings
    .slice(0, 5)
    .map((finding) => `${finding.path}: ${finding.rule} (“${finding.excerpt}”)`)
    .join('; ')
}

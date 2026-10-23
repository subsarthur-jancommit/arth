import { describe, expect, it } from 'bun:test'
import { readdirSync, readFileSync } from 'node:fs'
import { join } from 'node:path'

/**
 * Arthur's editorial words live in Sanity, and only there (V6 of
 * `docs/RENCANA-KONTEKS-V2.md`).
 *
 * Until V6, `unit-fallback.ts`, `side-fallback.ts`, and the copy half of
 * `home-fallback.ts` kept a second set of the unit headers, the side copy,
 * and the umbrella header in code, shown whenever a Sanity field was empty.
 * Nobody could edit that copy from Studio, so clearing a field there brought
 * back an older sentence instead of nothing, and the copy had drifted: the
 * network side still held the free sign-up action that decision 6 keeps
 * closed until the first commission card.
 *
 * Two checks keep it out. The sentences below are taken from that removed
 * copy, and none of them may appear in code that reaches a reader. And the
 * fallback modules that remain are named, each with the decision that
 * retires it, so a new one cannot arrive unnoticed.
 */

/**
 * Sentences from the removed copy. Each group names the Sanity document that
 * holds them now, or says that they were retired.
 */
const SENTINELS = [
  // Unit headers, now in the three `unit` documents.
  'Isi celahnya. Bangun sampai jadi. Rawat sesudahnya.',
  'Proyek konstruksi jarang tersendat karena tidak ada yang mampu membangun.',
  'Bot dan workflow yang bekerja dua puluh empat jam untuk bisnis Anda, di sektor apa pun.',
  'Kebanyakan bisnis tidak kekurangan aplikasi.',
  'Rebut perhatian. Bangun kepercayaan. Biarkan jaringan yang menjual.',
  'Usaha jarang kalah karena produknya buruk.',
  // Side titles, now in the six `side` documents.
  'Bagian mana dari proyek Anda yang belum ada yang mengerjakan? Kami isi.',
  'Ceritakan bangunan yang Anda inginkan. Kami urus dari hulu ke hilir.',
  'Ceritakan pasar yang ingin dibuka atau pekerjaan yang ingin dilepas. Sisanya kami jalankan.',
  'Spesialis untuk titik macet teknis Anda, dari basis data sampai rilis otomatis.',
  'Pasar mana yang ingin Anda rebut? Kami siapkan perhatian, kepercayaan, dan penjualnya.',
  'Punya audiens, jaringan, atau bakat menjual?',
  // The network side's sign-up action, retired: nothing rendered it.
  'Pilih rujuk transaksi, jadi anggota, atau jadi kreator dan host.',
  // The umbrella header and its situations, now in `siteSettings`.
  'Proyek jalan. Sistem bekerja. Pasar bertambah.',
  'Konstruksi sipil, sistem teknologi, dan agency marketshare untuk Subang, Purwakarta, dan Bandung.',
  'Kami mengisi celah proyek dan membangun sampai jadi.',
  'Kami membuka pasar baru dan mengotomatiskan sisanya.',
  'Kontraktor utama sudah menang paket, tetapi belum punya subkon yang sanggup dari hulu ke hilir.',
  'Seseorang ingin ikut menjual, menjadi anggota komunitas, atau menjadi host.',
  // The previous site's English statement, retired.
  'Arth works to a brief.',
] as const

/**
 * The code a reader can receive: the routes, the components and blocks they
 * render, the libraries they call, and the interface strings.
 *
 * `lib/scripts` is left out on purpose. Its tools build Sanity drafts from
 * the master brief, so editorial text is their input, and none of it is
 * served. Tests are left out because this one has to name the sentences.
 */
const RUNTIME_ROOTS = ['app', 'components', 'vault', 'lib', 'messages']
const TOOLING = join('lib', 'scripts')
const NOT_RUNTIME = /\.(?:test|ruletest|e2e|stories)\.tsx?$/
const SOURCE = /\.(?:ts|tsx|json)$/

function sourceFiles(directory: string): string[] {
  if (directory === TOOLING) return []

  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const path = join(directory, entry.name)
    if (entry.isDirectory()) return sourceFiles(path)
    return SOURCE.test(entry.name) && !NOT_RUNTIME.test(entry.name)
      ? [path]
      : []
  })
}

describe('editorial copy lives in Sanity, not in code', () => {
  it('no removed fallback sentence reaches runtime code', () => {
    const files = RUNTIME_ROOTS.flatMap(sourceFiles)
    // Anti-vacuum: a wrong root would find nothing and pass.
    expect(files.length).toBeGreaterThan(100)

    const found = files.flatMap((file) => {
      const text = readFileSync(file, 'utf8')
      return SENTINELS.filter((sentence) => text.includes(sentence)).map(
        (sentence) => `${file}: “${sentence}”`
      )
    })

    expect(found).toEqual([])
  })

  it('only the two fallback modules with a retirement decision remain', () => {
    /*
     * `home-fallback.ts` keeps the placeholder contact, a `.invalid` address
     * that says it is one, until the owner chooses a channel (K5); it holds
     * no editorial copy. `journal-fallback.ts` keeps the previous site's
     * journal scaffolding until F5-04 retires `/journal` with the other
     * dummies; the home page no longer reads it. Removing either one is the
     * point of those decisions, and adding one is a decision of its own.
     */
    const fallbacks = readdirSync(join('lib', 'content'))
      .filter((name) => name.endsWith('-fallback.ts'))
      .toSorted()

    expect(fallbacks).toEqual(['home-fallback.ts', 'journal-fallback.ts'])
  })
})

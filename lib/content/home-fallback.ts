import { BRAND_NAME } from '@/lib/brand'
import { canRenderPublicContent } from '@/lib/content/public-content-guard'
import type { Side, Unit } from '@/lib/content/units'
import type { Locale } from '@/lib/i18n/routing'

/**
 * Placeholder copy for the home page, in both languages.
 *
 * **Every field here loses to the CMS.** The moment a `siteSettings`
 * document exists with a value, that value is used instead — see
 * `resolveHomeContent` below. Nothing in this file is meant to survive
 * contact with the real studio's words.
 *
 * ## Why it exists at all
 *
 * The `production` dataset has no `siteSettings` document yet; its one legacy
 * `studioSettings` fixture remains readable until the owner approves the
 * migration. A home page fed without Arthur's new settings renders with no
 * `<h1>` and almost no text, which fails
 * `e2e/agent-readiness.e2e.ts` and cannot be judged by anyone. The two
 * alternatives were worse: shipping a blank page, or writing invented engagements
 * into the agency's real content library.
 *
 * ## Why it is not in `messages/*.json`
 *
 * `schemas/siteSettings.ts` draws the line and it is worth keeping:
 * `messages/` holds **interface** text — nav labels, button copy — that ships
 * with the code and changes when the code changes. Editorial copy belongs to
 * the studio and must be editable without a deploy. This file is editorial
 * copy that has nowhere else to live *yet*; it is a stand-in for the CMS, not
 * a second home for site copy.
 */

interface HomeCopy {
  /** The page's only `<h1>`. */
  headline: string
  /** One sentence under it. A hero is not a paragraph. */
  subline: string
  /** The studio statement, as plain paragraphs. */
  statement: readonly string[]
  /** Label under the portrait when the CMS has no image. */
  portraitCaption: string
}

const FALLBACK_COPY = {
  en: {
    headline: 'Work that has to hold up',
    subline:
      'Consulting, AI and data, and commissioned build, scoped to a brief and delivered against it.',
    statement: [
      'Arth works to a brief. Every engagement starts from the constraint that makes the problem hard (the deadline, the legacy system, the decision that cannot be reversed) and not from a menu of services.',
      'The work runs from a two-week architecture review to a build carried for several months. The scope and the estimate are agreed before anything starts rather than after, and what is delivered is measured against them.',
    ],
    portraitCaption: 'The studio',
  },
  id: {
    headline: 'Proyek jalan. Sistem bekerja. Pasar bertambah.',
    subline:
      'Konstruksi sipil, sistem teknologi, dan agency marketshare untuk Subang, Purwakarta, dan Bandung.',
    statement: [
      'Usaha jarang berhenti karena satu masalah besar. Usaha tersendat di tiga tempat: proyek yang macet di celah administrasi, tenaga, material, dan modal; pekerjaan berulang yang masih dikerjakan tangan; dan pasar yang belum cukup mengenal, memercayai, dan membeli. Kami bekerja di ketiga tempat itu lewat tiga unit.',
    ],
    portraitCaption: 'Arthur',
  },
} as const satisfies Record<Locale, HomeCopy>

export interface HomePillarFallback {
  key: string
  lead: string
  isi: string
}

/**
 * The labelled paragraphs of the umbrella header, word for word from the
 * master brief (Header Arthur). Approved `siteSettings.pilar` replaces them.
 */
export const HOME_PILLAR_FALLBACKS: readonly HomePillarFallback[] = [
  {
    key: 'pilar-1',
    lead: 'Kami mengisi celah proyek dan membangun sampai jadi.',
    isi: 'Unit Konstruksi mengambil bagian proyek yang tidak sempat atau tidak sanggup Anda tangani, dari administrasi dengan pemerintah sampai tenaga, material, alat, dan modal kerja yang dijembatani mitra. Bagi pemilik bangunan, kami membangun dari hulu ke hilir, lalu merawatnya lewat Membership Care.',
  },
  {
    key: 'pilar-2',
    lead: 'Kami membuka pasar baru dan mengotomatiskan sisanya.',
    isi: 'Unit Teknologi membuka kanal pendapatan yang berjalan di samping usaha Anda, lalu memasang bot dan workflow yang menjawab, menagih, dan memantau tanpa menunggu diingatkan.',
  },
  {
    key: 'pilar-3',
    lead: 'Kami merebut pasar.',
    isi: 'Unit Agency, Peekabo, membuat usaha Anda dikenal lewat iklan dan aset yang diproduksi massal, dipercaya lewat kampanye di lapangan, lalu dibeli lewat kreator, host live, sales, dan komunitas yang ikut menjualkan.',
  },
  {
    key: 'pilar-4',
    lead: 'Satu klien, tiga unit.',
    isi: 'Kafe yang kami bangun bisa langsung memakai pemesanan dan pembayaran dari meja, lalu dibuka dengan kampanye pembukaan gerai. Studio siaran yang kami bangun bisa langsung dipakai host live. Setiap unit tetap bisa dibeli sendiri.',
  },
  {
    key: 'pilar-5',
    lead: 'Cara kami bekerja.',
    isi: 'Lingkup, harga, target, dan laporan disepakati tertulis sebelum kerja dimulai. Tenaga ahli bekerja di lapangan proyek Anda; nama atau sertifikat tidak dipinjamkan. Sistem, data, kode, dan merek tetap milik Anda. Komisi dari mitra kami ungkapkan, dan jaringan penjual kami dibayar dari penjualan yang benar-benar terjadi. Kami tidak menjanjikan keuntungan instan.',
  },
] as const

export interface HomeSituationFallback {
  key: string
  text: string
  unit: Unit
  side: Side
}

/**
 * The fourteen situations of the master brief's “Cara memakai” table, the
 * same list written to `siteSettings.situasi` in W1 (docs/V1-SERAH-W1.md).
 * Each opens its side page until a chapter is published for it.
 */
export const HOME_SITUATION_FALLBACKS: readonly HomeSituationFallback[] = [
  {
    key: 'kontraktor-hulu-hilir',
    text: 'Kontraktor utama sudah menang paket, tetapi belum punya subkon yang sanggup dari hulu ke hilir.',
    unit: 'konstruksi',
    side: 'pelaku-proyek',
  },
  {
    key: 'subkon-kekurangan',
    text: 'Subkon kekurangan tenaga, material, alat, atau modal kerja.',
    unit: 'konstruksi',
    side: 'pelaku-proyek',
  },
  {
    key: 'penyedia-barang',
    text: 'Penyedia barang pemerintah bingung soal sumber barang dan margin.',
    unit: 'konstruksi',
    side: 'pelaku-proyek',
  },
  {
    key: 'rumah-tanpa-repot',
    text: 'Pemilik rumah ingin membangun atau merenovasi tanpa repot.',
    unit: 'konstruksi',
    side: 'pemilik-bangunan',
  },
  {
    key: 'bangunan-produktif',
    text: 'Pemilik kafe, studio, atau penginapan ingin bangunannya lebih produktif.',
    unit: 'konstruksi',
    side: 'pemilik-bangunan',
  },
  {
    key: 'properti-terjaga',
    text: 'Pemilik properti ingin nilai bangunannya terjaga.',
    unit: 'konstruksi',
    side: 'pemilik-bangunan',
  },
  {
    key: 'pekerjaan-berulang',
    text: 'Pemilik usaha kewalahan dengan pekerjaan berulang: pesanan, tagihan, laporan.',
    unit: 'teknologi',
    side: 'siap-pakai',
  },
  {
    key: 'pendapatan-baru',
    text: 'Pemilik usaha ingin kanal pendapatan baru di samping usahanya.',
    unit: 'teknologi',
    side: 'siap-pakai',
  },
  {
    key: 'titik-teknis',
    text: 'Developer, agensi, atau tim IT tersendat di titik teknis tertentu.',
    unit: 'teknologi',
    side: 'paham-teknis',
  },
  {
    key: 'belum-dikenal',
    text: 'Usaha belum dikenal, belum dipercaya, atau pembelinya tidak kembali.',
    unit: 'peekabo',
    side: 'pemilik-usaha',
  },
  {
    key: 'leads-tidak-closing',
    text: 'Leads masuk, tetapi tidak ada yang menindaklanjuti sampai closing.',
    unit: 'peekabo',
    side: 'pemilik-usaha',
  },
  {
    key: 'live-afiliasi',
    text: 'Seller ingin live atau afiliasi di TikTok Shop dan Shopee.',
    unit: 'peekabo',
    side: 'pemilik-usaha',
  },
  {
    key: 'hadir-di-warga',
    text: 'Brand ingin hadir di tengah warga.',
    unit: 'peekabo',
    side: 'pemilik-usaha',
  },
  {
    key: 'ikut-menjual',
    text: 'Seseorang ingin ikut menjual, menjadi anggota komunitas, atau menjadi host.',
    unit: 'peekabo',
    side: 'jaringan',
  },
] as const

/**
 * The one placeholder contact, shared.
 *
 * Exported since Tahap 35. `components/layout/footer` had its own copy of the
 * same address and the same two bare domains — a third, after this file and
 * `lib/seo/site.ts` — and nothing tied them together, so a studio filling in
 * its real address would have found two of the three.
 *
 * `lib/seo/site.ts` no longer carries one at all: a reserved-TLD address is a
 * placeholder to a person and a fact to a crawler, so machine surfaces omit
 * it and every human surface labels it. The temporary `.invalid` value cannot
 * reach a real mailbox. `docs/stages/TAHAP-35.md` §3.1.
 */
export const FALLBACK_CONTACT = {
  name: BRAND_NAME,
  email: 'kontak@arth.invalid',
  address: {
    en: '0 Example Street, Example City, Indonesia',
    id: 'Jl. Contoh No. 00, Kota Contoh, Indonesia',
  },
  socials: [] as readonly { label: string; url: string }[],
} as const

/**
 * Whether an address is a placeholder rather than a mailbox: the reserved
 * `.invalid` TLD (RFC 2606) that {@link FALLBACK_CONTACT} uses until K5.
 */
export function isPlaceholderEmail(email: string): boolean {
  return /\.invalid$/i.test(email.trim())
}

export interface HomeContent {
  name: string
  headline: string
  subline: string
  email: string
  address: string
  socials: readonly { label: string; url: string }[]
  portraitCaption: string
  /** Portable Text from the CMS, or `null` when the fallback paragraphs are used. */
  statement: unknown[] | null
  /** Plain paragraphs, used only when `statement` is null. */
  statementFallback: readonly string[]
  /**
   * Which rendered fields came from this file rather than from the CMS.
   *
   * Per field, because the resolution below is per field. It used to be one
   * boolean meaning "no `siteSettings` document exists at all", and that is
   * a different question: with a half-filled document present — the normal
   * state while a studio is onboarding, and the exact case this resolver was
   * written for — the flag read `false` while the fallback paragraphs
   * rendered anyway. The home page's "Placeholder copy…" note is driven by
   * this, so the note went unshown and scaffolding shipped unlabelled.
   * `docs/stages/TAHAP-35.md` §2 has the measurement.
   */
  fallbacks: {
    headline: boolean
    subline: boolean
    email: boolean
    address: boolean
    socials: boolean
    statement: boolean
  }
}

/** A CMS string that is present and not merely an empty box an editor left. */
function usable(value: string | null | undefined): value is string {
  return typeof value === 'string' && value.trim() !== ''
}

/**
 * A field's value together with where it came from.
 *
 * The two have to be decided in one place. Deriving "did this fall back?"
 * from a separate `usable()` call is how the two drift, and drift here means
 * a page that renders scaffolding while reporting that it did not.
 */
function pick(
  cms: string | null | undefined,
  fallback: string
): { value: string; fromCms: boolean } {
  return usable(cms)
    ? { value: cms, fromCms: true }
    : { value: fallback, fromCms: false }
}

const RESERVED_PLACEHOLDER_TLDS = [
  'example',
  'invalid',
  'localhost',
  'test',
] as const

function isPublishableEmail(value: string | null | undefined): value is string {
  if (!usable(value)) return false

  const domain = value.slice(value.lastIndexOf('@') + 1).toLowerCase()
  return !RESERVED_PLACEHOLDER_TLDS.some(
    (tld) => domain === tld || domain.endsWith(`.${tld}`)
  )
}

/**
 * The CMS wins per field, not per document.
 *
 * A half-filled `siteSettings` — a name but no statement yet — is the normal
 * state while a studio is onboarding, and it must not blank out the sections
 * the editor has not reached. So each field falls back independently, and an
 * empty string counts as absent: Sanity keeps `""` for a field an editor
 * opened and cleared, and treating that as content renders a blank heading.
 */
export function resolveHomeContent(
  locale: Locale,
  settings: {
    name?: string | null
    headline?: string | null
    subline?: string | null
    email?: string | null
    address?: string | null
    statement?: unknown[] | null
    socials?: readonly { label?: string; url?: string }[] | null
  } | null
): HomeContent {
  const copy = FALLBACK_COPY[locale]

  const safeSettings =
    settings &&
    canRenderPublicContent('site settings', [
      settings.name,
      settings.headline,
      settings.subline,
      settings.email,
      settings.address,
      JSON.stringify(settings.statement),
      ...(settings.socials?.flatMap((social) => [social.label, social.url]) ??
        []),
    ])
      ? settings
      : null

  const socials = (safeSettings?.socials ?? [])
    .filter(
      (social): social is { label: string; url: string } =>
        usable(social.label) && usable(social.url)
    )
    .map((social) => ({ label: social.label, url: social.url }))

  const name = pick(safeSettings?.name, FALLBACK_CONTACT.name)
  const headline = pick(safeSettings?.headline, copy.headline)
  const subline = pick(safeSettings?.subline, copy.subline)
  const cmsEmail = safeSettings?.email
  const email = isPublishableEmail(cmsEmail)
    ? { value: cmsEmail, fromCms: true }
    : { value: FALLBACK_CONTACT.email, fromCms: false }
  const cmsAddress = safeSettings?.address
  const isDummyAddress =
    !usable(cmsAddress) ||
    /(?:example|contoh|dummy|placeholder)/i.test(cmsAddress)
  const address = isDummyAddress
    ? { value: FALLBACK_CONTACT.address[locale], fromCms: false }
    : { value: cmsAddress, fromCms: true }
  const statement =
    safeSettings?.statement && safeSettings.statement.length > 0
      ? safeSettings.statement
      : null

  return {
    name: name.value,
    headline: headline.value,
    subline: subline.value,
    email: email.value,
    address: address.value,
    socials: socials.length > 0 ? socials : FALLBACK_CONTACT.socials,
    portraitCaption: copy.portraitCaption,
    statement,
    statementFallback: copy.statement,
    fallbacks: {
      headline: !headline.fromCms,
      subline: !subline.fromCms,
      email: !email.fromCms,
      address: !address.fromCms,
      socials: socials.length === 0,
      statement: statement === null,
    },
  }
}

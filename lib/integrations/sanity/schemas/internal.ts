import { defineArrayMember, defineField } from 'sanity'
import type {
  DocumentRule,
  SanityDocument,
  SlugValidationContext,
} from 'sanity'

import {
  checkDocument,
  describeFindings,
  type StyleDocument,
  type StyleLevel,
} from '@/lib/content/style-gate'

import { apiVersion } from '../env'
import { requireIndonesian } from '../utils/i18n-array'

export const REVIEW_STATUS_VALUES = [
  'usulan',
  'dipilih',
  'perlu-anda',
  'disetujui',
  'ditahan',
] as const

interface InternalFieldsOptions {
  catalogId?: boolean
}

interface ContentRecord {
  readonly [key: string]: ContentValue | undefined
}

type ContentValue =
  | ContentRecord
  | boolean
  | null
  | number
  | readonly ContentValue[]
  | string

type ContentDocument = SanityDocument & ContentRecord

const PLACEHOLDER_PATTERN = /\[PERLU|isi contoh|teks sementara/i

function isRecord(value: ContentValue | undefined): value is ContentRecord {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

function placeholderPath(
  value: ContentValue | undefined,
  path = ''
): string | undefined {
  if (typeof value === 'string') {
    return PLACEHOLDER_PATTERN.test(value) ? path || 'dokumen' : undefined
  }

  if (Array.isArray(value)) {
    for (const [index, entry] of value.entries()) {
      const match = placeholderPath(entry, `${path}[${index}]`)
      if (match) return match
    }
    return undefined
  }

  if (isRecord(value)) {
    for (const [key, entry] of Object.entries(value)) {
      if (key.startsWith('_')) continue

      const match = placeholderPath(entry, path ? `${path}.${key}` : key)
      if (match) return match
    }
  }

  return undefined
}

/** Reject reader-visible placeholder text before a document can be published. */
export function forbidPlaceholders(
  value: SanityDocument | undefined
): true | string {
  const match = value ? placeholderPath(value as ContentDocument) : undefined
  return match ? `Ganti placeholder di ${match} sebelum menerbitkan.` : true
}

function styleCheck(level: StyleLevel, verbatimFields: readonly string[]) {
  return (value: SanityDocument | undefined): true | string => {
    const findings = checkDocument(
      value as StyleDocument | undefined,
      verbatimFields
    ).filter((finding) => finding.level === level)
    return findings.length > 0
      ? `Gerbang gaya: ${describeFindings(findings)}`
      : true
  }
}

/**
 * Document-level validation every Arthur content type shares: placeholders
 * and the style gate's errors block publishing; its warnings only flag.
 *
 * `verbatimFields` are the fields that hold ready-to-publish text, which the
 * warnings never judge (Aturan isi 11).
 */
export function contentValidation(verbatimFields: readonly string[] = []) {
  return (Rule: DocumentRule) => [
    Rule.custom(forbidPlaceholders),
    Rule.custom(styleCheck('error', verbatimFields)),
    Rule.custom(styleCheck('warning', verbatimFields)).warning(),
  ]
}

/**
 * A slug only has to be unique among its siblings, because the URL nests it
 * under its parent: two sides may each have a `kuliner` chapter, and two
 * chapters may each have a `survei-lapangan` offer. Sanity's default checks
 * the whole dataset, which would force awkward slugs for no reader benefit.
 */
export function uniqueWithinParent(type: string, parentField: string) {
  return async (slug: string, context: SlugValidationContext) => {
    const { document, getClient } = context
    const id = document?._id.replace(/^drafts\./, '') ?? ''
    const parent = (document?.[parentField] as { _ref?: string } | undefined)
      ?._ref
    if (!parent) return true

    const clashes = await getClient({ apiVersion }).fetch<number>(
      `count(*[
        _type == $type &&
        slug.current == $slug &&
        ${parentField}._ref == $parent &&
        !(_id in [$id, "drafts." + $id])
      ])`,
      { type, slug, parent, id }
    )
    return clashes === 0
  }
}

/** Fields kept in the Internal Studio group and never selected by page queries. */
export function internalFields(options: InternalFieldsOptions = {}) {
  const fields = [
    defineField({
      name: 'jejakSumber',
      title: 'Jejak sumber',
      description: 'Dokumen, tab, dan ID atau baris yang dipakai setiap blok.',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          fields: [
            defineField({ name: 'blok', title: 'Blok', type: 'string' }),
            defineField({ name: 'sumber', title: 'Sumber', type: 'string' }),
            defineField({
              name: 'rujukan',
              title: 'ID atau baris',
              type: 'string',
            }),
          ],
          preview: { select: { title: 'blok', subtitle: 'rujukan' } },
        }),
      ],
      group: 'internal',
    }),
    defineField({
      name: 'statusTinjauan',
      title: 'Status tinjauan',
      type: 'string',
      options: {
        list: [
          { title: 'Usulan', value: 'usulan' },
          { title: 'Dipilih', value: 'dipilih' },
          { title: 'Perlu Anda', value: 'perlu-anda' },
          { title: 'Disetujui', value: 'disetujui' },
          { title: 'Ditahan', value: 'ditahan' },
        ],
        layout: 'radio',
      },
      initialValue: 'usulan',
      readOnly: true,
      group: 'internal',
    }),
    defineField({
      name: 'ditulisOleh',
      title: 'Ditulis oleh',
      type: 'string',
      group: 'internal',
    }),
    defineField({
      name: 'tanggalDisetujui',
      title: 'Tanggal disetujui',
      type: 'date',
      readOnly: true,
      group: 'internal',
    }),
  ]

  if (!options.catalogId) return fields

  return [
    defineField({
      name: 'idKatalog',
      title: 'ID katalog',
      description:
        'ID sumber seperti RAK-03. Aman dibaca publik, tetapi tidak dirender.',
      type: 'string',
      readOnly: ({ document }) => Boolean(document?._createdAt),
      group: 'internal',
    }),
    ...fields,
  ]
}

/**
 * The shape of a ready-to-publish header in the master brief.
 *
 * The umbrella header and each unit header open with a title, a line in
 * italics, and an opening paragraph, then carry paragraphs that each start
 * with a bold lead: “Kami mengisi celah.”, “Cara kami bekerja.”. Until V2 the
 * schema had one `pembuka` field for all of it, so the page carried a
 * paraphrase and the lead paragraphs were lost (docs/RENCANA-KONTEKS-V2.md §0).
 * These fields hold the header word for word (Aturan isi 11).
 */
export const headerPillarsField = () =>
  defineField({
    name: 'pilar',
    title: 'Paragraf header berlabel',
    description:
      'Salin dari header siap tayang apa adanya: kalimat tebal sebagai pembuka, lalu isinya. Boleh membuang paragraf utuh, tidak boleh mengubah kata.',
    type: 'array',
    of: [
      defineArrayMember({
        type: 'object',
        fields: [
          defineField({
            name: 'lead',
            title: 'Kalimat tebal',
            type: 'internationalizedArrayString',
            validation: (Rule) => Rule.required().custom(requireIndonesian),
          }),
          defineField({
            name: 'isi',
            title: 'Isi paragraf',
            type: 'internationalizedArrayText',
            validation: (Rule) => Rule.required().custom(requireIndonesian),
          }),
        ],
        preview: { select: { title: 'lead.0.value', subtitle: 'isi.0.value' } },
      }),
    ],
  })

export const headerSummaryField = () =>
  defineField({
    name: 'ringkas',
    title: 'Versi ringkas satu kalimat',
    description:
      'Dari bagian Versi ringkas di master brief, apa adanya. Dipakai di pintu unit dan sebagai deskripsi mesin pencari.',
    type: 'internationalizedArrayText',
  })

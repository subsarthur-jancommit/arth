import { defineArrayMember, defineField } from 'sanity'
import type { SanityDocument } from 'sanity'

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

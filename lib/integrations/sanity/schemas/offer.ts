import {
  defineArrayMember,
  defineField,
  defineType,
  type ValidationContext,
} from 'sanity'

import { OFFER_MODELS } from '@/lib/content/offer-models'

import { localeValue, requireIndonesian } from '../utils/i18n-array'
import { forbidPlaceholders, internalFields } from './internal'

const DEFAULT_LOCALE = 'id'

const localizedLine = (name: string, title: string) =>
  defineField({
    name,
    title,
    type: 'internationalizedArrayString',
    validation: (Rule) => Rule.required().custom(requireIndonesian),
  })

const localizedSteps = (name: string, title: string) =>
  defineField({
    name,
    title,
    description:
      'Opsional sejak pola per model offer: halaman Teknologi memakai Dua paket.',
    type: 'array',
    of: [
      defineArrayMember({
        type: 'object',
        fields: [localizedLine('teks', 'Butir')],
        preview: { select: { title: 'teks.0.value' } },
      }),
    ],
  })

/**
 * Required only on an offer that renders its own page. An offer that appears
 * only in its situation's list shows its title, impact and audience, and the
 * model's default limit covers the rest (`docs/R1-PENDEKATAN-POLA-OFFER.md`).
 */
const requiredForOwnPage = (
  // oxlint-disable-next-line anti-slop/no-unknown-parameters -- Sanity passes raw localized values to validators
  value: unknown,
  context: ValidationContext
): true | string => {
  const empty = !Array.isArray(value) || value.length === 0
  if (empty) {
    return context.document?.['halamanSendiri'] === true
      ? 'Wajib untuk offer yang punya halaman sendiri.'
      : true
  }
  return requireIndonesian(value)
}

/** A routable Arthur offer, with the eight reader-facing blocks. */
export const offer = defineType({
  name: 'offer',
  title: 'Offer',
  type: 'document',
  groups: [
    { name: 'isi', title: 'Isi', default: true },
    { name: 'internal', title: 'Internal' },
  ],
  validation: (Rule) => Rule.custom(forbidPlaceholders),
  fields: [
    defineField({
      name: 'bab',
      title: 'Bab induk',
      type: 'reference',
      to: [{ type: 'bab' }],
      validation: (Rule) => Rule.required(),
      group: 'isi',
    }),
    localizedLine('judul', 'Judul'),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: (document) => localeValue(document.judul, DEFAULT_LOCALE) ?? '',
        maxLength: 96,
      },
      validation: (Rule) => Rule.required(),
      group: 'isi',
    }),
    defineField({
      name: 'dampak',
      title: 'Kalimat dampak',
      type: 'internationalizedArrayText',
      description:
        'Satu kalimat yang dapat ditunjukkan pegangan kerjanya; bukan janji hasil.',
      validation: (Rule) => Rule.required().custom(requireIndonesian),
      group: 'isi',
    }),
    localizedLine('untukSiapa', 'Untuk siapa'),
    localizedLine('jenis', 'Jenis offer'),
    defineField({
      name: 'pasar',
      title: 'Pasar',
      description:
        'Hanya dipakai oleh offer Konstruksi sisi pelaku proyek; kosongkan di sisi lain.',
      type: 'string',
      options: {
        list: [
          { title: 'Pemerintah', value: 'pemerintah' },
          { title: 'Swasta', value: 'swasta' },
          { title: 'Keduanya', value: 'keduanya' },
        ],
        layout: 'radio',
      },
      group: 'isi',
    }),
    defineField({
      name: 'situasi',
      title: 'Situasinya',
      type: 'internationalizedArrayText',
      description:
        'Dua sampai tiga kalimat tentang pembaca, tanpa kalimat tentang Arthur. Wajib bila offer punya halaman sendiri.',
      validation: (Rule) => Rule.custom(requiredForOwnPage),
      group: 'isi',
    }),
    defineField({
      name: 'tingkat',
      title: 'Dua paket',
      description:
        'Teknologi: Paket Starter dan Paket Integrator. Konstruksi dan Peekabo memakai bahasa tingkatnya sendiri. Satu kalimat dan paling banyak tiga poin per paket.',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          fields: [
            localizedLine('nama', 'Nama paket'),
            defineField({
              name: 'kalimat',
              title: 'Kalimat',
              type: 'internationalizedArrayText',
              validation: (Rule) => Rule.required().custom(requireIndonesian),
            }),
            defineField({
              name: 'poin',
              title: 'Poin',
              type: 'array',
              of: [
                defineArrayMember({
                  type: 'object',
                  fields: [localizedLine('teks', 'Poin')],
                  preview: { select: { title: 'teks.0.value' } },
                }),
              ],
              validation: (Rule) => Rule.max(3),
            }),
          ],
          preview: { select: { title: 'nama.0.value' } },
        }),
      ],
      validation: (Rule) => Rule.max(2),
      group: 'isi',
    }),
    localizedSteps('langkah', 'Yang kami kerjakan'),
    localizedSteps('serahan', 'Yang Anda terima'),
    defineField({
      name: 'batas',
      title: 'Batas dan syarat',
      type: 'internationalizedArrayText',
      description:
        'Satu hal yang tidak termasuk dan syarat yang sudah disetujui; jangan menyimpan tanda katalog atau catatan tinjauan. Wajib bila offer punya halaman sendiri; offer di daftar memakai batas bawaan modelnya.',
      validation: (Rule) => Rule.custom(requiredForOwnPage),
      group: 'isi',
    }),
    defineField({
      name: 'langkahPertama',
      title: 'Langkah pertama',
      description:
        'Opsional. Bila kosong, halaman memakai langkah pertama dari sisi induk.',
      type: 'object',
      fields: [
        localizedLine('label', 'Label'),
        defineField({
          name: 'sesudahnya',
          title: 'Yang terjadi sesudahnya',
          type: 'internationalizedArrayText',
          validation: (Rule) => Rule.required().custom(requireIndonesian),
        }),
      ],
      group: 'isi',
    }),
    defineField({
      name: 'jembatan',
      title: 'Jembatan ke offer lain',
      type: 'object',
      fields: [
        defineField({
          name: 'offer',
          title: 'Offer tujuan',
          type: 'reference',
          to: [{ type: 'offer' }],
          weak: true,
        }),
        defineField({
          name: 'kalimat',
          title: 'Kalimat jembatan',
          type: 'internationalizedArrayText',
          description: 'Satu pernyataan, bukan pertanyaan.',
          validation: (Rule) => Rule.required().custom(requireIndonesian),
        }),
      ],
      group: 'isi',
    }),
    defineField({
      name: 'urutan',
      title: 'Urutan di bab',
      type: 'number',
      validation: (Rule) => Rule.required().integer().min(0),
      group: 'isi',
    }),
    defineField({
      name: 'pintuMasuk',
      title: 'Offer pilihan untuk sisi',
      type: 'boolean',
      initialValue: false,
      group: 'isi',
    }),
    defineField({
      name: 'halamanSendiri',
      title: 'Punya halaman sendiri',
      description:
        'Hanya pintu masuk situasi, offer dalam rangkaian tiga unit, atau offer yang paling sering ditanyakan. Offer lain cukup tampil di daftar situasinya.',
      type: 'boolean',
      initialValue: false,
      group: 'isi',
    }),
    defineField({
      name: 'model',
      title: 'Model offer',
      description:
        'Pengelompokan internal menurut barang yang diserahkan. Tidak dirender.',
      type: 'string',
      options: {
        list: OFFER_MODELS.map(({ key, title }) => ({ title, value: key })),
      },
      group: 'internal',
    }),
    defineField({
      name: 'metadata',
      title: 'Metadata',
      type: 'metadata',
      group: 'isi',
    }),
    ...internalFields({ catalogId: true }),
  ],
  preview: {
    select: { title: 'judul', subtitle: 'idKatalog' },
    prepare({ title, subtitle }) {
      return {
        title: localeValue(title, DEFAULT_LOCALE) ?? 'Offer tanpa judul',
        subtitle,
      }
    },
  },
})

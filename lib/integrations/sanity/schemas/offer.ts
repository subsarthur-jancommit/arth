import { defineArrayMember, defineField, defineType } from 'sanity'

import { localeValue, requireIndonesian } from '../utils/i18n-array'

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
    type: 'array',
    of: [
      defineArrayMember({
        type: 'object',
        fields: [localizedLine('teks', 'Butir')],
        preview: { select: { title: 'teks.0.value' } },
      }),
    ],
    validation: (Rule) => Rule.required().min(1),
  })

/** A routable Arthur offer, with the eight reader-facing blocks. */
export const offer = defineType({
  name: 'offer',
  title: 'Offer',
  type: 'document',
  groups: [
    { name: 'isi', title: 'Isi', default: true },
    { name: 'internal', title: 'Internal' },
  ],
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
        'Dua sampai tiga kalimat tentang pembaca, tanpa kalimat tentang Arthur.',
      validation: (Rule) => Rule.required().custom(requireIndonesian),
      group: 'isi',
    }),
    localizedSteps('langkah', 'Yang kami kerjakan'),
    localizedSteps('serahan', 'Yang Anda terima'),
    defineField({
      name: 'batas',
      title: 'Batas dan syarat',
      type: 'internationalizedArrayText',
      description:
        'Satu hal yang tidak termasuk dan syarat yang sudah disetujui; jangan menyimpan tanda katalog atau catatan tinjauan.',
      validation: (Rule) => Rule.required().custom(requireIndonesian),
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
      name: 'metadata',
      title: 'Metadata',
      type: 'metadata',
      group: 'isi',
    }),
    defineField({
      name: 'idKatalog',
      title: 'ID katalog',
      description:
        'ID sumber seperti RAK-03. Aman dibaca publik, tetapi tidak dirender.',
      type: 'string',
      group: 'internal',
    }),
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
      group: 'internal',
    }),
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

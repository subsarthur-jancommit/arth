import { defineArrayMember, defineField, defineType } from 'sanity'

import { localeValue, requireIndonesian } from '../utils/i18n-array'
import { contentValidation, internalFields } from './internal'

const DEFAULT_LOCALE = 'id'

/** A short reader question placed on one or more explicit public routes. */
export const faq = defineType({
  name: 'faq',
  title: 'Tanya jawab',
  type: 'document',
  groups: [
    { name: 'isi', title: 'Isi', default: true },
    { name: 'internal', title: 'Internal' },
  ],
  validation: contentValidation(),
  fields: [
    defineField({
      name: 'pertanyaan',
      title: 'Pertanyaan',
      type: 'internationalizedArrayString',
      validation: (Rule) => Rule.required().custom(requireIndonesian),
    }),
    defineField({
      name: 'jawaban',
      title: 'Jawaban',
      type: 'internationalizedArrayText',
      description: 'Paling banyak tiga kalimat.',
      validation: (Rule) => Rule.required().custom(requireIndonesian),
    }),
    defineField({
      name: 'halaman',
      title: 'Halaman tempat tampil',
      description:
        'Path tanpa locale, misalnya /kebijakan. Satu halaman menampilkan paling banyak lima FAQ.',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'string',
          validation: (Rule) =>
            Rule.regex(/^\//).error('Gunakan path yang diawali /.'),
        }),
      ],
      validation: (Rule) => Rule.required().min(1),
    }),
    defineField({
      name: 'rujukan',
      title: 'Halaman tujuan',
      description:
        'Unit, sisi, bab, atau pekerjaan tempat tanya jawab ini tampil. Referensi tetap benar walaupun slug berubah; path di atas dicabut setelah migrasi V2.',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'reference',
          to: [
            { type: 'unit' },
            { type: 'side' },
            { type: 'bab' },
            { type: 'offer' },
          ],
          weak: true,
        }),
      ],
    }),
    ...internalFields(),
  ],
  preview: {
    select: { title: 'pertanyaan' },
    prepare({ title }) {
      return {
        title:
          localeValue(title, DEFAULT_LOCALE) ?? 'Tanya jawab tanpa pertanyaan',
      }
    },
  },
})

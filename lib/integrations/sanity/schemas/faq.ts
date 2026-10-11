import { defineArrayMember, defineField, defineType } from 'sanity'

import { localeValue, requireIndonesian } from '../utils/i18n-array'

const DEFAULT_LOCALE = 'id'

/** A short reader question placed on one or more explicit public routes. */
export const faq = defineType({
  name: 'faq',
  title: 'Tanya jawab',
  type: 'document',
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

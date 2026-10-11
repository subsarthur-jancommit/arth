import { defineArrayMember, defineField, defineType } from 'sanity'

import { localeValue, requireIndonesian } from '../utils/i18n-array'

const DEFAULT_LOCALE = 'id'

/** A possible three-unit response to one buyer situation, never a case study. */
export const sequence = defineType({
  name: 'sequence',
  title: 'Rangkaian tiga unit',
  type: 'document',
  fields: [
    defineField({
      name: 'situasi',
      title: 'Situasi',
      type: 'internationalizedArrayText',
      description: 'Paling banyak tiga kalimat tentang situasi pembaca.',
      validation: (Rule) => Rule.required().custom(requireIndonesian),
    }),
    defineField({
      name: 'langkah',
      title: 'Langkah per unit',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          fields: [
            defineField({
              name: 'unit',
              title: 'Unit',
              type: 'reference',
              to: [{ type: 'unit' }],
              weak: true,
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: 'offer',
              title: 'Satu atau dua offer',
              type: 'array',
              of: [
                defineArrayMember({
                  type: 'reference',
                  to: [{ type: 'offer' }],
                  weak: true,
                }),
              ],
              validation: (Rule) => Rule.required().min(1).max(2),
            }),
            defineField({
              name: 'kalimat',
              title: 'Keterangan langkah',
              type: 'internationalizedArrayText',
              validation: (Rule) => Rule.required().custom(requireIndonesian),
            }),
          ],
          preview: { select: { title: 'kalimat.0.value' } },
        }),
      ],
      validation: (Rule) => Rule.required().length(3),
    }),
    defineField({
      name: 'keterangan',
      title: 'Keterangan rangkaian',
      type: 'internationalizedArrayText',
      description:
        'Nyatakan bahwa ini adalah rangkaian yang mungkin, bukan proyek yang pernah dikerjakan.',
      validation: (Rule) => Rule.required().custom(requireIndonesian),
    }),
    defineField({ name: 'metadata', title: 'Metadata', type: 'metadata' }),
  ],
  preview: {
    select: { title: 'situasi' },
    prepare({ title }) {
      return {
        title: localeValue(title, DEFAULT_LOCALE) ?? 'Rangkaian tanpa situasi',
      }
    },
  },
})

import { defineArrayMember, defineField, defineType } from 'sanity'

import { UNIT_STUDIO_TITLES, UNITS } from '@/lib/content/units'

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

/** One of Arthur's three durable units. */
export const unit = defineType({
  name: 'unit',
  title: 'Unit Arthur',
  type: 'document',
  groups: [
    { name: 'isi', title: 'Isi', default: true },
    { name: 'internal', title: 'Internal' },
  ],
  validation: (Rule) => Rule.custom(forbidPlaceholders),
  fields: [
    defineField({
      name: 'kunci',
      title: 'Kunci unit',
      type: 'string',
      options: {
        list: UNITS.map((value) => ({
          title: UNIT_STUDIO_TITLES[value],
          value,
        })),
        layout: 'radio',
      },
      validation: (Rule) => Rule.required(),
    }),
    localizedLine('nama', 'Nama untuk pembaca'),
    localizedLine('judul', 'Judul unit'),
    defineField({
      name: 'pembuka',
      title: 'Pembuka',
      type: 'internationalizedArrayText',
      description:
        'Paling banyak tiga kalimat; gunakan teks header yang disetujui apa adanya.',
      validation: (Rule) => Rule.required().custom(requireIndonesian),
    }),
    defineField({
      name: 'masalah',
      title: 'Masalah yang dijawab',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          fields: [localizedLine('teks', 'Poin masalah')],
          preview: { select: { title: 'teks.0.value' } },
        }),
      ],
      validation: (Rule) => Rule.required().min(1),
    }),
    defineField({
      name: 'caraKerja',
      title: 'Cara kerja unit',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          fields: [localizedLine('teks', 'Langkah')],
          preview: { select: { title: 'teks.0.value' } },
        }),
      ],
      validation: (Rule) => Rule.required().min(1),
    }),
    defineField({
      name: 'contohOffer',
      title: 'Contoh offer per jenis',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'reference',
          to: [{ type: 'offer' }],
          weak: true,
        }),
      ],
    }),
    defineField({
      name: 'jembatan',
      title: 'Jembatan ke offer unit lain',
      type: 'array',
      of: [
        defineArrayMember({
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
              validation: (Rule) => Rule.required().custom(requireIndonesian),
            }),
          ],
          preview: { select: { title: 'kalimat.0.value' } },
        }),
      ],
      validation: (Rule) => Rule.max(2),
    }),
    defineField({
      name: 'ajakan',
      title: 'Ajakan unit',
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
    }),
    defineField({ name: 'metadata', title: 'Metadata', type: 'metadata' }),
    ...internalFields(),
  ],
  preview: {
    select: { title: 'nama', subtitle: 'kunci' },
    prepare({ title, subtitle }) {
      return {
        title: localeValue(title, DEFAULT_LOCALE) ?? 'Unit tanpa nama',
        subtitle,
      }
    },
  },
})

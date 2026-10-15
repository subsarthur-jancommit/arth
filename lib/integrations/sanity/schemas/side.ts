import { defineArrayMember, defineField, defineType } from 'sanity'

import { ALL_SIDES, SIDE_STUDIO_TITLES } from '@/lib/content/units'

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

/** A reader's side of an Arthur unit. */
export const side = defineType({
  name: 'side',
  title: 'Sisi pembaca',
  type: 'document',
  groups: [
    { name: 'isi', title: 'Isi', default: true },
    { name: 'internal', title: 'Internal' },
  ],
  validation: (Rule) => Rule.custom(forbidPlaceholders),
  fields: [
    defineField({
      name: 'unit',
      title: 'Unit induk',
      type: 'reference',
      to: [{ type: 'unit' }],
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'kunci',
      title: 'Kunci sisi',
      type: 'string',
      options: {
        list: ALL_SIDES.map((value) => ({
          title: SIDE_STUDIO_TITLES[value],
          value,
        })),
        layout: 'radio',
      },
      validation: (Rule) => Rule.required(),
    }),
    localizedLine('nama', 'Nama untuk pembaca'),
    localizedLine('judul', 'Judul sisi'),
    defineField({
      name: 'caraMembeli',
      title: 'Cara membeli atau alur kerja',
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
      name: 'langkahPertama',
      title: 'Langkah pertama',
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
    defineField({
      name: 'urutan',
      title: 'Urutan di unit',
      type: 'number',
      validation: (Rule) => Rule.required().integer().min(0),
    }),
    defineField({
      name: 'jaringan',
      title: 'Blok jaringan Peekabo',
      description:
        'Wajib hanya untuk sisi jaringan Peekabo; tetap kosong di sisi lain.',
      type: 'object',
      fields: [
        defineField({
          name: 'caraKerja',
          title: 'Cara kerja',
          type: 'internationalizedArrayText',
        }),
        defineField({
          name: 'asalKomisi',
          title: 'Asal komisi',
          type: 'internationalizedArrayText',
        }),
        defineField({
          name: 'yangTidakAda',
          title: 'Yang tidak ada',
          type: 'internationalizedArrayText',
        }),
        defineField({
          name: 'syarat',
          title: 'Syarat',
          type: 'internationalizedArrayText',
        }),
        defineField({
          name: 'ajakanDaftar',
          title: 'Ajakan daftar',
          type: 'object',
          fields: [
            localizedLine('label', 'Label'),
            defineField({
              name: 'sesudahnya',
              title: 'Yang terjadi sesudahnya',
              type: 'internationalizedArrayText',
            }),
          ],
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
        title: localeValue(title, DEFAULT_LOCALE) ?? 'Sisi tanpa nama',
        subtitle,
      }
    },
  },
})

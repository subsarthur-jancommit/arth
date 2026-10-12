import { defineArrayMember, defineField, defineType } from 'sanity'

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

/**
 * A buyer situation within one side of an Arthur unit.
 *
 * The type is deliberately named `bab`, not `chapter`: project case studies
 * already use `chapters` as their own embedded editorial arc. A chapter here
 * is an independently ordered, routable offer context.
 */
export const bab = defineType({
  name: 'bab',
  title: 'Bab',
  type: 'document',
  groups: [
    { name: 'isi', title: 'Isi', default: true },
    { name: 'internal', title: 'Internal' },
  ],
  validation: (Rule) => Rule.custom(forbidPlaceholders),
  fields: [
    defineField({
      name: 'sisi',
      title: 'Sisi induk',
      type: 'reference',
      to: [{ type: 'side' }],
      validation: (Rule) => Rule.required(),
    }),
    localizedLine('nama', 'Nama untuk pembaca'),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: (document) => localeValue(document.nama, DEFAULT_LOCALE) ?? '',
        maxLength: 96,
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'kutipan',
      title: 'Yang biasa mereka katakan',
      type: 'internationalizedArrayText',
      description:
        'Gunakan kutipan pembeli dari master brief apa adanya; bukan slogan Arthur.',
      validation: (Rule) => Rule.required().custom(requireIndonesian),
    }),
    defineField({
      name: 'situasi',
      title: 'Situasi pembaca',
      type: 'internationalizedArrayText',
      description:
        'Paling banyak tiga kalimat; kosongkan jika belum bersumber.',
    }),
    defineField({
      name: 'urutan',
      title: 'Urutan di sisi',
      type: 'number',
      validation: (Rule) => Rule.required().integer().min(0),
    }),
    defineField({
      name: 'batas',
      title: 'Batas dan syarat',
      type: 'internationalizedArrayText',
      description:
        'Diisi bila offer di bab ini memerlukan batas atau syarat; paling banyak tiga kalimat.',
    }),
    defineField({
      name: 'jembatan',
      title: 'Jembatan ke offer lain',
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
      title: 'Ajakan bab',
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
    ...internalFields({ catalogId: true }),
  ],
  preview: {
    select: { title: 'nama', subtitle: 'slug.current' },
    prepare({ title, subtitle }) {
      return {
        title: localeValue(title, DEFAULT_LOCALE) ?? 'Bab tanpa nama',
        subtitle,
      }
    },
  },
})

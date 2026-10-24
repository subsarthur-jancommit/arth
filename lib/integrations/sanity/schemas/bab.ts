import { defineArrayMember, defineField, defineType } from 'sanity'

import {
  NETWORK_PATH_KEYS,
  NETWORK_PATH_STUDIO_TITLES,
} from '@/lib/content/network'
import { VERBATIM_FIELDS } from '@/lib/content/style-gate'

import { localeValue, requireIndonesian } from '../utils/i18n-array'
import {
  contentValidation,
  internalFields,
  uniqueWithinParent,
} from './internal'

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
  validation: contentValidation(VERBATIM_FIELDS.bab),
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
        isUnique: uniqueWithinParent('bab', 'sisi'),
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'pembeli',
      title: 'Untuk siapa',
      description:
        'Baris Pembeli di bab master brief, ditulis sebagai orang: “Untuk pemilik kafe dan resto, …”.',
      type: 'internationalizedArrayString',
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
      name: 'jalurJaringan',
      title: 'Jalur di halaman jaringan',
      description:
        'Hanya untuk bab di sisi jaringan Peekabo: jalur yang membuka bab ini. Bab di sisi itu tanpa jalur tidak ditautkan dari halaman jaringan.',
      type: 'string',
      options: {
        list: NETWORK_PATH_KEYS.map((value) => ({
          title: NETWORK_PATH_STUDIO_TITLES[value],
          value,
        })),
        layout: 'radio',
      },
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

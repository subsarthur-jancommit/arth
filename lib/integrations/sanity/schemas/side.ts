import {
  defineArrayMember,
  defineField,
  defineType,
  type ValidationContext,
} from 'sanity'

import { VERBATIM_FIELDS } from '@/lib/content/style-gate'
import {
  ALL_SIDES,
  isSideOf,
  isUnit,
  SIDE_STUDIO_TITLES,
} from '@/lib/content/units'

import { apiVersion } from '../env'
import { localeValue, requireIndonesian } from '../utils/i18n-array'
import { contentValidation, internalFields } from './internal'

const DEFAULT_LOCALE = 'id'

/**
 * The side's key must be one of its parent unit's sides. Without this, a side
 * filed under Teknologi with the key `pelaku-proyek` would publish, and no
 * route would ever render it.
 */
async function sideBelongsToUnit(
  kunci: string | undefined,
  context: ValidationContext
): Promise<true | string> {
  const ref = (context.document?.['unit'] as { _ref?: string } | undefined)
    ?._ref
  if (!kunci || !ref) return true

  const unit = await context
    .getClient({ apiVersion })
    .fetch<string | null>('*[_id in [$id, "drafts." + $id]][0].kunci', {
      id: ref,
    })
  const unitKey = unit ?? undefined
  if (!isUnit(unitKey)) return true
  return isSideOf(unitKey, kunci)
    ? true
    : `Sisi ini tidak ada di unit ${unit}. Pilih salah satu sisi unit itu.`
}

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
  validation: contentValidation(VERBATIM_FIELDS.side),
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
      validation: (Rule) => Rule.required().custom(sideBelongsToUnit),
    }),
    localizedLine('nama', 'Nama untuk pembaca'),
    localizedLine('judul', 'Judul sisi'),
    defineField({
      name: 'pembeli',
      title: 'Untuk siapa',
      description:
        'Pembeli di sisi ini, ditulis sebagai orang, dari Peta pembeli unit. Paling banyak delapan butir.',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          fields: [localizedLine('teks', 'Pembeli')],
          preview: { select: { title: 'teks.0.value' } },
        }),
      ],
      validation: (Rule) => Rule.max(8),
    }),
    defineField({
      name: 'caraMembeli',
      title: 'Cara membeli atau alur kerja',
      description:
        'Setiap butir: nama cara atau langkahnya, lalu keterangannya. Teks lama satu baris tetap terbaca sampai migrasi V2 selesai.',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          fields: [
            defineField({
              name: 'nama',
              title: 'Nama cara atau langkah',
              type: 'internationalizedArrayString',
            }),
            defineField({
              name: 'keterangan',
              title: 'Keterangan',
              description:
                'Untuk cara membeli: kapan cara itu cocok. Untuk alur kerja: apa yang terjadi di langkah itu.',
              type: 'internationalizedArrayText',
            }),
            defineField({
              name: 'teks',
              title: 'Teks lama satu baris',
              type: 'internationalizedArrayString',
              hidden: ({ parent }) => !parent?.teks,
            }),
          ],
          validation: (Rule) =>
            Rule.custom(
              (value: { nama?: unknown; teks?: unknown } | undefined) =>
                value?.nama || value?.teks ? true : 'Isi nama caranya.'
            ),
          preview: {
            select: { title: 'nama.0.value', subtitle: 'keterangan.0.value' },
          },
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

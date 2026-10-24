import { defineArrayMember, defineField, defineType } from 'sanity'

import { localeValue, requireIndonesian } from '../utils/i18n-array'
import { contentValidation, internalFields } from './internal'

const DEFAULT_LOCALE = 'id'

const localizedLine = (name: string, title: string) =>
  defineField({
    name,
    title,
    type: 'internationalizedArrayString',
    validation: (Rule) => Rule.required().custom(requireIndonesian),
  })

/** The single Arthur document explaining how work is agreed and delivered. */
export const howWeWork = defineType({
  name: 'howWeWork',
  title: 'Cara kami bekerja',
  type: 'document',
  groups: [
    { name: 'isi', title: 'Isi', default: true },
    { name: 'internal', title: 'Internal' },
  ],
  validation: contentValidation(),
  fields: [
    defineField({
      name: 'pembuka',
      title: 'Pembuka',
      type: 'internationalizedArrayText',
      description:
        'Satu kalimat di bawah judul halaman. Kosongkan bila halaman tidak memakainya.',
    }),
    defineField({
      name: 'janji',
      title: 'Janji tertulis',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          fields: [
            localizedLine('judul', 'Judul janji'),
            defineField({
              name: 'kalimat',
              title: 'Kalimat',
              type: 'internationalizedArrayText',
              validation: (Rule) => Rule.required().custom(requireIndonesian),
            }),
          ],
          preview: { select: { title: 'judul.0.value' } },
        }),
      ],
      validation: (Rule) => Rule.required().min(3),
    }),
    defineField({
      name: 'hakMilikKlien',
      title: 'Hak milik klien',
      type: 'internationalizedArrayText',
      validation: (Rule) => Rule.required().custom(requireIndonesian),
    }),
    defineField({
      name: 'pengungkapanKomisi',
      title: 'Pengungkapan komisi',
      type: 'internationalizedArrayText',
      validation: (Rule) => Rule.required().custom(requireIndonesian),
    }),
    defineField({
      name: 'yangTidakDijual',
      title: 'Yang tidak kami jual',
      type: 'internationalizedArrayText',
      validation: (Rule) => Rule.required().custom(requireIndonesian),
    }),
    defineField({
      name: 'wilayah',
      title: 'Wilayah',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          fields: [localizedLine('nama', 'Wilayah')],
          preview: { select: { title: 'nama.0.value' } },
        }),
      ],
      validation: (Rule) => Rule.required().min(1),
    }),
    defineField({
      name: 'contohFormat',
      title: 'Contoh format hasil kerja',
      description: 'Opsional; isi hanya setelah pemilik menyetujuinya.',
      type: 'internationalizedArrayText',
    }),
    defineField({ name: 'metadata', title: 'Metadata', type: 'metadata' }),
    ...internalFields(),
  ],
  preview: {
    select: { title: 'janji.0.judul' },
    prepare({ title }) {
      return {
        title: localeValue(title, DEFAULT_LOCALE) ?? 'Cara kerja Arthur',
        subtitle: 'Singleton',
      }
    },
  },
})

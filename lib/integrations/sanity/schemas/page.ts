import { defineField, defineType } from 'sanity'

import { localeValue, requireIndonesian } from '../utils/i18n-array'
import { forbidPlaceholders, internalFields } from './internal'

const DEFAULT_LOCALE = 'id'

const readerFields = [
  defineField({
    name: 'judul',
    title: 'Judul',
    type: 'internationalizedArrayString',
    validation: (Rule) => Rule.required().custom(requireIndonesian),
  }),
  defineField({
    name: 'isi',
    title: 'Isi',
    type: 'internationalizedArrayRichText',
    description:
      'Isi halaman tetap. Bahasa Indonesia wajib; bahasa Inggris mengikuti K2.',
  }),
]

const legacyFields = [
  defineField({
    name: 'title',
    title: 'Judul lama',
    type: 'string',
    hidden: true,
    readOnly: true,
    group: 'legacy',
    deprecated: {
      reason:
        'Gunakan Judul dua bahasa. Migrasi data dilakukan lewat prosedur §6.',
    },
  }),
  defineField({
    name: 'content',
    title: 'Isi lama',
    type: 'richText',
    hidden: true,
    readOnly: true,
    group: 'legacy',
    deprecated: {
      reason:
        'Gunakan Isi dua bahasa. Migrasi data dilakukan lewat prosedur §6.',
    },
  }),
  defineField({
    name: 'link',
    title: 'Tautan lama',
    type: 'link',
    hidden: true,
    readOnly: true,
    group: 'legacy',
    deprecated: { reason: 'Halaman tetap tidak lagi membutuhkan tautan.' },
  }),
]

export const page = defineType({
  name: 'page',
  title: 'Page',
  type: 'document',
  groups: [
    { name: 'isi', title: 'Isi', default: true },
    { name: 'internal', title: 'Internal' },
    { name: 'legacy', title: 'Warisan' },
  ],
  validation: (Rule) => Rule.custom(forbidPlaceholders),
  fields: [
    defineField({
      name: 'slug',
      title: 'Slug halaman',
      type: 'slug',
      description: 'The URL path for this page',
      options: {
        source: (document) => localeValue(document.judul, DEFAULT_LOCALE) ?? '',
        maxLength: 96,
      },
      validation: (Rule) =>
        Rule.required().custom((slug) => {
          // A dot is a valid Sanity slug character but collides with
          // proxy.ts's FILE_EXTENSION heuristic (`/\/[^/]+\.[^/]+$/`), which
          // treats any dotted last path segment as a static asset and skips
          // it from routing/discovery entirely — see
          // `routableDocumentSchema` in `lib/seo/routes.ts`, which already
          // rejects dotted slugs read back from the CMS. Blocking it here
          // stops an editor from publishing a route that would silently
          // vanish from the sitemap, `/llms.txt`, and the Markdown handler.
          if (slug?.current?.includes('.')) {
            return 'Slug cannot contain a dot ("."). Dotted paths are treated as static files and are excluded from the sitemap, llms.txt, and Markdown negotiation.'
          }
          return true
        }),
    }),
    defineField({
      name: 'publishedAt',
      title: 'Published At',
      type: 'datetime',
      description: 'When this page was published',
      initialValue: () => new Date().toISOString(),
    }),

    defineField({
      name: 'metadata',
      title: 'SEO & Metadata',
      type: 'metadata',
      description: 'SEO settings for this page',
    }),
    ...readerFields,
    ...legacyFields,
    ...internalFields(),
  ],
  preview: {
    select: {
      title: 'judul',
      legacyTitle: 'title',
      slug: 'slug.current',
    },
    prepare({ title, legacyTitle, slug }) {
      return {
        title:
          localeValue(title, DEFAULT_LOCALE) ??
          legacyTitle ??
          'Halaman tanpa judul',
        subtitle: slug ? `/halaman/${slug}` : 'No slug',
      }
    },
  },
  orderings: [
    {
      title: 'Published Date, New',
      name: 'publishedAtDesc',
      by: [{ field: 'publishedAt', direction: 'desc' }],
    },
    {
      title: 'Published Date, Old',
      name: 'publishedAtAsc',
      by: [{ field: 'publishedAt', direction: 'asc' }],
    },
  ],
})

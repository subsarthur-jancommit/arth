import { defineArrayMember, defineField, defineType } from 'sanity'

/**
 * The legacy site singleton, retained read-only until its production document
 * is copied to `siteSettings` through the documented migration procedure.
 *
 * Removing a schema while documents of that type remain makes their content
 * uneditable and obscures the recovery path. The frontend continues to read
 * this shape as a fallback, so this definition intentionally remains in the
 * schema but is not offered as a Studio navigation item or a new document.
 */
export const studioSettings = defineType({
  name: 'studioSettings',
  title: 'Studio lama (arsip)',
  type: 'document',
  readOnly: true,
  fields: [
    defineField({
      name: 'name',
      title: 'Studio name (legacy)',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'headline',
      title: 'Hero headline (legacy)',
      type: 'internationalizedArrayString',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'subline',
      title: 'Hero subline (legacy)',
      type: 'internationalizedArrayText',
    }),
    defineField({
      name: 'statement',
      title: 'Studio statement (legacy)',
      type: 'internationalizedArrayRichText',
    }),
    defineField({
      name: 'portrait',
      title: 'Portrait (legacy)',
      type: 'image',
      options: { hotspot: true },
      fields: [
        defineField({
          name: 'alt',
          title: 'Alt text',
          type: 'internationalizedArrayString',
          validation: (Rule) => Rule.required(),
        }),
      ],
    }),
    defineField({
      name: 'email',
      title: 'Contact email (legacy)',
      type: 'string',
      validation: (Rule) => Rule.email(),
    }),
    defineField({
      name: 'socials',
      title: 'Social links (legacy)',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          fields: [
            defineField({
              name: 'label',
              title: 'Label',
              type: 'string',
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: 'url',
              title: 'URL',
              type: 'url',
              validation: (Rule) => Rule.required(),
            }),
          ],
          preview: { select: { title: 'label', subtitle: 'url' } },
        }),
      ],
    }),
    defineField({
      name: 'metadata',
      title: 'Default SEO (legacy)',
      type: 'metadata',
    }),
  ],
  preview: {
    select: { title: 'name' },
    prepare({ title }) {
      return {
        title: title || 'Studio lama',
        subtitle: 'Arsip baca-saja; migrasikan ke Pengaturan Arthur',
      }
    },
  },
})

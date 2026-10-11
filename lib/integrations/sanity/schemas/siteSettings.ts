import { defineArrayMember, defineField, defineType } from 'sanity'

import { UNIT_STUDIO_TITLES, UNITS } from '@/lib/content/units'

/** Arthur-wide copy and contact facts. The Studio Structure fixes this as one document. */
export const siteSettings = defineType({
  name: 'siteSettings',
  title: 'Pengaturan Arthur',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: 'Nama Arthur',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'heroJudul',
      title: 'Judul payung',
      type: 'internationalizedArrayString',
      description: 'Judul beranda, paling banyak sembilan kata.',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'heroSubjudul',
      title: 'Subjudul payung',
      type: 'internationalizedArrayText',
      description: 'Satu kalimat, paling banyak tiga puluh kata.',
    }),
    defineField({
      name: 'pernyataanPemilik',
      title: 'Pernyataan pemilik',
      type: 'internationalizedArrayRichText',
      description: 'Pernyataan Arthur yang telah ditinjau pemilik.',
    }),
    defineField({
      name: 'portrait',
      title: 'Potret (warisan dokumen lama)',
      type: 'image',
      description:
        'Dipertahankan agar gambar dokumen lama tetap terbaca selama migrasi. Jangan menambah klaim atau identitas baru di sini.',
      options: { hotspot: true },
      fields: [
        defineField({
          name: 'alt',
          title: 'Teks alternatif',
          type: 'internationalizedArrayString',
        }),
      ],
    }),
    defineField({
      name: 'situasi',
      title: 'Situasi pembaca',
      type: 'array',
      description:
        'Tambahkan hanya situasi yang sudah disetujui. Kunci sisi dan bab sementara berupa teks sampai tipe tersebut tersedia.',
      of: [
        defineArrayMember({
          type: 'object',
          fields: [
            defineField({
              name: 'teks',
              title: 'Situasi',
              type: 'internationalizedArrayString',
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: 'unit',
              title: 'Unit',
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
            defineField({
              name: 'sisi',
              title: 'Kunci sisi (sementara)',
              type: 'string',
              description:
                'Kunci saja; akan menjadi referensi lemah saat tipe sisi tersedia.',
            }),
            defineField({
              name: 'bab',
              title: 'Kunci bab (sementara)',
              type: 'string',
              description:
                'Slug saja; akan menjadi referensi lemah saat tipe bab tersedia.',
            }),
          ],
          preview: {
            select: { title: 'teks.0.value', subtitle: 'unit' },
          },
        }),
      ],
    }),
    defineField({
      name: 'ajakan',
      title: 'Ajakan beranda',
      type: 'object',
      fields: [
        defineField({
          name: 'label',
          title: 'Label',
          type: 'internationalizedArrayString',
        }),
        defineField({
          name: 'sesudahnya',
          title: 'Yang terjadi sesudahnya',
          type: 'internationalizedArrayText',
        }),
      ],
    }),
    defineField({
      name: 'rangkaianPilihan',
      title: 'Rangkaian tiga unit pilihan',
      description:
        'Opsional. Tautkan satu rangkaian yang sudah ditinjau; referensi ini bukan hubungan induk-anak.',
      type: 'reference',
      to: [{ type: 'sequence' }],
      weak: true,
    }),
    defineField({
      name: 'wilayah',
      title: 'Wilayah layanan',
      type: 'array',
      description:
        'Gunakan hanya wilayah yang sudah dikonfirmasi pemilik; jangan mengarang alamat jalan.',
      of: [
        defineArrayMember({
          type: 'object',
          fields: [
            defineField({
              name: 'nama',
              title: 'Nama wilayah',
              type: 'internationalizedArrayString',
              validation: (Rule) => Rule.required(),
            }),
          ],
          preview: { select: { title: 'nama.0.value' } },
        }),
      ],
      validation: (Rule) => Rule.min(1),
    }),
    defineField({
      name: 'alamat',
      title: 'Alamat fisik sementara',
      type: 'internationalizedArrayString',
      description:
        'NOTE: nilai bawaan situs adalah alamat contoh, bukan lokasi nyata atau lokasi kunjungan. Ganti dengan alamat resmi sebelum kontak diterbitkan.',
    }),
    defineField({
      name: 'kanal',
      title: 'Kanal kontak',
      type: 'object',
      description:
        'Kanal utama dan waktu balas tetap menunggu keputusan K5 dari pemilik.',
      fields: [
        defineField({
          name: 'whatsapp',
          title: 'WhatsApp',
          type: 'string',
          description:
            'Biarkan kosong sampai pemilik menetapkan kanal utama dan memberikan nomor yang benar.',
        }),
        defineField({
          name: 'email',
          title: 'Alamat surel sementara',
          type: 'string',
          initialValue: 'kontak@arth.invalid',
          description:
            'NOTE: alamat dummy nonaktif. Ganti dengan alamat milik Arthur sebelum informasi kontak diterbitkan.',
          validation: (Rule) => Rule.email(),
        }),
        defineField({
          name: 'waktuBalas',
          title: 'Waktu balas',
          type: 'internationalizedArrayText',
          description:
            'Jangan menjanjikan waktu balas sebelum pemilik menetapkannya pada K5.',
        }),
      ],
    }),
    defineField({
      name: 'akunSosial',
      title: 'Akun sosial resmi',
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
              title: 'URL profil resmi',
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
      title: 'Metadata bawaan',
      type: 'metadata',
      description:
        'Metadata untuk halaman yang belum memiliki metadata sendiri.',
    }),
  ],
  preview: {
    select: { title: 'name' },
    prepare({ title }) {
      return {
        title: title || 'Pengaturan Arthur',
        subtitle: 'Singleton situs',
      }
    },
  },
})

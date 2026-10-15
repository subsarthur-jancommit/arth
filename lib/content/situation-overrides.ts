/**
 * Handwritten answers for situation pages, keyed `unit/side/slug`. A page
 * without an entry here is derived entirely by `deriveSituation`.
 */

import type { SituationOverride } from './situation-pages'

export const SITUATION_OVERRIDES = new Map<string, SituationOverride>([
  // Approved by the owner, docs/R1-SERAH-BAB-KULINER.md.
  [
    'teknologi/B/kuliner',
    {
      situasi:
        'Untuk warung, kafe, katering, produsen makanan, dan usaha dengan banyak outlet. Pesanan di chat bercampur, dan kasir kewalahan saat ramai.',
      metadata: {
        judul: 'Bot dan workflow untuk usaha kuliner',
        deskripsi:
          'Untuk warung, kafe, katering, dan produsen makanan. Pesanan WhatsApp dicatat bot, dan tamu memesan serta membayar dari meja.',
      },
      jembatan: [
        {
          offer: 'FNB-01',
          kalimat:
            'Untuk kafe yang belum buka, unit Konstruksi menyiapkan lokasi sewa sampai alur pelanggan dan dapurnya bekerja.',
        },
      ],
      pintuMasuk: 'KUL-01',
    },
  ],
])

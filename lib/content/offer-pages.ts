/**
 * The blocks of an offer that renders its own page, as the owner approved
 * them on 15 October 2026 (docs/R1-SERAH-BOT-PESAN-ANTAR.md and
 * docs/R1-SERAH-PESAN-BAYAR-MEJA.md). Every other offer is read in its
 * situation's list and needs none of these fields.
 */

export type OfferPage = {
  situasi: string
  tingkat: { nama: string; kalimat: string; poin: string[] }[]
  batas: string
  langkahPertama: { label: string; sesudahnya: string }
  metadata: { title: string; description: string }
}

const DIAGNOSIS = 'Minta sesi diagnosis'
const LATER =
  'Bila belum waktunya, kami mengatakannya terus terang dan menyarankan persiapan satu sampai tiga bulan. Biaya konsultasinya bersifat pilihan.'

export const OFFER_PAGES = new Map<string, OfferPage>([
  [
    'KUL-01',
    {
      situasi:
        'Pesanan warung Anda masuk lewat chat, bercampur dengan pesan lain. Saat tidak ada yang berjaga, pesanan menunggu sampai ada yang sempat membalas.',
      tingkat: [
        {
          nama: 'Paket Starter',
          kalimat:
            'Bot dipasang di nomor WhatsApp usaha Anda memakai layanan yang sudah jadi.',
          poin: [
            'Pesanan diterima dan dicatat kapan pun.',
            'Tagihan terkirim ke pelanggan untuk setiap pesanan.',
          ],
        },
        {
          nama: 'Paket Integrator',
          kalimat: 'Bot disambungkan ke pembayaran dan aturan usaha Anda.',
          poin: [
            'Uang yang masuk cocok dengan catatan pesanan.',
            'Harga dan promo berjalan menurut aturan Anda.',
          ],
        },
      ],
      batas:
        'Bot berjalan lewat kanal resmi WhatsApp usaha Anda, dan pesan hanya dikirim kepada pelanggan yang setuju menerimanya. Pengantaran tidak termasuk; kurirnya tetap dari usaha Anda.',
      langkahPertama: {
        label: DIAGNOSIS,
        sesudahnya: `Di sesi itu kami melihat cara pesanan masuk hari ini dan menentukan paket yang cukup. ${LATER}`,
      },
      metadata: {
        title: 'Bot pesan-antar WhatsApp untuk warung dan kedai',
        description:
          'Bot mencatat dan menagih setiap pesanan WhatsApp warung Anda. Mulai dengan Paket Starter atau Integrator lewat sesi diagnosis.',
      },
    },
  ],
  [
    'KUL-02',
    {
      situasi:
        'Di jam ramai, tamu kafe Anda mengantre di kasir untuk memesan dan membayar. Kasir kewalahan.',
      tingkat: [
        {
          nama: 'Paket Starter',
          kalimat: 'Menu pesan dari meja memakai layanan yang sudah jadi.',
          poin: [
            'Tamu memesan dan membayar dari meja.',
            'Pesanan masuk ke dapur dengan pembayaran sudah selesai.',
          ],
        },
        {
          nama: 'Paket Integrator',
          kalimat:
            'Pesanan dari meja disambungkan ke catatan dan aturan kafe Anda.',
          poin: [
            'Uang yang masuk cocok dengan catatan pesanan.',
            'Harga dan promo berjalan menurut aturan Anda.',
          ],
        },
      ],
      batas:
        'Perangkat keras di kafe Anda, seperti tablet atau printer, tidak termasuk.',
      langkahPertama: {
        label: DIAGNOSIS,
        sesudahnya: `Di sesi itu kami melihat alur pesanan di kafe Anda hari ini dan menentukan paket yang cukup. ${LATER}`,
      },
      metadata: {
        title: 'Pesan dan bayar dari meja untuk kafe dan resto',
        description:
          'Tamu memesan dan membayar dari meja; pesanan langsung masuk ke dapur. Mulai dengan Paket Starter atau Integrator.',
      },
    },
  ],
])

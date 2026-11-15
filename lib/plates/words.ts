/**
 * The words a plate draws, in the reader's locale.
 *
 * Provenance: original work for this project. No third-party code copied.
 *
 * A plate is written in Indonesian, the site's first language. The English
 * below is block L4 of `docs/R7-SERAH-INGGRIS.md`, approved by the owner on
 * 15 November 2026 ("Setujui semua"). It is keyed by the Indonesian exactly as
 * the plate's code writes it, before it is upper-cased or wrapped, so each
 * locale wraps and cases its own words. One map per plate, because a word can
 * mean two things on two drawings: "Saji" is the service route on the plan
 * and the step that serves a table in the order flow.
 *
 * A word missing here draws in Indonesian; `plates.test.ts` fails if any
 * English plate still carries a line of its Indonesian twin.
 */

import type { Unit } from '@/lib/content/units'
import type { Locale } from '@/lib/i18n/routing'

export const PLATE_WORDS_EN: Readonly<
  Record<Unit, Readonly<Record<string, string>>>
> = {
  konstruksi: {
    'DENAH LANTAI 1': 'GROUND FLOOR PLAN',
    'POTONGAN A-A': 'SECTION A-A',
    Teras: 'Terrace',
    Jalan: 'Street',
    'Alur pelanggan': 'Customer flow',
    'Ruang duduk': 'Seating',
    'Tangga naik': 'Stairs up',
    Tangga: 'Stairs',
    Bar: 'Bar',
    'Loket saji': 'Serving hatch',
    Dapur: 'Kitchen',
    Kompor: 'Stove',
    Olah: 'Prep',
    Gudang: 'Store',
    Cuci: 'Sink',
    Bahan: 'Stock',
    Saji: 'Service',
    Kanopi: 'Canopy',
    Cerobong: 'Flue',
    'Lantai 2': 'Upper floor',
    U: 'N',
  },
  teknologi: {
    Tamu: 'Guest',
    Sistem: 'System',
    Dapur: 'Kitchen',
    Pemasok: 'Supplier',
    'Pesan lewat WhatsApp': 'Order on WhatsApp',
    'juga saat tidak ada admin yang berjaga': 'even when no admin is on duty',
    'Memesan dari meja': 'Order at the table',
    'Membayar dari meja': 'Pay at the table',
    'Harga dan promo': 'Prices and promotions',
    'menurut aturan Anda': 'set by your rules',
    'Pesanan dicatat': 'Order recorded',
    'Uang yang masuk cocok dengan catatan pesanan.':
      'The money received matches the order record.',
    'Stok bahan tercatat': 'Stock recorded',
    'Layar pesanan di dapur': 'Kitchen order screen',
    'berikut urutan dan waktu sajinya': 'with the order and time of service',
    'Saji ke meja': 'Served to the table',
    Saji: 'Serve',
    'Bahan\nmenipis?': 'Stock\nrunning\nlow?',
    Ya: 'Yes',
    Tidak: 'No',
    'Pesan ulang ke pemasok': 'Reorder from the supplier',
    'terkirim sendiri saat bahan menipis': 'sent by itself when stock runs low',
  },
  peekabo: {
    'Pembukaan cabang atau gerai': 'Opening a branch or an outlet',
    'Untuk usaha F&B, ritel, jasa':
      'For food and beverage, retail, and service businesses',
    'Sebelum kafe dibuka': 'Before the café opens',
    'Hari pertama dibuka': 'Opening day',
    Sesudahnya: 'Afterwards',
    Perhatian: 'Attention',
    Kepercayaan: 'Trust',
    Penjualan: 'Sales',
    'Sasaran dan pesan': 'Audience and message',
    'Platform, sasaran, dan pesan dipilih sebelum uang iklan keluar.':
      'Platforms, audiences, and messages are chosen before any ad money is spent.',
    'Satu hari syuting': 'One shoot day',
    'menghasilkan stok konten untuk sebulan.': 'produces a month of content.',
    'Iklan di TikTok,\nMeta, dan Google': 'Ads on TikTok,\nMeta, and Google',
    'dengan aset yang diproduksi massal': 'with assets produced in volume',
    'Manajemen media sosial': 'Social media management',
    'Akun aktif dan konsisten setiap minggu tanpa Anda memikirkan apa yang diunggah.':
      'Your accounts stay active and consistent every week, without you thinking about what to post.',
    'Pendampingan ads bulanan': 'Monthly ads guidance',
    'Tim Anda tetap memegang akun, sementara kami mengarahkan dan memeriksa hasilnya setiap bulan.':
      'Your team keeps the accounts, while we guide the work and check the results every month.',
    'Warga sekitar diundang\nlebih dulu': 'The neighbours are\ninvited first',
    kafe: 'café',
    'Booth, sampling, demo': 'Booths, sampling, demos',
    'Produk dicoba langsung di tempat orang sudah berkumpul.':
      'The product is tried on the spot where people already gather.',
    'Temu pelanggan': 'Customer meet-ups',
    'Pelanggan bertemu langsung dan merasa menjadi bagian dari brand.':
      'Customers meet in person and feel part of the brand.',
    'Pasokan creator\ndan influencer': 'A supply of creators\nand influencers',
    'Anda mendapat kreator yang cocok dengan audiens Anda tanpa mencari satu per satu.':
      'You get creators who suit your audience, without searching for them one by one.',
    'Kreator, host live, dan sales ikut menjual':
      'Creators, live hosts, and sales staff sell for you',
    'Mereka dibayar dari penjualan yang terjadi.':
      'They are paid from the sales that happen.',
    'Target, lingkup, dan laporan disepakati tertulis.':
      'Targets, scope, and reports are agreed in writing.',
    'Kami tidak menjanjikan jangkauan atau penjualan.':
      'We do not promise reach or sales.',
  },
}

/** How one plate writes its words in one locale. */
export interface PlateWords {
  /** The word itself in Indonesian, or its approved English. */
  word: (indonesian: string) => string
  /** Upper case by the locale's own rules. */
  upper: (text: string) => string
  /** A length in metres, two decimals, with the locale's decimal mark. */
  metres: (value: number) => string
}

export function plateWords(unit: Unit, locale: Locale): PlateWords {
  if (locale === 'en') {
    const english = PLATE_WORDS_EN[unit]
    return {
      word: (indonesian) => english[indonesian] ?? indonesian,
      upper: (text) => text.toLocaleUpperCase('en'),
      metres: (value) => value.toFixed(2),
    }
  }
  return {
    word: (indonesian) => indonesian,
    upper: (text) => text.toLocaleUpperCase('id'),
    metres: (value) => value.toFixed(2).replace('.', ','),
  }
}

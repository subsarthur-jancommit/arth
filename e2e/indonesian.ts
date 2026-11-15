/**
 * What reads as Indonesian on a page that should be English: the two checks
 * behind `e2e/english-pages.e2e.ts`, R7's done-criterion ("Selesai bila
 * setiap halaman /en tayang seluruhnya dalam bahasa Inggris, tanpa
 * campuran", `docs/RENCANA-REVISI-F3.md`).
 *
 * Provenance: original work for this project. No third-party code copied.
 *
 * ## Words, not a language model
 *
 * `indonesianWords` matches Indonesian function words and the site's own
 * frequent vocabulary, each as a whole word in any case. A sentence cannot be
 * written in Indonesian without the function words (`yang`, `dan`, `untuk`,
 * `di`, `ke`...); the vocabulary catches the short labels that have none.
 * `indonesian.test.ts` holds both halves: no word here occurs in the approved
 * English (`messages/en.json`, the drawing labels, the route catalogue), and
 * every multi-word Indonesian interface string is caught.
 *
 * Measured on 15 November 2026: no false positive among 1,226 approved
 * English strings, including the 776 written to Sanity for R7; every
 * Indonesian interface string of three words or more caught; and 2,237 of the
 * 2,260 Indonesian Sanity values on the pages R7 translated. What slips
 * through is short titles such as "Live per jam", which `sameAsTwin` catches
 * when one is left untranslated on a page.
 *
 * Proper names that read the same in both languages are not words here: the
 * three unit names, Arthur, Membership Care, the cities, the platforms, and
 * "Bahasa Indonesia", the name of a language.
 */

const WORDS = new Set(
  `
  yang dan untuk dengan dari ini itu di ke pada oleh atau juga tidak tak akan
  sudah belum bisa dapat kami anda kita mereka adalah dalam sebagai karena jika
  kalau agar supaya lebih sangat hanya saja masih setiap semua tanpa tentang
  sampai hingga sesudah sebelum setelah lalu kemudian sendiri selalu pernah
  harus perlu ingin ada siapa bagaimana kapan mengapa kenapa bagi tiap serta
  namun tetapi tapi bila maka yaitu yakni telah sedang bukan apabila antara
  sejak menjadi membuat melalui terhadap seperti secara bersama

  beranda layanan pembayaran kontak metode kerja pekerjaan proyek bangunan
  pemilik usaha pelaku jaringan penjual halaman situasi langkah pertama lihat
  selengkapnya kembali tutup cari salin tersalin gagal ganti ceritakan masalah
  masalahnya wilayah alamat rangkaian tiga dua satu hasil siap pakai paham
  teknis pesan bayar dibayar tertulis kirim gambar harga biaya klien kartu
  jenis jalur alur tahap perujuk daftar komisi mitra bahan dapur tamu pemasok
  sistem pemasaran penjualan kepercayaan perhatian buka cara baru siaran iklan
  konten kreator ikut menjual menjualkan kantor sesuai disepakati dimulai mulai
  tunggu menunggu tinjauan terbuka tertutup utama lainnya semuanya pilih
  pilihan berikutnya sebelumnya selanjutnya unduh bagikan tautan salinan terima
  kasih mohon maaf silakan penugasan draf isi kebijakan penyiapan dokumen
  saring praktik tombol panah berpindah bahas serupa jelajahi menit baca lagi
  jurnal menurut ikuti umpan papan kampanye pembukaan denah lantai potongan
  ruang duduk tangga naik loket saji pesanan dicatat manajemen sosial
  pendampingan bulanan warga sekitar diundang dulu analisis kebutuhan minta
  sesi tenaga ahli hadir survei kondisi lapangan pencatat panen lewat contoh
  kota sepakati bentuk kontrak pemeliharaan instansi pembeli barang pemantauan
  paket sinkron ketersediaan lintas kanal tagihan kos siaga menutup kekurangan
  saat tenggat ketat pengingat iuran terkirim otomatis temukan situasinya temu
  pasokan perumahan kontraktor swasta tukang harian sewa peralatan ringan
  dokumentasi foto progres cepat antarpenyewa perawatan berkala janji pemantau
  kualifikasi perusahaan agensi lain produksi kreatif solusi rujuk transaksi
  jadi anggota
`
    .split(/\s+/)
    .filter(Boolean)
)

/**
 * Names that read the same in either language. A string made only of these
 * is not a leftover when it appears on both twins.
 */
const NAMES = new Set(
  `
  arthur konstruksi teknologi peekabo subang purwakarta bandung membership care
  tiktok shop tokopedia shopee whatsapp meta google instagram telegram discord
  qris tkdn satūs satus id en
`
    .split(/\s+/)
    .filter(Boolean)
)

/**
 * Strings that are English on both twins: written in code rather than in the
 * message catalogue, so the Indonesian page carries them too (a defect of the
 * Indonesian page, recorded in the R7 PR, not Indonesian on the English one).
 */
const ENGLISH_ON_BOTH = new Set(['arthur home', 'scrolling content'])

/**
 * The words of a string, lower-cased, with what is not prose taken out first:
 * web addresses, email addresses, domain names, and paths such as `/kontak`.
 * A run of letters touching a digit is not a word (`e384ced`, a build hash).
 */
export function wordsOf(text: string): string[] {
  const prose = text
    .replace(/https?:\/\/\S+/gu, ' ')
    .replace(/\S+@\S+/gu, ' ')
    .replace(/\b[\w-]+(?:\.[\w-]+)+\b/gu, ' ')
    .replace(/(?<![\p{L}\p{N}])\/[\w\-/.#]*/gu, ' ')
  return (
    prose.toLowerCase().match(/(?<![\p{L}\p{N}])\p{L}+(?![\p{L}\p{N}])/gu) ?? []
  )
}

/** The Indonesian words in a string, each once, or none. */
export function indonesianWords(text: string): string[] {
  return [...new Set(wordsOf(text).filter((word) => WORDS.has(word)))]
}

/** A string, normalised for comparing one twin with the other. */
function normal(text: string): string {
  return wordsOf(text).join(' ')
}

/**
 * The strings an English page shares, word for word, with its Indonesian
 * twin: copy that was never translated, whatever words it uses. Only strings
 * of two words or more count, and a string made only of names is no leftover.
 */
export function sameAsTwin(
  english: readonly string[],
  indonesian: readonly string[]
): string[] {
  const twin = new Set(indonesian.map(normal))
  return [
    ...new Set(
      english.filter((text) => {
        const words = wordsOf(text)
        if (words.length < 2) return false
        if (words.every((word) => NAMES.has(word))) return false
        const joined = words.join(' ')
        return twin.has(joined) && !ENGLISH_ON_BOTH.has(joined)
      })
    ),
  ]
}

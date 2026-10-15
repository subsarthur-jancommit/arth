/**
 * The handwritten half of the pattern approach, step 3
 * (`docs/R1-PENDEKATAN-POLA-OFFER.md`).
 *
 * `lib/scripts/import-catalog.ts` sends a row to the handwritten lane when it
 * carries †, waits on an open decision, or has an impact line that promises a
 * result someone else controls (Aturan isi 3). Each entry here is the agent's
 * answer for one such row, written from FULL KONTEKS:
 *
 * - `tetap`: the search word was a false alarm; the impact stands as written.
 * - `ditulis-ulang`: the impact is rewritten as the work that produces it.
 * - `rumusan-aman`: a † offer, published only with the safe wording in
 *   `dampak` and the condition in `syarat` (Aturan isi, Rumusan aman).
 * - `ditahan`: not published until the owner decides.
 *
 * An entry may also correct a title or an impact on an automatic row, when
 * the owner has already approved other wording (the Kuliner pages).
 *
 * The † and the reasons stay here and in the repository. Neither is written
 * to Sanity, whose published documents can be read publicly.
 */

export type CatalogDecision =
  | 'tetap'
  | 'ditulis-ulang'
  | 'rumusan-aman'
  | 'ditahan'

export type CatalogOverride = {
  keputusan: CatalogDecision
  judul?: string
  dampak?: string
  /** A † offer's condition, shown as one short line under its impact. */
  syarat?: string
  /** Why, for the owner's review. Never rendered. */
  alasan?: string
}

const PDP_HEALTH =
  'Data pasien dijaga sebagai data pribadi yang sensitif, sesuai UU PDP.'
const PUBLIC_DATA = 'Hanya dari data publik atau API resmi yang mengizinkannya.'
const OFFICIAL_ROUTE = 'Hanya lewat kerja sama atau jalur resmi instansinya.'

/**
 * Teknologi, models 1 to 4. Approved by the owner on 15 October 2026.
 */
export const TEKNOLOGI_OVERRIDES = new Map<string, CatalogOverride>([
  // Kuliner, owner-approved wording from docs/R1-SERAH-BAB-KULINER.md.
  [
    'KUL-01',
    {
      keputusan: 'ditulis-ulang',
      dampak:
        'Bot mencatat dan menagih setiap pesanan WhatsApp, juga saat tidak ada admin yang berjaga.',
      alasan: 'Tiga serangkai dipecah; disetujui pemilik',
    },
  ],
  [
    'KUL-02',
    {
      keputusan: 'ditulis-ulang',
      dampak:
        'Tamu memesan dan membayar dari meja; pesanan langsung masuk ke dapur.',
      alasan: 'Peta website; disetujui pemilik',
    },
  ],
  [
    'KUL-03',
    {
      keputusan: 'ditulis-ulang',
      judul: 'Layar pesanan di dapur',
      dampak:
        'Setiap pesanan tampil di layar dapur saat itu juga, berikut urutan dan waktu sajinya.',
      alasan: '“Realtime” dibuang; disetujui pemilik',
    },
  ],
  [
    'KUL-04',
    {
      keputusan: 'ditulis-ulang',
      dampak:
        'Reservasi meja masuk lewat bot, dengan uang muka yang tercatat otomatis.',
      alasan: 'Peta website',
    },
  ],
  [
    'KUL-06',
    {
      keputusan: 'ditulis-ulang',
      dampak:
        'Toko makanan beku untuk pembeli luar kota, dengan ongkir, resi, dan pelacakan yang berjalan sendiri.',
      alasan: '“Terjual” bergantung pada pembeli',
    },
  ],
  [
    'KUL-07',
    {
      keputusan: 'ditulis-ulang',
      dampak:
        'Pekerja kantor dan penghuni kos bisa berlangganan makan harian, dengan tagihan yang terkirim otomatis.',
      alasan: 'Pendapatan bergantung pada pembeli; disetujui pemilik',
    },
  ],
  [
    'KUL-08',
    {
      keputusan: 'ditulis-ulang',
      dampak:
        'Stok bahan tercatat, dan pesanan ke pemasok terkirim sendiri saat bahan menipis.',
      alasan: 'Habis dan terbuang bergantung pada pemakaian; disetujui pemilik',
    },
  ],
  [
    'KUL-09',
    {
      keputusan: 'ditulis-ulang',
      dampak:
        'Setiap tamu diajak menulis ulasan, puas atau tidak, dan draf balasannya disiapkan.',
      alasan: 'Kalimat wajib ulasan terbaca di kartu',
    },
  ],
  [
    'KUL-10',
    {
      keputusan: 'tetap',
      alasan: '“Penjualan dan royalti tercatat” adalah pencatatan',
    },
  ],
  [
    'KUL-11',
    {
      keputusan: 'ditulis-ulang',
      dampak: 'Jam ramai dan menu laris terlihat seketika di satu layar.',
      alasan: 'Jadwal staf bergantung pada pemilik',
    },
  ],

  // Individu, freelancer, software house, startup, tim IT.
  [
    'IND-01',
    {
      keputusan: 'ditulis-ulang',
      dampak:
        'Anda mencoba agen AI dan MCP pada pekerjaan Anda sendiri, dipandu per sesi.',
      alasan: '“Naik daun” dan “hitungan sesi” tidak berpegangan',
    },
  ],
  [
    'IND-07',
    {
      keputusan: 'rumusan-aman',
      dampak:
        'Lowongan dan beasiswa yang sesuai kriteria Anda dikirim segera setelah terbit.',
      syarat: PUBLIC_DATA,
      alasan: 'Teknologi aturan 6',
    },
  ],
  [
    'IND-08',
    {
      keputusan: 'rumusan-aman',
      dampak:
        'Anda diberi tahu saat harga barang atau tiket turun, tanpa memeriksa setiap hari.',
      syarat:
        'Bot hanya memantau dan memberi tahu; pembelian tetap Anda lakukan sendiri.',
      alasan:
        'Aturan 6; jauh dari bot pembeli tiket, yang sengaja tidak dijual',
    },
  ],
  [
    'FRL-01',
    {
      keputusan: 'ditulis-ulang',
      dampak: 'Anda menjual proyeknya, dan kami mengerjakannya atas nama Anda.',
      alasan: 'Kapasitas klien bukan hasil kerja Arthur',
    },
  ],
  [
    'FRL-05',
    {
      keputusan: 'ditulis-ulang',
      dampak:
        'Proyek booking dan checkout klien Anda dirakit dari modul yang sudah teruji.',
      alasan: 'Margin bergantung pada klien; saldo dibuang (aturan 2)',
    },
  ],
  [
    'FRL-15',
    {
      keputusan: 'ditulis-ulang',
      dampak:
        'Situs klien Anda dipercepat, dengan skor sebelum dan sesudahnya tercatat.',
      alasan: 'Konversi bergantung pada pengunjung',
    },
  ],
  [
    'SWH-10',
    {
      keputusan: 'rumusan-aman',
      dampak:
        'Produk klien Anda diuji celahnya dan disiapkan untuk audit PDP dan PSE.',
      syarat:
        'Pendaftaran PSE dan kepatuhan PDP tetap tanggung jawab pemilik produk.',
      alasan: 'Aturan 4',
    },
  ],
  [
    'SWH-15',
    {
      keputusan: 'ditulis-ulang',
      dampak:
        'Kode tim Anda ditinjau, dan tim junior didampingi di pekerjaan nyata.',
      alasan: 'Kualitas dan pertumbuhan tim bergantung pada tim',
    },
  ],
  [
    'STA-14',
    {
      keputusan: 'rumusan-aman',
      dampak:
        'Kuesioner keamanan calon klien enterprise dijawab dengan hasil uji dan dokumen yang siap.',
      syarat: 'Keputusan lolos tetap di tangan calon klien.',
      alasan: '“Lolos” dipegang calon klien; aturan 4',
    },
  ],
  [
    'STA-15',
    {
      keputusan: 'rumusan-aman',
      dampak:
        'Prospek dihubungi hanya bila memberi izin, lalu diurutkan menurut minatnya.',
      syarat: 'Pesan dikirim lewat kanal resmi.',
      alasan: 'Aturan 7',
    },
  ],
  [
    'STA-17',
    {
      keputusan: 'rumusan-aman',
      dampak: 'Identitas pengguna diverifikasi lewat jalur resmi.',
      syarat:
        'Hanya lewat penyedia verifikasi identitas yang bekerja sama resmi.',
      alasan: 'Aturan 5',
    },
  ],
  [
    'TIM-02',
    { keputusan: 'tetap', alasan: '“Naik sendiri” berarti eskalasi tiket' },
  ],
  ['TIM-07', { keputusan: 'tetap', alasan: '“Data penjualan” adalah data' }],
  [
    'DAT-08',
    {
      keputusan: 'ditulis-ulang',
      dampak: 'Penjualan, mesin, atau armada terlihat saat itu juga.',
      alasan:
        '“Terlihat hidup” tidak berpegangan; judul tetap, karena pembaca Sisi A memakai “realtime” sehari-hari',
    },
  ],
  [
    'DAT-21',
    {
      keputusan: 'rumusan-aman',
      dampak:
        'Struktur komisi referral dan afiliasi terlihat dan bisa diperiksa.',
      syarat:
        'Struktur komisi diperiksa terhadap aturan perdagangan sebelum dipakai.',
      alasan: 'Aturan 8',
    },
  ],
  [
    'DAT-22',
    {
      keputusan: 'rumusan-aman',
      syarat:
        'Hanya dari data tender publik; kami membantu menyiapkan penawaran, bukan mengatur hasil.',
      alasan: 'Aturan 6; kalimat wajib tender',
    },
  ],

  // Ritel, distributor, jasa lokal.
  [
    'RIT-03',
    {
      keputusan: 'ditulis-ulang',
      dampak:
        'Toko online milik brand sendiri, dengan data pembeli yang menjadi milik brand.',
      alasan: 'Penjualan bergantung pada pembeli',
    },
  ],
  [
    'RIT-04',
    {
      keputusan: 'ditulis-ulang',
      dampak:
        'Retur dicatat dan disetujui, dan pengembalian dana diproses tanpa surat-menyurat manual.',
      alasan: '“Dananya kembali” tertangkap kata',
    },
  ],
  [
    'RIT-05',
    {
      keputusan: 'rumusan-aman',
      dampak:
        'Perubahan harga pesaing di halaman publik dilaporkan kepada Anda.',
      syarat: 'Harga jual tetap Anda yang menentukan.',
      alasan: 'Aturan 6',
    },
  ],
  ['RIT-08', { keputusan: 'tetap', alasan: 'Pencatatan penjualan' }],
  [
    'RIT-09',
    {
      keputusan: 'ditulis-ulang',
      dampak:
        'Program poin dan hadiah berjalan untuk pelanggan Anda, dan data belanjanya terkumpul.',
      alasan: 'Pelanggan kembali bergantung pada pelanggan',
    },
  ],
  [
    'RIT-10',
    {
      keputusan: 'ditulis-ulang',
      dampak:
        'Pembeli melihat produk yang sering dibeli bersama, dari pola belanja di toko Anda.',
      alasan: 'Nilai keranjang bergantung pada pembeli',
    },
  ],
  [
    'RIT-11',
    {
      keputusan: 'ditulis-ulang',
      dampak:
        'Seller lain memakai layanan multi-kurir Anda; ongkir termurah dipilih otomatis, dan Anda menetapkan selisih tarifnya.',
      alasan: 'Pendapatan ditulis sebagai cara kerjanya',
    },
  ],
  [
    'DIS-08',
    {
      keputusan: 'rumusan-aman',
      dampak:
        'Kenaikan harga pemasok di sumber publik terdeteksi dan dilaporkan lebih dulu.',
      syarat: 'Harga jual tetap Anda yang menentukan.',
      alasan: 'Aturan 6',
    },
  ],
  [
    'JAS-01',
    {
      keputusan: 'ditulis-ulang',
      dampak:
        'Pelanggan memesan jadwal lewat bot dan menerima pengingat sebelum datang.',
      alasan: 'Kehadiran bergantung pada pelanggan',
    },
  ],
  [
    'JAS-03',
    {
      keputusan: 'ditulis-ulang',
      dampak:
        'Pelanggan menerima pengingat saat servis berkalanya jatuh tempo.',
      alasan: 'Pelanggan kembali bergantung pada pelanggan',
    },
  ],
  [
    'JAS-04',
    {
      keputusan: 'ditulis-ulang',
      dampak:
        'Mesin laundry koin menyala setelah pembayaran QRIS, tanpa penjaga.',
      alasan: 'Pendapatan ditulis sebagai cara kerjanya',
    },
  ],
  [
    'JAS-08',
    {
      keputusan: 'ditulis-ulang',
      dampak: 'Paket perawatan atau servis dibuka sebagai langganan bulanan.',
      alasan: 'Pendapatan bergantung pada pelanggan',
    },
  ],
  [
    'JAS-09',
    {
      keputusan: 'ditulis-ulang',
      dampak: 'Pelanggan diberi kabar lewat pesan saat cuciannya selesai.',
      alasan: 'Berkurangnya pertanyaan bergantung pada pelanggan',
    },
  ],
  [
    'JAS-10',
    {
      keputusan: 'tetap',
      alasan: 'Pendapatan per mesin adalah data yang ditampilkan',
    },
  ],

  // Kesehatan dan pendidikan.
  [
    'KES-01',
    {
      keputusan: 'rumusan-aman',
      dampak:
        'Pasien membuat janji sendiri lewat bot, tanpa menunggu telepon dijawab.',
      syarat: PDP_HEALTH,
      alasan: 'Aturan 4',
    },
  ],
  [
    'KES-02',
    {
      keputusan: 'rumusan-aman',
      dampak: 'Pasien menerima pengingat jadwal kontrol dan obat.',
      syarat:
        'Pengingat hanya untuk pasien yang setuju; data pasien dijaga sesuai UU PDP.',
      alasan: 'Aturan 4 dan 7; kedatangan dipegang pasien',
    },
  ],
  [
    'KES-04',
    { keputusan: 'rumusan-aman', syarat: PDP_HEALTH, alasan: 'Aturan 4' },
  ],
  [
    'KES-05',
    {
      keputusan: 'rumusan-aman',
      syarat: 'Hanya lewat jalur resmi SATUSEHAT.',
      alasan: 'Aturan 5',
    },
  ],
  [
    'KES-07',
    {
      keputusan: 'rumusan-aman',
      dampak:
        'Pasien di luar area berkonsultasi dan memesan obat secara online, dengan pembayaran dan pengiriman tersambung.',
      syarat:
        'Layanan medis dan obat tetap dijalankan tenaga kesehatan klinik yang berwenang.',
      alasan: 'Aturan 4; rumusan aman 2 (pihak berwenang)',
    },
  ],
  [
    'KES-10',
    { keputusan: 'rumusan-aman', syarat: PDP_HEALTH, alasan: 'Aturan 4' },
  ],
  [
    'KES-11',
    { keputusan: 'rumusan-aman', syarat: OFFICIAL_ROUTE, alasan: 'Aturan 5' },
  ],
  [
    'EDU-03',
    {
      keputusan: 'ditulis-ulang',
      dampak: 'Kelas online berlangganan dibuka di samping kelas tatap muka.',
      alasan: 'Pendapatan bergantung pada peserta',
    },
  ],
  [
    'EDU-06',
    {
      keputusan: 'ditulis-ulang',
      judul: 'Portal orang tua: kehadiran dan nilai',
      dampak:
        'Orang tua melihat kehadiran dan nilai anak seketika lewat portal.',
      alasan: '“Realtime”; berkurangnya pertanyaan bergantung pada orang tua',
    },
  ],
  [
    'EDU-07',
    {
      keputusan: 'rumusan-aman',
      syarat: 'Hanya lewat jalur resmi Dapodik.',
      alasan: 'Aturan 5',
    },
  ],

  // Properti, keuangan, konstruksi, travel.
  [
    'PRO-06',
    {
      keputusan: 'rumusan-aman',
      dampak:
        'Calon pembeli menghitung cicilan dan mengajukan ke leasing dari situs, dengan status pengajuan yang terpantau.',
      syarat: 'Persetujuan pembiayaan di tangan perusahaan pembiayaan berizin.',
      alasan: 'Kalimat wajib pembiayaan',
    },
  ],
  [
    'PRO-07',
    {
      keputusan: 'ditulis-ulang',
      dampak:
        'Pelanggan lama menerima pengingat servis, pajak, dan asuransi kendaraannya.',
      alasan: 'Pelanggan kembali bergantung pada pelanggan',
    },
  ],
  [
    'KEU-06',
    {
      keputusan: 'ditahan',
      alasan:
        'Bot investasi dekat dengan bot trading; menunggu keputusan posisi bot trading',
    },
  ],
  [
    'KEU-10',
    {
      keputusan: 'rumusan-aman',
      dampak: 'Berkas pemohon diverifikasi, dan setiap keputusan tercatat.',
      syarat:
        'Keputusan pembiayaan tetap di tangan pemberi pembiayaan berizin.',
      alasan: 'Kalimat wajib pembiayaan',
    },
  ],
  [
    'KEU-11',
    {
      keputusan: 'rumusan-aman',
      dampak:
        'Polis yang mendekati jatuh tempo diingatkan kepada agen untuk ditindaklanjuti.',
      syarat: 'Penjualan asuransi tetap oleh agen berlisensi.',
      alasan: 'Aturan main gabungan 5',
    },
  ],
  [
    'KEU-12',
    {
      keputusan: 'rumusan-aman',
      dampak:
        'Lini pulsa, token listrik, dan tagihan dibuka dari supplier, dengan selisih harga yang Anda tetapkan.',
      syarat: 'Produk yang boleh dijual mengikuti kontrak dengan supplier.',
      alasan: 'Aturan 3',
    },
  ],
  [
    'KON-01',
    {
      keputusan: 'rumusan-aman',
      syarat:
        'Dari situs pengadaan publik; kami membantu menyiapkan, bukan mengatur hasil.',
      alasan: 'Aturan 6; kalimat wajib tender',
    },
  ],
  [
    'KON-10',
    {
      keputusan: 'rumusan-aman',
      syarat:
        'Hanya dari data tender publik; kami membantu menyiapkan penawaran, bukan mengatur hasil.',
      alasan: 'Aturan 6; kalimat wajib tender',
    },
  ],
  [
    'TRV-01',
    {
      keputusan: 'rumusan-aman',
      dampak:
        'Tiket, hotel, dan paket dari supplier ditawarkan lewat situs Anda, dengan komisi atau markup.',
      syarat: 'Produk yang boleh dijual mengikuti kontrak dengan supplier.',
      alasan: 'Aturan 3',
    },
  ],
  [
    'TRV-04',
    {
      keputusan: 'rumusan-aman',
      syarat: 'Lewat sambungan resmi setiap platform.',
      alasan: 'Aturan 3',
    },
  ],
  [
    'TRV-05',
    {
      keputusan: 'ditulis-ulang',
      dampak:
        'Tiket event dijual online, dipindai di pintu, dan penjualannya terlihat seketika.',
      alasan: '“Realtime”',
    },
  ],
  [
    'TRV-09',
    {
      keputusan: 'ditulis-ulang',
      dampak:
        'Hari libur dan lonjakan permintaan diperingatkan lebih dulu, supaya harga bisa Anda sesuaikan.',
      alasan: '“Tepat waktu” bergantung pada pemilik',
    },
  ],

  // Media, logistik, produksi, publik, profesional, kebugaran, lintas sektor.
  [
    'MED-04',
    {
      keputusan: 'ditulis-ulang',
      dampak: 'Membership penggemar dengan konten eksklusif, ditagih bulanan.',
      alasan: 'Pendapatan bergantung pada penggemar',
    },
  ],
  [
    'MED-08',
    { keputusan: 'tetap', alasan: 'Pendapatan adalah data yang ditampilkan' },
  ],
  [
    'MED-12',
    {
      keputusan: 'ditulis-ulang',
      dampak: 'Pembaca yang mendaftar menerima kabar sesuai minatnya.',
      alasan: 'Pembaca kembali bergantung pada pembaca; persetujuan',
    },
  ],
  [
    'LOG-02',
    {
      keputusan: 'ditulis-ulang',
      dampak: 'Pelanggan diberi kabar di setiap tahap pengiriman.',
      alasan: 'Berkurangnya pertanyaan bergantung pada pelanggan',
    },
  ],
  [
    'LOG-03',
    {
      keputusan: 'ditulis-ulang',
      dampak:
        'Foto, tanda tangan, dan lokasi serah terima tercatat sebagai bukti.',
      alasan: 'Klaim bergantung pada pihak lain',
    },
  ],
  [
    'LOG-08',
    {
      keputusan: 'ditulis-ulang',
      dampak:
        'Seller memilih kurir termurah lewat agregator Anda, dan Anda menetapkan selisih tarifnya.',
      alasan: 'Pendapatan ditulis sebagai cara kerjanya',
    },
  ],
  [
    'MAN-08',
    {
      keputusan: 'ditulis-ulang',
      dampak:
        'Toko online untuk produk kemasan, menjangkau pembeli luar kota tanpa perantara.',
      alasan: '“Terjual” bergantung pada pembeli',
    },
  ],
  [
    'MAN-09',
    {
      keputusan: 'ditulis-ulang',
      dampak:
        'Kebutuhan bahan diperkirakan dari pola penjualan, sebagai dasar pembelian.',
      alasan: 'Stok bergantung pada keputusan pembelian',
    },
  ],
  [
    'PUB-08',
    { keputusan: 'rumusan-aman', syarat: OFFICIAL_ROUTE, alasan: 'Aturan 5' },
  ],
  [
    'PUB-11',
    {
      keputusan: 'ditulis-ulang',
      dampak:
        'Marketplace untuk produk UMKM desa, dengan komisi untuk BUMDes dari setiap transaksi.',
      alasan: '“Terjual” bergantung pada pembeli',
    },
  ],
  [
    'PRF-07',
    {
      keputusan: 'ditulis-ulang',
      dampak:
        'Klien melihat progres dan dokumen proyeknya sendiri lewat portal.',
      alasan: 'Berkurangnya pertanyaan bergantung pada klien',
    },
  ],
  [
    'PRF-08',
    {
      keputusan: 'rumusan-aman',
      syarat:
        'Tanda tangan elektronik lewat penyelenggara sertifikasi elektronik yang berizin.',
      alasan: 'Rumusan aman 2 (pihak berizin)',
    },
  ],
  [
    'FIT-04',
    {
      keputusan: 'ditulis-ulang',
      dampak: 'Keanggotaan dan paket sesi dibuka dengan tagihan berulang.',
      alasan: 'Pendapatan bergantung pada anggota',
    },
  ],
  [
    'LIN-01',
    { keputusan: 'tetap', alasan: 'Ringkasan penjualan adalah laporan' },
  ],
  [
    'LIN-02',
    { keputusan: 'tetap', alasan: '“Penjualan anjlok” adalah isi peringatan' },
  ],
  [
    'LIN-04',
    {
      keputusan: 'ditulis-ulang',
      dampak:
        'Tagihan diingatkan bertahap kepada pelanggan sampai jatuh tempo.',
      alasan: 'Kas masuk bergantung pada pelanggan',
    },
  ],
  [
    'LIN-09',
    {
      keputusan: 'rumusan-aman',
      syarat: 'Data KTP dijaga sebagai data pribadi, sesuai UU PDP.',
      alasan: 'Aturan 4',
    },
  ],
  [
    'LIN-22',
    {
      keputusan: 'rumusan-aman',
      dampak:
        'Jaringan reseller dan afiliasi dengan komisi yang tercatat otomatis.',
      syarat:
        'Komisi satu tingkat, diperiksa terhadap aturan perdagangan sebelum dibuka.',
      alasan: 'Aturan 8; aturan main gabungan 4',
    },
  ],
  [
    'LIN-23',
    {
      keputusan: 'rumusan-aman',
      dampak:
        'Panggilan yang tak terjawab dicatat menjadi pesanan atau jadwal.',
      syarat:
        'Bot memperkenalkan diri sebagai bot, dan rekaman hanya dengan persetujuan penelepon.',
      alasan: 'Aturan 9; Peta website, bot memperkenalkan diri',
    },
  ],
  [
    'LIN-24',
    {
      keputusan: 'ditulis-ulang',
      dampak:
        'Pembelian tercatat dan disetujui, lalu dibayar sesuai jadwalnya.',
      alasan: '“Tepat waktu” bergantung pada pembayar',
    },
  ],
  // Judul untuk pembaca hasil siap pakai tanpa “realtime” (Suara dan gaya 13),
  // mengikuti judul Kuliner yang disetujui. Sisi A tetap memakainya.
  [
    'DIS-10',
    {
      keputusan: 'tetap',
      judul: 'Dasbor sales dan stok yang diperbarui seketika',
      alasan: '“Realtime” bukan kata sehari-hari pembaca Sisi B',
    },
  ],
  [
    'KES-03',
    {
      keputusan: 'tetap',
      judul: 'Antrean pasien yang terlihat langsung',
      alasan: '“Realtime” bukan kata sehari-hari pembaca Sisi B',
    },
  ],
  [
    'PRO-03',
    {
      keputusan: 'tetap',
      judul: 'Etalase unit yang diperbarui langsung',
      alasan: '“Realtime” bukan kata sehari-hari pembaca Sisi B',
    },
  ],
  [
    'KON-06',
    {
      keputusan: 'tetap',
      judul: 'Dasbor arus kas dan kurva S terkini',
      alasan: '“Realtime” bukan kata sehari-hari pembaca Sisi B',
    },
  ],
  [
    'MED-01',
    {
      keputusan: 'tetap',
      judul: 'Overlay donasi dan alert langsung di layar',
      alasan: '“Realtime” bukan kata sehari-hari pembaca Sisi B',
    },
  ],
  [
    'LOG-01',
    {
      keputusan: 'tetap',
      judul: 'Pelacakan armada langsung',
      alasan: '“Realtime” bukan kata sehari-hari pembaca Sisi B',
    },
  ],
  [
    'PUB-04',
    {
      keputusan: 'tetap',
      judul: 'Dasbor aduan dan layanan terkini',
      alasan: '“Realtime” bukan kata sehari-hari pembaca Sisi B',
    },
  ],
  [
    'FIT-07',
    {
      keputusan: 'tetap',
      judul: 'Klasemen dan skor langsung',
      alasan: '“Realtime” bukan kata sehari-hari pembaca Sisi B',
    },
  ],
  [
    'LIN-12',
    {
      keputusan: 'tetap',
      judul: 'Dasbor pemilik yang diperbarui seketika',
      alasan: '“Realtime” bukan kata sehari-hari pembaca Sisi B',
    },
  ],
  // Found while deriving the situation pages (step 4): style on automatic rows.
  [
    'IND-02',
    {
      keputusan: 'ditulis-ulang',
      dampak:
        'Anda memahami tiga cara menyimpan dan mengalirkan data dengan membangun sesuatu yang dipakai.',
      alasan: '“Benar-benar” adalah kata penguat',
    },
  ],
  [
    'IND-09',
    {
      keputusan: 'ditulis-ulang',
      dampak:
        'Calon klien bisa melihat karya Anda dan menghubungi Anda langsung.',
      alasan: '“Terbaik”; kontak dipegang calon klien',
    },
  ],
  [
    'FRL-02',
    {
      keputusan: 'tetap',
      judul: 'Modul bot dan workflow siap pasang untuk klien',
      alasan: 'Judul kartu paling banyak 8 kata',
    },
  ],
  [
    'DAT-02',
    {
      keputusan: 'tetap',
      judul: 'Migrasi Excel dan sistem lama ke SQL',
      alasan: 'Judul kartu paling banyak 8 kata; pembaca Sisi A memakai “SQL”',
    },
  ],
  [
    'KON-03',
    {
      keputusan: 'tetap',
      judul: 'Pengingat masa berlaku SBU, SKK, NIB, dan jaminan',
      alasan: 'Judul kartu paling banyak 8 kata',
    },
  ],
  [
    'LIN-16',
    {
      keputusan: 'tetap',
      judul: 'Kanal jualan WhatsApp dengan katalog dan tautan bayar',
      alasan: 'Judul kartu paling banyak 8 kata',
    },
  ],
  [
    'LIN-26',
    {
      keputusan: 'tetap',
      judul: 'Migrasi dari Excel dan chat ke data rapi',
      alasan: 'Judul kartu paling banyak 8 kata',
    },
  ],
  [
    'STA-12',
    {
      keputusan: 'ditulis-ulang',
      dampak:
        'Pemakaian cloud ditinjau dan dirapikan sebelum ronde pendanaan berikutnya.',
      alasan: 'Tagihan turun bergantung pada pemakaian',
    },
  ],
  [
    'DAT-01',
    {
      keputusan: 'tetap',
      alasan: '“Siap tumbuh” adalah kesiapan skema, bukan hasil pasar',
    },
  ],
  [
    'RIT-01',
    {
      keputusan: 'ditulis-ulang',
      dampak:
        'Stok di semua kanal berasal dari satu sumber, sehingga barang yang habis tidak tampil tersedia.',
      alasan: 'Batal atau tidak dipegang pembeli dan marketplace',
    },
  ],
  [
    'DIS-03',
    {
      keputusan: 'tetap',
      alasan: '“Sampai lunas” adalah tahap alur, bukan janji pembayaran',
    },
  ],
  [
    'DIS-07',
    {
      keputusan: 'ditulis-ulang',
      dampak: 'Rute tersusun otomatis dari pesanan hari itu.',
      alasan: 'Biaya kirim bergantung pada jalan dan armada',
    },
  ],
  [
    'DIS-09',
    {
      keputusan: 'ditulis-ulang',
      dampak:
        'Stok fisik dan catatan dicocokkan berkala, dan selisihnya tercatat.',
      alasan: '“Selalu cocok” tidak bisa dijanjikan',
    },
  ],
  [
    'EDU-01',
    {
      keputusan: 'ditulis-ulang',
      dampak:
        'Orang tua menerima tagihan dan kode bayar SPP tanpa datang ke sekolah.',
      alasan: 'Tunggakan dipegang orang tua',
    },
  ],
  [
    'LOG-04',
    {
      keputusan: 'ditulis-ulang',
      dampak: 'Rute dan muatan barang disusun lebih efisien.',
      alasan: 'Hemat bahan bakar bergantung pada jalan dan sopir',
    },
  ],
])

const NO_LOAN =
  'Kami tidak memberi pinjaman; pembiayaan dan syaratnya dari mitra berizin.'
const JOINT_OPERATION =
  'Kerja sama operasi memakai perjanjian tertulis, dan di proyek pemerintah tunduk pada aturan pengadaan.'
const BUILDING_APPROVAL =
  'Kami menyusun berkasnya; persetujuan tetap keputusan instansi yang berwenang.'
const ELECTRICIAN = 'Instalasi listrik dikerjakan mitra instalatir berwenang.'
const INSURANCE_AGENT = 'Polis dijual agen asuransi berlisensi.'
const FAIR_MARGIN =
  'Keuntungan dalam HPS dijaga wajar dan dapat diperiksa auditor.'

/**
 * Konstruksi, models 5 to 9 and the Rawat rows of model 10. Rules cited are
 * Konstruksi's Peta & aturan main, rules 1 to 13. Approved by the owner on
 * 15 October 2026.
 */
export const KONSTRUKSI_OVERRIDES = new Map<string, CatalogOverride>([
  // Paket dan paket rakitan.
  [
    'HHK-13',
    { keputusan: 'rumusan-aman', syarat: JOINT_OPERATION, alasan: 'Aturan 8' },
  ],
  [
    'RAK-03',
    {
      keputusan: 'ditulis-ulang',
      dampak: 'Opname dan berkas termin disiapkan sebelum termin diajukan.',
      alasan: 'Pencairan dipegang pemberi kerja; rumusan Peta website',
    },
  ],
  [
    'RAK-14',
    {
      keputusan: 'tetap',
      judul: 'Paket Sumber Barang dan Margin',
      syarat: FAIR_MARGIN,
      alasan:
        '“Terbaik” adalah pujian diri; aturan 4 melekat lewat analisis margin di dalamnya',
    },
  ],
  [
    'RAK-16',
    {
      keputusan: 'ditulis-ulang',
      dampak:
        'Setiap unit diperiksa dan dirapikan, dan keluhan pembeli diperbaiki sebelum serah terima.',
      alasan:
        'Komplain dipegang pembeli; isi paket: pemeriksaan, finishing, perbaikan keluhan',
    },
  ],
  [
    'DEV-03',
    {
      keputusan: 'ditulis-ulang',
      dampak:
        'Rumah contoh dibangun dan ditata untuk dikunjungi calon pembeli.',
      alasan: '“Alat penjualan” tertangkap kata',
    },
  ],

  // Berkas dan administrasi.
  [
    'ADM-08',
    {
      keputusan: 'rumusan-aman',
      syarat:
        'Sertifikat atas nama badan usaha dan tenaga kerja Anda sendiri; nama dan sertifikat tidak dipinjamkan.',
      alasan: 'Aturan 1',
    },
  ],
  [
    'ADM-12',
    {
      keputusan: 'ditulis-ulang',
      dampak:
        'Berkas penagihan termin disusun dan dijaga lengkap sampai diproses pemberi kerja.',
      alasan: 'Pencairan dipegang pemberi kerja',
    },
  ],
  [
    'PRJ-03',
    {
      keputusan: 'ditulis-ulang',
      dampak:
        'Laporan disusun dalam format pemberi kerja, sesuai jadwal pelaporannya.',
      alasan: '“Tepat waktu” tertangkap kata',
    },
  ],
  [
    'PNY-05',
    {
      keputusan: 'ditulis-ulang',
      dampak:
        'Barang dikirim ke lokasi instansi sesuai jadwal yang disepakati.',
      alasan: '“Tepat waktu” bergantung pada jalan dan penerima',
    },
  ],
  [
    'PNY-12',
    {
      keputusan: 'rumusan-aman',
      dampak:
        'Margin dihitung dari harga sumber, ongkos, dan risiko sebelum menawar.',
      syarat: FAIR_MARGIN,
      alasan: 'Aturan 4',
    },
  ],
  [
    'PNY-13',
    {
      keputusan: 'rumusan-aman',
      syarat:
        'Kami tidak memegang peran penyedia dan konsultan di paket yang sama.',
      alasan: 'Aturan 3',
    },
  ],

  // Lapangan.
  [
    'TNK-06',
    {
      keputusan: 'rumusan-aman',
      dampak:
        'Pekerjaan dijalankan sesuai gambar dan spesifikasi oleh tenaga yang bekerja di lokasi.',
      syarat:
        'Tenaga ahli bekerja di lapangan proyek Anda; nama dan sertifikatnya tidak dipinjamkan.',
      alasan: 'Aturan 1; “benar-benar” dibuang',
    },
  ],
  [
    'TNK-07',
    {
      keputusan: 'ditulis-ulang',
      dampak: 'Keselamatan kerja dikelola di lokasi oleh petugas K3.',
      alasan: 'Kecelakaan dan temuan tidak bisa dijanjikan berkurang',
    },
  ],
  [
    'ALT-03',
    {
      keputusan: 'ditulis-ulang',
      dampak:
        'Alat diantar ke lokasi dan dijemput kembali sesuai jadwal yang disepakati.',
      alasan: '“Tepat waktu” tertangkap kata',
    },
  ],
  [
    'DEV-08',
    {
      keputusan: 'rumusan-aman',
      syarat: BUILDING_APPROVAL,
      alasan: 'Aturan 10',
    },
  ],
  [
    'RMH-11',
    {
      keputusan: 'rumusan-aman',
      syarat: BUILDING_APPROVAL,
      alasan: 'Aturan 10',
    },
  ],

  // Barang.
  [
    'GOV-01',
    {
      keputusan: 'ditulis-ulang',
      dampak:
        'Meja, kursi, dan lemari diadakan sesuai spesifikasi dan jadwal pengadaan.',
      alasan: '“Tepat waktu” tertangkap kata',
    },
  ],

  // Rumah, interior, F&B, studio, hospitality.
  [
    'RMH-03',
    {
      keputusan: 'rumusan-aman',
      dampak:
        'Lantai baru dibangun setelah kekuatan struktur lama diperiksa tenaga ahli berwenang.',
      syarat:
        'Pekerjaan dimulai setelah perhitungan struktur dan persetujuan bangunan gedung selesai.',
      alasan: 'Aturan 10; contoh di Aturan isi',
    },
  ],
  [
    'ITR-08',
    { keputusan: 'rumusan-aman', syarat: ELECTRICIAN, alasan: 'Aturan 11' },
  ],
  [
    'STD-02',
    { keputusan: 'rumusan-aman', syarat: ELECTRICIAN, alasan: 'Aturan 11' },
  ],
  [
    'HOS-01',
    {
      keputusan: 'ditulis-ulang',
      judul: 'Makeover villa yang siap difoto dan ditawarkan',
      dampak:
        'Villa dibenahi sampai layak tampil di foto dan siap ditawarkan ulang.',
      alasan: 'Tarif dipegang pasar; rumusan Peta website',
    },
  ],
  [
    'HOS-02',
    {
      keputusan: 'ditulis-ulang',
      dampak: 'Kontrakan kusam dibenahi sampai layak disewakan kembali.',
      alasan: 'Rumusan Peta website',
    },
  ],
  [
    'HOS-04',
    {
      keputusan: 'ditulis-ulang',
      dampak: 'Lobi dan area bersama dibenahi untuk menyambut tamu.',
      alasan: 'Kesan tamu dipegang tamu',
    },
  ],
  [
    'HOS-09',
    {
      keputusan: 'ditulis-ulang',
      dampak:
        'Unit dibenahi segera setelah penyewa pergi, sebelum penyewa berikutnya masuk.',
      alasan: '“Kembali layak” tertangkap kata',
    },
  ],

  // Perawatan berkala.
  [
    'FNB-10',
    {
      keputusan: 'ditulis-ulang',
      dampak:
        'Kerusakan kecil di outlet ditangani berkala, sebelum menjadi besar.',
      alasan: 'Penjualan bergantung pada pembeli',
    },
  ],
  [
    'RWT-08',
    { keputusan: 'rumusan-aman', syarat: ELECTRICIAN, alasan: 'Aturan 11' },
  ],

  // Lewat mitra berizin; bab modal kerja ditulis sebagai penjembatanan.
  [
    'MOD-02',
    {
      keputusan: 'rumusan-aman',
      syarat: 'Jaminan diterbitkan dan diputuskan mitra penjamin berizin.',
      alasan: 'Aturan 7',
    },
  ],
  [
    'MOD-03',
    { keputusan: 'rumusan-aman', syarat: NO_LOAN, alasan: 'Aturan 7' },
  ],
  [
    'MOD-04',
    {
      keputusan: 'rumusan-aman',
      dampak:
        'Tagihan termin yang belum cair diajukan ke mitra pembiayaan untuk dibiayai lebih dulu.',
      syarat: NO_LOAN,
      alasan: 'Aturan 7; kecepatan dana dipegang mitra',
    },
  ],
  [
    'MOD-05',
    { keputusan: 'rumusan-aman', syarat: JOINT_OPERATION, alasan: 'Aturan 8' },
  ],
  [
    'MOD-07',
    {
      keputusan: 'rumusan-aman',
      dampak:
        'Risiko kerusakan dan kecelakaan proyek dialihkan ke asuransi lewat mitra.',
      syarat: INSURANCE_AGENT,
      alasan: 'Aturan 7',
    },
  ],
  [
    'MOD-08',
    {
      keputusan: 'rumusan-aman',
      dampak:
        'Alat dan kendaraan kerja dibiayai lewat mitra, sehingga kas proyek tidak tertahan.',
      syarat: NO_LOAN,
      alasan: 'Aturan 7',
    },
  ],
  [
    'KOM-01',
    { keputusan: 'rumusan-aman', syarat: NO_LOAN, alasan: 'Aturan 7' },
  ],
  [
    'KOM-02',
    {
      keputusan: 'rumusan-aman',
      dampak:
        'Bangunan dan isinya diasuransikan untuk risiko yang tertulis di polis.',
      syarat: INSURANCE_AGENT,
      alasan: 'Aturan 7; perlindungan dibatasi polis',
    },
  ],
  [
    'KOM-03',
    {
      keputusan: 'rumusan-aman',
      syarat: 'Penjualan dan sewa dijalankan perantara properti berizin.',
      alasan: 'Aturan main gabungan 5',
    },
  ],
  [
    'KOM-06',
    { keputusan: 'rumusan-aman', syarat: NO_LOAN, alasan: 'Aturan 7' },
  ],
  // Caught in step 4 by the wider result-word search.
  [
    'ADM-10',
    {
      keputusan: 'ditulis-ulang',
      dampak: 'Data perusahaan di sistem pengadaan diperbarui berkala.',
      alasan: '“Selalu mutakhir” tidak bisa dijanjikan',
    },
  ],
])

const NOT_REGISTERED =
  'Nilainya adalah status mitra resmi platform; tidak bisa dirumuskan aman sebelum Peekabo terdaftar (Aturan isi 7, rumusan aman 4)'
const WRITTEN_WORK = 'Bentuk hubungan kerja disepakati tertulis sebelum mulai.'
const SKILL_NOT_LOTTERY =
  'Lomba berbasis kemampuan, bukan undian; izin keramaian dan lokasi diurus sebelum acara.'
const COMMISSION_CARD =
  'Besaran bagian Anda tertulis di kartu komisi sebelum Anda mulai merujuk.'
const PLATFORM_AFFILIATE =
  'Mengikuti syarat afiliasi platform; komisi dihitung dari pembelian yang selesai.'
const CLASS_SEPARATE =
  'Kelas dijual terpisah dan tidak menjadi syarat atau biaya masuk jaringan.'

/**
 * Peekabo, models 10 to 16. Rules cited are Peekabo's Peta & aturan main,
 * rules 1 to 16. Offers whose value is an official platform partner status
 * are held until Peekabo is registered. Waits for approval.
 */
export const PEEKABO_OVERRIDES = new Map<string, CatalogOverride>([
  // Automatic rows with a style problem.
  [
    'PRD-05',
    {
      keputusan: 'ditulis-ulang',
      dampak: 'Obrolan dan siaran Anda tampil rapi dengan beberapa kamera.',
      alasan: '“Profesional” ada di daftar frasa yang tidak dipakai',
    },
  ],
  [
    'LIV-02',
    {
      keputusan: 'tetap',
      judul: 'Paket live bulanan 2, 4, atau 8 jam',
      alasan: 'Judul kartu paling banyak 8 kata',
    },
  ],
  [
    'EKO-04',
    {
      keputusan: 'tetap',
      judul: 'Hitung ulang margin setiap biaya platform berubah',
      alasan: 'Judul kartu paling banyak 8 kata',
    },
  ],

  // Sisi A: kelola, kampanye, aset, arah.
  [
    '1A-09',
    {
      keputusan: 'tetap',
      alasan:
        'Menelusuri sampai penjualan adalah proses; contoh yang boleh di Aturan isi',
    },
  ],
  [
    'MKT-07',
    {
      keputusan: 'ditulis-ulang',
      dampak:
        'Pelanggan lama yang setuju menerima pesan dihubungi lagi lewat WhatsApp dan email pada waktunya.',
      alasan: 'Pembelian ulang dipegang pelanggan; aturan 10',
    },
  ],
  [
    'LIV-04',
    {
      keputusan: 'tetap',
      alasan: 'Skema bayar dari penjualan selama live adalah cara bayar',
    },
  ],
  [
    '2B-03',
    {
      keputusan: 'ditulis-ulang',
      dampak: 'Warga sekitar diundang lebih dulu, sebelum gerai baru dibuka.',
      alasan: '“Ramai sejak hari pertama” dipegang warga',
    },
  ],
  [
    '3A-10',
    {
      keputusan: 'rumusan-aman',
      syarat: PLATFORM_AFFILIATE,
      alasan: 'Aturan 2',
    },
  ],
  [
    'MKT-10',
    {
      keputusan: 'rumusan-aman',
      syarat: 'Prospek dihubungi hanya bila memberi izin.',
      alasan: 'Aturan 10',
    },
  ],
  [
    '1B-10',
    {
      keputusan: 'ditulis-ulang',
      dampak:
        'Beberapa versi iklan diuji berdampingan, dan versi yang unggul di hasil uji dipakai lebih lama.',
      alasan: '“Menang” tertangkap kata',
    },
  ],
  [
    '2A-04',
    {
      keputusan: 'rumusan-aman',
      dampak:
        'Aturan, rute, pos, dan hadiah dirancang jelas, supaya warga mudah ikut.',
      syarat: SKILL_NOT_LOTTERY,
      alasan: 'Aturan 9; kemauan warga dipegang warga',
    },
  ],
  [
    'SOL-01',
    {
      keputusan: 'ditulis-ulang',
      dampak:
        'Daftar isu yang sedang dibicarakan, dan sudut yang aman dipakai brand Anda.',
      alasan: '“Naik” tertangkap kata',
    },
  ],
  [
    'SOL-06',
    {
      keputusan: 'rumusan-aman',
      syarat:
        'Nama diperiksa ketersediaannya sebagai merek sebelum diserahkan.',
      alasan: 'Aturan 13',
    },
  ],
  [
    'SOL-08',
    {
      keputusan: 'ditulis-ulang',
      dampak:
        'Konsep acara berseri bermerek, dengan format yang bisa diulang setiap episode.',
      alasan: 'Audiens kembali dipegang audiens',
    },
  ],
  [
    '2A-07',
    {
      keputusan: 'rumusan-aman',
      dampak:
        'Perlengkapan, izin lokasi, dan alur peserta diurus oleh tim kami.',
      syarat: 'Izin keramaian dan keselamatan peserta dipenuhi sebelum acara.',
      alasan: 'Aturan 9',
    },
  ],
  [
    '2B-01',
    {
      keputusan: 'rumusan-aman',
      judul: 'Event hunting kota',
      syarat: SKILL_NOT_LOTTERY,
      alasan: 'Aturan 9; “(contoh Subang)” catatan katalog',
    },
  ],
  [
    '2B-08',
    {
      keputusan: 'rumusan-aman',
      syarat:
        'Data peserta dibagikan ke sponsor hanya dengan persetujuan peserta.',
      alasan: 'Aturan 10',
    },
  ],

  // Sisi A: orang dan live.
  [
    '3A-01',
    {
      keputusan: 'rumusan-aman',
      alasan:
        'Aturan 3; nama program tidak disebut, pengelolaan kreator tidak bergantung pada status mitra',
    },
  ],
  [
    '3A-05',
    {
      keputusan: 'rumusan-aman',
      syarat: 'Siaran mengikuti aturan live setiap platform.',
      alasan: 'Aturan 3; nama program tidak disebut',
    },
  ],
  [
    '3A-04',
    { keputusan: 'rumusan-aman', syarat: WRITTEN_WORK, alasan: 'Aturan 8' },
  ],
  [
    '2A-02',
    { keputusan: 'rumusan-aman', syarat: WRITTEN_WORK, alasan: 'Aturan 8' },
  ],
  [
    '3A-03',
    {
      keputusan: 'rumusan-aman',
      syarat: WRITTEN_WORK,
      alasan: 'Aturan 8; bayaran tetap dan bonus adalah cara bayar',
    },
  ],

  // Sisi A: afiliasi dan program platform.
  ['LIV-07', { keputusan: 'ditahan', alasan: NOT_REGISTERED }],
  ['3B-06', { keputusan: 'ditahan', alasan: NOT_REGISTERED }],
  ['EKO-01', { keputusan: 'ditahan', alasan: NOT_REGISTERED }],
  ['EKO-02', { keputusan: 'ditahan', alasan: NOT_REGISTERED }],
  ['EKO-03', { keputusan: 'ditahan', alasan: NOT_REGISTERED }],
  [
    '3C-09',
    {
      keputusan: 'rumusan-aman',
      dampak:
        'Anggota komunitas membuat konten untuk brand, dan karya yang terpilih dibayar.',
      syarat:
        'Tantangan berbasis kemampuan dengan kriteria tertulis, bukan undian.',
      alasan: 'Aturan 2 dan 9',
    },
  ],
  [
    'EKO-06',
    {
      keputusan: 'rumusan-aman',
      dampak:
        'Pembeli klien yang butuh cicilan atau proteksi dirujuk ke mitra resmi.',
      syarat:
        'Pembiayaan oleh perusahaan pembiayaan berizin; asuransi dijual agen berlisensi.',
      alasan: 'Aturan 5 dan 6',
    },
  ],

  // Sisi B: ikut menjualkan. Kalimat wajib jaringan ada di halaman jalurnya.
  [
    '3B-03',
    {
      keputusan: 'rumusan-aman',
      syarat:
        'Komisi dari penjualan Anda sendiri, tanpa biaya masuk dan tanpa bonus rekrutmen.',
      alasan: 'Aturan 1 dan 2',
    },
  ],
  [
    '3B-07',
    {
      keputusan: 'tetap',
      alasan: '“Komisi cair” adalah status yang ditampilkan',
    },
  ],
  [
    'OCS-01',
    {
      keputusan: 'rumusan-aman',
      syarat: COMMISSION_CARD,
      alasan: 'Aturan 4; dampak sudah menyebut perantara berizin',
    },
  ],
  [
    'OCS-03',
    { keputusan: 'rumusan-aman', syarat: COMMISSION_CARD, alasan: 'Aturan 5' },
  ],
  [
    'OCS-04',
    {
      keputusan: 'rumusan-aman',
      syarat: 'Polis dijual agen berlisensi; Anda merujuk, bukan menjual.',
      alasan: 'Aturan 6',
    },
  ],
  [
    'OCS-09',
    { keputusan: 'rumusan-aman', syarat: CLASS_SEPARATE, alasan: 'Aturan 14' },
  ],
  [
    '3A-09',
    { keputusan: 'rumusan-aman', syarat: CLASS_SEPARATE, alasan: 'Aturan 14' },
  ],
  [
    '3C-04',
    {
      keputusan: 'rumusan-aman',
      syarat: 'Pembelian kolektif mengikuti aturan perlindungan konsumen.',
      alasan: 'Aturan 15',
    },
  ],
  [
    '3B-08',
    {
      keputusan: 'rumusan-aman',
      syarat: PLATFORM_AFFILIATE,
      alasan: 'Aturan 2',
    },
  ],
  ['KRE-01', { keputusan: 'ditahan', alasan: NOT_REGISTERED }],
  ['KRE-02', { keputusan: 'ditahan', alasan: NOT_REGISTERED }],
  [
    'KRE-03',
    {
      keputusan: 'rumusan-aman',
      syarat:
        'Bentuk kerja disepakati tertulis, dan honor dipotong pajak sesuai aturan.',
      alasan: 'Aturan 7 dan 8',
    },
  ],
  // Caught in step 4 by the wider result-word search.
  [
    'SOL-07',
    {
      keputusan: 'ditulis-ulang',
      dampak:
        'Tim konten bekerja dari pilar dan kerangka cerita yang sudah disusun.',
      alasan: '“Tidak lagi kehabisan ide” dipegang tim klien',
    },
  ],
])

/** Every handwritten answer the import reads. */
export const CATALOG_OVERRIDES = new Map<string, CatalogOverride>([
  ...TEKNOLOGI_OVERRIDES,
  ...KONSTRUKSI_OVERRIDES,
  ...PEEKABO_OVERRIDES,
])

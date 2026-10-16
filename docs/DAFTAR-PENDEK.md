# Daftar pendek offer

Usulan agen per bab, sesuai `docs/RENCANA-KONTEKS-V2.md` V2 dan Peta website, “Memilih offer yang tayang”: 3 sampai 7 offer, dipilih terhadap kutipan pembeli bab, satu per jenis sebelum yang kedua, offer lingkup terkecil sebagai pintu masuk, offer ‡ dan yang bergantung pada keputusan terbuka tidak diusulkan, offer † hanya dengan rumusan aman.

Dokumen ini internal: ID katalog dan tanda † boleh ada di sini dan tidak pernah tampil di situs. Isi kolom **Keputusan Anda**, atau balas per bab. Sesudah keputusan dan “ok tulis”, agen menyetel status di Sanity: `dipilih` atau `ditahan`. Dokumen ini dihasilkan oleh `lib/scripts/shortlist-report.ts`; usulan tersimpan di `lib/content/shortlist.ts`.

## Teknologi · Siap pakai

### Kuliner dan F&B

> “Pesanan saya bercampur di chat, kasir kewalahan saat ramai, dan bahan sering habis atau terbuang.”

**Keputusan:** Disetujui pemilik seperti diusulkan, 16 Oktober 2026.

7 dari 11 offer. Pintu masuk: **KUL-01**. Aturan: lolos.

| #   | ID                   | Judul untuk web                           | Dampak untuk web                                                                                       | Jenis                                  | †   | Alasan                                                       | Keputusan Anda |
| --- | -------------------- | ----------------------------------------- | ------------------------------------------------------------------------------------------------------ | -------------------------------------- | --- | ------------------------------------------------------------ | -------------- |
| 1   | KUL-01 (pintu masuk) | Bot pesan-antar WhatsApp                  | Bot mencatat dan menagih setiap pesanan WhatsApp, juga saat tidak ada admin yang berjaga.              | Bot yang bekerja sendiri               |     | “Pesanan saya bercampur di chat”                             | tayang         |
| 2   | KUL-02               | Pesan dan bayar dari meja                 | Tamu memesan dan membayar dari meja; pesanan langsung masuk ke dapur.                                  | Alur kerja yang berjalan tanpa dikejar |     | “kasir kewalahan saat ramai”                                 | tayang         |
| 3   | KUL-07               | Buka langganan makan harian               | Pekerja kantor dan penghuni kos bisa berlangganan makan harian, dengan tagihan yang terkirim otomatis. | Kanal pendapatan baru                  |     | Kanal pendapatan; halamannya sudah disetujui di R1           | tayang         |
| 4   | KUL-03               | Layar pesanan di dapur                    | Setiap pesanan tampil di layar dapur saat itu juga, berikut urutan dan waktu sajinya.                  | Angka yang memberi tahu lebih dulu     |     | Kasir dan dapur saat ramai; halamannya sudah disetujui di R1 | tayang         |
| 5   | KUL-08               | Bot stok bahan dan pesan ulang ke pemasok | Stok bahan tercatat, dan pesanan ke pemasok terkirim sendiri saat bahan menipis.                       | Bot yang bekerja sendiri               |     | “bahan sering habis atau terbuang”                           | tayang         |
| 6   | KUL-05               | Workflow pesanan, produksi, dan antar     | Pesanan acara berubah sendiri menjadi daftar belanja, jadwal masak, dan jadwal antar                   | Alur kerja yang berjalan tanpa dikejar |     | Katering: pesanan acara menjadi jadwal masak dan antar       | tayang         |
| 7   | KUL-06               | Buka toko makanan beku ke luar kota       | Toko makanan beku untuk pembeli luar kota, dengan ongkir, resi, dan pelacakan yang berjalan sendiri.   | Kanal pendapatan baru                  |     | Produsen makanan: pasar di luar kota                         | tayang         |

<details><summary>Tidak diusulkan</summary>

| ID     | Judul                                           | Alasan                                                          |
| ------ | ----------------------------------------------- | --------------------------------------------------------------- |
| KUL-04 | Bot reservasi dengan uang muka                  | Tidak dipilih: jenis Bot sudah diwakili tiga kali               |
| KUL-09 | Bot ulasan setelah kunjungan                    | Tidak dipilih: tidak menjawab kutipan bab                       |
| KUL-10 | Buka jaringan waralaba dengan aplikasi bermerek | Tidak dipilih: untuk franchise, bukan pembeli utama bab         |
| KUL-11 | Dasbor penjualan per jam                        | Tidak dipilih: Layar pesanan di dapur sudah mewakili jenis Data |

</details>

Catatan: Bab ini sudah tayang dengan 11 offer. Keempat offer yang tidak dipilih perlu dicabut dari tayang (unpublish) di Studio; itu tindakan terbit, jadi menunggu izin Anda tersendiri.

### Ritel, fesyen, dan e-commerce

> “Saya bergantung pada marketplace, stok saya tidak sinkron, dan pelanggan datang sekali lalu hilang.”

6 dari 11 offer. Pintu masuk: **RIT-01**. Aturan: lolos.

| #   | ID                   | Judul untuk web                      | Dampak untuk web                                                                                | Jenis                                  | †   | Alasan                                                     | Keputusan Anda |
| --- | -------------------- | ------------------------------------ | ----------------------------------------------------------------------------------------------- | -------------------------------------- | --- | ---------------------------------------------------------- | -------------- |
| 1   | RIT-01 (pintu masuk) | Bot sinkron stok lintas marketplace  | Stok di semua kanal berasal dari satu sumber, sehingga barang yang habis tidak tampil tersedia. | Bot yang bekerja sendiri               |     | “stok saya tidak sinkron”                                  | tayang / tahan |
| 2   | RIT-08               | Kasir terhubung toko online          | Penjualan toko dan online tercatat di satu tempat dan stok saling menyesuaikan                  | Alur kerja yang berjalan tanpa dikejar |     | Toko fisik dan online tercatat di satu tempat              | tayang / tahan |
| 3   | RIT-03               | Buka toko brand sendiri              | Toko online milik brand sendiri, dengan data pembeli yang menjadi milik brand.                  | Kanal pendapatan baru                  |     | “Saya bergantung pada marketplace”: toko brand sendiri     | tayang / tahan |
| 4   | RIT-10               | Rekomendasi produk dari pola belanja | Pembeli melihat produk yang sering dibeli bersama, dari pola belanja di toko Anda.              | Angka yang memberi tahu lebih dulu     |     | Produk yang sering dibeli bersama                          | tayang / tahan |
| 5   | RIT-09               | Buka program membership dan poin     | Program poin dan hadiah berjalan untuk pelanggan Anda, dan data belanjanya terkumpul.           | Kanal pendapatan baru                  |     | “pelanggan datang sekali lalu hilang”: poin dan membership | tayang / tahan |
| 6   | RIT-02               | Bot balas chat dan tutup penjualan   | Pertanyaan harga, stok, dan ongkir dijawab seketika dan pesanan ditutup di dalam percakapan     | Bot yang bekerja sendiri               |     | Pertanyaan harga dan ongkir dijawab seketika               | tayang / tahan |

<details><summary>Tidak diusulkan</summary>

| ID     | Judul                                      | Alasan                                                                       |
| ------ | ------------------------------------------ | ---------------------------------------------------------------------------- |
| RIT-04 | Workflow retur dan pengembalian dana       | Tidak dipilih: jenisnya sudah diwakili offer yang lebih dekat ke kutipan bab |
| RIT-05 | Bot pantau harga pesaing                   | Tidak dipilih: jenisnya sudah diwakili offer yang lebih dekat ke kutipan bab |
| RIT-06 | Buka jaringan reseller dan dropshipper     | Tidak dipilih: jenisnya sudah diwakili offer yang lebih dekat ke kutipan bab |
| RIT-07 | Workflow pre-order sampai produksi         | Tidak dipilih: jenisnya sudah diwakili offer yang lebih dekat ke kutipan bab |
| RIT-11 | Buka layanan multi-kurir untuk seller lain | Tidak dipilih: jenisnya sudah diwakili offer yang lebih dekat ke kutipan bab |

</details>

### Distributor, grosir, dan toko bangunan

> “Pesanan sales masuk lewat chat, stok selisih, piutang telat, dan harga pemasok naik tanpa kabar.”

6 dari 11 offer. Pintu masuk: **DIS-01**. Aturan: lolos.

| #   | ID                   | Judul untuk web                                | Dampak untuk web                                                                 | Jenis                                  | †                                      | Alasan                                                                              | Keputusan Anda |
| --- | -------------------- | ---------------------------------------------- | -------------------------------------------------------------------------------- | -------------------------------------- | -------------------------------------- | ----------------------------------------------------------------------------------- | -------------- |
| 1   | DIS-01 (pintu masuk) | Bot pesanan sales lapangan                     | Pesanan sales masuk langsung ke gudang tanpa lewat chat dan tanpa salah ketik    | Bot yang bekerja sendiri               |                                        | “Pesanan sales masuk lewat chat”                                                    | tayang / tahan |
| 2   | DIS-09               | Stok opname dengan barcode                     | Stok fisik dan catatan dicocokkan berkala, dan selisihnya tercatat.              | Alur kerja yang berjalan tanpa dikejar |                                        | “stok selisih”: opname dengan barcode                                               | tayang / tahan |
| 3   | DIS-05               | Buka portal pemesanan grosir                   | Pembeli grosir memesan sendiri dengan harga sesuai levelnya, tanpa telepon       | Kanal pendapatan baru                  |                                        | Pembeli grosir memesan sendiri sesuai levelnya                                      | tayang / tahan |
| 4   | DIS-10               | Dasbor sales dan stok yang diperbarui seketika | Penjualan per sales dan stok yang menipis terlihat seketika                      | Angka yang memberi tahu lebih dulu     |                                        | Penjualan per sales dan stok menipis terlihat                                       | tayang / tahan |
| 5   | DIS-04               | Bot penagihan piutang                          | Piutang jatuh tempo diingatkan bertahap lewat WhatsApp sehingga kas lebih lancar | Bot yang bekerja sendiri               |                                        | “piutang telat”: pengingat bertahap lewat WhatsApp                                  | tayang / tahan |
| 6   | DIS-08               | Bot pantau harga pemasok                       | Kenaikan harga pemasok di sumber publik terdeteksi dan dilaporkan lebih dulu.    | Bot yang bekerja sendiri               | Harga jual tetap Anda yang menentukan. | “harga pemasok naik tanpa kabar”: bertanda †, harga jual tetap Anda yang menentukan | tayang / tahan |

<details><summary>Tidak diusulkan</summary>

| ID     | Judul                                      | Alasan                                                                       |
| ------ | ------------------------------------------ | ---------------------------------------------------------------------------- |
| DIS-02 | Bot cek stok dan harga lewat WhatsApp      | Tidak dipilih: jenisnya sudah diwakili offer yang lebih dekat ke kutipan bab |
| DIS-03 | Workflow pesanan, gudang, kirim, dan tagih | Tidak dipilih: jenisnya sudah diwakili offer yang lebih dekat ke kutipan bab |
| DIS-06 | Buka marketplace material regional         | Tidak dipilih: jenisnya sudah diwakili offer yang lebih dekat ke kutipan bab |
| DIS-07 | Optimasi rute kirim harian                 | Tidak dipilih: jenisnya sudah diwakili offer yang lebih dekat ke kutipan bab |
| DIS-11 | Buka toko online B2B                       | Tidak dipilih: jenisnya sudah diwakili offer yang lebih dekat ke kutipan bab |

</details>

Catatan: Dampak DIS-04 di katalog (“kas lebih lancar”) ditulis ulang di halaman sebagai pekerjaannya: pengingat piutang terkirim bertahap.

### Jasa lokal: salon, bengkel, laundry, kos, dan rental

> “Jadwal bentrok, pelanggan lupa datang, tagihan kos menunggak, dan mesin harus dijaga terus.”

6 dari 10 offer. Pintu masuk: **JAS-01**. Aturan: lolos.

| #   | ID                   | Judul untuk web                                     | Dampak untuk web                                                                  | Jenis                                  | †   | Alasan                                               | Keputusan Anda |
| --- | -------------------- | --------------------------------------------------- | --------------------------------------------------------------------------------- | -------------------------------------- | --- | ---------------------------------------------------- | -------------- |
| 1   | JAS-01 (pintu masuk) | Bot booking dan pengingat                           | Pelanggan memesan jadwal lewat bot dan menerima pengingat sebelum datang.         | Bot yang bekerja sendiri               |     | “Jadwal bentrok, pelanggan lupa datang”              | tayang / tahan |
| 2   | JAS-06               | Workflow tagihan kos bulanan                        | Tagihan, pengingat, dan bukti bayar berjalan sendiri dan tunggakan terlihat jelas | Alur kerja yang berjalan tanpa dikejar |     | “tagihan kos menunggak”                              | tayang / tahan |
| 3   | JAS-04               | Buka mesin laundry koin dengan QRIS                 | Mesin laundry koin menyala setelah pembayaran QRIS, tanpa penjaga.                | Kanal pendapatan baru                  |     | “mesin harus dijaga terus”: laundry koin dengan QRIS | tayang / tahan |
| 4   | JAS-10               | Dasbor mesin dan pendapatan per unit                | Status dan pendapatan tiap mesin terlihat seketika                                | Angka yang memberi tahu lebih dulu     |     | Status dan pendapatan tiap mesin                     | tayang / tahan |
| 5   | JAS-02               | Workflow estimasi, persetujuan, pengerjaan, selesai | Pelanggan menyetujui biaya lewat ponsel dan mendapat kabar di tiap tahap          | Alur kerja yang berjalan tanpa dikejar |     | Bengkel: biaya disetujui lewat ponsel                | tayang / tahan |
| 6   | JAS-03               | Bot pengingat servis berkala                        | Pelanggan menerima pengingat saat servis berkalanya jatuh tempo.                  | Bot yang bekerja sendiri               |     | Pengingat servis berkala                             | tayang / tahan |

<details><summary>Tidak diusulkan</summary>

| ID     | Judul                             | Alasan                                                                       |
| ------ | --------------------------------- | ---------------------------------------------------------------------------- |
| JAS-05 | Buka rental dan photobox otomatis | Tidak dipilih: jenisnya sudah diwakili offer yang lebih dekat ke kutipan bab |
| JAS-07 | Akses pintu berbasis kode         | Tidak dipilih: jenisnya sudah diwakili offer yang lebih dekat ke kutipan bab |
| JAS-08 | Buka paket langganan bulanan      | Tidak dipilih: jenisnya sudah diwakili offer yang lebih dekat ke kutipan bab |
| JAS-09 | Bot status cucian                 | Tidak dipilih: jenisnya sudah diwakili offer yang lebih dekat ke kutipan bab |

</details>

### Klinik dan kesehatan

> “Telepon janji temu menumpuk, data pasien diketik berulang, dan pasien lupa kontrol.”

6 dari 11 offer. Pintu masuk: **KES-01**. Aturan: lolos.

| #   | ID                   | Judul untuk web                                   | Dampak untuk web                                                        | Jenis                                  | †                                                                           | Alasan                                                            | Keputusan Anda |
| --- | -------------------- | ------------------------------------------------- | ----------------------------------------------------------------------- | -------------------------------------- | --------------------------------------------------------------------------- | ----------------------------------------------------------------- | -------------- |
| 1   | KES-01 (pintu masuk) | Bot janji temu                                    | Pasien membuat janji sendiri lewat bot, tanpa menunggu telepon dijawab. | Bot yang bekerja sendiri               | Data pasien dijaga sebagai data pribadi yang sensitif, sesuai UU PDP.       | “Telepon janji temu menumpuk”: bertanda †, data pasien dijaga     | tayang / tahan |
| 2   | KES-04               | Workflow pendaftaran, pemeriksaan, dan pembayaran | Data pasien tidak diketik ulang di setiap meja                          | Alur kerja yang berjalan tanpa dikejar | Data pasien dijaga sebagai data pribadi yang sensitif, sesuai UU PDP.       | “data pasien diketik berulang”: bertanda †                        | tayang / tahan |
| 3   | KES-08               | Buka membership perawatan                         | Paket perawatan berlangganan dengan pengingat sesi                      | Kanal pendapatan baru                  |                                                                             | Paket perawatan berlangganan                                      | tayang / tahan |
| 4   | KES-03               | Antrean pasien yang terlihat langsung             | Pasien tahu giliran dari ponsel dan ruang tunggu lebih tenang           | Angka yang memberi tahu lebih dulu     |                                                                             | Pasien tahu gilirannya dari ponsel                                | tayang / tahan |
| 5   | KES-02               | Bot pengingat kontrol dan obat                    | Pasien menerima pengingat jadwal kontrol dan obat.                      | Bot yang bekerja sendiri               | Pengingat hanya untuk pasien yang setuju; data pasien dijaga sesuai UU PDP. | “pasien lupa kontrol”: bertanda †, hanya untuk pasien yang setuju | tayang / tahan |
| 6   | KES-06               | Bot stok dan kedaluwarsa obat                     | Obat menipis atau mendekati kedaluwarsa diperingatkan dan dipesan ulang | Bot yang bekerja sendiri               |                                                                             | Apotek: obat menipis dan kedaluwarsa                              | tayang / tahan |

<details><summary>Tidak diusulkan</summary>

| ID     | Judul                                 | Alasan                                                                                          |
| ------ | ------------------------------------- | ----------------------------------------------------------------------------------------------- |
| KES-05 | Sambungan SATUSEHAT                   | Tidak dipilih: jenisnya sudah diwakili offer yang lebih dekat ke kutipan bab                    |
| KES-07 | Buka konsultasi dan pesan obat online | Tidak dipilih: layanan medis online bergantung pada izin fasilitas; lebih aman lewat percakapan |
| KES-09 | Bot tanya jawab layanan               | Tidak dipilih: jenisnya sudah diwakili offer yang lebih dekat ke kutipan bab                    |
| KES-10 | Workflow pengiriman hasil ke pasien   | Tidak dipilih: jenisnya sudah diwakili offer yang lebih dekat ke kutipan bab                    |
| KES-11 | Pelaporan berkala ke instansi         | Tidak dipilih: jenisnya sudah diwakili offer yang lebih dekat ke kutipan bab                    |

</details>

### Pendidikan dan pelatihan

> “SPP menunggak, pendaftaran masih kertas, dan pendapatan hanya dari kelas tatap muka.”

6 dari 11 offer. Pintu masuk: **EDU-01**. Aturan: lolos.

| #   | ID                   | Judul untuk web                       | Dampak untuk web                                                       | Jenis                                  | †   | Alasan                                                              | Keputusan Anda |
| --- | -------------------- | ------------------------------------- | ---------------------------------------------------------------------- | -------------------------------------- | --- | ------------------------------------------------------------------- | -------------- |
| 1   | EDU-01 (pintu masuk) | Bot pengingat SPP dan tagihan         | Orang tua menerima tagihan dan kode bayar SPP tanpa datang ke sekolah. | Bot yang bekerja sendiri               |     | “SPP menunggak”                                                     | tayang / tahan |
| 2   | EDU-02               | Workflow pendaftaran siswa baru       | Formulir, berkas, pembayaran, dan pengumuman berjalan online           | Alur kerja yang berjalan tanpa dikejar |     | “pendaftaran masih kertas”                                          | tayang / tahan |
| 3   | EDU-03               | Buka kelas berlangganan online        | Kelas online berlangganan dibuka di samping kelas tatap muka.          | Kanal pendapatan baru                  |     | “pendapatan hanya dari kelas tatap muka”: kelas berlangganan online | tayang / tahan |
| 4   | EDU-06               | Portal orang tua: kehadiran dan nilai | Orang tua melihat kehadiran dan nilai anak seketika lewat portal.      | Angka yang memberi tahu lebih dulu     |     | Kehadiran dan nilai untuk orang tua                                 | tayang / tahan |
| 5   | EDU-09               | Otomasi rekap nilai dan rapor         | Rapor tersusun dari nilai harian tanpa disalin ulang                   | Alur kerja yang berjalan tanpa dikejar |     | Rapor dari nilai harian                                             | tayang / tahan |
| 6   | EDU-05               | Buka toko bank soal dan modul digital | Modul dijual berulang tanpa stok                                       | Kanal pendapatan baru                  |     | Modul digital dijual berulang                                       | tayang / tahan |

<details><summary>Tidak diusulkan</summary>

| ID     | Judul                                | Alasan                                                                       |
| ------ | ------------------------------------ | ---------------------------------------------------------------------------- |
| EDU-04 | Ujian berbasis komputer              | Tidak dipilih: jenisnya sudah diwakili offer yang lebih dekat ke kutipan bab |
| EDU-07 | Sinkron Dapodik                      | Tidak dipilih: jenisnya sudah diwakili offer yang lebih dekat ke kutipan bab |
| EDU-08 | Bot tanya jawab jadwal dan materi    | Tidak dipilih: jenisnya sudah diwakili offer yang lebih dekat ke kutipan bab |
| EDU-10 | Rekomendasi belajar dari graf materi | Tidak dipilih: jenisnya sudah diwakili offer yang lebih dekat ke kutipan bab |
| EDU-11 | Buka marketplace guru privat lokal   | Tidak dipilih: jenisnya sudah diwakili offer yang lebih dekat ke kutipan bab |

</details>

### Properti, dealer, dan showroom

> “Prospek tercecer, pengajuan leasing tidak terpantau, dan pelanggan lama tak pernah dihubungi lagi.”

6 dari 11 offer. Pintu masuk: **PRO-01**. Aturan: lolos.

| #   | ID                   | Judul untuk web                             | Dampak untuk web                                                                                               | Jenis                                  | †                                                               | Alasan                                                                                       | Keputusan Anda |
| --- | -------------------- | ------------------------------------------- | -------------------------------------------------------------------------------------------------------------- | -------------------------------------- | --------------------------------------------------------------- | -------------------------------------------------------------------------------------------- | -------------- |
| 1   | PRO-01 (pintu masuk) | Bot penjawab calon pembeli 24 jam           | Pertanyaan unit dijawab seketika dan survei langsung terjadwal                                                 | Bot yang bekerja sendiri               |                                                                 | “Prospek tercecer”: dijawab seketika dan survei terjadwal                                    | tayang / tahan |
| 2   | PRO-02               | Workflow prospek, survei, booking, KPR      | Prospek tidak terlewat dan berkas KPR terkumpul bertahap                                                       | Alur kerja yang berjalan tanpa dikejar |                                                                 | Prospek sampai berkas KPR                                                                    | tayang / tahan |
| 3   | PRO-10               | Dasbor funnel penjualan                     | Tahap prospek dan penyebab gagal terlihat                                                                      | Angka yang memberi tahu lebih dulu     |                                                                 | Tahap prospek dan penyebab gagal terlihat                                                    | tayang / tahan |
| 4   | PRO-06               | Kalkulator cicilan dan pengajuan ke leasing | Calon pembeli menghitung cicilan dan mengajukan ke leasing dari situs, dengan status pengajuan yang terpantau. | Alur kerja yang berjalan tanpa dikejar | Persetujuan pembiayaan di tangan perusahaan pembiayaan berizin. | “pengajuan leasing tidak terpantau”: bertanda †, persetujuan di tangan perusahaan pembiayaan | tayang / tahan |
| 5   | PRO-07               | Bot pengingat servis, pajak, dan asuransi   | Pelanggan lama menerima pengingat servis, pajak, dan asuransi kendaraannya.                                    | Bot yang bekerja sendiri               |                                                                 | “pelanggan lama tak pernah dihubungi lagi”                                                   | tayang / tahan |
| 6   | PRO-05               | Bot penawaran dan jadwal test drive         | Calon pembeli mendapat penawaran dan jadwal tanpa menunggu sales                                               | Bot yang bekerja sendiri               |                                                                 | Dealer: penawaran dan jadwal test drive                                                      | tayang / tahan |

<details><summary>Tidak diusulkan</summary>

| ID     | Judul                                           | Alasan                                                                       |
| ------ | ----------------------------------------------- | ---------------------------------------------------------------------------- |
| PRO-03 | Etalase unit yang diperbarui langsung           | Tidak dipilih: jenisnya sudah diwakili offer yang lebih dekat ke kutipan bab |
| PRO-04 | Laporan progres untuk pencairan KPR             | Tidak dipilih: jenisnya sudah diwakili offer yang lebih dekat ke kutipan bab |
| PRO-08 | Pembagi lead ke sales                           | Tidak dipilih: jenisnya sudah diwakili offer yang lebih dekat ke kutipan bab |
| PRO-09 | Buka marketplace properti dan kendaraan lokal   | Tidak dipilih: jenisnya tidak menjawab kutipan bab ini                       |
| PRO-11 | Pencatat komisi properti, leasing, dan asuransi | Tidak dipilih: jenisnya sudah diwakili offer yang lebih dekat ke kutipan bab |

</details>

### Keuangan, trading, dan pembiayaan

> “Eksekusi strategi saya tidak konsisten, angsuran dikejar manual, dan berkas menumpuk.”

6 dari 13 offer. Pintu masuk: **KEU-09**. Aturan: lolos.

| #   | ID                   | Judul untuk web                                     | Dampak untuk web                                                                                      | Jenis                                  | †                                                                | Alasan                                                                      | Keputusan Anda |
| --- | -------------------- | --------------------------------------------------- | ----------------------------------------------------------------------------------------------------- | -------------------------------------- | ---------------------------------------------------------------- | --------------------------------------------------------------------------- | -------------- |
| 1   | KEU-09 (pintu masuk) | Bot angsuran dan iuran                              | Angsuran dan iuran ditagih dan dicocokkan otomatis                                                    | Bot yang bekerja sendiri               |                                                                  | “angsuran dikejar manual”                                                   | tayang / tahan |
| 2   | KEU-08               | Workflow pengajuan, survei, pencairan, dan angsuran | Pinjaman anggota berjalan tertib dan tunggakan diingatkan                                             | Alur kerja yang berjalan tanpa dikejar |                                                                  | Koperasi: pengajuan sampai angsuran tertib                                  | tayang / tahan |
| 3   | KEU-12               | Buka lini pulsa, token listrik, dan tagihan         | Lini pulsa, token listrik, dan tagihan dibuka dari supplier, dengan selisih harga yang Anda tetapkan. | Kanal pendapatan baru                  | Produk yang boleh dijual mengikuti kontrak dengan supplier.      | Konter dan agen: lini pulsa, token, dan tagihan; bertanda †                 | tayang / tahan |
| 4   | KEU-13               | Deteksi pola transaksi janggal dari graf            | Jaringan akun dan transaksi yang mencurigakan terlihat lebih dini                                     | Angka yang memberi tahu lebih dulu     |                                                                  | Pola transaksi janggal terlihat lebih dini                                  | tayang / tahan |
| 5   | KEU-10               | Workflow verifikasi berkas dan skoring sederhana    | Berkas pemohon diverifikasi, dan setiap keputusan tercatat.                                           | Alur kerja yang berjalan tanpa dikejar | Keputusan pembiayaan tetap di tangan pemberi pembiayaan berizin. | “berkas menumpuk”: bertanda †, keputusan tetap di tangan pemberi pembiayaan | tayang / tahan |
| 6   | KEU-11               | Bot pengingat perpanjangan polis                    | Polis yang mendekati jatuh tempo diingatkan kepada agen untuk ditindaklanjuti.                        | Bot yang bekerja sendiri               | Penjualan asuransi tetap oleh agen berlisensi.                   | Agen asuransi: pengingat perpanjangan polis; bertanda †                     | tayang / tahan |

<details><summary>Tidak diusulkan</summary>

| ID     | Judul                                              | Alasan                                                                 |
| ------ | -------------------------------------------------- | ---------------------------------------------------------------------- |
| KEU-01 | Bot eksekusi strategi Anda                         | Menunggu keputusan posisi bot trading                                  |
| KEU-02 | Mesin backtest dan akun simulasi                   | Menunggu keputusan posisi bot trading                                  |
| KEU-03 | Bot manajemen risiko                               | Ikut keputusan posisi bot trading: isinya batas rugi dan ukuran posisi |
| KEU-04 | Peringatan harga dan berita                        | Ikut keputusan posisi bot trading: peringatan harga untuk trader       |
| KEU-05 | Jurnal trading otomatis                            | Menunggu keputusan posisi bot trading                                  |
| KEU-06 | Bot pembelian berkala dan penyeimbangan portofolio | Ditahan: bot investasi                                                 |
| KEU-07 | Buka kelas dan komunitas trading berlangganan      | Menunggu keputusan posisi bot trading                                  |

</details>

Catatan: Klausa pertama kutipan bab (“Eksekusi strategi saya tidak konsisten”) tidak dijawab di halaman sampai posisi bot trading diputuskan; saran master brief: hanya lewat percakapan.

### Konstruksi dan kontraktor

> “Tender terlewat, dokumen tidak siap, laporan lapangan lewat chat, harga material naik-turun, dan termin lambat cair.”

6 dari 13 offer. Pintu masuk: **KON-01**. Aturan: lolos.

| #   | ID                   | Judul untuk web                     | Dampak untuk web                                                                          | Jenis                                  | †                                                                            | Alasan                                                     | Keputusan Anda |
| --- | -------------------- | ----------------------------------- | ----------------------------------------------------------------------------------------- | -------------------------------------- | ---------------------------------------------------------------------------- | ---------------------------------------------------------- | -------------- |
| 1   | KON-01 (pintu masuk) | Bot pemantau tender regional        | Paket baru di Subang, Purwakarta, dan Bandung yang sesuai kualifikasi dikirim setiap hari | Bot yang bekerja sendiri               | Dari situs pengadaan publik; kami membantu menyiapkan, bukan mengatur hasil. | “Tender terlewat”: bertanda †, dari situs pengadaan publik | tayang / tahan |
| 2   | KON-02               | Workflow penyusunan penawaran       | Dokumen kualifikasi, teknis, dan harga tersusun dari data perusahaan                      | Alur kerja yang berjalan tanpa dikejar |                                                                              | “dokumen tidak siap”                                       | tayang / tahan |
| 3   | KON-06               | Dasbor arus kas dan kurva S terkini | Selisih rencana dan realisasi terlihat seketika                                           | Angka yang memberi tahu lebih dulu     |                                                                              | Selisih rencana dan realisasi terlihat                     | tayang / tahan |
| 4   | KON-04               | Laporan lapangan mode offline       | Progres, foto, dan absensi terkirim walau tanpa sinyal                                    | Alur kerja yang berjalan tanpa dikejar |                                                                              | “laporan lapangan lewat chat”: terkirim walau tanpa sinyal | tayang / tahan |
| 5   | KON-07               | Bot pantau harga material regional  | Perubahan harga material di tiga wilayah dikabarkan dan RAB diperbarui                    | Bot yang bekerja sendiri               |                                                                              | “harga material naik-turun”                                | tayang / tahan |
| 6   | KON-05               | Workflow penagihan termin           | Berkas termin terkumpul otomatis dari laporan lapangan                                    | Alur kerja yang berjalan tanpa dikejar |                                                                              | “termin lambat cair”: berkas termin dari laporan lapangan  | tayang / tahan |

<details><summary>Tidak diusulkan</summary>

| ID     | Judul                                             | Alasan                                                                       |
| ------ | ------------------------------------------------- | ---------------------------------------------------------------------------- |
| KON-03 | Pengingat masa berlaku SBU, SKK, NIB, dan jaminan | Tidak dipilih: jenisnya sudah diwakili offer yang lebih dekat ke kutipan bab |
| KON-08 | Buka marketplace tukang dan material regional     | Tidak dipilih: jenisnya tidak menjawab kutipan bab ini                       |
| KON-09 | Arsip proyek yang bisa dicari                     | Tidak dipilih: jenisnya sudah diwakili offer yang lebih dekat ke kutipan bab |
| KON-10 | Peta pemenang tender dan pesaing                  | Tidak dipilih: jenisnya sudah diwakili offer yang lebih dekat ke kutipan bab |
| KON-11 | Workflow serah terima unit dan perbaikan komplain | Tidak dipilih: jenisnya sudah diwakili offer yang lebih dekat ke kutipan bab |
| KON-12 | Workflow pengadaan barang                         | Tidak dipilih: jenisnya sudah diwakili offer yang lebih dekat ke kutipan bab |
| KON-13 | Absensi dan upah tukang lewat WhatsApp            | Tidak dipilih: jenisnya sudah diwakili offer yang lebih dekat ke kutipan bab |

</details>

Catatan: Bab ini berpasangan dengan Konstruksi Pelaku proyek (ADM-01 dengan KON-01); jembatannya ditulis di V3.

### Travel, hospitality, dan event

> “Booking bentrok, DP dikejar manual, dan tiket event dijual manual.”

6 dari 10 offer. Pintu masuk: **TRV-04**. Aturan: lolos.

| #   | ID                   | Judul untuk web                       | Dampak untuk web                                                                               | Jenis                                  | †                                                           | Alasan                                                        | Keputusan Anda |
| --- | -------------------- | ------------------------------------- | ---------------------------------------------------------------------------------------------- | -------------------------------------- | ----------------------------------------------------------- | ------------------------------------------------------------- | -------------- |
| 1   | TRV-04 (pintu masuk) | Sinkron ketersediaan lintas kanal     | Kamar tidak dobel pesan di banyak platform                                                     | Alur kerja yang berjalan tanpa dikejar | Lewat sambungan resmi setiap platform.                      | “Booking bentrok”: bertanda †, lewat sambungan resmi platform | tayang / tahan |
| 2   | TRV-05               | Buka tiket event dengan QR            | Tiket event dijual online, dipindai di pintu, dan penjualannya terlihat seketika.              | Kanal pendapatan baru                  |                                                             | “tiket event dijual manual”                                   | tayang / tahan |
| 3   | TRV-07               | Bot check-in dan informasi peserta    | Peserta terverifikasi dan pertanyaannya dijawab di WhatsApp                                    | Bot yang bekerja sendiri               |                                                             | Peserta event terverifikasi di WhatsApp                       | tayang / tahan |
| 4   | TRV-03               | Workflow booking, DP, dan check-in    | Tamu memesan, membayar DP, dan check-in mandiri tanpa resepsionis                              | Alur kerja yang berjalan tanpa dikejar |                                                             | “DP dikejar manual”: booking, DP, dan check-in                | tayang / tahan |
| 5   | TRV-01               | Buka lini agen tiket dan hotel online | Tiket, hotel, dan paket dari supplier ditawarkan lewat situs Anda, dengan komisi atau markup.  | Kanal pendapatan baru                  | Produk yang boleh dijual mengikuti kontrak dengan supplier. | Biro perjalanan: tiket dan hotel dari supplier; bertanda †    | tayang / tahan |
| 6   | TRV-09               | Bot peringatan harga musim ramai      | Hari libur dan lonjakan permintaan diperingatkan lebih dulu, supaya harga bisa Anda sesuaikan. | Bot yang bekerja sendiri               |                                                             | Musim ramai diperingatkan lebih dulu                          | tayang / tahan |

<details><summary>Tidak diusulkan</summary>

| ID     | Judul                                  | Alasan                                                                       |
| ------ | -------------------------------------- | ---------------------------------------------------------------------------- |
| TRV-02 | Bot rencana perjalanan dan tanya jawab | Tidak dipilih: jenisnya sudah diwakili offer yang lebih dekat ke kutipan bab |
| TRV-06 | Workflow vendor dan rundown            | Tidak dipilih: jenisnya sudah diwakili offer yang lebih dekat ke kutipan bab |
| TRV-08 | Buka marketplace paket wisata desa     | Tidak dipilih: jenisnya sudah diwakili offer yang lebih dekat ke kutipan bab |
| TRV-10 | Kode akses pintu otomatis              | Tidak dipilih: jenisnya sudah diwakili offer yang lebih dekat ke kutipan bab |

</details>

### Media, kreator, dan komunitas

> “Audiens saya besar tetapi pendapatan tipis, dan konten serta komunitas dikelola manual.”

6 dari 12 offer. Pintu masuk: **MED-05**. Aturan: lolos.

| #   | ID                   | Judul untuk web                            | Dampak untuk web                                               | Jenis                                  | †   | Alasan                                                | Keputusan Anda |
| --- | -------------------- | ------------------------------------------ | -------------------------------------------------------------- | -------------------------------------- | --- | ----------------------------------------------------- | -------------- |
| 1   | MED-05 (pintu masuk) | Bot komunitas Telegram atau Discord        | Sambutan anggota, aturan, dan iuran berjalan otomatis          | Bot yang bekerja sendiri               |     | “komunitas dikelola manual”                           | tayang / tahan |
| 2   | MED-03               | Buka toko produk digital                   | Template, preset, dan ebook dijual berulang tanpa stok         | Kanal pendapatan baru                  |     | “pendapatan tipis”: toko produk digital               | tayang / tahan |
| 3   | MED-06               | Workflow produksi konten                   | Brief, produksi, persetujuan, dan jadwal posting terkoordinasi | Alur kerja yang berjalan tanpa dikejar |     | “konten dikelola manual”: brief sampai jadwal posting | tayang / tahan |
| 4   | MED-01               | Overlay donasi dan alert langsung di layar | Donasi, follow, dan pesan tampil di layar siaran seketika      | Angka yang memberi tahu lebih dulu     |     | Donasi dan alert di layar; jembatan ke studio siaran  | tayang / tahan |
| 5   | MED-04               | Buka membership penggemar                  | Membership penggemar dengan konten eksklusif, ditagih bulanan. | Kanal pendapatan baru                  |     | Membership penggemar                                  | tayang / tahan |
| 6   | MED-07               | Otomasi klip dan jadwal siaran             | Cuplikan siaran dipotong dan dijadwalkan ke banyak platform    | Alur kerja yang berjalan tanpa dikejar |     | Cuplikan siaran ke banyak platform                    | tayang / tahan |

<details><summary>Tidak diusulkan</summary>

| ID     | Judul                                          | Alasan                                                                                             |
| ------ | ---------------------------------------------- | -------------------------------------------------------------------------------------------------- |
| MED-02 | Bot chat siaran                                | Tidak dipilih: jenisnya sudah diwakili offer yang lebih dekat ke kutipan bab                       |
| MED-08 | Dasbor performa lintas platform                | Tidak dipilih: jenisnya sudah diwakili offer yang lebih dekat ke kutipan bab                       |
| MED-09 | Workflow episode dari rekaman sampai publikasi | Tidak dipilih: jenisnya sudah diwakili offer yang lebih dekat ke kutipan bab                       |
| MED-10 | Buka marketplace kreator dan brand             | Tidak dipilih: jenisnya sudah diwakili offer yang lebih dekat ke kutipan bab                       |
| MED-11 | Bot giveaway dan undian                        | Tidak dipilih: undian tidak dijual di media afiliasi (aturan Agency); lebih aman tidak ditayangkan |
| MED-12 | Bot berita ke WhatsApp atau Telegram           | Tidak dipilih: jenisnya sudah diwakili offer yang lebih dekat ke kutipan bab                       |

</details>

### Logistik, armada, dan gudang

> “Pelanggan bertanya ‘paketku di mana’, rute boros, dan klaim kerusakan tanpa bukti.”

6 dari 10 offer. Pintu masuk: **LOG-02**. Aturan: lolos.

| #   | ID                   | Judul untuk web                         | Dampak untuk web                                                                          | Jenis                                  | †   | Alasan                                      | Keputusan Anda |
| --- | -------------------- | --------------------------------------- | ----------------------------------------------------------------------------------------- | -------------------------------------- | --- | ------------------------------------------- | -------------- |
| 1   | LOG-02 (pintu masuk) | Bot status kiriman ke pelanggan         | Pelanggan diberi kabar di setiap tahap pengiriman.                                        | Bot yang bekerja sendiri               |     | “Pelanggan bertanya paketku di mana”        | tayang / tahan |
| 2   | LOG-03               | Workflow bukti serah terima digital     | Foto, tanda tangan, dan lokasi serah terima tercatat sebagai bukti.                       | Alur kerja yang berjalan tanpa dikejar |     | “klaim kerusakan tanpa bukti”               | tayang / tahan |
| 3   | LOG-04               | Optimasi rute dan muatan                | Rute dan muatan barang disusun lebih efisien.                                             | Angka yang memberi tahu lebih dulu     |     | “rute boros”                                | tayang / tahan |
| 4   | LOG-08               | Buka agregator multi-kurir untuk seller | Seller memilih kurir termurah lewat agregator Anda, dan Anda menetapkan selisih tarifnya. | Kanal pendapatan baru                  |     | Agregator multi-kurir untuk seller          | tayang / tahan |
| 5   | LOG-01               | Pelacakan armada langsung               | Posisi kendaraan dan estimasi tiba terlihat seketika                                      | Angka yang memberi tahu lebih dulu     |     | Posisi kendaraan terlihat seketika          | tayang / tahan |
| 6   | LOG-05               | Bot jadwal servis dan pajak kendaraan   | Servis dan dokumen kendaraan tidak terlewat                                               | Bot yang bekerja sendiri               |     | Servis dan dokumen kendaraan tidak terlewat | tayang / tahan |

<details><summary>Tidak diusulkan</summary>

| ID     | Judul                                    | Alasan                                                                       |
| ------ | ---------------------------------------- | ---------------------------------------------------------------------------- |
| LOG-06 | Buka marketplace muatan dan truk         | Tidak dipilih: jenisnya sudah diwakili offer yang lebih dekat ke kutipan bab |
| LOG-07 | Workflow terima, simpan, kirim           | Tidak dipilih: jenisnya sudah diwakili offer yang lebih dekat ke kutipan bab |
| LOG-09 | Dasbor ketepatan waktu                   | Tidak dipilih: jenisnya sudah diwakili offer yang lebih dekat ke kutipan bab |
| LOG-10 | Sensor suhu dan peringatan rantai dingin | Tidak dipilih: jenisnya sudah diwakili offer yang lebih dekat ke kutipan bab |

</details>

### Manufaktur ringan, agro, dan UMKM produksi

> “Biaya pokok tidak diketahui, mesin berhenti mendadak, dan hasil tani lewat banyak perantara.”

6 dari 10 offer. Pintu masuk: **MAN-03**. Aturan: lolos.

| #   | ID                   | Judul untuk web                                 | Dampak untuk web                                                           | Jenis                                  | †   | Alasan                                                | Keputusan Anda |
| --- | -------------------- | ----------------------------------------------- | -------------------------------------------------------------------------- | -------------------------------------- | --- | ----------------------------------------------------- | -------------- |
| 1   | MAN-03 (pintu masuk) | Bot pencatat panen lewat WhatsApp               | Hasil panen dan biaya tercatat dari foto atau suara tanpa buku             | Bot yang bekerja sendiri               |     | Lingkup terkecil: panen dan biaya tercatat tanpa buku | tayang / tahan |
| 2   | MAN-01               | Workflow bahan, produksi, dan pemeriksaan mutu  | Biaya pokok dan mutu tiap batch terkontrol                                 | Alur kerja yang berjalan tanpa dikejar |     | “Biaya pokok tidak diketahui”                         | tayang / tahan |
| 3   | MAN-05               | Buka marketplace hasil tani langsung ke pembeli | Hasil tani dijual tanpa perantara berlapis                                 | Kanal pendapatan baru                  |     | “hasil tani lewat banyak perantara”                   | tayang / tahan |
| 4   | MAN-09               | Prediksi kebutuhan bahan                        | Kebutuhan bahan diperkirakan dari pola penjualan, sebagai dasar pembelian. | Angka yang memberi tahu lebih dulu     |     | Kebutuhan bahan dari pola penjualan                   | tayang / tahan |
| 5   | MAN-02               | Sensor mesin dan peringatan                     | Mesin bermasalah terdeteksi sebelum berhenti                               | Bot yang bekerja sendiri               |     | “mesin berhenti mendadak”                             | tayang / tahan |
| 6   | MAN-07               | Workflow perawatan mesin berkala                | Jadwal perawatan tidak terlewat                                            | Alur kerja yang berjalan tanpa dikejar |     | Perawatan mesin berkala                               | tayang / tahan |

<details><summary>Tidak diusulkan</summary>

| ID     | Judul                              | Alasan                                                                       |
| ------ | ---------------------------------- | ---------------------------------------------------------------------------- |
| MAN-04 | Otomasi pakan, pengairan, dan suhu | Tidak dipilih: jenisnya sudah diwakili offer yang lebih dekat ke kutipan bab |
| MAN-06 | Penelusuran asal bahan per batch   | Tidak dipilih: jenisnya sudah diwakili offer yang lebih dekat ke kutipan bab |
| MAN-08 | Buka toko online produk kemasan    | Tidak dipilih: jenisnya sudah diwakili offer yang lebih dekat ke kutipan bab |
| MAN-10 | Pemeriksaan lapangan mode offline  | Tidak dipilih: jenisnya sudah diwakili offer yang lebih dekat ke kutipan bab |

</details>

### Instansi, desa, dan organisasi publik

> “Warga harus datang untuk urusan sederhana, surat menumpuk, dan laporan wajib disusun manual.”

7 dari 11 offer. Pintu masuk: **PUB-10**. Aturan: lolos.

| #   | ID                   | Judul untuk web                    | Dampak untuk web                                                | Jenis                                  | †                                                    | Alasan                                                        | Keputusan Anda |
| --- | -------------------- | ---------------------------------- | --------------------------------------------------------------- | -------------------------------------- | ---------------------------------------------------- | ------------------------------------------------------------- | -------------- |
| 1   | PUB-10 (pintu masuk) | Bot informasi layanan publik       | Syarat dan alur layanan dijawab kapan pun                       | Bot yang bekerja sendiri               |                                                      | Lingkup terkecil: syarat dan alur layanan dijawab kapan pun   | tayang / tahan |
| 2   | PUB-01               | Layanan surat menyurat online      | Warga mengurus surat tanpa datang dan kantor lebih ringan       | Alur kerja yang berjalan tanpa dikejar |                                                      | “Warga harus datang untuk urusan sederhana”                   | tayang / tahan |
| 3   | PUB-05               | Buka donasi transparan dengan QRIS | Donasi masuk online dengan laporan penggunaan yang terbuka      | Kanal pendapatan baru                  |                                                      | Yayasan dan rumah ibadah: donasi dengan laporan terbuka       | tayang / tahan |
| 4   | PUB-04               | Dasbor aduan dan layanan terkini   | Pimpinan melihat beban kerja dan waktu penyelesaian             | Angka yang memberi tahu lebih dulu     |                                                      | Beban kerja dan waktu penyelesaian terlihat                   | tayang / tahan |
| 5   | PUB-03               | Workflow disposisi dan persetujuan | Surat bergerak antarpejabat dengan jejak yang jelas             | Alur kerja yang berjalan tanpa dikejar |                                                      | “surat menumpuk”: disposisi dengan jejak                      | tayang / tahan |
| 6   | PUB-08               | Pelaporan berkala otomatis         | Laporan wajib tersusun dari data layanan                        | Alur kerja yang berjalan tanpa dikejar | Hanya lewat kerja sama atau jalur resmi instansinya. | “laporan wajib disusun manual”: bertanda †, lewat jalur resmi | tayang / tahan |
| 7   | PUB-02               | Bot pengaduan warga                | Aduan masuk lewat WhatsApp dan langsung dialokasikan ke petugas | Bot yang bekerja sendiri               |                                                      | Aduan warga lewat WhatsApp                                    | tayang / tahan |

<details><summary>Tidak diusulkan</summary>

| ID     | Judul                              | Alasan                                                                       |
| ------ | ---------------------------------- | ---------------------------------------------------------------------------- |
| PUB-06 | Infak QRIS dan pengumuman otomatis | Tidak dipilih: jenisnya sudah diwakili offer yang lebih dekat ke kutipan bab |
| PUB-07 | Arsip digital dengan pencarian     | Tidak dipilih: jenisnya sudah diwakili offer yang lebih dekat ke kutipan bab |
| PUB-09 | Pemantauan proyek fisik desa       | Tidak dipilih: jenisnya sudah diwakili offer yang lebih dekat ke kutipan bab |
| PUB-11 | Buka marketplace UMKM desa         | Tidak dipilih: jenisnya sudah diwakili offer yang lebih dekat ke kutipan bab |

</details>

### Jasa profesional dan agensi

> “Prospek tidak ditindaklanjuti, laporan klien disusun manual, dan tenggat klien terlewat.”

6 dari 11 offer. Pintu masuk: **PRF-01**. Aturan: lolos.

| #   | ID                   | Judul untuk web                            | Dampak untuk web                                           | Jenis                                  | †   | Alasan                              | Keputusan Anda |
| --- | -------------------- | ------------------------------------------ | ---------------------------------------------------------- | -------------------------------------- | --- | ----------------------------------- | -------------- |
| 1   | PRF-01 (pintu masuk) | Bot kualifikasi lead                       | Prospek disaring dan dijadwalkan demo tanpa admin          | Bot yang bekerja sendiri               |     | “Prospek tidak ditindaklanjuti”     | tayang / tahan |
| 2   | PRF-03               | Laporan bulanan klien otomatis             | Laporan kinerja terbit sendiri dari data kanal             | Alur kerja yang berjalan tanpa dikejar |     | “laporan klien disusun manual”      | tayang / tahan |
| 3   | PRF-10               | Buka jasa berulang menjadi paket langganan | Jasa yang berulang dikemas menjadi paket bulanan           | Kanal pendapatan baru                  |     | Jasa berulang menjadi paket bulanan | tayang / tahan |
| 4   | PRF-05               | Bot pengingat tenggat klien                | Tenggat pajak, izin, dan kontrak klien tidak terlewat      | Bot yang bekerja sendiri               |     | “tenggat klien terlewat”            | tayang / tahan |
| 5   | PRF-06               | Timesheet dan penagihan otomatis           | Jam kerja menjadi faktur tanpa rekap manual                | Alur kerja yang berjalan tanpa dikejar |     | Jam kerja menjadi faktur            | tayang / tahan |
| 6   | PRF-02               | Workflow onboarding klien                  | Kontrak, brief, akses, dan tagihan awal berjalan berurutan | Alur kerja yang berjalan tanpa dikejar |     | Onboarding klien berurutan          | tayang / tahan |

<details><summary>Tidak diusulkan</summary>

| ID     | Judul                                        | Alasan                                                                       |
| ------ | -------------------------------------------- | ---------------------------------------------------------------------------- |
| PRF-04 | Workflow proposal dari brief                 | Tidak dipilih: jenisnya sudah diwakili offer yang lebih dekat ke kutipan bab |
| PRF-07 | Portal klien                                 | Tidak dipilih: jenisnya sudah diwakili offer yang lebih dekat ke kutipan bab |
| PRF-08 | Workflow dokumen dan tanda tangan elektronik | Tidak dipilih: jenisnya sudah diwakili offer yang lebih dekat ke kutipan bab |
| PRF-09 | Asisten pengetahuan internal                 | Tidak dipilih: jenisnya sudah diwakili offer yang lebih dekat ke kutipan bab |
| PRF-11 | Buka toko template dan aset desain           | Tidak dipilih: jenisnya sudah diwakili offer yang lebih dekat ke kutipan bab |

</details>

### Kebugaran, olahraga, dan rekreasi

> “Jadwal lapangan bentrok, iuran anggota menunggak, dan lampu serta loker harus dijaga orang.”

6 dari 10 offer. Pintu masuk: **FIT-03**. Aturan: lolos.

| #   | ID                   | Judul untuk web                                  | Dampak untuk web                                                                   | Jenis                                  | †   | Alasan                                             | Keputusan Anda |
| --- | -------------------- | ------------------------------------------------ | ---------------------------------------------------------------------------------- | -------------------------------------- | --- | -------------------------------------------------- | -------------- |
| 1   | FIT-03 (pintu masuk) | Bot pengingat iuran dan kelas                    | Anggota diingatkan membayar dan jadwal kelas, dan anggota yang tak aktif dihubungi | Bot yang bekerja sendiri               |     | “iuran anggota menunggak”                          | tayang / tahan |
| 2   | FIT-01               | Workflow pemesanan lapangan dengan DP            | Jadwal lapangan terisi tanpa telepon dan DP masuk otomatis                         | Alur kerja yang berjalan tanpa dikejar |     | “Jadwal lapangan bentrok”: pemesanan dengan DP     | tayang / tahan |
| 3   | FIT-02               | Buka lampu dan listrik lapangan berbayar per jam | Lampu menyala setelah pembayaran dan mati sendiri saat waktu habis                 | Kanal pendapatan baru                  |     | “lampu harus dijaga orang”: lampu berbayar per jam | tayang / tahan |
| 4   | FIT-07               | Klasemen dan skor langsung                       | Penonton melihat skor dan klasemen langsung di ponsel                              | Angka yang memberi tahu lebih dulu     |     | Skor dan klasemen langsung                         | tayang / tahan |
| 5   | FIT-10               | Buka tiket masuk dan loker bayar QRIS            | Tiket dan loker dibayar dengan QRIS dan terpantau                                  | Kanal pendapatan baru                  |     | “loker harus dijaga orang”: tiket dan loker QRIS   | tayang / tahan |
| 6   | FIT-04               | Buka membership dan paket kelas                  | Keanggotaan dan paket sesi dibuka dengan tagihan berulang.                         | Kanal pendapatan baru                  |     | Membership dan paket kelas                         | tayang / tahan |

<details><summary>Tidak diusulkan</summary>

| ID     | Judul                                    | Alasan                                                                       |
| ------ | ---------------------------------------- | ---------------------------------------------------------------------------- |
| FIT-05 | Bot daftar tunggu kelas                  | Tidak dipilih: jenisnya sudah diwakili offer yang lebih dekat ke kutipan bab |
| FIT-06 | Workflow jadwal, skor, dan klasemen      | Tidak dipilih: jenisnya sudah diwakili offer yang lebih dekat ke kutipan bab |
| FIT-08 | Buka marketplace lawan main dan lapangan | Tidak dipilih: jenisnya sudah diwakili offer yang lebih dekat ke kutipan bab |
| FIT-09 | Buka program latihan berlangganan        | Tidak dipilih: jenisnya sudah diwakili offer yang lebih dekat ke kutipan bab |

</details>

### Lintas sektor: untuk usaha apa pun

> “Pekerjaan berulang menyita waktu tim saya dan pendapatan saya bergantung pada satu sumber.”

7 dari 26 offer. Pintu masuk: **LIN-17**. Aturan: lolos.

| #   | ID                   | Judul untuk web                                       | Dampak untuk web                                                                                  | Jenis                                  | †   | Alasan                                                                                    | Keputusan Anda |
| --- | -------------------- | ----------------------------------------------------- | ------------------------------------------------------------------------------------------------- | -------------------------------------- | --- | ----------------------------------------------------------------------------------------- | -------------- |
| 1   | LIN-17 (pintu masuk) | Sesi pemetaan peluang model bisnis baru               | Dari sembilan model dipilih yang cocok dengan aset dan pelanggan Anda, dengan perhitungan terbuka | Kanal pendapatan baru                  |     | “pendapatan saya bergantung pada satu sumber”: sesi pemetaan, titik mulai di master brief | tayang / tahan |
| 2   | LIN-01               | Bot laporan harian ke pemilik                         | Ringkasan penjualan, kas, dan tugas terkirim setiap pagi                                          | Bot yang bekerja sendiri               |     | Ringkasan penjualan dan kas setiap pagi                                                   | tayang / tahan |
| 3   | LIN-07               | Workflow persetujuan berjenjang                       | Cuti, klaim, dan pembelian bergerak ke atasan tanpa dikejar                                       | Alur kerja yang berjalan tanpa dikejar |     | “Pekerjaan berulang menyita waktu tim saya”: persetujuan berjenjang                       | tayang / tahan |
| 4   | LIN-12               | Dasbor pemilik yang diperbarui seketika               | Kas, penjualan, dan operasi terlihat dalam satu layar                                             | Angka yang memberi tahu lebih dulu     |     | Kas, penjualan, dan operasi dalam satu layar                                              | tayang / tahan |
| 5   | LIN-03               | Bot layanan pelanggan 24 jam                          | Pertanyaan berulang dijawab dari data perusahaan dan sisanya diteruskan ke manusia                | Bot yang bekerja sendiri               |     | Pertanyaan berulang dijawab dari data perusahaan                                          | tayang / tahan |
| 6   | LIN-08               | Workflow faktur, pembayaran, dan rekonsiliasi         | Uang masuk otomatis cocok dengan catatan                                                          | Alur kerja yang berjalan tanpa dikejar |     | Uang masuk cocok dengan catatan                                                           | tayang / tahan |
| 7   | LIN-16               | Kanal jualan WhatsApp dengan katalog dan tautan bayar | Jualan di percakapan punya katalog dan pembayaran                                                 | Kanal pendapatan baru                  |     | Jualan di percakapan dengan katalog dan pembayaran                                        | tayang / tahan |

<details><summary>Tidak diusulkan</summary>

| ID     | Judul                                                | Alasan                                                                       |
| ------ | ---------------------------------------------------- | ---------------------------------------------------------------------------- |
| LIN-02 | Bot peringatan anomali                               | Tidak dipilih: jenisnya sudah diwakili offer yang lebih dekat ke kutipan bab |
| LIN-04 | Bot penagihan dan pengingat jatuh tempo              | Tidak dipilih: jenisnya sudah diwakili offer yang lebih dekat ke kutipan bab |
| LIN-05 | Bot penyaring lead dan penjadwal demo                | Tidak dipilih: jenisnya sudah diwakili offer yang lebih dekat ke kutipan bab |
| LIN-06 | Bot notulen rapat dan tindak lanjut                  | Tidak dipilih: jenisnya sudah diwakili offer yang lebih dekat ke kutipan bab |
| LIN-09 | Pembacaan otomatis nota, faktur, dan KTP             | Tidak dipilih: jenisnya sudah diwakili offer yang lebih dekat ke kutipan bab |
| LIN-10 | Bot pengingat kepatuhan pajak, izin, dan kontrak     | Tidak dipilih: jenisnya sudah diwakili offer yang lebih dekat ke kutipan bab |
| LIN-11 | Workflow onboarding karyawan atau pelanggan          | Tidak dipilih: jenisnya sudah diwakili offer yang lebih dekat ke kutipan bab |
| LIN-13 | Sinkron data antaraplikasi                           | Tidak dipilih: jenisnya sudah diwakili offer yang lebih dekat ke kutipan bab |
| LIN-14 | Bot survei dan umpan balik                           | Tidak dipilih: jenisnya sudah diwakili offer yang lebih dekat ke kutipan bab |
| LIN-15 | Tiket keluhan dengan batas waktu                     | Tidak dipilih: jenisnya sudah diwakili offer yang lebih dekat ke kutipan bab |
| LIN-18 | Buka aplikasi pelanggan bermerek                     | Tidak dipilih: jenisnya sudah diwakili offer yang lebih dekat ke kutipan bab |
| LIN-19 | Buka pendapatan berulang lewat langganan             | Tidak dipilih: jenisnya sudah diwakili offer yang lebih dekat ke kutipan bab |
| LIN-20 | Bot penyusun draf konten dari data produk            | Tidak dipilih: jenisnya sudah diwakili offer yang lebih dekat ke kutipan bab |
| LIN-21 | Agen AI untuk tugas terdefinisi (masih eksperimen)   | Tidak dipilih: masih eksperimen menurut katalog                              |
| LIN-22 | Buka jaringan reseller dan afiliasi berkomisi        | Tidak dipilih: jenisnya sudah diwakili offer yang lebih dekat ke kutipan bab |
| LIN-23 | Bot penerima telepon                                 | Tidak dipilih: jenisnya sudah diwakili offer yang lebih dekat ke kutipan bab |
| LIN-24 | Workflow pembelian dari permintaan sampai pembayaran | Tidak dipilih: jenisnya sudah diwakili offer yang lebih dekat ke kutipan bab |
| LIN-25 | Workflow penawaran, persetujuan diskon, dan kontrak  | Tidak dipilih: jenisnya sudah diwakili offer yang lebih dekat ke kutipan bab |
| LIN-26 | Migrasi dari Excel dan chat ke data rapi             | Tidak dipilih: jenisnya sudah diwakili offer yang lebih dekat ke kutipan bab |

</details>

## Konstruksi · Pemilik bangunan

### Rumah tinggal dan konsumen akhir (lapis 1)

> “Saya takut anggaran membengkak dan pekerjaan tidak diawasi.”

**Keputusan:** Disetujui pemilik seperti diusulkan, 16 Oktober 2026.

6 dari 16 offer. Pintu masuk: **RMH-10**. Aturan: lolos.

| #   | ID                   | Judul untuk web                            | Dampak untuk web                                                              | Jenis                          | †   | Alasan                                                     | Keputusan Anda |
| --- | -------------------- | ------------------------------------------ | ----------------------------------------------------------------------------- | ------------------------------ | --- | ---------------------------------------------------------- | -------------- |
| 1   | RMH-10 (pintu masuk) | RAB dan estimasi biaya sebelum membangun   | Anggaran dihitung dari gambar dan harga pasar sebelum Anda memutuskan         | Bagian proyek yang kami ambil  |     | “Saya takut anggaran membengkak”: angka sebelum memutuskan | tayang         |
| 2   | RMH-01               | Bangun rumah dari hulu ke hilir            | Rumah jadi sesuai anggaran dengan jadwal dan garansi yang tertulis            | Proyek utuh dari hulu ke hilir |     | Rumah pertama, dari hulu ke hilir, garansi tertulis        | tayang         |
| 3   | RMH-16               | Garansi dan perbaikan setelah serah terima | Cacat yang muncul setelah serah terima diperbaiki dalam masa garansi          | Perawatan berkala              |     | Sesudah serah terima: garansi                              | tayang         |
| 4   | RMH-09               | Pengawasan proyek pribadi                  | Ada pihak independen yang mengawasi mutu dan biaya atas nama pemilik          | Bagian proyek yang kami ambil  |     | “pekerjaan tidak diawasi”: pengawas atas nama pemilik      | tayang         |
| 5   | RMH-14               | Survei kondisi bangunan sebelum renovasi   | Retak, kebocoran, dan kerusakan tersembunyi terdata sebelum biaya dikeluarkan | Bagian proyek yang kami ambil  |     | Biaya tersembunyi terdata sebelum renovasi                 | tayang         |
| 6   | RMH-02               | Renovasi dengan estimasi terukur           | Biaya dan jadwal renovasi diketahui sebelum pekerjaan dimulai                 | Proyek utuh dari hulu ke hilir |     | Pemilik rumah lama: renovasi dengan estimasi               | tayang         |

<details><summary>Tidak diusulkan</summary>

| ID     | Judul                                           | Alasan                                                                                   |
| ------ | ----------------------------------------------- | ---------------------------------------------------------------------------------------- |
| RMH-03 | Tambah lantai dengan pemeriksaan struktur       | Cadangan: bertanda †, rumusan aman sudah ada; pilih bila Anda ingin tambah lantai tampil |
| RMH-04 | Atap dan dak bebas bocor                        | Tidak dipilih: jenisnya sudah diwakili offer yang lebih dekat ke kutipan bab             |
| RMH-05 | Air bersih dan sanitasi rumah                   | Tidak dipilih: jenisnya sudah diwakili offer yang lebih dekat ke kutipan bab             |
| RMH-06 | Dapur dan kamar mandi baru                      | Tidak dipilih: jenisnya sudah diwakili offer yang lebih dekat ke kutipan bab             |
| RMH-07 | Pagar, carport, dan halaman                     | Tidak dipilih: jenisnya sudah diwakili offer yang lebih dekat ke kutipan bab             |
| RMH-08 | Ruko jadi dengan manajemen konstruksi           | Tidak dipilih: jenisnya sudah diwakili offer yang lebih dekat ke kutipan bab             |
| RMH-11 | Pendampingan persetujuan bangunan gedung        | Tidak dipilih: jenisnya sudah diwakili offer yang lebih dekat ke kutipan bab             |
| RMH-12 | Paket material rumah dengan pengiriman bertahap | Tidak dipilih: jenisnya tidak menjawab kutipan bab ini                                   |
| RMH-13 | Tukang dan mandor harian untuk pemilik          | Tidak dipilih: jenisnya sudah diwakili offer yang lebih dekat ke kutipan bab             |
| RMH-15 | Perbaikan cepat sesuai kondisi lapangan         | Tidak dipilih: jenisnya sudah diwakili offer yang lebih dekat ke kutipan bab             |

</details>

### Desain interior: teknis lapangan dan visualisasi (lapis 1)

> “Saya tahu ruangan yang saya mau, tetapi tidak bisa membayangkannya, dan tukang tidak paham maksud saya.”

**Keputusan:** Disetujui pemilik seperti diusulkan, 16 Oktober 2026.

5 dari 10 offer. Pintu masuk: **ITR-01**. Aturan: lolos.

| #   | ID                   | Judul untuk web                                  | Dampak untuk web                                                          | Jenis                          | †   | Alasan                                            | Keputusan Anda |
| --- | -------------------- | ------------------------------------------------ | ------------------------------------------------------------------------- | ------------------------------ | --- | ------------------------------------------------- | -------------- |
| 1   | ITR-01 (pintu masuk) | Analisis kebutuhan ruang                         | Kebutuhan, kebiasaan, dan batas anggaran dirumuskan sebelum gambar dibuat | Bagian proyek yang kami ambil  |     | Langkah terkecil: kebutuhan ruang dirumuskan dulu | tayang         |
| 2   | ITR-10               | Interior lengkap dari visual sampai serah terima | Satu pihak mengurus visual, gambar, pekerjaan, dan serah terima           | Proyek utuh dari hulu ke hilir |     | Satu pihak dari visual sampai serah terima        | tayang         |
| 3   | ITR-02               | Visualisasi tiga dimensi interior                | Ruangan terlihat jadi sebelum satu tukang pun dipanggil                   | Bagian proyek yang kami ambil  |     | “tidak bisa membayangkannya”                      | tayang         |
| 4   | ITR-04               | Gambar kerja interior untuk tukang               | Tukang bekerja dari gambar yang jelas ukuran dan detailnya                | Bagian proyek yang kami ambil  |     | “tukang tidak paham maksud saya”                  | tayang         |
| 5   | ITR-05               | RAB interior dari gambar                         | Biaya interior dihitung dari volume yang tergambar                        | Bagian proyek yang kami ambil  |     | Biaya interior dari gambar, bukan tebakan         | tayang         |

<details><summary>Tidak diusulkan</summary>

| ID     | Judul                                  | Alasan                                                                       |
| ------ | -------------------------------------- | ---------------------------------------------------------------------------- |
| ITR-03 | Tiga pilihan gaya sebelum memutuskan   | Tidak dipilih: jenisnya sudah diwakili offer yang lebih dekat ke kutipan bab |
| ITR-06 | Pekerjaan teknis lapangan interior     | Tidak dipilih: jenisnya sudah diwakili offer yang lebih dekat ke kutipan bab |
| ITR-07 | Kabinet dan furnitur custom            | Tidak dipilih: jenisnya sudah diwakili offer yang lebih dekat ke kutipan bab |
| ITR-08 | Pencahayaan dan titik listrik interior | Tidak dipilih: jenisnya sudah diwakili offer yang lebih dekat ke kutipan bab |
| ITR-09 | Pengawasan finishing interior          | Tidak dipilih: jenisnya sudah diwakili offer yang lebih dekat ke kutipan bab |

</details>

Catatan: Halaman bab memuat kalimat wajib desain: visual adalah gambaran rencana, bukan jaminan hasil fisik.

### Konstruksi F&B (lapis 3)

> “Lokasinya sudah dapat, tetapi belum berbentuk kafe yang menarik dan alur dapurnya belum jalan.”

**Keputusan:** Disetujui pemilik seperti diusulkan, 16 Oktober 2026.

6 dari 10 offer. Pintu masuk: **FNB-06**. Aturan: lolos.

| #   | ID                   | Judul untuk web                          | Dampak untuk web                                                          | Jenis                          | †   | Alasan                                                                         | Keputusan Anda |
| --- | -------------------- | ---------------------------------------- | ------------------------------------------------------------------------- | ------------------------------ | --- | ------------------------------------------------------------------------------ | -------------- |
| 1   | FNB-06 (pintu masuk) | Alur dapur yang mempercepat penyajian    | Posisi kompor, bar, dan pass-out mengurangi langkah dan waktu tunggu      | Bangunan yang lebih produktif  |     | “alur dapurnya belum jalan”: lingkup terkecil                                  | tayang         |
| 2   | FNB-01               | Kafe siap buka dari lokasi sewa          | Lokasi kosong menjadi kafe yang alur pelanggan dan dapurnya sudah bekerja | Proyek utuh dari hulu ke hilir |     | “Lokasinya sudah dapat”: kafe siap buka; jembatan ke Pesan dan bayar dari meja | tayang         |
| 3   | FNB-10               | Perawatan outlet berkala                 | Kerusakan kecil di outlet ditangani berkala, sebelum menjadi besar.       | Perawatan berkala              |     | Sesudah buka: perawatan outlet                                                 | tayang         |
| 4   | FNB-05               | Tata letak yang menambah kapasitas duduk | Tata letak meja dan sirkulasi memuat lebih banyak tamu tanpa terasa sesak | Bangunan yang lebih produktif  |     | Kafe yang menarik: kapasitas duduk                                             | tayang         |
| 5   | FNB-03               | Dapur produksi higienis                  | Alur bahan, olah, dan saji tidak bersilang dan mudah dibersihkan          | Proyek utuh dari hulu ke hilir |     | Katering dan produsen: dapur produksi                                          | tayang         |
| 6   | FNB-09               | Makeover kedai yang sudah berjalan       | Kedai lama tampil baru dengan waktu tutup yang sesingkat mungkin          | Bangunan yang lebih produktif  |     | Kedai lama yang sudah berjalan                                                 | tayang         |

<details><summary>Tidak diusulkan</summary>

| ID     | Judul                                     | Alasan                                                                       |
| ------ | ----------------------------------------- | ---------------------------------------------------------------------------- |
| FNB-02 | Fasad dan signage yang menarik dari jalan | Tidak dipilih: jenisnya sudah diwakili offer yang lebih dekat ke kutipan bab |
| FNB-04 | Area makan outdoor                        | Tidak dipilih: jenisnya sudah diwakili offer yang lebih dekat ke kutipan bab |
| FNB-07 | Lantai, drainase, dan ventilasi dapur     | Tidak dipilih: jenisnya sudah diwakili offer yang lebih dekat ke kutipan bab |
| FNB-08 | Desain gerai seragam untuk multi-outlet   | Tidak dipilih: jenisnya sudah diwakili offer yang lebih dekat ke kutipan bab |

</details>

### Studio streaming dan workshop media (lapis 3)

> “Siaran saya terganggu gema dan listrik, dan set saya berantakan.”

**Keputusan:** Disetujui pemilik seperti diusulkan, 16 Oktober 2026.

6 dari 10 offer. Pintu masuk: **STD-03**. Aturan: lolos.

| #   | ID                   | Judul untuk web                           | Dampak untuk web                                                | Jenis                          | †                                                        | Alasan                                                           | Keputusan Anda |
| --- | -------------------- | ----------------------------------------- | --------------------------------------------------------------- | ------------------------------ | -------------------------------------------------------- | ---------------------------------------------------------------- | -------------- |
| 1   | STD-03 (pintu masuk) | Pencahayaan set siaran                    | Wajah dan produk tampil jelas tanpa silau                       | Proyek utuh dari hulu ke hilir |                                                          | Langkah terkecil: pencahayaan set                                | tayang         |
| 2   | STD-04               | Backdrop dan set siaran                   | Latar siaran berkarakter dan mudah dibongkar atau diubah        | Bangunan yang lebih produktif  |                                                          | “set saya berantakan”                                            | tayang         |
| 3   | STD-01               | Ruang siaran kedap gema                   | Suara bersih tanpa gema dan gangguan dari luar                  | Proyek utuh dari hulu ke hilir |                                                          | “Siaran saya terganggu gema”                                     | tayang         |
| 4   | STD-09               | Makeover ruangan menjadi studio           | Ruangan biasa menjadi studio siap pakai tanpa merombak bangunan | Bangunan yang lebih produktif  |                                                          | Ruangan biasa jadi studio; jembatan ke Peekabo live              | tayang         |
| 5   | STD-02               | Kelistrikan stabil untuk perangkat siaran | Perangkat menyala stabil dan aman untuk pemakaian berjam-jam    | Proyek utuh dari hulu ke hilir | Instalasi listrik dikerjakan mitra instalatir berwenang. | “dan listrik”: bertanda †, dikerjakan mitra instalatir berwenang | tayang         |
| 6   | STD-08               | Studio podcast kecil                      | Ruang rekam sederhana dengan akustik yang terkendali            | Proyek utuh dari hulu ke hilir |                                                          | Podcaster                                                        | tayang         |

<details><summary>Tidak diusulkan</summary>

| ID     | Judul                               | Alasan                                                                       |
| ------ | ----------------------------------- | ---------------------------------------------------------------------------- |
| STD-05 | Ruang multi-set untuk beberapa host | Tidak dipilih: jenisnya sudah diwakili offer yang lebih dekat ke kutipan bab |
| STD-06 | Ruang produksi dan penyimpanan alat | Tidak dipilih: jenisnya sudah diwakili offer yang lebih dekat ke kutipan bab |
| STD-07 | Meja kerja dan rak modular          | Tidak dipilih: jenisnya sudah diwakili offer yang lebih dekat ke kutipan bab |
| STD-10 | Studio yang bisa disewakan          | Tidak dipilih: jenisnya sudah diwakili offer yang lebih dekat ke kutipan bab |

</details>

### Makeover villa, kontrakan, hotel, dan hostel (lapis 3)

> “Properti saya kusam dan sulit disewakan dengan tarif yang pantas.”

**Keputusan:** Disetujui pemilik seperti diusulkan, 16 Oktober 2026.

6 dari 10 offer. Pintu masuk: **HOS-09**. Aturan: lolos.

| #   | ID                   | Judul untuk web                                | Dampak untuk web                                                              | Jenis                          | †   | Alasan                                                | Keputusan Anda |
| --- | -------------------- | ---------------------------------------------- | ----------------------------------------------------------------------------- | ------------------------------ | --- | ----------------------------------------------------- | -------------- |
| 1   | HOS-09 (pintu masuk) | Makeover cepat antarpenyewa                    | Unit dibenahi segera setelah penyewa pergi, sebelum penyewa berikutnya masuk. | Bangunan yang lebih produktif  |     | Langkah terkecil: unit dibenahi di antara dua penyewa | tayang         |
| 2   | HOS-05               | Kamar mandi dan sanitasi yang layak            | Kamar mandi bersih, kering, dan tahan lama                                    | Proyek utuh dari hulu ke hilir |     | Kamar mandi yang layak                                | tayang         |
| 3   | HOS-02               | Kontrakan siap sewa kembali                    | Kontrakan kusam dibenahi sampai layak disewakan kembali.                      | Bangunan yang lebih produktif  |     | “Properti saya kusam dan sulit disewakan”             | tayang         |
| 4   | HOS-07               | Atap dan lapisan kedap air untuk musim hujan   | Kebocoran tidak mengganggu tamu                                               | Proyek utuh dari hulu ke hilir |     | Kebocoran musim hujan yang mengganggu tamu            | tayang         |
| 5   | HOS-01               | Makeover villa yang siap difoto dan ditawarkan | Villa dibenahi sampai layak tampil di foto dan siap ditawarkan ulang.         | Bangunan yang lebih produktif  |     | Villa yang siap difoto dan ditawarkan                 | tayang         |
| 6   | HOS-10               | Bangun kos siap huni                           | Bangunan kos baru selesai dengan anggaran yang terkendali                     | Proyek utuh dari hulu ke hilir |     | Investor: kos baru                                    | tayang         |

<details><summary>Tidak diusulkan</summary>

| ID     | Judul                                 | Alasan                                                                       |
| ------ | ------------------------------------- | ---------------------------------------------------------------------------- |
| HOS-03 | Kamar hostel yang efisien             | Tidak dipilih: jenisnya sudah diwakili offer yang lebih dekat ke kutipan bab |
| HOS-04 | Lobi dan area bersama yang meyakinkan | Tidak dipilih: jenisnya sudah diwakili offer yang lebih dekat ke kutipan bab |
| HOS-06 | Fasad dan kesan pertama               | Tidak dipilih: dampaknya kata sifat (“menarik dari luar”)                    |
| HOS-08 | Taman dan area outdoor                | Tidak dipilih: “area luar menjadi nilai jual” tidak punya pegangan kerja     |

</details>

### Membership Care (lapis 4)

> “Properti saya cepat kusam karena tidak ada yang merawatnya secara rutin.”

**Keputusan:** Disetujui pemilik seperti diusulkan, 16 Oktober 2026.

5 dari 12 offer. Pintu masuk: **RWT-02**. Aturan: lolos.

| #   | ID                   | Judul untuk web                               | Dampak untuk web                                                     | Jenis             | †   | Alasan                                                     | Keputusan Anda |
| --- | -------------------- | --------------------------------------------- | -------------------------------------------------------------------- | ----------------- | --- | ---------------------------------------------------------- | -------------- |
| 1   | RWT-02 (pintu masuk) | Inspeksi bulanan dengan laporan foto          | Kondisi bangunan terlihat tanpa Anda harus datang                    | Perawatan berkala |     | “tidak ada yang merawatnya secara rutin”: inspeksi bulanan | tayang         |
| 2   | RWT-04               | Perawatan atap dan talang sebelum musim hujan | Kebocoran dicegah sebelum terjadi                                    | Perawatan berkala |     | Kebocoran dicegah sebelum musim hujan                      | tayang         |
| 3   | RWT-10               | Laporan kondisi berkala                       | Data kondisi bangunan menjadi dasar keputusan perawatan dan renovasi | Perawatan berkala |     | Laporan kondisi yang bisa dibaca                           | tayang         |
| 4   | RWT-05               | Perawatan cat dan fasad berkala               | Bangunan tetap segar dan nilainya terjaga                            | Perawatan berkala |     | “cepat kusam”: cat dan fasad berkala                       | tayang         |
| 5   | RWT-03               | Tim siaga perbaikan darurat                   | Kerusakan mendadak ditangani dalam waktu yang disepakati             | Perawatan berkala |     | Kerusakan mendadak                                         | tayang         |

<details><summary>Tidak diusulkan</summary>

| ID     | Judul                                    | Alasan                                                                       |
| ------ | ---------------------------------------- | ---------------------------------------------------------------------------- |
| RWT-01 | Membership perawatan properti menyeluruh | Menunggu keputusan ekonomi Membership Care (D5)                              |
| RWT-06 | Perawatan taman dan area luar            | Tidak dipilih: jenisnya sudah diwakili offer yang lebih dekat ke kutipan bab |
| RWT-07 | Perawatan sanitasi dan saluran           | Tidak dipilih: jenisnya sudah diwakili offer yang lebih dekat ke kutipan bab |
| RWT-08 | Perawatan listrik ringan lewat mitra     | Tidak dipilih: jenisnya sudah diwakili offer yang lebih dekat ke kutipan bab |
| RWT-09 | Membership multi-properti                | Menunggu keputusan ekonomi Membership Care (D5)                              |
| RWT-11 | Membership untuk penginapan              | Membership penginapan ikut keputusan D5                                      |
| RWT-12 | Peremajaan tahunan                       | Tidak dipilih: jenisnya tidak menjawab kutipan bab ini                       |

</details>

Catatan: Bentuk hubungan kerja pekerja Membership Care belum diputuskan (keputusan lintas unit 3); halaman bab tidak menyebutnya.

### Nilai tambah lewat mitra (jembatan)

> “Saya butuh pembiayaan dan perlindungan untuk bangunan saya.”

**Keputusan:** Disetujui pemilik seperti diusulkan, 16 Oktober 2026.

3 dari 6 offer. Pintu masuk: **KOM-01**. Aturan: lolos.

| #   | ID                   | Judul untuk web                                       | Dampak untuk web                                                               | Jenis                                | †                                                                         | Alasan                                                | Keputusan Anda |
| --- | -------------------- | ----------------------------------------------------- | ------------------------------------------------------------------------------ | ------------------------------------ | ------------------------------------------------------------------------- | ----------------------------------------------------- | -------------- |
| 1   | KOM-01 (pintu masuk) | Pembiayaan renovasi lewat mitra                       | Renovasi dibiayai lewat mitra pembiayaan dengan syarat yang dijelaskan terbuka | Modal, alat, dan jaminan lewat mitra | Kami tidak memberi pinjaman; pembiayaan dan syaratnya dari mitra berizin. | “Saya butuh pembiayaan”: renovasi lewat mitra berizin | tayang         |
| 2   | KOM-06               | Pembiayaan peralatan usaha lewat mitra                | Peralatan dapur atau studio dibiayai lewat mitra                               | Modal, alat, dan jaminan lewat mitra | Kami tidak memberi pinjaman; pembiayaan dan syaratnya dari mitra berizin. | Peralatan dapur atau studio lewat mitra               | tayang         |
| 3   | KOM-03               | Jual atau sewakan properti hasil makeover lewat mitra | Properti hasil makeover dipasarkan lewat mitra properti                        | Modal, alat, dan jaminan lewat mitra | Penjualan dan sewa dijalankan perantara properti berizin.                 | Properti hasil makeover lewat perantara berizin       | tayang         |

<details><summary>Tidak diusulkan</summary>

| ID     | Judul                                        | Alasan                                                              |
| ------ | -------------------------------------------- | ------------------------------------------------------------------- |
| KOM-02 | Asuransi bangunan lewat mitra                | Mitra asuransi belum ada (master brief, jalur komisi)               |
| KOM-04 | Penilaian nilai properti sebelum dan sesudah | “Kenaikan nilai terukur” adalah hasil pasar, bukan pekerjaan Arthur |
| KOM-05 | Sewa alat berat untuk kavling lewat mitra    | Mitra sewa alat berat belum ada                                     |

</details>

Catatan: Bab ini tepat tiga offer. Halaman memuat kalimat wajib pembiayaan dan pengungkapan komisi; mitra tidak disebut namanya. Bila Anda lebih suka menahan bab ini sampai kartu komisi ada, bab tampil sebagai situasi tanpa halaman.

## Konstruksi · Pelaku proyek

### Paket hulu-hilir untuk kontraktor utama

> “Paketnya sudah menang, tetapi saya belum punya subkon yang sanggup menangani semuanya dari hulu ke hilir.”

**Keputusan:** Disetujui pemilik seperti diusulkan, 16 Oktober 2026.

7 dari 14 offer. Pintu masuk: **HHK-03**. Aturan: lolos.

| #   | ID                   | Judul untuk web                                             | Dampak untuk web                                                                                                                  | Jenis                          | †   | Alasan                                                                              | Keputusan Anda |
| --- | -------------------- | ----------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------- | ------------------------------ | --- | ----------------------------------------------------------------------------------- | -------------- |
| 1   | HHK-03 (pintu masuk) | Subkontrak hulu-hilir: toilet dan sanitasi sekolah          | Toilet, air bersih, dan septic tank selesai sebagai satu paket yang fungsinya teruji sebelum serah terima                         | Proyek utuh dari hulu ke hilir |     | Lingkup terkecil: toilet dan sanitasi sekolah, fungsinya diuji sebelum serah terima | tayang         |
| 2   | HHK-01               | Subkontrak hulu-hilir: rehabilitasi ruang kelas             | Satu pintu untuk tenaga, material, alat, dan laporan sehingga ruang kelas rusak selesai tanpa Anda mengurus pemasok satu per satu | Proyek utuh dari hulu ke hilir |     | “belum punya subkon yang sanggup menangani semuanya”: rehabilitasi ruang kelas      | tayang         |
| 3   | HHK-04               | Subkontrak hulu-hilir: atap, plafon, dan drainase gedung    | Kebocoran dan genangan tertangani dalam satu lingkup, bukan tiga subkon yang saling menunggu                                      | Proyek utuh dari hulu ke hilir |     | Atap, plafon, dan drainase dalam satu lingkup, bukan tiga subkon                    | tayang         |
| 4   | HHK-07               | Subkontrak hulu-hilir: drainase, gorong-gorong, dan saluran | Saluran air selesai dengan galian, pasangan, dan penutup dalam satu jadwal                                                        | Proyek utuh dari hulu ke hilir |     | Drainase dan saluran                                                                | tayang         |
| 5   | HHK-06               | Subkontrak hulu-hilir: jalan lingkungan cor beton           | Pembesian, pengecoran, dan pengaturan area kerja ditangani satu tim                                                               | Proyek utuh dari hulu ke hilir |     | Jalan lingkungan cor beton                                                          | tayang         |
| 6   | HHK-14               | Subkontrak gabungan lintas pekerjaan                        | Beberapa jenis pekerjaan dalam satu kontrak subkon sehingga Anda hanya mengelola satu pihak                                       | Proyek utuh dari hulu ke hilir |     | Beberapa pekerjaan dalam satu kontrak subkon                                        | tayang         |
| 7   | HHK-11               | Subkontrak hulu-hilir: ruko dan bangunan komersial          | Ruko dan bangunan komersial swasta dikerjakan dari struktur sampai finishing                                                      | Proyek utuh dari hulu ke hilir |     | Proyek swasta: ruko dan bangunan komersial                                          | tayang         |

<details><summary>Tidak diusulkan</summary>

| ID     | Judul                                                      | Alasan                                                                             |
| ------ | ---------------------------------------------------------- | ---------------------------------------------------------------------------------- |
| HHK-02 | Subkontrak hulu-hilir: pembangunan ruang kelas baru        | Tidak dipilih: jenisnya sudah diwakili offer yang lebih dekat ke kutipan bab       |
| HHK-05 | Subkontrak hulu-hilir: pagar, gapura, dan halaman          | Tidak dipilih: jenisnya sudah diwakili offer yang lebih dekat ke kutipan bab       |
| HHK-08 | Subkontrak hulu-hilir: talud dan pasangan batu             | Tidak dipilih: jenisnya sudah diwakili offer yang lebih dekat ke kutipan bab       |
| HHK-09 | Subkontrak hulu-hilir: kantor pelayanan dan balai warga    | Tidak dipilih: jenisnya sudah diwakili offer yang lebih dekat ke kutipan bab       |
| HHK-10 | Subkontrak hulu-hilir: lapangan dan fasilitas umum         | Tidak dipilih: jenisnya sudah diwakili offer yang lebih dekat ke kutipan bab       |
| HHK-12 | Subkontrak hulu-hilir: gudang dan bangunan industri ringan | Tidak dipilih: jenisnya sudah diwakili offer yang lebih dekat ke kutipan bab       |
| HHK-13 | Subkontrak paket besar lewat kerja sama operasi            | Cadangan: bertanda †, kerja sama operasi; pilih bila Anda ingin paket besar tampil |

</details>

Catatan: Urutan bab di halaman Pelaku proyek mengikuti D2: kontraktor utama lebih dulu, jadi bab ini dibuka pertama.

### Administrasi dengan pemerintah (modul A)

> “Dokumen menumpuk, tender terlewat, dan berkas termin selalu terlambat.”

**Keputusan:** Disetujui pemilik seperti diusulkan, 16 Oktober 2026.

6 dari 15 offer. Pintu masuk: **ADM-01**. Aturan: lolos.

| #   | ID                   | Judul untuk web                                     | Dampak untuk web                                                                                       | Jenis                          | †   | Alasan                                                           | Keputusan Anda |
| --- | -------------------- | --------------------------------------------------- | ------------------------------------------------------------------------------------------------------ | ------------------------------ | --- | ---------------------------------------------------------------- | -------------- |
| 1   | ADM-01 (pintu masuk) | Pemantauan paket tender regional                    | Paket baru di Subang, Purwakarta, dan Bandung terkumpul setiap minggu sehingga tidak ada yang terlewat | Bagian proyek yang kami ambil  |     | “tender terlewat”: paket di tiga wilayah terkumpul setiap minggu | tayang         |
| 2   | ADM-15               | Paket administrasi tender lengkap                   | Dari pemantauan sampai penawaran disiapkan satu tim sehingga Anda hanya memutuskan                     | Proyek utuh dari hulu ke hilir |     | Satu tim dari pemantauan sampai penawaran                        | tayang         |
| 3   | ADM-03               | Dokumen kualifikasi siap unggah                     | Berkas kualifikasi tersusun lengkap sebelum tenggat                                                    | Bagian proyek yang kami ambil  |     | “Dokumen menumpuk”: kualifikasi lengkap sebelum tenggat          | tayang         |
| 4   | ADM-12               | Berkas penagihan termin                             | Berkas penagihan termin disusun dan dijaga lengkap sampai diproses pemberi kerja.                      | Bagian proyek yang kami ambil  |     | “berkas termin selalu terlambat”                                 | tayang         |
| 5   | ADM-05               | Penawaran harga dengan RAB dan analisa harga satuan | Harga penawaran dihitung dari volume dan harga pasar yang bisa dipertanggungjawabkan                   | Bagian proyek yang kami ambil  |     | Harga penawaran dari volume dan harga pasar                      | tayang         |
| 6   | ADM-02               | Analisis kelayakan paket                            | Keputusan ikut atau lewati diambil dari syarat dan HPS, bukan dari firasat                             | Bagian proyek yang kami ambil  |     | Ikut atau lewati diputuskan dari syarat dan HPS                  | tayang         |

<details><summary>Tidak diusulkan</summary>

| ID     | Judul                                   | Alasan                                                                                      |
| ------ | --------------------------------------- | ------------------------------------------------------------------------------------------- |
| ADM-04 | Dokumen teknis penawaran                | Tidak dipilih: jenisnya sudah diwakili offer yang lebih dekat ke kutipan bab                |
| ADM-06 | Pendampingan klarifikasi dan pembuktian | Tidak dipilih: jenisnya sudah diwakili offer yang lebih dekat ke kutipan bab                |
| ADM-07 | Pendampingan sanggah                    | Tidak dipilih: jenisnya sudah diwakili offer yang lebih dekat ke kutipan bab                |
| ADM-08 | Pendampingan SBU dan SKK                | Tidak dipilih: bertanda †; sertifikasi lebih aman dibicarakan langsung daripada ditayangkan |
| ADM-09 | Pendampingan perizinan berusaha         | Tidak dipilih: jenisnya sudah diwakili offer yang lebih dekat ke kutipan bab                |
| ADM-10 | Pembaruan data penyedia tahunan         | Tidak dipilih: jenisnya sudah diwakili offer yang lebih dekat ke kutipan bab                |
| ADM-11 | Penyiapan dokumen kontrak dan adendum   | Tidak dipilih: jenisnya sudah diwakili offer yang lebih dekat ke kutipan bab                |
| ADM-13 | Dokumen serah terima pertama dan akhir  | Tidak dipilih: jenisnya sudah diwakili offer yang lebih dekat ke kutipan bab                |
| ADM-14 | Pendampingan pemeriksaan                | Tidak dipilih: jenisnya sudah diwakili offer yang lebih dekat ke kutipan bab                |

</details>

Catatan: Halaman bab memuat kalimat wajib tender: kami membantu menyiapkan berkas dan memahami aturan, bukan mengatur hasil; nama dan sertifikat tidak dipinjamkan.

### Tenaga kerja (modul B)

> “Tukang tidak datang tepat waktu dan tidak ada yang mengendalikan mereka di lapangan.”

**Keputusan:** Disetujui pemilik seperti diusulkan, 16 Oktober 2026.

6 dari 14 offer. Pintu masuk: **TNK-01**. Aturan: lolos.

| #   | ID                   | Judul untuk web                 | Dampak untuk web                                                                       | Jenis                         | †                                                                                      | Alasan                                                  | Keputusan Anda |
| --- | -------------------- | ------------------------------- | -------------------------------------------------------------------------------------- | ----------------------------- | -------------------------------------------------------------------------------------- | ------------------------------------------------------- | -------------- |
| 1   | TNK-01 (pintu masuk) | Tukang harian                   | Tukang batu, kayu, besi, atau cat datang sesuai jadwal                                 | Bagian proyek yang kami ambil |                                                                                        | “Tukang tidak datang tepat waktu”                       | tayang         |
| 2   | TNK-03               | Mandor pengendali tukang        | Tukang terkendali di lapangan setiap hari                                              | Bagian proyek yang kami ambil |                                                                                        | “tidak ada yang mengendalikan mereka di lapangan”       | tayang         |
| 3   | TNK-05               | Tim finishing                   | Cat, keramik, plafon, dan kusen selesai rapi oleh tim yang terbiasa                    | Bagian proyek yang kami ambil |                                                                                        | Tim finishing yang terbiasa                             | tayang         |
| 4   | TNK-12               | Penggajian tukang               | Absensi, rekap upah, dan pembayaran tukang berjalan tertib tanpa hitung manual         | Bagian proyek yang kami ambil |                                                                                        | Absensi dan upah tukang tertib                          | tayang         |
| 5   | TNK-14               | Tim siaga pekerjaan tambahan    | Kekurangan tenaga saat tenggat ketat ditutup tanpa merekrut tetap                      | Bagian proyek yang kami ambil |                                                                                        | Tenggat ketat tanpa merekrut tetap                      | tayang         |
| 6   | TNK-06               | Pelaksana dan pengawas lapangan | Pekerjaan dijalankan sesuai gambar dan spesifikasi oleh tenaga yang bekerja di lokasi. | Bagian proyek yang kami ambil | Tenaga ahli bekerja di lapangan proyek Anda; nama dan sertifikatnya tidak dipinjamkan. | Pelaksana di lokasi; bertanda †, nama tidak dipinjamkan | tayang         |

<details><summary>Tidak diusulkan</summary>

| ID     | Judul                         | Alasan                                                                       |
| ------ | ----------------------------- | ---------------------------------------------------------------------------- |
| TNK-02 | Tukang las dan fabrikasi besi | Tidak dipilih: jenisnya sudah diwakili offer yang lebih dekat ke kutipan bab |
| TNK-04 | Borongan upah per pekerjaan   | Tidak dipilih: jenisnya sudah diwakili offer yang lebih dekat ke kutipan bab |
| TNK-07 | Petugas K3 lapangan           | Tidak dipilih: jenisnya sudah diwakili offer yang lebih dekat ke kutipan bab |
| TNK-08 | Admin dan logistik lapangan   | Tidak dipilih: jenisnya sudah diwakili offer yang lebih dekat ke kutipan bab |
| TNK-09 | Tim survei dan pengukuran     | Tidak dipilih: jenisnya sudah diwakili offer yang lebih dekat ke kutipan bab |
| TNK-10 | Operator alat                 | Tidak dipilih: jenisnya sudah diwakili offer yang lebih dekat ke kutipan bab |
| TNK-11 | Tim bongkar dan pembersihan   | Tidak dipilih: jenisnya sudah diwakili offer yang lebih dekat ke kutipan bab |
| TNK-13 | Mobilisasi pekerja            | Tidak dipilih: jenisnya sudah diwakili offer yang lebih dekat ke kutipan bab |

</details>

### Material: harga dan penjadwalan (modul C)

> “Harga material bergeser, barang telat, dan jadwalnya tidak sinkron dengan pekerjaan.”

**Keputusan:** Disetujui pemilik seperti diusulkan, 16 Oktober 2026.

6 dari 14 offer. Pintu masuk: **MAT-01**. Aturan: lolos.

| #   | ID                   | Judul untuk web                   | Dampak untuk web                                                                     | Jenis                         | †   | Alasan                                                         | Keputusan Anda |
| --- | -------------------- | --------------------------------- | ------------------------------------------------------------------------------------ | ----------------------------- | --- | -------------------------------------------------------------- | -------------- |
| 1   | MAT-01 (pintu masuk) | Daftar harga material regional    | Harga material di tiga wilayah diperbarui berkala sebagai pegangan RAB dan negosiasi | Bagian proyek yang kami ambil |     | “Harga material bergeser”: harga tiga wilayah sebagai pegangan | tayang         |
| 2   | MAT-04               | Pengadaan material harga jaringan | Material dibeli dengan harga jaringan pemasok                                        | Barang dan material           |     | Material dengan harga jaringan pemasok                         | tayang         |
| 3   | MAT-03               | Jadwal material per tahap         | Material tiba saat dibutuhkan, tidak terlalu cepat dan tidak terlambat               | Bagian proyek yang kami ambil |     | “jadwalnya tidak sinkron”: material per tahap                  | tayang         |
| 4   | MAT-08               | Pengiriman material ke lokasi     | Angkutan material sampai lokasi sesuai ritase                                        | Barang dan material           |     | “barang telat”: angkutan sampai lokasi                         | tayang         |
| 5   | MAT-14               | Perbandingan penawaran pemasok    | Tiga penawaran dibandingkan sebelum keputusan membeli                                | Bagian proyek yang kami ambil |     | Tiga penawaran dibandingkan sebelum membeli                    | tayang         |
| 6   | MAT-10               | Stok opname material lapangan     | Material masuk, terpakai, dan sisa tercatat                                          | Bagian proyek yang kami ambil |     | Material masuk, terpakai, dan sisa tercatat                    | tayang         |

<details><summary>Tidak diusulkan</summary>

| ID     | Judul                           | Alasan                                                                       |
| ------ | ------------------------------- | ---------------------------------------------------------------------------- |
| MAT-02 | Kebutuhan material dari RAB     | Tidak dipilih: jenisnya sudah diwakili offer yang lebih dekat ke kutipan bab |
| MAT-05 | Material curah                  | Tidak dipilih: jenisnya sudah diwakili offer yang lebih dekat ke kutipan bab |
| MAT-06 | Material pabrikasi              | Tidak dipilih: jenisnya sudah diwakili offer yang lebih dekat ke kutipan bab |
| MAT-07 | Beton siap pakai                | Tidak dipilih: jenisnya sudah diwakili offer yang lebih dekat ke kutipan bab |
| MAT-09 | Gudang material sementara       | Tidak dipilih: jenisnya sudah diwakili offer yang lebih dekat ke kutipan bab |
| MAT-11 | Koordinasi uji mutu material    | Tidak dipilih: jenisnya sudah diwakili offer yang lebih dekat ke kutipan bab |
| MAT-12 | Penjualan sisa material         | Tidak dipilih: jenisnya sudah diwakili offer yang lebih dekat ke kutipan bab |
| MAT-13 | Perabot dan perlengkapan gedung | Tidak dipilih: jenisnya sudah diwakili offer yang lebih dekat ke kutipan bab |

</details>

### Modal kerja lewat penjembatanan (modul D)

> “Uang muka belum cair, material harus dibayar dulu, dan tagihan termin belum turun.”

**Keputusan:** Disetujui pemilik seperti diusulkan, 16 Oktober 2026.

5 dari 8 offer. Pintu masuk: **MOD-06**. Aturan: lolos.

| #   | ID                   | Judul untuk web                           | Dampak untuk web                                                                       | Jenis                                | †                                                                         | Alasan                                                        | Keputusan Anda |
| --- | -------------------- | ----------------------------------------- | -------------------------------------------------------------------------------------- | ------------------------------------ | ------------------------------------------------------------------------- | ------------------------------------------------------------- | -------------- |
| 1   | MOD-06 (pintu masuk) | Rencana arus kas proyek                   | Kebutuhan kas dan jadwal termin terproyeksi sebelum kerja dimulai                      | Bagian proyek yang kami ambil        |                                                                           | Lingkup terkecil: kebutuhan kas dan jadwal termin terproyeksi | tayang         |
| 2   | MOD-01               | Tempo material                            | Material datang sekarang dan dibayar sesuai termin                                     | Modal, alat, dan jaminan lewat mitra |                                                                           | “material harus dibayar dulu”: tempo material                 | tayang         |
| 3   | MOD-04               | Pembiayaan tagihan termin lewat mitra     | Tagihan termin yang belum cair diajukan ke mitra pembiayaan untuk dibiayai lebih dulu. | Modal, alat, dan jaminan lewat mitra | Kami tidak memberi pinjaman; pembiayaan dan syaratnya dari mitra berizin. | “tagihan termin belum turun”: bertanda †, lewat mitra berizin | tayang         |
| 4   | MOD-03               | Pembiayaan proyek lewat mitra             | Kebutuhan alat atau proyek dihubungkan ke mitra pembiayaan                             | Modal, alat, dan jaminan lewat mitra | Kami tidak memberi pinjaman; pembiayaan dan syaratnya dari mitra berizin. | “Uang muka belum cair”: bertanda †, lewat mitra berizin       | tayang         |
| 5   | MOD-08               | Pembiayaan alat dan kendaraan lewat mitra | Alat dan kendaraan kerja dibiayai lewat mitra, sehingga kas proyek tidak tertahan.     | Modal, alat, dan jaminan lewat mitra | Kami tidak memberi pinjaman; pembiayaan dan syaratnya dari mitra berizin. | Alat dan kendaraan lewat mitra; bertanda †                    | tayang         |

<details><summary>Tidak diusulkan</summary>

| ID     | Judul                                 | Alasan                                                |
| ------ | ------------------------------------- | ----------------------------------------------------- |
| MOD-02 | Jaminan proyek lewat mitra penjamin   | Mitra penjamin belum ada (master brief, jalur komisi) |
| MOD-05 | Kerja sama operasi untuk proyek besar | Cadangan: kerja sama operasi bertanda †               |
| MOD-07 | Asuransi proyek lewat mitra           | Mitra asuransi belum ada                              |

</details>

Catatan: Mekanisme modal kerja belum diputuskan; bab ini ditulis sebagai penjembatanan lewat mitra, sesuai saran master brief. Halaman memuat kalimat wajib: kami tidak memberi pinjaman, pembiayaan dan jaminan berjalan lewat mitra berizin, dan komisi mitra diungkapkan.

### Alat dan peralatan (modul E)

> “Saya butuh alat hanya beberapa hari dan tidak mau membelinya.”

**Keputusan:** Disetujui pemilik seperti diusulkan, 16 Oktober 2026.

4 dari 6 offer. Pintu masuk: **ALT-02**. Aturan: lolos.

| #   | ID                   | Judul untuk web                         | Dampak untuk web                                                           | Jenis                          | †   | Alasan                                                                   | Keputusan Anda |
| --- | -------------------- | --------------------------------------- | -------------------------------------------------------------------------- | ------------------------------ | --- | ------------------------------------------------------------------------ | -------------- |
| 1   | ALT-02 (pintu masuk) | Sewa peralatan ringan                   | Molen, stamper, dan perancah tersedia per hari                             | Bagian proyek yang kami ambil  |     | “Saya butuh alat hanya beberapa hari”: molen, stamper, perancah per hari | tayang         |
| 2   | ALT-04               | Paket alat siap kerja                   | Alat lengkap dengan operator dan BBM dalam satu harga harian               | Proyek utuh dari hulu ke hilir |     | Alat dengan operator dan BBM dalam satu harga harian                     | tayang         |
| 3   | ALT-03               | Mobilisasi alat                         | Alat diantar ke lokasi dan dijemput kembali sesuai jadwal yang disepakati. | Bagian proyek yang kami ambil  |     | Alat diantar dan dijemput sesuai jadwal                                  | tayang         |
| 4   | ALT-05               | Pemeriksaan kelaikan alat sebelum kerja | Alat diperiksa sebelum dipakai untuk mencegah henti kerja dan kecelakaan   | Bagian proyek yang kami ambil  |     | Alat diperiksa sebelum dipakai                                           | tayang         |

<details><summary>Tidak diusulkan</summary>

| ID     | Judul                                 | Alasan                                                             |
| ------ | ------------------------------------- | ------------------------------------------------------------------ |
| ALT-01 | Sewa alat berat lewat mitra           | Mitra sewa alat berat belum ada (master brief, jalur komisi)       |
| ALT-06 | Pemakaian alat bergantian antarproyek | Tidak dipilih: mengandaikan alat milik sendiri yang belum tercatat |

</details>

Catatan: Paket alat siap kerja ditulis tanpa alat berat sampai mitra sewa alat berat ada.

### Administrasi internal proyek (modul F)

> “Laporan lewat chat, kurva S tidak jelas, dan biaya lapangan tidak terpantau.”

**Keputusan:** Disetujui pemilik seperti diusulkan, 16 Oktober 2026.

6 dari 15 offer. Pintu masuk: **PRJ-04**. Aturan: lolos.

| #   | ID                   | Judul untuk web                       | Dampak untuk web                                                                    | Jenis                         | †   | Alasan                                               | Keputusan Anda |
| --- | -------------------- | ------------------------------------- | ----------------------------------------------------------------------------------- | ----------------------------- | --- | ---------------------------------------------------- | -------------- |
| 1   | PRJ-04 (pintu masuk) | Dokumentasi foto progres              | Foto 0, 50, dan 100 persen tersusun rapi sebagai bukti                              | Bagian proyek yang kami ambil |     | Lingkup terkecil: foto progres 0, 50, dan 100 persen | tayang         |
| 2   | PRJ-03               | Laporan harian, mingguan, dan bulanan | Laporan disusun dalam format pemberi kerja, sesuai jadwal pelaporannya.             | Bagian proyek yang kami ambil |     | “Laporan lewat chat”: format pemberi kerja           | tayang         |
| 3   | PRJ-02               | Jadwal dan kurva S                    | Rencana dan kemajuan proyek terlihat setiap minggu                                  | Bagian proyek yang kami ambil |     | “kurva S tidak jelas”                                | tayang         |
| 4   | PRJ-07               | Pengendalian biaya proyek             | Anggaran dibandingkan realisasi setiap bulan                                        | Bagian proyek yang kami ambil |     | “biaya lapangan tidak terpantau”                     | tayang         |
| 5   | PRJ-05               | Perhitungan volume dan mutual check   | Opname volume untuk termin dan perubahan disepakati bersama                         | Bagian proyek yang kami ambil |     | Opname volume untuk termin                           | tayang         |
| 6   | PRJ-14               | Sistem laporan proyek digital         | Laporan lapangan dan dasbor progres berjalan dari ponsel, dikerjakan unit teknologi | Bagian proyek yang kami ambil |     | Laporan dari ponsel; jembatan ke unit Teknologi      | tayang         |

<details><summary>Tidak diusulkan</summary>

| ID     | Judul                             | Alasan                                                                       |
| ------ | --------------------------------- | ---------------------------------------------------------------------------- |
| PRJ-01 | RAB pelaksanaan                   | Tidak dipilih: jenisnya sudah diwakili offer yang lebih dekat ke kutipan bab |
| PRJ-06 | Gambar kerja dan gambar terpasang | Tidak dipilih: jenisnya sudah diwakili offer yang lebih dekat ke kutipan bab |
| PRJ-08 | Buku kas proyek                   | Tidak dipilih: jenisnya sudah diwakili offer yang lebih dekat ke kutipan bab |
| PRJ-09 | Kontrak subkon dan SPK tukang     | Tidak dipilih: jenisnya sudah diwakili offer yang lebih dekat ke kutipan bab |
| PRJ-10 | Pengelolaan perubahan pekerjaan   | Tidak dipilih: jenisnya sudah diwakili offer yang lebih dekat ke kutipan bab |
| PRJ-11 | Dokumen keselamatan kerja         | Tidak dipilih: jenisnya sudah diwakili offer yang lebih dekat ke kutipan bab |
| PRJ-12 | Rapat koordinasi dan notulen      | Tidak dipilih: jenisnya sudah diwakili offer yang lebih dekat ke kutipan bab |
| PRJ-13 | Uji fungsi sebelum serah terima   | Tidak dipilih: jenisnya sudah diwakili offer yang lebih dekat ke kutipan bab |
| PRJ-15 | Arsip dokumen proyek digital      | Tidak dipilih: jenisnya sudah diwakili offer yang lebih dekat ke kutipan bab |

</details>

### Konsultan pengadaan untuk penyedia barang (modul G)

> “Saya penyedia, tetapi bingung mencari barang dengan margin sehat dan mengurus TKDN.”

**Keputusan:** Disetujui pemilik seperti diusulkan, 16 Oktober 2026.

6 dari 13 offer. Pintu masuk: **PNY-01**. Aturan: lolos.

| #   | ID                   | Judul untuk web                        | Dampak untuk web                                                               | Jenis                         | †                                                              | Alasan                                                 | Keputusan Anda |
| --- | -------------------- | -------------------------------------- | ------------------------------------------------------------------------------ | ----------------------------- | -------------------------------------------------------------- | ------------------------------------------------------ | -------------- |
| 1   | PNY-01 (pintu masuk) | Riset sumber barang                    | Pemasok dan produsen dengan harga pembanding ditemukan sebelum Anda menawar    | Bagian proyek yang kami ambil |                                                                | “bingung mencari barang”: sumber dan harga pembanding  | tayang         |
| 2   | PNY-02               | Produksi barang lewat mitra            | Barang diproduksi sesuai spesifikasi dengan margin yang terjaga dari efisiensi | Barang dan material           |                                                                | Barang diproduksi lewat mitra sesuai spesifikasi       | tayang         |
| 3   | PNY-07               | Pendampingan TKDN                      | Pengajuan sertifikat tingkat komponen dalam negeri terarah                     | Bagian proyek yang kami ambil |                                                                | “mengurus TKDN”                                        | tayang         |
| 4   | PNY-12               | Analisis margin per barang             | Margin dihitung dari harga sumber, ongkos, dan risiko sebelum menawar.         | Bagian proyek yang kami ambil | Keuntungan dalam HPS dijaga wajar dan dapat diperiksa auditor. | “margin sehat”: bertanda †, keuntungan wajar dalam HPS | tayang         |
| 5   | PNY-08               | Pengelolaan etalase katalog elektronik | Produk tayang dengan harga yang terus diperbarui                               | Bagian proyek yang kami ambil |                                                                | Etalase katalog elektronik terurus                     | tayang         |
| 6   | PNY-03               | Pengendalian mutu sebelum kirim        | Barang diperiksa sebelum diserahkan                                            | Bagian proyek yang kami ambil |                                                                | Barang diperiksa sebelum dikirim                       | tayang         |

<details><summary>Tidak diusulkan</summary>

| ID     | Judul                                            | Alasan                                                                       |
| ------ | ------------------------------------------------ | ---------------------------------------------------------------------------- |
| PNY-04 | Pengemasan dan pelabelan                         | Tidak dipilih: jenisnya sudah diwakili offer yang lebih dekat ke kutipan bab |
| PNY-05 | Pengiriman ke instansi                           | Tidak dipilih: jenisnya sudah diwakili offer yang lebih dekat ke kutipan bab |
| PNY-06 | Dokumen spesifikasi dan kesesuaian               | Tidak dipilih: jenisnya sudah diwakili offer yang lebih dekat ke kutipan bab |
| PNY-09 | Pendampingan e-purchasing dan pengadaan langsung | Tidak dipilih: jenisnya sudah diwakili offer yang lebih dekat ke kutipan bab |
| PNY-10 | Garansi dan purna jual barang                    | Tidak dipilih: jenisnya sudah diwakili offer yang lebih dekat ke kutipan bab |
| PNY-11 | Berkas penagihan barang                          | Tidak dipilih: jenisnya sudah diwakili offer yang lebih dekat ke kutipan bab |
| PNY-13 | Konsultasi peran penyedia atau konsultan         | Tidak dipilih: jenisnya sudah diwakili offer yang lebih dekat ke kutipan bab |

</details>

Catatan: Konsultan pengadaan hanya melayani paket yang bukan milik Arthur (Konstruksi aturan 3); halaman menyebutnya.

### Arthur sebagai penyedia untuk instansi (modul G)

> “Kami butuh barang sesuai spesifikasi, tepat waktu, dan dengan dokumen lengkap.”

**Keputusan:** Disetujui pemilik seperti diusulkan, 16 Oktober 2026.

6 dari 8 offer. Pintu masuk: **GOV-03**. Aturan: lolos.

| #   | ID                   | Judul untuk web                                    | Dampak untuk web                                                            | Jenis                          | †   | Alasan                                                 | Keputusan Anda |
| --- | -------------------- | -------------------------------------------------- | --------------------------------------------------------------------------- | ------------------------------ | --- | ------------------------------------------------------ | -------------- |
| 1   | GOV-03 (pintu masuk) | Pengadaan papan nama, signage, dan papan informasi | Papan dan penanda dibuat sesuai ukuran dan spesifikasi                      | Barang dan material            |     | Lingkup terkecil: papan nama dan signage               | tayang         |
| 2   | GOV-07               | Paket barang dan pemasangan                        | Barang datang bersama pemasangan sehingga instansi menerima yang siap pakai | Proyek utuh dari hulu ke hilir |     | “barang sesuai spesifikasi”: datang bersama pemasangan | tayang         |
| 3   | GOV-01               | Pengadaan perabot sekolah                          | Meja, kursi, dan lemari diadakan sesuai spesifikasi dan jadwal pengadaan.   | Barang dan material            |     | Perabot sekolah                                        | tayang         |
| 4   | GOV-02               | Pengadaan perabot dan perlengkapan kantor          | Perabot kantor dan ruang pelayanan sesuai spesifikasi                       | Barang dan material            |     | Perabot dan perlengkapan kantor                        | tayang         |
| 5   | GOV-06               | Pengadaan lewat e-purchasing                       | Barang tayang di etalase dan dipesan instansi secara langsung               | Barang dan material            |     | Dipesan langsung lewat e-purchasing                    | tayang         |
| 6   | GOV-08               | Purna jual dan garansi untuk instansi              | Klaim garansi ditangani sehingga barang tidak menganggur                    | Barang dan material            |     | Klaim garansi ditangani                                | tayang         |

<details><summary>Tidak diusulkan</summary>

| ID     | Judul                                      | Alasan                                                                       |
| ------ | ------------------------------------------ | ---------------------------------------------------------------------------- |
| GOV-04 | Pengadaan material paket kecil             | Tidak dipilih: jenisnya sudah diwakili offer yang lebih dekat ke kutipan bab |
| GOV-05 | Pengadaan seragam dan perlengkapan petugas | Mitra konveksi belum ada (master brief, jalur komisi)                        |

</details>

### Developer perumahan (modul H)

> “Unit selesai tetapi finishing telat, komplain menumpuk, dan laporan untuk bank belum siap.”

**Keputusan:** Disetujui pemilik seperti diusulkan, 16 Oktober 2026.

6 dari 10 offer. Pintu masuk: **DEV-05**. Aturan: lolos.

| #   | ID                   | Judul untuk web                     | Dampak untuk web                                                        | Jenis                          | †   | Alasan                                                          | Keputusan Anda |
| --- | -------------------- | ----------------------------------- | ----------------------------------------------------------------------- | ------------------------------ | --- | --------------------------------------------------------------- | -------------- |
| 1   | DEV-05 (pintu masuk) | Pemeriksaan sebelum serah terima    | Daftar periksa dan perbaikan tiap unit sebelum diserahkan               | Bagian proyek yang kami ambil  |     | Lingkup terkecil: daftar periksa tiap unit sebelum serah terima | tayang         |
| 2   | DEV-02               | Finishing per unit                  | Unit sampai siap serah terima dengan finishing rapi                     | Proyek utuh dari hulu ke hilir |     | “finishing telat”                                               | tayang         |
| 3   | DEV-07               | Pemeliharaan kawasan masa jaminan   | Kawasan dirawat sampai diserahkan ke pengelola                          | Perawatan berkala              |     | Kawasan dirawat sampai diserahkan ke pengelola                  | tayang         |
| 4   | DEV-06               | Perbaikan komplain pembeli          | Cacat yang dilaporkan pembeli diperbaiki cepat                          | Bagian proyek yang kami ambil  |     | “komplain menumpuk”                                             | tayang         |
| 5   | DEV-09               | Laporan progres untuk pencairan KPR | Laporan per unit tersusun untuk bank pemberi KPR                        | Bagian proyek yang kami ambil  |     | “laporan untuk bank belum siap”                                 | tayang         |
| 6   | DEV-01               | Borongan per unit rumah             | Tenaga dan material per tipe unit dengan harga per unit yang disepakati | Proyek utuh dari hulu ke hilir |     | Borongan per unit dengan harga yang disepakati                  | tayang         |

<details><summary>Tidak diusulkan</summary>

| ID     | Judul                                         | Alasan                                                                       |
| ------ | --------------------------------------------- | ---------------------------------------------------------------------------- |
| DEV-03 | Rumah contoh                                  | Tidak dipilih: jenisnya sudah diwakili offer yang lebih dekat ke kutipan bab |
| DEV-04 | Prasarana perumahan                           | Tidak dipilih: jenisnya sudah diwakili offer yang lebih dekat ke kutipan bab |
| DEV-08 | Pendampingan PBG                              | Tidak dipilih: jenisnya sudah diwakili offer yang lebih dekat ke kutipan bab |
| DEV-10 | Pembersihan lahan dan pekerjaan tanah kavling | Tidak dipilih: jenisnya sudah diwakili offer yang lebih dekat ke kutipan bab |

</details>

### Kontraktor swasta (lapis 2)

> “Proyek swasta saya kekurangan tenaga dan material tepat waktu.”

**Keputusan:** Disetujui pemilik seperti diusulkan, 16 Oktober 2026.

6 dari 8 offer. Pintu masuk: **KSW-01**. Aturan: lolos.

| #   | ID                   | Judul untuk web                             | Dampak untuk web                                      | Jenis                                | †   | Alasan                                                | Keputusan Anda |
| --- | -------------------- | ------------------------------------------- | ----------------------------------------------------- | ------------------------------------ | --- | ----------------------------------------------------- | -------------- |
| 1   | KSW-01 (pintu masuk) | Tim tukang dan mandor untuk proyek renovasi | Tenaga renovasi tersedia dengan pengendali lapangan   | Bagian proyek yang kami ambil        |     | “kekurangan tenaga”: tukang dan mandor untuk renovasi | tayang         |
| 2   | KSW-02               | Material tepat waktu untuk proyek bertahap  | Material dijadwalkan per tahap dan dikirim ke lokasi  | Barang dan material                  |     | “material tepat waktu”                                | tayang         |
| 3   | KSW-04               | Paket finishing untuk proyek klien Anda     | Tim finishing dan material finishing dalam satu paket | Proyek utuh dari hulu ke hilir       |     | Finishing dan materialnya dalam satu paket            | tayang         |
| 4   | KSW-03               | Modal kerja lewat tempo material            | Proyek berjalan tanpa menahan kas                     | Modal, alat, dan jaminan lewat mitra |     | Tempo material lewat mitra                            | tayang         |
| 5   | KSW-08               | Pengawasan mutu untuk proyek Anda           | Mutu pekerjaan tukang diawasi sebelum serah terima    | Bagian proyek yang kami ambil        |     | Mutu diawasi sebelum serah terima                     | tayang         |
| 6   | KSW-06               | RAB dan jadwal untuk penawaran swasta       | Penawaran ke klien swasta dilengkapi RAB dan jadwal   | Bagian proyek yang kami ambil        |     | RAB dan jadwal untuk penawaran ke klien               | tayang         |

<details><summary>Tidak diusulkan</summary>

| ID     | Judul                                  | Alasan                                                                       |
| ------ | -------------------------------------- | ---------------------------------------------------------------------------- |
| KSW-05 | Alat siap kerja untuk proyek swasta    | Tidak dipilih: jenisnya sudah diwakili offer yang lebih dekat ke kutipan bab |
| KSW-07 | Cadangan kapasitas untuk proyek swasta | Tidak dipilih: jenisnya sudah diwakili offer yang lebih dekat ke kutipan bab |

</details>

### Paket rakitan menurut profil pembeli

**Keputusan:** Disetujui pemilik seperti diusulkan, 16 Oktober 2026.

7 dari 17 offer. Pintu masuk: **RAK-09**. Aturan: lolos.

| #   | ID                   | Judul untuk web                | Dampak untuk web                                                                          | Jenis                                            | †   | Alasan                                                             | Keputusan Anda |
| --- | -------------------- | ------------------------------ | ----------------------------------------------------------------------------------------- | ------------------------------------------------ | --- | ------------------------------------------------------------------ | -------------- |
| 1   | RAK-09 (pintu masuk) | Paket Tenaga Siaga             | Tenaga terkendali dan terbayar tertib                                                     | Paket yang disusun menurut posisi Anda di proyek |     | Lingkup terkecil: tenaga terkendali dan terbayar tertib            | tayang         |
| 2   | RAK-01               | Paket Tender Pertama           | Proyek pertama berjalan tertib dari kontrak sampai laporan                                | Paket yang disusun menurut posisi Anda di proyek |     | Kontraktor utama dengan tender pertama                             | tayang         |
| 3   | RAK-03               | Paket Termin Lancar            | Opname dan berkas termin disiapkan sebelum termin diajukan.                               | Paket yang disusun menurut posisi Anda di proyek |     | Termin tertunda karena berkas; contoh kalibrasi yang sudah ditulis | tayang         |
| 4   | RAK-08               | Paket Subkon Lepas Landas      | Pekerjaan pertama selesai tanpa kas terkuras                                              | Paket yang disusun menurut posisi Anda di proyek |     | Subkon baru                                                        | tayang         |
| 5   | RAK-10               | Paket Harga Material Terpegang | Pembelian material berdasar harga yang dipantau                                           | Paket yang disusun menurut posisi Anda di proyek |     | Harga material yang terus bergeser                                 | tayang         |
| 6   | RAK-16               | Paket Serah Terima Unit        | Setiap unit diperiksa dan dirapikan, dan keluhan pembeli diperbaiki sebelum serah terima. | Paket yang disusun menurut posisi Anda di proyek |     | Developer menjelang serah terima unit                              | tayang         |
| 7   | RAK-12               | Paket Etalase Siap             | Produk tayang dengan dokumen pendukung                                                    | Paket yang disusun menurut posisi Anda di proyek |     | Penyedia baru di katalog elektronik                                | tayang         |

<details><summary>Tidak diusulkan</summary>

| ID     | Judul                          | Alasan                                                                       |
| ------ | ------------------------------ | ---------------------------------------------------------------------------- |
| RAK-02 | Paket Multi-Proyek             | Tidak dipilih: jenisnya sudah diwakili offer yang lebih dekat ke kutipan bab |
| RAK-04 | Paket Serah Terima Mulus       | Tidak dipilih: dampak “tanpa temuan berulang” ada di tangan pemeriksa        |
| RAK-05 | Paket Siap Pemeriksaan         | Tidak dipilih: jenisnya sudah diwakili offer yang lebih dekat ke kutipan bab |
| RAK-06 | Paket Tender Ramai             | Tidak dipilih: jenisnya sudah diwakili offer yang lebih dekat ke kutipan bab |
| RAK-07 | Paket Modal Berjalan           | Menunggu keputusan mekanisme modal kerja                                     |
| RAK-11 | Paket Administrasi Ringan      | Tidak dipilih: jenisnya sudah diwakili offer yang lebih dekat ke kutipan bab |
| RAK-13 | Paket Mutu Terjaga             | Tidak dipilih: dampak “tanpa retur” ada di tangan instansi                   |
| RAK-14 | Paket Sumber Barang dan Margin | Tidak dipilih: jenisnya sudah diwakili offer yang lebih dekat ke kutipan bab |
| RAK-15 | Paket Kawasan Perdana          | Tidak dipilih: jenisnya sudah diwakili offer yang lebih dekat ke kutipan bab |
| RAK-17 | Paket Renovasi Berjalan        | Tidak dipilih: jenisnya sudah diwakili offer yang lebih dekat ke kutipan bab |

</details>

Catatan: Tujuh paket mewakili tujuh posisi pembeli; paket lain tetap bisa dirakit lewat percakapan.

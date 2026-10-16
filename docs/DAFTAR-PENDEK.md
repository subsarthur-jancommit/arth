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

7 dari 14 offer. Pintu masuk: **HHK-03**. Aturan: lolos.

| #   | ID                   | Judul untuk web                                             | Dampak untuk web                                                                                                                  | Jenis                          | †   | Alasan                                                                              | Keputusan Anda |
| --- | -------------------- | ----------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------- | ------------------------------ | --- | ----------------------------------------------------------------------------------- | -------------- |
| 1   | HHK-03 (pintu masuk) | Subkontrak hulu-hilir: toilet dan sanitasi sekolah          | Toilet, air bersih, dan septic tank selesai sebagai satu paket yang fungsinya teruji sebelum serah terima                         | Proyek utuh dari hulu ke hilir |     | Lingkup terkecil: toilet dan sanitasi sekolah, fungsinya diuji sebelum serah terima | tayang / tahan |
| 2   | HHK-01               | Subkontrak hulu-hilir: rehabilitasi ruang kelas             | Satu pintu untuk tenaga, material, alat, dan laporan sehingga ruang kelas rusak selesai tanpa Anda mengurus pemasok satu per satu | Proyek utuh dari hulu ke hilir |     | “belum punya subkon yang sanggup menangani semuanya”: rehabilitasi ruang kelas      | tayang / tahan |
| 3   | HHK-04               | Subkontrak hulu-hilir: atap, plafon, dan drainase gedung    | Kebocoran dan genangan tertangani dalam satu lingkup, bukan tiga subkon yang saling menunggu                                      | Proyek utuh dari hulu ke hilir |     | Atap, plafon, dan drainase dalam satu lingkup, bukan tiga subkon                    | tayang / tahan |
| 4   | HHK-07               | Subkontrak hulu-hilir: drainase, gorong-gorong, dan saluran | Saluran air selesai dengan galian, pasangan, dan penutup dalam satu jadwal                                                        | Proyek utuh dari hulu ke hilir |     | Drainase dan saluran                                                                | tayang / tahan |
| 5   | HHK-06               | Subkontrak hulu-hilir: jalan lingkungan cor beton           | Pembesian, pengecoran, dan pengaturan area kerja ditangani satu tim                                                               | Proyek utuh dari hulu ke hilir |     | Jalan lingkungan cor beton                                                          | tayang / tahan |
| 6   | HHK-14               | Subkontrak gabungan lintas pekerjaan                        | Beberapa jenis pekerjaan dalam satu kontrak subkon sehingga Anda hanya mengelola satu pihak                                       | Proyek utuh dari hulu ke hilir |     | Beberapa pekerjaan dalam satu kontrak subkon                                        | tayang / tahan |
| 7   | HHK-11               | Subkontrak hulu-hilir: ruko dan bangunan komersial          | Ruko dan bangunan komersial swasta dikerjakan dari struktur sampai finishing                                                      | Proyek utuh dari hulu ke hilir |     | Proyek swasta: ruko dan bangunan komersial                                          | tayang / tahan |

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

6 dari 15 offer. Pintu masuk: **ADM-01**. Aturan: lolos.

| #   | ID                   | Judul untuk web                                     | Dampak untuk web                                                                                       | Jenis                          | †   | Alasan                                                           | Keputusan Anda |
| --- | -------------------- | --------------------------------------------------- | ------------------------------------------------------------------------------------------------------ | ------------------------------ | --- | ---------------------------------------------------------------- | -------------- |
| 1   | ADM-01 (pintu masuk) | Pemantauan paket tender regional                    | Paket baru di Subang, Purwakarta, dan Bandung terkumpul setiap minggu sehingga tidak ada yang terlewat | Bagian proyek yang kami ambil  |     | “tender terlewat”: paket di tiga wilayah terkumpul setiap minggu | tayang / tahan |
| 2   | ADM-15               | Paket administrasi tender lengkap                   | Dari pemantauan sampai penawaran disiapkan satu tim sehingga Anda hanya memutuskan                     | Proyek utuh dari hulu ke hilir |     | Satu tim dari pemantauan sampai penawaran                        | tayang / tahan |
| 3   | ADM-03               | Dokumen kualifikasi siap unggah                     | Berkas kualifikasi tersusun lengkap sebelum tenggat                                                    | Bagian proyek yang kami ambil  |     | “Dokumen menumpuk”: kualifikasi lengkap sebelum tenggat          | tayang / tahan |
| 4   | ADM-12               | Berkas penagihan termin                             | Berkas penagihan termin disusun dan dijaga lengkap sampai diproses pemberi kerja.                      | Bagian proyek yang kami ambil  |     | “berkas termin selalu terlambat”                                 | tayang / tahan |
| 5   | ADM-05               | Penawaran harga dengan RAB dan analisa harga satuan | Harga penawaran dihitung dari volume dan harga pasar yang bisa dipertanggungjawabkan                   | Bagian proyek yang kami ambil  |     | Harga penawaran dari volume dan harga pasar                      | tayang / tahan |
| 6   | ADM-02               | Analisis kelayakan paket                            | Keputusan ikut atau lewati diambil dari syarat dan HPS, bukan dari firasat                             | Bagian proyek yang kami ambil  |     | Ikut atau lewati diputuskan dari syarat dan HPS                  | tayang / tahan |

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

6 dari 14 offer. Pintu masuk: **TNK-01**. Aturan: lolos.

| #   | ID                   | Judul untuk web                 | Dampak untuk web                                                                       | Jenis                         | †                                                                                      | Alasan                                                  | Keputusan Anda |
| --- | -------------------- | ------------------------------- | -------------------------------------------------------------------------------------- | ----------------------------- | -------------------------------------------------------------------------------------- | ------------------------------------------------------- | -------------- |
| 1   | TNK-01 (pintu masuk) | Tukang harian                   | Tukang batu, kayu, besi, atau cat datang sesuai jadwal                                 | Bagian proyek yang kami ambil |                                                                                        | “Tukang tidak datang tepat waktu”                       | tayang / tahan |
| 2   | TNK-03               | Mandor pengendali tukang        | Tukang terkendali di lapangan setiap hari                                              | Bagian proyek yang kami ambil |                                                                                        | “tidak ada yang mengendalikan mereka di lapangan”       | tayang / tahan |
| 3   | TNK-05               | Tim finishing                   | Cat, keramik, plafon, dan kusen selesai rapi oleh tim yang terbiasa                    | Bagian proyek yang kami ambil |                                                                                        | Tim finishing yang terbiasa                             | tayang / tahan |
| 4   | TNK-12               | Penggajian tukang               | Absensi, rekap upah, dan pembayaran tukang berjalan tertib tanpa hitung manual         | Bagian proyek yang kami ambil |                                                                                        | Absensi dan upah tukang tertib                          | tayang / tahan |
| 5   | TNK-14               | Tim siaga pekerjaan tambahan    | Kekurangan tenaga saat tenggat ketat ditutup tanpa merekrut tetap                      | Bagian proyek yang kami ambil |                                                                                        | Tenggat ketat tanpa merekrut tetap                      | tayang / tahan |
| 6   | TNK-06               | Pelaksana dan pengawas lapangan | Pekerjaan dijalankan sesuai gambar dan spesifikasi oleh tenaga yang bekerja di lokasi. | Bagian proyek yang kami ambil | Tenaga ahli bekerja di lapangan proyek Anda; nama dan sertifikatnya tidak dipinjamkan. | Pelaksana di lokasi; bertanda †, nama tidak dipinjamkan | tayang / tahan |

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

6 dari 14 offer. Pintu masuk: **MAT-01**. Aturan: lolos.

| #   | ID                   | Judul untuk web                   | Dampak untuk web                                                                     | Jenis                         | †   | Alasan                                                         | Keputusan Anda |
| --- | -------------------- | --------------------------------- | ------------------------------------------------------------------------------------ | ----------------------------- | --- | -------------------------------------------------------------- | -------------- |
| 1   | MAT-01 (pintu masuk) | Daftar harga material regional    | Harga material di tiga wilayah diperbarui berkala sebagai pegangan RAB dan negosiasi | Bagian proyek yang kami ambil |     | “Harga material bergeser”: harga tiga wilayah sebagai pegangan | tayang / tahan |
| 2   | MAT-04               | Pengadaan material harga jaringan | Material dibeli dengan harga jaringan pemasok                                        | Barang dan material           |     | Material dengan harga jaringan pemasok                         | tayang / tahan |
| 3   | MAT-03               | Jadwal material per tahap         | Material tiba saat dibutuhkan, tidak terlalu cepat dan tidak terlambat               | Bagian proyek yang kami ambil |     | “jadwalnya tidak sinkron”: material per tahap                  | tayang / tahan |
| 4   | MAT-08               | Pengiriman material ke lokasi     | Angkutan material sampai lokasi sesuai ritase                                        | Barang dan material           |     | “barang telat”: angkutan sampai lokasi                         | tayang / tahan |
| 5   | MAT-14               | Perbandingan penawaran pemasok    | Tiga penawaran dibandingkan sebelum keputusan membeli                                | Bagian proyek yang kami ambil |     | Tiga penawaran dibandingkan sebelum membeli                    | tayang / tahan |
| 6   | MAT-10               | Stok opname material lapangan     | Material masuk, terpakai, dan sisa tercatat                                          | Bagian proyek yang kami ambil |     | Material masuk, terpakai, dan sisa tercatat                    | tayang / tahan |

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

5 dari 8 offer. Pintu masuk: **MOD-06**. Aturan: lolos.

| #   | ID                   | Judul untuk web                           | Dampak untuk web                                                                       | Jenis                                | †                                                                         | Alasan                                                        | Keputusan Anda |
| --- | -------------------- | ----------------------------------------- | -------------------------------------------------------------------------------------- | ------------------------------------ | ------------------------------------------------------------------------- | ------------------------------------------------------------- | -------------- |
| 1   | MOD-06 (pintu masuk) | Rencana arus kas proyek                   | Kebutuhan kas dan jadwal termin terproyeksi sebelum kerja dimulai                      | Bagian proyek yang kami ambil        |                                                                           | Lingkup terkecil: kebutuhan kas dan jadwal termin terproyeksi | tayang / tahan |
| 2   | MOD-01               | Tempo material                            | Material datang sekarang dan dibayar sesuai termin                                     | Modal, alat, dan jaminan lewat mitra |                                                                           | “material harus dibayar dulu”: tempo material                 | tayang / tahan |
| 3   | MOD-04               | Pembiayaan tagihan termin lewat mitra     | Tagihan termin yang belum cair diajukan ke mitra pembiayaan untuk dibiayai lebih dulu. | Modal, alat, dan jaminan lewat mitra | Kami tidak memberi pinjaman; pembiayaan dan syaratnya dari mitra berizin. | “tagihan termin belum turun”: bertanda †, lewat mitra berizin | tayang / tahan |
| 4   | MOD-03               | Pembiayaan proyek lewat mitra             | Kebutuhan alat atau proyek dihubungkan ke mitra pembiayaan                             | Modal, alat, dan jaminan lewat mitra | Kami tidak memberi pinjaman; pembiayaan dan syaratnya dari mitra berizin. | “Uang muka belum cair”: bertanda †, lewat mitra berizin       | tayang / tahan |
| 5   | MOD-08               | Pembiayaan alat dan kendaraan lewat mitra | Alat dan kendaraan kerja dibiayai lewat mitra, sehingga kas proyek tidak tertahan.     | Modal, alat, dan jaminan lewat mitra | Kami tidak memberi pinjaman; pembiayaan dan syaratnya dari mitra berizin. | Alat dan kendaraan lewat mitra; bertanda †                    | tayang / tahan |

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

4 dari 6 offer. Pintu masuk: **ALT-02**. Aturan: lolos.

| #   | ID                   | Judul untuk web                         | Dampak untuk web                                                           | Jenis                          | †   | Alasan                                                                   | Keputusan Anda |
| --- | -------------------- | --------------------------------------- | -------------------------------------------------------------------------- | ------------------------------ | --- | ------------------------------------------------------------------------ | -------------- |
| 1   | ALT-02 (pintu masuk) | Sewa peralatan ringan                   | Molen, stamper, dan perancah tersedia per hari                             | Bagian proyek yang kami ambil  |     | “Saya butuh alat hanya beberapa hari”: molen, stamper, perancah per hari | tayang / tahan |
| 2   | ALT-04               | Paket alat siap kerja                   | Alat lengkap dengan operator dan BBM dalam satu harga harian               | Proyek utuh dari hulu ke hilir |     | Alat dengan operator dan BBM dalam satu harga harian                     | tayang / tahan |
| 3   | ALT-03               | Mobilisasi alat                         | Alat diantar ke lokasi dan dijemput kembali sesuai jadwal yang disepakati. | Bagian proyek yang kami ambil  |     | Alat diantar dan dijemput sesuai jadwal                                  | tayang / tahan |
| 4   | ALT-05               | Pemeriksaan kelaikan alat sebelum kerja | Alat diperiksa sebelum dipakai untuk mencegah henti kerja dan kecelakaan   | Bagian proyek yang kami ambil  |     | Alat diperiksa sebelum dipakai                                           | tayang / tahan |

<details><summary>Tidak diusulkan</summary>

| ID     | Judul                                 | Alasan                                                             |
| ------ | ------------------------------------- | ------------------------------------------------------------------ |
| ALT-01 | Sewa alat berat lewat mitra           | Mitra sewa alat berat belum ada (master brief, jalur komisi)       |
| ALT-06 | Pemakaian alat bergantian antarproyek | Tidak dipilih: mengandaikan alat milik sendiri yang belum tercatat |

</details>

Catatan: Paket alat siap kerja ditulis tanpa alat berat sampai mitra sewa alat berat ada.

### Administrasi internal proyek (modul F)

> “Laporan lewat chat, kurva S tidak jelas, dan biaya lapangan tidak terpantau.”

6 dari 15 offer. Pintu masuk: **PRJ-04**. Aturan: lolos.

| #   | ID                   | Judul untuk web                       | Dampak untuk web                                                                    | Jenis                         | †   | Alasan                                               | Keputusan Anda |
| --- | -------------------- | ------------------------------------- | ----------------------------------------------------------------------------------- | ----------------------------- | --- | ---------------------------------------------------- | -------------- |
| 1   | PRJ-04 (pintu masuk) | Dokumentasi foto progres              | Foto 0, 50, dan 100 persen tersusun rapi sebagai bukti                              | Bagian proyek yang kami ambil |     | Lingkup terkecil: foto progres 0, 50, dan 100 persen | tayang / tahan |
| 2   | PRJ-03               | Laporan harian, mingguan, dan bulanan | Laporan disusun dalam format pemberi kerja, sesuai jadwal pelaporannya.             | Bagian proyek yang kami ambil |     | “Laporan lewat chat”: format pemberi kerja           | tayang / tahan |
| 3   | PRJ-02               | Jadwal dan kurva S                    | Rencana dan kemajuan proyek terlihat setiap minggu                                  | Bagian proyek yang kami ambil |     | “kurva S tidak jelas”                                | tayang / tahan |
| 4   | PRJ-07               | Pengendalian biaya proyek             | Anggaran dibandingkan realisasi setiap bulan                                        | Bagian proyek yang kami ambil |     | “biaya lapangan tidak terpantau”                     | tayang / tahan |
| 5   | PRJ-05               | Perhitungan volume dan mutual check   | Opname volume untuk termin dan perubahan disepakati bersama                         | Bagian proyek yang kami ambil |     | Opname volume untuk termin                           | tayang / tahan |
| 6   | PRJ-14               | Sistem laporan proyek digital         | Laporan lapangan dan dasbor progres berjalan dari ponsel, dikerjakan unit teknologi | Bagian proyek yang kami ambil |     | Laporan dari ponsel; jembatan ke unit Teknologi      | tayang / tahan |

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

6 dari 13 offer. Pintu masuk: **PNY-01**. Aturan: lolos.

| #   | ID                   | Judul untuk web                        | Dampak untuk web                                                               | Jenis                         | †                                                              | Alasan                                                 | Keputusan Anda |
| --- | -------------------- | -------------------------------------- | ------------------------------------------------------------------------------ | ----------------------------- | -------------------------------------------------------------- | ------------------------------------------------------ | -------------- |
| 1   | PNY-01 (pintu masuk) | Riset sumber barang                    | Pemasok dan produsen dengan harga pembanding ditemukan sebelum Anda menawar    | Bagian proyek yang kami ambil |                                                                | “bingung mencari barang”: sumber dan harga pembanding  | tayang / tahan |
| 2   | PNY-02               | Produksi barang lewat mitra            | Barang diproduksi sesuai spesifikasi dengan margin yang terjaga dari efisiensi | Barang dan material           |                                                                | Barang diproduksi lewat mitra sesuai spesifikasi       | tayang / tahan |
| 3   | PNY-07               | Pendampingan TKDN                      | Pengajuan sertifikat tingkat komponen dalam negeri terarah                     | Bagian proyek yang kami ambil |                                                                | “mengurus TKDN”                                        | tayang / tahan |
| 4   | PNY-12               | Analisis margin per barang             | Margin dihitung dari harga sumber, ongkos, dan risiko sebelum menawar.         | Bagian proyek yang kami ambil | Keuntungan dalam HPS dijaga wajar dan dapat diperiksa auditor. | “margin sehat”: bertanda †, keuntungan wajar dalam HPS | tayang / tahan |
| 5   | PNY-08               | Pengelolaan etalase katalog elektronik | Produk tayang dengan harga yang terus diperbarui                               | Bagian proyek yang kami ambil |                                                                | Etalase katalog elektronik terurus                     | tayang / tahan |
| 6   | PNY-03               | Pengendalian mutu sebelum kirim        | Barang diperiksa sebelum diserahkan                                            | Bagian proyek yang kami ambil |                                                                | Barang diperiksa sebelum dikirim                       | tayang / tahan |

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

6 dari 8 offer. Pintu masuk: **GOV-03**. Aturan: lolos.

| #   | ID                   | Judul untuk web                                    | Dampak untuk web                                                            | Jenis                          | †   | Alasan                                                 | Keputusan Anda |
| --- | -------------------- | -------------------------------------------------- | --------------------------------------------------------------------------- | ------------------------------ | --- | ------------------------------------------------------ | -------------- |
| 1   | GOV-03 (pintu masuk) | Pengadaan papan nama, signage, dan papan informasi | Papan dan penanda dibuat sesuai ukuran dan spesifikasi                      | Barang dan material            |     | Lingkup terkecil: papan nama dan signage               | tayang / tahan |
| 2   | GOV-07               | Paket barang dan pemasangan                        | Barang datang bersama pemasangan sehingga instansi menerima yang siap pakai | Proyek utuh dari hulu ke hilir |     | “barang sesuai spesifikasi”: datang bersama pemasangan | tayang / tahan |
| 3   | GOV-01               | Pengadaan perabot sekolah                          | Meja, kursi, dan lemari diadakan sesuai spesifikasi dan jadwal pengadaan.   | Barang dan material            |     | Perabot sekolah                                        | tayang / tahan |
| 4   | GOV-02               | Pengadaan perabot dan perlengkapan kantor          | Perabot kantor dan ruang pelayanan sesuai spesifikasi                       | Barang dan material            |     | Perabot dan perlengkapan kantor                        | tayang / tahan |
| 5   | GOV-06               | Pengadaan lewat e-purchasing                       | Barang tayang di etalase dan dipesan instansi secara langsung               | Barang dan material            |     | Dipesan langsung lewat e-purchasing                    | tayang / tahan |
| 6   | GOV-08               | Purna jual dan garansi untuk instansi              | Klaim garansi ditangani sehingga barang tidak menganggur                    | Barang dan material            |     | Klaim garansi ditangani                                | tayang / tahan |

<details><summary>Tidak diusulkan</summary>

| ID     | Judul                                      | Alasan                                                                       |
| ------ | ------------------------------------------ | ---------------------------------------------------------------------------- |
| GOV-04 | Pengadaan material paket kecil             | Tidak dipilih: jenisnya sudah diwakili offer yang lebih dekat ke kutipan bab |
| GOV-05 | Pengadaan seragam dan perlengkapan petugas | Mitra konveksi belum ada (master brief, jalur komisi)                        |

</details>

### Developer perumahan (modul H)

> “Unit selesai tetapi finishing telat, komplain menumpuk, dan laporan untuk bank belum siap.”

6 dari 10 offer. Pintu masuk: **DEV-05**. Aturan: lolos.

| #   | ID                   | Judul untuk web                     | Dampak untuk web                                                        | Jenis                          | †   | Alasan                                                          | Keputusan Anda |
| --- | -------------------- | ----------------------------------- | ----------------------------------------------------------------------- | ------------------------------ | --- | --------------------------------------------------------------- | -------------- |
| 1   | DEV-05 (pintu masuk) | Pemeriksaan sebelum serah terima    | Daftar periksa dan perbaikan tiap unit sebelum diserahkan               | Bagian proyek yang kami ambil  |     | Lingkup terkecil: daftar periksa tiap unit sebelum serah terima | tayang / tahan |
| 2   | DEV-02               | Finishing per unit                  | Unit sampai siap serah terima dengan finishing rapi                     | Proyek utuh dari hulu ke hilir |     | “finishing telat”                                               | tayang / tahan |
| 3   | DEV-07               | Pemeliharaan kawasan masa jaminan   | Kawasan dirawat sampai diserahkan ke pengelola                          | Perawatan berkala              |     | Kawasan dirawat sampai diserahkan ke pengelola                  | tayang / tahan |
| 4   | DEV-06               | Perbaikan komplain pembeli          | Cacat yang dilaporkan pembeli diperbaiki cepat                          | Bagian proyek yang kami ambil  |     | “komplain menumpuk”                                             | tayang / tahan |
| 5   | DEV-09               | Laporan progres untuk pencairan KPR | Laporan per unit tersusun untuk bank pemberi KPR                        | Bagian proyek yang kami ambil  |     | “laporan untuk bank belum siap”                                 | tayang / tahan |
| 6   | DEV-01               | Borongan per unit rumah             | Tenaga dan material per tipe unit dengan harga per unit yang disepakati | Proyek utuh dari hulu ke hilir |     | Borongan per unit dengan harga yang disepakati                  | tayang / tahan |

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

6 dari 8 offer. Pintu masuk: **KSW-01**. Aturan: lolos.

| #   | ID                   | Judul untuk web                             | Dampak untuk web                                      | Jenis                                | †   | Alasan                                                | Keputusan Anda |
| --- | -------------------- | ------------------------------------------- | ----------------------------------------------------- | ------------------------------------ | --- | ----------------------------------------------------- | -------------- |
| 1   | KSW-01 (pintu masuk) | Tim tukang dan mandor untuk proyek renovasi | Tenaga renovasi tersedia dengan pengendali lapangan   | Bagian proyek yang kami ambil        |     | “kekurangan tenaga”: tukang dan mandor untuk renovasi | tayang / tahan |
| 2   | KSW-02               | Material tepat waktu untuk proyek bertahap  | Material dijadwalkan per tahap dan dikirim ke lokasi  | Barang dan material                  |     | “material tepat waktu”                                | tayang / tahan |
| 3   | KSW-04               | Paket finishing untuk proyek klien Anda     | Tim finishing dan material finishing dalam satu paket | Proyek utuh dari hulu ke hilir       |     | Finishing dan materialnya dalam satu paket            | tayang / tahan |
| 4   | KSW-03               | Modal kerja lewat tempo material            | Proyek berjalan tanpa menahan kas                     | Modal, alat, dan jaminan lewat mitra |     | Tempo material lewat mitra                            | tayang / tahan |
| 5   | KSW-08               | Pengawasan mutu untuk proyek Anda           | Mutu pekerjaan tukang diawasi sebelum serah terima    | Bagian proyek yang kami ambil        |     | Mutu diawasi sebelum serah terima                     | tayang / tahan |
| 6   | KSW-06               | RAB dan jadwal untuk penawaran swasta       | Penawaran ke klien swasta dilengkapi RAB dan jadwal   | Bagian proyek yang kami ambil        |     | RAB dan jadwal untuk penawaran ke klien               | tayang / tahan |

<details><summary>Tidak diusulkan</summary>

| ID     | Judul                                  | Alasan                                                                       |
| ------ | -------------------------------------- | ---------------------------------------------------------------------------- |
| KSW-05 | Alat siap kerja untuk proyek swasta    | Tidak dipilih: jenisnya sudah diwakili offer yang lebih dekat ke kutipan bab |
| KSW-07 | Cadangan kapasitas untuk proyek swasta | Tidak dipilih: jenisnya sudah diwakili offer yang lebih dekat ke kutipan bab |

</details>

### Paket rakitan menurut profil pembeli

7 dari 17 offer. Pintu masuk: **RAK-09**. Aturan: lolos.

| #   | ID                   | Judul untuk web                | Dampak untuk web                                                                          | Jenis                                            | †   | Alasan                                                             | Keputusan Anda |
| --- | -------------------- | ------------------------------ | ----------------------------------------------------------------------------------------- | ------------------------------------------------ | --- | ------------------------------------------------------------------ | -------------- |
| 1   | RAK-09 (pintu masuk) | Paket Tenaga Siaga             | Tenaga terkendali dan terbayar tertib                                                     | Paket yang disusun menurut posisi Anda di proyek |     | Lingkup terkecil: tenaga terkendali dan terbayar tertib            | tayang / tahan |
| 2   | RAK-01               | Paket Tender Pertama           | Proyek pertama berjalan tertib dari kontrak sampai laporan                                | Paket yang disusun menurut posisi Anda di proyek |     | Kontraktor utama dengan tender pertama                             | tayang / tahan |
| 3   | RAK-03               | Paket Termin Lancar            | Opname dan berkas termin disiapkan sebelum termin diajukan.                               | Paket yang disusun menurut posisi Anda di proyek |     | Termin tertunda karena berkas; contoh kalibrasi yang sudah ditulis | tayang / tahan |
| 4   | RAK-08               | Paket Subkon Lepas Landas      | Pekerjaan pertama selesai tanpa kas terkuras                                              | Paket yang disusun menurut posisi Anda di proyek |     | Subkon baru                                                        | tayang / tahan |
| 5   | RAK-10               | Paket Harga Material Terpegang | Pembelian material berdasar harga yang dipantau                                           | Paket yang disusun menurut posisi Anda di proyek |     | Harga material yang terus bergeser                                 | tayang / tahan |
| 6   | RAK-16               | Paket Serah Terima Unit        | Setiap unit diperiksa dan dirapikan, dan keluhan pembeli diperbaiki sebelum serah terima. | Paket yang disusun menurut posisi Anda di proyek |     | Developer menjelang serah terima unit                              | tayang / tahan |
| 7   | RAK-12               | Paket Etalase Siap             | Produk tayang dengan dokumen pendukung                                                    | Paket yang disusun menurut posisi Anda di proyek |     | Penyedia baru di katalog elektronik                                | tayang / tahan |

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

# Panduan Studio Arthur

Panduan ini untuk orang yang menyiapkan dan meninjau isi Arthur di Studio.
Arthur adalah payung atas tiga unit: **Konstruksi**, **Teknologi**, dan
**Peekabo**. Semua pembaca saat ini menerima halaman Indonesia; Inggris belum
ditawarkan sampai isinya disetujui.

Studio tersedia di `https://<domain-situs>/cms`. Masuklah dengan akun yang
diundang ke proyek Sanity. Bila Studio membuka tetapi data tidak termuat,
catat pesan yang tampil dan minta pemilik memeriksa CORS di pengaturan Sanity;
pengaturan itu tidak diubah dari dalam Studio.

## Cara kerja isi Arthur

Struktur isi selalu dibaca dalam urutan berikut:

```text
Unit → Sisi → Bab → Offer
```

- **Unit** adalah Konstruksi, Teknologi, atau Peekabo.
- **Sisi** adalah sudut pembaca pada satu unit. Sisi tidak boleh dipindah ke
  unit lain.
- **Bab** mengumpulkan situasi pembeli dan offer yang menjawabnya.
- **Offer** adalah satu jawaban kerja yang utuh, bukan nama layanan umum.

Di sidebar Studio, buka **Struktur offer** lalu ikuti nomor 1 sampai 4. Buat
induknya lebih dulu: jangan membuat sisi tanpa unit, bab tanpa sisi, atau
offer tanpa bab. Referensi tersebut menjaga halaman tetap berada di alamat
yang benar.

## Status tinjauan dan urutan terbit

Semua tipe Arthur memakai tab **Internal** dengan status berikut:

| Status     | Makna                                                                             | Siapa yang menindaklanjuti                              |
| ---------- | --------------------------------------------------------------------------------- | ------------------------------------------------------- |
| Usulan     | Bahan awal dari katalog atau penulis. Tidak terlihat pembaca.                     | Penulis/agen menyiapkan.                                |
| Dipilih    | Masuk daftar pendek untuk halaman yang akan ditulis.                              | Pemilik memilih.                                        |
| Perlu Anda | Draf sudah siap ditinjau tetapi masih membutuhkan keputusan atau koreksi pemilik. | Pemilik meninjau.                                       |
| Disetujui  | Isi sudah diperiksa dan boleh menjadi kandidat terbit.                            | Hanya administrator pemilik menyetel lewat **Setujui**. |
| Ditahan    | Tidak dipakai sekarang; disimpan agar alasannya tidak hilang.                     | Pemilik dapat meninjau ulang.                           |

Jangan menganggap status sebagai hiasan. Halaman publik hanya membaca dokumen
berstatus **Disetujui**, dan query publik tidak membawa `idKatalog`, jejak
sumber, penulis, tanggal persetujuan, atau medan internal lain ke HTML.

Urutan penerbitan juga penting:

1. Terbitkan Unit.
2. Terbitkan Sisi di dalam Unit itu.
3. Terbitkan Bab di dalam Sisi tersebut.
4. Terbitkan Offer di dalam Bab yang sudah terbit.

Sesudah draf lengkap dan statusnya benar, administrator pemilik memilih
**Setujui**, lalu **Terbitkan**. Tombol terbit biasa untuk tipe Arthur sengaja
diganti; tombol **Terbitkan** tetap mati sampai draf disetujui. Administrator
tambahan juga memiliki kuasa yang sama, jadi keanggotaan administrator harus
ditinjau pemilik sebelum peluncuran.

## Menulis offer

Offer memiliki delapan blok pembaca: judul, dampak, untuk siapa, jenis, pasar,
situasi, langkah, serahan, batas, dan langkah pertama. Isilah sesuai lembar
rencana editorial dan sumber yang tercatat di **Jejak sumber**. Tulis langsung
kepada situasi pembeli, sebut benda atau langkah kerja yang konkret, dan jangan
menjanjikan hasil di luar kendali Arthur.

Jangan menerbitkan teks yang masih memuat `[PERLU …]`, `isi contoh`, atau
`teks sementara`. Studio menolaknya. Bila fakta seperti kanal kontak, alamat,
harga, angka, atau izin klaim belum tersedia, tandai **Perlu Anda** dan tulis
pertanyaannya pada jejak sumber—jangan mengisinya dengan tebakan.

`idKatalog` adalah kode sumber seperti `RAK-03`, bukan judul yang dibaca
pengunjung. Setelah impor ia menjadi hanya-baca. Jangan membuat `_id` Sanity
sendiri, jangan mengubah `idKatalog` untuk menyiasati duplikasi, dan jangan
menghapus jejak sumber saat memperbaiki copy.

## Pengaturan situs dan isi pendukung

**Pengaturan situs** adalah singleton `siteSettings`. Ia menampung pernyataan
pemilik, wilayah, dan kanal kontak. Email `kontak@arth.invalid` serta alamat
contoh yang terlihat hari ini adalah dummy—bukan alamat atau lokasi nyata—dan
harus diganti sebelum halaman kontak boleh diterbitkan.

**Cara kami bekerja** juga singleton. **Rangkaian tiga unit**, **Tanya jawab**,
dan **Halaman tetap** ada di bagian Isi pendukung. Page memakai `judul` dan
`isi` berbahasa; medan lama tetap terlihat hanya-baca selama migrasi yang
disetujui belum terjadi. Jangan menghapus atau mengosongkan medan lama tanpa
rencana tulis dan izin penghapusan terpisah.

## Daftar pendek dan impor katalog

Daftar pendek bukan saat untuk mengisi seluruh katalog. Untuk setiap bab,
pilih 3–7 offer yang paling jelas menjawab masalah pembeli dan setel statusnya
**Dipilih** atau **Ditahan** setelah rencana penulisan disetujui. Offer yang
belum dipilih tidak menjadi dasar halaman atau copy publik.

Impor Master Brief hanya dilakukan lewat skrip impor yang telah ditinjau.
Skrip membaca versi terbit dan draf, tidak menimpa offer yang sudah terbit,
serta hanya memperbarui draf berstatus Usulan pada medan yang dimilikinya.
Jangan mengimpor ulang melalui editor manual. Sebelum tiap mutasi, pemilik
harus menyetujui rencana tertulis yang memuat pemetaan sumber, jumlah per unit,
cadangan, dry-run, dan cara pemulihan.

## Meninjau di Presentation

Presentation dipakai untuk meninjau draf pada alamat situs sebelum terbit.
Bukalah dokumen, lalu pilih tampilan Presentation apabila rutenya sudah
tersedia. Periksa bahasa, urutan blok, tautan, keterbacaan ponsel, dan apakah
teks internal atau placeholder tidak terlihat. Bila rute belum tersedia,
jangan menyimpulkan isi sudah aman hanya karena formulir Studio tampak benar;
tandai **Perlu Anda** sampai halaman dan pratinjau dibangun.

Draft mode dapat menampilkan draf untuk tinjauan, tetapi tidak mengubah aturan
terbit. Jangan membagikan URL pratinjau sebagai URL publik, dan jangan
mengubah pengaturan domain, CORS, token, webhook, atau Vercel dari Studio.

## Jika ada masalah

| Gejala                             | Tindakan pertama                                                                  |
| ---------------------------------- | --------------------------------------------------------------------------------- |
| Tombol Setujui atau Terbitkan mati | Pastikan Anda administrator, ada draf, dan status memenuhi urutan di atas.        |
| Dokumen tidak muncul di halaman    | Pastikan induknya terbit lebih dulu dan status dokumen adalah Disetujui.          |
| Validasi menolak teks              | Cari placeholder atau teks contoh; ganti dengan isi nyata atau tandai Perlu Anda. |
| Studio kosong atau gagal jaringan  | Catat pesannya; pemilik memeriksa CORS dan status proyek.                         |
| Kontak/alamat terlihat             | Perlakukan sebagai dummy sampai pemilik mengganti dan menyetujui kanal nyata.     |

Untuk setiap masalah, catat dokumen yang dibuka, statusnya, tindakan terakhir,
dan pesan yang terlihat. Informasi itu lebih berguna daripada mencoba bypass
status atau menerbitkan ulang berulang kali.

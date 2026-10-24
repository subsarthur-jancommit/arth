"""Alasan setiap arah, dalam bahasa Indonesia yang sederhana. Teks ini untuk
pemilik, bukan untuk pembeli, jadi tidak tayang di situs."""

ARAH = {
    'a': dict(
        nama='Lembar kerja',
        satu='Tinta di atas kertas. Pelat digambar seperti lembar gambar kerja, lengkap dengan kop. Tanpa WebGL.',
        chips=('Terang', 'Monokrom', 'Tanpa WebGL'),
        suasana='Tenang, teliti, dan bisa dipercaya, seperti lembar gambar di kantor konsultan. Tidak ada hiasan. Yang membuatnya hidup adalah garis yang digambar di depan pembaca.',
        pelat=[
            'Tinta satu warna di atas kertas. Tiga tebal garis: dinding yang terpotong paling tebal dan diarsir 45°, perabot sedang (tinta 72%), garis bantu tipis putus-putus (tinta 45%) untuk as, ukuran, dan garis potong.',
            'Setiap pelat punya kop di kanan seperti lembar gambar kerja: pekerjaan, isi lembar, situasi, catatan, wilayah, dan nomor lembar 01/03. Denah dan potongan memakai skala yang sama, dan garis as menyambungkan keduanya.',
            'Token yang dipakai: <code>--color-ink</code>, <code>--color-paper</code>, <code>--text-muted</code>, <code>--line</code>, <code>--line-strong</code>. Usulan satu token baru: <code>--plate-hatch</code> (tinta 45%) untuk arsiran dan garis bantu.',
        ],
        huruf='Syne untuk judul dan Geist Mono untuk label gambar. Keduanya sudah terpasang di situs (SIL OFL 1.1). Belum ada huruf berlisensi yang dipilih, dan arah ini tidak membutuhkannya.',
        gerak=[
            'Lintasan beranda di-pin kira-kira tiga layar gulir. Ketiga pelat ada di satu lembar panjang. Lembar itu sudah mulai tampak di bawah judul, naik saat digulir, lalu bergeser ke kiri.',
            'Garis digambar mengikuti gulir: as dan ukuran lebih dulu, lalu dinding, lalu label. Nomor 01/03 dan kalimat unit berganti di pita atas. Supaya tetap memakai transform saja (aturan #4), garis tidak digambar dengan <code>stroke-dashoffset</code>; garis dibuka oleh topeng yang digeser dengan transform.',
        ],
        rm='Tidak di-pin. Ketiga pelat tampil utuh dan berurutan ke bawah (bingkai kanan).',
        nojs='Sama dengan reduced motion: pelat SVG utuh, berurutan.',
        ponsel='Pelat bertumpuk, masing-masing digambar saat masuk layar. Perkiraan; dilihat di ponsel saat R4.',
        webgl='Dicabut dari beranda. Pelat adalah SVG, dan GPU tidak menambah apa pun yang dibutuhkan gambar garis. Scene latar hero ikut dicabut (flowmap sudah tidak dipasang sejak R0).',
        risiko=[
            'Bisa terasa terlalu tenang, kembali ke rasa hati-hati yang dikritik <code>docs/FORK.md</code>. Geraknya harus besar dan yakin.',
            'Garis bantu tinta 45% hanya 3,02:1, pas di ambang 3:1. Itu hanya untuk garis bantu yang tidak membawa arti sendiri; dinding, jalur, dan label tetap tinta penuh.',
            'Kop memakai beberapa kata baru: Isi lembar, Catatan, Wilayah, Skala, Lembar. Kata itu perlu masuk glosarium bila arah ini dipilih.',
            'Pelat yang padat garis bisa berat digambar ulang saat bergulir di ponsel murah. Belum diukur; ini perkiraan.',
        ],
    ),
    'b': dict(
        nama='Maket cahaya',
        satu='Ruang gelap. Pelat menjadi maket bercahaya yang dilalui kamera saat digulir. WebGL dipakai karena pelat menjadi materialnya.',
        chips=('Gelap', 'Monokrom', 'WebGL'),
        suasana='Sinematik dan malam, seperti maket yang diterangi di ruang gelap. Pembaca dibawa masuk ke dalam gambar, bukan melihatnya dari luar.',
        pelat=[
            'Garis kertas yang berpendar di atas tinta. Gambarnya aksonometri: denah rebah di lantai, potongan berdiri di belakangnya, diagram alur dan papan kampanye menjadi lempeng tipis yang mengambang.',
            'Bidang diisi kertas 3 sampai 16%. Label rebah di bidangnya, seperti tercetak di material. Untuk jalur tanpa WebGL ada versi datar: gambar yang sama dalam proyeksi biasa, dengan garis bercahaya yang sama.',
            'Token: <code>--color-ink</code> sebagai dasar, <code>--color-paper</code> untuk garis, <code>--text-muted</code> untuk keterangan. Usulan token baru: <code>--glow</code> (kertas 30%) untuk pendar. Tetap monokrom.',
        ],
        huruf='Archivo lebar (wdth 125) untuk judul, Geist Mono untuk label. Archivo di sini pengganti sementara dari Google Fonts (SIL OFL 1.1). Belum ada huruf berlisensi yang dipilih. Bila arah ini dipilih, R4 memilih huruf judul lebar yang berlisensi dan mengujinya dengan judul Indonesia yang panjang, karena huruf lebar cepat kehabisan tempat.',
        gerak=[
            'Lintasan di-pin. Kamera maju menembus tiga pelat (momen <code>set-depth</code>): Konstruksi lewat di depan kamera, Teknologi menjadi tajam, Peekabo menunggu di kabut. Potongan berdiri dari garis potongnya di denah.',
            'Paket cahaya berjalan di jalur pesanan. Kursor membengkokkan garis seperti udara panas: flowmap kembali, sesuai catatan R0, karena pelat kini menjadi material.',
        ],
        rm='Engine WebGL tidak diunduh. Pelat tampil datar sebagai SVG, utuh, berurutan (bingkai kanan).',
        nojs='Sama: pelat SVG datar. Tanpa WebGL juga sama.',
        ponsel='Kamera tidak bergerak; tiga pelat datar bergeser satu per satu. Perkiraan; harus dilihat di ponsel sungguhan.',
        webgl='Dipakai, karena pelat menjadi materialnya. Setiap pelat SVG dijadikan tekstur pada bidang di satu kanvas R3F yang sama (lewat <code>WebGLTunnel</code>, satu RAF, aturan #6). Tekstur, geometri, dan material dibuang saat unmount (aturan #15).',
        risiko=[
            'Paling berat dari ketiganya. Ponsel kelas bawah bisa tersendat. CI tidak bisa mengukurnya karena WebGL di sana dirender SwiftShader tanpa GPU (aturan #19); angkanya harus diambil di perangkat nyata.',
            'Teks di atas scene bisa kehilangan kontras bila garis terang lewat di belakangnya. Judul harus duduk di zona tanpa garis, dan <code>contrast-situ</code> mengukurnya.',
            'Label pelat di kejauhan sengaja redup (4,21:1) dan bukan teks yang perlu dibaca; teks yang dibaca selalu ada di DOM.',
            'Seluruh situs menjadi gelap. Halaman panjang seperti Kebijakan dan Cara kami dibayar perlu keputusan: ikut gelap atau tetap terang.',
        ],
    ),
    'c': dict(
        nama='Papan proyek',
        satu='Lembar cetak ungu ditempel di papan berlubang, dicap, dan dicoret. Satu warna baru: ungu stempel. Tanpa WebGL.',
        chips=('Terang', 'Satu warna', 'Tanpa WebGL'),
        suasana='Hidup, dekat, dan terasa kerja lapangan, seperti papan di direksi keet: lembar dicetak, ditempel, dicap, lalu dicoret saat dibahas bersama.',
        pelat=[
            'Cetak biru ungu di atas kertas putih yang dingin, seperti cetakan blueprint. Dinding yang terpotong diisi penuh. Coretan tinta hitam menunjuk bagian yang dijawab pekerjaan itu, misalnya antre di kasir yang dicoret dan diganti bayar dari meja.',
            'Stempel ungu mencatat janji yang memang tertulis di situs: disepakati tertulis, sebelum kerja dimulai. Dasarnya papan berlubang; catatan ditempel dengan selotip, dan label memakai pita huruf timbul.',
            'Usulan token baru: <code>--papan</code>, <code>--kertas</code>, <code>--tinta</code>, <code>--ungu</code> (oklch 0,47 0,165 290), dan <code>--ungu-terang</code> untuk tema gelap.',
        ],
        huruf='Barlow Condensed tebal huruf besar untuk judul, seperti papan nama proyek; Barlow untuk isi; Geist Mono untuk label. Barlow di sini pengganti sementara (SIL OFL 1.1). Belum ada huruf berlisensi yang dipilih; bila arah ini dipilih, R4 memilih huruf sempit yang berlisensi.',
        gerak=[
            'Lintasan di-pin. Papan terisi satu benda dalam satu waktu: lembar 01 jatuh dan ditempel (momen <code>fixings</code>), stempel mendarat (<code>stamp</code>), lembar 02 menyusul, lalu coretan digambar mengitari bagian yang dijawab.',
        ],
        rm='Papan sudah terisi penuh; stempel dan coretan sudah ada (bingkai kanan).',
        nojs='Sama dengan reduced motion.',
        ponsel='Lembar bertumpuk ke bawah, masing-masing mendarat saat masuk layar. Perkiraan; dilihat di ponsel saat R4.',
        webgl='Dicabut dari beranda. Semua gerak memakai SVG dan transform CSS.',
        risiko=[
            'Warna ungu mengubah identitas situs dan membuka lagi keputusan monokrom (Tahap 66, <code>docs/MOTION-SPEC.md</code> §12.1). Perlu keputusan tertulis, dan <code>contrast.test.ts</code> mendapat pasangan warna baru.',
            'Bisa terasa ramai. Coretan dan stempel harus jarang supaya tetap berarti.',
            'Stempel hanya boleh menyebut hal yang memang benar di situs, dan tidak boleh terbaca sebagai tanda proyek nyata. Teks stempel bertekstur juga harus ada di DOM.',
            'Huruf sempit huruf besar sulit dibaca untuk kalimat panjang; hanya untuk judul.',
        ],
    ),
}

ALT = {
    'konstruksi': ('Gambar kerja kafe di ruko sewa. Denah lantai 1 dengan teras, ruang duduk, '
                   'tangga, bar, pass-out, dapur dengan kompor dan meja olah, gudang bahan, dan '
                   'tempat cuci; garis putus menandai alur pelanggan dari jalan ke meja, garis '
                   'titik menandai alur bahan, olah, dan saji. Potongan A–A memperlihatkan dua '
                   'lantai, kanopi, bar, kompor dengan cerobong sampai atap, dan meja di sepanjang '
                   'dinding.'),
    'teknologi': ('Diagram alur pesanan kafe dalam empat jalur: tamu, sistem, dapur, dan pemasok. '
                  'Tamu memesan dan membayar dari meja atau lewat WhatsApp; pesanan dicatat dan '
                  'uangnya dicocokkan; layar dapur menampilkan pesanan; stok bahan tercatat, dan '
                  'bila bahan menipis, pesanan ulang ke pemasok terkirim sendiri.'),
    'peekabo': ('Papan kampanye pembukaan kafe. Kolom: sebelum kafe dibuka, hari pertama dibuka, '
                'dan sesudahnya. Baris: perhatian, kepercayaan, dan penjualan. Kartu berisi '
                'sasaran dan pesan, satu hari syuting untuk stok konten sebulan, iklan di TikTok, '
                'Meta, dan Google, warga sekitar diundang lebih dulu, booth dan sampling, temu '
                'pelanggan, serta kreator, host live, dan sales yang ikut menjual.'),
}

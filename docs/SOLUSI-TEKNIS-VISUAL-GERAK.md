# ARTH — kontrak visual, WebGL, dan motion untuk pengembangan berikutnya

> Disalin ke repo pada 17 November 2026 dari berkas pemilik
> `TECHNICAL-SOLUTION.md`, sebagai rujukan untuk
> [`RENCANA-VISUAL-GERAK.md`](./RENCANA-VISUAL-GERAK.md). Isinya tidak diubah,
> kecuali tiga tautan ke berkas yang tidak ikut disalin (papan ilustrasi teknis,
> blueprint 16 November, dan manifest bukti), yang dijadikan teks biasa.

17 November 2026 · Addendum teknis untuk audit 14–16 November · Status: spesifikasi usulan, belum implementasi produksi.

**Keputusan utama: ARTH perlu satu bahasa material dan hierarki gerak.** Ink/paper, tipografi solid, permukaan matte, dan satu ilustrasi berkarakter dapat menjadi sistem premium yang koheren. Saat ini diagram bercahaya, lembar editorial, tekstur latar, transisi besar, dan berbagai bentuk kontrol berebut perhatian. Menambah efek hover atau lampu tanpa membereskan kontrak tersebut akan memperbesar ketidakkonsistenan.

Buka papan ilustrasi teknis untuk anatomi navbar, layout desktop/mobile, pemisahan lapisan render, motion, dan tiga eksplorasi visual. Blueprint sebelumnya tetap menjadi dasar journey; addendum ini mengoreksi batas visual/motion dan memperinci pekerjaan pengembang.

## 1. Dasar audit dan kritik yang perlu ditindak

Situs utama: [ARTH /id](https://arth-test-01.vercel.app/id). Footer live dan sumber yang diperiksa menunjuk commit [`82ab37f`](https://github.com/subsarthur-jancommit/arth/commit/82ab37f7699a85bc4180aa57e23ac4b5d7ed51b4). Empat bukti baru: hero/navbar desktop, plate WebGL, contoh statis, dan hero mobile. Seluruh gambar dibuka dan diperiksa. Manifest membedakan bukti dari gambar konsep.

Pemeriksaan baru ini bukan pengukuran FPS, kontras komposit, atau uji perangkat fisik. Hover dinilai sebagai rancangan teknis, belum diuji langsung pada live dalam sesi ini. Masalah kontak pada laporan sebelumnya tetap menjadi P0 operasional; kanalnya tidak diuji ulang dalam addendum ini.

| Prioritas desain | Temuan                                                                                     | Kritik dan keputusan teknis                                                                                                                                                           |
| ---------------- | ------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| P1               | Diagram sangat terang dan miring; label HTML di sebelahnya jauh lebih tenang               | Material WebGL terasa seperti hologram sementara halaman berbicara sebagai kertas/tinta. Turunkan intensitas seluruh diagram; label penting dipisahkan dari pass bercahaya. Bukti 02. |
| P1               | Latar bertekstur/grid, garis diagram, dan teks detail bekerja pada frekuensi visual serupa | Detail dekoratif mengurangi pemisahan figure/background. Kosongkan latar area baca; tekstur hanya pada material ilustrasi. Bukti 01–03.                                               |
| P1               | Teks kecil ikut perspektif dan transformasi                                                | Font yang besar pada texture belum tentu besar di layar. Nilai ukuran setelah proyeksi; jangan menjadikan isi texture sebagai satu-satunya pembawa informasi. Bukti 02, sumber scene. |
| P1               | Navbar kecil, CTA pill, CTA hero dan kontrol lain memiliki bahasa bentuk berbeda           | Bentuk belum menyampaikan hierarki yang konsisten. Tetapkan keluarga nav, action, utility, dan content; jangan membulatkan semua panel. Bukti 01.                                     |
| P1               | Ruang awal hero mobile panjang dan indeks unit mendahului manfaat                          | Whitespace belum membantu orientasi. Susun H1 → cakupan → tindakan → kebutuhan; tinggi mengikuti isi. Bukti 04.                                                                       |
| P1               | Passage panjang dan contoh kafe kedua menyajikan materi berulang                           | Pengulangan dan gerak membuat konteks terasa lebih banyak daripada isi sebenarnya. Satu contoh interaktif dengan kontrol manual cukup. Bukti 02–03 dan audit sebelumnya.              |
| P2               | Kosakata gerak terlalu banyak untuk tugas memilih layanan                                  | Bagi motion menjadi feedback, perubahan isi, dan ilustrasi. Satu peristiwa dominan pada satu waktu; transisi rutin harus segera memperlihatkan tujuan.                                |

Palet dasarnya sudah sempit. **Yang bertabrakan adalah material, kepadatan detail, dan intensitas gerak.** Rasa premium harus lahir dari proporsi, kejernihan, dan kendali pengguna atas ritme membaca.

## 2. “Teks kopong”: diagnosis yang dapat dibuktikan

Keluhan pengguna sah sebagai gejala perseptual. Screenshot memperlihatkan garis/label plate yang luminous dan terkompresi perspektif; belum membuktikan hilangnya bagian dalam glyph. Headline hero yang tertangkap tampak terisi. Kedua permukaan perlu jalur diagnosis berbeda.

| Fakta sumber                                                                                                                 | Implikasi yang tepat                                                                                                                                                                                                                                                                                                                                                                                                      |
| ---------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Plate memakai `ShaderMaterial`, `premultipliedAlpha`, `AdditiveBlending`; shader tidak menghitung respons lampu atau normals | “Pencahayaan” saat ini adalah efek compositing. Menambah lampu Three.js saja tidak memperbaikinya. [scene L382](https://github.com/subsarthur-jancommit/arth/blob/82ab37f7699a85bc4180aa57e23ac4b5d7ed51b4/vault/webgl/plate-material/scene.tsx#L382).                                                                                                                                                                    |
| Shader menambah halo dari mip bias 2 × 0,6 dan scan dengan gain hingga 1,9; RGB dapat melebihi 1 sementara alpha dibatasi    | Berisiko membuat stroke tampak membengkak/washed-out. Besar dampaknya harus diisolasi melalui A/B. [shader L65](https://github.com/subsarthur-jancommit/arth/blob/82ab37f7699a85bc4180aa57e23ac4b5d7ed51b4/vault/webgl/plate-material/shaders.ts#L65).                                                                                                                                                                    |
| Canvas menggambar stroke hitam lalu `fillText` putih                                                                         | Kode memang mengisi huruf. Jangan mendiagnosisnya sebagai implementasi outline-only. [canvas L111](https://github.com/subsarthur-jancommit/arth/blob/82ab37f7699a85bc4180aa57e23ac4b5d7ed51b4/lib/plates/canvas.ts#L111).                                                                                                                                                                                                 |
| Label 12–22 plate units; sheet lean 62°, camera pitch 32°/yaw −24°                                                           | Ukuran canvas tidak sama dengan ukuran CSS yang dibaca. Foreshortening dan minification perlu diperiksa pada hasil akhir. [types L192](https://github.com/subsarthur-jancommit/arth/blob/82ab37f7699a85bc4180aa57e23ac4b5d7ed51b4/lib/plates/types.ts#L192), [scene L63](https://github.com/subsarthur-jancommit/arth/blob/82ab37f7699a85bc4180aa57e23ac4b5d7ed51b4/vault/webgl/plate-material/scene.tsx#L63).            |
| `document.fonts.ready`, mipmaps, trilinear filter, dan anisotropy sudah tersedia                                             | Pertahankan; jangan menulisnya sebagai fitur yang belum ada. [scene L222](https://github.com/subsarthur-jancommit/arth/blob/82ab37f7699a85bc4180aa57e23ac4b5d7ed51b4/vault/webgl/plate-material/scene.tsx#L222).                                                                                                                                                                                                          |
| H1 menggunakan `TextReveal` DOM dengan mask dan transform                                                                    | Jika gejala muncul pada H1, isolasi font weight, CSS fill/stroke, mask, opacity, filter, transform, dan compositing DOM. [hero L217](https://github.com/subsarthur-jancommit/arth/blob/82ab37f7699a85bc4180aa57e23ac4b5d7ed51b4/vault/blocks/hero/index.tsx#L217), [TextReveal L197](https://github.com/subsarthur-jancommit/arth/blob/82ab37f7699a85bc4180aa57e23ac4b5d7ed51b4/vault/motion/text-reveal/index.tsx#L197). |

**Cacat shader terkonfirmasi:** `smoothstep(0.06, 0.0, x)` memakai batas terbalik. GLSL tidak mendefinisikan hasil saat `edge0 >= edge1`. Ubah menjadi `1.0 - smoothstep(0.0, 0.06, x)` dengan mempertahankan ekspresi `x` semula. Ini perbaikan portabilitas; jangan menjanjikannya sebagai penyembuh tunggal teks kopong. [Kode L74](https://github.com/subsarthur-jancommit/arth/blob/82ab37f7699a85bc4180aa57e23ac4b5d7ed51b4/vault/webgl/plate-material/shaders.ts#L74), [rujukan Khronos](https://github.com/KhronosGroup/OpenGL-Refpages/blob/main/gl4/smoothstep.xml).

### Matriks isolasi render untuk pengembang

Simpan gambar dengan viewport, DPR, font, zoom, frame/progress, dan latar yang sama. Ubah satu variabel tiap perbandingan. Jalankan pada DPR 1 dan 2; periksa saat diam, saat bergerak, lalu sesudah berhenti.

| Langkah | Keadaan                                                                    | Pertanyaan yang dijawab                                                 |
| ------- | -------------------------------------------------------------------------- | ----------------------------------------------------------------------- |
| A       | Canvas asli ditampilkan datar pada ukuran baca akhir                       | Apakah glyph sudah rusak sebelum masuk WebGL?                           |
| B       | Texture pada plane frontal, shader netral, tanpa halo/scan                 | Apakah sampling atau upload mengubah bentuk huruf?                      |
| C       | Normal alpha dengan coverage yang benar dibanding additive pada latar sama | Apakah compositing memutihkan tepi atau menipiskan isi?                 |
| D       | Halo saja, kemudian scan saja                                              | Efek mana yang menurunkan keterbacaan?                                  |
| E       | Perspektif awal, tengah, maksimum; tanpa gerak                             | Apakah sudut mengecilkan glyph di bawah ukuran baca?                    |
| F       | Gerak pada pipeline pilihan, overlay debug frame number                    | Apakah aliasing temporal atau urutan update menyebabkan kesan bergetar? |
| G       | H1 DOM tanpa TextReveal/filter, kemudian aktif satu per satu               | Apakah masalah yang sama berasal dari compositing DOM?                  |

Baseline lulus bila bentuk interior huruf stabil dan label tetap dapat dibaca pada ukuran tayang. Pemeriksaan visual baseline/final harus disertakan dalam PR. Matriks ini belum dijalankan; ia merupakan pekerjaan diagnosis yang konkret.

## 3. Sistem visual yang harus dikunci sebelum membangun komponen

Pertahankan nama dan peran ink/paper. Nilai berikut adalah kontrak awal untuk prototipe; sesuaikan setelah pemeriksaan kontras dan tampilan komposit.

| Token/peran | Usulan                                                                                                                                                                         |
| ----------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Ink / paper | Pertahankan `oklch(0.17 0.006 66)` / `oklch(0.964 0.006 92)` dari sistem sekarang; hindari putih shader murni sebagai warna semua label                                        |
| Surface     | 1 latar utama + 1 permukaan berbeda per section; garis pemisah lebih dahulu daripada kotak/shadow                                                                              |
| Type        | Gunakan keluarga font proyek. H1 desktop `clamp(44px, 5.3vw, 76px)`; mobile 40–44px awal; line-height 1,04–1,1. Body 16–18px/1,5; nav 14–16px/1,2; caption minimum usulan 14px |
| Spacing     | Skala 4, 8, 12, 16, 24, 32, 48, 64, 96; section desktop 96px, mobile 56–64px                                                                                                   |
| Grid        | Maksimum isi 1280px; gutter desktop 48px, tablet 32px, mobile 20px; desktop 12 kolom/gap24                                                                                     |
| Radius      | 999px untuk pill; 12–16px panel/media; 8px input; row isi memakai divider bila cukup                                                                                           |
| Shadow/blur | Navbar boleh satu shadow lembut saat sticky. Blur opsional dengan fallback opaque. Hilangkan bloom pada teks dan backdrop blur bertumpuk                                       |
| Texture     | Hanya di ilustrasi/material; mulai opacity 0,02–0,03 jika diperlukan. Tidak melapisi H1, body, focus, atau tombol                                                              |
| Stroke      | UI 1px stabil; garis ilustrasi dibedakan tebalnya menurut fungsi, sehingga seluruh gambar tidak punya bobot sama                                                               |

Warna dan tipografi HTML harus konsisten lintas unit. Identitas Konstruksi/Teknologi/Peekabo dapat muncul lewat isi ilustrasi dan susunan objek, tanpa mengganti bahasa animasi atau menciptakan tiga tema terpisah.

## 4. Navbar pill dan layout: spesifikasi komponen

### Navbar desktop

Gunakan tiga zona: logo kiri, kapsul navigasi di tengah, CTA/utilitas kanan. Susunan grid `auto minmax(0,1fr) auto`; kapsul disejajarkan di tengah ruang tersedia, tanpa absolute-centering yang bisa menabrak logo/CTA.

Kapsul tinggi awal 52px, inset 4px; link tinggi 44px, padding horizontal 16–20px. CTA utama tinggi 48px. Jarak antarzona minimal 24px. Hanya satu link memiliki `aria-current="page"`; di beranda jangan memberi Konstruksi state aktif. Header latar solid cukup; glass bukan syarat estetika.

Nav: Konstruksi · Teknologi · Peekabo · Cara kerja. CTA: **Ceritakan kebutuhan**. Utilitas ID/EN tetap tersedia. Pencarian bisa masuk menu tambahan. Jika header tidak muat, collapse lebih awal; 1024px adalah titik awal uji, bukan aturan yang memaksa teks mengecil. Uji label Indonesia/Inggris dan zoom 200%.

| State         | Tampilan dan perilaku                                                                                                                                     |
| ------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Default       | Label solid, target tetap; nav sekunder tidak seterang CTA                                                                                                |
| Hover         | Highlight lembut muncul/bergeser di belakang label selama 160–180ms. Pointer-follow opsional hanya dalam highlight, maksimum 4px; tulisan dan hitbox diam |
| Active route  | Inset pill kontras + `aria-current`; tidak mengandalkan hover. Active bertahan saat pointer keluar                                                        |
| Focus-visible | Ring 2px, offset 3px, tidak terpotong kapsul; berbeda dari active. Gerak highlight tidak menggantikan ring                                                |
| Press         | Warna/elevasi berubah 100–120ms; boleh isi dekoratif scale0,98 dalam target tetap. Jangan menggeser tetangga                                              |
| Loading       | Hanya untuk aksi async nyata; ukuran tetap, label jelas. Link biasa tidak perlu spinner seremonial                                                        |

Navbar bukan tab widget: gunakan `<nav>` dan link asli, Tab/Enter normal. Mobile memakai logo + utilitas ringkas + tombol Menu tinggi44px. Overlay menu memakai judul dan link 24–32px yang muat, bukan tipografi monumental. Atur focus trap bila modal, Escape, scroll lock selama modal, `aria-expanded`, dan pengembalian fokus. Menu tetap bisa ditutup pada landscape pendek.

### Hero dan pemilih kebutuhan

Desktop: blok judul 7 kolom dan ilustrasi 5 kolom; tiga kebutuhan tampak setelah pengantar dan sebelum uraian panjang. Prioritas isi mengalahkan keharusan semua berada dalam satu layar pada zoom/layar pendek. Gunakan tinggi berdasarkan isi; `min-height` viewport hanya untuk ruang dekoratif jika tidak menunda pilihan.

Mobile: **H1 → satu kalimat cakupan → CTA → tiga kebutuhan → ilustrasi opsional**. Jangan letakkan indeks unit sebelum manfaat. Ilustrasi boleh menjadi lebih kecil atau pindah ke contoh kerja. Pertahankan target sentuh minimal usulan44px dan jarak antartarget yang cukup.

Copy kanonis untuk pengerjaan berikutnya tetap dari blueprint: **Bangunan & proyek**, **Sistem & operasional**, **Pasar & penjualan**. Eksplorasi gambar menggunakan variasi copy untuk mencari komposisi, bukan mengganti IA final. Lima route pembeli lewat tiga kebutuhan; `/id/peekabo/jaringan` lewat **Bergabung** terpisah. Cabang kebutuhan berjumlah 2, 2, dan 1—jangan memaksa dua cabang pada semuanya.

## 5. WebGL: dua jalur implementasi yang masuk akal

### Jalur A — rapikan diagram sekarang, prioritas putaran berikutnya

Pisahkan data gambar menjadi geometri/garis dan label. WebGL mempertahankan ilustrasi; daftar label/ringkasan disajikan sebagai HTML stabil di sibling container. Caption menjelaskan bahwa kafe adalah contoh ilustratif, bukan portofolio nyata. Isi penting tersedia tanpa canvas.

1. Buat baseline tanpa halo/scan. Gunakan tinta/paper bertoken untuk geometri. Pertahankan fallback SVG, first-frame handoff, reduced-motion gate, disposal, dan pemulihan context loss yang sudah ada.
2. Untuk mask monochrome, gunakan coverage dari kanal yang benar; texture hitam/putih yang opaque tidak boleh langsung diperlakukan sebagai alpha transparan. NormalBlending memerlukan shader output dan aturan alpha yang sesuai. Bandingkan latar gelap/terang dan tepi antialias.
3. Selaraskan straight alpha versus premultiplied alpha dari output shader sampai material/compositor; jangan sekadar mengubah flag dan menganggap selesai. Opaque geometry memakai jalur opaque bila memungkinkan. [Referensi Material Three.js](https://threejs.org/docs/pages/Material.html).
4. Nyatakan texture sebagai data coverage (`NoColorSpace`) atau texture warna (`SRGBColorSpace`) sesuai encoding sebenarnya. Warna shader bekerja dalam linear; konversi output harus benar dan terjadi sekali. Custom ShaderMaterial perlu penanganan output color space. Ini checklist implementasi, belum diagnosis bahwa konfigurasi saat ini salah. [Panduan resmi color management](https://threejs.org/manual/pages/color-management.html).
5. Uji label HTML 16px untuk isi penting, 14px untuk caption. Bila masih ada teks texture, ukur ukuran proyeksi akhirnya; jangan menjadikan resolusi1600px sebagai jaminan. MSDF/SDF hanya relevan bila teks 3D benar-benar dibutuhkan dan teruji.
6. Sediakan mode ilustrasi perspektif dan ringkasan baca stabil. Tidak semua objek harus frontal; informasi yang harus dibaca tidak ikut mengecil, glow, atau rotasi.

Skema shader berikut hanya menjelaskan kontrak coverage; belum patch siap pakai dan belum menyertakan seluruh kebutuhan output/color-management proyek:

```glsl
float coverage = texture2D(uMask, vUv).r;
float alpha = coverage * uOpacity;
// Straight-alpha baseline; cocokkan seluruh material/pipeline dengannya.
gl_FragColor = vec4(uInkLinear, alpha);
```

### Jalur B — ilustrasi 3D matte sebagai pengayaan

Ketiga konsep visual mengeksplorasi model kafe berpermukaan padat. Hasil itu memerlukan aset/model atau render baru; shader plate sekarang tidak otomatis menghasilkan volume tersebut. Jadikan ini fase terpisah dengan pilihan static render berkualitas lebih dahulu, lalu WebGL jika interaksi ruang memberi manfaat.

Untuk model dengan normals dan material yang merespons cahaya: mulai dari satu key light luas di atas/kiri, fill lembut untuk menjaga sisi bayangan terbaca, dan contact shadow yang menambatkan objek. Uji rasio fill sekitar 0,25–0,4 dari key sebagai titik awal artistik, bukan resep intensitas universal. Gunakan material matte/rough, hindari seluruh tepi emissive. Pastikan silhouette dan bentuk terbaca dalam grayscale sebelum menambah rim. Exposure ditetapkan pada material referensi; jangan menambal color-space dengan intensitas lampu.

Tidak perlu lampu bergerak, scan berulang, atau bloom untuk menunjukkan kualitas. Satu perubahan bentuk/komposisi yang selesai sesudah pilihan pengguna lebih berguna. Gambar diam tetap menjadi alternatif premium bila WebGL menurunkan ketajaman atau respons.

## 6. Motion dan parallax: kontrak yang bisa diuji

**Lapisan baca/aksi stabil; lapisan ilustrasi boleh ekspresif dan mempunyai keadaan akhir.** Ini menggantikan aturan lama “motion hanya feedback”, “diagram selalu frontal”, dan “mobile selalu statis”. Pilih kualitas berdasarkan kemampuan/performa dan preferensi pengguna.

| Kelas                     | Anggaran awal                 | Batas                                                                            |
| ------------------------- | ----------------------------- | -------------------------------------------------------------------------------- |
| Feedback hover/press      | 120–180ms                     | Warna, highlight, sedikit elevasi; hitbox tetap                                  |
| Panel/menu/pergantian isi | 220–320ms                     | Opacity + perpindahan maksimal8px; focus mengikuti tindakan                      |
| Ilustrasi setelah pilihan | 600–900ms sekali              | Satu aksi utama, lalu diam; klik baru dapat menginterupsi menuju state terbaru   |
| Scroll parallax           | Latar ±6px, objek ±12px       | Hanya dekorasi; tanpa pin wajib dan tanpa menggerakkan label/CTA                 |
| Pointer tilt              | Maksimum±2°                   | `hover:hover` + `pointer:fine`; netral saat keluar; nonaktif bila reduced motion |
| Navigasi route rutin      | Langsung; fade opsional≤180ms | Tidak menunggu intro/outro; Back/Forward, anchor dan fokus tetap benar           |

Durasi dan amplitudo di atas adalah batas awal prototipe, bukan hasil pengukuran preferensi. Gunakan satu easing keluar `cubic-bezier(.22,1,.36,1)` untuk perpindahan antarkeadaan; jangan memasukkan spring/bounce pada semua kontrol.

```text
SceneShell (layout; ukuran tetap)
├─ ReadingLayer (H1, caption, controls; tanpa transform dekoratif)
└─ ArtViewport (overflow clip; pointer-events:none untuk dekorasi)
   └─ RevealWrapper (enter/exit saja)
      └─ ScrollWrapper (parallax saja)
         └─ TiltWrapper / WebGLObject (pointer atau orientasi objek)
```

Satu pemilik untuk setiap properti transform pada node yang sama. Wrapper boleh terpisah, tetapi amplitudo gabungannya tetap dihitung. Hindari GSAP, CSS transition, dan pointer handler menimpa transform yang sama.

Progress dekorasi dapat dinormalisasi dari posisi container: `p = clamp((vh - rect.top) / (vh + rect.height), 0, 1)` dan `y = (2*p - 1) * 12`. Untuk smoothing yang tidak bergantung refresh rate: `a = 1 - exp(-dt/tau)`, `x += (target-x)*a`, dengan `dt`/`tau` dalam satuan sama. Jangan menambahkan smoothing panjang di atas scroll smoothing yang sudah ada tanpa uji rasa.

**Periksa urutan scheduler:** kode memakai satu Tempus, bukan beberapa RAF liar. GL advance berurutan 1, Lenis 5, GSAP 10; GL membaca rect/progress sebelum penulis frame yang sama. Usulkan input/Lenis → update progress/GSAP → render GL dan buktikan lewat frame log. Risiko membaca state lama terkonfirmasi dari dependensi; lag terlihat belum diukur. [RAF](https://github.com/subsarthur-jancommit/arth/blob/82ab37f7699a85bc4180aa57e23ac4b5d7ed51b4/lib/webgl/components/raf/index.ts#L15), [Lenis](https://github.com/subsarthur-jancommit/arth/blob/82ab37f7699a85bc4180aa57e23ac4b5d7ed51b4/components/layout/lenis/index.tsx#L118), [GSAP](https://github.com/subsarthur-jancommit/arth/blob/82ab37f7699a85bc4180aa57e23ac4b5d7ed51b4/components/effects/gsap.tsx#L100), [urutan Tempus](https://github.com/darkroomengineering/tempus#order-system).

Pause render dekorasi saat offscreen/tab tersembunyi; invalidate saat state, resize, atau aset berubah. Jangan mematikan scheduler global yang masih dipakai bagian lain. Reduced motion menghapus scrub, depth travel, pointer-follow; pilihan, fokus, dan feedback tetap jelas. Mobile dapat memakai transisi ilustrasi singkat jika hasil uji mendukungnya; fallback statis tetap tersedia.

## 7. Gamifikasi yang memperjelas kebutuhan

Bangun **Peta Kebutuhan** setelah journey utama bekerja. Tiga langkah opsional: pilih kebutuhan → pilih hambatan utama → tentukan prioritas. Progress “1 dari 3” menyatakan kemajuan nyata. Setiap pilihan boleh menyusun satu lapisan ilustrasi selama≤600ms; ringkasan teks langsung berubah tanpa menunggu animasi.

Hasilnya adalah ringkasan yang dapat diubah: kebutuhan, prioritas, dan saran jalur. Sediakan Ubah, Lewati, Mulai ulang, dan Ceritakan kebutuhan. Jangan memberi skor kesiapan usaha yang seolah diagnosis, hadiah palsu, streak, atau kunci kontak di balik permainan. Pengguna memeriksa ringkasan dan memilih kanal; tidak ada pesan otomatis. State sederhana cukup di memori sesi; persistensi data baru memerlukan keputusan produk tersendiri.

## 8. Putaran pengembangan dan gerbang penerimaan

| Urutan                   | Pekerjaan dan lokasi utama                                                  | Bukti selesai                                                                                                              |
| ------------------------ | --------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------- |
| 0 · P0 operasional       | Tuntaskan kanal kontak dari blueprint sebelumnya                            | CTA berakhir pada kanal nyata; diuji tanpa mengirim pesan                                                                  |
| 1 · P1 fondasi visual    | Token; navbar/CTA; hero; NeedChooser; `app/[locale]/page.tsx`               | Baseline statis desktop/mobile, state nav lengkap, satu hierarki bentuk/type; tidak menunggu WebGL                         |
| 2 · P1 kejernihan render | `lib/plates/canvas.ts`, `vault/webgl/plate-material/{scene.tsx,shaders.ts}` | Perbaikan smoothstep; matriks A–G; label HTML; baseline/final tanpa kehilangan bentuk huruf                                |
| 3 · P1 arsitektur scene  | `vault/blocks/passage`, `app/[locale]/home-sequence.tsx`                    | Satu contoh dipertahankan, jalur memilih kebutuhan langsung; periksa kembali `repeated`/aria-hidden saat duplikasi dihapus |
| 4 · P2 motion            | RAF/Lenis/GSAP, hero reveal, navbar, `components/ui/link`, transisi halaman | Writer sebelum renderer; satu owner transform; amplitudo/durasi sesuai kontrak; navigasi tidak menunggu efek               |
| 5 · P2 kualitas          | Fallback, reduced motion, perangkat sasaran, font/locale, keyboard          | Artefak uji dan rekaman state; kualitas diturunkan jika budget gagal                                                       |
| 6 · P3 pengayaan         | Pilih arah ilustrasi, aset matte/3D, Peta Kebutuhan                         | Penambahan membantu keputusan; ringkasan dan kontak selalu tersedia                                                        |

Saat menambah mode navigasi langsung, perbarui union tipe dan lifecycle transisi sekaligus; bypass snapshot, timer cover, dan arrival effect terkait. Jangan hanya mengganti nama default transisi. Menghapus Passage juga tidak berarti seluruh wrapper WebGL aman dihapus: audit konsumen hero/efek lain terlebih dahulu.

Checklist release berikut adalah kontrak penerimaan yang belum dijalankan pada implementasi baru:

- Layout360, 390, 768, 1024, 1440px; portrait/landscape; ID/EN; zoom200%. Tidak ada tabrakan navbar, clipping judul, atau scroll horizontal isi.
- Keyboard: skip link, seluruh nav/CTA, menu modal dan Escape, fokus kembali, active route benar. Hover tidak menjadi syarat memahami fungsi.
- Bentuk glyph stabil pada DPR1/2 dan semua state terpilih. Label penting tidak terhalang objek, glow, atau scan. Kontras teks final diperiksa pada hasil komposit; target internal body≥4,5:1.
- Scroll/route cepat, Back/Forward, ganti pilihan beruntun, resize saat animasi: tidak ada state tertinggal, jump layout, atau tombol terkunci karena animasi.
- Reduced motion, WebGL tak tersedia, context loss, font terlambat, dan JS gagal tetap menyediakan isi serta jalur layanan/kontak yang masuk akal.
- Ukur frame timing di perangkat sasaran. Target awal scene pada layar60Hz: p95 frame interval≤20ms selama interaksi standar, tanpa long task>50ms yang berasal dari efek. Rekam perangkat/skenario; angka ini budget proyek, bukan hasil audit. Jika gagal, kurangi DPR/detail/efek atau pilih render statis.
- Tidak ada CLS yang disebabkan penggantian fallback/canvas; area media memiliki ukuran/aspect ratio sebelum aset siap. Render dekorasi berhenti saat tidak dibutuhkan.

## 9. Cara memakai ilustrasi konsep

Tiga gambar pada papan adalah eksplorasi raster dengan ImageGen, bukan screenshot produk baru atau janji implementasi. Arah **Atelier Presisi** mempertahankan hero gelap dan objek di kanan; **Carta Editoriale** menguji permukaan paper dan kebutuhan sebagai row editorial; **Studio Cinématique** menguji panggung objek lebar dengan pilihan di bawahnya.

Rekomendasi audit: ambil kejernihan paper dan pilihan layanan dari Carta Editoriale; pertahankan kedalaman objek matte bila asetnya layak. Detail gambar masih memerlukan koreksi saat desain dipilih: nama konsep tidak masuk copy produk, nav home tidak menandai Konstruksi aktif, ID/EN wajib tersedia, dan terminologi kebutuhan mengikuti §4. Tekstur pada gambar dibatasi ke ilustrasi. Gambar tidak menetapkan ukuran presisi, aksesibilitas, breakpoint, atau perilaku motion—kontrak di dokumen ini yang menjadi acuan pengembangan.

Hasil putaran berikutnya harus dapat ditinjau dalam keadaan diam terlebih dahulu: struktur jelas, tulisan penuh, jalur layanan mudah ditemukan. Motion kemudian menambahkan karakter yang terukur dan tetap dapat dihentikan pada keadaan akhir yang nyaman dibaca.

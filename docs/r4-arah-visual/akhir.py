"""Halaman hasil akhir R4 (hasil-akhir.html): sistem huruf, pembagian
halaman, dan layar akhir B panggung dan A dokumen."""

import akhir_layar as L
import gabungan
import layar_b
from halaman import PAGE_CSS, SCRIPT
from layar_dasar import attr

ALASAN_PEMILIK = (
    'saya mengambil ARAH B karena MENYUKAI KONSEPNYA YANG BISA MORPH DAN JUGA SANGAT BAGUS UNTUK '
    'PITCH DECK DAN PRESENTASI LANGSUNG KE CLIENT TERHADAP SELURUH CAPATABILTAS YANG DIMILIKI. DAN '
    'DENGAN WARNA TERSEBUT KEDEPANNYA UNTUK ANIMASI DAN MOTION AKAN LEBIH MUDAH. KEMUDIAN ALASAN '
    'UTAMA SAYA MENGAMBIL ARAH A, KARENA SAYA MELIHAT BAHWA ADA SEBUAH KECOCOKAN DENGAN MEKANISME '
    'TEKNIS SEPERTI BLUEPRINT KONTRUKSI, ALUR AGENCY, DAN BAHKAN FLOWCHART TEKNOLOGI. TONENYA JUGA '
    'NYAMAN DI LIHAT DAN MUDAH DIPAHAMI UNTUK LAYOUTINGNYA.')

PAGE_EXTRA = """
.dua{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:22px;align-items:start}
@media (max-width:1020px){.dua{grid-template-columns:minmax(0,1fr)}}
blockquote{margin:18px 0 0;padding:14px 18px;border-left:3px solid var(--fg);background:var(--card);max-width:90ch;font-size:15px;line-height:1.55}
.spec{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:14px}
@media (max-width:820px){.spec{grid-template-columns:minmax(0,1fr)}}
.spc{padding:20px 22px;border-radius:8px;min-width:0;background:#f4f3ef;color:#110f0d;box-shadow:0 0 0 1px var(--line)}
.spc.dark{background:#110f0d;color:#f4f3ef}
.spc.wide{grid-column:1/-1}
.spc .k{display:block;font-family:'Geist Mono',ui-monospace,Consolas,monospace;font-size:11.5px;letter-spacing:.1em;text-transform:uppercase;opacity:.8}
.spc p{margin:12px 0 0;overflow-wrap:anywhere}
.spc .meta{display:block;margin-top:12px;font-size:13.5px;line-height:1.45;opacity:.8}
.s1{font-family:'Archivo','Segoe UI',Arial,sans-serif;font-stretch:125%;font-weight:800;font-size:clamp(30px,4.6vw,62px);line-height:1;letter-spacing:-.02em}
.s2{font-family:'Archivo','Segoe UI',Arial,sans-serif;font-weight:700;font-size:clamp(30px,3.6vw,52px);line-height:1.04;letter-spacing:-.02em}
.s3{font-family:'Geist',system-ui,sans-serif;font-size:18px;line-height:1.55;max-width:60ch}
.s4{font-family:'Instrument Serif',Georgia,serif;font-style:italic;font-size:clamp(26px,3vw,42px);line-height:1.14}
.s5{font-family:'Geist Mono',ui-monospace,Consolas,monospace;font-size:13px;font-weight:500;letter-spacing:.1em;text-transform:uppercase;line-height:1.7}
.peta{display:grid;grid-template-columns:minmax(0,1fr) 110px minmax(0,1fr);gap:0;align-items:stretch;margin-top:8px}
@media (max-width:820px){.peta{grid-template-columns:minmax(0,1fr)}.peta .mid{padding:12px 0}}
.peta .pd,.peta .pl2{padding:20px 22px;border-radius:8px;min-width:0}
.peta .pd{background:#110f0d;color:#f4f3ef}
.peta .pl2{background:#f4f3ef;color:#110f0d;box-shadow:0 0 0 1px var(--line)}
.peta ul{margin:12px 0 0;padding:0;list-style:none;display:grid;gap:10px}
.peta li{font-size:15px;line-height:1.4}
.peta li code{background:transparent;padding:0;opacity:.75}
.peta p{margin:14px 0 0;font-size:14px;opacity:.85}
.peta .mid{display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;font-family:'Geist Mono',ui-monospace,Consolas,monospace;font-size:11.5px;letter-spacing:.06em;color:var(--muted);gap:6px}
.peta .mid b{font-size:22px;color:var(--fg);font-family:var(--sans)}
.aturan{margin-top:16px;padding-left:1.15em;display:grid;gap:6px;max-width:100ch}
"""


def fig(body, cap):
    return ('<figure>%s<figcaption><span>%s</span><button class="besar" type="button" data-besar>'
            'Perbesar</button></figcaption></figure>' % (body, cap))


def section(sid, title, note, body):
    return ('<section class="baris" id="%s"><header><h2>%s</h2><p>%s</p></header>%s</section>'
            % (sid, title, note, body))


SKALA = (
    ('Judul panggung', 'Archivo', '40 → 120 px', '800, lebar 125', '0,95–1,0', '−0,02 em'),
    ('Judul dokumen', 'Archivo', '34 → 72 px', '700, lebar 100', '1,02–1,05', '−0,02 em'),
    ('Subjudul', 'Archivo', '22 → 34 px', '700, lebar 100–112', '1,15', '−0,01 em'),
    ('Teks dan navigasi', 'Geist', '16 → 20 px', '400 dan 500', '1,5', '0'),
    ('Kutipan pembeli', 'Instrument Serif, miring', '28 → 50 px', '400', '1,12', '0'),
    ('Label teknis', 'Geist Mono', '11 → 13 px', '500, huruf besar', '1,3', '+0,1 em'),
)


def build(sym, defs_str, contrast_html, fonts):
    spec = (
        '<div class="spec">'
        '<article class="spc dark wide"><span class="k">Judul panggung · Archivo, lebar 125, tebal '
        '800</span><p class="s1">Proyek jalan. Sistem bekerja. Pasar bertambah.</p><span class="meta">'
        'Beranda, pembuka halaman unit, Satu klien tiga unit, Kontak. Lebar 125 membuat judul '
        'terasa seperti layar presentasi.</span></article>'
        '<article class="spc"><span class="k">Judul dokumen · Archivo, lebar 100, tebal 700</span>'
        '<p class="s2">Pesan dan bayar dari meja</p><span class="meta">Keluarga yang sama dengan '
        'panggung, pada lebar normal, sehingga kedua tema terasa satu situs.</span></article>'
        '<article class="spc"><span class="k">Kutipan pembeli · Instrument Serif, miring</span>'
        '<p class="s4">“Pesanan saya bercampur di chat, kasir kewalahan saat ramai, dan bahan sering '
        'habis atau terbuang.”</p><span class="meta">Hanya untuk suara pembeli di pembuka halaman '
        'situasi, supaya terdengar seperti orang yang berbicara di antara gambar teknis.</span></article>'
        '<article class="spc"><span class="k">Teks · Geist</span><p class="s3">Di sesi itu kami '
        'melihat alur pesanan di kafe Anda hari ini dan menentukan paket yang cukup. Bila belum '
        'waktunya, kami mengatakannya terus terang dan menyarankan persiapan satu sampai tiga bulan.'
        '</p><span class="meta">Netral dan mudah dibaca panjang; satu keluarga dengan Geist Mono.'
        '</span></article>'
        '<article class="spc"><span class="k">Label teknis · Geist Mono</span><p class="s5">Alur '
        'kerja yang berjalan tanpa dikejar · Untuk siapa · Potongan A–A · ±0,00 · 4,60 · Lembar 02 / 03'
        '</p><span class="meta">Bahasa gambar kerja: label pelat, kop, ukuran, remah roti. Sudah '
        'dipakai situs sekarang.</span></article>'
        '</div>'
        '<div class="tbl" style="margin-top:16px"><table><thead><tr><th scope="col">Peran</th>'
        '<th scope="col">Huruf</th><th scope="col">Ponsel → desktop</th><th scope="col">Tebal, lebar'
        '</th><th scope="col">Jarak baris</th><th scope="col">Spasi huruf</th></tr></thead><tbody>%s'
        '</tbody></table></div>'
        '<ul class="aturan"><li>Syne pensiun; perannya diambil Archivo. Geist Mono tetap.</li>'
        '<li>Lisensi dibaca dari <code>OFL.txt</code> masing-masing di github.com/google/fonts, '
        '24 Oktober 2026: Archivo (2020 The Archivo Project Authors), Geist dan Geist Mono (2024 '
        'The Geist Project Authors), Instrument Serif (2022 The Instrument Serif Project Authors). '
        'Semuanya SIL Open Font License 1.1, boleh dipakai komersial.</li>'
        '<li>Gerak tidak menganimasikan sumbu huruf (lebar atau tebal), karena itu memaksa tata '
        'letak ulang setiap bingkai (aturan #4). "Morph" ada di pelat: maket ke lembar.</li></ul>'
        % ''.join('<tr>%s</tr>' % ''.join('<td>%s</td>' % c for c in r) for r in SKALA))
    peta = (
        '<div class="peta"><div class="pd"><span class="k" style="font-family:\'Geist Mono\',monospace;'
        'font-size:11.5px;letter-spacing:.1em">PANGGUNG · GELAP · ARAH B</span><ul>'
        '<li><b>Beranda</b> <code>/</code></li>'
        '<li><b>Pembuka halaman unit</b> <code>/konstruksi</code>, <code>/teknologi</code>, '
        '<code>/peekabo</code></li>'
        '<li><b>Satu klien, tiga unit</b> <code>/satu-klien-tiga-unit</code></li>'
        '<li><b>Kontak</b> <code>/kontak</code></li></ul>'
        '<p>Untuk memikat dan mempresentasikan seluruh kapabilitas. Setiap bagian setinggi satu '
        'layar, jadi bisa dipakai langsung saat pitch.</p></div>'
        '<div class="mid"><b>⇄</b>pelat mendarat<br>menjadi lembar</div>'
        '<div class="pl2"><span class="k" style="font-family:\'Geist Mono\',monospace;font-size:11.5px;'
        'letter-spacing:.1em">DOKUMEN · TERANG · ARAH A</span><ul>'
        '<li><b>Isi halaman unit</b>, sesudah pembukanya</li>'
        '<li><b>Untuk siapa</b>: enam halaman pembaca, misalnya <code>/konstruksi/pelaku-proyek</code></li>'
        '<li><b>Situasi</b>, misalnya <code>/teknologi/siap-pakai/kuliner</code></li>'
        '<li><b>Pekerjaan</b>, misalnya <code>…/kuliner/pesan-dan-bayar-dari-meja</code></li>'
        '<li><b>Cara kami bekerja</b>, <b>Cara kami dibayar</b>, <b>Kebijakan</b></li>'
        '<li><b>Versi cetak</b> semua halaman</li></ul>'
        '<p>Untuk menjelaskan: gambar kerja, alur, paket, dan syarat yang dibaca pelan.</p></div></div>'
        '<ul class="aturan">'
        '<li>Halaman unit memakai keduanya: pembuka gelap dengan maket unit, lalu isi terang. Saat '
        'digulir, maket rebah dan menjadi lembar kerja.</li>'
        '<li>Header membawa tanahnya sendiri: gelap di panggung, terang di dokumen, dan berganti '
        'saat pembuka unit lewat.</li>'
        '<li>Perpindahan dari panggung ke dokumen memakai momen <code>set-depth</code> '
        '(MOTION-SPEC §13.10): pelat mendarat dan tinta bertukar dengan kertas. Sebaliknya, lembar '
        'terangkat menjadi maket. Antardokumen memakai perpindahan yang sudah ada.</li>'
        '<li>Reduced motion: tanpa perpindahan; tema langsung berganti dan semua isi terlihat penuh '
        '(aturan #5).</li>'
        '<li>Mode presentasi khusus (layar penuh, tombol panah) bisa menyusul untuk pitch; tidak '
        'termasuk R4.</li></ul>')
    layar = (
        '<div class="dua">%s%s</div><div class="dua" style="margin-top:22px">%s%s</div>'
        '<div class="dua" style="margin-top:22px">%s%s</div>'
        '<div style="margin-top:22px">%s</div>'
        '<div class="dua" style="margin-top:22px">%s%s</div>'
        % (fig(L.beranda(), 'Beranda: panggung gelap, judul Archivo lebar 125, teks Geist.'),
           fig(L.satu_klien(), 'Satu klien, tiga unit: tiga maket berurutan, seperti presentasi '
               'untuk klien.'),
           fig(L.unit(), 'Halaman unit Konstruksi: pembuka gelap, lalu isi terang dengan pelat '
               'denah dan potongan.'),
           fig(L.situasi(), 'Halaman situasi Kuliner dan F&B: kutipan pembeli dalam Instrument '
               'Serif miring, kartu pekerjaan bergaya lembar kerja.'),
           fig(L.pekerjaan(), 'Halaman pekerjaan: kop, pelat diagram alur, dua paket, batas dan '
               'syarat, langkah pertama.'),
           fig('<div class="duo">%s%s</div>' % L.ponsel(), 'Ponsel: menu di panggung, dan halaman '
               'pekerjaan di dokumen.'),
           fig(_fx_story(), 'Perpindahan panggung ke dokumen, tiga bingkai.'),
           fig(L.navbar()[0], 'Navbar di panggung.'),
           fig(L.navbar()[1], 'Navbar di dokumen.')))
    kontras = contrast_html('g') + (
        '<p style="margin-top:10px;color:var(--muted);font-size:14px">Kutipan Instrument Serif '
        'memakai pasangan tinta di atas kertas (17,23:1). Hitungan dari token, bukan pengukuran di '
        'halaman yang dirender; <code>contrast.test.ts</code> dan <code>contrast-situ</code> tetap '
        'yang menentukan (aturan #11).</p>')
    r4 = ('<ol class="aturan"><li>Sistem huruf di <code>lib/styles/fonts.ts</code> dan '
          '<code>typography.ts</code>: Archivo, Geist, Instrument Serif, Geist Mono; Syne pensiun; '
          '<code>docs/DESIGN-SYSTEM.md</code> §2 diperbarui.</li>'
          '<li>Tema per halaman sesuai peta di atas, dengan header yang membaca tanahnya.</li>'
          '<li>Pelat SVG asli untuk tiga unit dari satu gambar: aksonometri bercahaya untuk '
          'panggung, garis biasa untuk dokumen.</li>'
          '<li>Beranda dan lintasan yang di-pin dalam gaya B, pelat sebagai material WebGL, pelat '
          'datar sebagai jalur tanpa WebGL, reduced motion, dan tanpa JavaScript.</li>'
          '<li>Navbar desktop dan ponsel dalam dua tema: lima tujuan, tempat pengalih bahasa R7, '
          'ukuran menu per tautan (E8.1), tombol Tutup yang muat (E8.5).</li>'
          '<li>Preview Vercel untuk Anda tinjau; merge hanya setelah ci dan e2e hijau.</li></ol>'
          '<p style="color:var(--muted)">Sesudahnya: R5 membangun halaman dokumen dalam gaya A, R6 '
          'memasang gerak, R7 teks Inggris. Belum diukur: berat huruf dan WebGL di ponsel kelas '
          'bawah; angkanya diambil di perangkat nyata saat R4.</p>')
    body = (
        '<svg width="0" height="0" style="position:absolute" aria-hidden="true" focusable="false">'
        '<defs>%s</defs>%s</svg>'
        % (defs_str, ''.join('<symbol id="%s" viewBox="0 0 1600 1120">%s</symbol>' % kv
                             for kv in sym.items()))
        + '<div class="wrap"><header class="intro"><p class="eyebrow">R4 · Hasil akhir · 24 Oktober '
          '2026</p><h1>Hasil akhir R4: panggung dan dokumen</h1><p class="lede">B, Maket cahaya, '
          'menjadi panggung. A, Lembar kerja, menjadi dokumen. Situs tetap monokrom. Atas permintaan '
          'Anda, saya memutuskan sistem huruf dan pembagian halamannya; keduanya di bawah, bersama '
          'layar akhirnya. Masih gambar diam: produksi tidak berubah.</p>'
          '<blockquote>%s<br><span style="color:var(--muted)">Pemilik, 24 Oktober 2026</span>'
          '</blockquote></header>' % attr(ALASAN_PEMILIK)
        + section('huruf', 'Sistem huruf', 'Empat peran, tiga keluarga. Semua contoh memakai teks '
                  'yang tayang.', spec)
        + section('halaman', 'Pembagian halaman', 'Panggung untuk memikat dan presentasi, dokumen '
                  'untuk menjelaskan.', peta)
        + section('layar', 'Layar akhir', 'Ketuk gambar untuk memperbesar; tombol Ukuran asli '
                  'menampilkan 1:1.', layar)
        + section('kontras', 'Kontras', 'Tetap dua netral yang sudah ada.', kontras)
        + section('r4', 'Yang dibangun R4', 'Satu PR, ditinjau di preview Vercel.', r4)
        + '<p class="sumber">Sumber: docs/r4-arah-visual/ di PR draf #46, dibuat oleh bangun.py. '
          'Karya asli tanpa kode atau gambar pihak ketiga; huruf dimuat dari Google Fonts saat '
          'dilihat. Halaman pembanding arah ada di artifact sebelumnya.</p></div>'
        + '<dialog id="lb" aria-label="Gambar diperbesar"><div class="lb-bar"><p></p>'
          '<button class="besar" type="button" data-ukuran>Ukuran asli</button>'
          '<button class="besar" type="button" data-tutup>Tutup</button></div>'
          '<div class="lb-body"></div></dialog>')
    css = PAGE_CSS + PAGE_EXTRA + layar_b.css() + gabungan.css() + L.css()
    return ('<title>Hasil akhir R4</title>\n'
            '<meta name="claude:viewport-fit-sides" content="cover">\n'
            '<link rel="preconnect" href="https://fonts.googleapis.com">\n'
            '<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>\n'
            '<link rel="stylesheet" href="%s">\n<style>%s</style>\n%s\n<script>%s</script>\n'
            % (fonts.replace('&', '&amp;'), css, body, SCRIPT))


def _fx_story():
    return gabungan.transisi().replace('<div class="g-story">', '<div class="g-story fx">', 1)

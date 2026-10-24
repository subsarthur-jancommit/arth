"""Merakit index.html dari pelat, layar, dan alasan."""

import alasan
import layar_a
from halaman import LAYAR, PAGE_CSS, SCRIPT, fig, plate, row

import layar_b
import layar_c

CAP = dict(
    konstruksi=dict(
        a='Denah di atas potongan, dengan skala dan garis as yang sama. Dinding terpotong diarsir; kop di kanan.',
        b='Denah rebah di lantai, potongan berdiri di belakangnya. Bentuk inilah yang menjadi tekstur di WebGL.',
        c='Dua lembar cetak ungu ditempel. Coretan mengitari dapur dan bar; dua catatan menunjuk bagian yang dijawab.'),
    teknologi=dict(
        a='Empat jalur: tamu, sistem, dapur, pemasok. Bulatan 01 merujuk ke meja di lembar Konstruksi.',
        b='Lempeng tipis di lantai cahaya; titik terang adalah pesanan yang sedang berjalan.',
        c='Antre di kasir dicoret dan diganti bayar dari meja. Catatan diambil dari halaman pekerjaannya.'),
    peekabo=dict(
        a='Tiga kolom waktu dan tiga baris tujuan. Isi kartu dari bab Agency marketing, Produksi kreatif, dan Experiential dan event.',
        b='Kartu sebagai lempeng; tumpukan bingkai tegak adalah stok konten sebulan dari satu hari syuting.',
        c='Papannya sendiri adalah papan kampanye: kartu bertempel, pita label, satu stempel, satu coretan.'),
)

INTRO = (
    '<div class="wrap"><header class="intro"><p class="eyebrow">R4 · Arah visual dan navigasi'
    ' · 24 Oktober 2026</p><h1>Tiga arah visual untuk Arthur</h1><p class="lede">Tiga pilihan '
    'untuk pelat gambar kerja, beranda, kartu, dan navigasi. Semuanya gambar diam: belum ada '
    'yang dibangun, dan produksi tidak berubah. Pilih satu, lalu R4 membangunnya.</p>'
    '<div class="same"><h2>Yang sama di ketiga arah</h2><ul>'
    '<li><b>Isi.</b> Semua teks diambil dari situs yang sedang tayang '
    '(arth-test-01.vercel.app) pada 24 Oktober 2026. Tidak ada teks contoh.</li>'
    '<li><b>Pelat.</b> Ketiga pelat menggambar satu rangkaian dari halaman Satu klien, tiga '
    'unit: kafe baru di tempat sewa. Konstruksi menyiapkan tempatnya, Teknologi memasang pesan '
    'dan bayar dari meja, Peekabo mengundang warga sebelum kafe dibuka. Setiap pelat memuat '
    'kalimat “Rangkaian yang mungkin, bukan proyek yang pernah kami kerjakan.”</li>'
    '<li><b>Navigasi.</b> Lima tujuan: Konstruksi, Teknologi, Peekabo, Cara kami bekerja, dan '
    'Kontak. Sisi kanan header punya tempat untuk pengalih bahasa ID dan EN, yang baru tayang '
    'di R7; sampai saat itu tempat itu tidak dirender dan tombol bergeser ke kanan. Di ponsel, '
    'ukuran setiap tautan menu dihitung dari panjang katanya sendiri, bukan dari label '
    'terpanjang (E8.1), dan tombol Tutup muat di kotaknya (E8.5).</li>'
    '<li><b>Aturan.</b> Gerak hanya memakai transform dan opacity (#4). Dengan reduced motion, '
    'semua isi tetap terlihat penuh (#5). Selalu ada jalur tanpa WebGL (#14).</li>'
    '</ul></div></header>')

PILIHAN = (
    '<section class="pilihan" id="pilihan"><h2>Yang Anda pilih, dan yang dibangun R4</h2>'
    '<p>Pilih satu: A, B, atau C. Boleh juga mengambil bagian dari arah lain, misalnya '
    'navbar A dengan pelat C; sebutkan saja.</p><p>Sesudah Anda memilih, R4 dibangun dalam '
    'satu PR:</p><ol>'
    '<li>Tiga set pelat SVG asli dalam gaya yang dipilih: Konstruksi denah dan potongan, '
    'Teknologi diagram alur, Peekabo papan kampanye; dengan alt yang menyebut isi gambar.</li>'
    '<li>Lintasan beranda yang di-pin (E1.2) dengan pelat itu, beserta jalur reduced motion '
    'dan tanpa JavaScript.</li>'
    '<li>Keputusan WebGL: untuk A dan C, scene WebGL dicabut dari beranda; untuk B, pelat '
    'menjadi material di kanvas root, dengan pelat SVG datar sebagai jalur tanpa WebGL.</li>'
    '<li>Navbar baru untuk desktop dan ponsel: lima tujuan, tempat pengalih bahasa R7, ukuran '
    'menu ponsel per tautan (E8.1), dan tombol Tutup yang muat (E8.5).</li>'
    '<li>Preview Vercel untuk Anda tinjau; merge hanya setelah ci dan e2e hijau (#22, #23).'
    '</li></ol><p>Belum termasuk: halaman lain (R5), momen gerak lain (R6), dan teks Inggris '
    '(R7).</p></section>'
    '<p class="sumber">Sumber: docs/r4-arah-visual/ di PR draf. Gambar dibuat oleh bangun.py, '
    'karya asli tanpa kode atau gambar pihak ketiga. Huruf dimuat dari Google Fonts saat '
    'dilihat dan tidak disalin ke repositori; lisensinya SIL OFL 1.1.</p></div>'
    '<dialog id="lb" aria-label="Gambar diperbesar"><div class="lb-bar"><p></p>'
    '<button class="besar" type="button" data-ukuran>Ukuran asli</button>'
    '<button class="besar" type="button" data-tutup>Tutup</button></div>'
    '<div class="lb-body"></div></dialog>')


def _tag(a, swatch, prefix='Arah '):
    return ('<div class="tag"><i style="background:%s;border-color:%s"></i>%s%s · %s</div>'
            % (swatch[0], swatch[1], prefix, a.upper(), alasan.ARAH[a]['nama']))


def _li(xs):
    return '<ul>%s</ul>' % ''.join('<li>%s</li>' % x for x in xs)


def build_page(sym, defs_str, contrast_html, ground, swatch, fonts):
    parts = ['<svg width="0" height="0" style="position:absolute" aria-hidden="true" '
             'focusable="false"><defs>%s</defs>%s</svg>'
             % (defs_str, ''.join('<symbol id="%s" viewBox="0 0 1600 1120">%s</symbol>' % kv
                                  for kv in sym.items())),
             INTRO,
             '<nav class="pilih" aria-label="Tampilkan arah"><span>Tampilkan</span>'
             '<button type="button" data-pilih="semua" aria-pressed="true">Ketiganya</button>'
             + ''.join('<button type="button" data-pilih="%s" aria-pressed="false">%s · %s</button>'
                       % (a, a.upper(), alasan.ARAH[a]['nama']) for a in 'abc') + '</nav>']
    cards = ''
    for a in 'abc':
        A = alasan.ARAH[a]
        cards += ('<article data-arah="%s">%s<h2>%s</h2>%s<p>%s</p><div class="chips">%s</div>'
                  '</article>' % (a, _tag(a, swatch[a]), A['nama'],
                                  plate('p-%s-konstruksi' % a, ground[a], alasan.ALT['konstruksi']),
                                  A['satu'], ''.join('<span>%s</span>' % c for c in A['chips'])))
    parts.append('<section class="baris ringkas" id="ringkas"><header><h2>Tiga arah, satu '
                 'kalimat masing-masing</h2><p>Ketuk gambar mana pun untuk memperbesarnya. Tombol '
                 'di atas menampilkan satu arah saja, dengan gambar selebar layar.</p></header>'
                 '<div class="tiga">%s</div></section>' % cards)
    for unit, title in (('konstruksi', 'Pelat Konstruksi: denah dan potongan'),
                        ('teknologi', 'Pelat Teknologi: diagram alur'),
                        ('peekabo', 'Pelat Peekabo: papan kampanye')):
        figs = [fig(a, swatch[a], plate('p-%s-%s' % (a, unit), ground[a], alasan.ALT[unit]),
                    CAP[unit][a]) for a in 'abc']
        parts.append(row('pelat-' + unit, title, 'Alt gambar: ' + alasan.ALT[unit], figs))
    parts.append(row('beranda', 'Beranda: layar pertama, 1440 × 900',
                     'Judul, kalimat, dan tombolnya teks tayang hari ini. Pelat mengisi beranda '
                     'yang sekarang tanpa gambar (E1, E8.3).',
                     [fig(a, swatch[a], LAYAR[a].home(), 'Layar pertama arah %s.' % a.upper())
                      for a in 'abc']))
    figs = []
    for a in 'abc':
        A = alasan.ARAH[a]
        lain = ('<div class="lain">%s<dl><dt>Reduced motion</dt><dd>%s</dd><dt>Tanpa '
                'JavaScript</dt><dd>%s</dd><dt>Ponsel</dt><dd>%s</dd></dl></div>'
                % (LAYAR[a].fallback(), A['rm'], A['nojs'], A['ponsel']))
        figs.append(fig(a, swatch[a], LAYAR[a].path(), A['gerak'][0], extra=lain))
    parts.append(row('lintasan', 'Beranda: satu bingkai lintasan yang di-pin',
                     'Lintasan E1.2 kembali dengan pelat Arthur. Bingkai kecil di bawahnya adalah '
                     'keadaan tanpa gerak, yang juga jalur tanpa JavaScript.', figs))
    parts.append(row('kartu', 'Kartu pekerjaan',
                     'Kartu “Mulai dari sini” di situasi Kuliner dan F&amp;B, dengan satu tanda '
                     'gambar kerja per kartu (R3).',
                     [fig(a, swatch[a], LAYAR[a].card(), 'Kartu arah %s.' % a.upper())
                      for a in 'abc']))
    parts.append(row('navbar', 'Navbar desktop',
                     'Lima tujuan dengan ritme yang sama (E8.2). Sel ID dan EN adalah tempat '
                     'pengalih bahasa R7.',
                     [fig(a, swatch[a], LAYAR[a].nav_desktop(),
                          'Navbar desktop arah %s, di halaman Teknologi.' % a.upper())
                      for a in 'abc']))
    parts.append(row('navbar-ponsel', 'Navbar ponsel: tertutup dan terbuka, 390 × 844',
                     'Tiga unit tampil besar, dua halaman lebih kecil, tombol di bawah.',
                     [fig(a, swatch[a], '<div class="duo">%s%s</div>' % LAYAR[a].nav_phone(),
                          'Menu ponsel arah %s.' % a.upper()) for a in 'abc']))
    arts = ''
    for a in 'abc':
        A = alasan.ARAH[a]
        arts += ('<article data-arah="%s">%s<h3>Suasana</h3><p>%s</p><h3>Cara pelat digambar</h3>'
                 '%s<h3>Huruf</h3><p>%s</p><h3>Gerak lintasan beranda</h3>%s<ul><li>Reduced '
                 'motion: %s</li><li>Tanpa JavaScript: %s</li><li>Ponsel: %s</li></ul>'
                 '<h3>WebGL</h3><p>%s</p><h3>Kontras teks dan latar</h3>%s<h3>Risiko</h3>%s'
                 '</article>'
                 % (a, _tag(a, swatch[a]), A['suasana'], _li(A['pelat']), A['huruf'],
                    ''.join('<p>%s</p>' % x for x in A['gerak']), A['rm'], A['nojs'],
                    A['ponsel'], A['webgl'], contrast_html(a), _li(A['risiko'])))
    parts.append('<section class="baris alasan" id="alasan"><header><h2>Alasan per arah</h2>'
                 '<p>Kontras dihitung dengan rumus WCAG 2.x dari token yang sama (aturan #11); '
                 'rinciannya di kontras.md.</p></header><div class="tiga">%s</div></section>' % arts)
    parts.append(PILIHAN)
    css = PAGE_CSS + layar_a.css() + layar_b.css() + layar_c.css()
    return ('<title>Arah visual R4</title>\n'
            '<meta name="claude:viewport-fit-sides" content="cover">\n'
            '<link rel="preconnect" href="https://fonts.googleapis.com">\n'
            '<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>\n'
            '<link rel="stylesheet" href="%s">\n<style>%s</style>\n%s\n<script>%s</script>\n'
            % (fonts.replace('&', '&amp;'), css, '\n'.join(parts), SCRIPT))

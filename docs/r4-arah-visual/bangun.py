#!/usr/bin/env python3
"""Gambar diam R4: tiga arah visual untuk dipilih pemilik.

Dasar: keputusan P2 dan paket R4 di docs/RENCANA-REVISI-F3.md; temuan E1,
E8.1, E8.2, dan E8.3 di docs/TINJAUAN-F01-F03.md.

Menulis ke folder ini:
  pelat/*.svg   pelat gambar kerja, tiga arah x tiga unit, ditambah tiga
                pelat datar untuk jalur tanpa WebGL arah B
  kontras.md    rasio kontras WCAG setiap pasangan teks dan latar
  index.html    halaman pembanding, ketiga arah berdampingan

Hanya pustaka standar Python. Jalankan:  python docs/r4-arah-visual/bangun.py
Karya asli untuk proyek ini; asal teks dan huruf dicatat di README.md.
"""

import os

import alasan
import pelat_a
import pelat_b
import pelat_c
import warna
from layar_dasar import attr

HERE = os.path.dirname(os.path.abspath(__file__))
FONTS = ('https://fonts.googleapis.com/css2?family=Archivo:wdth,wght@62..125,100..900'
         '&family=Barlow+Condensed:wght@500;600;700;800&family=Barlow:wght@400;500;600;700'
         '&family=Geist:wght@400;500;600;700&family=Geist+Mono:wght@400;500;600'
         '&family=Syne:wght@400..800&display=swap')
UNIT_NAMES = dict(konstruksi='Konstruksi', teknologi='Teknologi', peekabo='Peekabo')
X = warna.X
GROUND = dict(a=X['paper'], b=X['ink'], c=X['papan'])
SWATCH = dict(a=(X['paper'], X['ink']), b=(X['ink'], X['paper']), c=(X['ungu'], X['ungu']))


def symbols():
    s = {}
    for k, f in pelat_a.PLATES.items():
        s['p-a-' + k] = f()
    for k in ('konstruksi', 'teknologi', 'peekabo'):
        s['p-b-' + k] = pelat_b.PLATES[k]()
        s['p-b-%s-scene' % k] = pelat_b.PLATES[k](cap=False)
        s['p-b-%s-datar' % k] = pelat_b.PLATES[k + '_datar']()
    s['p-c-konstruksi'] = pelat_c.konstruksi()
    s['p-c-teknologi'] = pelat_c.teknologi()
    s['p-c-peekabo'] = pelat_c.peekabo()
    s['p-c-konstruksi-lembar'] = pelat_c.konstruksi_lembar()
    s['p-c-teknologi-lembar'] = pelat_c.teknologi_lembar()
    s['p-c-teknologi-gerak'] = pelat_c.teknologi_lembar(markup=0.55, lift=True)
    s['p-c-peekabo-lepas'] = pelat_c.peekabo(with_board=False, stamped=False)
    return s


def defs():
    return pelat_a.defs() + pelat_b.defs() + pelat_c.defs()


def write_svgs(sym):
    os.makedirs(os.path.join(HERE, 'pelat'), exist_ok=True)
    head = ('<?xml version="1.0" encoding="UTF-8"?>\n'
            '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1600 1120" width="1600" '
            'height="1120" role="img" aria-labelledby="t d">\n')
    style = '<style><![CDATA[@import url("%s");]]></style>\n' % FONTS
    files = []
    for arah in 'abc':
        for unit in ('konstruksi', 'teknologi', 'peekabo'):
            ids = ['p-%s-%s' % (arah, unit)]
            if arah == 'b':
                ids.append('p-b-%s-datar' % unit)
            for sid in ids:
                name = sid[2:] + '.svg'
                datar = sid.endswith('datar')
                title = 'Arah %s, %s: pelat %s%s' % (
                    arah.upper(), alasan.ARAH[arah]['nama'], UNIT_NAMES[unit],
                    ', versi datar tanpa WebGL' if datar else '')
                body = (head + '<title id="t">%s</title>\n<desc id="d">%s Gambar diam R4, karya '
                        'asli untuk Arthur; lihat docs/r4-arah-visual/README.md.</desc>\n'
                        % (attr(title), attr(alasan.ALT[unit])) + style
                        + '<defs>%s</defs>\n' % defs()
                        + '<rect width="1600" height="1120" fill="%s"/>\n' % GROUND[arah]
                        + sym[sid] + '\n</svg>\n')
                with open(os.path.join(HERE, 'pelat', name), 'w', encoding='utf-8',
                          newline='\n') as fh:
                    fh.write(body)
                files.append(name)
    return files


# ------------------------------------------------------------- kontras

def md_table(head, rows):
    cols = list(zip(*([head] + rows)))
    widths = [max(3, max(len(c) for c in col)) for col in cols]

    def row(cells):
        return '| ' + ' | '.join(c.ljust(w) for c, w in zip(cells, widths)) + ' |'

    return '\n'.join([row(head), '| ' + ' | '.join('-' * w for w in widths) + ' |']
                     + [row(r) for r in rows])


def write_kontras():
    out = ['# Kontras arah visual R4', '',
           'Dibuat oleh `bangun.py`; jangan disunting tangan. Warna `oklch()` diubah ke sRGB '
           '8-bit seperti yang dilukis browser, warna transparan dikomposit di atas latarnya, '
           'lalu rasio dihitung dengan rumus WCAG 2.x. Teks perlu 4,5:1 (WCAG 1.4.3); garis '
           'yang membawa arti perlu 3:1 (WCAG 1.4.11).', '',
           'Ini hitungan, bukan pengukuran di halaman yang dirender. Bila satu arah dibangun, '
           '`contrast.test.ts` dan `e2e/contrast-situ.e2e.ts` tetap yang menentukan (aturan #11).',
           '']
    for arah in 'abc':
        rows = []
        for r in warna.rows(arah):
            rows.append([r['label'], '`%s`' % r['fg'], '`%s`' % r['bg'], warna.fmt_ratio(r['r']),
                         ('4,5:1' if r['kind'] == 'teks' else '3:1'),
                         'Lulus' if r['ok'] else 'Di bawah ambang'])
        out += ['## Arah %s, %s' % (arah.upper(), alasan.ARAH[arah]['nama']), '',
                md_table(['Pasangan', 'Depan', 'Latar', 'Rasio', 'Ambang', 'Hasil'], rows), '']
    out += ['Token sumber:', '']
    out += ['- `%s`: %s' % (warna.X[k], v) for k, v in warna.SUMBER.items()]
    with open(os.path.join(HERE, 'kontras.md'), 'w', encoding='utf-8', newline='\n') as fh:
        fh.write('\n'.join(out) + '\n')


def contrast_html(arah):
    rows = ''
    for r in warna.rows(arah):
        need = '4,5:1 teks' if r['kind'] == 'teks' else '3:1 garis'
        res = 'Lulus' if r['ok'] else 'Di bawah ambang'
        rows += ('<tr><td><span class="sw" style="color:%s;background:%s">%s</span>%s</td>'
                 '<td class="n">%s</td><td>%s</td><td class="%s">%s</td></tr>'
                 % (r['fg'], r['bg'], 'Aa' if r['kind'] == 'teks' else '━', r['label'],
                    warna.fmt_ratio(r['r']), need, 'ok' if r['ok'] else 'no', res))
    return ('<div class="tbl"><table><thead><tr><th scope="col">Pasangan</th>'
            '<th scope="col">Rasio</th><th scope="col">Ambang</th><th scope="col">Hasil</th>'
            '</tr></thead><tbody>%s</tbody></table></div>' % rows)


def main():
    import rakit

    sym = symbols()
    files = write_svgs(sym)
    write_kontras()
    page = rakit.build_page(sym, defs(), contrast_html, GROUND, SWATCH, FONTS)
    with open(os.path.join(HERE, 'index.html'), 'w', encoding='utf-8', newline='\n') as fh:
        fh.write(page)
    print('pelat: %d berkas; index.html %d KB' % (len(files), len(page) // 1024))
    if warna.GAMUT:
        print('di luar gamut sRGB:', warna.GAMUT)


if __name__ == '__main__':
    main()

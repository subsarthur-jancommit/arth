"""Arah A, Lembar kerja: tinta di atas kertas, kop di kanan seperti lembar
gambar kerja."""

import model as M
from gambar import OrthoXY, OrthoXZ, line, rect, style_a, text, wrap
from pelat_dasar import board_ortho, flow_ortho, konstruksi_ortho, scale_bar
from warna import X

S = style_a()
SITUASI = ('Anda menyewa tempat untuk kafe baru dan ingin kafe itu siap '
           'melayani sejak hari pertama dibuka.')
JUJUR = 'Rangkaian yang mungkin, bukan proyek yang pernah kami kerjakan.'
SKALA = 56  # piksel per meter pada pelat Konstruksi


def defs():
    ink = X['ink']
    return (
        '<pattern id="a-hatch" width="7" height="7" patternUnits="userSpaceOnUse" '
        'patternTransform="rotate(45)"><line x1="0" y1="0" x2="0" y2="7" '
        'stroke="%s" stroke-width="1" stroke-opacity=".62"/></pattern>'
        '<pattern id="a-hatch-fine" width="4" height="4" patternUnits="userSpaceOnUse" '
        'patternTransform="rotate(45)"><line x1="0" y1="0" x2="0" y2="4" '
        'stroke="%s" stroke-width=".8" stroke-opacity=".55"/></pattern>'
        '<pattern id="a-earth" width="14" height="14" patternUnits="userSpaceOnUse">'
        '<path d="M0 14 L7 7 M7 14 L14 7" stroke="%s" stroke-width=".9" '
        'stroke-opacity=".5"/></pattern>' % (ink, ink, ink)
        + ''.join(
            '<linearGradient id="a-rev-%d" x1="0" y1="0" x2="1600" y2="0" '
            'gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="#fff"/>'
            '<stop offset="%.3f" stop-color="#fff"/><stop offset="%.3f" stop-color="#000"/>'
            '</linearGradient><mask id="a-mask-%d" maskUnits="userSpaceOnUse" x="0" y="0" '
            'width="1600" height="1120"><rect width="1600" height="1120" '
            'fill="url(#a-rev-%d)"/></mask>' % (p, p / 100, p / 100 + 0.03, p, p)
            for p in (58, 80)
        )
    )


def sheet_frame():
    ink = X['ink']
    return (rect(16, 16, 1568, 1088, fill='none', stroke=ink, stroke_width=2.5)
            + rect(24, 24, 1552, 1072, fill='none', stroke=ink, stroke_width=0.75,
                   stroke_opacity=0.6)
            + line((1236, 24), (1236, 1096), stroke=ink, stroke_width=1.5))


def kop(unit, kerja, isi, row7_label, row7, nomor, bar=False):
    ink, muted = X['ink'], X['muted_a']
    x, w = 1258, 296
    hair = dict(stroke=ink, stroke_width=1, stroke_opacity=0.28)
    out = [text(x, 84, 'ARTHUR', 38, 'syne', ink, weight=800, ls=-0.5),
           text(x, 114, 'Unit ' + unit, 14, 'mono', muted)]

    def label(y, s):
        return text(x, y, s, 11.5, 'mono', muted, ls=1.4, upper=True, weight=500)

    rows = (140, 250, 350, 500, 600, 680, 830)
    for y in rows:
        out.append(line((1236, y), (1576, y), **hair))
    out.append(label(166, 'Pekerjaan'))
    out.append(text(x, 196, wrap(kerja, 21, 'syne', w), 21, 'syne', ink, weight=600, lh=1.2))
    out.append(label(276, 'Isi lembar'))
    out.append(text(x, 304, isi, 15, 'mono', ink, lh=1.4))
    out.append(label(376, 'Situasi'))
    out.append(text(x, 404, wrap(SITUASI, 16.5, 'syne', w), 16.5, 'syne', ink, lh=1.32))
    out.append(label(526, 'Catatan'))
    out.append(text(x, 552, wrap(JUJUR, 13, 'mono', w), 13, 'mono', ink, lh=1.42))
    out.append(label(626, 'Wilayah'))
    out.append(text(x, 654, 'Subang, Purwakarta, dan Bandung', 14, 'mono', ink))
    out.append(label(706, row7_label))
    if bar:
        out.append(scale_bar(x, 752, SKALA, S))
    else:
        out.append(text(x, 734, wrap(row7, 16.5, 'syne', w), 16.5, 'syne', ink, lh=1.32))
    out.append(label(856, 'Lembar'))
    out.append(text(x - 4, 1010, nomor, 118, 'syne', ink, weight=800, ls=-4))
    out.append(text(1478, 1004, '/ 03', 22, 'mono', ink, weight=500))
    return ''.join(out)


def konstruksi():
    s = SKALA
    plan = OrthoXY(80 + 2.6 * s, 72 + 1.87 * s, s)
    sec = OrthoXZ(80 + 2.6 * s, 1000, s)
    title_plan = (text(80, 512, 'Denah lantai 1', 24, 'syne', X['ink'], weight=700,
                       upper=True, ls=0.5)
                  + scale_bar(330, 498, s, S))
    title_sec = text(80, 1066, 'Potongan A–A', 24, 'syne', X['ink'], weight=700,
                     upper=True, ls=0.5)
    return (sheet_frame()
            + konstruksi_ortho(S, plan, sec, title_plan=title_plan, title_sec=title_sec)
            + kop('Konstruksi', 'Kafe siap buka dari lokasi sewa',
                  'Denah lantai 1\nPotongan A–A', 'Skala', '', '01', bar=True))


def teknologi():
    title = (text(80, 112, 'Diagram alur pesanan', 24, 'syne', X['ink'], weight=700,
                  upper=True, ls=0.5)
             + text(80, 136, 'Pesan dan bayar dari meja · Layar pesanan di dapur · '
                    'Bot stok bahan dan pesan ulang ke pemasok', 13, 'mono', X['muted_a']))
    return (sheet_frame() + title + flow_ortho(S)
            + kop('Teknologi', 'Pesan dan bayar dari meja', 'Diagram alur\npesanan',
                  'Unit', 'Bot dan workflow yang bekerja dua puluh empat jam untuk '
                  'bisnis Anda, di sektor apa pun.', '02'))


def peekabo():
    title = text(80, 112, 'Papan kampanye pembukaan', 24, 'syne', X['ink'], weight=700,
                 upper=True, ls=0.5)
    return (sheet_frame() + title + board_ortho(S)
            + kop('Peekabo', 'Pembukaan cabang atau gerai', 'Papan kampanye\npembukaan',
                  'Unit', 'Rebut perhatian. Bangun kepercayaan. Biarkan jaringan '
                  'yang menjual.', '03'))


PLATES = dict(konstruksi=konstruksi, teknologi=teknologi, peekabo=peekabo)
GROUND = X['paper']

"""Arah C, Papan proyek: lembar cetak biru ungu ditempel di papan berlubang,
dicap, lalu dicoret tinta hitam di bagian yang dijawab pekerjaannya."""

import math

import model as M
from gambar import (OrthoXY, OrthoXZ, arrowhead, el, g, line, num, pline, poly,
                    rect, style_c, text, ts, tw, wrap)
from pelat_dasar import (axes_lines, board_glyphs, draw_labels, draw_model,
                         flow_ortho, plan_marks, rings, scale_bar, section_marks)
from warna import X

S = style_c()
U, T, K = X['ungu'], X['tinta'], X['kertas']
JUJUR = 'Rangkaian yang mungkin, bukan proyek yang pernah kami kerjakan.'


def defs():
    return (
        '<pattern id="c-peg" width="28" height="28" patternUnits="userSpaceOnUse">'
        '<circle cx="14" cy="14" r="2.7" fill="{L}"/></pattern>'
        '<filter id="c-shadow" x="-6%" y="-6%" width="114%" height="122%" '
        'color-interpolation-filters="sRGB"><feGaussianBlur in="SourceAlpha" stdDeviation="5"/>'
        '<feOffset dx="2" dy="5" result="o"/><feComponentTransfer in="o" result="s">'
        '<feFuncA type="linear" slope="0.2"/></feComponentTransfer>'
        '<feMerge><feMergeNode in="s"/><feMergeNode in="SourceGraphic"/></feMerge></filter>'
        '<filter id="c-lift" x="-12%" y="-12%" width="130%" height="140%" '
        'color-interpolation-filters="sRGB"><feGaussianBlur in="SourceAlpha" stdDeviation="16"/>'
        '<feOffset dx="8" dy="22" result="o"/><feComponentTransfer in="o" result="s">'
        '<feFuncA type="linear" slope="0.26"/></feComponentTransfer>'
        '<feMerge><feMergeNode in="s"/><feMergeNode in="SourceGraphic"/></feMerge></filter>'
        '<filter id="c-ink" x="-5%" y="-10%" width="110%" height="120%">'
        '<feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" seed="7" result="n"/>'
        '<feColorMatrix in="n" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 -4 0 0 0 3" '
        'result="m"/><feComposite in="SourceGraphic" in2="m" operator="in"/></filter>'
    ).replace('{L}', X['lubang'])


def board(w=1600, h=1120):
    return rect(0, 0, w, h, fill=X['papan']) + rect(0, 0, w, h, fill='url(#c-peg)')


def tape(cx, cy, rot=0, w=112, h=30):
    pts = [(-w / 2, -h / 2), (w / 2, -h / 2)]
    pts += [(w / 2 + (3 if i % 2 else 0), -h / 2 + i * h / 6) for i in range(1, 6)]
    pts += [(w / 2, h / 2), (-w / 2, h / 2)]
    pts += [(-w / 2 - (3 if i % 2 else 0), -h / 2 + i * h / 6) for i in range(5, 0, -1)]
    return poly(pts, fill='#ffffff', fill_opacity=0.6, stroke=T, stroke_opacity=0.08,
                stroke_width=1, transform='translate(%s %s) rotate(%s)' % (num(cx), num(cy), num(rot)))


def placed(x, y, w, h, rot, body, shadow='c-shadow', tapes=(0.16, 0.84), paper=True):
    parts = []
    if paper:
        parts.append(rect(0, 0, w, h, fill=K, filter='url(#%s)' % shadow))
    parts.append(body)
    for t in tapes:
        parts.append(tape(w * t, -3, rot=-7 if t < 0.5 else 6))
    return g(''.join(parts), transform='translate(%s %s) rotate(%s %s %s)'
             % (num(x), num(y), num(rot), num(w / 2), num(h / 2)))


def kop(w, h, unit, kerja, isi, nomor, kh=58):
    y0 = h - kh
    cut = [0, 230, 590, w - 330, w - 170, w]
    out = [line((0, y0), (w, y0), stroke=U, stroke_width=1.5)]
    out += [line((x, y0), (x, h), stroke=U, stroke_width=1, stroke_opacity=0.6) for x in cut[1:-1]]
    out.append(text(18, y0 + 28, 'ARTHUR', 24, 'barc', T, weight=800, ls=0.5))
    out.append(text(18, y0 + 46, 'UNIT ' + unit.upper(), 10.5, 'mono', U, ls=1.2, weight=500))
    out.append(text(cut[1] + 16, y0 + 25, kerja, 15, 'bar', T, weight=600))
    out.append(text(cut[1] + 16, y0 + 44, isi, 10.5, 'mono', U, ls=0.6))
    out.append(text(cut[2] + 16, y0 + 22, wrap(JUJUR, 10.5, 'mono', cut[3] - cut[2] - 30),
                    10.5, 'mono', T, op=0.72, lh=1.3))
    out.append(text(cut[3] + 16, y0 + 22, 'LEMBAR', 10, 'mono', U, ls=1.2))
    out.append(text(cut[3] + 16, y0 + 47, nomor + ' / 03', 22, 'barc', T, weight=800))
    out.append(rect(cut[4] + 14, y0 + 10, cut[5] - cut[4] - 28, kh - 20, fill='none', stroke=U,
                    stroke_width=1, stroke_dasharray='3 3', stroke_opacity=0.7))
    return ''.join(out)


def stamp(cx, cy, rot=-7, w=250, h=66, top='DISEPAKATI TERTULIS',
          bottom='SEBELUM KERJA DIMULAI', top_size=24):
    body = (rect(-w / 2, -h / 2, w, h, fill='none', stroke=U, stroke_width=4.5, rx=3)
            + rect(-w / 2 + 7, -h / 2 + 7, w - 14, h - 14, fill='none', stroke=U,
                   stroke_width=1.4, rx=2)
            + text(0, 3, top, top_size, 'barc', U, weight=800, anchor='middle', ls=1.2)
            + text(0, h / 2 - 13, bottom, 9.5, 'mono', U, anchor='middle', ls=1.6, weight=600))
    return g(body, transform='translate(%s %s) rotate(%s)' % (num(cx), num(cy), num(rot)),
             filter='url(#c-ink)', opacity='0.92')


def wobble(cx, cy, rx, ry, seed=1.0, progress=1.0):
    n = 72
    m = max(2, int(n * 1.1 * progress))
    pts = []
    for i in range(m + 1):
        t = -0.6 + 2 * math.pi * i / n
        k = 1 + 0.035 * math.sin(3 * t + seed) + 0.018 * math.sin(7 * t + 2 * seed) + 0.045 * i / n
        pts.append((cx + rx * k * math.cos(t), cy + ry * k * math.sin(t)))
    return pline(pts, stroke=T, stroke_width=3.2, stroke_linecap='round', stroke_linejoin='round')


def scribble(a, b, seed=1.0):
    pts = []
    nx, ny = -(b[1] - a[1]), (b[0] - a[0])
    L = math.hypot(nx, ny) or 1
    for i in range(13):
        t = i / 12
        off = 2.2 * math.sin(t * 9 + seed)
        pts.append((a[0] + (b[0] - a[0]) * t + nx / L * off, a[1] + (b[1] - a[1]) * t + ny / L * off))
    return pline(pts, stroke=T, stroke_width=3.4, stroke_linecap='round', stroke_linejoin='round')


def marker_arrow(a, b, bend=0.25):
    mx, my = (a[0] + b[0]) / 2, (a[1] + b[1]) / 2
    nx, ny = -(b[1] - a[1]), (b[0] - a[0])
    c = (mx + nx * bend, my + ny * bend)
    pts = [((1 - t) ** 2 * a[0] + 2 * (1 - t) * t * c[0] + t ** 2 * b[0],
            (1 - t) ** 2 * a[1] + 2 * (1 - t) * t * c[1] + t ** 2 * b[1])
           for t in (i / 24 for i in range(25))]
    head = arrowhead(pts[-3], pts[-1], 18, 0.6)
    st = dict(stroke=T, stroke_width=3.2, stroke_linecap='round', stroke_linejoin='round')
    return pline(pts, **st) + pline([head[1], head[0], head[2]], **st)


def note(x, y, w, h, rot, label, body, size=20, big=False):
    inner = text(20, 34, wrap(label.upper(), 11, 'mono', w - 40, 1.2), 11, 'mono', U, ls=1.2,
                 weight=600, lh=1.35)
    n = wrap(label.upper(), 11, 'mono', w - 40, 1.2).count('\n')
    fam, wgt = ('barc', 800) if big else ('bar', 500)
    inner += text(20, 66 + n * 15, wrap(body.upper() if big else body, size, fam, w - 40),
                  size, fam, T, weight=wgt, lh=1.12 if big else 1.3)
    return placed(x, y, w, h, rot, inner, tapes=(0.5,))


def dymo(x, y, s, size=14, rot=0):
    w = tw(s, size, 'mono', 2.2) + 26
    body = (rect(0, 0, w, size + 16, fill=T, rx=2)
            + text(13, size + 3.5, s, size, 'mono', K, ls=2.2, weight=600))
    return g(body, transform='translate(%s %s) rotate(%s)' % (num(x), num(y), num(rot)))


# ------------------------------------------------------------ konstruksi

def _plan_sheet(markup=1.0):
    s = 50
    plan = OrthoXY(200, 124, s)
    body = axes_lines(S, plan)
    body += draw_model(M.plan_model(), plan, S) + plan_marks(S, plan)
    body += draw_labels(M.PLAN_LABELS, plan, S, size=13.5)
    body += text(60, 440, 'DENAH LANTAI 1', 27, 'barc', T, weight=800, ls=0.8)
    body += scale_bar(640, 428, s, S)
    body += kop(1090, 520, 'Konstruksi', 'Kafe siap buka dari lokasi sewa', 'Denah lantai 1', '01')
    if markup:
        body += wobble(740, 249, 104, 152, seed=1.3, progress=markup)
    return body


def _section_sheet(markup=1.0):
    s = 50
    sec = OrthoXZ(200, 442, s)
    body = ''.join(line((sec.pt(x, 0)[0], sec.pt(x, 8.2)[1]), (sec.pt(x, 0)[0], sec.pt(x, -0.35)[1]),
                        **S['axis']) for x in M.AXES)
    body += draw_model(M.section_model(), sec, S) + section_marks(S, sec)
    body += draw_labels(M.SECTION_LABELS, sec, S, size=13.5)
    body += text(60, 506, 'POTONGAN A–A', 27, 'barc', T, weight=800, ls=0.8)
    body += kop(1080, 580, 'Konstruksi', 'Kafe siap buka dari lokasi sewa', 'Potongan A–A', '01')
    if markup:
        body += wobble(695, 382, 150, 78, seed=2.1, progress=markup)
    return body


def konstruksi(with_board=True, notes=True, markup=1.0, stamped=True):
    out = [board()] if with_board else []
    if notes:
        out.append(note(1190, 70, 360, 214, 2.2, 'Alur dapur yang mempercepat penyajian',
                        'Posisi kompor, bar, dan pass-out mengurangi langkah dan waktu tunggu.'))
        out.append(note(60, 650, 360, 236, -2.0, 'Tata letak yang menambah kapasitas duduk',
                        'Tata letak meja dan sirkulasi memuat lebih banyak tamu tanpa terasa sesak.'))
    out.append(placed(70, 40, 1090, 520, -1.2, _plan_sheet(markup)))
    out.append(placed(450, 500, 1080, 580, 1.3, _section_sheet(markup)))
    if notes and markup:
        out.append(marker_arrow((1200, 190), (905, 205), bend=-0.18))
        out.append(marker_arrow((415, 652), (440, 400), bend=-0.15))
    if stamped:
        out.append(stamp(1428, 1040, rot=-6))
    return ''.join(out)


# ------------------------------------------------------------- teknologi

def _flow_sheet(markup=1.0):
    body = text(80, 52, 'DIAGRAM ALUR PESANAN', 27, 'barc', T, weight=800, ls=0.8)
    body += text(80, 76, 'Pesan dan bayar dari meja · Layar pesanan di dapur · '
                 'Bot stok bahan dan pesan ulang ke pemasok', 12.5, 'mono', U)
    body += flow_ortho(S, dy=-60, ghost=True)
    body += kop(1220, 1060, 'Teknologi', 'Pesan dan bayar dari meja', 'Diagram alur pesanan', '02')
    if markup:
        x, y, w, h, _ = M.FLOW_GHOST
        y -= 60
        body += scribble((x + 8, y + 8), (x + w - 8, y + h - 8), 1.0)
        if markup > 0.5:
            body += scribble((x + w - 8, y + 8), (x + 8, y + h - 8), 2.0)
        body += wobble(655, 259, 152, 62, seed=0.7, progress=markup)
        if markup >= 1:
            body += marker_arrow((990, 236), (814, 236), bend=0.25)
    return body


def teknologi(with_board=True, notes=True, markup=1.0, stamped=True, lift=False):
    out = [board()] if with_board else []
    if notes:
        out.append(note(1290, 110, 290, 280, 2.5, 'Situasinya',
                        'Di jam ramai, tamu kafe Anda mengantre di kasir untuk memesan dan '
                        'membayar. Kasir kewalahan.'))
        out.append(note(1290, 460, 290, 224, -2.0, 'Paket Starter',
                        'Pesanan masuk ke dapur dengan pembayaran sudah selesai.'))
        out.append(note(1300, 770, 280, 214, 1.5, 'Paket Integrator',
                        'Uang yang masuk cocok dengan catatan pesanan.'))
    out.append(placed(40, 30, 1220, 1060, -0.6, _flow_sheet(markup),
                      shadow='c-lift' if lift else 'c-shadow'))
    if stamped:
        out.append(stamp(1176, 1050, rot=-5))
    return ''.join(out)


# --------------------------------------------------------------- peekabo

ROT = (-1.2, 0.8, -0.6, 1.1, -0.9, 0.7, -1.4, 0.9, 1.3, -0.5)


def _card(i, x, y, w, h, title, sub, extra):
    body = text(18, 32, title, 19, 'bar', T, weight=600, lh=1.2)
    n = title.count('\n') + 1
    tw_ = (270 if extra == 'frames' else w) - 36
    if sub:
        body += text(18, 32 + n * 23 + 4, wrap(sub, 12.5, 'mono', tw_), 12.5, 'mono', T,
                     op=0.75, lh=1.38)
    if extra == 'frames':
        body += board_glyphs(S, 290, 40, stroke=U)
    if extra == 'rings':
        body += rings(S, w / 2 - 20, 132, stroke=U)
    return placed(x, y, w, h, ROT[i % len(ROT)], body, tapes=(0.5,))


def peekabo(with_board=True, markup=1.0, stamped=True):
    out = [board()] if with_board else []
    head = (text(24, 54, 'PAPAN KAMPANYE PEMBUKAAN', 38, 'barc', T, weight=800, ls=1)
            + text(1116, 52, 'Pembukaan cabang atau gerai · Untuk usaha F&B, ritel, jasa', 13,
                   'mono', U, anchor='end'))
    out.append(placed(70, 30, 1140, 84, -0.4, head, tapes=(0.06, 0.94)))
    for name, x0, x1 in M.BOARD_COLS:
        out.append(dymo(x0 + 10, 232, name.upper(), 13, rot=-0.6))
    for name, y0, y1 in M.BOARD_ROWS:
        out.append(dymo(64, y0 + 14, name.upper(), 12, rot=0.8))
    for i, c in enumerate(M.BOARD_CARDS):
        out.append(_card(i, *c))
    x, y, w, h, a, b = M.BOARD_FOOTER
    out.append(placed(80, 966, 560, 84, -0.5, text(22, 50, a, 18, 'bar', T, weight=600),
                      tapes=(0.5,)))
    out.append(placed(660, 966, 545, 84, 0.6, text(22, 50, b, 18, 'bar', T, weight=600),
                      tapes=(0.5,)))
    out.append(note(1238, 150, 330, 300, 1.8, 'Peekabo',
                    'Rebut perhatian. Bangun kepercayaan. Biarkan jaringan yang menjual.',
                    size=33, big=True))
    out.append(note(1240, 500, 330, 236, -1.5, 'Satu klien, tiga unit',
                    'Peekabo mengundang warga sekitar lebih dulu, sebelum kafe dibuka.'))
    kop_card = (text(20, 46, 'ARTHUR', 34, 'barc', T, weight=800, ls=0.6)
                + text(20, 68, 'UNIT PEEKABO', 11, 'mono', U, ls=1.4, weight=600)
                + text(20, 104, 'Pembukaan cabang atau gerai', 17, 'bar', T, weight=600)
                + text(20, 126, 'Papan kampanye pembukaan', 11.5, 'mono', U)
                + text(20, 160, wrap(JUJUR, 11.5, 'mono', 290), 11.5, 'mono', T, op=0.72, lh=1.4)
                + text(20, 236, 'LEMBAR 03 / 03', 22, 'barc', T, weight=800, ls=0.6))
    out.append(placed(1240, 790, 330, 270, 1.0, kop_card, tapes=(0.5,)))
    if markup:
        out.append(wobble(372, 688, 172, 128, seed=0.4, progress=markup))
        if markup >= 1:
            out.append(text(552, 770, 'sebelum kafe dibuka', 15, 'mono', T, weight=600))
            out.append(marker_arrow((548, 760), (528, 724), bend=0.35))
    if stamped:
        out.append(stamp(560, 950, rot=-8))
    return ''.join(out)


def konstruksi_lembar(markup=1.0):
    return konstruksi(with_board=False, notes=False, markup=markup)


def teknologi_lembar(markup=1.0, lift=False):
    return teknologi(with_board=False, notes=False, markup=markup, stamped=False, lift=lift)


PLATES = dict(konstruksi=konstruksi, teknologi=teknologi, peekabo=peekabo)
GROUND = X['papan']

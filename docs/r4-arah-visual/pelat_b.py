"""Arah B, Maket cahaya: garis kertas berpendar di atas tinta, digambar
aksonometri supaya pelat yang sama bisa menjadi material di WebGL. Versi
datar (proyeksi biasa) adalah jalur tanpa WebGL."""

import math

import model as M
from gambar import (Axo, AxoFloor, AxoPlane, OrthoXY, OrthoXZ, arrowhead,
                    circle, g, line, pline, poly, rect, style_b, text, ts)
from pelat_dasar import (board_ortho, caption_lines, draw_labels, draw_model,
                         flow_ortho, konstruksi_ortho)
from warna import X

S = style_b()
SF = style_b(flat=True)
PAPER = X['paper']
YS = -1.7  # bidang potongan berdiri di belakang denah


def defs():
    return (
        '<filter id="b-glow" x="-10%" y="-10%" width="120%" height="120%" '
        'color-interpolation-filters="sRGB"><feGaussianBlur in="SourceGraphic" '
        'stdDeviation="2.6" result="b"/><feColorMatrix in="b" type="matrix" '
        'values="1 0 0 0 0 0 1 0 0 0 0 0 1 0 0 0 0 0 1.5 0" result="o"/>'
        '<feMerge><feMergeNode in="o"/><feMergeNode in="SourceGraphic"/></feMerge></filter>'
        '<filter id="b-glow-strong" x="-300%" y="-300%" width="700%" height="700%" '
        'color-interpolation-filters="sRGB"><feGaussianBlur stdDeviation="5" result="b"/>'
        '<feMerge><feMergeNode in="b"/><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/>'
        '</feMerge></filter>'
        '<filter id="b-blur-2" x="-5%" y="-5%" width="110%" height="110%">'
        '<feGaussianBlur stdDeviation="2"/></filter>'
        '<filter id="b-blur-6" x="-5%" y="-5%" width="110%" height="110%">'
        '<feGaussianBlur stdDeviation="6"/></filter>'
        '<radialGradient id="b-pool" cx="56%" cy="58%" r="62%">'
        '<stop offset="0" stop-color="{P}" stop-opacity=".10"/>'
        '<stop offset="1" stop-color="{P}" stop-opacity="0"/></radialGradient>'
    ).replace('{P}', PAPER)


def pool():
    return rect(0, 0, 1600, 1120, fill='url(#b-pool)')


def caption(nomor, unit, kerja, isi, x=70, y=70, width=330):
    return caption_lines(S, x, y, nomor, unit, kerja, isi, width=width)


def floor_text(fl, x, y, s, st, **kw):
    return ts(0, 0, s, st, transform=fl.tattrs(x, y)['transform'], **kw)


def slab(fb, ft, x, y, w, h, top=None, face=0.025, edge=0.85):
    A, B, C, D = (x, y), (x + w, y), (x + w, y + h), (x, y + h)
    side = dict(fill=PAPER, fill_opacity=face, stroke=PAPER, stroke_width=1.1,
                stroke_opacity=edge * 0.7, stroke_linejoin='round')
    out = [poly([fb(*A), fb(*D), ft(*D), ft(*A)], **side),
           poly([fb(*D), fb(*C), ft(*C), ft(*D)], **side),
           poly([ft(*A), ft(*B), ft(*C), ft(*D)], fill=PAPER, fill_opacity=top or face * 1.6,
                stroke=PAPER, stroke_width=1.4, stroke_opacity=edge, stroke_linejoin='round')]
    return ''.join(out)


def along(pts, t):
    seg = [(a, b, math.dist(a, b)) for a, b in zip(pts, pts[1:])]
    total = sum(s[2] for s in seg)
    d = t * total
    for a, b, L in seg:
        if d <= L:
            k = d / L if L else 0
            return (a[0] + (b[0] - a[0]) * k, a[1] + (b[1] - a[1]) * k)
        d -= L
    return pts[-1]


def packet(fl, pts, t):
    p0 = along(pts, max(0.0, t - 0.07))
    p1 = along(pts, t)
    a, b = fl.pt(*p0), fl.pt(*p1)
    return (line(a, b, stroke=PAPER, stroke_width=3, stroke_opacity=0.45,
                 stroke_linecap='round')
            + circle(b, 5.5, fill=PAPER, filter='url(#b-glow-strong)'))


# ------------------------------------------------------------ konstruksi

def konstruksi(cap=True):
    pts3 = [(x, y, 0) for x in (-2.6, 15.0) for y in (-0.2, 6.4)]
    pts3 += [(x, YS, z) for x in (-2.6, 14.7) for z in (-0.6, 8.1)]
    axo = Axo.fit(pts3, (70, 60, 1530, 1062))
    fl, pl = AxoFloor(axo), AxoPlane(axo, YS)
    out = [pool()]
    grid = [line(fl.pt(x, -1.5), fl.pt(x, 6.6), **S['grid']) for x in range(-3, 17)]
    grid += [line(fl.pt(-3, y), fl.pt(16, y), **S['grid']) for y in range(-1, 7)]
    out.append(g(''.join(grid)))
    # potongan berdiri di belakang, memandang ke arah denah
    out.append(poly([pl.pt(-2.6, -0.6), pl.pt(14.7, -0.6), pl.pt(14.7, 8.1), pl.pt(-2.6, 8.1)],
                    **S['plane']))
    sec = ''.join(line(pl.pt(x, -0.3), pl.pt(x, 7.8), **S['axis']) for x in M.AXES)
    sec += draw_model(M.section_model(), pl, S) + draw_labels(M.SECTION_LABELS, pl, S)
    sec += ts(0, 0, 'Potongan A–A', S['title'], size=22,
              transform=pl.tattrs(-2.4, 8.6)['transform'])
    out.append(g(sec, filter='url(#b-glow)'))
    for x in (-2.6, 14.7):
        out.append(line(fl.pt(x, M.CUT_Y), fl.pt(x, YS), **S['proj']))
    pln = ''.join(line(fl.pt(x, -1.2), fl.pt(x, 5.9), **S['axis']) for x in M.AXES)
    pln += draw_model(M.plan_model(), fl, S) + draw_labels(M.PLAN_LABELS, fl, S)
    pln += line(fl.pt(-2.6, M.CUT_Y), fl.pt(14.7, M.CUT_Y), **S['cutline'])
    for x in (-2.6, 14.7):
        pln += floor_text(fl, x - 0.15, M.CUT_Y - 0.25, 'A', S['label'], size=16)
    for i, x in enumerate(M.AXES):
        ring = [fl.pt(x + 0.3 * math.cos(t * math.pi / 12), 6.25 + 0.3 * math.sin(t * math.pi / 12))
                for t in range(24)]
        pln += poly(ring, fill='none', stroke=PAPER, stroke_width=1.2, stroke_opacity=0.8)
        pln += floor_text(fl, x - 0.09, 6.36, str(i + 1), S['label'], size=14)
    pln += floor_text(fl, -2.4, 7.05, 'Denah lantai 1', S['title'], size=22)
    out.append(g(pln, filter='url(#b-glow)'))
    if cap:
        out.append(caption('01', 'Konstruksi', 'Kafe siap buka dari lokasi sewa',
                           'Denah lantai 1 dan potongan A–A'))
    return ''.join(out)


# ------------------------------------------------------------- teknologi

D_FLOW = 75.0


def _fuv(x, y):
    return ((x - 200) / D_FLOW, (y - 150) / D_FLOW)


def teknologi(cap=True):
    pts3 = [(*_fuv(x, y), z) for x in (70, 1205) for y in (150, 1048) for z in (0, 0.45)]
    axo = Axo.fit(pts3, (60, 120, 1540, 1080))
    fb = AxoFloor(axo, 0, du=_fuv).pt
    H = 0.34
    ft_ = AxoFloor(axo, H, du=_fuv)
    fl = AxoFloor(axo, 0, du=_fuv)
    out = [pool()]
    base = [fb(70, 150), fb(1205, 150), fb(1205, 1048), fb(70, 1048)]
    out.append(poly(base, **S['plane']))
    flo = ''
    for name, y0, y1 in M.FLOW_LANES:
        flo += line(fb(70, y0), fb(1205, y0), **S['lane'])
        flo += floor_text(fl, 84, (y0 + y1) / 2 + 5, name, S['label'])
    flo += line(fb(70, 1048), fb(1205, 1048), **S['lane'])
    flo += line(fb(200, 150), fb(200, 1048), **S['lane'])
    for pts, kind, lb in M.FLOW_EDGES:
        q = [fb(x, y) for x, y in pts]
        st = S['edge'] if kind == 'solid' else S['edge_dash']
        flo += pline(q, **st) + poly(arrowhead(q[-2], q[-1], 12), fill=PAPER)
        if lb:
            flo += floor_text(fl, lb[1], lb[2], lb[0], S['label'], size=12.5)
    out.append(g(flo, filter='url(#b-glow)'))
    nodes = sorted(M.FLOW_NODES.values(), key=lambda n: fb(n[0], n[1] + n[3])[1])
    blocks = ''
    cx, cy, hw, hh, t = M.FLOW_DECISION
    dec_key = fb(cx, cy + hh)[1]
    drew_dec = False
    for (x, y, w, h, title, sub) in nodes:
        if not drew_dec and fb(x, y + h)[1] > dec_key:
            blocks += _decision(fb, ft_.pt)
            drew_dec = True
        blocks += slab(fb, ft_.pt, x, y, w, h)
        blocks += floor_text(ft_, x + 18, y + h / 2 + 6, title, S['node_title'])
    if not drew_dec:
        blocks += _decision(fb, ft_.pt)
    out.append(g(blocks, filter='url(#b-glow)'))
    pk = ''
    for i, t_ in M.FLOW_PACKETS:
        pk += packet(fl, M.FLOW_EDGES[i][0], t_)
    out.append(pk)
    if cap:
        out.append(caption('02', 'Teknologi', 'Pesan dan bayar dari meja',
                           'Diagram alur pesanan'))
    return ''.join(out)


def _decision(fb, ft):
    cx, cy, hw, hh, t = M.FLOW_DECISION
    T, Rr, Bm, L = (cx, cy - hh), (cx + hw, cy), (cx, cy + hh), (cx - hw, cy)
    side = dict(fill=PAPER, fill_opacity=0.06, stroke=PAPER, stroke_width=1.1,
                stroke_opacity=0.6)
    return (poly([fb(*L), fb(*Bm), ft(*Bm), ft(*L)], **side)
            + poly([fb(*Bm), fb(*Rr), ft(*Rr), ft(*Bm)], **side)
            + poly([ft(*T), ft(*Rr), ft(*Bm), ft(*L)], fill=PAPER, fill_opacity=0.1,
                   stroke=PAPER, stroke_width=1.4, stroke_opacity=0.85))


# --------------------------------------------------------------- peekabo

D_BOARD = 80.0


def _buv(x, y):
    return ((x - 80) / D_BOARD, (y - 130) / D_BOARD)


def peekabo(cap=True):
    pts3 = [(*_buv(x, y), z) for x in (80, 1205) for y in (130, 1048) for z in (0, 1.0)]
    axo = Axo.fit(pts3, (60, 110, 1540, 1080))
    fb = AxoFloor(axo, 0, du=_buv).pt
    fl = AxoFloor(axo, 0, du=_buv)
    H = 0.14
    top = AxoFloor(axo, H, du=_buv)
    out = [pool()]
    out.append(poly([fb(80, 130), fb(1205, 130), fb(1205, 1048), fb(80, 1048)], **S['plane']))
    base = ''
    for name, x0, x1 in M.BOARD_COLS:
        base += line(fb(x0, 274), fb(x1, 274), **S['lane'])
        base += floor_text(fl, x0 + 10, 262, name, S['label'], size=13)
    for name, y0, y1 in M.BOARD_ROWS:
        base += line(fb(80, y0), fb(210, y0), **S['lane'])
        base += floor_text(fl, 84, y0 + 26, name, S['label'], size=13)
    out.append(g(base, filter='url(#b-glow)'))
    blocks = ''
    x, y, w, h, t, sub = M.BOARD_HEADER
    blocks += slab(fb, top.pt, x, y, w, h)
    blocks += floor_text(top, x + 24, y + 48, t, S['node_title'], size=26, weight=700)
    cards = sorted(M.BOARD_CARDS, key=lambda c: fb(c[0], c[1] + c[3])[1])
    deck = ''
    for (x, y, w, h, t, sub, extra) in cards:
        blocks += slab(fb, top.pt, x, y, w, h)
        blocks += floor_text(top, x + 18, y + 30, t, S['node_title'], lh=1.22)
        if extra == 'rings':
            for i, r in enumerate((0.26, 0.44, 0.62)):
                u0, v0 = _buv(x + w / 2 - 20, y + 132)
                ring = [axo.p(u0 + r * math.cos(k * math.pi / 18), v0 + r * math.sin(k * math.pi / 18), H)
                        for k in range(36)]
                blocks += poly(ring, fill='none', stroke=PAPER, stroke_width=1.1,
                               stroke_opacity=0.9 if i == 0 else 0.6,
                               stroke_dasharray=None if i == 0 else '4 4')
            blocks += slab(top.pt, AxoFloor(axo, H + 0.1, du=_buv).pt, x + w / 2 - 35, y + 127, 30, 11,
                           top=0.5)
        if extra == 'frames':
            deck = _deck(axo, x, y, w, h, H)
    x, y, w, h, a, b = M.BOARD_FOOTER
    blocks += slab(fb, top.pt, x, y, w, h)
    blocks += floor_text(top, x + 24, y + 48, a, S['node_title'])
    out.append(g(blocks, filter='url(#b-glow)'))
    out.append(g(deck, filter='url(#b-glow)'))
    if cap:
        out.append(caption('03', 'Peekabo', 'Pembukaan cabang atau gerai',
                           'Papan kampanye pembukaan'))
    return ''.join(out)


def _deck(axo, x, y, w, h, H):
    """Satu hari syuting, stok sebulan: tumpukan bingkai tegak yang menjauh."""
    u0, _ = _buv(x + 400, y)
    _, v_front = _buv(x, y + h - 12)
    out = []
    for i in range(30):
        v = v_front - i * 0.04
        u = u0 + i * 0.05
        q = [axo.p(u, v, H), axo.p(u + 0.34, v, H), axo.p(u + 0.34, v, H + 0.56),
             axo.p(u, v, H + 0.56)]
        out.append(poly(q, fill='none', stroke=PAPER, stroke_width=1,
                        stroke_opacity=max(0.16, 0.9 - i * 0.026)))
    out.reverse()
    return ''.join(out)


# --------------------------------------------------------------- datar

def konstruksi_datar():
    s = 56
    plan = OrthoXY(80 + 2.6 * s, 72 + 1.87 * s, s)
    sec = OrthoXZ(80 + 2.6 * s, 1000, s)
    body = konstruksi_ortho(
        SF, plan, sec,
        title_plan=text(80, 512, 'Denah lantai 1', 22, 'arch', PAPER, weight=800, upper=True,
                        stretch='118%'),
        title_sec=text(80, 1066, 'Potongan A–A', 22, 'arch', PAPER, weight=800, upper=True,
                       stretch='118%'))
    return pool() + g(body, filter='url(#b-glow)') + caption(
        '01', 'Konstruksi', 'Kafe siap buka dari lokasi sewa', 'Denah lantai 1 dan potongan A–A',
        x=1240, y=80, width=320)


def teknologi_datar():
    return pool() + g(flow_ortho(SF), filter='url(#b-glow)') + caption(
        '02', 'Teknologi', 'Pesan dan bayar dari meja', 'Diagram alur pesanan', x=1240, y=80,
        width=320)


def peekabo_datar():
    return pool() + g(board_ortho(SF), filter='url(#b-glow)') + caption(
        '03', 'Peekabo', 'Pembukaan cabang atau gerai', 'Papan kampanye pembukaan', x=1240, y=80,
        width=320)


PLATES = dict(konstruksi=konstruksi, teknologi=teknologi, peekabo=peekabo,
              konstruksi_datar=konstruksi_datar, teknologi_datar=teknologi_datar,
              peekabo_datar=peekabo_datar)
GROUND = X['ink']

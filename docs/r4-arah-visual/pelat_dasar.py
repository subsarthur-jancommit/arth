"""Penggambar yang dipakai bersama: model ke SVG, label, keterangan gambar,
diagram alur dan papan dalam proyeksi biasa."""

import math

import model as M
from gambar import (arrowhead, circle, el, g, line, num, pline, poly, rect,
                    text, ts, tw, wrap)


def draw_model(items, pr, S):
    roles = S['roles']
    out = []
    for p in items:
        st = roles.get(p['role'])
        if st is None:
            continue
        k = p['k']
        if k == 'poly':
            out.append(poly([pr.pt(*q) for q in p['p']], **st))
        elif k == 'line':
            out.append(line(pr.pt(*p['a']), pr.pt(*p['b']), **st))
        elif k == 'polyline':
            q = [pr.pt(*v) for v in p['p']]
            out.append(pline(q, **st))
            if p.get('arrow'):
                out.append(poly(arrowhead(q[-2], q[-1], S['arrow']),
                                fill=st['stroke'], stroke='none'))
        elif k == 'circle':
            (cx, cy), r = p['c'], p['r']
            q = [(cx + r * math.cos(i * math.pi / 14), cy + r * math.sin(i * math.pi / 14))
                 for i in range(28)]
            out.append(poly([pr.pt(*v) for v in q], **st))
        elif k == 'door':
            (hx, hy), (cx, cy) = p['h'], p['c']
            r = math.hypot(cx - hx, cy - hy)
            t0 = math.atan2(cy - hy, cx - hx)
            t1 = t0 + math.radians(p['sweep'])
            arc = [(hx + r * math.cos(t0 + (t1 - t0) * i / 16),
                    hy + r * math.sin(t0 + (t1 - t0) * i / 16)) for i in range(17)]
            out.append(pline([pr.pt(hx, hy), pr.pt(*arc[-1])], **roles['door_leaf']))
            out.append(pline([pr.pt(*v) for v in arc], **roles['door_arc']))
    return ''.join(out)


def draw_labels(labels, pr, S, size=None):
    L = dict(S['label'])
    if size:
        L['size'] = size
    out = []
    for s, a, b, anchor, rot in labels:
        ta = pr.tattrs(a, b, rot)
        kw = dict(anchor=anchor)
        if 'transform' in ta:
            out.append(ts(0, 0, s, L, transform=ta['transform'], **kw))
        else:
            out.append(ts(ta['x'], ta['y'], s, L, rot=ta['rot'] or None,
                          central=bool(ta['rot']), **kw))
    return ''.join(out)


# ------------------------------------------------- keterangan ortho

def axes_lines(S, plan, top=-1.28, bottom_y=None):
    """Garis as dari gelembung di atas denah sampai ke bawah potongan."""
    out = []
    for i, x in enumerate(M.AXES):
        X, Y0 = plan.pt(x, top)
        Y1 = bottom_y if bottom_y is not None else plan.pt(x, 5.6)[1]
        out.append(line((X, Y0), (X, Y1), **S['axis']))
        c = plan.pt(x, -1.55)
        r = 0.27 * plan.s
        out.append(circle(c, r, **S['bubble']))
        out.append(text(c[0], c[1] + 5, str(i + 1), 14, 'mono', S['ink'],
                        anchor='middle', weight=500))
    return ''.join(out)


def _tick(c, S):
    return line((c[0] - 5, c[1] + 5), (c[0] + 5, c[1] - 5), **S['dim_tick'])


def plan_marks(S, pr, north=(-2.05, 0.45)):
    out = []
    y = -0.7
    out.append(line(pr.pt(M.AXES[0], y), pr.pt(M.AXES[-1], y), **S['dim']))
    for x in M.AXES:
        out.append(line(pr.pt(x, y - 0.12), pr.pt(x, y + 0.12), **S['dim']))
        out.append(_tick(pr.pt(x, y), S))
    for x0, x1 in zip(M.AXES, M.AXES[1:]):
        X, Y = pr.pt((x0 + x1) / 2, y - 0.14)
        out.append(text(X, Y, ('%.2f' % (x1 - x0)).replace('.', ','), 13, 'mono',
                        S['ink'], anchor='middle'))
    x = 15.25
    out.append(line(pr.pt(x, 0), pr.pt(x, 5), **S['dim']))
    for yy in (0, 5):
        out.append(line(pr.pt(x - 0.12, yy), pr.pt(x + 0.12, yy), **S['dim']))
        out.append(_tick(pr.pt(x, yy), S))
    X, Y = pr.pt(x + 0.22, 2.5)
    out.append(text(X, Y, '5,00', 13, 'mono', S['ink'], anchor='middle', rot=-90,
                    central=True))
    # garis potong A-A
    out.append(line(pr.pt(-2.6, M.CUT_Y), pr.pt(14.7, M.CUT_Y), **S['cutline']))
    for xe, d in ((-2.6, 1), (14.7, -1)):
        a = pr.pt(xe, M.CUT_Y)
        out.append(line(a, pr.pt(xe + 0.45 * d, M.CUT_Y), stroke=S['ink'], stroke_width=3.4))
        tip = pr.pt(xe, M.CUT_Y - 0.58)
        out.append(line(a, tip, stroke=S['ink'], stroke_width=1.4))
        out.append(poly(arrowhead(a, tip, 10), fill=S['ink']))
        X, Y = pr.pt(xe, M.CUT_Y - 0.82)
        out.append(text(X, Y, 'A', 17, 'mono', S['ink'], anchor='middle', weight=600))
    # mata angin
    c = pr.pt(*north)
    r = 0.3 * pr.s
    out.append(circle(c, r, fill='none', stroke=S['ink'], stroke_width=1.2))
    out.append(poly([(c[0], c[1] - r), (c[0] + r * 0.42, c[1] + r * 0.6), (c[0], c[1] + r * 0.3)],
                    fill=S['ink']))
    out.append(poly([(c[0], c[1] - r), (c[0] - r * 0.42, c[1] + r * 0.6), (c[0], c[1] + r * 0.3)],
                    fill='none', stroke=S['ink'], stroke_width=1))
    out.append(text(c[0], c[1] - r - 7, 'U', 13, 'mono', S['ink'], anchor='middle', weight=600))
    return ''.join(out)


def section_marks(S, pr, x=14.55):
    out = []
    for z, t in M.LEVELS:
        X, Y = pr.pt(x, z)
        out.append(poly([(X, Y), (X - 7, Y - 11), (X + 7, Y - 11)], fill='none',
                        stroke=S['ink'], stroke_width=1.2))
        out.append(line((X - 12, Y), (X + 48, Y), **S['dim']))
        out.append(text(X + 12, Y - 5, t, 13, 'mono', S['ink']))
    return ''.join(out)


def scale_bar(x, y, s, S, meters=(0, 1, 2, 5), h=8):
    out = []
    for i, (m0, m1) in enumerate(zip(meters, meters[1:])):
        out.append(rect(x + m0 * s, y, (m1 - m0) * s, h,
                        fill=S['ink'] if i % 2 == 0 else 'none',
                        stroke=S['ink'], stroke_width=1))
    for m in meters:
        out.append(text(x + m * s, y - 7, str(m), 12, 'mono', S['ink'], anchor='middle'))
    out.append(text(x + meters[-1] * s + 12, y + h, 'm', 12, 'mono', S['ink']))
    return ''.join(out)


def konstruksi_ortho(S, plan, sec, show_bubbles=True, title_plan=None,
                     title_sec=None, axes_through=True):
    """Denah di atas, potongan di bawah, berbagi skala dan garis as."""
    out = []
    bottom = sec.pt(0, -0.35)[1] if axes_through else None
    if show_bubbles:
        out.append(axes_lines(S, plan, bottom_y=bottom))
    out.append(draw_model(M.plan_model(), plan, S))
    out.append(plan_marks(S, plan))
    out.append(draw_labels(M.PLAN_LABELS, plan, S))
    if not axes_through:
        for x in M.AXES:
            X = sec.pt(x, 0)[0]
            out.append(line((X, sec.pt(x, 8.2)[1]), (X, sec.pt(x, -0.35)[1]), **S['axis']))
    out.append(draw_model(M.section_model(), sec, S))
    out.append(section_marks(S, sec))
    out.append(draw_labels(M.SECTION_LABELS, sec, S))
    if title_plan:
        out.append(title_plan)
    if title_sec:
        out.append(title_sec)
    return ''.join(out)


# --------------------------------------------------------- alur ortho

def flow_ortho(S, dx=0, dy=0, ghost=False, label_fill=None):
    out = []
    lab = dict(S['label'])
    for name, y0, y1 in M.FLOW_LANES:
        out.append(line((70 + dx, y0 + dy), (1205 + dx, y0 + dy), **S['lane']))
        out.append(ts(84 + dx, (y0 + y1) / 2 + dy + 5, name, lab))
    out.append(line((70 + dx, 1048 + dy), (1205 + dx, 1048 + dy), **S['lane']))
    out.append(line((200 + dx, 150 + dy), (200 + dx, 1048 + dy), **S['lane']))
    for pts, kind, lb in M.FLOW_EDGES:
        q = [(x + dx, y + dy) for x, y in pts]
        st = S['edge'] if kind == 'solid' else S['edge_dash']
        out.append(pline(q, **st))
        out.append(poly(arrowhead(q[-2], q[-1], S['arrow']), fill=st['stroke'], stroke='none'))
        if lb:
            out.append(ts(lb[1] + dx, lb[2] + dy, lb[0], lab, size=12.5))
    for key, (x, y, w, h, t, sub) in M.FLOW_NODES.items():
        out.append(rect(x + dx, y + dy, w, h, **S['node']))
        if sub:
            out.append(ts(x + 18 + dx, y + 33 + dy, t, S['node_title']))
            out.append(ts(x + 18 + dx, y + 57 + dy, wrap(sub, 13, 'mono', w - 36),
                          S['node_sub'], lh=1.38))
        else:
            out.append(ts(x + 18 + dx, y + h / 2 + 6 + dy, t, S['node_title']))
    cx, cy, hw, hh, t = M.FLOW_DECISION
    cx, cy = cx + dx, cy + dy
    out.append(poly([(cx, cy - hh), (cx + hw, cy), (cx, cy + hh), (cx - hw, cy)], **S['node']))
    out.append(text(cx, cy - 4, t, 13, 'mono', S['node_title']['fill'], anchor='middle', lh=1.2))
    s, x, y = M.FLOW_NOTE
    out.append(ts(x + dx, y + dy, s, S['small'], size=13))
    # rujukan ke lembar 01: meja yang sama ada di denah
    c = (222 + dx, 319 + dy)
    out.append(circle(c, 14, **S['bubble']))
    out.append(text(c[0], c[1] + 4.5, '01', 11, 'mono', S['ink'], anchor='middle', weight=600))
    if ghost:
        x, y, w, h, t = M.FLOW_GHOST
        out.append(rect(x + dx, y + dy, w, h, fill='none', stroke=S['ink'],
                        stroke_width=1.4, stroke_dasharray='6 5', stroke_opacity=0.7))
        out.append(ts(x + 18 + dx, y + h / 2 + 6 + dy, t, S['node_title'], op=0.6))
    return ''.join(out)


# ------------------------------------------------------- papan ortho

def board_glyphs(S, x, y, n=10, fw=26, fh=46, gap=5, stroke=None, sw=1.0):
    c = stroke or S['ink']
    out = []
    for i in range(n):
        fx = x + i * (fw + gap)
        out.append(rect(fx, y, fw, fh, fill='none', stroke=c, stroke_width=1.1))
        for kind, pts in M.frame_glyph(i, fx, y, fw, fh):
            if kind == 'poly':
                out.append(poly(pts, fill='none', stroke=c, stroke_width=sw))
            else:
                out.append(pline(pts, stroke=c, stroke_width=sw))
    return ''.join(out)


def rings(S, cx, cy, radii=(20, 34, 48), stroke=None):
    c = stroke or S['ink']
    out = []
    for i, r in enumerate(radii):
        out.append(circle((cx, cy), r, fill='none', stroke=c, stroke_width=1.1,
                          stroke_dasharray=None if i == 0 else '4 4',
                          stroke_opacity=1 if i == 0 else 0.7))
    out.append(rect(cx - 15, cy - 5.5, 30, 11, fill=c, fill_opacity=0.9))
    out.append(text(cx + radii[-1] + 8, cy + 4, 'kafe', 11, 'mono', c))
    return ''.join(out)


def board_ortho(S, dx=0, dy=0, cards=True):
    out = []
    lab = dict(S['label'])
    x, y, w, h, t, sub = M.BOARD_HEADER
    out.append(rect(x + dx, y + dy, w, h, **S['card']))
    out.append(ts(x + 24 + dx, y + 48 + dy, t, S['node_title'], size=26, weight=700))
    out.append(ts(x + w - 24 + dx, y + 46 + dy, sub, S['small'], size=14, anchor='end'))
    for name, x0, x1 in M.BOARD_COLS:
        out.append(line((x0 + dx, 274 + dy), (x1 + dx, 274 + dy), **S['dim']))
        out.append(ts(x0 + 10 + dx, 262 + dy, name, lab, size=13))
    for name, y0, y1 in M.BOARD_ROWS:
        out.append(line((80 + dx, y0 + dy), (210 + dx, y0 + dy), **S['dim']))
        out.append(ts(84 + dx, y0 + 26 + dy, name, lab, size=13))
    if cards:
        for (x, y, w, h, t, sub, extra) in M.BOARD_CARDS:
            out.append(rect(x + dx, y + dy, w, h, **S['card']))
            tw_ = (270 if extra == 'frames' else w) - 36
            out.append(ts(x + 18 + dx, y + 30 + dy, t, S['node_title'], lh=1.22))
            n_lines = t.count('\n') + 1
            if sub:
                out.append(ts(x + 18 + dx, y + 30 + n_lines * 21 + 4 + dy,
                              wrap(sub, 13, 'mono', tw_), S['node_sub'], lh=1.36))
            if extra == 'frames':
                out.append(board_glyphs(S, x + 290 + dx, y + 40 + dy))
            if extra == 'rings':
                out.append(rings(S, x + w / 2 - 20 + dx, y + 132 + dy))
    x, y, w, h, a, b = M.BOARD_FOOTER
    out.append(rect(x + dx, y + dy, w, h, **S['card']))
    out.append(ts(x + 24 + dx, y + 48 + dy, a, S['node_title']))
    out.append(ts(x + w - 24 + dx, y + 48 + dy, b, S['node_title'], anchor='end'))
    return ''.join(out)


def caption_lines(S, x, y, nomor, unit, kerja, isi, width=330, big=60, fam='arch',
                  stretch='125%', fill=None, muted_op=0.62):
    c = fill or S['ink']
    out = [text(x, y + big * 0.8, nomor + ' / 03', big, fam, c, weight=800,
                stretch=stretch, ls=-1),
           text(x, y + big + 30, unit, 14, 'mono', c, ls=2.4, op=0.8, upper=True, weight=500),
           text(x, y + big + 64, wrap(kerja, 22, fam if fam != 'syne' else 'syne', width),
                22, fam, c, weight=500, lh=1.2, stretch=None),
           ]
    n = wrap(kerja, 22, fam, width).count('\n')
    yy = y + big + 64 + n * 26.4 + 32
    out.append(text(x, yy, wrap(isi, 13, 'mono', width), 13, 'mono', c, op=muted_op, lh=1.4))
    yy += (wrap(isi, 13, 'mono', width).count('\n') + 1) * 18.2 + 14
    out.append(text(x, yy, wrap('Rangkaian yang mungkin, bukan proyek yang pernah kami kerjakan.',
                                12, 'mono', width), 12, 'mono', c, op=muted_op, lh=1.45))
    return ''.join(out)


__all__ = ['draw_model', 'draw_labels', 'konstruksi_ortho', 'flow_ortho', 'board_ortho',
           'axes_lines', 'plan_marks', 'section_marks', 'scale_bar', 'rings',
           'board_glyphs', 'caption_lines', 'el', 'g', 'num', 'tw']

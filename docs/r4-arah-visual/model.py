"""Isi ketiga pelat, sekali saja, dipakai oleh ketiga arah.

Rangkaian di halaman Satu klien, tiga unit (diambil dari situs 24 Oktober
2026): kafe baru di tempat sewa. Konstruksi menyiapkan lokasi sewa sampai
alur pelanggan dan dapurnya bekerja; Teknologi memasang pemesanan dan
pembayaran dari meja; Peekabo mengundang warga sekitar sebelum kafe dibuka.

Kafe digambar di sebuah ruko sewa, dalam meter. x berjalan dari jalan (0) ke
dinding belakang (14); y melintang dari dinding samping jauh (0) ke dinding
samping dekat (5). Potongan A-A memotong di y = CUT_Y dan memandang ke y = 0.
"""

import math

AXES = (0.0, 4.6, 9.2, 14.0)
CUT_Y = 2.8


def R(x0, y0, x1, y1):
    return [(x0, y0), (x1, y0), (x1, y1), (x0, y1)]


def plan_model():
    m = []

    def add(k, role, **kw):
        m.append(dict(k=k, role=role, **kw))

    # dinding yang terpotong: dua dinding samping, dinding belakang dengan
    # pintu servis, dinding dapur dengan pass-out dan pintu, gudang, pilar muka
    for p in (R(-0.15, -0.15, 14.15, 0), R(-0.15, 5, 14.15, 5.15),
              R(14, 0, 14.15, 0.5), R(14, 1.4, 14.15, 5),
              R(9.2, 0, 9.35, 2.2), R(9.2, 3.4, 9.35, 4.2),
              R(12.4, 0, 12.5, 1.2), R(12.4, 2.0, 12.5, 2.7),
              R(12.5, 2.6, 14, 2.7),
              R(-0.15, 0, 0, 0.3), R(-0.15, 4.7, 0, 5)):
        add('poly', 'cut', p=p)
    for x in AXES:
        for y in (0.0, 5.0):
            add('poly', 'column', p=R(x - 0.15, y - 0.15, x + 0.15, y + 0.15))
    for y0, y1 in ((0.3, 1.6), (3.6, 4.7)):
        for x in (-0.11, -0.04):
            add('line', 'glass', a=(x, y0), b=(x, y1))
    # perabot dan perlengkapan
    add('poly', 'furn', p=R(0.6, 0, 4.8, 0.45))
    for cx in (1.3, 2.75, 4.2):
        add('poly', 'furn', p=R(cx - 0.35, 0.6, cx + 0.35, 1.3))
        add('poly', 'furn', p=R(cx - 0.2, 1.45, cx + 0.2, 1.85))
    for cx in (1.3, 3.2, 5.1):
        add('poly', 'furn', p=R(cx - 0.35, 4.15, cx + 0.35, 4.85))
        for sx in (-0.8, 0.4):
            add('poly', 'furn', p=R(cx + sx, 4.3, cx + sx + 0.4, 4.7))
    add('poly', 'furn', p=R(7.6, 1.4, 8.2, 4.2))
    add('poly', 'furn', p=R(9.05, 2.2, 9.5, 3.4))
    add('poly', 'furn', p=R(9.6, 0, 12.2, 0.65))
    for bx in (10.0, 10.6, 11.2, 11.8):
        add('circle', 'furn', c=(bx, 0.33), r=0.17)
    add('poly', 'hidden', p=R(9.6, 0, 12.2, 0.9))
    add('poly', 'furn', p=R(10.4, 4.35, 12.2, 5.0))
    add('poly', 'furn', p=R(13.35, 3.0, 14.0, 4.6))
    add('poly', 'furn', p=R(13.5, 3.2, 13.88, 4.4))
    add('poly', 'furn', p=R(12.6, 0, 14.0, 0.4))
    # tangga: 18 anak tangga sepanjang 4,2 m; yang di atas bidang potong putus
    add('poly', 'furn', p=R(5.0, 0, 9.2, 1.0))
    t = 4.2 / 18
    for i in range(1, 18):
        x = 5.0 + i * t
        add('line', 'furn' if i <= 5 else 'hidden', a=(x, 0), b=(x, 1.0))
    add('polyline', 'furn', p=[(6.12, 1.0), (6.24, 0.6), (6.1, 0.45), (6.22, 0.0)])
    add('polyline', 'stair', p=[(5.2, 0.5), (8.95, 0.5)], arrow=True)
    # pintu: engsel, ujung saat tertutup, sudut buka
    for h, c, sw in (((0, 1.6), (0, 2.6), 70), ((0, 3.6), (0, 2.6), -70),
                     ((9.35, 5.0), (9.35, 4.2), 80), ((12.5, 2.0), (12.5, 1.2), 80),
                     ((14.0, 1.4), (14.0, 0.5), -80)):
        add('door', 'door', h=h, c=c, sweep=sw)
    # alur pelanggan, lalu bahan, olah, saji; keduanya tidak bersilang
    add('polyline', 'guest', arrow=True,
        p=[(-2.0, 2.6), (0.5, 2.6), (2.1, 2.72), (2.75, 2.25), (2.75, 1.98)])
    add('polyline', 'kitchen', arrow=True,
        p=[(14.8, 0.95), (13.5, 0.95), (12.95, 1.6), (12.1, 1.6), (11.6, 4.28)])
    add('polyline', 'kitchen', arrow=True, p=[(10.45, 4.28), (10.45, 0.82)])
    add('polyline', 'kitchen', arrow=True,
        p=[(10.1, 0.85), (9.7, 1.7), (9.6, 2.8), (9.0, 2.8), (8.7, 3.6),
           (8.6, 4.55), (7.4, 4.62), (6.0, 4.5)])
    return m


PLAN_LABELS = (
    ('Teras', -0.8, 4.4, 'middle', 0),
    ('Jalan', -2.38, 3.9, 'middle', -90),
    ('Alur pelanggan', 0.45, 3.2, 'start', 0),
    ('Ruang duduk', 4.2, 3.2, 'middle', 0),
    ('Tangga naik', 6.4, 1.32, 'middle', 0),
    ('Bar', 7.9, 2.8, 'middle', -90),
    ('Dapur', 11.1, 2.4, 'middle', 0),
    ('Kompor', 11.3, 1.15, 'start', 0),
    ('Olah', 11.3, 4.8, 'middle', 0),
    ('Gudang', 13.25, 2.34, 'middle', 0),
    ('Cuci', 13.12, 3.8, 'middle', -90),
    ('Bahan', 14.62, 0.66, 'middle', 0),
    ('Saji', 6.75, 4.28, 'middle', 0),
)


def section_model():
    m = []

    def add(k, role, **kw):
        m.append(dict(k=k, role=role, **kw))

    for p in (R(-0.15, -0.25, 14.15, 0), R(-1.6, -0.2, -0.15, 0),
              R(-0.15, 3.4, 14.15, 3.6), R(-0.15, 6.8, 14.15, 7.0),
              R(-0.15, 7.0, 0, 7.4), R(14, 7.0, 14.15, 7.4),
              R(-0.15, 2.9, 0, 3.4), R(-0.15, 3.6, 0, 4.4), R(-0.15, 6.0, 0, 6.8),
              R(14, 0, 14.15, 6.8),
              R(9.2, 0, 9.35, 0.9), R(9.2, 1.5, 9.35, 3.4)):
        add('poly', 'cut', p=p)
    add('poly', 'cut', p=[(0, 2.95), (-1.4, 2.8), (-1.4, 2.72), (0, 2.87)])
    add('poly', 'furn_cut', p=R(7.6, 0, 8.2, 1.05))
    add('poly', 'furn_cut', p=R(7.45, 1.05, 8.2, 1.11))
    for z0, z1 in ((0, 2.5), (2.55, 2.9), (4.4, 6.0)):
        for x in (-0.11, -0.04):
            add('line', 'glass', a=(x, z0), b=(x, z1))
    add('polyline', 'ground', p=[(-2.6, -0.15), (-1.6, -0.15), (-1.6, 0)])
    add('line', 'ground', a=(14.15, 0), b=(14.6, 0))
    add('poly', 'earth', p=[(-2.6, -0.15), (-1.6, -0.15), (-1.6, -0.2), (-0.15, -0.2),
                            (-0.15, -0.25), (14.6, -0.25), (14.6, -0.55), (-2.6, -0.55)])
    # di balik bidang potong: tempat duduk, tangga, dapur, dinding gudang
    add('poly', 'elev', p=R(0.6, 0, 4.8, 0.45))
    add('poly', 'elev', p=R(0.6, 0.45, 4.8, 0.95))
    for cx in (1.3, 2.75, 4.2):
        add('poly', 'elev', p=R(cx - 0.35, 0.72, cx + 0.35, 0.76))
        add('poly', 'elev', p=R(cx - 0.2, 0, cx + 0.2, 0.88))
        add('line', 'elev', a=(cx - 0.2, 0.45), b=(cx + 0.2, 0.45))
        add('line', 'elev', a=(cx, 3.4), b=(cx, 2.3))
        add('poly', 'elev', p=[(cx - 0.18, 2.12), (cx + 0.18, 2.12),
                               (cx + 0.08, 2.3), (cx - 0.08, 2.3)])
    t, r = 4.2 / 18, 3.6 / 18
    saw = [(5.0, 0.0)]
    for i in range(18):
        saw += [(5.0 + i * t, (i + 1) * r), (5.0 + (i + 1) * t, (i + 1) * r)]
    add('polyline', 'elev', p=saw)
    add('line', 'elev', a=(5.35, 0.0), b=(9.2, 3.3))
    add('line', 'elev', a=(5.05, 1.1), b=(9.2, 4.5))
    add('line', 'elev', a=(5.0, 4.5), b=(9.2, 4.5))
    for i in range(8):
        x = 5.0 + i * 0.6
        add('line', 'elev', a=(x, 3.6), b=(x, 4.5))
    add('poly', 'elev', p=R(9.6, 0, 12.2, 0.85))
    for bx in (9.95, 10.55, 11.15, 11.75):
        add('poly', 'elev', p=R(bx, 0.85, bx + 0.3, 0.93))
    add('poly', 'elev', p=[(9.6, 1.9), (12.2, 1.9), (11.7, 2.4), (10.1, 2.4)])
    for z0, z1 in ((2.4, 3.4), (3.6, 6.8), (7.0, 7.85)):
        add('poly', 'elev', p=R(10.75, z0, 11.05, z1))
    add('poly', 'elev', p=[(10.5, 7.85), (11.3, 7.85), (10.9, 8.05)])
    add('poly', 'elev_wall', p=R(12.5, 0, 14.0, 3.4))
    add('line', 'elev', a=(9.0, 0.9), b=(9.55, 0.9))
    for cx in (1.5, 3.4):
        add('poly', 'elev', p=R(cx - 0.35, 4.32, cx + 0.35, 4.36))
        add('poly', 'elev', p=R(cx - 0.2, 3.6, cx + 0.2, 4.48))
        add('line', 'elev', a=(cx, 6.8), b=(cx, 5.75))
        add('poly', 'elev', p=[(cx - 0.18, 5.57), (cx + 0.18, 5.57),
                               (cx + 0.08, 5.75), (cx - 0.08, 5.75)])
    return m


SECTION_LABELS = (
    ('Teras', -0.85, 0.3, 'middle', 0),
    ('Kanopi', -0.75, 3.15, 'middle', 0),
    ('Ruang duduk', 2.75, 1.55, 'middle', 0),
    ('Tangga', 6.15, 2.3, 'middle', 0),
    ('Bar', 7.9, 1.35, 'middle', 0),
    ('Pass-out', 9.45, 1.12, 'start', 0),
    ('Dapur', 11.2, 1.5, 'middle', 0),
    ('Kompor', 10.9, 0.38, 'middle', 0),
    ('Cerobong', 11.25, 5.2, 'start', 0),
    ('Gudang', 13.25, 1.95, 'middle', 0),
    ('bahan', 13.25, 1.62, 'middle', 0),
    ('Lantai 2', 2.45, 5.1, 'middle', 0),
)

LEVELS = ((0.0, '±0,00'), (3.6, '+3,60'), (7.0, '+7,00'))


# ------------------------------------------------------- diagram alur
# Koordinat piksel pada pelat 1600 x 1120. Kalimat node dari halaman
# pekerjaan Pesan dan bayar dari meja, Layar pesanan di dapur, Bot stok bahan
# dan pesan ulang ke pemasok, dan Bot pesan-antar WhatsApp.

FLOW_LANES = (('Tamu', 150, 376), ('Sistem', 376, 700), ('Dapur', 700, 870),
              ('Pemasok', 870, 1048))

FLOW_NODES = dict(
    wa=(240, 170, 250, 86, 'Pesan lewat WhatsApp', ''),
    meja=(240, 276, 250, 86, 'Memesan dari meja', ''),
    bayar=(530, 276, 250, 86, 'Membayar dari meja', ''),
    aturan=(530, 420, 250, 96, 'Harga dan promo', 'menurut aturan Anda'),
    catat=(830, 420, 260, 116, 'Pesanan dicatat',
           'Uang yang masuk cocok dengan catatan pesanan.'),
    stok=(830, 600, 230, 86, 'Stok bahan tercatat', ''),
    dapur=(470, 730, 270, 116, 'Layar pesanan di dapur',
           'berikut urutan dan waktu sajinya'),
    saji=(220, 752, 200, 80, 'Saji ke meja', ''),
    pemasok=(870, 912, 330, 110, 'Pesan ulang ke pemasok',
             'terkirim sendiri saat bahan menipis'),
)

FLOW_DECISION = (1140, 643, 62, 44, 'Bahan\nmenipis?')

FLOW_EDGES = (
    ([(490, 319), (530, 319)], 'solid', None),
    ([(490, 213), (960, 213), (960, 420)], 'solid', None),
    ([(780, 319), (890, 319), (890, 420)], 'solid', None),
    ([(655, 420), (655, 362)], 'solid', None),
    ([(960, 536), (960, 600)], 'solid', None),
    ([(830, 500), (805, 500), (805, 788), (740, 788)], 'solid', None),
    ([(1060, 643), (1078, 643)], 'solid', None),
    ([(1140, 687), (1140, 912)], 'solid', ('Ya', 1152, 806)),
    ([(1140, 599), (1140, 572), (1000, 572), (1000, 600)], 'solid', ('Tidak', 1070, 563)),
    ([(470, 788), (420, 788)], 'solid', None),
    ([(320, 752), (320, 362)], 'dash', ('Saji', 332, 562)),
)

FLOW_NOTE = ('juga saat tidak ada admin yang berjaga', 500, 201)
FLOW_GHOST = (990, 262, 196, 92, 'Antre di kasir')  # arah C saja

# urutan titik di setiap tepi yang dilalui paket cahaya (arah B)
FLOW_PACKETS = ((0, 0.5), (1, 0.42), (2, 0.7), (5, 0.55), (7, 0.5), (9, 0.5), (1, 0.86))


# ---------------------------------------------------- papan kampanye
# Kartu dari bab Agency marketing, Produksi kreatif, dan Experiential dan
# event di Peekabo, serta kepala unit Peekabo.

BOARD_HEADER = (80, 138, 1125, 78, 'Pembukaan cabang atau gerai',
                'Untuk usaha F&B, ritel, jasa')
BOARD_COLS = (('Sebelum kafe dibuka', 220, 520), ('Hari pertama dibuka', 530, 860),
              ('Sesudahnya', 870, 1205))
BOARD_ROWS = (('Perhatian', 282, 560), ('Kepercayaan', 570, 800),
              ('Penjualan', 810, 952))
BOARD_CARDS = (
    (230, 292, 280, 120, 'Sasaran dan pesan',
     'Platform, sasaran, dan pesan dipilih sebelum uang iklan keluar.', None),
    (230, 424, 620, 126, 'Satu hari syuting',
     'menghasilkan stok konten untuk sebulan.', 'frames'),
    (540, 292, 310, 120, 'Iklan di TikTok,\nMeta, dan Google',
     'dengan aset yang diproduksi massal', None),
    (880, 292, 315, 120, 'Manajemen media sosial',
     'Akun aktif dan konsisten setiap minggu tanpa Anda memikirkan apa yang diunggah.',
     None),
    (880, 424, 315, 126, 'Pendampingan ads bulanan',
     'Tim Anda tetap memegang akun, sementara kami mengarahkan dan memeriksa hasilnya setiap bulan.',
     None),
    (230, 580, 280, 212, 'Warga sekitar diundang\nlebih dulu', '', 'rings'),
    (540, 580, 310, 130, 'Booth, sampling, demo',
     'Produk dicoba langsung di tempat orang sudah berkumpul.', None),
    (880, 580, 315, 130, 'Temu pelanggan',
     'Pelanggan bertemu langsung dan merasa menjadi bagian dari brand.', None),
    (230, 820, 280, 126, 'Pasokan creator\ndan influencer',
     'Anda mendapat kreator yang cocok dengan audiens Anda tanpa mencari satu per satu.',
     None),
    (540, 820, 655, 126, 'Kreator, host live, dan sales ikut menjual',
     'Mereka dibayar dari penjualan yang benar-benar terjadi.', None),
)
BOARD_FOOTER = (80, 966, 1125, 80, 'Target, lingkup, dan laporan disepakati tertulis.',
                'Kami tidak menjanjikan jangkauan atau penjualan.')


def frame_glyph(i, x, y, w, h):
    """Gambar kecil di satu bingkai papan cerita, dalam koordinat bingkai.
    Mengembalikan daftar (jenis, titik) yang digambar oleh pemanggil."""
    cx, cy = x + w / 2, y + h / 2
    s = min(w, h) / 2.6
    if i % 5 == 0:   # muka gerai dengan kanopi
        return [('poly', [(cx - s, cy + s), (cx + s, cy + s), (cx + s, cy - s * 0.4),
                          (cx - s, cy - s * 0.4)]),
                ('line', [(cx - s * 1.1, cy - s * 0.4), (cx + s * 1.1, cy - s * 0.4)]),
                ('line', [(cx - s * 0.3, cy + s), (cx - s * 0.3, cy + s * 0.2)])]
    if i % 5 == 1:   # cangkir
        return [('poly', [(cx - s * 0.8, cy - s * 0.3), (cx + s * 0.6, cy - s * 0.3),
                          (cx + s * 0.4, cy + s * 0.8), (cx - s * 0.6, cy + s * 0.8)]),
                ('line', [(cx - s * 0.2, cy - s * 0.6), (cx - s * 0.1, cy - s * 1.0)]),
                ('line', [(cx + s * 0.2, cy - s * 0.6), (cx + s * 0.3, cy - s * 1.0)])]
    if i % 5 == 2:   # ponsel dengan kode di meja
        pts = [('poly', [(cx - s * 0.6, cy - s), (cx + s * 0.6, cy - s),
                         (cx + s * 0.6, cy + s), (cx - s * 0.6, cy + s)])]
        for a in (-0.3, 0.1):
            for b in (-0.4, 0.0):
                pts.append(('poly', [(cx + a * s, cy + b * s), (cx + (a + 0.25) * s, cy + b * s),
                                     (cx + (a + 0.25) * s, cy + (b + 0.25) * s),
                                     (cx + a * s, cy + (b + 0.25) * s)]))
        return pts
    if i % 5 == 3:   # meja dari atas dengan dua kursi
        ring = [(cx + s * 0.6 * math.cos(t / 8 * math.pi), cy + s * 0.6 * math.sin(t / 8 * math.pi))
                for t in range(16)]
        return [('poly', ring),
                ('poly', [(cx - s * 0.25, cy - s * 1.1), (cx + s * 0.25, cy - s * 1.1),
                          (cx + s * 0.25, cy - s * 0.75), (cx - s * 0.25, cy - s * 0.75)]),
                ('poly', [(cx - s * 0.25, cy + s * 0.75), (cx + s * 0.25, cy + s * 0.75),
                          (cx + s * 0.25, cy + s * 1.1), (cx - s * 0.25, cy + s * 1.1)])]
    bowl = [(cx + s * 0.9 * math.cos(t / 10 * math.pi), cy + s * 0.9 * math.sin(t / 10 * math.pi) * 0.7)
            for t in range(11)]
    return [('poly', bowl), ('line', [(cx - s * 0.2, cy - s * 0.9), (cx + s * 0.6, cy - s * 0.1)]),
            ('line', [(cx + s * 0.1, cy - s * 1.0), (cx + s * 0.8, cy - s * 0.25)])]

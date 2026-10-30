/**
 * Peekabo's plate: the campaign board for opening a branch or an outlet, with
 * time across and the buyer's trust down, for the same café.
 *
 * Provenance: original work for this project. No third-party code copied.
 * The board and its words are the ones `docs/r4-arah-visual/model.py` drew
 * for the stills the owner chose (R4, 24 October 2026), taken there from
 * Peekabo's chapters on marketing agency work, creative production, and
 * experiential events, and from Peekabo's own header. They are labels in a
 * picture; the chapters keep their copy in Sanity.
 *
 * Plate units throughout.
 */

import {
  circle,
  type Point,
  polygon,
  polyline,
  rectangle,
  sheet,
  wrap,
} from './draw'
import type { Plate } from './types'

const HEADER = [80, 138, 1125, 78] as const
const FOOTER = [80, 966, 1125, 80] as const

/** Column name, left edge, right edge. */
const COLUMNS = [
  ['Sebelum kafe dibuka', 220, 520],
  ['Hari pertama dibuka', 530, 860],
  ['Sesudahnya', 870, 1205],
] as const

/** Row name and top edge. */
const ROWS = [
  ['Perhatian', 282],
  ['Kepercayaan', 570],
  ['Penjualan', 810],
] as const

/**
 * A card: x, y, width, height, name (a line break where the stills broke it),
 * the line under it, and the small drawing it carries, if any.
 */
type Card = readonly [
  number,
  number,
  number,
  number,
  string,
  string,
  'frames' | 'rings' | null,
]

const CARDS: readonly Card[] = [
  [
    230,
    292,
    280,
    120,
    'Sasaran dan pesan',
    'Platform, sasaran, dan pesan dipilih sebelum uang iklan keluar.',
    null,
  ],
  [
    230,
    424,
    620,
    126,
    'Satu hari syuting',
    'menghasilkan stok konten untuk sebulan.',
    'frames',
  ],
  [
    540,
    292,
    310,
    120,
    'Iklan di TikTok,\nMeta, dan Google',
    'dengan aset yang diproduksi massal',
    null,
  ],
  [
    880,
    292,
    315,
    120,
    'Manajemen media sosial',
    'Akun aktif dan konsisten setiap minggu tanpa Anda memikirkan apa yang diunggah.',
    null,
  ],
  [
    880,
    424,
    315,
    126,
    'Pendampingan ads bulanan',
    'Tim Anda tetap memegang akun, sementara kami mengarahkan dan memeriksa hasilnya setiap bulan.',
    null,
  ],
  [230, 580, 280, 212, 'Warga sekitar diundang\nlebih dulu', '', 'rings'],
  [
    540,
    580,
    310,
    130,
    'Booth, sampling, demo',
    'Produk dicoba langsung di tempat orang sudah berkumpul.',
    null,
  ],
  [
    880,
    580,
    315,
    130,
    'Temu pelanggan',
    'Pelanggan bertemu langsung dan merasa menjadi bagian dari brand.',
    null,
  ],
  [
    230,
    820,
    280,
    126,
    'Pasokan creator\ndan influencer',
    'Anda mendapat kreator yang cocok dengan audiens Anda tanpa mencari satu per satu.',
    null,
  ],
  [
    540,
    820,
    655,
    126,
    'Kreator, host live, dan sales ikut menjual',
    'Mereka dibayar dari penjualan yang terjadi.',
    null,
  ],
]

/** A storyboard frame's small drawing, from the frame's own box. */
function glyph(i: number, x: number, y: number, w: number, h: number) {
  const cx = x + w / 2
  const cy = y + h / 2
  const s = Math.min(w, h) / 2.6
  const at = (u: number, v: number): Point => [cx + u * s, cy + v * s]
  const square = (u: number, v: number, size: number) =>
    polygon([
      at(u, v),
      at(u + size, v),
      at(u + size, v + size),
      at(u, v + size),
    ])

  switch (i % 5) {
    // A shopfront under its canopy.
    case 0:
      return [
        polygon([at(-1, 1), at(1, 1), at(1, -0.4), at(-1, -0.4)]),
        polyline([at(-1.1, -0.4), at(1.1, -0.4)]),
        polyline([at(-0.3, 1), at(-0.3, 0.2)]),
      ]
    // A cup with its steam.
    case 1:
      return [
        polygon([at(-0.8, -0.3), at(0.6, -0.3), at(0.4, 0.8), at(-0.6, 0.8)]),
        polyline([at(-0.2, -0.6), at(-0.1, -1)]),
        polyline([at(0.2, -0.6), at(0.3, -1)]),
      ]
    // A phone with the code on the table.
    case 2:
      return [
        polygon([at(-0.6, -1), at(0.6, -1), at(0.6, 1), at(-0.6, 1)]),
        square(-0.3, -0.4, 0.25),
        square(-0.3, 0, 0.25),
        square(0.1, -0.4, 0.25),
        square(0.1, 0, 0.25),
      ]
    // A table from above with two chairs.
    case 3:
      return [
        polygon(
          Array.from({ length: 16 }, (_, t) =>
            at(
              0.6 * Math.cos((t / 8) * Math.PI),
              0.6 * Math.sin((t / 8) * Math.PI)
            )
          )
        ),
        polygon([
          at(-0.25, -1.1),
          at(0.25, -1.1),
          at(0.25, -0.75),
          at(-0.25, -0.75),
        ]),
        polygon([
          at(-0.25, 0.75),
          at(0.25, 0.75),
          at(0.25, 1.1),
          at(-0.25, 1.1),
        ]),
      ]
    // A bowl with chopsticks.
    default:
      return [
        polygon(
          Array.from({ length: 11 }, (_, t) =>
            at(
              0.9 * Math.cos((t / 10) * Math.PI),
              0.9 * Math.sin((t / 10) * Math.PI) * 0.7
            )
          )
        ),
        polyline([at(-0.2, -0.9), at(0.6, -0.1)]),
        polyline([at(0.1, -1), at(0.8, -0.25)]),
      ]
  }
}

function build(): Plate {
  const draw = sheet()

  {
    const [x, y, w, h] = HEADER
    draw.mark('card', rectangle(x, y, w, h))
    draw.text('nodeTitle', x + 24, y + 48, 'Pembukaan cabang atau gerai', {
      size: 26,
      weight: 700,
    })
    draw.text('note', x + w - 24, y + 46, 'Untuk usaha F&B, ritel, jasa', {
      size: 14,
      anchor: 'end',
    })
  }

  for (const [name, left, right] of COLUMNS) {
    draw.mark(
      'dimension',
      polyline([
        [left, 274],
        [right, 274],
      ])
    )
    draw.text('label', left + 10, 262, name.toLocaleUpperCase('id'), {
      size: 13,
    })
  }
  for (const [name, top] of ROWS) {
    draw.mark(
      'dimension',
      polyline([
        [80, top],
        [210, top],
      ])
    )
    draw.text('label', 84, top + 26, name.toLocaleUpperCase('id'), { size: 13 })
  }

  for (const [x, y, w, h, name, note, drawing] of CARDS) {
    draw.mark('card', rectangle(x, y, w, h))
    draw.text('nodeTitle', x + 18, y + 30, name, { leading: 1.22 })
    const lines = name.split('\n').length
    if (note) {
      const width = (drawing === 'frames' ? 270 : w) - 36
      draw.text(
        'nodeNote',
        x + 18,
        y + 30 + lines * 21 + 4,
        wrap(note, 13, width),
        {
          leading: 1.36,
        }
      )
    }

    // One day of shooting, a month of content: ten frames in a row.
    if (drawing === 'frames') {
      for (let i = 0; i < 10; i += 1) {
        const fx = x + 290 + i * 31
        const fy = y + 40
        draw.mark('frame', rectangle(fx, fy, 26, 46))
        for (const d of glyph(i, fx, fy, 26, 46)) draw.mark('glyph', d)
      }
    }

    // The neighbours invited first: rings out from the café.
    if (drawing === 'rings') {
      const centre: Point = [x + w / 2 - 20, y + 132]
      draw.mark('ring', circle(centre, 20))
      draw.mark('ringDash', circle(centre, 34))
      draw.mark('ringDash', circle(centre, 48))
      draw.mark('solid', rectangle(centre[0] - 15, centre[1] - 5.5, 30, 11))
      draw.text('note', centre[0] + 56, centre[1] + 4, 'kafe', {
        size: 11,
      })
    }
  }

  {
    const [x, y, w, h] = FOOTER
    draw.mark('card', rectangle(x, y, w, h))
    draw.text(
      'nodeTitle',
      x + 24,
      y + 48,
      'Target, lingkup, dan laporan disepakati tertulis.'
    )
    draw.text(
      'nodeTitle',
      x + w - 24,
      y + 48,
      'Kami tidak menjanjikan jangkauan atau penjualan.',
      { anchor: 'end' }
    )
  }

  return draw.done('peekabo', [50, 108, 1185, 968])
}

export const PEEKABO_PLATE: Plate = build()

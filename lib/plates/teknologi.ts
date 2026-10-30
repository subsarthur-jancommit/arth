/**
 * Teknologi's plate: the flow of an order in the same café, from the guest
 * through the system and the kitchen to the supplier, in four swimlanes.
 *
 * Provenance: original work for this project. No third-party code copied.
 * The layout and the words in its steps are the ones
 * `docs/r4-arah-visual/model.py` drew for the stills the owner chose (R4,
 * 24 October 2026), taken there from four of Teknologi's published works:
 * ordering and paying from the table, the kitchen's order screen, the stock
 * bot that reorders from the supplier, and the WhatsApp delivery bot. They
 * are labels in a picture; the works' own pages keep their copy in Sanity.
 *
 * Plate units throughout; there is no model in metres behind a diagram.
 */

import {
  circle,
  type Point,
  polygon,
  rectangle,
  segment,
  sheet,
  wrap,
} from './draw'
import type { Plate } from './types'

/** Lane name, top edge, bottom edge. */
const LANES = [
  ['Tamu', 150, 376],
  ['Sistem', 376, 700],
  ['Dapur', 700, 870],
  ['Pemasok', 870, 1048],
] as const

/** A step: x, y, width, height, name, and the line under it. */
type Step = readonly [number, number, number, number, string, string]

const STEPS: readonly Step[] = [
  [240, 170, 250, 86, 'Pesan lewat WhatsApp', ''],
  [240, 276, 250, 86, 'Memesan dari meja', ''],
  [530, 276, 250, 86, 'Membayar dari meja', ''],
  [530, 420, 250, 96, 'Harga dan promo', 'menurut aturan Anda'],
  [
    830,
    420,
    260,
    116,
    'Pesanan dicatat',
    'Uang yang masuk cocok dengan catatan pesanan.',
  ],
  [830, 600, 230, 86, 'Stok bahan tercatat', ''],
  [
    470,
    730,
    270,
    116,
    'Layar pesanan di dapur',
    'berikut urutan dan waktu sajinya',
  ],
  [220, 752, 200, 80, 'Saji ke meja', ''],
  [
    870,
    912,
    330,
    110,
    'Pesan ulang ke pemasok',
    'terkirim sendiri saat bahan menipis',
  ],
]

/** The one decision: centre, half width, half height. */
const DECISION = [1140, 643, 62, 44] as const

/** A connector's points, whether it is a return, and its label. */
type Edge = readonly [
  readonly Point[],
  'solid' | 'dash',
  readonly [string, number, number] | null,
]

const EDGES: readonly Edge[] = [
  [
    [
      [490, 319],
      [530, 319],
    ],
    'solid',
    null,
  ],
  [
    [
      [490, 213],
      [960, 213],
      [960, 420],
    ],
    'solid',
    null,
  ],
  [
    [
      [780, 319],
      [890, 319],
      [890, 420],
    ],
    'solid',
    null,
  ],
  [
    [
      [655, 420],
      [655, 362],
    ],
    'solid',
    null,
  ],
  [
    [
      [960, 536],
      [960, 600],
    ],
    'solid',
    null,
  ],
  [
    [
      [830, 500],
      [805, 500],
      [805, 788],
      [740, 788],
    ],
    'solid',
    null,
  ],
  [
    [
      [1060, 643],
      [1078, 643],
    ],
    'solid',
    null,
  ],
  [
    [
      [1140, 687],
      [1140, 912],
    ],
    'solid',
    ['Ya', 1152, 806],
  ],
  [
    [
      [1140, 599],
      [1140, 572],
      [1000, 572],
      [1000, 600],
    ],
    'solid',
    ['Tidak', 1070, 563],
  ],
  [
    [
      [470, 788],
      [420, 788],
    ],
    'solid',
    null,
  ],
  [
    [
      [320, 752],
      [320, 362],
    ],
    'dash',
    ['Saji', 332, 562],
  ],
]

function build(): Plate {
  const draw = sheet()

  for (const [name, top, bottom] of LANES) {
    draw.mark('lane', segment([70, top], [1205, top]))
    draw.text('label', 84, (top + bottom) / 2 + 5, name.toLocaleUpperCase('id'))
  }
  draw.mark('lane', segment([70, 1048], [1205, 1048]))
  draw.mark('lane', segment([200, 150], [200, 1048]))

  for (const [points, kind, label] of EDGES) {
    draw.arrow(kind === 'solid' ? 'edge' : 'edgeDash', points, 11)
    if (label) {
      const [text, x, y] = label
      draw.text('label', x, y, text.toLocaleUpperCase('id'), { size: 12.5 })
    }
  }

  for (const [x, y, w, h, name, note] of STEPS) {
    draw.mark('node', rectangle(x, y, w, h))
    if (note) {
      draw.text('nodeTitle', x + 18, y + 33, name)
      draw.text('nodeNote', x + 18, y + 57, wrap(note, 13, w - 36), {
        leading: 1.38,
      })
    } else {
      draw.text('nodeTitle', x + 18, y + h / 2 + 6, name)
    }
  }

  const [cx, cy, hw, hh] = DECISION
  draw.mark(
    'node',
    polygon([
      [cx, cy - hh],
      [cx + hw, cy],
      [cx, cy + hh],
      [cx - hw, cy],
    ])
  )
  draw.text('figure', cx, cy - 4, ['Bahan', 'menipis?'], {
    anchor: 'middle',
    leading: 1.2,
  })

  draw.text('note', 500, 201, 'juga saat tidak ada admin yang berjaga', {
    size: 13,
  })

  // A reference to sheet 01: the table ordered from is the one on the plan.
  draw.mark('bubble', circle([222, 319], 14))
  draw.text('figure', 222, 323.5, '01', {
    anchor: 'middle',
    size: 11,
    weight: 600,
  })

  return draw.done('teknologi', [40, 120, 1200, 960])
}

export const TEKNOLOGI_PLATE: Plate = build()

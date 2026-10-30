import type { Meta, StoryObj } from '@storybook/react'

import { SectionHeader } from '@/components/ui/section-header'
import { Plate } from '@/vault/blocks/plate'

import { Passage } from './index'

const meta = {
  title: 'Vault/Blocks/Passage',
  component: Passage,
  parameters: {
    docs: {
      description: {
        component:
          "The home page's pinned path. What is shown here is the reel's " +
          '**resting state**, because the choreography is a pinned, scrubbed ' +
          'timeline and a story frame has no page to scroll: the first plate ' +
          'in the frame, the others parked below it. Every tween is a ' +
          '`fromTo`, so nothing is ever stranded invisible; under reduced ' +
          'motion, and without JavaScript, the plates are laid out one after ' +
          'another instead.',
      },
    },
  },
} satisfies Meta<typeof Passage>

export default meta
type Story = StoryObj<typeof meta>

/** No plates: only the section header, which is what the passage delivers. */
export const Default: Story = {
  args: {
    children: <SectionHeader eyebrow="Gambar kerja" title="Satu kafe" />,
  },
}

/**
 * With the three plates the home page passes, in the units' order. The words
 * here stand in for the page's `messages/` strings.
 */
export const WithPlates: Story = {
  args: {
    children: (
      <SectionHeader
        eyebrow="Gambar kerja"
        title="Satu kafe, dikerjakan tiga unit."
      />
    ),
    note: 'Rangkaian yang mungkin, bukan proyek yang pernah kami kerjakan.',
    plates: [
      {
        id: 'konstruksi',
        unit: 'Konstruksi',
        title: 'Kafe siap buka dari lokasi sewa',
        meta: 'Denah lantai 1 dan potongan A-A',
        media: (
          <Plate
            unit="konstruksi"
            title="Denah lantai 1 dan potongan sebuah kafe"
            description="Denah dan potongan sebuah kafe di ruko sewa."
          />
        ),
      },
      {
        id: 'teknologi',
        unit: 'Teknologi',
        title: 'Pesan dan bayar dari meja',
        meta: 'Diagram alur pesanan',
        media: (
          <Plate
            unit="teknologi"
            title="Diagram alur pesanan"
            description="Empat lajur: tamu, sistem, dapur, dan pemasok."
          />
        ),
      },
      {
        id: 'peekabo',
        unit: 'Peekabo',
        title: 'Pembukaan cabang atau gerai',
        meta: 'Papan kampanye pembukaan',
        media: (
          <Plate
            unit="peekabo"
            title="Papan kampanye pembukaan"
            description="Tiga kolom waktu dan tiga baris tujuan."
          />
        ),
      },
    ],
  },
}

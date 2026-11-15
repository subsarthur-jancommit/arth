import type { Meta, StoryObj } from '@storybook/react'

import { Plate } from './index'

/**
 * One unit's working drawing, flat. This is the plate every reader gets
 * first, and the whole of it for a phone, for reduced motion and without
 * WebGL; on a stage page the same data is also lit as WebGL material.
 *
 * The words passed here are the alt text, which the pages take from
 * `messages/` (`plates.<unit>`); the labels inside the drawing are part of it,
 * and follow `locale` (R7, block L4).
 */
const meta = {
  title: 'Vault/Blocks/Plate',
  component: Plate,
  parameters: {
    docs: {
      description: {
        component:
          'A working-drawing plate as inline SVG, drawn in the ink of its ground: paper lines with a faint glow on a stage, ink lines in a document.',
      },
    },
  },
} satisfies Meta<typeof Plate>

export default meta

type Story = StoryObj<typeof meta>

export const Konstruksi: Story = {
  args: {
    unit: 'konstruksi',
    locale: 'id',
    title: 'Denah lantai 1 dan potongan A-A sebuah kafe di ruko sewa',
    description:
      'Denah memperlihatkan teras, ruang duduk, tangga, bar, dapur, dan gudang bahan.',
  },
}

export const Teknologi: Story = {
  args: {
    unit: 'teknologi',
    locale: 'id',
    title: 'Diagram alur pesanan dari meja sampai pemasok',
    description: 'Empat lajur: tamu, sistem, dapur, dan pemasok.',
  },
}

export const Peekabo: Story = {
  args: {
    unit: 'peekabo',
    locale: 'id',
    title: 'Papan kampanye pembukaan cabang atau gerai',
    description:
      'Tiga kolom waktu dan tiga baris tujuan: perhatian, kepercayaan, dan penjualan.',
  },
}

/** The same plan with its words in English (R7, block L4). */
export const KonstruksiInEnglish: Story = {
  args: {
    unit: 'konstruksi',
    locale: 'en',
    title:
      'Konstruksi working drawing: the ground floor plan and a section of a café in a rented shophouse',
    description:
      'The plan shows the terrace, the seating, the stair, the bar, the serving hatch, the kitchen, the store, and the sink.',
  },
}

import type { Meta, StoryObj } from '@storybook/react'

import { Plate } from './index'

/**
 * One unit's working drawing, flat. This is the plate every reader gets
 * first, and the whole of it for a phone, for reduced motion and without
 * WebGL; on a stage page the same data is also lit as WebGL material.
 *
 * The words passed here are the alt text, which the pages take from
 * `messages/` (`plates.<unit>`); the labels inside the drawing are part of it.
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
    title: 'Denah lantai 1 dan potongan A-A sebuah kafe di ruko sewa',
    description:
      'Denah memperlihatkan teras, ruang duduk, tangga, bar, dapur, dan gudang bahan.',
  },
}

export const Teknologi: Story = {
  args: {
    unit: 'teknologi',
    title: 'Diagram alur pesanan dari meja sampai pemasok',
    description: 'Empat lajur: tamu, sistem, dapur, dan pemasok.',
  },
}

export const Peekabo: Story = {
  args: {
    unit: 'peekabo',
    title: 'Papan kampanye pembukaan cabang atau gerai',
    description:
      'Tiga kolom waktu dan tiga baris tujuan: perhatian, kepercayaan, dan penjualan.',
  },
}

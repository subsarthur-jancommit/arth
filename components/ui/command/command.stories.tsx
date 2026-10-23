import type { Meta, StoryObj } from '@storybook/react'
import { NextIntlClientProvider } from 'next-intl'

import type { SearchEntry } from '@/lib/content/search-index'
import messages from '@/messages/id.json'

import { CommandPalette } from './palette'

/**
 * The search palette, over a fixed index.
 *
 * ## Why this story exists, having been declined twice
 *
 * Tahap 28 and 29 both recorded "no Storybook story" with the same reason:
 * the palette fetches its index from a route and reads next-intl's locale, so
 * a story would have to stub both and would then be showing a mock.
 *
 * Half of that was true and half was laziness.
 * `components/ui/language-switcher` has had a story with
 * `NextIntlClientProvider` since it shipped, so the locale half was already
 * solved here. The index half was fixed by changing the component rather than
 * by faking the network: `entries` is a prop, and when it is given the
 * component renders it instead of fetching. Nothing here is a mock of the
 * palette — it is the palette, over entries that hold still.
 *
 * ## What it is worth beyond a catalogue
 *
 * `e2e/storybook-a11y.e2e.ts` audits every story, so these add an axe pass on
 * an open palette in isolation from any page — including its two states that
 * a page-level gate can only reach by breaking the network.
 */

/*
 * A slice of the **real** index, copied from what production's
 * `/id/search.json` served on 2026-10-22 — not written to look like one.
 *
 * Indonesian because `/en/search.json` answers 307 to that index
 * (`lib/i18n/public-locale-redirect.ts`), so these are the rows on English
 * pages too. The English rows this story used to carry had drifted from what
 * `/en/search.json` served — only `page:/cara-kerja` still matched — and that
 * index now reaches Presentation previews alone.
 *
 * The first draft of this file invented a client name for a real project, and
 * that is the line this project does not cross:
 * `lib/content/journal-fallback.ts` records the reasoning, and a Storybook
 * story is a browsable catalogue, not a private test double. One of each kind,
 * so every group heading and every rail variant — a path, a client and year, a
 * date — is on screen at once.
 */
const entries: SearchEntry[] = [
  {
    id: 'page:/cara-kerja',
    kind: 'page',
    label: 'Cara kami bekerja',
    description:
      'Lingkup, harga, target, dan laporan disepakati tertulis sebelum kerja dimulai.',
    href: '/id/cara-kerja',
    meta: '/cara-kerja',
  },
  {
    id: 'page:/kontak',
    kind: 'page',
    label: 'Tentang dan kontak',
    description:
      'Struktur Arthur, wilayah kerja yang sudah dikonfirmasi, dan status kontaknya saat ini.',
    href: '/id/kontak',
    meta: '/kontak',
  },
  {
    id: 'page:/konstruksi',
    kind: 'unit',
    label: 'Konstruksi',
    description:
      'Konstruksi, dibaca dari dua sisi: yang menjalankan proyek, dan yang memiliki bangunannya.',
    href: '/id/konstruksi',
    meta: '/konstruksi',
  },
  {
    id: 'page:/teknologi',
    kind: 'unit',
    label: 'Teknologi',
    description:
      'Teknologi, dibaca dari dua sisi: pembeli yang mau hasil siap pakai, dan pembeli yang paham teknis.',
    href: '/id/teknologi',
    meta: '/teknologi',
  },
  {
    id: 'page:/peekabo',
    kind: 'unit',
    label: 'Peekabo',
    description:
      'Peekabo, agency-nya Arthur, dibaca dari dua sisi: pemilik usaha dan brand, dan jaringan penjual.',
    href: '/id/peekabo',
    meta: '/peekabo',
  },
  {
    id: 'project:arus-balik',
    kind: 'project',
    label: 'Arus Balik',
    description: 'Tinjauan arsitektur, enam minggu',
    href: '/id/work/arus-balik',
    meta: 'Rumah Tanjung · 2025',
  },
  {
    id: 'journal:scope-is-the-deliverable',
    kind: 'journal',
    label: 'Lingkup adalah hasilnya',
    description:
      'Minggu yang dipakai memutuskan sebuah pekerjaan itu bukan apa adalah minggu yang menentukan apakah ia selesai.',
    href: '/id/journal/scope-is-the-deliverable',
    meta: '11 Februari 2026',
  },
]

const meta = {
  title: 'UI/CommandPalette',
  component: CommandPalette,
  parameters: {
    layout: 'fullscreen',
    // The rows render as anchors and navigate through Next's router, which
    // needs the App Router mock rather than the Pages one.
    nextjs: { appDirectory: true },
  },
  args: {
    open: true,
    onOpenChange: () => undefined,
    entries,
  },
  decorators: [
    /*
     * The Indonesian dictionary itself, not a written-out copy of the
     * `search` namespace. The copy this story carried had already drifted —
     * it had no `hintTouch` — which is the reason `.storybook/preview.tsx`
     * gives for importing the real one. Indonesian because it is the only
     * published locale, and the rows above are what every public palette
     * lists.
     */
    (Story) => (
      <NextIntlClientProvider locale="id" messages={messages}>
        <Story />
      </NextIntlClientProvider>
    ),
  ],
} satisfies Meta<typeof CommandPalette>

export default meta

type Story = StoryObj<typeof meta>

/**
 * The resting state: every group, and all three kinds of rail — a path, a
 * client and year, a date.
 */
export const Default: Story = {}

/**
 * The dead end, which is the one state that has to offer a way out. A bare
 * "no results" is a wall; this names things the index actually holds, so
 * following the suggestion works.
 */
export const NoResults: Story = {
  args: { entries: [] },
}

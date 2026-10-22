import type { Meta, StoryObj } from '@storybook/react'
import { NextIntlClientProvider } from 'next-intl'

import type { SearchEntry } from '@/lib/content/search-index'

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
 * The `search` namespace, written out rather than imported from
 * `messages/en.json`, for the reason `language-switcher.stories.tsx` records:
 * the JSON is typed through `messages/en.d.json.ts`, which needs
 * `allowArbitraryExtensions`, and turning that on for one story would loosen
 * module resolution repo-wide.
 */
const messages = {
  search: {
    open: 'Search',
    shortcut: '⌘K',
    label: 'Search the site',
    placeholder: 'Search units, projects and writing',
    empty: 'Nothing matches that.',
    emptyHint: 'Try a unit, a client name, or a year.',
    loading: 'Building the index…',
    failed:
      'Search is unavailable right now. Every page is still reachable from the header and the footer.',
    hint: 'Enter to open, Escape to close.',
    close: 'Close search',
    groups: {
      page: 'Pages',
      unit: 'Units',
      project: 'Work',
      journal: 'Journal',
    },
  },
}

/*
 * A slice of the **real** index, copied from what `/en/search.json` serves —
 * not written to look like one.
 *
 * The first draft of this file invented a client name for a real project, and
 * that is the line this project does not cross: `lib/content/home-fallback.ts`
 * records the reasoning, and a Storybook story is a browsable catalogue, not a
 * private test double. One of each kind, so every group heading and every rail
 * variant — a path, a client and year, a date — is on screen at once.
 */
const entries: SearchEntry[] = [
  {
    id: 'unit:konstruksi',
    kind: 'unit',
    label: 'Konstruksi',
    description:
      'Konstruksi, read from two sides: project leads and building owners.',
    href: '/en/konstruksi',
    meta: '/konstruksi',
  },
  {
    id: 'page:/cara-kerja',
    kind: 'page',
    label: 'How we work',
    description:
      'Lingkup, harga, target, dan laporan disepakati tertulis sebelum kerja dimulai.',
    href: '/en/cara-kerja',
    meta: '/cara-kerja',
  },
  {
    id: 'unit:teknologi',
    kind: 'unit',
    label: 'Teknologi',
    description:
      'Teknologi, read from two sides: ready to use and technically fluent.',
    href: '/en/teknologi',
    meta: '/teknologi',
  },
  {
    id: 'unit:peekabo',
    kind: 'unit',
    label: 'Peekabo',
    description: "Peekabo, Arthur's agency, read from two sides.",
    href: '/en/peekabo',
    meta: '/peekabo',
  },
  {
    id: 'page:contact',
    kind: 'page',
    label: 'Contact',
    description: '',
    href: '/en/#contact',
    meta: null,
  },
  {
    id: 'project:arus-balik',
    kind: 'project',
    label: 'Arus Balik',
    description: 'Architecture review, six weeks',
    href: '/en/work/arus-balik',
    meta: 'Rumah Tanjung · 2025',
  },
  {
    id: 'journal:scope-is-the-deliverable',
    kind: 'journal',
    label: 'Scope is the deliverable',
    description:
      'The week spent deciding what a piece of work is not is the week that decides whether it ships.',
    href: '/en/journal/scope-is-the-deliverable',
    meta: 'February 11, 2026',
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
    (Story) => (
      <NextIntlClientProvider locale="en" messages={messages}>
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

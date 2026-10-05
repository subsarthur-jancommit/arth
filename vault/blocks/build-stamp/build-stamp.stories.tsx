import type { Meta, StoryObj } from '@storybook/react'

import { BuildStamp } from './index'

/**
 * The commit a page was built from, and the day — one line of the colophon.
 *
 * The hash and date below are an example; on the site they come from the
 * build, and a build that is not on Vercel renders no stamp at all.
 */
const meta = {
  title: 'Vault/Blocks/BuildStamp',
  component: BuildStamp,
  parameters: {
    docs: {
      description: {
        component:
          'A label, the short commit hash linked to the commit, and the UTC day of the build, as items in a row. Rendered only when the build names a commit.',
      },
    },
  },
  args: {
    label: 'Build',
    build: {
      short: '51cf845',
      href: 'https://github.com/subsarthur-jancommit/arth/commit/51cf845',
      day: '2026-10-05',
      builtAt: '2026-10-05T13:59:00.000Z',
    },
  },
} satisfies Meta<typeof BuildStamp>

export default meta

type Story = StoryObj<typeof meta>

export const Linked: Story = {}

/** A provider the build cannot link to: the hash, as text. */
export const Unlinked: Story = {
  args: {
    build: {
      short: '51cf845',
      href: null,
      day: '2026-10-05',
      builtAt: '2026-10-05T13:59:00.000Z',
    },
  },
}

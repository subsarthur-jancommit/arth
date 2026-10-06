import type { Meta, StoryObj } from '@storybook/react'

import { OfflineNotice } from './index'

/**
 * What the page says when the connection goes, and when it comes back.
 *
 * Nothing shows while the connection is fine. Turn the network off in the
 * browser's developer tools (Network → Offline) and the pill rises in the
 * lower left; turn it back on and "Back online" stays a moment, then goes.
 */
const meta = {
  title: 'Vault/Blocks/OfflineNotice',
  component: OfflineNotice,
  parameters: {
    docs: {
      description: {
        component:
          'A `role="status"` region, always present and empty while online. Offline, it holds a pill in the lower left; when the connection returns it says so, holds, and empties again.',
      },
    },
  },
  args: { offline: 'You are offline', restored: 'Back online' },
} satisfies Meta<typeof OfflineNotice>

export default meta

type Story = StoryObj<typeof meta>

export const Network: Story = {}

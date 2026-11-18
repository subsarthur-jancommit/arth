import type { Meta, StoryObj } from '@storybook/react'

import { Hero } from './index'

/**
 * The hero composes vault pieces: `TextReveal` for the headline, and
 * `SceneShell` for the wash. The art viewport is left empty here: the home
 * page passes it the matte café (`vault/webgl/cafe`), whose still is written
 * by the server.
 *
 * `SceneShell` renders its DOM gradient fallback here rather than a WebGL
 * canvas — the R3F canvas is mounted by `lib/features` in the app layout and
 * portalled into, and Storybook has no such layout. That is the fallback path
 * doing exactly what it exists for, so these stories are a fair check of the
 * non-WebGL rendering every visitor without a working GPU sees.
 */
const meta = {
  title: 'Blocks/Hero',
  component: Hero,
  parameters: { layout: 'fullscreen' },
  tags: ['autodocs'],
} satisfies Meta<typeof Hero>

export default meta

type Story = StoryObj<typeof meta>

const action = (
  <button
    type="button"
    className="cta"
    style={{
      display: 'inline-flex',
      alignItems: 'center',
      minHeight: 'var(--control-cta)',
      paddingInline: 'var(--space-24)',
      borderRadius: 'var(--radius-pill)',
      background: 'var(--color-secondary)',
      color: 'var(--color-primary)',
      border: 0,
      cursor: 'pointer',
    }}
  >
    Tell us what you need
  </button>
)

/**
 * The shipped shape since G1: the headline, one sentence of scope, the
 * action, and the art viewport beside them on desktop. The unit index the
 * story used to pass left the hero with G1; the need chooser that follows
 * the hero on the home page (`vault/blocks/need-chooser`) took its place.
 */
export const Default: Story = {
  args: {
    headline: 'Projects move. Systems work. Markets grow.',
    subline:
      'Civil construction, technology systems, and a market-share agency for Subang, Purwakarta, and Bandung.',
    action,
  },
}

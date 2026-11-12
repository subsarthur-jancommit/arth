'use client'

import dynamic from 'next/dynamic'

/**
 * GSAP's clock handed to Tempus, so tweens share one frame loop with Lenis and
 * WebGL. Loaded per page rather than from the layout: mounting it globally put
 * GSAP into every page's graph, including pages that never animate.
 *
 * A client module of its own because `ssr: false` is allowed only in a Client
 * Component, and `<Wrapper>` is no longer one — F4-06 perbaikan, lever B2
 * (`docs/F4-06-UKUR.md` §4.B.2): the wrapper renders on the server, so the
 * footer does too.
 */
export const LazyGSAPRuntime = dynamic(
  () =>
    import('@/components/effects/gsap').then((mod) => ({
      default: mod.GSAPRuntime,
    })),
  { ssr: false }
)

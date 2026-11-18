/**
 * The café's state is the small surface G4 drives the illustration by:
 * assemble, the phase, and the per-need change.
 */

import { describe, expect, it } from 'bun:test'

import { cafe, isCafeNeed } from './state'

describe('the café state', () => {
  it('assembles, and settles only the newest run', () => {
    const first = cafe.assemble()
    expect(cafe.getSnapshot().phase).toBe('assembling')
    const second = cafe.assemble()
    expect(second).toBe(first + 1)
    // The replaced run reports nothing.
    cafe.settle(first)
    expect(cafe.getSnapshot().phase).toBe('assembling')
    cafe.settle(second)
    expect(cafe.getSnapshot().phase).toBe('assembled')
  })

  it('tells its listeners, and stops when they leave', () => {
    let heard = 0
    const leave = cafe.subscribe(() => {
      heard += 1
    })
    cafe.setNeed('systems')
    expect(heard).toBe(1)
    // The same need again changes nothing, so says nothing.
    cafe.setNeed('systems')
    expect(heard).toBe(1)
    leave()
    cafe.setNeed(null)
    expect(heard).toBe(1)
    expect(cafe.getSnapshot().need).toBeNull()
  })

  it('serves the server its first state', () => {
    expect(cafe.getServerSnapshot()).toEqual({
      phase: 'assembling',
      run: 0,
      need: null,
    })
  })

  it('knows the three needs and nothing else', () => {
    expect(['building', 'systems', 'market'].every(isCafeNeed)).toBe(true)
    expect(isCafeNeed('join')).toBe(false)
    expect(isCafeNeed(null)).toBe(false)
  })
})

import { describe, expect, it } from 'bun:test'

import { indexAtReadingLine } from './reading-line'

describe('the reading line', () => {
  it('names the last item whose top has passed the line', () => {
    // A 1000px screen: the line is at 600.
    expect(indexAtReadingLine([-900, -200, 590, 1400], 1000)).toBe(2)
    expect(indexAtReadingLine([-900, -200, 600, 1400], 1000)).toBe(2)
    expect(indexAtReadingLine([-900, -200, 601, 1400], 1000)).toBe(1)
  })

  it('names the first item while none has reached the line', () => {
    expect(indexAtReadingLine([700, 1500, 2300], 1000)).toBe(0)
    expect(indexAtReadingLine([], 1000)).toBe(0)
  })

  it('names the last item once the sequence has gone by', () => {
    expect(indexAtReadingLine([-3000, -2200, -1400], 1000)).toBe(2)
  })
})

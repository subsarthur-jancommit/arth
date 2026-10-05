import { describe, expect, it } from 'bun:test'

import { readBuild } from './build'

const SHA = '51cf845e1a2b3c4d5e6f708192a3b4c5d6e7f809'

describe('the build stamp', () => {
  it('names the commit, links it, and dates the build in UTC', () => {
    expect(
      readBuild({
        sha: SHA,
        builtAt: '2026-10-05T23:30:00+07:00',
        repository: 'https://github.com/subsarthur-jancommit/arth/',
      })
    ).toEqual({
      short: '51cf845',
      href: `https://github.com/subsarthur-jancommit/arth/commit/${SHA}`,
      day: '2026-10-05',
      builtAt: '2026-10-05T16:30:00.000Z',
    })
  })

  it('still names the commit when the repository is unknown', () => {
    expect(
      readBuild({ sha: SHA, builtAt: '2026-10-05T00:00:00Z' })?.href
    ).toBeNull()
  })

  it('says nothing outside a build it can name', () => {
    // CI and local builds: nothing was inlined.
    expect(readBuild({})).toBeNull()
    expect(readBuild({ builtAt: '2026-10-05T00:00:00Z' })).toBeNull()
    // A value that is not a commit, or a build with no readable date.
    expect(readBuild({ sha: 'main', builtAt: '2026-10-05' })).toBeNull()
    expect(readBuild({ sha: SHA, builtAt: 'yesterday' })).toBeNull()
    expect(readBuild({ sha: SHA })).toBeNull()
  })
})

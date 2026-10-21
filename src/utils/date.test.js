import { describe, expect, it } from 'vitest'
import { formatRelativeTime } from './date.js'

describe('date utilities', () => {
  it('formats timestamps relative to now', () => {
    const now = new Date('2026-10-21T12:00:00')

    expect(formatRelativeTime('2026-10-21T11:59:40', now)).toBe('Just now')
    expect(formatRelativeTime('2026-10-21T11:58:00', now)).toBe('2 minutes ago')
    expect(formatRelativeTime('2026-10-21T07:00:00', now)).toBe('5 hours ago')
    expect(formatRelativeTime('2026-10-20T12:00:00', now)).toBe('Yesterday')
  })
})

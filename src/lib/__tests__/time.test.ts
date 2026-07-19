import { describe, expect, it } from 'vitest'
import { relativeTime } from '../time'
import { distanceKm } from '../../data/places'

describe('relativeTime', () => {
  it('formats minutes, hours and days in Venezuelan Spanish', () => {
    const now = Date.now()
    expect(relativeTime(new Date(now - 30_000).toISOString())).toBe('ahora')
    expect(relativeTime(new Date(now - 5 * 60_000).toISOString())).toBe('hace 5 min')
    expect(relativeTime(new Date(now - 3 * 3_600_000).toISOString())).toBe('hace 3 h')
    expect(relativeTime(new Date(now - 26 * 3_600_000).toISOString())).toBe('hace 1 día')
    expect(relativeTime(new Date(now - 72 * 3_600_000).toISOString())).toBe('hace 3 días')
  })
})

describe('distanceKm', () => {
  it('measures Caracas → La Guaira at roughly 12–20 km', () => {
    const d = distanceKm(10.4806, -66.9036, 10.6, -66.9331)
    expect(d).toBeGreaterThan(10)
    expect(d).toBeLessThan(22)
  })

  it('is zero for identical points', () => {
    expect(distanceKm(10.5, -66.9, 10.5, -66.9)).toBe(0)
  })
})

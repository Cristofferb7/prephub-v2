import { describe, expect, it } from 'vitest'
import { featureToAlert, severityForMagnitude } from '../usgs'

interface TestProps {
  mag: number | null
  place: string | null
  time: number
  felt?: number | null
  alert?: string | null
  url?: string
}

const feature = (mag: number | null, extra: Partial<TestProps> = {}) => ({
  id: 'abc123',
  properties: {
    mag,
    place: '8 km N of La Guaira, Venezuela',
    time: 1752868800000,
    ...extra,
  } as TestProps,
  geometry: { coordinates: [-66.9, 10.6, 12.4] as [number, number, number] },
})

describe('severityForMagnitude', () => {
  it('maps magnitude bands to CAP severities', () => {
    expect(severityForMagnitude(7.2)).toBe('extreme')
    expect(severityForMagnitude(6.1)).toBe('severe')
    expect(severityForMagnitude(5.0)).toBe('moderate')
    expect(severityForMagnitude(4.2)).toBe('minor')
  })
})

describe('featureToAlert', () => {
  it('maps a USGS feature to a real (non-demo) sismo alert', () => {
    const a = featureToAlert(feature(5.2))
    expect(a).not.toBeNull()
    expect(a?.demo).toBe(false)
    expect(a?.source).toBe('USGS')
    expect(a?.category).toBe('sismo')
    expect(a?.severity).toBe('moderate')
    expect(a?.headline).toContain('5.2')
    expect(a?.headline).toContain('La Guaira')
    expect(a?.instruction.length).toBeGreaterThan(10)
    expect(a?.areas).toEqual([])
    expect(a?.id).toBe('usgs-abc123')
  })

  it('never produces prediction language', () => {
    const a = featureToAlert(feature(6.5))
    const text = `${a?.headline} ${a?.description} ${a?.instruction}`.toLowerCase()
    expect(text).not.toContain('posible terremoto')
    expect(text).not.toContain('se espera un sismo')
    expect(text).not.toContain('predic')
  })

  it('drops features without magnitude and survives null place', () => {
    expect(featureToAlert(feature(null))).toBeNull()
    expect(featureToAlert(feature(4.5, { place: null }))?.headline).toContain('Venezuela')
  })

  it('enriches with DYFI felt reports, PAGER level, and the event link', () => {
    const f = feature(5.8, { felt: 769, alert: 'red', url: 'https://earthquake.usgs.gov/earthquakes/eventpage/abc123' })
    const a = featureToAlert(f)
    expect(a?.description).toContain('769 personas lo reportaron como sentido')
    expect(a?.description).toContain('PAGER')
    expect(a?.link).toContain('eventpage/abc123')
    // green/quiet events get no PAGER mention
    const quiet = featureToAlert(feature(4.5))
    expect(quiet?.description).not.toContain('PAGER')
  })
})

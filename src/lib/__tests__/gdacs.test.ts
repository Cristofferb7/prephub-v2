import { describe, expect, it } from 'vitest'
import { gdacsToAlert } from '../gdacs'

const feature = (over: Record<string, unknown> = {}) => ({
  properties: {
    eventtype: 'FL',
    alertlevel: 'Orange',
    name: 'Flood in Venezuela',
    fromdate: '2026-07-18T01:00:00',
    todate: '2026-07-25T01:00:00',
    url: { report: 'https://www.gdacs.org/report.aspx?eventid=1' },
    ...over,
  },
})

describe('gdacsToAlert', () => {
  it('maps a flood to a real lluvias alert with UTC-corrected dates', () => {
    const a = gdacsToAlert(feature(), 0)
    expect(a.category).toBe('lluvias')
    expect(a.severity).toBe('moderate')
    expect(a.demo).toBe(false)
    expect(a.source).toBe('GDACS')
    expect(a.sent).toBe('2026-07-18T01:00:00Z')
    expect(a.expires).toBe('2026-07-25T01:00:00Z')
    expect(a.link).toContain('gdacs.org')
    expect(a.instruction).toContain('quebrada')
  })

  it('maps alert levels to severities', () => {
    expect(gdacsToAlert(feature({ alertlevel: 'Red' }), 0).severity).toBe('severe')
    expect(gdacsToAlert(feature({ alertlevel: 'Green' }), 0).severity).toBe('minor')
  })

  it('names cyclones distinctly and never predicts earthquakes', () => {
    const tc = gdacsToAlert(feature({ eventtype: 'TC' }), 0)
    expect(tc.headline).toContain('Ciclón')
    const text = (tc.headline + tc.description + tc.instruction).toLowerCase()
    expect(text).not.toContain('terremoto')
    expect(text).not.toContain('predic')
  })
})

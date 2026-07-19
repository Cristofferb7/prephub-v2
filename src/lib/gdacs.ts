import { db } from './db'
import type { Alert, AlertSeverity } from '../data/alerts'

/**
 * GDACS (Global Disaster Alert and Coordination System, EC-JRC/UN) — real
 * flood and tropical-cyclone alerts for Venezuela. Second allowed runtime
 * origin (see CLAUDE.md): CORS-open (*), no key, attribution in /fuentes.
 *
 * Same honesty + offline contract as USGS: events/advisories only, Dexie
 * cache serves the last snapshot offline, app fully functional without it.
 * The API answers 204 No Content when there are no active events — that is
 * a SUCCESS ("sin alertas activas"), not an error.
 */

const URL_ =
  'https://www.gdacs.org/gdacsapi/api/events/geteventlist/SEARCH?eventlist=FL;TC&country=Venezuela'
const FRESH_MS = 30 * 60 * 1000

interface GdacsFeature {
  properties: {
    eventtype: 'FL' | 'TC' | string
    alertlevel: 'Green' | 'Orange' | 'Red' | string
    name?: string
    description?: string
    fromdate?: string
    todate?: string
    url?: { report?: string }
  }
}

function severityFor(alertlevel: string): AlertSeverity {
  if (alertlevel === 'Red') return 'severe'
  if (alertlevel === 'Orange') return 'moderate'
  return 'minor'
}

/** Pure mapping, exported for tests. GDACS timestamps are UTC without zone. */
export function gdacsToAlert(f: GdacsFeature, i: number): Alert {
  const p = f.properties
  const isTC = p.eventtype === 'TC'
  const from = p.fromdate ? p.fromdate + 'Z' : new Date().toISOString()
  return {
    id: `gdacs-${p.eventtype}-${p.fromdate ?? i}`,
    category: 'lluvias',
    severity: severityFor(p.alertlevel),
    headline: isTC
      ? 'Ciclón tropical con efectos sobre Venezuela'
      : 'Inundaciones reportadas en Venezuela',
    description:
      `GDACS (sistema de alerta de la Comisión Europea y la ONU) reporta: ${p.name || p.description || 'evento hidrometeorológico'}. Nivel ${p.alertlevel === 'Red' ? 'rojo' : p.alertlevel === 'Orange' ? 'naranja' : 'verde'}.`,
    instruction:
      'Si vives cerca de una quebrada, en ladera o zona baja: prepara tu bolso de emergencia y define ya a dónde irías. Nunca cruces una corriente de agua.',
    areas: [], // country-wide
    sent: from,
    expires: p.todate ? p.todate + 'Z' : undefined,
    source: 'GDACS',
    demo: false,
    link: p.url?.report,
  }
}

export interface GdacsSnapshot {
  fetchedAt: string
  alerts: Alert[]
  stale: boolean
}

export async function getGdacsSnapshot(force = false): Promise<GdacsSnapshot | null> {
  const s = await db.settings.get('gdacsCache')
  const cached = (s?.value as GdacsSnapshot) ?? null
  const fresh = cached && Date.now() - new Date(cached.fetchedAt).getTime() < FRESH_MS
  if (cached && fresh && !force) return { ...cached, stale: false }

  try {
    const ctrl = new AbortController()
    const timer = setTimeout(() => ctrl.abort(), 10_000)
    const res = await fetch(URL_, { signal: ctrl.signal }).finally(() => clearTimeout(timer))
    if (res.status === 204) {
      const snap: GdacsSnapshot = { fetchedAt: new Date().toISOString(), alerts: [], stale: false }
      await db.settings.put({ key: 'gdacsCache', value: snap })
      return snap
    }
    if (!res.ok) throw new Error(String(res.status))
    const json = (await res.json()) as { features?: GdacsFeature[] }
    const alerts = (json.features ?? []).map(gdacsToAlert)
    const snap: GdacsSnapshot = { fetchedAt: new Date().toISOString(), alerts, stale: false }
    await db.settings.put({ key: 'gdacsCache', value: snap })
    return snap
  } catch {
    return cached ? { ...cached, stale: true } : null
  }
}

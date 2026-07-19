import { db } from './db'
import type { Alert, AlertSeverity } from '../data/alerts'

/**
 * USGSProvider — Phase B of CERCA_AVISOS_SPEC: REAL earthquake data.
 *
 * Honesty rules still apply: these are events that already HAPPENED (USGS
 * catalog), never predictions. The app stays 100% functional offline — this
 * is an optional enhancement that refreshes when a connection exists and
 * serves the last snapshot from IndexedDB when it doesn't.
 *
 * earthquake.usgs.gov is the single allowed runtime third-party origin
 * (free, CORS-enabled, no key — see CLAUDE.md amendment).
 */

// Venezuela + nearshore bounding box.
const BBOX = { minLat: 0.6, maxLat: 13.0, minLng: -73.8, maxLng: -59.0 }
const MIN_MAG = 4.0
const WINDOW_DAYS = 7
/** Don't re-hit the network more often than this unless forced. */
const FRESH_MS = 15 * 60 * 1000

const FEED_URL = () => {
  const start = new Date(Date.now() - WINDOW_DAYS * 864e5).toISOString()
  return (
    'https://earthquake.usgs.gov/fdsnws/event/1/query?format=geojson' +
    `&starttime=${start}&minmagnitude=${MIN_MAG}` +
    `&minlatitude=${BBOX.minLat}&maxlatitude=${BBOX.maxLat}` +
    `&minlongitude=${BBOX.minLng}&maxlongitude=${BBOX.maxLng}` +
    '&orderby=time&limit=20'
  )
}

interface UsgsFeature {
  id: string
  properties: { mag: number | null; place: string | null; time: number; tsunami?: number }
  geometry: { coordinates: [number, number, number] }
}

export function severityForMagnitude(mag: number): AlertSeverity {
  if (mag >= 7) return 'extreme'
  if (mag >= 6) return 'severe'
  if (mag >= 5) return 'moderate'
  return 'minor'
}

/** Pure mapping: USGS GeoJSON feature → CAP-shaped Alert. Exported for tests. */
export function featureToAlert(f: UsgsFeature): Alert | null {
  const mag = f.properties.mag
  if (mag == null) return null
  const depthKm = Math.round(f.geometry.coordinates[2])
  const place = f.properties.place ?? 'Venezuela'
  const severity = severityForMagnitude(mag)
  return {
    id: `usgs-${f.id}`,
    category: 'sismo',
    severity,
    headline: `Sismo de magnitud ${mag.toFixed(1)} — ${place}`,
    description: `USGS registró un sismo de magnitud ${mag.toFixed(1)} a ${depthKm} km de profundidad (${place}).`,
    instruction:
      severity === 'minor'
        ? 'Si lo sentiste, revisa tu casa con calma. Buen momento para repasar tu plan familiar.'
        : 'Espera réplicas. Si tu edificio quedó dañado, no vuelvas a entrar. Revisa gas y electricidad antes de usarlos.',
    areas: [], // country-wide: shown regardless of registered estados
    sent: new Date(f.properties.time).toISOString(),
    source: 'USGS',
    demo: false,
  }
}

export interface UsgsSnapshot {
  fetchedAt: string
  alerts: Alert[]
  /** true when the last refresh attempt failed and this is cached data */
  stale: boolean
}

async function readCache(): Promise<UsgsSnapshot | null> {
  const s = await db.settings.get('usgsCache')
  return (s?.value as UsgsSnapshot) ?? null
}

/**
 * Returns real USGS alerts: network-fresh when possible, cached otherwise.
 * Never throws; returns null only when there has never been a successful fetch.
 */
export async function getUsgsSnapshot(force = false): Promise<UsgsSnapshot | null> {
  const cached = await readCache()
  const fresh =
    cached && Date.now() - new Date(cached.fetchedAt).getTime() < FRESH_MS
  if (cached && fresh && !force) return { ...cached, stale: false }

  try {
    const res = await fetch(FEED_URL(), { signal: AbortSignal.timeout(10_000) })
    if (!res.ok) throw new Error(String(res.status))
    const json = (await res.json()) as { features: UsgsFeature[] }
    const alerts = json.features
      .map(featureToAlert)
      .filter((a): a is Alert => a !== null)
    const snap: UsgsSnapshot = { fetchedAt: new Date().toISOString(), alerts, stale: false }
    await db.settings.put({ key: 'usgsCache', value: snap })
    return snap
  } catch {
    return cached ? { ...cached, stale: true } : null
  }
}

// "Avisos" — CAP-shaped alert model (DEMO).
// Shaped after the Common Alerting Protocol (CAP), the standard used by FEMA
// (IPAWS), Google Public Alerts, and most national agencies. Keeping our mock
// objects CAP-compatible means a future integration is just a new provider.
//
// HONESTY RULE: earthquakes cannot be predicted. Real alerts are (a) events
// that already happened, (b) advisories (aftershocks, tsunami, weather).
// Never generate "possible earthquake" predictions. Demo data must always
// render with a visible DEMO badge.

export type AlertSeverity = 'extreme' | 'severe' | 'moderate' | 'minor'
export type AlertCategory = 'sismo' | 'tsunami' | 'lluvias' | 'deslizamiento' | 'servicio'

export interface Alert {
  id: string
  category: AlertCategory
  severity: AlertSeverity
  headline: string // plain Venezuelan Spanish, verb-first
  description: string
  instruction: string // what to DO — required, CAP-style
  areas: string[] // estado / municipio names, lowercase
  sent: string // ISO datetime
  expires?: string
  source: string // e.g. 'FUNVISIS', 'INAMEH', 'USGS', 'DEMO'
  demo: boolean
  /** Optional outlink (e.g. USGS event page with "¿Lo sentiste?" report form). */
  link?: string
}

export const SEVERITY_LABEL: Record<AlertSeverity, string> = {
  extreme: 'Extrema',
  severe: 'Grave',
  moderate: 'Moderada',
  minor: 'Menor',
}

export const CATEGORY_LABEL: Record<AlertCategory, string> = {
  sismo: 'Sismo',
  tsunami: 'Tsunami',
  lluvias: 'Lluvias fuertes',
  deslizamiento: 'Deslizamiento',
  servicio: 'Servicios',
}

// Demo scenario: a plausible aftershock sequence, told safely.
export const DEMO_ALERTS: Alert[] = [
  {
    id: 'demo-sismo-1',
    category: 'sismo',
    severity: 'severe',
    headline: 'Sismo de magnitud 5.2 registrado cerca de La Guaira',
    description:
      'FUNVISIS registró un sismo de magnitud 5.2 a 12 km de profundidad, a 8 km al norte de La Guaira. Se sintió en La Guaira, Caracas y Miranda.',
    instruction:
      'Si tu edificio quedó dañado, no vuelvas a entrar. Espera réplicas. Revisa gas y electricidad antes de usarlos.',
    areas: ['la guaira', 'distrito capital', 'miranda'],
    sent: '2026-07-10T14:32:00-04:00',
    source: 'DEMO',
    demo: true,
  },
  {
    id: 'demo-replica-1',
    category: 'sismo',
    severity: 'moderate',
    headline: 'Réplicas esperadas en las próximas 48 horas',
    description:
      'Tras el sismo de magnitud 5.2, son normales réplicas de menor intensidad durante los próximos días.',
    instruction:
      'Mantén zapatos y linterna al lado de la cama. Acuerda con tu familia el punto de encuentro.',
    areas: ['la guaira', 'distrito capital', 'miranda'],
    sent: '2026-07-10T15:10:00-04:00',
    expires: '2026-07-12T15:10:00-04:00',
    source: 'DEMO',
    demo: true,
  },
  {
    id: 'demo-lluvias-1',
    category: 'lluvias',
    severity: 'moderate',
    headline: 'Lluvias fuertes previstas en el Litoral Central',
    description:
      'INAMEH prevé precipitaciones intensas en las próximas 24 horas. Riesgo de crecidas en quebradas del Ávila.',
    instruction:
      'Si vives cerca de una quebrada o en una ladera, prepara tu bolso de emergencia y define a dónde irías.',
    areas: ['la guaira', 'distrito capital'],
    sent: '2026-07-10T09:00:00-04:00',
    expires: '2026-07-11T09:00:00-04:00',
    source: 'DEMO',
    demo: true,
  },
]

/**
 * Provider seam for real integrations.
 *
 * Future implementations (in priority order):
 * 1. USGSProvider — real-time earthquake GeoJSON, free, CORS-enabled:
 *    https://earthquake.usgs.gov/earthquakes/feed/v1.0/geojson.php
 *    Filter by bounding box around Venezuela; map to Alert.
 * 2. CAPProvider — generic CAP XML/Atom feed parser. This is the FEMA
 *    (IPAWS) / Google Public Alerts–compatible path.
 * 3. FUNVISISProvider / INAMEHProvider — official Venezuelan sources
 *    (no public API today; would need scraping or partnership).
 * Push notifications by area require a small backend (Cloudflare Worker +
 * web-push, topic per estado). Out of scope for the offline-first core.
 */
export interface AlertProvider {
  getActiveAlerts(areas: string[]): Promise<Alert[]>
}

export const demoProvider: AlertProvider = {
  getActiveAlerts: (areas) =>
    Promise.resolve(
      DEMO_ALERTS.filter((a) => areas.length === 0 || a.areas.some((x) => areas.includes(x)))
    ),
}

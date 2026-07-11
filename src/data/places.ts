// "Cerca de ti" — puntos de apoyo (DEMO DATA).
// Real Caracas-area public spaces commonly used as assembly/shelter points.
// Coordinates are approximate; every entry is verifiedBy: 'demo' until a real
// source (Protección Civil / Cruz Roja / community verification) replaces it.

export type PlaceService = 'agua' | 'comida' | 'medicinas' | 'techo'

export type PlaceStatus = 'abierto' | 'lleno' | 'sin_confirmar' | 'cerrado'

export interface Place {
  id: string
  name: string
  municipio: string
  lat: number
  lng: number
  status: PlaceStatus
  services: PlaceService[]
  note?: string
  verifiedBy: 'proteccion_civil' | 'cruz_roja' | 'comunidad' | 'demo'
  updatedAt: string // ISO date
}

export const PLACE_STATUS_LABEL: Record<PlaceStatus, string> = {
  abierto: 'Abierto',
  lleno: 'Lleno',
  sin_confirmar: 'Sin confirmar',
  cerrado: 'Cerrado',
}

export const SERVICE_LABEL: Record<PlaceService, string> = {
  agua: 'Agua',
  comida: 'Comida',
  medicinas: 'Medicinas',
  techo: 'Refugio',
}

export const DEMO_PLACES: Place[] = [
  { id: 'parque-este', name: 'Parque Generalísimo Francisco de Miranda (Parque del Este)', municipio: 'Sucre', lat: 10.4972, lng: -66.8467, status: 'abierto', services: ['agua', 'techo', 'medicinas'], note: 'Zona abierta amplia, punto de concentración habitual.', verifiedBy: 'demo', updatedAt: '2026-07-10' },
  { id: 'la-carlota', name: 'Base Aérea La Carlota (espacio abierto)', municipio: 'Chacao', lat: 10.4894, lng: -66.8536, status: 'abierto', services: ['techo'], note: 'Gran espacio abierto, lejos de edificios altos.', verifiedBy: 'demo', updatedAt: '2026-07-10' },
  { id: 'poliedro', name: 'Poliedro de Caracas', municipio: 'Libertador', lat: 10.4442, lng: -66.9339, status: 'sin_confirmar', services: ['techo', 'comida'], verifiedBy: 'demo', updatedAt: '2026-07-09' },
  { id: 'ucv', name: 'Ciudad Universitaria (UCV) — Tierra de Nadie', municipio: 'Libertador', lat: 10.4897, lng: -66.8903, status: 'abierto', services: ['agua', 'techo', 'medicinas'], verifiedBy: 'demo', updatedAt: '2026-07-10' },
  { id: 'los-caobos', name: 'Parque Los Caobos', municipio: 'Libertador', lat: 10.5031, lng: -66.8931, status: 'abierto', services: ['techo'], verifiedBy: 'demo', updatedAt: '2026-07-10' },
  { id: 'plaza-bolivar', name: 'Plaza Bolívar de Caracas', municipio: 'Libertador', lat: 10.5061, lng: -66.9146, status: 'lleno', services: ['agua', 'comida'], verifiedBy: 'demo', updatedAt: '2026-07-10' },
  { id: 'estadio-olimpico', name: 'Estadio Olímpico UCV', municipio: 'Libertador', lat: 10.4839, lng: -66.8886, status: 'sin_confirmar', services: ['techo', 'comida'], verifiedBy: 'demo', updatedAt: '2026-07-08' },
  { id: 'parque-miranda', name: 'Parque Miranda (Parque del Oeste)', municipio: 'Libertador', lat: 10.5108, lng: -66.9439, status: 'abierto', services: ['agua'], verifiedBy: 'demo', updatedAt: '2026-07-10' },
  { id: 'plaza-altamira', name: 'Plaza Francia (Altamira)', municipio: 'Chacao', lat: 10.4961, lng: -66.8419, status: 'abierto', services: ['agua'], note: 'Punto de encuentro habitual del este de la ciudad.', verifiedBy: 'demo', updatedAt: '2026-07-10' },
  { id: 'hosp-clinicas', name: 'Hospital Universitario de Caracas', municipio: 'Libertador', lat: 10.4906, lng: -66.8942, status: 'abierto', services: ['medicinas'], note: 'Solo emergencias médicas.', verifiedBy: 'demo', updatedAt: '2026-07-10' },
  { id: 'parque-vinedo', name: 'Parque El Viñedo (Valencia)', municipio: 'Valencia', lat: 10.2094, lng: -68.0031, status: 'sin_confirmar', services: ['techo'], verifiedBy: 'demo', updatedAt: '2026-07-09' },
  { id: 'plaza-toros-mcy', name: 'Plaza de Toros Maestranza (Maracay)', municipio: 'Girardot', lat: 10.2442, lng: -67.5958, status: 'sin_confirmar', services: ['techo', 'comida'], verifiedBy: 'demo', updatedAt: '2026-07-09' },
]

// Haversine distance in km — runs on-device, no network.
export function distanceKm(aLat: number, aLng: number, bLat: number, bLng: number): number {
  const R = 6371
  const dLat = ((bLat - aLat) * Math.PI) / 180
  const dLng = ((bLng - aLng) * Math.PI) / 180
  const s =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((aLat * Math.PI) / 180) * Math.cos((bLat * Math.PI) / 180) * Math.sin(dLng / 2) ** 2
  return 2 * R * Math.asin(Math.sqrt(s))
}

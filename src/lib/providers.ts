import { DEMO_PLACES, type Place } from '../data/places'
import osmPlaces from '../data/places.osm.json'

/**
 * Provider seam for "Cerca de ti".
 *
 * Two bundled sources today:
 * - places.osm.json — REAL hospitals/clinics/water points from OpenStreetMap,
 *   fetched at build time by scripts/fetch-places.mjs (never at runtime).
 *   OSM knows locations, not operational status → always 'sin_confirmar'.
 * - DEMO_PLACES — example assembly/shelter points, always DEMO-badged.
 *
 * Production upgrade path: Protección Civil / Cruz Roja lists or NERV-style
 * community verification (needs a backend plus moderation).
 */
export function getPlaces(): Promise<Place[]> {
  return Promise.resolve([...(osmPlaces as Place[]), ...DEMO_PLACES])
}

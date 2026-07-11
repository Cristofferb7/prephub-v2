import { DEMO_PLACES, type Place } from '../data/places'

/**
 * Provider seam for "Cerca de ti".
 *
 * Today this returns the bundled DEMO list. Production replaces this body —
 * not the UI — with real sources: Protección Civil / Cruz Roja Venezolana
 * shelter lists, or NERV-style community verification (which needs a backend
 * plus moderation before anything user-submitted is shown).
 */
export function getPlaces(): Promise<Place[]> {
  return Promise.resolve(DEMO_PLACES)
}

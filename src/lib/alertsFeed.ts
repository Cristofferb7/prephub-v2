import { demoProvider, type Alert } from '../data/alerts'
import { getUsgsSnapshot, type UsgsSnapshot } from './usgs'

export interface Feed {
  alerts: Alert[]
  usgs: UsgsSnapshot | null
}

/**
 * The single feed both Home and /avisos consume: demo scenario (area-filtered,
 * always DEMO-badged) merged with real USGS earthquakes (country-wide),
 * newest first.
 */
export async function getFeed(areas: string[], forceRefresh = false): Promise<Feed> {
  const [demo, usgs] = await Promise.all([
    demoProvider.getActiveAlerts(areas),
    getUsgsSnapshot(forceRefresh),
  ])
  const alerts = [...demo, ...(usgs?.alerts ?? [])].sort((a, b) => b.sent.localeCompare(a.sent))
  return { alerts, usgs }
}

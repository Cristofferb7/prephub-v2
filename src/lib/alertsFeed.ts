import { demoProvider, type Alert } from '../data/alerts'
import { getUsgsSnapshot, type UsgsSnapshot } from './usgs'

export interface Feed {
  alerts: Alert[]
  usgs: UsgsSnapshot | null
}

export interface FeedOptions {
  forceRefresh?: boolean
  /** Simulacro replays the full demo scenario, including expired advisories. */
  includeExpired?: boolean
}

/**
 * The single feed both Home and /avisos consume: demo scenario (area-filtered,
 * always DEMO-badged) merged with real USGS earthquakes (country-wide),
 * newest first. Expired advisories are dropped outside the simulacro — an
 * "active" feed showing a lapsed 48-hour aftershock advisory reads as broken.
 */
export async function getFeed(areas: string[], opts: FeedOptions = {}): Promise<Feed> {
  const [demo, usgs] = await Promise.all([
    demoProvider.getActiveAlerts(areas),
    getUsgsSnapshot(opts.forceRefresh ?? false),
  ])
  const now = new Date().toISOString()
  const active = opts.includeExpired ? demo : demo.filter((a) => !a.expires || a.expires > now)
  const alerts = [...active, ...(usgs?.alerts ?? [])].sort((a, b) => b.sent.localeCompare(a.sent))
  return { alerts, usgs }
}

// Fetches real points of reference (hospitals, clinics, water, assembly
// points, shelters) for Venezuelan cities from OpenStreetMap's Overpass API
// and writes them to src/data/places.osm.json.
//
// BUILD-TIME ONLY — runs on a dev machine, never in the app. The committed
// JSON is the source of truth; the app makes no runtime Overpass requests
// (fair-use policy + offline-first). Data © OpenStreetMap contributors (ODbL);
// attribution ships in /cerca and /fuentes.
//
// Run: node scripts/fetch-places.mjs
import { writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const OUT = join(dirname(fileURLToPath(import.meta.url)), '..', 'src', 'data', 'places.osm.json')

// city label → [south, west, north, east]
const CITIES = {
  Caracas: [10.35, -67.05, 10.55, -66.75],
  Valencia: [10.1, -68.1, 10.3, -67.9],
  Maracay: [10.2, -67.7, 10.28, -67.5],
}

// OSM tag → PrepHub services
const SELECTORS = [
  ['amenity=hospital', ['medicinas']],
  ['amenity=clinic', ['medicinas']],
  ['amenity=drinking_water', ['agua']],
  ['emergency=assembly_point', ['techo']],
  ['amenity=shelter', ['techo']],
]

const PER_CITY_CAP = 60 // keep the bundle honest on low-end phones

function query(bbox) {
  const b = bbox.join(',')
  const parts = SELECTORS.map(([sel]) => {
    const [k, v] = sel.split('=')
    return `node["${k}"="${v}"](${b});way["${k}"="${v}"](${b});`
  }).join('\n')
  return `[out:json][timeout:60];(\n${parts}\n);out center tags;`
}

function servicesFor(tags) {
  for (const [sel, services] of SELECTORS) {
    const [k, v] = sel.split('=')
    if (tags[k] === v) return services
  }
  return []
}

const all = []
for (const [city, bbox] of Object.entries(CITIES)) {
  const MIRRORS = [
    'https://overpass-api.de/api/interpreter',
    'https://overpass.kumi.systems/api/interpreter',
    'https://lz4.overpass-api.de/api/interpreter',
  ]
  let json = null
  for (const url of MIRRORS) {
    try {
      const res = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          // Overpass policy asks for an identifiable UA
          'User-Agent': 'PrepHub-build/1.0 (https://prephub-delta.vercel.app; build-time fetch)',
        },
        body: 'data=' + encodeURIComponent(query(bbox)),
      })
      if (!res.ok) throw new Error(`${res.status}`)
      json = await res.json()
      break
    } catch (e) {
      console.warn(`  ${url} failed (${e.message}) — trying next mirror`)
    }
  }
  if (!json) throw new Error(`all Overpass mirrors failed for ${city}`)
  const seen = new Set()
  const places = json.elements
    .filter((e) => e.tags?.name)
    .map((e) => ({
      id: `osm-${e.type}-${e.id}`,
      name: e.tags.name,
      municipio: e.tags['addr:city'] || city,
      lat: e.lat ?? e.center?.lat,
      lng: e.lon ?? e.center?.lon,
      status: 'sin_confirmar',
      services: servicesFor(e.tags),
      verifiedBy: 'osm',
      updatedAt: new Date().toISOString().slice(0, 10),
    }))
    .filter((p) => p.lat && p.lng && !seen.has(p.name) && seen.add(p.name))
    // hospitals first, then clinics, then the rest — most useful under the cap
    .sort((a, b) => Number(b.services.includes('medicinas')) - Number(a.services.includes('medicinas')))
    .slice(0, PER_CITY_CAP)
  console.log(city, '→', places.length, 'places')
  all.push(...places)
  await new Promise((r) => setTimeout(r, 2000)) // be polite to Overpass
}

writeFileSync(OUT, JSON.stringify(all, null, 1))
console.log('wrote', all.length, 'places to', OUT)

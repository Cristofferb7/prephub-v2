# PrepHub — "Cerca de ti" + "Avisos" prototype spec (for Claude Code)

Two new demo-mode features inspired by NERV Crisis Mapping and Watch Duty, architected so real data sources (FEMA/Google CAP feeds, USGS, FUNVISIS) can plug in later without UI changes. Everything below runs offline with bundled mock data.

## Already done by Cowork (do NOT redo)

- `src/data/places.ts` — Place model, 12 real Caracas/Valencia/Maracay demo locations with coords, status (`abierto/lleno/sin_confirmar/cerrado`), services (`agua/comida/medicinas/techo`), `verifiedBy: 'demo'`, plus a `distanceKm` haversine helper.
- `src/data/alerts.ts` — CAP-shaped Alert model (category/severity/headline/instruction/areas/sent/source/demo), a safe demo scenario (M5.2 + aftershock advisory + rain warning), `AlertProvider` interface + `demoProvider`, and documented future providers (USGS GeoJSON → CAP feeds → FUNVISIS/INAMEH).

## Non-negotiable safety rules

1. **Never predict earthquakes.** Alerts are events that happened + advisories only. No "posible terremoto" language anywhere.
2. **Every demo item wears a visible DEMO badge** (chip: `DEMO · datos de ejemplo`). A banner at the top of both screens: "Modo demostración — estos datos no son reales." Real-looking fake alerts are a hard fail.
3. Red stays reserved for emergency contexts; alert severity uses amber (moderate) → red (severe/extreme) chips.
4. Geolocation is optional and on-demand: ask permission only when the user taps "Ordenar por distancia"; fall back to alphabetical-by-municipio; never store coords beyond the session.
5. Bundle budget still <300 KB gz JS+CSS. No map libraries in this phase.

## Feature 1 — `/cerca` ("Cerca de ti")

Purpose: find nearby support points (shelter/water/food/medical) at a glance, NERV Crisis Mapping style but list-first.

- **List view (primary):** cards sorted by distance (after geolocation) or grouped by municipio. Each card: name, municipio, distance ("a 1,2 km"), status chip (color + TEXT — never color alone), service chips with icons (Agua/Comida/Medicinas/Refugio), "Actualizado: 10 jul" + verifiedBy label, DEMO badge.
- **Filter row:** pill toggles for the four services + "Solo abiertos". Filters combine (AND).
- **Map view (secondary, this phase):** a lightweight schematic — NOT a tile map. Render an inline SVG canvas that plots places by lat/lng normalized into the viewBox (simple linear projection is fine at city scale), user position as a pulsing dot when granted, markers colored by status with tap → scrolls to/expands that card. Aspect ~4:3, `--surface-1` background, subtle grid lines. Toggle "Lista / Mapa" segmented control at top. This is explicitly a mock of the future real map.
- **Each card expands** (or navigates) to detail: note, all services listed in text, "Cómo llegar" button that deep-links `geo:` URI / Google Maps URL (works offline-degraded: shows address text).
- **Future-real seam:** places come from a `getPlaces(): Promise<Place[]>` function (today returns `DEMO_PLACES`); document that production = Protección Civil/Cruz Roja lists or NERV-style community verification (needs backend + moderation).
- **Real map (later, documented only):** MapLibre GL + PMTiles Caracas extract as opt-in ~30–80 MB download stored in OPFS. Do not implement now.

## Feature 2 — `/avisos` ("Avisos")

Purpose: Watch Duty-style chronological feed of alerts for the user's registered areas + the FEMA/Google-compatible seam.

- **Area registration (NERV pattern):** first visit asks the user to pick their estado(s) from a Venezuelan estados list (checkbox cards, max 3). Persist in Dexie (`settings` table or new `areas` table). Editable later via a "Mis zonas" row on `/ajustes`.
- **Feed:** newest first, filtered by registered areas via `demoProvider.getActiveAlerts(areas)`. Each item: category icon + label, severity chip (text+color), headline (bold, verb-first), relative time ("hace 2 h"), expandable description + **instruction highlighted in its own box** (the "qué hacer" is the point), source + DEMO badge.
- **Home integration:** if any `severity: severe|extreme` alert matches the user's areas, show a `.banner banner-warn` on Home linking to /avisos.
- **Demo notification:** a "Probar notificación" button on /avisos → requests Notification permission → service worker `showNotification` with the top demo alert (title = headline, body = instruction, ES text). This demonstrates the UX; document that real area-based push requires a small backend (Cloudflare Worker + web-push, one topic per estado) and stays out of the offline-first core.
- **Simulacro mode:** button "Ver simulacro" that replays the 3-alert demo scenario with staggered entrance animations (reuse `.rise-in`) — this doubles as the app's pitch/demo for the portfolio video.

## Navigation

Keep the bottom nav at 5 tabs (don't crowd it). `/cerca` and `/avisos` get two prominent cards on Home, right below the progress cards: "Cerca de ti — refugios y puntos de apoyo" and "Avisos — sismos y lluvias en tu zona", each with a small DEMO chip. If analytics later show heavy use, we'll revisit the tab bar.

## Copy tone

Venezuelan Spanish, verb-first instructions, warm but factual (Gentler Streak rule: guidance, never alarm-for-alarm's-sake). Examples in the data files.

## Roadmap context (for README + portfolio case study, don't build)

- **Phase A (this spec):** all mock, offline, DEMO-labeled.
- **Phase B:** real earthquake data via USGS GeoJSON feed (free, CORS-enabled, no key) filtered to a Venezuela bounding box; INAMEH weather advisories via scraping/partnership; shelter data via Protección Civil/Cruz Roja partnership or NERV-style community verification.
- **Phase C:** CAP feed ingestion (FEMA IPAWS / Google Public Alerts compatible), area-topic push via Cloudflare Worker, MapLibre+PMTiles offline city maps.

## Definition of done

Build green, <300 KB gz, works airplane-mode, both themes + high-contrast + "Enorme" text checked on 360px, DEMO badges everywhere, reduced-motion respected, then commit + `vercel --prod`.

# PrepHub

**Tu familia preparada para el próximo terremoto en 20 minutos — y sin internet.**

Spanish-first, offline-first earthquake-preparedness PWA built for Venezuelan families after the June 24, 2026 twin earthquakes (M7.5 + M7.2). Preparation only — no alerts, no accounts, no backend. Every byte of guidance is pre-cached on the phone, because in a real disaster the internet is the first thing to go.

**Live: [prephub-delta.vercel.app](https://prephub-delta.vercel.app)**

## Why

During the 2026 earthquakes, Venezuelans faced an information blackout in the most critical hours — connectivity failed and 200+ sites were blocked. No existing app was simultaneously Spanish-first, offline-first, preparation-focused, and installable without an app store. PrepHub fills that gap. It began as a 2023 bootcamp project and was rebuilt from scratch in July 2026.

## What it does

- **Puntuación de preparación** — one score that shows how ready your family is, with the next step always one tap away.
- **Kit de emergencia** — 72-hour checklist (water, food, first aid, documents…) with quantities scaled to your household size and expiry tracking for water, meds, and batteries.
- **Plan familiar** — guided reunification plan: contacts (including an out-of-country contact — designed for the diaspora), meeting points, and emergency numbers. Share it by WhatsApp, print it (paper survives blackouts), or hand it off as a QR code.
- **Guías offline** — during the quake, right after, safe water, essential first aid, "is it safe to go back in?", and heavy-rain/landslide guidance. Sourced from FUNVISIS, CENAPRED, SENAPRED, FEMA/Ready.gov, and PAHO — adapted into Venezuelan Spanish and credited in-app.
- **Ahora mismo** — a stripped-down emergency mode: huge red buttons, giant text, zero navigation. Built to be used by shaking hands in the dark.
- **Avisos** — a chronological alert feed: **real recent earthquakes from the USGS catalog** (Venezuela bounding box, cached in IndexedDB so the last snapshot survives offline) enriched with DYFI felt-report counts, PAGER impact levels, and a "¿Lo sentiste?" report link per event — merged with a clearly-badged DEMO advisory scenario. Events that happened + advisories only — earthquakes cannot be predicted, and this app never pretends otherwise.
- **Cerca de ti** — nearby support points with status/service filters and a schematic SVG map. **157 real hospitals, clinics, and water points from OpenStreetMap** (fetched at build time by `scripts/fetch-places.mjs` — never at runtime; © OpenStreetMap contributors, ODbL) plus clearly-badged DEMO shelter points. OSM knows locations, not operational status, so everything real is labeled "sin confirmar".
- **Light & dark themes** — dark by default (blackout- and OLED-friendly).

Everything is stored on-device (IndexedDB). Nothing is ever sent to a server — there is no server.

## Stack

Vite · React · TypeScript · vite-plugin-pwa (Workbox precache) · Dexie (IndexedDB) · zero runtime third-party requests · ~120 KB gzipped first load.

Design system: "Vital Ember" — warm near-black base, tonal elevation (no borders), amber glow accent, CSS-only spring motion. See [DESIGN_SPEC.md](DESIGN_SPEC.md). Scope and budget rules: [CLAUDE.md](CLAUDE.md).

## Develop

```sh
npm install
npm run dev       # dev server (no service worker)
npm run build     # type-check + production build with service worker
npm run preview   # serve dist/ — use this to test offline/PWA behavior
node scripts/make-icons.mjs   # regenerate placeholder icons
```

Requires Node 20.x (repo is pinned to Vite 6 for Node < 20.19).

## Deploy

Hosted on Vercel (project `prephub`, team `cristofferb7s-projects`):

```sh
vercel          # preview deploy
vercel --prod   # production → prephub-delta.vercel.app
```

Static output only — any static host works. `vercel.json` handles SPA rewrites and immutable asset caching.

## Author

Cristoffer Bohorquez — [github.com/Cristofferb7](https://github.com/Cristofferb7)

Guidance adapted from public sources: FEMA/Ready.gov (public domain), OPS/PAHO (CC BY-NC-SA 3.0 IGO), FUNVISIS, CENAPRED, SENAPRED. PrepHub is unofficial and not affiliated with any government agency. In an emergency, always follow the instructions of local authorities.

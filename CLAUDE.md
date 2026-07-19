# PrepHub v2

Spanish-first, offline-first earthquake **preparation** PWA for Venezuela. No alerts, no backend — preparation only. Full spec: [`../PREPHUB_BRIEF.md`](../PREPHUB_BRIEF.md) (read it before large features).

**Mission:** a Venezuelan family gets prepared for the next earthquake in one 20-minute session — and keeps it without internet. A single session must yield a durable artifact (shared/printed family plan + started kit) even if the app is never reopened.

## Hard budgets (non-negotiable)

- **First-load JS+CSS < 300 KB gzipped** (hard ceiling 500 KB). Check with `npm run build` output before adding any dependency. Consider preact-compat before blowing the budget.
- **Zero third-party domains at runtime, with ONE amendment (July 2026):** `earthquake.usgs.gov` is allowed as an optional, graceful-degradation fetch for real past-earthquake data (Phase B of CERCA_AVISOS_SPEC.md; CORS-enabled, no key, cached in Dexie so offline users see the last snapshot). Everything else stays banned: no CDNs, no web fonts (Figtree is self-hosted via npm), no analytics (v1), no external images. The app must remain 100% functional if that fetch never succeeds. OpenStreetMap data in /cerca is fetched at BUILD time only (scripts/fetch-places.mjs → src/data/places.osm.json, committed) — never add runtime Overpass calls (fair-use policy + offline-first).
- **100% functional offline from first load.** Airplane-mode cold start is the acceptance test. Full precache (app + all content) well under 50 MB — realistically < 2 MB.
- Target device: old low-end Android (~Android 8+, old Chrome WebView), ~17 Mbps network. Test with CPU throttling.
- Every page useful without images; illustrations are inline SVG only.
- Lighthouse: PWA installable, a11y ≥ 95.
- Print stylesheet is a feature, not an afterthought — paper survives blackouts.
- iOS install-to-home-screen is a **data-integrity requirement** (exempts from Safari 7-day eviction). Always offer JSON export as escape hatch.

## Won't-have list (permanent — do not add, do not suggest)

- Alerts / earthquake early warning of any kind
- SOS / live response features
- Accounts, login, auth
- Chat, crowdsourcing, missing-persons database (link out to familylinks.icrc.org instead)
- Backend / server / API / CMS — content is static JSON/MDX bundled at build time
- Push notifications (no backend = no push; use in-app staleness banners + downloadable .ics)
- Multi-country content, app stores, real-time anything
- Maps in MVP (meeting points are typed addresses)

## Stack & conventions

- Vite + React + TypeScript, `vite-plugin-pwa` (Workbox), Dexie/IndexedDB.
- **User data goes in IndexedDB via Dexie ([src/lib/db.ts](src/lib/db.ts)) — never localStorage for anything important.** Content goes in Cache Storage via the SW precache.
- Privacy rule (Red Cross RFL norms): family data lives ONLY on-device; sharing only by explicit user action (WhatsApp/print/QR/export). The UI says this — it's a trust feature.
- SW update flow is `prompt`, never auto-reload — the app may be open during an emergency.
- **Node:** repo pinned to Vite 6 / @vitejs/plugin-react 4 because local Node is 20.17 (< Vite 7/8's 20.19+ requirement). Don't bump vite without upgrading Node.
- UI language: Venezuelan Spanish only in v1 (cédula, quebrada — not translated gringo Spanish). Content is synthesized from official sources (FEMA/ShakeOut public domain, PAHO CC BY-NC-SA, FUNVISIS, CENAPRED, SENAPRED) with attribution on /fuentes — never invented.
- Design: calm institutional trust, dark mode default, high contrast, ≥48px tap targets, `prefers-reduced-motion` respected. Emergency red-orange is used ONLY in /ahora. NOT the portfolio's Spider-Man aesthetic.
- Hazard = content collection from day one (earthquake-deep now, floods thin) — multi-hazard without refactor.

## Routes (target structure)

`/` score dashboard · `/ahora` emergency mode (black bg, huge type, zero chrome) · `/kit` checklist · `/plan` family plan · `/guias` guides · `/fuentes` sources/credits/privacy.

## Build phases

1. ✅ Scaffold + offline shell (this) → deploy to Vercel
2. Data model + dashboard score ring
3. Kit checklist engine (household scaling, expiry dates)
4. Plan familiar → share text / print / QR
5. Content: 5 guides + lluvias module (Spanish, sourced)
6. /ahora emergency mode
7. Install prompts (Android + iOS walkthrough) + `navigator.storage.persist()` + export/import
8. QA: offline cold-start, throttled Android, Lighthouse, print, iOS install
9. Portfolio case-study integration

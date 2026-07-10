# PrepHub v2

Spanish-first, offline-first earthquake preparation PWA for Venezuela. Preparation only — no alerts, no backend, no accounts. Everything lives on-device.

> "Una familia venezolana queda preparada para el próximo terremoto en una sesión de 20 minutos — y lo conserva sin internet."

Rebuild of a 2023 bootcamp project after the June 2026 Venezuela earthquakes. Spec: `../PREPHUB_BRIEF.md` · budgets and scope rules: [CLAUDE.md](CLAUDE.md).

## Stack

Vite + React + TypeScript · vite-plugin-pwa (Workbox precache) · Dexie/IndexedDB · zero runtime third-party domains.

## Develop

```sh
npm install
npm run dev       # dev server (no SW)
npm run build     # type-check + production build with service worker
npm run preview   # serve dist/ — use this to test the offline/PWA behavior
node scripts/make-icons.mjs   # regenerate placeholder icons
```

Requires Node 20.x (repo is pinned to Vite 6 for Node < 20.19).

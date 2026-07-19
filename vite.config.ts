import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'prompt',
      manifest: {
        name: 'PrepHub — Preparación ante terremotos',
        short_name: 'PrepHub',
        description:
          'Tu familia preparada para el próximo terremoto en 20 minutos — y sin internet.',
        lang: 'es',
        start_url: '/',
        scope: '/',
        display: 'standalone',
        orientation: 'portrait',
        background_color: '#141210',
        theme_color: '#141210',
        categories: ['utilities', 'health'],
        shortcuts: [
          {
            name: 'Ahora mismo — emergencia',
            short_name: 'Ahora',
            url: '/ahora',
            icons: [{ src: '/icons/icon-192.png', sizes: '192x192' }],
          },
        ],
        icons: [
          { src: '/icons/icon-192.png', sizes: '192x192', type: 'image/png' },
          { src: '/icons/icon-512.png', sizes: '512x512', type: 'image/png' },
          {
            src: '/icons/icon-512-maskable.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'maskable',
          },
        ],
      },
      workbox: {
        // Precache the entire shell + bundled content: the app must be 100%
        // functional offline from first load (see CLAUDE.md).
        globPatterns: ['**/*.{js,css,html,svg,png,ico,json,webmanifest,woff2}'],
        // All content ships bundled (src/data/*.ts) — no runtimeCaching routes.
        // USGS responses are cached in Dexie by src/lib/usgs.ts, not the SW.
        navigateFallback: 'index.html',
      },
    }),
  ],
})

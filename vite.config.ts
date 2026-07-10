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
        background_color: '#0b1220',
        theme_color: '#0b1220',
        categories: ['utilities', 'health'],
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
        globPatterns: ['**/*.{js,css,html,svg,png,ico,json,webmanifest}'],
        navigateFallback: 'index.html',
        runtimeCaching: [
          {
            // Content JSON (guides, checklist definitions)
            urlPattern: ({ url }) => url.pathname.startsWith('/content/'),
            handler: 'StaleWhileRevalidate',
            options: { cacheName: 'prephub-content' },
          },
        ],
      },
    }),
  ],
})

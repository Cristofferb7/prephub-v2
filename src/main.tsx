import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { registerSW } from 'virtual:pwa-register'
// Self-hosted variable font (headings + numerals only) — no third-party domain.
import '@fontsource-variable/figtree/wght.css'
import './index.css'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)

// registerType is 'prompt': never auto-reload — the app may be open during an
// emergency. Show a banner and let the user decide.
const updateSW = registerSW({
  onNeedRefresh() {
    if (document.querySelector('.update-banner')) return
    const banner = document.createElement('div')
    banner.className = 'update-banner'
    banner.setAttribute('role', 'status')
    const span = document.createElement('span')
    span.textContent = 'Hay una versión nueva disponible.'
    const later = document.createElement('button')
    later.textContent = 'Después'
    later.className = 'ghost'
    later.onclick = () => banner.remove()
    const btn = document.createElement('button')
    btn.textContent = 'Actualizar'
    btn.className = 'primary'
    btn.onclick = () => updateSW(true)
    banner.append(span, later, btn)
    document.body.appendChild(banner)
  },
})

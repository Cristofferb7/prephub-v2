import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { registerSW } from 'virtual:pwa-register'
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
    const banner = document.createElement('div')
    banner.className = 'update-banner'
    banner.innerHTML = '<span>Hay una versión nueva disponible.</span>'
    const btn = document.createElement('button')
    btn.textContent = 'Actualizar'
    btn.onclick = () => updateSW(true)
    banner.appendChild(btn)
    document.body.appendChild(banner)
  },
})

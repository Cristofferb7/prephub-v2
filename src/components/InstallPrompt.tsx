import { useEffect, useState } from 'react'

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>
}

let deferredPrompt: BeforeInstallPromptEvent | null = null
window.addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault()
  deferredPrompt = e as BeforeInstallPromptEvent
})

const isStandalone = () =>
  window.matchMedia('(display-mode: standalone)').matches ||
  // iOS Safari legacy flag
  ('standalone' in navigator && (navigator as { standalone?: boolean }).standalone === true)

const isIOS = () => /iphone|ipad|ipod/i.test(navigator.userAgent)

/**
 * Install card. On iOS, installing is a DATA-INTEGRITY requirement: it exempts
 * the app from Safari's 7-day storage eviction — hence the strong copy.
 */
export function InstallPrompt() {
  const [installed, setInstalled] = useState(isStandalone())
  const [canPrompt, setCanPrompt] = useState(!!deferredPrompt)

  useEffect(() => {
    const onBip = () => setCanPrompt(true)
    const onInstalled = () => setInstalled(true)
    window.addEventListener('beforeinstallprompt', onBip)
    window.addEventListener('appinstalled', onInstalled)
    return () => {
      window.removeEventListener('beforeinstallprompt', onBip)
      window.removeEventListener('appinstalled', onInstalled)
    }
  }, [])

  if (installed) return null

  return (
    <section className="card install-card">
      <h2>Instala PrepHub en tu teléfono</h2>
      {isIOS() ? (
        <>
          <p>
            En iPhone esto es <strong>importante</strong>: si no la instalas, Safari puede borrar
            tus datos guardados tras 7 días sin usarla. Instalada, quedan protegidos.
          </p>
          <ol>
            <li>
              Toca el botón <strong>Compartir</strong> <span aria-hidden="true">(□↑)</span> abajo en Safari.
            </li>
            <li>
              Baja y elige <strong>“Agregar a pantalla de inicio”</strong>.
            </li>
            <li>
              Toca <strong>Agregar</strong>. Listo: PrepHub funciona sin internet.
            </li>
          </ol>
        </>
      ) : (
        <>
          <p>Instalada funciona sin internet, sin tienda de aplicaciones y ocupa menos de 2 MB.</p>
          {canPrompt ? (
            <button
              type="button"
              className="primary"
              onClick={async () => {
                await deferredPrompt?.prompt()
                const choice = await deferredPrompt?.userChoice
                if (choice?.outcome === 'accepted') setInstalled(true)
                deferredPrompt = null
                setCanPrompt(false)
              }}
            >
              Instalar ahora
            </button>
          ) : (
            <p className="dim">
              En Chrome: menú <strong>⋮</strong> → <strong>“Agregar a pantalla principal”</strong>.
            </p>
          )}
        </>
      )}
    </section>
  )
}

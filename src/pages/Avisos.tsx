import { useEffect, useState } from 'react'
import {
  CATEGORY_LABEL,
  SEVERITY_LABEL,
  demoProvider,
  type Alert,
  type AlertCategory,
} from '../data/alerts'
import { ESTADOS } from '../data/estados'
import { getAreas, setAreas } from '../lib/db'
import { relativeTime } from '../lib/time'

const CATEGORY_ICON: Record<AlertCategory, string> = {
  sismo: 'M2 12h3l2.5-6 4 12 3-8 2 4.5L18 12h4',
  tsunami: 'M2 14c2.5 0 2.5-2 5-2s2.5 2 5 2 2.5-2 5-2 2.5 2 5 2M2 19c2.5 0 2.5-2 5-2s2.5 2 5 2 2.5-2 5-2 2.5 2 5 2M14 9A6 6 0 0 0 4 5',
  lluvias: 'M17 9.5a5.5 5.5 0 0 0-10.7-1.4A4.5 4.5 0 0 0 7 17h9.5a4 4 0 0 0 .5-7.5zM8 20l-1 2m5-2-1 2m5-2-1 2',
  deslizamiento: 'M3 20h18M6.5 20 12 8l2.5 5.5L17 9l3 11M9 12l-2-1.5M13 10l2-2',
  servicio: 'M12 3v3m0 12v3m9-9h-3M6 12H3m14.3-6.3-2.1 2.1M8.8 15.2l-2.1 2.1m0-10.6 2.1 2.1m6.4 6.4 2.1 2.1',
}

/**
 * Real area-based push needs a small backend (Cloudflare Worker + web-push,
 * one topic per estado) and stays out of the offline-first core. This button
 * only demonstrates the notification UX with the local demo alert.
 */
async function demoNotification(alert: Alert): Promise<string> {
  if (!('Notification' in window)) return 'Tu navegador no permite notificaciones.'
  const perm = await Notification.requestPermission()
  if (perm !== 'granted') return 'Sin permiso de notificaciones.'
  const reg = await navigator.serviceWorker?.ready
  if (!reg) return 'Servicio no disponible.'
  await reg.showNotification(`DEMO · ${alert.headline}`, {
    body: alert.instruction,
    icon: '/icons/icon-192.png',
    badge: '/icons/icon-192.png',
    lang: 'es',
    tag: 'prephub-demo',
  })
  return 'Notificación de ejemplo enviada.'
}

export function Avisos() {
  const [areas, setAreasState] = useState<string[] | null>(null)
  const [editing, setEditing] = useState(false)
  const [alerts, setAlerts] = useState<Alert[]>([])
  const [expanded, setExpanded] = useState<string | null>(null)
  const [msg, setMsg] = useState('')
  const [simKey, setSimKey] = useState(0) // bump to replay the simulacro

  useEffect(() => {
    getAreas().then((a) => {
      setAreasState(a)
      setEditing(a.length === 0)
    })
  }, [])

  useEffect(() => {
    if (areas && areas.length > 0) {
      // Simulacro replays the full demo scenario regardless of areas.
      demoProvider
        .getActiveAlerts(simKey > 0 ? [] : areas)
        .then((list) => setAlerts([...list].sort((a, b) => b.sent.localeCompare(a.sent))))
    }
  }, [areas, simKey])

  if (areas === null) return null

  const toggleArea = (id: string) => {
    const next = areas.includes(id) ? areas.filter((a) => a !== id) : [...areas, id]
    if (next.length > 3) return
    setAreasState(next)
  }

  if (editing) {
    return (
      <div className="page">
        <header className="page-head">
          <h1>Avisos</h1>
          <p className="dim">
            Elige hasta 3 estados y te mostramos los avisos que los afectan: sismos ocurridos,
            réplicas esperadas y lluvias fuertes.
          </p>
        </header>

        <div className="banner" role="note">
          <strong>Modo demostración</strong> — estos datos no son reales.
        </div>

        <div className="estado-grid" role="group" aria-label="Elige tus estados (máximo 3)">
          {ESTADOS.map((e) => {
            const on = areas.includes(e.id)
            return (
              <button
                key={e.id}
                className={`estado-card${on ? ' on' : ''}`}
                aria-pressed={on}
                onClick={() => toggleArea(e.id)}
              >
                {e.name}
              </button>
            )
          })}
        </div>
        <p className="dim" role="status">
          {areas.length}/3 seleccionados
        </p>
        <button
          className={`primary${areas.length === 0 ? ' pending' : ''}`}
          onClick={async () => {
            if (areas.length === 0) return
            await setAreas(areas)
            setEditing(false)
          }}
        >
          Guardar mis zonas
        </button>
      </div>
    )
  }

  return (
    <div className="page">
      <header className="page-head">
        <h1>Avisos</h1>
        <p className="dim">
          Sismos ocurridos, réplicas esperadas y lluvias en tus zonas. Nunca predicciones: los
          terremotos no se pueden predecir.
        </p>
      </header>

      <div className="banner" role="note">
        <strong>Modo demostración</strong> — estos datos no son reales.
      </div>

      <div className="chip-row">
        {areas.map((a) => (
          <span key={a} className="chip">
            {ESTADOS.find((e) => e.id === a)?.name ?? a}
          </span>
        ))}
        <button className="ghost" onClick={() => setEditing(true)}>
          Cambiar zonas
        </button>
      </div>

      {alerts.map((a, i) => {
        const open = expanded === a.id
        return (
          <article
            key={`${simKey}-${a.id}`}
            className="card alert-card rise-in"
            style={{ animationDelay: `${i * (simKey > 0 ? 500 : 60)}ms` }}
          >
            <button
              type="button"
              className="place-head"
              aria-expanded={open}
              onClick={() => setExpanded(open ? null : a.id)}
            >
              <span className="alert-head">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d={CATEGORY_ICON[a.category]} />
                </svg>
                <span>
                  <span className="dim">
                    {CATEGORY_LABEL[a.category]} · {relativeTime(a.sent)}
                  </span>
                  <strong>{a.headline}</strong>
                </span>
              </span>
            </button>
            <div className="chip-row">
              <span className={`chip sev-${a.severity}`}>{SEVERITY_LABEL[a.severity]}</span>
              <span className="chip demo">DEMO · datos de ejemplo</span>
              <span className="chip">Fuente: {a.source}</span>
            </div>
            {open && (
              <div className="place-detail">
                <p>{a.description}</p>
                <div className="instruction-box">
                  <strong>Qué hacer</strong>
                  <p>{a.instruction}</p>
                </div>
              </div>
            )}
          </article>
        )
      })}
      {alerts.length === 0 && (
        <p className="dim">Sin avisos activos para tus zonas en este momento.</p>
      )}

      <div className="card">
        <h2>Prueba la experiencia</h2>
        <div className="btn-row">
          <button
            onClick={async () => {
              const top = alerts[0]
              if (top) setMsg(await demoNotification(top))
            }}
            disabled={alerts.length === 0}
          >
            Probar notificación
          </button>
          <button onClick={() => setSimKey((k) => k + 1)}>Ver simulacro</button>
        </div>
        {msg && (
          <p className="dim" role="status">
            {msg}
          </p>
        )}
        <p className="dim">
          Las notificaciones reales por zona requieren un servidor y llegarán en una fase
          futura. Esta es una demostración local.
        </p>
      </div>
    </div>
  )
}

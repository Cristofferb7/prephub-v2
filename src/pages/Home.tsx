import { useEffect, useState } from 'react'
import { useLiveQuery } from 'dexie-react-hooks'
import { db, getAreas } from '../lib/db'
import { getFeed } from '../lib/alertsFeed'
import type { Alert } from '../data/alerts'
import { computeScore, nextStep } from '../lib/score'
import { KIT_ITEMS } from '../data/kit'
import { ScoreRing } from '../components/ScoreRing'
import { InstallPrompt } from '../components/InstallPrompt'
import { Link } from '../router'

const itemLabel = (id: string) => KIT_ITEMS.find((i) => i.id === id)?.label ?? id

export function Home() {
  const kitStates = useLiveQuery(() => db.kitItems.toArray(), [], [])
  const plan = useLiveQuery(() => db.plan.get('main'), [])
  const score = computeScore(kitStates ?? [], plan)
  const next = nextStep(kitStates ?? [], plan)
  const [severeAlert, setSevereAlert] = useState<Alert | null>(null)

  useEffect(() => {
    getAreas().then((areas) => {
      if (areas.length === 0) return
      getFeed(areas).then((f) => {
        setSevereAlert(
          f.alerts.find((a) => a.severity === 'severe' || a.severity === 'extreme') ?? null,
        )
      })
    })
  }, [])

  return (
    <div className="page home-grid">
      <section className="score-hero">
        <ScoreRing value={score.total} />
        <p className="dim">
          {score.total === 0 && 'Empieza hoy: 20 minutos bastan para dejar a tu familia preparada.'}
          {score.total > 0 && score.total < 100 && 'Vas bien. Cada paso cuenta cuando tiemble.'}
          {score.total === 100 && 'Familia preparada. Revisa los vencimientos de vez en cuando.'}
        </p>
        {score.total === 0 && (
          <Link to="/kit" className="cta">
            Empezar con el kit →
          </Link>
        )}
        {score.total > 0 && score.total < 100 && next && (
          <Link to={next.to} className="cta">
            Siguiente: {next.label} — {next.minutes} min
          </Link>
        )}
      </section>

      {severeAlert && (
        <div className="banner banner-warn" role="alert">
          <strong>{severeAlert.headline}</strong>{' '}
          {severeAlert.demo && <span className="chip demo">DEMO</span>}{' '}
          <Link to="/avisos">Ver avisos</Link>
        </div>
      )}

      {score.expired.length > 0 && (
        <div className="banner" role="alert">
          <strong>Vencido:</strong> {score.expired.map(itemLabel).join(', ')}.{' '}
          <Link to="/kit">Reponer ahora</Link>
        </div>
      )}
      {score.expiringSoon.length > 0 && (
        <div className="banner">
          <strong>Vence pronto:</strong> {score.expiringSoon.map(itemLabel).join(', ')}.{' '}
          <Link to="/kit">Revisar</Link>
        </div>
      )}

      <Link to="/kit" className="card progress-card">
        <div className="progress-head">
          <h2>Kit de emergencia</h2>
          <span className="pct">{score.kit}%</span>
        </div>
        <div className="bar" role="progressbar" aria-valuenow={score.kit} aria-valuemin={0} aria-valuemax={100} aria-label="Avance del kit">
          <div style={{ width: `${score.kit}%` }} />
        </div>
        <p>Agua, comida, botiquín, linterna, radio, documentos — para 72 horas.</p>
      </Link>

      <Link to="/plan" className="card progress-card">
        <div className="progress-head">
          <h2>Plan familiar</h2>
          <span className="pct">{score.plan}%</span>
        </div>
        <div className="bar" role="progressbar" aria-valuenow={score.plan} aria-valuemin={0} aria-valuemax={100} aria-label="Avance del plan">
          <div style={{ width: `${score.plan}%` }} />
        </div>
        <p>Contactos, puntos de encuentro — para compartir e imprimir.</p>
      </Link>

      <Link to="/cerca" className="card">
        <h2>
          Cerca de ti <span className="chip demo">DEMO</span>
        </h2>
        <p>Refugios y puntos de apoyo: agua, comida, medicinas, techo.</p>
      </Link>

      <Link to="/avisos" className="card">
        <h2>
          Avisos <span className="chip demo">DEMO</span>
        </h2>
        <p>Sismos y lluvias en tu zona — qué pasó y qué hacer.</p>
      </Link>

      <Link to="/guias" className="card">
        <h2>Guías offline</h2>
        <p>Durante el sismo, después, agua segura, primeros auxilios, ¿volver a entrar?, lluvias.</p>
      </Link>

      <InstallPrompt />

      <p className="status">
        Todo queda en tu teléfono. Nada se envía a ningún servidor.{' '}
        <Link to="/fuentes">Fuentes y créditos</Link>
      </p>
    </div>
  )
}

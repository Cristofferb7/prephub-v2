import { useLiveQuery } from 'dexie-react-hooks'
import { db } from '../lib/db'
import { computeScore } from '../lib/score'
import { KIT_ITEMS } from '../data/kit'
import { ScoreRing } from '../components/ScoreRing'
import { InstallPrompt } from '../components/InstallPrompt'
import { Link } from '../router'

const itemLabel = (id: string) => KIT_ITEMS.find((i) => i.id === id)?.label ?? id

export function Home() {
  const kitStates = useLiveQuery(() => db.kitItems.toArray(), [], [])
  const plan = useLiveQuery(() => db.plan.get('main'), [])
  const score = computeScore(kitStates ?? [], plan)

  return (
    <div className="page">
      <section className="score-hero">
        <ScoreRing value={score.total} />
        <p className="dim">
          {score.total === 0 && 'Empieza hoy: 20 minutos bastan para dejar a tu familia preparada.'}
          {score.total > 0 && score.total < 100 && 'Vas bien. Cada paso cuenta cuando tiemble.'}
          {score.total === 100 && 'Familia preparada. Revisa los vencimientos de vez en cuando.'}
        </p>
      </section>

      {score.expired.length > 0 && (
        <div className="banner banner-warn" role="alert">
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

      <Link to="/guias" className="card">
        <h2>Guías offline</h2>
        <p>Durante el sismo, después, agua segura, primeros auxilios, ¿volver a entrar?, lluvias.</p>
      </Link>

      <InstallPrompt />

      <p className="status">Todo queda en tu teléfono. Nada se envía a ningún servidor.</p>
    </div>
  )
}

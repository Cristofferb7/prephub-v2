import { useLiveQuery } from 'dexie-react-hooks'
import { db, requestPersistentStorage } from '../lib/db'
import { CASA_CATEGORIES, CASA_ITEMS } from '../data/casa'
import { casaScore } from '../lib/score'

export function Casa() {
  const states = useLiveQuery(() => db.casaItems.toArray(), [], [])
  const byId = new Map((states ?? []).map((s) => [s.itemId, s]))
  const score = casaScore(states ?? [])

  async function toggle(itemId: string) {
    await db.transaction('rw', db.casaItems, async () => {
      const prev = await db.casaItems.get(itemId)
      await db.casaItems.put({
        itemId,
        checked: prev?.checked === 1 ? 0 : 1,
        updatedAt: new Date().toISOString(),
      })
    })
    void requestPersistentStorage()
  }

  return (
    <div className="page">
      <header className="page-head">
        <h1>Casa segura</h1>
        <p className="dim">
          La mayoría de las heridas en un sismo las causan cosas que caen DENTRO de la casa.
          Una tarde de trabajo evita casi todas. {score}% listo.
        </p>
      </header>

      <div className="kit-sticky no-print">
        <div
          className="bar"
          role="progressbar"
          aria-valuenow={score}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label="Avance de casa segura"
        >
          <div style={{ width: `${score}%` }} />
        </div>
      </div>

      {CASA_CATEGORIES.map((cat, idx) => {
        const items = CASA_ITEMS.filter((i) => i.category === cat)
        const done = items.filter((i) => byId.get(i.id)?.checked === 1).length
        return (
          <section
            key={cat}
            className="kit-group rise-in"
            style={{ animationDelay: `${idx * 40}ms` }}
          >
            <h2>
              {cat} <span className="count">· {done}/{items.length}</span>
            </h2>
            {items.map((item) => {
              const st = byId.get(item.id)
              return (
                <div key={item.id} className={`kit-item${st?.checked ? ' done' : ''}`}>
                  <label className="kit-check">
                    <input
                      type="checkbox"
                      checked={st?.checked === 1}
                      onChange={() => toggle(item.id)}
                    />
                    <span>
                      <strong>{item.label}</strong>
                      {item.detail && <small>{item.detail}</small>}
                    </span>
                  </label>
                </div>
              )
            })}
          </section>
        )
      })}

      <p className="status">
        Basado en Familia Preparada (SENAPRED Chile) y Ready.gov. Hazlo en familia: los
        muchachos que ayudan a asegurar la casa saben qué hacer cuando tiemble.
      </p>
    </div>
  )
}

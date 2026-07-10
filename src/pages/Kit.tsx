import { useLiveQuery } from 'dexie-react-hooks'
import { db, getHouseholdSize, requestPersistentStorage, setHouseholdSize } from '../lib/db'
import { KIT_CATEGORIES, KIT_ITEMS, quantityFor } from '../data/kit'
import { kitScore } from '../lib/score'

export function Kit() {
  const states = useLiveQuery(() => db.kitItems.toArray(), [], [])
  const size = useLiveQuery(getHouseholdSize, [], 1)
  const byId = new Map((states ?? []).map((s) => [s.itemId, s]))
  const score = kitScore(states ?? [])

  async function toggle(itemId: string) {
    const prev = byId.get(itemId)
    await db.kitItems.put({
      itemId,
      checked: prev?.checked === 1 ? 0 : 1,
      expiresAt: prev?.expiresAt,
      updatedAt: new Date().toISOString(),
    })
    void requestPersistentStorage()
  }

  async function setExpiry(itemId: string, expiresAt: string) {
    const prev = byId.get(itemId)
    await db.kitItems.put({
      itemId,
      checked: prev?.checked ?? 0,
      expiresAt: expiresAt || undefined,
      updatedAt: new Date().toISOString(),
    })
  }

  return (
    <div className="page">
      <header className="page-head">
        <h1>Kit de emergencia</h1>
        <p className="dim">
          Lo que tu familia necesita para las primeras 72 horas. {score}% listo.
        </p>
      </header>

      <div className="card household">
        <label htmlFor="hh">¿Cuántas personas viven en tu casa?</label>
        <div className="stepper">
          <button type="button" aria-label="Una persona menos" onClick={() => setHouseholdSize(Math.max(1, size - 1))}>
            −
          </button>
          <output id="hh">{size}</output>
          <button type="button" aria-label="Una persona más" onClick={() => setHouseholdSize(Math.min(20, size + 1))}>
            +
          </button>
        </div>
        <p className="dim">Las cantidades de abajo ya están calculadas para {size} {size === 1 ? 'persona' : 'personas'}.</p>
      </div>

      {KIT_CATEGORIES.map((cat) => (
        <section key={cat} className="kit-group">
          <h2>{cat}</h2>
          {KIT_ITEMS.filter((i) => i.category === cat).map((item) => {
            const st = byId.get(item.id)
            const qty = quantityFor(item, size)
            return (
              <div key={item.id} className={`kit-item${st?.checked ? ' done' : ''}`}>
                <label className="kit-check">
                  <input
                    type="checkbox"
                    checked={st?.checked === 1}
                    onChange={() => toggle(item.id)}
                  />
                  <span>
                    <strong>
                      {item.label}
                      {qty ? ` — ${qty}` : ''}
                    </strong>
                    {item.detail && <small>{item.detail}</small>}
                  </span>
                </label>
                {item.expires && st?.checked === 1 && (
                  <label className="expiry">
                    Vence:
                    <input
                      type="date"
                      value={st?.expiresAt ?? ''}
                      onChange={(e) => setExpiry(item.id, e.target.value)}
                    />
                  </label>
                )}
              </div>
            )
          })}
        </section>
      ))}

      <p className="status">
        No hace falta comprar todo hoy. Marca lo que ya tienes en casa — suele ser más de lo que crees.
      </p>
    </div>
  )
}

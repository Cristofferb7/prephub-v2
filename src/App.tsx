import { useEffect, useState } from 'react'
import { db } from './lib/db'

// Phase-1 shell: proves offline install + Dexie wiring. Real sections land in
// phases 2–7 (see CLAUDE.md build order).
const sections = [
  {
    title: 'Tu puntuación de preparación',
    body: 'Kit + plan en un solo porcentaje. Esta será tu pantalla principal.',
  },
  {
    title: 'Kit de emergencia',
    body: 'Checklist de 72 horas: agua, comida, botiquín, linterna, radio, documentos.',
  },
  {
    title: 'Plan familiar',
    body: 'Contactos, puntos de encuentro y números de emergencia. Para compartir e imprimir.',
  },
  {
    title: 'Guías offline',
    body: 'Durante el sismo, después del sismo, agua segura, primeros auxilios y más.',
  },
]

function App() {
  const [dbReady, setDbReady] = useState(false)

  useEffect(() => {
    db.open()
      .then(() => setDbReady(true))
      .catch((err) => console.error('IndexedDB no disponible', err))
  }, [])

  return (
    <main className="shell">
      <header className="brand">
        <svg width="44" height="44" viewBox="0 0 44 44" aria-hidden="true">
          <rect width="44" height="44" rx="10" fill="var(--surface)" stroke="var(--border)" />
          <path d="M22 8v28M8 22h28" stroke="var(--accent)" strokeWidth="9" />
        </svg>
        <div>
          <h1>PrepHub</h1>
          <p>Preparación ante terremotos, sin internet.</p>
        </div>
      </header>

      <button className="ahora" type="button" aria-label="Modo de emergencia">
        Ahora mismo — emergencia
      </button>

      {sections.map((s) => (
        <section className="card" key={s.title}>
          <h2>{s.title}</h2>
          <p>{s.body}</p>
          <span className="soon">Próximamente</span>
        </section>
      ))}

      <p className="status">
        Todo queda en tu teléfono.{' '}
        {dbReady ? <span className="ok">Almacenamiento local activo.</span> : 'Preparando almacenamiento…'}
      </p>
    </main>
  )
}

export default App

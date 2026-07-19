import { GUIDES, getGuide } from '../data/guides'
import { Link } from '../router'
import { SpeakButton } from '../components/SpeakButton'

export function GuideIndex() {
  return (
    <div className="page">
      <header className="page-head">
        <h1>Guías</h1>
        <p className="dim">Todas funcionan sin internet. Léelas HOY, no durante el sismo.</p>
      </header>
      {GUIDES.map((g) => (
        <Link key={g.id} to={`/guias/${g.id}`} className="card">
          <h2>{g.title}</h2>
          <p>{g.subtitle}</p>
        </Link>
      ))}
    </div>
  )
}

export function GuidePage({ id }: { id: string }) {
  const guide = getGuide(id)
  if (!guide) {
    return (
      <div className="page">
        <p>Esa guía no existe.</p>
        <Link to="/guias">Volver a las guías</Link>
      </div>
    )
  }
  return (
    <div className="page guide">
      <header className="page-head">
        <Link to="/guias" className="back">
          ← Guías
        </Link>
        <h1>{guide.title}</h1>
        <p className="dim">{guide.subtitle}</p>
        <div className="no-print" style={{ marginTop: 12 }}>
          <SpeakButton
            text={[
              guide.title,
              ...guide.sections.flatMap((sec) => [sec.heading + '.', ...sec.steps]),
            ].join(' ')}
          />
        </div>
      </header>

      {guide.sections.map((s) => (
        <section key={s.heading} className="card">
          <h2>{s.heading}</h2>
          <ol>
            {s.steps.map((step, i) => (
              <li key={i}>{step}</li>
            ))}
          </ol>
          {s.warning && (
            <p className="banner" role="note">
              ⚠ {s.warning}
            </p>
          )}
        </section>
      ))}

      <footer className="guide-sources">
        <h2>Adaptado de</h2>
        <ul>
          {guide.sources.map((src) => (
            <li key={src.label}>{src.label}</li>
          ))}
        </ul>
        <p className="dim">
          Contenido educativo adaptado de fuentes oficiales (ver <Link to="/fuentes">Fuentes</Link>).
          En una emergencia, sigue las instrucciones de las autoridades locales.
        </p>
      </footer>
    </div>
  )
}

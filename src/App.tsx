import { Link, RouterProvider, usePath } from './router'
import { Home } from './pages/Home'
import { Kit } from './pages/Kit'
import { Plan } from './pages/Plan'
import { GuideIndex, GuidePage } from './pages/Guias'
import { Ahora } from './pages/Ahora'
import { Fuentes } from './pages/Fuentes'

const NAV = [
  { to: '/', label: 'Inicio' },
  { to: '/kit', label: 'Kit' },
  { to: '/plan', label: 'Plan' },
  { to: '/guias', label: 'Guías' },
  { to: '/fuentes', label: 'Fuentes' },
]

function Screen() {
  const path = usePath()
  if (path === '/kit') return <Kit />
  if (path === '/plan') return <Plan />
  if (path === '/guias') return <GuideIndex />
  if (path.startsWith('/guias/')) return <GuidePage id={path.slice('/guias/'.length)} />
  if (path === '/fuentes') return <Fuentes />
  return <Home />
}

function Shell() {
  const path = usePath()

  // Emergency mode gets its own gear: no header, no nav, nothing else.
  if (path === '/ahora') return <Ahora />

  return (
    <div className="shell">
      <header className="topbar no-print">
        <Link to="/" className="brand" aria-label="PrepHub, inicio">
          <svg width="34" height="34" viewBox="0 0 44 44" aria-hidden="true">
            <rect width="44" height="44" rx="10" fill="var(--surface)" stroke="var(--border)" />
            <path d="M22 8v28M8 22h28" stroke="var(--accent)" strokeWidth="9" />
          </svg>
          <strong>PrepHub</strong>
        </Link>
        <Link to="/ahora" className="ahora-pill">
          Ahora mismo
        </Link>
      </header>

      <Screen />

      <nav className="bottom-nav no-print" aria-label="Navegación principal">
        {NAV.map((n) => (
          <Link
            key={n.to}
            to={n.to}
            aria-current={
              path === n.to || (n.to !== '/' && path.startsWith(n.to)) ? 'page' : undefined
            }
          >
            {n.label}
          </Link>
        ))}
      </nav>
    </div>
  )
}

export default function App() {
  return (
    <RouterProvider>
      <Shell />
    </RouterProvider>
  )
}

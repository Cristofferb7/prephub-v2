import type { ReactNode } from 'react'
import { Link, RouterProvider, usePath } from './router'
import { Home } from './pages/Home'
import { Kit } from './pages/Kit'
import { Plan } from './pages/Plan'
import { GuideIndex, GuidePage } from './pages/Guias'
import { Ahora } from './pages/Ahora'
import { Fuentes } from './pages/Fuentes'
import { ThemeToggle } from './components/ThemeToggle'

const ICO = {
  size: 24,
  common: {
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 2,
    strokeLinecap: 'round',
    strokeLinejoin: 'round',
  } as const,
}

function Ico({ children }: { children: ReactNode }) {
  return (
    <svg width={ICO.size} height={ICO.size} viewBox="0 0 24 24" {...ICO.common} aria-hidden="true">
      {children}
    </svg>
  )
}

const NAV: { to: string; label: string; icon: ReactNode }[] = [
  {
    to: '/',
    label: 'Inicio',
    icon: (
      <Ico>
        <path d="M3.5 11 12 4l8.5 7" />
        <path d="M6 9.5V20h12V9.5" />
        <path d="M10 20v-5h4v5" />
      </Ico>
    ),
  },
  {
    to: '/kit',
    label: 'Kit',
    icon: (
      <Ico>
        <rect x="3.5" y="7.5" width="17" height="12.5" rx="2.5" />
        <path d="M9 7.5V6a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v1.5" />
        <path d="M12 11v5M9.5 13.5h5" />
      </Ico>
    ),
  },
  {
    to: '/plan',
    label: 'Plan',
    icon: (
      <Ico>
        <circle cx="9" cy="8.5" r="3.2" />
        <path d="M3.5 19.5c0-3.1 2.4-5.2 5.5-5.2s5.5 2.1 5.5 5.2" />
        <circle cx="16.8" cy="9.8" r="2.4" />
        <path d="M16.6 14.6c2.4.3 3.9 2 3.9 4.4" />
      </Ico>
    ),
  },
  {
    to: '/guias',
    label: 'Guías',
    icon: (
      <Ico>
        <path d="M4 19.2A2.8 2.8 0 0 1 6.8 16.4H20" />
        <path d="M6.8 3H20v18H6.8A2.8 2.8 0 0 1 4 18.2V5.8A2.8 2.8 0 0 1 6.8 3z" />
      </Ico>
    ),
  },
  {
    to: '/ahora',
    label: 'Ahora',
    icon: (
      <Ico>
        <path d="M12 3.5 21.5 20h-19z" />
        <path d="M12 10v4.5" />
        <path d="M12 17.3h.01" />
      </Ico>
    ),
  },
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
        <div className="topbar-actions">
          <ThemeToggle />
          <Link to="/ahora" className="ahora-pill">
            Ahora mismo
          </Link>
        </div>
      </header>

      <Screen />

      <nav className="bottom-nav no-print" aria-label="Navegación principal">
        {NAV.map((n) => (
          <Link
            key={n.to}
            to={n.to}
            className={n.to === '/ahora' ? 'nav-emergency' : undefined}
            aria-current={
              path === n.to || (n.to !== '/' && path.startsWith(n.to)) ? 'page' : undefined
            }
          >
            <span className="nav-ico">{n.icon}</span>
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

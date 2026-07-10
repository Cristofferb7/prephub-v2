import { useState } from 'react'

type Theme = 'dark' | 'light'
const THEME_COLORS: Record<Theme, string> = { dark: '#0b1220', light: '#f2f5f9' }

function currentTheme(): Theme {
  return document.documentElement.getAttribute('data-theme') === 'light' ? 'light' : 'dark'
}

export function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>(currentTheme)
  const next: Theme = theme === 'dark' ? 'light' : 'dark'

  const toggle = () => {
    document.documentElement.setAttribute('data-theme', next)
    try {
      localStorage.setItem('ph-theme', next)
    } catch {
      /* private mode: theme just won't persist */
    }
    document
      .querySelector('meta[name="theme-color"]')
      ?.setAttribute('content', THEME_COLORS[next])
    setTheme(next)
  }

  const label = next === 'light' ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'

  return (
    <button className="theme-toggle" onClick={toggle} aria-label={label} title={label}>
      {theme === 'dark' ? (
        // sun: tap for light mode
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
          <circle cx="12" cy="12" r="4" />
          <path d="M12 2v2.5M12 19.5V22M2 12h2.5M19.5 12H22M4.9 4.9l1.8 1.8M17.3 17.3l1.8 1.8M19.1 4.9l-1.8 1.8M6.7 17.3l-1.8 1.8" />
        </svg>
      ) : (
        // moon: tap for dark mode
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z" />
        </svg>
      )}
    </button>
  )
}

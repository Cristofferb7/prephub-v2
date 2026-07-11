import { useState } from 'react'
import { ThemeToggle } from '../components/ThemeToggle'
import { Link } from '../router'

const TEXT_LEVELS = [-1, 0, 1, 2, 3] as const
type TextLevel = (typeof TEXT_LEVELS)[number]
const TEXT_LABELS: Record<TextLevel, string> = {
  '-1': 'Pequeño',
  0: 'Normal',
  1: 'Grande',
  2: 'Muy grande',
  3: 'Enorme',
}

const root = () => document.documentElement

function readText(): TextLevel {
  const v = Number(root().getAttribute('data-text') ?? 0)
  return (TEXT_LEVELS as readonly number[]).includes(v) ? (v as TextLevel) : 0
}

function persist(key: string, value: string | null) {
  try {
    if (value === null) localStorage.removeItem(key)
    else localStorage.setItem(key, value)
  } catch {
    /* private mode */
  }
}

export function Ajustes() {
  const [text, setText] = useState<TextLevel>(readText)
  const [bold, setBold] = useState(() => root().getAttribute('data-bold') === '1')
  const [contrast, setContrast] = useState(() => root().getAttribute('data-contrast') === 'high')

  const applyText = (level: TextLevel) => {
    if (level === 0) {
      root().removeAttribute('data-text')
      persist('ph-text', null)
    } else {
      root().setAttribute('data-text', String(level))
      persist('ph-text', String(level))
    }
    setText(level)
  }

  const applyBold = (on: boolean) => {
    if (on) root().setAttribute('data-bold', '1')
    else root().removeAttribute('data-bold')
    persist('ph-bold', on ? '1' : null)
    setBold(on)
  }

  const applyContrast = (on: boolean) => {
    if (on) root().setAttribute('data-contrast', 'high')
    else root().removeAttribute('data-contrast')
    persist('ph-contrast', on ? 'high' : null)
    setContrast(on)
  }

  const idx = TEXT_LEVELS.indexOf(text)

  return (
    <div className="page">
      <header className="page-head">
        <h1>Pantalla y texto</h1>
        <p className="dim">Ajusta la app a tu vista. Los cambios se guardan en tu teléfono.</p>
      </header>

      <section className="card">
        <div className="setting-row">
          <div>
            <strong>Tema</strong>
            <p className="hint">Oscuro ahorra batería; claro se ve mejor bajo el sol.</p>
          </div>
          <ThemeToggle />
        </div>

        <div className="setting-row">
          <div>
            <strong>Tamaño del texto</strong>
            <p className="hint">Hazlo tan grande como necesites.</p>
          </div>
          <div className="stepper-mini">
            <button
              onClick={() => applyText(TEXT_LEVELS[Math.max(0, idx - 1)])}
              disabled={idx === 0}
              aria-label="Texto más pequeño"
            >
              A−
            </button>
            <output aria-live="polite">{TEXT_LABELS[text]}</output>
            <button
              onClick={() => applyText(TEXT_LEVELS[Math.min(TEXT_LEVELS.length - 1, idx + 1)])}
              disabled={idx === TEXT_LEVELS.length - 1}
              aria-label="Texto más grande"
            >
              A+
            </button>
          </div>
        </div>

        <div className="setting-row">
          <div>
            <strong>Texto en negrita</strong>
            <p className="hint">Letras más gruesas, más fáciles de leer.</p>
          </div>
          <input
            type="checkbox"
            checked={bold}
            onChange={(e) => applyBold(e.target.checked)}
            aria-label="Activar texto en negrita"
          />
        </div>

        <div className="setting-row">
          <div>
            <strong>Contraste alto</strong>
            <p className="hint">Bordes y textos más marcados.</p>
          </div>
          <input
            type="checkbox"
            checked={contrast}
            onChange={(e) => applyContrast(e.target.checked)}
            aria-label="Activar contraste alto"
          />
        </div>
      </section>

      <section className="card">
        <div className="setting-row">
          <div>
            <strong>Mis zonas</strong>
            <p className="hint">Los estados que sigues en Avisos.</p>
          </div>
          <Link to="/avisos" className="btn-link">
            Cambiar
          </Link>
        </div>
      </section>

      <section className="card">
        <h2>Vista previa</h2>
        <p>
          Guarda 4 litros de agua por persona por día. <strong>Revisa la fecha de vencimiento
          cada 6 meses.</strong>
        </p>
      </section>
    </div>
  )
}

import { useRef, useState } from 'react'
import { exportData, importData } from '../lib/exportImport'
import { InstallPrompt } from '../components/InstallPrompt'

const SOURCES = [
  {
    name: 'FEMA / Ready.gov (EE. UU.)',
    note: 'Preparación ante terremotos, kit y plan familiar (P-1095). Dominio público.',
    url: 'https://www.ready.gov/es',
  },
  {
    name: 'Great ShakeOut — terremotos.org',
    note: '“Agáchese, cúbrase y sujétese” y sus variantes por situación.',
    url: 'https://www.terremotos.org',
  },
  {
    name: 'OPS / PAHO',
    note: 'Agua segura, salud en emergencias. Licencia CC BY-NC-SA 3.0 IGO.',
    url: 'https://www.paho.org',
  },
  {
    name: 'FUNVISIS (Venezuela)',
    note: 'Manual de Autoprotección. Investigación sismológica venezolana.',
    url: 'http://www.funvisis.gob.ve',
  },
  {
    name: 'CENAPRED (México)',
    note: 'Qué hacer en caso de sismo; revisión de la vivienda tras el sismo.',
    url: 'https://www.cenapred.gob.mx',
  },
  {
    name: 'SENAPRED (Chile)',
    note: 'Método “Familia Preparada”, regla de las 72 horas.',
    url: 'https://senapred.cl/familia-preparada/',
  },
  {
    name: 'Cruz Roja / CICR — Restoring Family Links',
    note: 'Para buscar familiares desaparecidos: familylinks.icrc.org (las autoridades llevan la búsqueda oficial).',
    url: 'https://familylinks.icrc.org',
  },
]

export function Fuentes() {
  const fileRef = useRef<HTMLInputElement>(null)
  const [msg, setMsg] = useState('')

  return (
    <div className="page">
      <header className="page-head">
        <h1>Fuentes y tus datos</h1>
      </header>

      <section className="card">
        <h2>Tu privacidad</h2>
        <p>
          <strong>Todo queda en tu teléfono.</strong> PrepHub no tiene servidor, no tiene cuentas y
          no envía nada a internet. Tu plan familiar solo sale de aquí cuando TÚ lo compartes,
          imprimes o exportas.
        </p>
      </section>

      <section className="card">
        <h2>Respaldo de tus datos</h2>
        <p className="dim">
          Guarda un archivo con tu kit y tu plan (por si cambias de teléfono), o restaura uno.
        </p>
        <div className="btn-row">
          <button
            type="button"
            className="primary"
            onClick={async () => {
              const r = await exportData()
              setMsg(
                r === 'shared'
                  ? 'Respaldo compartido.'
                  : r === 'downloaded'
                    ? 'Respaldo descargado. Guárdalo donde no se pierda (correo, Drive…).'
                    : '',
              )
            }}
          >
            Exportar respaldo
          </button>
          <button type="button" onClick={() => fileRef.current?.click()}>
            Importar respaldo
          </button>
        </div>
        <input
          ref={fileRef}
          type="file"
          accept="application/json"
          hidden
          onChange={async (e) => {
            const f = e.target.files?.[0]
            if (!f) return
            const res = await importData(f)
            setMsg(res.ok ? 'Respaldo restaurado.' : (res.error ?? 'No se pudo importar.'))
            e.target.value = ''
          }}
        />
        {msg && <p className="dim" role="status">{msg}</p>}
      </section>

      <InstallPrompt />

      <section className="card">
        <h2>Fuentes oficiales</h2>
        <p className="dim">
          El contenido de PrepHub está adaptado y sintetizado de estos organismos. No es material
          oficial de ninguno de ellos ni implica su respaldo.{' '}
          <strong>En una emergencia, sigue siempre las instrucciones de las autoridades locales.</strong>
        </p>
        <ul className="sources">
          {SOURCES.map((s) => (
            <li key={s.name}>
              <strong>{s.name}</strong>
              <br />
              {s.note}
              <br />
              <span className="dim">{s.url}</span>
            </li>
          ))}
        </ul>
      </section>

      <section className="card">
        <h2>Sobre PrepHub</h2>
        <p className="dim">
          Hecho por Cristoffer Bohórquez tras los terremotos del 24 de junio de 2026 en Venezuela.
          PrepHub no emite alertas sísmicas — prepara antes, para que el momento no te agarre sin
          plan. Es gratis y funciona sin internet para siempre.
        </p>
      </section>
    </div>
  )
}

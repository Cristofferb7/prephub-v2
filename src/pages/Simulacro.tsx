import { useEffect, useRef, useState } from 'react'
import { db } from '../lib/db'
import { downloadDrillReminder } from '../lib/ics'
import { Link } from '../router'

// Simulacro familiar — practicar es lo único que vuelve automática la
// reacción (doctrina ShakeOut/SkyAlert: los simulacros salvan vidas).
// Fases con reloj gigante + vibración; al final, conversación en familia.

const PHASES = [
  {
    id: 'agachate',
    title: 'AGÁCHATE',
    body: 'Al piso, en cuatro puntos. ¡Ya!',
    seconds: 10,
  },
  {
    id: 'cubrete',
    title: 'CÚBRETE',
    body: 'Bajo la mesa o contra pared interior. Protege cabeza y cuello.',
    seconds: 10,
  },
  {
    id: 'sujetate',
    title: 'SUJÉTATE',
    body: 'Quédate ahí. Un sismo fuerte dura más de lo que crees.',
    seconds: 60,
  },
] as const

const DEBRIEF = [
  '¿Todos llegaron a su sitio seguro en menos de 10 segundos?',
  '¿Alguien tuvo que cruzar cerca de ventanas o cosas que caen?',
  '¿Los más pequeños saben hacerlo sin ayuda?',
  '¿Saben todos qué hacer JUSTO después? (zapatos, gas, mensaje al contacto)',
  '¿El sitio seguro de cada cuarto sigue siendo el mejor?',
]

type Stage = 'intro' | 'drill' | 'debrief'

export function Simulacro() {
  const [stage, setStage] = useState<Stage>('intro')
  const [phase, setPhase] = useState(0)
  const [left, setLeft] = useState(0)
  const [checks, setChecks] = useState<boolean[]>(DEBRIEF.map(() => false))
  const timer = useRef<ReturnType<typeof setInterval>>(undefined)

  const start = () => {
    setStage('drill')
    setPhase(0)
    setLeft(PHASES[0].seconds)
  }

  useEffect(() => {
    if (stage !== 'drill') return
    navigator.vibrate?.(200)
    timer.current = setInterval(() => {
      setLeft((l) => {
        if (l > 1) return l - 1
        // phase finished
        setPhase((p) => {
          const next = p + 1
          if (next >= PHASES.length) {
            clearInterval(timer.current)
            setStage('debrief')
            navigator.vibrate?.([200, 100, 200])
            db.settings.put({ key: 'lastDrillAt', value: new Date().toISOString() })
            return p
          }
          navigator.vibrate?.(200)
          setLeft(PHASES[next].seconds)
          return next
        })
        return 0
      })
    }, 1000)
    return () => clearInterval(timer.current)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stage])

  if (stage === 'drill') {
    const p = PHASES[phase]
    return (
      <div className="page drill-mode" aria-live="assertive">
        <p className="dim drill-step">
          Paso {phase + 1} de {PHASES.length}
        </p>
        <h1>{p.title}</h1>
        <p className="drill-body">{p.body}</p>
        <output className="drill-clock">{left}</output>
        <button
          type="button"
          className="ghost"
          onClick={() => {
            clearInterval(timer.current)
            setStage('intro')
          }}
        >
          Detener
        </button>
      </div>
    )
  }

  if (stage === 'debrief') {
    return (
      <div className="page">
        <header className="page-head">
          <h1>¡Lo lograron! 🎉</h1>
          <p className="dim">
            Ahora la parte importante: conversen 2 minutos. Marquen lo que salió bien.
          </p>
        </header>
        <section className="card">
          {DEBRIEF.map((q, i) => (
            <div key={i} className="kit-item">
              <label className="kit-check">
                <input
                  type="checkbox"
                  checked={checks[i]}
                  onChange={() =>
                    setChecks((c) => c.map((v, j) => (j === i ? !v : v)))
                  }
                />
                <span>{q}</span>
              </label>
            </div>
          ))}
          <p className="dim">
            Lo que no marcaron es la tarea para el próximo simulacro. Revisa{' '}
            <Link to="/casa">Casa segura</Link> si algo cayó o estorbó.
          </p>
        </section>
        <div className="btn-row">
          <button type="button" className="primary" onClick={start}>
            Repetir
          </button>
          <button type="button" onClick={downloadDrillReminder}>
            Recordar cada 6 meses (.ics)
          </button>
        </div>
        <p className="status">
          <Link to="/">Volver al inicio</Link>
        </p>
      </div>
    )
  }

  return (
    <div className="page">
      <header className="page-head">
        <h1>Simulacro familiar</h1>
        <p className="dim">
          Tres minutos, toda la familia. Cuando tiembla de verdad no hay tiempo de pensar —
          solo sale lo que se practicó.
        </p>
      </header>

      <section className="card">
        <h2>Cómo funciona</h2>
        <ol>
          <li>Reúne a todos. Cada quien cerca de su sitio seguro de siempre.</li>
          <li>Al empezar, la pantalla y la vibración marcan cada paso: Agáchate, Cúbrete, Sujétate.</li>
          <li>Al final, 2 minutos de conversación: qué salió bien y qué toca arreglar.</li>
        </ol>
        <p className="dim">
          Si alguien usa silla de ruedas o andadera: frena, agáchate lo posible y cubre cabeza
          y cuello — el simulacro también es para practicar eso.
        </p>
      </section>

      <button type="button" className="primary cta-btn" onClick={start}>
        Empezar simulacro
      </button>

      <p className="status">
        Recomendado cada 6 meses, y siempre que cambien de casa. Ideal antes de la temporada
        de lluvias.
      </p>
    </div>
  )
}

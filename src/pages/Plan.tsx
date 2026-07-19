import { useEffect, useRef, useState } from 'react'
import { renderSVG } from 'uqr'
import { db, emptyPlan, requestPersistentStorage, type FamilyPlan, type PlanMember } from '../lib/db'
import { planToText, sharePlan } from '../lib/share'

const emptyMember = (): PlanMember => ({
  name: '',
  phone: '',
  medicalNeeds: '',
  daytimePlace: '',
  pickupPolicy: '',
})

const STEPS = [
  '¿Quiénes son?',
  'Contacto fuera de la ciudad',
  'Contacto fuera del país',
  'Puntos de encuentro',
  'Números de emergencia',
  'Tu plan está listo',
] as const

const filled = (s: string) => s.trim().length > 0

function stepValid(step: number, plan: FamilyPlan): boolean {
  switch (step) {
    case 0:
      return plan.members.length > 0 && plan.members.every((m) => filled(m.name))
    case 1:
      return filled(plan.outOfTownContact.name) && filled(plan.outOfTownContact.phone)
    case 2:
      return filled(plan.outOfCountryContact.name) && filled(plan.outOfCountryContact.phone)
    case 3:
      return (
        filled(plan.meetingPoints.indoor) &&
        filled(plan.meetingPoints.neighborhood) &&
        filled(plan.meetingPoints.outsideNeighborhood) &&
        filled(plan.meetingPoints.outOfTown)
      )
    case 4:
      return plan.localNumbers.some((n) => filled(n.number) && n.number !== '911')
    default:
      return true
  }
}

export function Plan() {
  const [plan, setPlan] = useState<FamilyPlan | null>(null)
  const [step, setStep] = useState(0)
  const [showQR, setShowQR] = useState(false)
  const [printMode, setPrintMode] = useState<'plan' | 'door'>('plan')
  const [shareMsg, setShareMsg] = useState('')
  const saveTimer = useRef<ReturnType<typeof setTimeout>>(undefined)

  useEffect(() => {
    db.plan.get('main').then((p) => setPlan(p ?? emptyPlan()))
  }, [])

  // First step always shows at least one person to fill in.
  useEffect(() => {
    if (plan && step === 0 && plan.members.length === 0) {
      setPlan({ ...plan, members: [emptyMember()] })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [plan?.members.length, step])

  // Autosave (debounced) — a form abandoned mid-fill must still survive.
  const pendingSave = useRef<FamilyPlan | null>(null)
  function update(next: FamilyPlan) {
    next.updatedAt = new Date().toISOString()
    setPlan({ ...next })
    pendingSave.current = next
    clearTimeout(saveTimer.current)
    saveTimer.current = setTimeout(() => {
      pendingSave.current = null
      db.plan.put(next)
      void requestPersistentStorage()
    }, 400)
  }

  // Android kills backgrounded PWAs aggressively — flush the last keystrokes
  // the moment the app is hidden, not 400 ms later.
  useEffect(() => {
    const flush = () => {
      if (pendingSave.current) {
        db.plan.put(pendingSave.current)
        pendingSave.current = null
        clearTimeout(saveTimer.current)
      }
    }
    document.addEventListener('visibilitychange', flush)
    window.addEventListener('pagehide', flush)
    return () => {
      flush()
      document.removeEventListener('visibilitychange', flush)
      window.removeEventListener('pagehide', flush)
    }
  }, [])

  if (!plan) return null

  const setMember = (i: number, patch: Partial<PlanMember>) => {
    const members = plan.members.map((m, j) => (j === i ? { ...m, ...patch } : m))
    update({ ...plan, members })
  }

  const goTo = (s: number) => {
    setStep(Math.max(0, Math.min(STEPS.length - 1, s)))
    window.scrollTo(0, 0)
    // Move focus (and the screen-reader announcement) to the new step label.
    requestAnimationFrame(() => document.getElementById('wizard-step-label')?.focus())
  }

  const valid = stepValid(step, plan)
  const last = step === STEPS.length - 1

  return (
    <div className="page wizard-page">
      <header className="page-head no-print">
        <h1>Plan familiar</h1>
        <div
          className="wizard-bar"
          role="progressbar"
          aria-valuenow={step + 1}
          aria-valuemin={1}
          aria-valuemax={STEPS.length}
          aria-label={`Paso ${step + 1} de ${STEPS.length}`}
        >
          {STEPS.map((_, i) => (
            <span key={i} className={i < step ? 'done' : i === step ? 'current' : ''} />
          ))}
        </div>
        <p className="dim" id="wizard-step-label" tabIndex={-1}>
          Paso {step + 1} de {STEPS.length} · {STEPS[step]}
        </p>
      </header>

      {step === 0 && (
        <section className="card no-print">
          <h2>¿Quiénes viven en tu casa?</h2>
          <p className="dim">Se guarda solo mientras escribes — puedes volver cuando quieras.</p>
          {plan.members.map((m, i) => (
            <fieldset key={i} className="member">
              <legend>Persona {i + 1}</legend>
              <label>
                Nombre
                <input value={m.name} onChange={(e) => setMember(i, { name: e.target.value })} />
              </label>
              <label>
                Teléfono
                <input type="tel" value={m.phone} onChange={(e) => setMember(i, { phone: e.target.value })} />
              </label>
              <label>
                Condición médica o medicinas (si aplica)
                <input
                  value={m.medicalNeeds}
                  placeholder="ej: hipertensa — losartán"
                  onChange={(e) => setMember(i, { medicalNeeds: e.target.value })}
                />
              </label>
              <label>
                ¿Dónde pasa el día? (colegio, trabajo…)
                <input value={m.daytimePlace} onChange={(e) => setMember(i, { daytimePlace: e.target.value })} />
              </label>
              <label>
                ¿Quién lo retira o a dónde va si se separan?
                <input value={m.pickupPolicy} onChange={(e) => setMember(i, { pickupPolicy: e.target.value })} />
              </label>
              {plan.members.length > 1 && (
                <button
                  type="button"
                  className="ghost"
                  onClick={() => update({ ...plan, members: plan.members.filter((_, j) => j !== i) })}
                >
                  Quitar
                </button>
              )}
            </fieldset>
          ))}
          <button
            type="button"
            onClick={() => update({ ...plan, members: [...plan.members, emptyMember()] })}
          >
            + Agregar persona
          </button>
        </section>
      )}

      {step === 1 && (
        <section className="card no-print">
          <h2>Contacto fuera de la ciudad</h2>
          <p className="dim">
            Tras un sismo, llamar dentro de la zona casi nunca funciona — pero un mensaje hacia
            afuera sí suele pasar. Todos avisan al mismo contacto.
          </p>
          <label>
            Nombre
            <input
              value={plan.outOfTownContact.name}
              onChange={(e) => update({ ...plan, outOfTownContact: { ...plan.outOfTownContact, name: e.target.value } })}
            />
          </label>
          <label>
            Teléfono
            <input
              type="tel"
              value={plan.outOfTownContact.phone}
              onChange={(e) => update({ ...plan, outOfTownContact: { ...plan.outOfTownContact, phone: e.target.value } })}
            />
          </label>
          <label>
            Ciudad
            <input
              value={plan.outOfTownContact.place}
              onChange={(e) => update({ ...plan, outOfTownContact: { ...plan.outOfTownContact, place: e.target.value } })}
            />
          </label>
        </section>
      )}

      {step === 2 && (
        <section className="card no-print">
          <h2>Contacto fuera del país</h2>
          <p className="dim">
            Con las redes locales caídas o bloqueadas, el familiar en el exterior suele ser el
            único al que todos pueden escribirle.
          </p>
          <label>
            Nombre
            <input
              value={plan.outOfCountryContact.name}
              onChange={(e) => update({ ...plan, outOfCountryContact: { ...plan.outOfCountryContact, name: e.target.value } })}
            />
          </label>
          <label>
            Teléfono (con código de país)
            <input
              type="tel"
              placeholder="+1 …"
              value={plan.outOfCountryContact.phone}
              onChange={(e) => update({ ...plan, outOfCountryContact: { ...plan.outOfCountryContact, phone: e.target.value } })}
            />
          </label>
          <label>
            País
            <input
              value={plan.outOfCountryContact.place}
              onChange={(e) => update({ ...plan, outOfCountryContact: { ...plan.outOfCountryContact, place: e.target.value } })}
            />
          </label>
        </section>
      )}

      {step === 3 && (
        <section className="card no-print">
          <h2>¿Dónde se encuentran?</h2>
          <p className="dim">Cuatro niveles: de lo más cercano a evacuar la ciudad.</p>
          <label>
            1 · Dentro de la casa (sitio seguro)
            <input
              placeholder="ej: bajo la mesa del comedor, lejos de ventanas"
              value={plan.meetingPoints.indoor}
              onChange={(e) => update({ ...plan, meetingPoints: { ...plan.meetingPoints, indoor: e.target.value } })}
            />
          </label>
          <label>
            2 · En el sector, si hay que salir de la casa
            <input
              placeholder="ej: la cancha de la urbanización"
              value={plan.meetingPoints.neighborhood}
              onChange={(e) => update({ ...plan, meetingPoints: { ...plan.meetingPoints, neighborhood: e.target.value } })}
            />
          </label>
          <label>
            3 · Fuera del sector, si no se puede llegar
            <input
              placeholder="ej: casa de la tía en otra parroquia"
              value={plan.meetingPoints.outsideNeighborhood}
              onChange={(e) =>
                update({ ...plan, meetingPoints: { ...plan.meetingPoints, outsideNeighborhood: e.target.value } })
              }
            />
          </label>
          <label>
            4 · Fuera de la ciudad, si hay que evacuar
            <input
              placeholder="ej: casa de los abuelos en Valencia"
              value={plan.meetingPoints.outOfTown}
              onChange={(e) => update({ ...plan, meetingPoints: { ...plan.meetingPoints, outOfTown: e.target.value } })}
            />
          </label>
        </section>
      )}

      {step === 4 && (
        <section className="card no-print">
          <h2>Números de emergencia</h2>
          <p className="dim">
            El 911 funciona en todo el país. Busca y verifica tú mismo los números locales de tu
            estado — anótalos aquí para tenerlos sin internet.
          </p>
          {plan.localNumbers.map((n, i) => (
            <label key={i}>
              {n.label}
              <input
                type="tel"
                value={n.number}
                onChange={(e) => {
                  const localNumbers = plan.localNumbers.map((x, j) =>
                    j === i ? { ...x, number: e.target.value } : x,
                  )
                  update({ ...plan, localNumbers })
                }}
              />
            </label>
          ))}
        </section>
      )}

      {last && (
        <>
          <section className="card scale-in no-print">
            <h2>Tu plan está listo 🎉</h2>
            <p className="dim">
              Revísalo, compártelo y pega una copia impresa en la nevera y otra en el kit. El
              papel no se queda sin batería.
            </p>
            <div className="btn-row">
              <button
                type="button"
                className="primary"
                onClick={async () => {
                  const result = await sharePlan(plan)
                  setShareMsg(
                    result === 'copied'
                      ? 'Texto copiado — pégalo en WhatsApp.'
                      : result === 'failed'
                        ? 'No se pudo compartir. Usa Imprimir o el código QR.'
                        : '',
                  )
                }}
              >
                Compartir por WhatsApp
              </button>
              <button
                type="button"
                onClick={() => {
                  setPrintMode('plan')
                  setTimeout(() => window.print(), 60)
                }}
              >
                Imprimir plan
              </button>
              <button
                type="button"
                onClick={() => {
                  setPrintMode('door')
                  setTimeout(() => window.print(), 60)
                }}
              >
                Cartel para la puerta
              </button>
              <button type="button" onClick={() => setShowQR((v) => !v)}>
                {showQR ? 'Ocultar QR' : 'Código QR'}
              </button>
            </div>
            {shareMsg && <p className="dim" role="status">{shareMsg}</p>}
            {showQR && (
              <div
                className="qr"
                aria-label="Código QR con el plan familiar"
                dangerouslySetInnerHTML={{ __html: renderSVG(planToText(plan), { border: 2 }) }}
              />
            )}
          </section>

          <section className="card no-print">
            <h2>Resumen</h2>
            {[
              {
                label: 'Familia',
                value: plan.members.map((m) => m.name).filter(filled).join(', ') || 'Sin llenar',
                s: 0,
              },
              {
                label: 'Fuera de la ciudad',
                value: plan.outOfTownContact.name || 'Sin llenar',
                s: 1,
              },
              {
                label: 'Fuera del país',
                value: plan.outOfCountryContact.name || 'Sin llenar',
                s: 2,
              },
              {
                label: 'Puntos de encuentro',
                value:
                  [plan.meetingPoints.indoor, plan.meetingPoints.neighborhood, plan.meetingPoints.outsideNeighborhood, plan.meetingPoints.outOfTown].filter(filled).length + ' de 4',
                s: 3,
              },
              {
                label: 'Números locales',
                value:
                  plan.localNumbers.filter((n) => filled(n.number)).length + ' anotados',
                s: 4,
              },
            ].map((row) => (
              <div key={row.label} className="summary-row">
                <div>
                  <strong>{row.label}</strong>
                  <p className="dim">{row.value}</p>
                </div>
                <button type="button" className="ghost" onClick={() => goTo(row.s)}>
                  Editar
                </button>
              </div>
            ))}
          </section>
        </>
      )}

      <div className="wizard-nav no-print">
        <button type="button" className="ghost back" onClick={() => goTo(step - 1)} disabled={step === 0}>
          ← Atrás
        </button>
        {!last && (
          <button
            type="button"
            className={`primary next${valid ? '' : ' pending'}`}
            aria-label={valid ? undefined : 'Siguiente — aún faltan datos en este paso'}
            onClick={() => goTo(step + 1)}
          >
            {step === STEPS.length - 2 ? 'Ver resumen' : 'Siguiente'}
          </button>
        )}
      </div>

      {/* Print-only content */}
      {printMode === 'plan' ? (
        <div className="print-card" aria-hidden="true">
          <h1>Plan familiar de emergencia</h1>
          <pre>{planToText(plan)}</pre>
          <p>Actualizado: {new Date(plan.updatedAt).toLocaleDateString('es-VE')}</p>
        </div>
      ) : (
        /* Door sign (FEMA pattern): tape it to the door after evacuating so
           rescuers and neighbors don't waste time searching. Two halves —
           circle one, or cut and use the side that applies. */
        <div className="print-card door-sign" aria-hidden="true">
          <section>
            <h1>ESTAMOS BIEN</h1>
            <p>
              Salimos de esta casa. Vamos a:{' '}
              <strong>{plan.meetingPoints.neighborhood || '________________'}</strong>
            </p>
            <p>
              Contacto: <strong>{plan.outOfTownContact.name || '____________'}</strong> ·{' '}
              <strong>{plan.outOfTownContact.phone || '____________'}</strong>
            </p>
          </section>
          <hr />
          <section>
            <h1>NECESITAMOS AYUDA</h1>
            <p>
              Somos <strong>{plan.members.length || '__'}</strong> personas.
              {plan.members.some((m) => m.medicalNeeds.trim())
                ? ' Condiciones médicas: ' +
                  plan.members
                    .filter((m) => m.medicalNeeds.trim())
                    .map((m) => `${m.name}: ${m.medicalNeeds}`)
                    .join('; ')
                : ''}
            </p>
            <p>Avisar al 911 o a los vecinos.</p>
          </section>
        </div>
      )}
    </div>
  )
}

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

export function Plan() {
  const [plan, setPlan] = useState<FamilyPlan | null>(null)
  const [showQR, setShowQR] = useState(false)
  const [shareMsg, setShareMsg] = useState('')
  const saveTimer = useRef<ReturnType<typeof setTimeout>>(undefined)

  useEffect(() => {
    db.plan.get('main').then((p) => setPlan(p ?? emptyPlan()))
  }, [])

  // Autosave (debounced) — a form abandoned mid-fill must still survive.
  function update(next: FamilyPlan) {
    next.updatedAt = new Date().toISOString()
    setPlan({ ...next })
    clearTimeout(saveTimer.current)
    saveTimer.current = setTimeout(() => {
      db.plan.put(next)
      void requestPersistentStorage()
    }, 400)
  }

  if (!plan) return null

  const setMember = (i: number, patch: Partial<PlanMember>) => {
    const members = plan.members.map((m, j) => (j === i ? { ...m, ...patch } : m))
    update({ ...plan, members })
  }

  return (
    <div className="page">
      <header className="page-head no-print">
        <h1>Plan familiar</h1>
        <p className="dim">
          Si tiemblan las paredes y no hay señal, ¿tu familia sabe qué hacer? Llena esto una vez,
          compártelo y imprímelo. Se guarda solo mientras escribes.
        </p>
      </header>

      <section className="card no-print">
        <h2>1 · ¿Quiénes son?</h2>
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
            <button
              type="button"
              className="ghost"
              onClick={() => update({ ...plan, members: plan.members.filter((_, j) => j !== i) })}
            >
              Quitar
            </button>
          </fieldset>
        ))}
        <button
          type="button"
          className="primary"
          onClick={() => update({ ...plan, members: [...plan.members, emptyMember()] })}
        >
          + Agregar persona
        </button>
      </section>

      <section className="card no-print">
        <h2>2 · Contactos si nos separamos</h2>
        <p className="dim">
          Tras un sismo, llamar dentro de la zona casi nunca funciona — pero un mensaje hacia
          afuera sí suele pasar. Todos avisan al mismo contacto.
        </p>
        <fieldset>
          <legend>Contacto fuera de la ciudad</legend>
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
        </fieldset>
        <fieldset>
          <legend>Contacto fuera del país</legend>
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
        </fieldset>
      </section>

      <section className="card no-print">
        <h2>3 · Puntos de encuentro</h2>
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

      <section className="card no-print">
        <h2>4 · Números de emergencia</h2>
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

      <section className="card no-print actions">
        <h2>Compártelo — de nada sirve si solo tú lo tienes</h2>
        <div className="btn-row">
          <button
            type="button"
            className="primary"
            onClick={async () => {
              const result = await sharePlan(plan)
              setShareMsg(result === 'copied' ? 'Texto copiado — pégalo en WhatsApp.' : '')
            }}
          >
            Compartir por WhatsApp
          </button>
          <button type="button" onClick={() => window.print()}>
            Imprimir
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
        <p className="dim">
          Pega una copia impresa en la nevera y otra en el kit. El papel no se queda sin batería.
        </p>
      </section>

      {/* Print-only card */}
      <div className="print-card" aria-hidden="true">
        <h1>Plan familiar de emergencia</h1>
        <pre>{planToText(plan)}</pre>
        <p>Actualizado: {new Date(plan.updatedAt).toLocaleDateString('es-VE')}</p>
      </div>
    </div>
  )
}

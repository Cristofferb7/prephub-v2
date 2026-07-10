import { useState } from 'react'
import { navigate } from '../router'

// Emergency mode: a different gear. Black background, huge type, zero chrome.
// Must be usable by an abuela with shaking hands, during an aftershock.

const CONTENT = {
  durante: {
    title: 'DURANTE EL SISMO',
    steps: [
      'AGÁCHATE en el piso, en cuatro puntos.',
      'CÚBRETE bajo una mesa fuerte. Si no hay: pégate a una pared interior y protege tu cabeza y cuello con los brazos.',
      'SUJÉTATE y quédate ahí hasta que PARE de temblar.',
      'NO corras hacia afuera mientras tiembla.',
      'En cama: quédate, tápate la cabeza con la almohada.',
      'Manejando: detente lejos de puentes y postes, quédate dentro.',
    ],
  },
  despues: {
    title: 'DESPUÉS DEL SISMO',
    steps: [
      'Ponte ZAPATOS antes de caminar (vidrios).',
      'Revisa heridos. Hemorragia = presión directa y fuerte.',
      '¿Olor a gas? NO enciendas nada. Abre ventanas, cierra la llave, sal.',
      'NUNCA velas ni fósforos. Solo linterna.',
      'Sal por las ESCALERAS. Nunca el ascensor.',
      'Vendrán réplicas: agáchate, cúbrete, sujétate otra vez.',
      'Manda UN mensaje al contacto del plan: "Estoy bien, estoy en…". No llames.',
    ],
  },
  tsunami: {
    title: '¿TSUNAMI? (SI VIVES EN LA COSTA)',
    steps: [
      '¿El sismo fue tan fuerte que te costó estar de pie, o duró muchísimo?',
      'ESA ES LA ALERTA. No esperes ningún aviso oficial.',
      'Camina YA a una zona alta, lejos de la playa y de los ríos.',
      'Quédate arriba VARIAS HORAS. Las olas vienen en series; la primera no es la más grande.',
      'No bajes a mirar el mar.',
    ],
  },
} as const

type Section = keyof typeof CONTENT

export function Ahora() {
  const [open, setOpen] = useState<Section | null>(null)

  if (open) {
    const c = CONTENT[open]
    return (
      <div className="ahora-mode">
        <button type="button" className="ahora-back" onClick={() => setOpen(null)}>
          ← Volver
        </button>
        <h1>{c.title}</h1>
        <ol>
          {c.steps.map((s, i) => (
            <li key={i}>{s}</li>
          ))}
        </ol>
      </div>
    )
  }

  return (
    <div className="ahora-mode">
      <button type="button" className="ahora-back" onClick={() => navigate('/')}>
        ← Salir
      </button>
      <h1>¿QUÉ ESTÁ PASANDO?</h1>
      <button type="button" className="ahora-option" onClick={() => setOpen('durante')}>
        ESTÁ TEMBLANDO
      </button>
      <button type="button" className="ahora-option" onClick={() => setOpen('despues')}>
        YA PASÓ EL SISMO
      </button>
      <button type="button" className="ahora-option" onClick={() => setOpen('tsunami')}>
        VIVO EN LA COSTA
      </button>
    </div>
  )
}

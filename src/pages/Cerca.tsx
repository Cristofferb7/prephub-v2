import { useEffect, useRef, useState } from 'react'
import {
  PLACE_STATUS_LABEL,
  SERVICE_LABEL,
  distanceKm,
  type Place,
  type PlaceService,
} from '../data/places'
import { getPlaces } from '../lib/providers'
import { shortDate } from '../lib/time'

const SERVICES = Object.keys(SERVICE_LABEL) as PlaceService[]

const SERVICE_ICON: Record<PlaceService, string> = {
  agua: 'M12 3.5C9 8 6.5 11 6.5 14.5a5.5 5.5 0 0 0 11 0C17.5 11 15 8 12 3.5z',
  comida: 'M5 3v7a2 2 0 0 0 2 2v9M9 3v9M5 3v9m14-9c-2 0-3.5 2.5-3.5 5.5 0 2 .8 3.5 2 3.5V21M19 3v18',
  medicinas: 'M12 6v12M6 12h12',
  techo: 'M3.5 11.5 12 4l8.5 7.5M6 10v10h12V10',
}

interface Pos {
  lat: number
  lng: number
}

function fmtKm(km: number): string {
  return km < 10
    ? `a ${km.toFixed(1).replace('.', ',')} km`
    : `a ${Math.round(km)} km`
}

export function Cerca() {
  const [places, setPlaces] = useState<Place[]>([])
  const [view, setView] = useState<'lista' | 'mapa'>('lista')
  const [filters, setFilters] = useState<Set<PlaceService>>(new Set())
  const [soloAbiertos, setSoloAbiertos] = useState(false)
  const [pos, setPos] = useState<Pos | null>(null) // session only, never persisted
  const [geoMsg, setGeoMsg] = useState('')
  const [expanded, setExpanded] = useState<string | null>(null)
  const cardRefs = useRef<Record<string, HTMLElement | null>>({})

  useEffect(() => {
    getPlaces().then(setPlaces)
  }, [])

  const toggleFilter = (s: PlaceService) => {
    const next = new Set(filters)
    if (next.has(s)) next.delete(s)
    else next.add(s)
    setFilters(next)
  }

  // Geolocation is on-demand only (spec rule 4): first tap asks permission.
  const sortByDistance = () => {
    if (pos) {
      setPos(null) // toggle back to municipio order
      return
    }
    if (!navigator.geolocation) {
      setGeoMsg('Tu navegador no permite ubicación. Ordenado por municipio.')
      return
    }
    navigator.geolocation.getCurrentPosition(
      (p) => {
        setPos({ lat: p.coords.latitude, lng: p.coords.longitude })
        setGeoMsg('')
      },
      () => setGeoMsg('Sin permiso de ubicación — ordenado por municipio.'),
      { timeout: 8000 },
    )
  }

  let shown = places.filter(
    (p) =>
      (!soloAbiertos || p.status === 'abierto') &&
      [...filters].every((s) => p.services.includes(s)),
  )
  shown = pos
    ? [...shown].sort(
        (a, b) => distanceKm(pos.lat, pos.lng, a.lat, a.lng) - distanceKm(pos.lat, pos.lng, b.lat, b.lng),
      )
    : [...shown].sort((a, b) => a.municipio.localeCompare(b.municipio) || a.name.localeCompare(b.name))

  const openFromMap = (id: string) => {
    setView('lista')
    setExpanded(id)
    // wait for the list to render before scrolling
    setTimeout(() => cardRefs.current[id]?.scrollIntoView({ block: 'center' }), 60)
  }

  return (
    <div className="page">
      <header className="page-head">
        <h1>Cerca de ti</h1>
        <p className="dim">Refugios y puntos de apoyo: agua, comida, medicinas, techo.</p>
      </header>

      <div className="banner" role="note">
        <strong>Modo demostración</strong> — estos datos no son reales.
      </div>

      <div className="seg-control no-print" role="group" aria-label="Vista">
        {(['lista', 'mapa'] as const).map((v) => (
          <button
            key={v}
            aria-pressed={view === v}
            className={view === v ? 'active' : ''}
            onClick={() => setView(v)}
          >
            {v === 'lista' ? 'Lista' : 'Mapa'}
          </button>
        ))}
      </div>

      <div className="filter-row" role="group" aria-label="Filtrar por servicio">
        {SERVICES.map((s) => (
          <button
            key={s}
            className={`filter-pill${filters.has(s) ? ' on' : ''}`}
            aria-pressed={filters.has(s)}
            onClick={() => toggleFilter(s)}
          >
            {SERVICE_LABEL[s]}
          </button>
        ))}
        <button
          className={`filter-pill${soloAbiertos ? ' on' : ''}`}
          aria-pressed={soloAbiertos}
          onClick={() => setSoloAbiertos((v) => !v)}
        >
          Solo abiertos
        </button>
      </div>

      {view === 'lista' && (
        <>
          <button type="button" onClick={sortByDistance}>
            {pos ? 'Ordenar por municipio' : 'Ordenar por distancia'}
          </button>
          {geoMsg && (
            <p className="dim" role="status">
              {geoMsg}
            </p>
          )}

          {shown.map((p) => {
            const open = expanded === p.id
            return (
              <article
                key={p.id}
                ref={(el) => {
                  cardRefs.current[p.id] = el
                }}
                className={`card place-card${open ? ' open' : ''}`}
              >
                <button
                  type="button"
                  className="place-head"
                  aria-expanded={open}
                  onClick={() => setExpanded(open ? null : p.id)}
                >
                  <span>
                    <strong>{p.name}</strong>
                    <span className="dim">
                      {' '}
                      · {p.municipio}
                      {pos && ` · ${fmtKm(distanceKm(pos.lat, pos.lng, p.lat, p.lng))}`}
                    </span>
                  </span>
                </button>
                <div className="chip-row">
                  <span className={`chip status-${p.status}`}>{PLACE_STATUS_LABEL[p.status]}</span>
                  {p.services.map((s) => (
                    <span key={s} className="chip service">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                        <path d={SERVICE_ICON[s]} />
                      </svg>
                      {SERVICE_LABEL[s]}
                    </span>
                  ))}
                  <span className="chip demo">DEMO · datos de ejemplo</span>
                </div>
                <p className="dim place-meta">
                  Actualizado: {shortDate(p.updatedAt)} · Fuente: datos de ejemplo
                </p>
                {open && (
                  <div className="place-detail">
                    {p.note && <p>{p.note}</p>}
                    <p className="dim">
                      Servicios: {p.services.map((s) => SERVICE_LABEL[s]).join(', ') || 'sin información'}.
                    </p>
                    <div className="btn-row">
                      <a
                        className="btn-link"
                        href={`geo:${p.lat},${p.lng}?q=${p.lat},${p.lng}(${encodeURIComponent(p.name)})`}
                      >
                        Cómo llegar
                      </a>
                      <a
                        className="btn-link"
                        href={`https://maps.google.com/?q=${p.lat},${p.lng}`}
                        target="_blank"
                        rel="noreferrer"
                      >
                        Ver en Google Maps
                      </a>
                    </div>
                    <p className="dim">
                      Sin internet: pregunta por «{p.name}», {p.municipio}.
                    </p>
                  </div>
                )}
              </article>
            )
          })}
          {shown.length === 0 && (
            <p className="dim">Ningún punto coincide con esos filtros. Quita alguno.</p>
          )}
        </>
      )}

      {view === 'mapa' && <SchematicMap places={shown} pos={pos} onPick={openFromMap} />}

      <p className="status">
        Mapa real (descarga de tu ciudad, ~30–80 MB) llegará en una fase futura. Este es un
        esquema de demostración.
      </p>
    </div>
  )
}

/**
 * Schematic map — deliberately NOT a tile map (spec: no map libraries this
 * phase). Linear lat/lng projection into a 4:3 viewBox; fine at city scale.
 */
function SchematicMap({
  places,
  pos,
  onPick,
}: {
  places: Place[]
  pos: Pos | null
  onPick: (id: string) => void
}) {
  const W = 400
  const H = 300
  const PAD = 30

  const lats = places.map((p) => p.lat).concat(pos ? [pos.lat] : [])
  const lngs = places.map((p) => p.lng).concat(pos ? [pos.lng] : [])
  if (lats.length === 0) return null
  const minLat = Math.min(...lats)
  const maxLat = Math.max(...lats)
  const minLng = Math.min(...lngs)
  const maxLng = Math.max(...lngs)
  const x = (lng: number) =>
    PAD + ((lng - minLng) / (maxLng - minLng || 1)) * (W - 2 * PAD)
  const y = (lat: number) =>
    H - PAD - ((lat - minLat) / (maxLat - minLat || 1)) * (H - 2 * PAD)

  const statusFill: Record<Place['status'], string> = {
    abierto: 'var(--good)',
    lleno: 'var(--accent)',
    sin_confirmar: 'var(--text-low)',
    cerrado: 'var(--text-low)',
  }

  return (
    <figure className="schematic card">
      <svg viewBox={`0 0 ${W} ${H}`} role="img" aria-label="Esquema de puntos de apoyo. Toca un punto para ver su ficha.">
        {/* subtle grid */}
        {Array.from({ length: 7 }, (_, i) => (
          <line key={`v${i}`} x1={(i + 1) * (W / 8)} y1="0" x2={(i + 1) * (W / 8)} y2={H} className="grid" />
        ))}
        {Array.from({ length: 5 }, (_, i) => (
          <line key={`h${i}`} x1="0" y1={(i + 1) * (H / 6)} x2={W} y2={(i + 1) * (H / 6)} className="grid" />
        ))}
        {places.map((p) => (
          <g key={p.id} transform={`translate(${x(p.lng)}, ${y(p.lat)})`}>
            <circle
              r="9"
              fill={statusFill[p.status]}
              className="marker"
              role="button"
              tabIndex={0}
              aria-label={`${p.name} — ${PLACE_STATUS_LABEL[p.status]}`}
              onClick={() => onPick(p.id)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault()
                  onPick(p.id)
                }
              }}
            />
            {p.status === 'cerrado' && <path d="M-3.5-3.5 3.5 3.5M3.5-3.5-3.5 3.5" stroke="var(--bg)" strokeWidth="2" />}
          </g>
        ))}
        {pos && (
          <g transform={`translate(${x(pos.lng)}, ${y(pos.lat)})`}>
            <circle r="14" className="pulse" fill="var(--accent)" opacity="0.25" />
            <circle r="6" fill="var(--accent)" stroke="var(--bg)" strokeWidth="2" />
          </g>
        )}
      </svg>
      <figcaption className="dim">
        <span className="legend"><i style={{ background: 'var(--good)' }} /> Abierto</span>
        <span className="legend"><i style={{ background: 'var(--accent)' }} /> Lleno</span>
        <span className="legend"><i style={{ background: 'var(--text-low)' }} /> Sin confirmar / cerrado</span>
        <span className="chip demo">DEMO</span>
      </figcaption>
    </figure>
  )
}

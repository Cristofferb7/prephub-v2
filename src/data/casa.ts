// "Casa segura" — cacería de peligros en casa. Sintetizado de SENAPRED
// (Familia Preparada: asegurar la casa ANTES del sismo), FEMA/Ready.gov
// (Secure Your Space / QuakeSmart) y CENAPRED. La ciencia de preparación es
// clara: asegurar la casa evita más heridas que cualquier kit.

export interface CasaItemDef {
  id: string
  label: string
  detail?: string
  category: string
}

export const CASA_CATEGORIES = [
  'Dormitorios',
  'Cocina y gas',
  'Toda la casa',
  'Salidas',
] as const

export const CASA_ITEMS: CasaItemDef[] = [
  // Dormitorios
  {
    id: 'camas-ventanas',
    label: 'Camas lejos de ventanas y vidrios',
    detail: 'El vidrio que estalla sobre una cama es de las heridas más comunes en un sismo.',
    category: 'Dormitorios',
  },
  {
    id: 'nada-sobre-camas',
    label: 'Nada pesado colgado sobre las camas',
    detail: 'Cuadros, repisas, espejos y TV: nada que pueda caer donde duermes.',
    category: 'Dormitorios',
  },
  {
    id: 'sitio-seguro-cuarto',
    label: 'Sitio seguro identificado en cada cuarto',
    detail: 'Bajo una mesa firme o contra una pared interior, lejos de ventanas. Practíquenlo.',
    category: 'Dormitorios',
  },
  // Cocina y gas
  {
    id: 'bombona-sujeta',
    label: 'Bombona de gas amarrada o sujeta',
    detail: 'Una bombona que se vuelca y rompe su manguera es un incendio esperando.',
    category: 'Cocina y gas',
  },
  {
    id: 'llave-gas',
    label: 'Todos saben cerrar la llave del gas',
    detail: 'También los muchachos. A oscuras y con apuro.',
    category: 'Cocina y gas',
  },
  {
    id: 'repisas-cocina',
    label: 'Nada pesado ni de vidrio en repisas altas',
    detail: 'Lo pesado abajo, lo liviano arriba.',
    category: 'Cocina y gas',
  },
  // Toda la casa
  {
    id: 'muebles-anclados',
    label: 'Estantes y muebles altos anclados a la pared',
    detail: 'Escaparates, bibliotecas, vitrinas: ángulos o correas a la pared.',
    category: 'Toda la casa',
  },
  {
    id: 'tv-sujeta',
    label: 'TV y electrodomésticos grandes sujetos',
    category: 'Toda la casa',
  },
  {
    id: 'llaves-agua-luz',
    label: 'Todos saben cortar el agua y la electricidad',
    detail: 'Ubica el tablero y la llave de paso hoy, no ese día.',
    category: 'Toda la casa',
  },
  {
    id: 'calentador',
    label: 'Calentador de agua sujeto (si tienes)',
    category: 'Toda la casa',
  },
  {
    id: 'quimicos-abajo',
    label: 'Venenos y químicos en repisas bajas y cerradas',
    detail: 'Cloro, plaguicidas, combustibles: que no caigan ni se mezclen.',
    category: 'Toda la casa',
  },
  // Salidas
  {
    id: 'rutas-despejadas',
    label: 'Pasillos y salidas siempre despejados',
    detail: 'Nada que estorbe el camino a la puerta, tampoco de noche.',
    category: 'Salidas',
  },
  {
    id: 'llaves-puerta',
    label: 'Llaves cerca de la puerta y todos saben dónde',
    category: 'Salidas',
  },
  {
    id: 'fuego-pequeno',
    label: 'Forma de apagar un fuego pequeño',
    detail: 'Extintor si se puede; si no, arena o una manta gruesa a mano.',
    category: 'Salidas',
  },
]

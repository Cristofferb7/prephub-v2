// 72-hour earthquake kit — synthesized from Ready.gov/FEMA build-a-kit,
// SENAPRED "Familia Preparada" and FUNVISIS doctrine. Quantities scale by
// household size where perPerson is set.

export interface KitItemDef {
  id: string
  label: string
  detail?: string
  /** e.g. 'L', 'unidades' — shown next to computed quantity. */
  unit?: string
  /** Base quantity for 1 person; multiplied by household size. */
  perPerson?: number
  /** Fixed quantity regardless of household size. */
  fixed?: number
  /** Perishable → the UI offers an expiry date. */
  expires?: boolean
  category: string
}

export const KIT_CATEGORIES = [
  'Agua y comida',
  'Salud',
  'Luz y comunicación',
  'Documentos y dinero',
  'Ropa e higiene',
  'Herramientas',
] as const

export const KIT_ITEMS: KitItemDef[] = [
  // Agua y comida
  {
    id: 'agua',
    label: 'Agua potable',
    detail: '4 litros por persona por día × 3 días (para beber y para higiene).',
    unit: 'L',
    perPerson: 12,
    expires: true,
    category: 'Agua y comida',
  },
  {
    id: 'comida',
    label: 'Comida no perecedera para 3 días',
    detail: 'Enlatados, granos, galletas, leche en polvo. Que no requiera cocinar.',
    unit: 'días',
    fixed: 3,
    expires: true,
    category: 'Agua y comida',
  },
  {
    id: 'abrelatas',
    label: 'Abrelatas manual',
    category: 'Agua y comida',
  },
  {
    id: 'cloro',
    label: 'Cloro doméstico sin aroma (5–6 %)',
    detail: 'Para desinfectar agua: 2 gotas por litro. Ver la guía "Agua segura".',
    expires: true,
    category: 'Agua y comida',
  },
  // Salud
  {
    id: 'botiquin',
    label: 'Botiquín de primeros auxilios',
    detail: 'Gasas, vendas, adhesivo, tijeras, guantes, antiséptico, analgésicos.',
    category: 'Salud',
  },
  {
    id: 'medicinas',
    label: 'Medicinas personales para 7 días',
    detail: 'Tensión, diabetes, asma… con copia del récipe.',
    expires: true,
    category: 'Salud',
  },
  {
    id: 'tapabocas',
    label: 'Tapabocas',
    detail: 'Por el polvo de escombros.',
    unit: 'unidades',
    perPerson: 3,
    category: 'Salud',
  },
  // Luz y comunicación
  {
    id: 'linterna',
    label: 'Linterna',
    detail: 'Nunca velas ni fósforos después de un sismo (riesgo de fuga de gas).',
    unit: 'unidades',
    fixed: 2,
    category: 'Luz y comunicación',
  },
  {
    id: 'pilas',
    label: 'Pilas de repuesto',
    detail: 'Para linterna y radio. Revisa el vencimiento.',
    expires: true,
    category: 'Luz y comunicación',
  },
  {
    id: 'radio',
    label: 'Radio AM/FM de pilas o dinamo',
    detail: 'Cuando no hay internet ni señal, la radio sigue funcionando.',
    category: 'Luz y comunicación',
  },
  {
    id: 'pito',
    label: 'Pito (silbato)',
    detail: 'Tres pitidos = señal de auxilio. Gasta menos energía que gritar.',
    unit: 'unidades',
    perPerson: 1,
    category: 'Luz y comunicación',
  },
  {
    id: 'powerbank',
    label: 'Batería externa cargada',
    category: 'Luz y comunicación',
  },
  // Documentos y dinero
  {
    id: 'documentos',
    label: 'Copias de documentos en bolsa impermeable',
    detail: 'Cédulas, partidas de nacimiento, títulos de propiedad, récipes. También fotos en el teléfono.',
    category: 'Documentos y dinero',
  },
  {
    id: 'efectivo',
    label: 'Efectivo en billetes pequeños',
    detail: 'Sin electricidad no hay puntos de venta ni pago móvil.',
    category: 'Documentos y dinero',
  },
  {
    id: 'plan-impreso',
    label: 'Plan familiar impreso',
    detail: 'El papel no se queda sin batería. Imprímelo desde la sección Plan.',
    category: 'Documentos y dinero',
  },
  {
    id: 'llaves',
    label: 'Copia de llaves de la casa y del carro',
    category: 'Documentos y dinero',
  },
  // Ropa e higiene
  {
    id: 'ropa',
    label: 'Muda de ropa y abrigo por persona',
    unit: 'mudas',
    perPerson: 1,
    category: 'Ropa e higiene',
  },
  {
    id: 'zapatos',
    label: 'Zapatos cerrados junto a la cama',
    detail: 'Después de un sismo el piso queda lleno de vidrios.',
    category: 'Ropa e higiene',
  },
  {
    id: 'higiene',
    label: 'Artículos de higiene',
    detail: 'Jabón, papel, toallas sanitarias, pañales si aplica.',
    category: 'Ropa e higiene',
  },
  // Herramientas
  {
    id: 'guantes',
    label: 'Guantes de trabajo',
    category: 'Herramientas',
  },
  {
    id: 'multiherramienta',
    label: 'Multiherramienta o navaja',
    category: 'Herramientas',
  },
  {
    id: 'bolsas',
    label: 'Bolsas plásticas resistentes',
    detail: 'Basura, agua, proteger cosas de la lluvia.',
    category: 'Herramientas',
  },
]

export function quantityFor(item: KitItemDef, householdSize: number): string | null {
  if (item.perPerson != null) return `${item.perPerson * householdSize} ${item.unit ?? ''}`.trim()
  if (item.fixed != null) return `${item.fixed} ${item.unit ?? ''}`.trim()
  return null
}

// Entidades federales de Venezuela. Los ids (minúsculas) deben coincidir con
// Alert.areas en src/data/alerts.ts.
export interface Estado {
  id: string
  name: string
}

export const ESTADOS: Estado[] = [
  { id: 'amazonas', name: 'Amazonas' },
  { id: 'anzoátegui', name: 'Anzoátegui' },
  { id: 'apure', name: 'Apure' },
  { id: 'aragua', name: 'Aragua' },
  { id: 'barinas', name: 'Barinas' },
  { id: 'bolívar', name: 'Bolívar' },
  { id: 'carabobo', name: 'Carabobo' },
  { id: 'cojedes', name: 'Cojedes' },
  { id: 'delta amacuro', name: 'Delta Amacuro' },
  { id: 'distrito capital', name: 'Distrito Capital' },
  { id: 'falcón', name: 'Falcón' },
  { id: 'guárico', name: 'Guárico' },
  { id: 'la guaira', name: 'La Guaira' },
  { id: 'lara', name: 'Lara' },
  { id: 'mérida', name: 'Mérida' },
  { id: 'miranda', name: 'Miranda' },
  { id: 'monagas', name: 'Monagas' },
  { id: 'nueva esparta', name: 'Nueva Esparta' },
  { id: 'portuguesa', name: 'Portuguesa' },
  { id: 'sucre', name: 'Sucre' },
  { id: 'táchira', name: 'Táchira' },
  { id: 'trujillo', name: 'Trujillo' },
  { id: 'yaracuy', name: 'Yaracuy' },
  { id: 'zulia', name: 'Zulia' },
]

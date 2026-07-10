import Dexie, { type EntityTable } from 'dexie'

// All user data lives ONLY on-device, in IndexedDB via Dexie.
// Sharing happens only by explicit user action (WhatsApp/print/QR/export).

/** Checked/quantity/expiry state for one kit item (definitions in src/data/kit.ts). */
export interface KitItemState {
  itemId: string
  checked: 0 | 1
  /** ISO date; only for perishables (agua, comida, medicinas, pilas, cloro). */
  expiresAt?: string
  updatedAt: string
}

/** App-level settings (householdSize, persistGranted, …). */
export interface Setting {
  key: string
  value: unknown
}

export interface PlanMember {
  name: string
  phone: string
  medicalNeeds: string
  /** School/work + who picks them up and where they go if separated. */
  daytimePlace: string
  pickupPolicy: string
}

export interface PlanContact {
  name: string
  phone: string
  place: string
}

/** Single-record family plan document (id = 'main'). */
export interface FamilyPlan {
  id: string
  members: PlanMember[]
  outOfTownContact: PlanContact
  outOfCountryContact: PlanContact
  meetingPoints: {
    /** Safe spot inside the home (under sturdy table, away from windows). */
    indoor: string
    neighborhood: string
    outsideNeighborhood: string
    outOfTown: string
  }
  /** User-verified local numbers (Protección Civil estadal, hospital, bomberos…). */
  localNumbers: { label: string; number: string }[]
  updatedAt: string
}

export const db = new Dexie('prephub') as Dexie & {
  kitItems: EntityTable<KitItemState, 'itemId'>
  settings: EntityTable<Setting, 'key'>
  plan: EntityTable<FamilyPlan, 'id'>
}

db.version(2).stores({
  kitItems: 'itemId, checked, expiresAt',
  settings: 'key',
  plan: 'id',
})

export const emptyPlan = (): FamilyPlan => ({
  id: 'main',
  members: [],
  outOfTownContact: { name: '', phone: '', place: '' },
  outOfCountryContact: { name: '', phone: '', place: '' },
  meetingPoints: { indoor: '', neighborhood: '', outsideNeighborhood: '', outOfTown: '' },
  localNumbers: [
    { label: 'Emergencias nacionales (VEN 911)', number: '911' },
    { label: 'Protección Civil de tu estado', number: '' },
    { label: 'Hospital o CDI más cercano', number: '' },
    { label: 'Bomberos de tu municipio', number: '' },
  ],
  updatedAt: new Date().toISOString(),
})

export async function getHouseholdSize(): Promise<number> {
  const s = await db.settings.get('householdSize')
  return typeof s?.value === 'number' && s.value > 0 ? s.value : 1
}

export async function setHouseholdSize(n: number) {
  await db.settings.put({ key: 'householdSize', value: n })
}

/** Ask the browser to protect IndexedDB/Cache from eviction. Safe to call repeatedly. */
export async function requestPersistentStorage() {
  try {
    if (navigator.storage?.persist) {
      const granted = await navigator.storage.persist()
      await db.settings.put({ key: 'persistGranted', value: granted })
      return granted
    }
  } catch {
    /* storage manager unavailable (old WebView) — precache still works */
  }
  return false
}

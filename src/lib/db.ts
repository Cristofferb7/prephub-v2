import Dexie, { type EntityTable } from 'dexie'

// All user data lives ONLY on-device, in IndexedDB via Dexie.
// Sharing happens only by explicit user action (WhatsApp/print/QR/export).
// Schema will grow in phase 2 (data model); this v1 proves the wiring.

/** Checked/quantity/expiry state for one kit item (definitions ship as bundled content). */
export interface KitItemState {
  itemId: string
  checked: 0 | 1
  quantity: number
  /** ISO date; only for perishables (agua, comida, medicinas, pilas). */
  expiresAt?: string
  updatedAt: string
}

/** App-level settings, e.g. household size that scales kit quantities. */
export interface Setting {
  key: string
  value: unknown
}

export const db = new Dexie('prephub') as Dexie & {
  kitItems: EntityTable<KitItemState, 'itemId'>
  settings: EntityTable<Setting, 'key'>
}

db.version(1).stores({
  kitItems: 'itemId, checked, expiresAt',
  settings: 'key',
})

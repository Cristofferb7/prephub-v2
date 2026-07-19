import { db, type CasaItemState, type FamilyPlan, type KitItemState, type Setting } from './db'

interface ExportFile {
  app: 'prephub'
  version: 1
  exportedAt: string
  kitItems: KitItemState[]
  settings: Setting[]
  plan: FamilyPlan[]
  /** Added later — absent in older backups. */
  casaItems?: CasaItemState[]
  /** Display prefs (theme/text/bold/contrast) so a restore keeps them. */
  prefs?: Record<string, string>
}

const PREF_KEYS = ['ph-theme', 'ph-text', 'ph-bold', 'ph-contrast']

function readPrefs(): Record<string, string> {
  const prefs: Record<string, string> = {}
  try {
    for (const k of PREF_KEYS) {
      const v = localStorage.getItem(k)
      if (v !== null) prefs[k] = v
    }
  } catch {
    /* private mode */
  }
  return prefs
}

/**
 * Export is the iOS data-loss escape hatch — it must work in standalone
 * (home-screen) Safari, where a bare anchor download can fail silently.
 * Prefer the native share sheet (navigator.share with files) and fall back
 * to an appended anchor with a delayed revoke.
 */
export async function exportData(): Promise<'shared' | 'downloaded' | 'cancelled'> {
  const data: ExportFile = {
    app: 'prephub',
    version: 1,
    exportedAt: new Date().toISOString(),
    kitItems: await db.kitItems.toArray(),
    settings: await db.settings.toArray(),
    plan: await db.plan.toArray(),
    casaItems: await db.casaItems.toArray(),
    prefs: readPrefs(),
  }
  const json = JSON.stringify(data, null, 2)
  const filename = `prephub-respaldo-${new Date().toISOString().slice(0, 10)}.json`

  if (typeof File === 'function' && navigator.canShare) {
    try {
      const file = new File([json], filename, { type: 'application/json' })
      if (navigator.canShare({ files: [file] })) {
        await navigator.share({ files: [file] })
        return 'shared'
      }
    } catch (e) {
      if ((e as DOMException)?.name === 'AbortError') return 'cancelled'
      /* share unsupported for files — fall through to download */
    }
  }

  const blob = new Blob([json], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  setTimeout(() => {
    a.remove()
    URL.revokeObjectURL(url)
  }, 10_000)
  return 'downloaded'
}

const isRecord = (x: unknown): x is Record<string, unknown> =>
  typeof x === 'object' && x !== null

export async function importData(file: File): Promise<{ ok: boolean; error?: string }> {
  let parsed: ExportFile
  try {
    parsed = JSON.parse(await file.text())
  } catch {
    return { ok: false, error: 'El archivo no es un JSON válido.' }
  }
  if (parsed?.app !== 'prephub' || !Array.isArray(parsed.kitItems)) {
    return { ok: false, error: 'Este archivo no parece un respaldo de PrepHub.' }
  }
  if (parsed.version !== 1) {
    return {
      ok: false,
      error: 'Este respaldo es de una versión más nueva de PrepHub. Actualiza la app primero.',
    }
  }

  // Validate record shapes BEFORE writing — a malformed row must not be able
  // to abort the restore halfway or corrupt existing data.
  const kitItems = parsed.kitItems.filter(
    (r) => isRecord(r) && typeof r.itemId === 'string' && r.itemId.length > 0,
  )
  const settings = (Array.isArray(parsed.settings) ? parsed.settings : []).filter(
    (r) => isRecord(r) && typeof r.key === 'string' && r.key.length > 0,
  )
  const plan = (Array.isArray(parsed.plan) ? parsed.plan : []).filter(
    (r) => isRecord(r) && typeof r.id === 'string' && Array.isArray(r.members),
  )
  const casaItems = (Array.isArray(parsed.casaItems) ? parsed.casaItems : []).filter(
    (r) => isRecord(r) && typeof r.itemId === 'string' && r.itemId.length > 0,
  )

  try {
    await db.transaction('rw', db.kitItems, db.settings, db.plan, db.casaItems, async () => {
      await db.kitItems.bulkPut(kitItems)
      await db.settings.bulkPut(settings)
      await db.plan.bulkPut(plan)
      await db.casaItems.bulkPut(casaItems)
    })
  } catch {
    return { ok: false, error: 'El respaldo está dañado y no se pudo restaurar. Nada cambió.' }
  }

  // Restore display prefs (theme, text size…) so an elderly user's setup survives.
  if (isRecord(parsed.prefs)) {
    try {
      for (const k of PREF_KEYS) {
        const v = parsed.prefs[k]
        if (typeof v === 'string') localStorage.setItem(k, v)
      }
    } catch {
      /* private mode: prefs just won't persist */
    }
  }
  return { ok: true }
}

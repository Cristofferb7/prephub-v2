import { db, type FamilyPlan, type KitItemState, type Setting } from './db'

interface ExportFile {
  app: 'prephub'
  version: 1
  exportedAt: string
  kitItems: KitItemState[]
  settings: Setting[]
  plan: FamilyPlan[]
}

export async function exportData() {
  const data: ExportFile = {
    app: 'prephub',
    version: 1,
    exportedAt: new Date().toISOString(),
    kitItems: await db.kitItems.toArray(),
    settings: await db.settings.toArray(),
    plan: await db.plan.toArray(),
  }
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `prephub-respaldo-${new Date().toISOString().slice(0, 10)}.json`
  a.click()
  URL.revokeObjectURL(url)
}

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
  await db.transaction('rw', db.kitItems, db.settings, db.plan, async () => {
    await db.kitItems.bulkPut(parsed.kitItems)
    await db.settings.bulkPut(parsed.settings ?? [])
    await db.plan.bulkPut(parsed.plan ?? [])
  })
  return { ok: true }
}

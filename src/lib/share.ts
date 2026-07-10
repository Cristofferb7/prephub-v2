import type { FamilyPlan } from './db'

/** WhatsApp-ready plain-text version of the family plan. */
export function planToText(plan: FamilyPlan): string {
  const lines: string[] = ['🏠 PLAN FAMILIAR DE EMERGENCIA', '']

  if (plan.members.length) {
    lines.push('👥 Familia:')
    for (const m of plan.members) {
      const extra = [m.phone, m.medicalNeeds && `⚕ ${m.medicalNeeds}`].filter(Boolean).join(' · ')
      lines.push(`• ${m.name}${extra ? ` — ${extra}` : ''}`)
      if (m.daytimePlace) lines.push(`   Día: ${m.daytimePlace}${m.pickupPolicy ? ` (retira: ${m.pickupPolicy})` : ''}`)
    }
    lines.push('')
  }

  const c1 = plan.outOfTownContact
  const c2 = plan.outOfCountryContact
  if (c1.name || c2.name) {
    lines.push('📞 Si nos separamos, TODOS avisamos a:')
    if (c1.name) lines.push(`• ${c1.name} (${c1.place || 'fuera de la ciudad'}): ${c1.phone}`)
    if (c2.name) lines.push(`• ${c2.name} (${c2.place || 'fuera del país'}): ${c2.phone}`)
    lines.push('Mensaje corto, no llamada: "Estoy bien, estoy en …"', '')
  }

  const mp = plan.meetingPoints
  if (mp.indoor || mp.neighborhood || mp.outsideNeighborhood || mp.outOfTown) {
    lines.push('📍 Puntos de encuentro:')
    if (mp.indoor) lines.push(`1. En casa (sitio seguro): ${mp.indoor}`)
    if (mp.neighborhood) lines.push(`2. En el sector: ${mp.neighborhood}`)
    if (mp.outsideNeighborhood) lines.push(`3. Fuera del sector: ${mp.outsideNeighborhood}`)
    if (mp.outOfTown) lines.push(`4. Fuera de la ciudad: ${mp.outOfTown}`)
    lines.push('')
  }

  const nums = plan.localNumbers.filter((n) => n.number.trim())
  if (nums.length) {
    lines.push('🚨 Números de emergencia:')
    for (const n of nums) lines.push(`• ${n.label}: ${n.number}`)
    lines.push('')
  }

  lines.push('— Hecho con PrepHub (funciona sin internet)')
  return lines.join('\n')
}

export async function sharePlan(plan: FamilyPlan): Promise<'shared' | 'copied'> {
  const text = planToText(plan)
  if (navigator.share) {
    try {
      await navigator.share({ text })
      return 'shared'
    } catch {
      /* user cancelled or share failed — fall through to clipboard */
    }
  }
  await navigator.clipboard.writeText(text)
  return 'copied'
}

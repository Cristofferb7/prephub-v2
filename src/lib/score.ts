import type { FamilyPlan, KitItemState } from './db'
import { KIT_ITEMS } from '../data/kit'

export interface ScoreBreakdown {
  total: number // 0–100
  kit: number // 0–100
  plan: number // 0–100
  expired: string[] // item ids past expiry
  expiringSoon: string[] // item ids within 30 days
}

export function kitScore(states: KitItemState[]): number {
  if (KIT_ITEMS.length === 0) return 0
  const byId = new Map(states.map((s) => [s.itemId, s]))
  const checked = KIT_ITEMS.filter((i) => byId.get(i.id)?.checked === 1).length
  return Math.round((checked / KIT_ITEMS.length) * 100)
}

/** Plan completeness: each of these counts equally. */
export function planScore(plan: FamilyPlan | undefined): number {
  if (!plan) return 0
  const filled = (s: string) => s.trim().length > 0
  const checks = [
    plan.members.length > 0 && plan.members.every((m) => filled(m.name)),
    filled(plan.outOfTownContact.name) && filled(plan.outOfTownContact.phone),
    filled(plan.outOfCountryContact.name) && filled(plan.outOfCountryContact.phone),
    filled(plan.meetingPoints.indoor),
    filled(plan.meetingPoints.neighborhood),
    filled(plan.meetingPoints.outsideNeighborhood),
    filled(plan.meetingPoints.outOfTown),
    plan.localNumbers.some((n) => filled(n.number) && n.number !== '911'),
  ]
  return Math.round((checks.filter(Boolean).length / checks.length) * 100)
}

export function expiryStatus(states: KitItemState[]): { expired: string[]; expiringSoon: string[] } {
  const now = Date.now()
  const soon = now + 30 * 24 * 60 * 60 * 1000
  const expired: string[] = []
  const expiringSoon: string[] = []
  for (const s of states) {
    if (!s.expiresAt || s.checked !== 1) continue
    // expiresAt is date-only; bare Date() would parse it as UTC midnight and
    // flag items expired up to a day early in Venezuela (UTC−4). An item is
    // valid through the END of its stated day, local time.
    const t = new Date(s.expiresAt + 'T23:59:59').getTime()
    if (Number.isNaN(t)) continue
    if (t < now) expired.push(s.itemId)
    else if (t < soon) expiringSoon.push(s.itemId)
  }
  return { expired, expiringSoon }
}

/** The single next action for the home CTA (goal-gradient: name one step, never a count). */
export function nextStep(
  states: KitItemState[],
  plan: FamilyPlan | undefined,
): { label: string; to: string; minutes: number } | null {
  const byId = new Map(states.map((s) => [s.itemId, s]))
  const unchecked = KIT_ITEMS.find((i) => byId.get(i.id)?.checked !== 1)
  if (unchecked) return { label: unchecked.label, to: '/kit', minutes: 2 }

  const filled = (s: string) => s.trim().length > 0
  const planSteps: [boolean, string][] = [
    [!!plan && plan.members.length > 0 && plan.members.every((m) => filled(m.name)), 'Tu familia en el plan'],
    [!!plan && filled(plan.outOfTownContact.name) && filled(plan.outOfTownContact.phone), 'Contacto fuera de la ciudad'],
    [!!plan && filled(plan.outOfCountryContact.name) && filled(plan.outOfCountryContact.phone), 'Contacto fuera del país'],
    [!!plan && filled(plan.meetingPoints.indoor), 'Punto seguro dentro de casa'],
    [!!plan && filled(plan.meetingPoints.neighborhood), 'Punto de encuentro del barrio'],
    [!!plan && filled(plan.meetingPoints.outsideNeighborhood), 'Punto fuera del barrio'],
    [!!plan && filled(plan.meetingPoints.outOfTown), 'Punto fuera de la ciudad'],
    [!!plan && plan.localNumbers.some((n) => filled(n.number) && n.number !== '911'), 'Números de emergencia locales'],
  ]
  const missing = planSteps.find(([done]) => !done)
  if (missing) return { label: missing[1], to: '/plan', minutes: 5 }
  return null
}

export function computeScore(states: KitItemState[], plan: FamilyPlan | undefined): ScoreBreakdown {
  const kit = kitScore(states)
  const p = planScore(plan)
  return {
    kit,
    plan: p,
    total: Math.round(kit * 0.5 + p * 0.5),
    ...expiryStatus(states),
  }
}

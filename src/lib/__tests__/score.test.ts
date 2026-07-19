import { describe, expect, it } from 'vitest'
import { computeScore, kitScore, nextStep, planScore } from '../score'
import { KIT_ITEMS } from '../../data/kit'
import { emptyPlan, type FamilyPlan, type KitItemState } from '../db'

const checked = (ids: string[]): KitItemState[] =>
  ids.map((itemId) => ({ itemId, checked: 1 as const, updatedAt: '2026-07-18T00:00:00Z' }))

const fullPlan = (): FamilyPlan => {
  const p = emptyPlan()
  p.members = [
    { name: 'María', phone: '0412', medicalNeeds: '', daytimePlace: '', pickupPolicy: '' },
  ]
  p.outOfTownContact = { name: 'Tía', phone: '0414', place: 'Valencia' }
  p.outOfCountryContact = { name: 'Primo', phone: '+1', place: 'EE. UU.' }
  p.meetingPoints = {
    indoor: 'mesa',
    neighborhood: 'cancha',
    outsideNeighborhood: 'casa tía',
    outOfTown: 'abuelos',
  }
  p.localNumbers[1].number = '0212-555'
  return p
}

describe('kitScore', () => {
  it('is 0 with nothing checked and 100 with everything', () => {
    expect(kitScore([])).toBe(0)
    expect(kitScore(checked(KIT_ITEMS.map((i) => i.id)))).toBe(100)
  })

  it('rounds a partial kit', () => {
    const two = checked([KIT_ITEMS[0].id, KIT_ITEMS[1].id])
    expect(kitScore(two)).toBe(Math.round((2 / KIT_ITEMS.length) * 100))
  })
})

describe('planScore', () => {
  it('is 0 for undefined or empty plan', () => {
    expect(planScore(undefined)).toBe(0)
    expect(planScore(emptyPlan())).toBe(0)
  })

  it('is 100 for a complete plan', () => {
    expect(planScore(fullPlan())).toBe(100)
  })

  it('does not count the prefilled 911 as a local number', () => {
    const p = emptyPlan()
    expect(planScore(p)).toBe(0)
  })
})

describe('computeScore expiry', () => {
  it('flags expired and soon-to-expire checked items only', () => {
    const past = new Date(Date.now() - 864e5).toISOString().slice(0, 10)
    const soon = new Date(Date.now() + 10 * 864e5).toISOString().slice(0, 10)
    const far = new Date(Date.now() + 100 * 864e5).toISOString().slice(0, 10)
    const states: KitItemState[] = [
      { itemId: 'agua', checked: 1, expiresAt: past, updatedAt: '' },
      { itemId: 'comida', checked: 1, expiresAt: soon, updatedAt: '' },
      { itemId: 'medicinas', checked: 1, expiresAt: far, updatedAt: '' },
      { itemId: 'pilas', checked: 0, expiresAt: past, updatedAt: '' }, // unchecked → ignored
    ]
    const s = computeScore(states, undefined)
    expect(s.expired).toEqual(['agua'])
    expect(s.expiringSoon).toEqual(['comida'])
  })
})

describe('nextStep', () => {
  it('names the first unchecked kit item', () => {
    const all = KIT_ITEMS.map((i) => i.id)
    const missingSecond = checked(all.filter((id) => id !== all[1]))
    const step = nextStep(missingSecond, fullPlan())
    expect(step?.to).toBe('/kit')
    expect(step?.label).toBe(KIT_ITEMS[1].label)
  })

  it('moves to the plan when the kit is complete', () => {
    const step = nextStep(checked(KIT_ITEMS.map((i) => i.id)), undefined)
    expect(step?.to).toBe('/plan')
  })

  it('returns null when everything is done', () => {
    expect(nextStep(checked(KIT_ITEMS.map((i) => i.id)), fullPlan())).toBeNull()
  })
})

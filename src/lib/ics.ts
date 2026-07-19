// Recurring calendar reminders (.ics) — the push-free re-engagement loop:
// no backend means no push, but every phone has a calendar.

function icsDate(d: Date): string {
  return d.toISOString().replace(/[-:]/g, '').slice(0, 15) + 'Z'
}

function downloadRecurring(slug: string, summary: string, description: string) {
  const start = new Date()
  start.setMonth(start.getMonth() + 6)
  start.setHours(10, 0, 0, 0)
  const end = new Date(start.getTime() + 30 * 60 * 1000)
  const ics = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//PrepHub//ES',
    'BEGIN:VEVENT',
    `UID:prephub-${slug}-${Date.now()}@prephub`,
    `DTSTAMP:${icsDate(new Date())}`,
    `DTSTART:${icsDate(start)}`,
    `DTEND:${icsDate(end)}`,
    'RRULE:FREQ=MONTHLY;INTERVAL=6',
    `SUMMARY:${summary}`,
    `DESCRIPTION:${description}`,
    'END:VEVENT',
    'END:VCALENDAR',
  ].join('\r\n')

  const blob = new Blob([ics], { type: 'text/calendar' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `prephub-${slug}.ics`
  document.body.appendChild(a)
  a.click()
  setTimeout(() => {
    a.remove()
    URL.revokeObjectURL(url)
  }, 10_000)
}

export function downloadKitReminder() {
  downloadRecurring(
    'revision-kit',
    'Revisar el kit de emergencia (PrepHub)',
    'Revisa agua\\, comida\\, medicinas y pilas del kit. Abre PrepHub para ver qué venció: https://prephub-delta.vercel.app/kit',
  )
}

export function downloadDrillReminder() {
  downloadRecurring(
    'simulacro',
    'Simulacro familiar de sismo (PrepHub)',
    'Practiquen en familia: Agáchate\\, Cúbrete\\, Sujétate. 3 minutos: https://prephub-delta.vercel.app/simulacro',
  )
}

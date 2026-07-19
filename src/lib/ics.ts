// Recurring calendar reminder (.ics) — the push-free re-engagement loop:
// no backend means no push, but every phone has a calendar.

function icsDate(d: Date): string {
  return d.toISOString().replace(/[-:]/g, '').slice(0, 15) + 'Z'
}

export function downloadKitReminder() {
  const start = new Date()
  start.setMonth(start.getMonth() + 6)
  start.setHours(10, 0, 0, 0)
  const end = new Date(start.getTime() + 30 * 60 * 1000)
  const ics = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//PrepHub//ES',
    'BEGIN:VEVENT',
    `UID:prephub-kit-review-${Date.now()}@prephub`,
    `DTSTAMP:${icsDate(new Date())}`,
    `DTSTART:${icsDate(start)}`,
    `DTEND:${icsDate(end)}`,
    'RRULE:FREQ=MONTHLY;INTERVAL=6',
    'SUMMARY:Revisar el kit de emergencia (PrepHub)',
    'DESCRIPTION:Revisa agua\\, comida\\, medicinas y pilas del kit. Abre PrepHub para ver qué venció: https://prephub-delta.vercel.app/kit',
    'END:VEVENT',
    'END:VCALENDAR',
  ].join('\r\n')

  const blob = new Blob([ics], { type: 'text/calendar' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = 'prephub-revision-kit.ics'
  document.body.appendChild(a)
  a.click()
  setTimeout(() => {
    a.remove()
    URL.revokeObjectURL(url)
  }, 10_000)
}

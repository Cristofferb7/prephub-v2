import { useEffect, useState } from 'react'

/**
 * Read-aloud (NERV-inspired accessibility): on-device speechSynthesis with a
 * Spanish voice. Works offline on Android (local es voices); renders nothing
 * where the API doesn't exist (old WebViews) — graceful degradation.
 */
export function SpeakButton({ text }: { text: string }) {
  const [speaking, setSpeaking] = useState(false)
  const supported = typeof window !== 'undefined' && 'speechSynthesis' in window

  useEffect(() => {
    if (!supported) return
    return () => window.speechSynthesis.cancel()
  }, [supported])

  if (!supported) return null

  const toggle = () => {
    const synth = window.speechSynthesis
    if (speaking) {
      synth.cancel()
      setSpeaking(false)
      return
    }
    const u = new SpeechSynthesisUtterance(text)
    u.lang = 'es-US'
    const voice =
      synth.getVoices().find((v) => v.lang.startsWith('es-VE')) ??
      synth.getVoices().find((v) => v.lang.startsWith('es'))
    if (voice) u.voice = voice
    u.rate = 0.95
    u.onend = () => setSpeaking(false)
    u.onerror = () => setSpeaking(false)
    synth.cancel()
    synth.speak(u)
    setSpeaking(true)
  }

  return (
    <button type="button" onClick={toggle} aria-pressed={speaking}>
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" style={{ verticalAlign: '-3px', marginRight: 6 }}>
        {speaking ? (
          <>
            <rect x="7" y="6" width="3.5" height="12" rx="1" />
            <rect x="13.5" y="6" width="3.5" height="12" rx="1" />
          </>
        ) : (
          <>
            <path d="M11 5 6.5 8.5H3v7h3.5L11 19z" />
            <path d="M15 9a4 4 0 0 1 0 6M18 6.5a8 8 0 0 1 0 11" />
          </>
        )}
      </svg>
      {speaking ? 'Detener' : 'Escuchar guía'}
    </button>
  )
}

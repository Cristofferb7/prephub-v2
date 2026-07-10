export function ScoreRing({ value, size = 180 }: { value: number; size?: number }) {
  const r = 64
  const c = 2 * Math.PI * r
  const filled = (value / 100) * c
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 160 160"
      role="img"
      aria-label={`Puntuación de preparación: ${value} por ciento`}
    >
      <defs>
        <linearGradient id="ringGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#ffb454" />
          <stop offset="100%" stopColor="#f59e0b" />
        </linearGradient>
      </defs>
      <circle cx="80" cy="80" r={r} fill="none" stroke="var(--surface-3)" strokeWidth="13" />
      {value > 0 && (
        <>
          {/* soft glow under the arc — wider stroke, low opacity, no filters */}
          <circle
            cx="80"
            cy="80"
            r={r}
            fill="none"
            stroke="url(#ringGrad)"
            strokeWidth="20"
            opacity="0.18"
            strokeLinecap="round"
            strokeDasharray={`${filled} ${c - filled}`}
            transform="rotate(-90 80 80)"
            style={{ transition: 'stroke-dasharray 700ms ease-out' }}
          />
          <circle
            cx="80"
            cy="80"
            r={r}
            fill="none"
            stroke="url(#ringGrad)"
            strokeWidth="13"
            strokeLinecap="round"
            strokeDasharray={`${filled} ${c - filled}`}
            transform="rotate(-90 80 80)"
            style={{ transition: 'stroke-dasharray 700ms ease-out' }}
          />
        </>
      )}
      <text
        x="80"
        y="78"
        textAnchor="middle"
        fill="var(--text)"
        fontSize="40"
        fontWeight="800"
        style={{ fontVariantNumeric: 'tabular-nums' }}
      >
        {value}%
      </text>
      <text x="80" y="103" textAnchor="middle" fill="var(--text-dim)" fontSize="13">
        preparados
      </text>
    </svg>
  )
}

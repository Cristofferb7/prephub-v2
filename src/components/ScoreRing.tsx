export function ScoreRing({ value, size = 160 }: { value: number; size?: number }) {
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
      <circle cx="80" cy="80" r={r} fill="none" stroke="var(--border)" strokeWidth="14" />
      <circle
        cx="80"
        cy="80"
        r={r}
        fill="none"
        stroke="var(--accent)"
        strokeWidth="14"
        strokeLinecap="round"
        strokeDasharray={`${filled} ${c - filled}`}
        transform="rotate(-90 80 80)"
        style={{ transition: 'stroke-dasharray 400ms ease' }}
      />
      <text
        x="80"
        y="76"
        textAnchor="middle"
        fill="var(--text)"
        fontSize="38"
        fontWeight="700"
      >
        {value}%
      </text>
      <text x="80" y="102" textAnchor="middle" fill="var(--text-dim)" fontSize="13">
        preparados
      </text>
    </svg>
  )
}

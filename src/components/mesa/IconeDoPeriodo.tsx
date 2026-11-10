import type { PeriodoDoDia } from '../../engine/partida'

interface IconeDoPeriodoProps {
  readonly periodo: PeriodoDoDia
}

export function IconeDoPeriodo({ periodo }: IconeDoPeriodoProps) {
  if (periodo === 'DIA') {
    return (
      <svg
        viewBox="0 0 24 24"
        aria-label="Dia"
        role="img"
        className="h-6 w-6 text-amber-300"
      >
        <circle cx="12" cy="12" r="5" fill="currentColor" />
        {[0, 45, 90, 135, 180, 225, 270, 315].map((angulo) => (
          <line
            key={angulo}
            x1="12"
            y1="2"
            x2="12"
            y2="5"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            transform={`rotate(${angulo} 12 12)`}
          />
        ))}
      </svg>
    )
  }

  return (
    <svg
      viewBox="0 0 24 24"
      aria-label="Noite"
      role="img"
      className="h-6 w-6 text-indigo-200"
    >
      <path
        d="M20 14.5A8 8 0 0 1 9.5 4a8 8 0 1 0 10.5 10.5z"
        fill="currentColor"
      />
    </svg>
  )
}

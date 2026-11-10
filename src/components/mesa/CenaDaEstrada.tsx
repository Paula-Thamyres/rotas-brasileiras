import type { PeriodoDoDia } from '../../engine/partida'

interface CenaDaEstradaProps {
  readonly periodo: PeriodoDoDia
}

const ANGULOS_DOS_RAIOS = [0, 45, 90, 135, 180, 225, 270, 315]

function classesDeVisibilidade(visivel: boolean): string {
  return `transition-opacity duration-1000 ${visivel ? 'opacity-100' : 'opacity-0'}`
}

export function CenaDaEstrada({ periodo }: CenaDaEstradaProps) {
  const ehDia = periodo === 'DIA'

  return (
    <svg
      viewBox="0 0 160 60"
      aria-hidden="true"
      className="h-12 w-32 shrink-0 overflow-hidden rounded-md border border-borda"
    >
      <rect width="160" height="60" className="fill-interno" />
      <g className={classesDeVisibilidade(ehDia)}>
        <g
          className="cena-raios"
          stroke="#fbbf24"
          strokeWidth="2"
          strokeLinecap="round"
        >
          {ANGULOS_DOS_RAIOS.map((angulo) => (
            <line
              key={angulo}
              x1="30"
              y1="5"
              x2="30"
              y2="8"
              transform={`rotate(${angulo} 30 16)`}
            />
          ))}
        </g>
        <circle cx="30" cy="16" r="7" fill="#fbbf24" />
      </g>
      <g className={classesDeVisibilidade(!ehDia)}>
        <circle cx="30" cy="16" r="7" fill="#f5f3ff" />
        <circle cx="27.5" cy="14.5" r="1.6" fill="#d9d2e6" />
        <circle cx="32" cy="19" r="2" fill="#d9d2e6" />
        <circle cx="75" cy="12" r="1.2" fill="#fde68a" />
        <circle cx="110" cy="20" r="1.2" fill="#fde68a" />
        <circle cx="140" cy="9" r="1.2" fill="#fde68a" />
      </g>
      <rect y="44" width="160" height="16" className="fill-borda" />
      <line
        className="cena-faixa stroke-suave"
        x1="0"
        y1="52"
        x2="160"
        y2="52"
        strokeWidth="1"
        strokeDasharray="8 8"
      />
      <g className="cena-caminhao">
        <g className={classesDeVisibilidade(!ehDia)}>
          <polygon points="32,40 56,33 56,47" fill="#fde68a" opacity="0.5" />
        </g>
        <rect x="0" y="30" width="22" height="14" rx="2" fill="#6d28d9" />
        <rect x="22" y="35" width="10" height="9" rx="2" fill="#fbbf24" />
        <circle cx="7" cy="46" r="3.5" fill="#1a1033" />
        <circle cx="26" cy="46" r="3.5" fill="#1a1033" />
      </g>
    </svg>
  )
}
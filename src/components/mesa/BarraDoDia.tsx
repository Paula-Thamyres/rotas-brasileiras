import type { Evento } from '../../types/eventos'
import type { PeriodoDoDia } from '../../engine/partida'
import { BotaoComoJogar } from '../tutorial/ComoJogar'
import { CenaDaEstrada } from './CenaDaEstrada'

interface BarraDoDiaProps {
  readonly rodada: number
  readonly periodo: PeriodoDoDia
  readonly evento: Evento
  readonly avisoDaUltimaRodada: string | null
}

const NOME_DO_PERIODO: Readonly<Record<PeriodoDoDia, string>> = {
  DIA: 'Dia',
  NOITE: 'Noite',
}

export function BarraDoDia({
  rodada,
  periodo,
  evento,
  avisoDaUltimaRodada,
}: BarraDoDiaProps) {
  return (
    <header className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-borda bg-painel px-4 py-3">
      <p className="text-sm">Rodada {rodada}</p>
      {avisoDaUltimaRodada !== null && (
        <p className="rounded-lg bg-aviso px-3 py-1 text-sm font-bold text-sobre-aviso">
          {avisoDaUltimaRodada}
        </p>
      )}
      <p className="flex items-center gap-2 text-sm">
        <CenaDaEstrada periodo={periodo} />
        {NOME_DO_PERIODO[periodo]} · <strong>{evento.nome}</strong>
        <span className="text-suave">{evento.descricao}</span>
      </p>
      <BotaoComoJogar />
    </header>
  )
}
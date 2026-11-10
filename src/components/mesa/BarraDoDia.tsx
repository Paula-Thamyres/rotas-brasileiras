import type { Evento } from '../../types/eventos'
import type { PeriodoDoDia } from '../../engine/partida'
import { BotaoComoJogar } from '../tutorial/ComoJogar'
import { IconeDoPeriodo } from './IconeDoPeriodo'

interface BarraDoDiaProps {
  readonly rodada: number
  readonly periodo: PeriodoDoDia
  readonly evento: Evento
}

const NOME_DO_PERIODO: Readonly<Record<PeriodoDoDia, string>> = {
  DIA: 'Dia',
  NOITE: 'Noite',
}

export function BarraDoDia({ rodada, periodo, evento }: BarraDoDiaProps) {
  return (
    <header className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-borda bg-painel px-4 py-3">
      <p className="text-sm">Rodada {rodada}</p>
      <p className="flex items-center gap-2 text-sm">
        <IconeDoPeriodo periodo={periodo} />
        {NOME_DO_PERIODO[periodo]} · <strong>{evento.nome}</strong>
        <span className="text-suave">{evento.descricao}</span>
      </p>
      <BotaoComoJogar />
    </header>
  )
}

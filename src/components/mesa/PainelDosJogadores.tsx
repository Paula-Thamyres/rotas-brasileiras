import type { Jogador } from '../../types/jogador'
import { corDoJogador } from '../../ui/jogadores'

interface PainelDosJogadoresProps {
  readonly jogadores: readonly Jogador[]
  readonly indiceDaVez: number
  readonly idsDosComputadores: ReadonlySet<string>
}

export function PainelDosJogadores({
  jogadores,
  indiceDaVez,
  idsDosComputadores,
}: PainelDosJogadoresProps) {
  return (
    <section aria-label="Jogadores">
      <h2 className="mb-2 text-xs font-semibold tracking-wider text-slate-400 uppercase">
        Jogadores
      </h2>
      <ul className="space-y-2">
        {jogadores.map((jogador, indice) => (
          <li
            key={jogador.id}
            aria-current={indice === indiceDaVez ? 'true' : undefined}
            className={`rounded-lg bg-slate-900 p-2 text-sm ${
              indice === indiceDaVez ? 'outline-2 outline-amber-400' : ''
            }`}
          >
            <div className="flex items-center gap-2 font-semibold">
              <span
                aria-hidden="true"
                className="h-3 w-3 rounded-full"
                style={{ background: corDoJogador(indice) }}
              />
              {jogador.nome}
              {idsDosComputadores.has(jogador.id) && (
                <span
                  title="Controlado pelo computador"
                  className="rounded bg-slate-700 px-1.5 text-[10px] font-bold text-slate-300"
                >
                  PC
                </span>
              )}
            </div>
            <p className="mt-1 text-xs text-slate-400">
              {jogador.pontos} pts · {jogador.caminhoes} caminhões ·{' '}
              {jogador.mao.length} cartas · {jogador.missoes.length} missões
            </p>
          </li>
        ))}
      </ul>
    </section>
  )
}

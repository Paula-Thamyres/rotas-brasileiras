import type { Missao } from '../../types/missoes'
import { descricaoDaMissao } from '../../ui/missoes'

interface MissoesDoJogadorProps {
  readonly missoes: readonly Missao[]
}

export function MissoesDoJogador({ missoes }: MissoesDoJogadorProps) {
  return (
    <section aria-label="Suas missões">
      <h2 className="mb-2 text-xs font-semibold tracking-wider text-suave uppercase">
        Suas missões
      </h2>
      {missoes.length === 0 ? (
        <p className="text-sm text-suave">Você não tem missões.</p>
      ) : (
        <ul className="space-y-2">
          {missoes.map((missao) => (
            <li
              key={missao.nome}
              className="rounded-lg border-l-4 border-destaque bg-interno p-2 text-sm"
            >
              <p className="font-semibold">
                {missao.nome} · {missao.pontos} pts
              </p>
              <p className="text-xs text-suave">
                {descricaoDaMissao(missao)}
              </p>
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}

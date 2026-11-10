import type { Classificacao } from '../../engine/classificacao'
import type { Jogador } from '../../types/jogador'
import { corDoJogador } from '../../ui/jogadores'
import { posicoesDaClassificacao, saldoComSinal } from '../../ui/resultado'

interface ResultadoFinalProps {
  readonly classificacao: readonly Classificacao[]
  readonly jogadores: readonly Jogador[]
  readonly idsDosComputadores: ReadonlySet<string>
}

const POSICAO_DO_VENCEDOR = 1

export function ResultadoFinal({
  classificacao,
  jogadores,
  idsDosComputadores,
}: ResultadoFinalProps) {
  const posicoes = posicoesDaClassificacao(classificacao)

  return (
    <section aria-label="Classificação final">
      <h2 className="mb-2 text-xs font-semibold tracking-wider text-suave uppercase">
        Classificação
      </h2>
      <ol className="space-y-2">
        {classificacao.map((item, indice) => {
          const { jogador } = item
          const posicao = posicoes[indice]
          const indiceDoJogador = jogadores.findIndex(
            ({ id }) => id === jogador.id,
          )

          return (
            <li
              key={jogador.id}
              className={`rounded-lg bg-interno p-3 text-base ${
                posicao === POSICAO_DO_VENCEDOR
                  ? 'outline-2 outline-destaque'
                  : ''
              }`}
            >
              <div className="flex items-center gap-2 font-semibold">
                <span>{posicao}º</span>
                <span
                  aria-hidden="true"
                  className="h-3 w-3 rounded-full"
                  style={{ background: corDoJogador(indiceDoJogador) }}
                />
                {jogador.nome}
                {idsDosComputadores.has(jogador.id) && (
                  <span
                    title="Controlado pelo computador"
                    className="rounded bg-borda px-1.5 text-xs font-bold text-suave"
                  >
                    PC
                  </span>
                )}
                <span className="ml-auto">{item.pontosFinais} pts</span>
              </div>
              <ul className="mt-1 text-sm text-suave">
                <li>Rotas e curiosidades: {jogador.pontos}</li>
                <li>Missões: {saldoComSinal(item.pontosDeMissoes)}</li>
                <li>
                  Caminho mais longo:{' '}
                  {saldoComSinal(item.bonusCaminhoMaisLongo)}
                </li>
              </ul>
            </li>
          )
        })}
      </ol>
    </section>
  )
}
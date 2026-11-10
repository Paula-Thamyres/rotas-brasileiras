import type { Jogador } from '../types/jogador'
import type { Rota } from '../types/mapa'
import { PONTOS_CAMINHO_MAIS_LONGO } from './constantes'
import { caminhoMaisLongo } from './caminhoMaisLongo'
import { saldoDeMissoes } from './missoes'
import type { Partida } from './partida'
import { idDaRota } from './rotas'

export interface Classificacao {
  readonly jogador: Jogador
  readonly bonusCaminhoMaisLongo: number
  readonly pontosDeMissoes: number
  readonly pontosFinais: number
}

function rotasDoJogador(
  jogador: Jogador,
  rotasPorId: ReadonlyMap<string, Rota>,
): Rota[] {
  return jogador.rotas.map((id) => {
    const rota = rotasPorId.get(id)

    if (rota === undefined) {
      throw new RangeError(`Rota do jogador não existe no mapa: ${id}.`)
    }

    return rota
  })
}

export function classificacaoFinal(
  partida: Partida,
  rotasDoMapa: readonly Rota[],
): Classificacao[] {
  if (!partida.encerrada) {
    throw new RangeError(
      'A classificação final só existe com a partida encerrada.',
    )
  }

  const rotasPorId = new Map(rotasDoMapa.map((rota) => [idDaRota(rota), rota]))
  const rotasDosJogadores = partida.jogadores.map((jogador) =>
    rotasDoJogador(jogador, rotasPorId),
  )
  const tamanhos = rotasDosJogadores.map(caminhoMaisLongo)
  const maior = Math.max(...tamanhos)

  return partida.jogadores
    .map((jogador, indice) => {
      const bonus =
        maior > 0 && tamanhos[indice] === maior ? PONTOS_CAMINHO_MAIS_LONGO : 0
      const pontosDeMissoes = saldoDeMissoes(
        jogador.missoes,
        rotasDosJogadores[indice],
      )

      return {
        jogador,
        bonusCaminhoMaisLongo: bonus,
        pontosDeMissoes,
        pontosFinais: jogador.pontos + bonus + pontosDeMissoes,
      }
    })
    .sort((a, b) => b.pontosFinais - a.pontosFinais)
}

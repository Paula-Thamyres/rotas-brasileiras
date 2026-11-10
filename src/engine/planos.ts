import type { Carta, CorDaCarta } from '../types/cartas'
import type { Rota } from '../types/mapa'
import { CODIGO_DA_COR_CINZA, CORES_DAS_CARTAS } from './constantes'
import {
  cartasDoPedagio,
  cartasParaPagarARota,
  valorDoCoringa,
} from './eventos'
import { eventoDaPartida, jogadorDaVez, type Partida } from './partida'
import { reivindicarRota } from './rotas'

export interface PlanoDeReivindicacao {
  readonly cor: CorDaCarta
  readonly coringasUsados: number
  readonly cartaDoPedagio: Carta | null
  readonly cartasPagas: readonly Carta[]
}

function coresPossiveis(rota: Rota): readonly CorDaCarta[] {
  return rota.cor === CODIGO_DA_COR_CINZA ? CORES_DAS_CARTAS : [rota.cor]
}

function cartasParaOPedagio(
  mao: readonly Carta[],
  exigePedagio: boolean,
): readonly (Carta | null)[] {
  return exigePedagio ? [...new Set(mao)] : [null]
}

export function planosDeReivindicacao(
  partida: Partida,
  rota: Rota,
): PlanoDeReivindicacao[] {
  if (
    partida.encerrada ||
    partida.oferta !== null ||
    partida.cartasCompradasNoTurno > 0
  ) {
    return []
  }

  const jogador = jogadorDaVez(partida)
  const evento = eventoDaPartida(partida)
  const maximoDeCoringas = Math.ceil(
    cartasParaPagarARota(evento, rota.espacos) / valorDoCoringa(evento),
  )
  const planos: PlanoDeReivindicacao[] = []

  for (const cor of coresPossiveis(rota)) {
    for (let coringas = 0; coringas <= maximoDeCoringas; coringas++) {
      for (const pedagio of cartasParaOPedagio(
        jogador.mao,
        cartasDoPedagio(evento) > 0,
      )) {
        const resultado = reivindicarRota({
          rota,
          jogador,
          donosDasRotas: partida.donosDasRotas,
          totalDeJogadores: partida.jogadores.length,
          cor: rota.cor === CODIGO_DA_COR_CINZA ? cor : undefined,
          coringasUsados: coringas,
          evento,
          cartaDoPedagio: pedagio ?? undefined,
        })

        if (resultado.valida) {
          planos.push({
            cor,
            coringasUsados: coringas,
            cartaDoPedagio: pedagio,
            cartasPagas: resultado.cartasPagas,
          })
        }
      }
    }
  }

  return planos
}

import type { Jogador } from '../types/jogador'
import type { Partida } from '../engine/partida'
import { motivoDeNomesInvalidos } from './nomes'

export interface ParticipanteDaPartida {
  readonly nome: string
  readonly computador: boolean
}

export function nomeDoComputador(posicao: number): string {
  return `Computador ${posicao}`
}

export function motivoDeParticipantesInvalidos(
  participantes: readonly ParticipanteDaPartida[],
): string | null {
  const motivoDosNomes = motivoDeNomesInvalidos(
    participantes.map(({ nome }) => nome),
  )

  if (motivoDosNomes !== null) return motivoDosNomes

  if (participantes.every(({ computador }) => computador)) {
    return 'Pelo menos um jogador precisa ser uma pessoa.'
  }

  return null
}

export function jogadorDoPainel(
  partida: Partida,
  idsDosComputadores: ReadonlySet<string>,
): Jogador {
  const total = partida.jogadores.length

  for (let recuo = 0; recuo < total; recuo++) {
    const indice = (partida.indiceDaVez - recuo + total) % total
    const jogador = partida.jogadores[indice]

    if (!idsDosComputadores.has(jogador.id)) return jogador
  }

  return partida.jogadores[partida.indiceDaVez]
}

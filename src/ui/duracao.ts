import {
  CAMINHOES_NA_PARTIDA_RAPIDA,
  CAMINHOES_POR_JOGADOR,
} from '../engine/constantes'

export type DuracaoDaPartida = 'NORMAL' | 'RAPIDA'

export const DURACAO_PADRAO: DuracaoDaPartida = 'NORMAL'

export const DURACOES_DA_PARTIDA: readonly DuracaoDaPartida[] = [
  'NORMAL',
  'RAPIDA',
]

export const NOME_DA_DURACAO: Readonly<Record<DuracaoDaPartida, string>> = {
  NORMAL: 'Normal',
  RAPIDA: 'Rápida',
}

const CAMINHOES_DA_DURACAO: Readonly<Record<DuracaoDaPartida, number>> = {
  NORMAL: CAMINHOES_POR_JOGADOR,
  RAPIDA: CAMINHOES_NA_PARTIDA_RAPIDA,
}

export function caminhoesDaDuracao(duracao: DuracaoDaPartida): number {
  return CAMINHOES_DA_DURACAO[duracao]
}
import { MAXIMO_DE_JOGADORES } from '../engine/constantes'

export const CORES_DOS_JOGADORES: readonly string[] = [
  '#ef4444',
  '#3b82f6',
  '#facc15',
  '#a855f7',
  '#f97316',
]

export function corDoJogador(indice: number): string {
  if (
    !Number.isInteger(indice) ||
    indice < 0 ||
    indice >= MAXIMO_DE_JOGADORES
  ) {
    throw new RangeError(
      `Posição de jogador inválida: ${indice}. Valores aceitos: 0 a ${MAXIMO_DE_JOGADORES - 1}.`,
    )
  }

  return CORES_DOS_JOGADORES[indice]
}

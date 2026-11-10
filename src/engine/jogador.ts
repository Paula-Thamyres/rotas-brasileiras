import type { Jogador } from '../types/jogador'
import { CAMINHOES_POR_JOGADOR } from './constantes'

export function criarJogador(
  id: string,
  nome: string,
  caminhoes: number = CAMINHOES_POR_JOGADOR,
): Jogador {
  if (id.trim() === '') {
    throw new RangeError('O jogador precisa de um id.')
  }

  if (nome.trim() === '') {
    throw new RangeError('O jogador precisa de um nome.')
  }

  if (!Number.isInteger(caminhoes) || caminhoes < 1) {
    throw new RangeError(`Quantidade de caminhões inválida: ${caminhoes}.`)
  }

  return {
    id,
    nome: nome.trim(),
    caminhoes,
    pontos: 0,
    mao: [],
    rotas: [],
    missoes: [],
  }
}
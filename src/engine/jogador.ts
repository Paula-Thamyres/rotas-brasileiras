import type { Jogador } from '../types/jogador'
import { CAMINHOES_POR_JOGADOR } from './constantes'

export function criarJogador(id: string, nome: string): Jogador {
  if (id.trim() === '') {
    throw new RangeError('O jogador precisa de um id.')
  }

  if (nome.trim() === '') {
    throw new RangeError('O jogador precisa de um nome.')
  }

  return {
    id,
    nome: nome.trim(),
    caminhoes: CAMINHOES_POR_JOGADOR,
    pontos: 0,
    mao: [],
    rotas: [],
    missoes: [],
  }
}

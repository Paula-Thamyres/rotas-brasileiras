import type { Carta } from './cartas'
import type { Missao } from './missoes'

export interface Jogador {
  readonly id: string
  readonly nome: string
  readonly caminhoes: number
  readonly pontos: number
  readonly mao: readonly Carta[]
  readonly rotas: readonly string[]
  readonly missoes: readonly Missao[]
}

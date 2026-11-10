export type TipoMissao = 'ligacao' | 'regiao'

export interface Missao {
  tipo: TipoMissao
  nome: string
  /** Cidades que precisam ficar ligadas pelas rotas do jogador. */
  cidades: string[]
  pontos: number
}

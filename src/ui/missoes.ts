import type { Missao } from '../types/missoes'

export function descricaoDaMissao(missao: Missao): string {
  return missao.cidades.join(' · ')
}

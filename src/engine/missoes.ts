import type { Missao } from '../types/missoes'
import type { Rota } from '../types/mapa'
import { MINIMO_DE_CIDADES_DA_MISSAO } from './constantes'

export function missaoCumprida(
  missao: Missao,
  rotas: readonly Rota[],
): boolean {
  if (missao.cidades.length < MINIMO_DE_CIDADES_DA_MISSAO) {
    throw new RangeError(
      `A missão "${missao.nome}" precisa de ao menos ${MINIMO_DE_CIDADES_DA_MISSAO} cidades.`,
    )
  }

  const pai = new Map<string, string>()

  function raiz(cidade: string): string {
    const atual = pai.get(cidade)

    if (atual === undefined || atual === cidade) {
      pai.set(cidade, cidade)
      return cidade
    }

    const topo = raiz(atual)
    pai.set(cidade, topo)
    return topo
  }

  for (const rota of rotas) {
    pai.set(raiz(rota.cidadeA), raiz(rota.cidadeB))
  }

  const [primeira, ...demais] = missao.cidades
  const raizDaPrimeira = raiz(primeira)

  return demais.every((cidade) => raiz(cidade) === raizDaPrimeira)
}

export function saldoDeMissoes(
  missoes: readonly Missao[],
  rotas: readonly Rota[],
): number {
  return missoes.reduce(
    (saldo, missao) =>
      saldo + (missaoCumprida(missao, rotas) ? missao.pontos : -missao.pontos),
    0,
  )
}

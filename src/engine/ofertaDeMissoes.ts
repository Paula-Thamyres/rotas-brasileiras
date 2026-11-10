import type { Missao } from '../types/missoes'

export interface OfertaDeMissoes {
  readonly missoes: readonly Missao[]
  readonly minimoParaManter: number
}

export type EscolhaDeMissoes =
  | {
      readonly valida: true
      readonly mantidas: readonly Missao[]
      readonly devolvidas: readonly Missao[]
    }
  | { readonly valida: false }

export function sacarOferta(
  monte: readonly Missao[],
  quantidade: number,
  minimoParaManter: number,
): { oferta: OfertaDeMissoes; resto: readonly Missao[] } {
  if (monte.length === 0) {
    throw new RangeError('Não há missões no monte para oferecer.')
  }

  const missoes = monte.slice(0, quantidade)

  return {
    oferta: {
      missoes,
      minimoParaManter: Math.min(minimoParaManter, missoes.length),
    },
    resto: monte.slice(quantidade),
  }
}

export function aplicarEscolha(
  oferta: OfertaDeMissoes,
  nomesMantidos: readonly string[],
): EscolhaDeMissoes {
  const nomesOferecidos = oferta.missoes.map((missao) => missao.nome)

  if (new Set(nomesMantidos).size !== nomesMantidos.length) {
    throw new RangeError('A mesma missão foi escolhida mais de uma vez.')
  }

  for (const nome of nomesMantidos) {
    if (!nomesOferecidos.includes(nome)) {
      throw new RangeError(`A missão "${nome}" não estava entre as oferecidas.`)
    }
  }

  if (nomesMantidos.length < oferta.minimoParaManter) {
    return { valida: false }
  }

  return {
    valida: true,
    mantidas: oferta.missoes.filter((missao) =>
      nomesMantidos.includes(missao.nome),
    ),
    devolvidas: oferta.missoes.filter(
      (missao) => !nomesMantidos.includes(missao.nome),
    ),
  }
}

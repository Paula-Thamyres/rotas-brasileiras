import type { PlanoDeReivindicacao } from '../engine/planos'
import type { Carta, CorDaCarta } from '../types/cartas'

export interface EscolhaDePagamento {
  readonly cor?: CorDaCarta
  readonly coringas?: number
  readonly pedagio?: Carta | null
}

export interface OpcoesDePagamento {
  readonly cores: readonly CorDaCarta[]
  readonly coringas: readonly number[]
  readonly pedagios: readonly (Carta | null)[]
}

function valoresDistintos<T>(valores: readonly T[]): T[] {
  return [...new Set(valores)]
}

function filtrar(
  planos: readonly PlanoDeReivindicacao[],
  escolha: EscolhaDePagamento,
): PlanoDeReivindicacao[] {
  return planos.filter(
    (plano) =>
      (escolha.cor === undefined || plano.cor === escolha.cor) &&
      (escolha.coringas === undefined ||
        plano.coringasUsados === escolha.coringas) &&
      (escolha.pedagio === undefined ||
        plano.cartaDoPedagio === escolha.pedagio),
  )
}

function valorUnico<T>(opcoes: readonly T[], escolhido: T | undefined) {
  return escolhido ?? (opcoes.length === 1 ? opcoes[0] : undefined)
}

export function opcoesDePagamento(
  planos: readonly PlanoDeReivindicacao[],
  escolha: EscolhaDePagamento,
): OpcoesDePagamento {
  const cores = valoresDistintos(planos.map((plano) => plano.cor))
  const comCor = filtrar(planos, { cor: valorUnico(cores, escolha.cor) })
  const coringas = valoresDistintos(comCor.map((plano) => plano.coringasUsados))
  const comCoringas = filtrar(comCor, {
    coringas: valorUnico(coringas, escolha.coringas),
  })

  return {
    cores,
    coringas,
    pedagios: valoresDistintos(
      comCoringas.map((plano) => plano.cartaDoPedagio),
    ),
  }
}

export function planoEscolhido(
  planos: readonly PlanoDeReivindicacao[],
  escolha: EscolhaDePagamento,
): PlanoDeReivindicacao | null {
  const { cores, coringas, pedagios } = opcoesDePagamento(planos, escolha)
  const restantes = filtrar(planos, {
    cor: valorUnico(cores, escolha.cor),
    coringas: valorUnico(coringas, escolha.coringas),
    pedagio: valorUnico(pedagios, escolha.pedagio),
  })

  return restantes.length === 1 ? restantes[0] : null
}

import { describe, expect, it } from 'vitest'
import type { PlanoDeReivindicacao } from '../engine/planos'
import { opcoesDePagamento, planoEscolhido } from './pagamento'

function plano(
  cor: PlanoDeReivindicacao['cor'],
  coringasUsados: number,
  cartaDoPedagio: PlanoDeReivindicacao['cartaDoPedagio'] = null,
): PlanoDeReivindicacao {
  return { cor, coringasUsados, cartaDoPedagio, cartasPagas: [] }
}

const planosDaRotaCinza = [plano('AM', 0), plano('AM', 1), plano('CE', 0)]

describe('opções de pagamento da rota', () => {
  it('lista as cores possíveis e, depois da cor, os Estepes possíveis', () => {
    expect(opcoesDePagamento(planosDaRotaCinza, {}).cores).toEqual(['AM', 'CE'])
    expect(
      opcoesDePagamento(planosDaRotaCinza, { cor: 'AM' }).coringas,
    ).toEqual([0, 1])
    expect(
      opcoesDePagamento(planosDaRotaCinza, { cor: 'CE' }).coringas,
    ).toEqual([0])
  })

  it('só lista as cartas do pedágio que servem para as escolhas anteriores', () => {
    const planos = [
      plano('AM', 0, 'CE'),
      plano('AM', 0, 'PA'),
      plano('AM', 1, 'CE'),
    ]

    expect(
      opcoesDePagamento(planos, { cor: 'AM', coringas: 1 }).pedagios,
    ).toEqual(['CE'])
    expect(
      opcoesDePagamento(planos, { cor: 'AM', coringas: 0 }).pedagios,
    ).toEqual(['CE', 'PA'])
  })
})

describe('plano escolhido', () => {
  it('escolhe sozinho quando só há um plano', () => {
    const unico = plano('AM', 1)

    expect(planoEscolhido([unico], {})).toBe(unico)
  })

  it('escolhe sozinho os valores que só têm uma opção', () => {
    expect(planoEscolhido(planosDaRotaCinza, { cor: 'CE' })).toBe(
      planosDaRotaCinza[2],
    )
  })

  it('devolve nulo enquanto ainda falta escolher', () => {
    expect(planoEscolhido(planosDaRotaCinza, {})).toBeNull()
    expect(planoEscolhido(planosDaRotaCinza, { cor: 'AM' })).toBeNull()
  })

  it('devolve o plano completo depois de todas as escolhas', () => {
    expect(planoEscolhido(planosDaRotaCinza, { cor: 'AM', coringas: 1 })).toBe(
      planosDaRotaCinza[1],
    )
  })

  it('distingue a ausência de carta do pedágio de uma carta escolhida', () => {
    const planos = [plano('AM', 0, null), plano('AM', 1, 'CE')]

    expect(planoEscolhido(planos, { coringas: 0 })).toBe(planos[0])
    expect(planoEscolhido(planos, { coringas: 1 })).toBe(planos[1])
  })

  it('devolve nulo sem planos', () => {
    expect(planoEscolhido([], {})).toBeNull()
  })
})

import { describe, expect, it } from 'vitest'
import type { Missao } from '../types/missoes'
import { aplicarEscolha, sacarOferta } from './ofertaDeMissoes'

function missao(nome: string): Missao {
  return { tipo: 'ligacao', nome, cidades: ['A', 'B'], pontos: 5 }
}

const monte = ['M1', 'M2', 'M3', 'M4', 'M5'].map(missao)

describe('sacar oferta', () => {
  it('tira as primeiras missões do monte', () => {
    const { oferta, resto } = sacarOferta(monte, 3, 2)

    expect(oferta.missoes.map((m) => m.nome)).toEqual(['M1', 'M2', 'M3'])
    expect(oferta.minimoParaManter).toBe(2)
    expect(resto.map((m) => m.nome)).toEqual(['M4', 'M5'])
  })

  it('oferece só o que sobrou e reduz o mínimo se for preciso', () => {
    const { oferta, resto } = sacarOferta([missao('M1')], 3, 2)

    expect(oferta.missoes).toHaveLength(1)
    expect(oferta.minimoParaManter).toBe(1)
    expect(resto).toEqual([])
  })

  it('recusa monte vazio', () => {
    expect(() => sacarOferta([], 3, 1)).toThrow(RangeError)
  })

  it('não altera o monte recebido', () => {
    sacarOferta(monte, 3, 2)

    expect(monte).toHaveLength(5)
  })
})

describe('aplicar escolha', () => {
  const { oferta } = sacarOferta(monte, 3, 2)

  it('separa as mantidas das devolvidas', () => {
    const escolha = aplicarEscolha(oferta, ['M1', 'M3'])

    expect(escolha).toMatchObject({ valida: true })
    expect(escolha.valida && escolha.mantidas.map((m) => m.nome)).toEqual([
      'M1',
      'M3',
    ])
    expect(escolha.valida && escolha.devolvidas.map((m) => m.nome)).toEqual([
      'M2',
    ])
  })

  it('aceita ficar com todas', () => {
    const escolha = aplicarEscolha(oferta, ['M1', 'M2', 'M3'])

    expect(escolha.valida && escolha.devolvidas).toEqual([])
  })

  it('recusa ficar com menos do que o mínimo', () => {
    expect(aplicarEscolha(oferta, ['M1'])).toEqual({ valida: false })
    expect(aplicarEscolha(oferta, [])).toEqual({ valida: false })
  })

  it('recusa missão que não foi oferecida', () => {
    expect(() => aplicarEscolha(oferta, ['M1', 'M5'])).toThrow(RangeError)
  })

  it('recusa a mesma missão escolhida duas vezes', () => {
    expect(() => aplicarEscolha(oferta, ['M1', 'M1'])).toThrow(RangeError)
  })
})

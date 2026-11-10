import { describe, expect, it } from 'vitest'
import type { Classificacao } from '../engine/classificacao'
import {
  mensagemDoResultado,
  posicoesDaClassificacao,
  saldoComSinal,
  vencedoresDaClassificacao,
} from './resultado'

function colocacao(nome: string, pontosFinais: number): Classificacao {
  return {
    jogador: {
      id: nome,
      nome,
      caminhoes: 0,
      pontos: 0,
      mao: [],
      rotas: [],
      missoes: [],
    },
    bonusCaminhoMaisLongo: 0,
    pontosDeMissoes: 0,
    pontosFinais,
  }
}

describe('mensagemDoResultado', () => {
  it('anuncia o vencedor com os pontos finais', () => {
    const classificacao = [colocacao('Paula', 52), colocacao('Ana', 41)]

    expect(mensagemDoResultado(classificacao)).toBe('Paula venceu com 52 pontos.')
  })

  it('usa o singular quando o vencedor tem 1 ponto', () => {
    const classificacao = [colocacao('Paula', 1), colocacao('Ana', 0)]

    expect(mensagemDoResultado(classificacao)).toBe('Paula venceu com 1 ponto.')
  })

  it('anuncia o empate entre dois jogadores', () => {
    const classificacao = [colocacao('Paula', 40), colocacao('Ana', 40)]

    expect(mensagemDoResultado(classificacao)).toBe(
      'Empate entre Paula e Ana, com 40 pontos cada.',
    )
  })

  it('anuncia o empate entre três jogadores', () => {
    const classificacao = [
      colocacao('Paula', 30),
      colocacao('Ana', 30),
      colocacao('Beto', 30),
    ]

    expect(mensagemDoResultado(classificacao)).toBe(
      'Empate entre Paula, Ana e Beto, com 30 pontos cada.',
    )
  })

  it('rejeita uma classificação vazia', () => {
    expect(() => mensagemDoResultado([])).toThrow(RangeError)
  })
})

describe('vencedoresDaClassificacao', () => {
  it('devolve só quem tem a maior pontuação', () => {
    const classificacao = [colocacao('Paula', 52), colocacao('Ana', 41)]

    expect(vencedoresDaClassificacao(classificacao)).toEqual([classificacao[0]])
  })

  it('devolve todos os empatados no topo', () => {
    const classificacao = [
      colocacao('Paula', 40),
      colocacao('Ana', 40),
      colocacao('Beto', 25),
    ]

    expect(vencedoresDaClassificacao(classificacao)).toEqual([
      classificacao[0],
      classificacao[1],
    ])
  })
})

describe('posicoesDaClassificacao', () => {
  it('repete a posição nos empates e pula a seguinte', () => {
    const classificacao = [
      colocacao('Paula', 52),
      colocacao('Ana', 41),
      colocacao('Beto', 41),
      colocacao('Duda', 30),
    ]

    expect(posicoesDaClassificacao(classificacao)).toEqual([1, 2, 2, 4])
  })

  it('devolve uma lista vazia para uma classificação vazia', () => {
    expect(posicoesDaClassificacao([])).toEqual([])
  })
})

describe('saldoComSinal', () => {
  it.each([
    [8, '+8'],
    [-3, '-3'],
    [0, '0'],
  ])('mostra %s como %s', (valor, esperado) => {
    expect(saldoComSinal(valor)).toBe(esperado)
  })
})
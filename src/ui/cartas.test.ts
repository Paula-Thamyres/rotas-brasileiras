import { describe, expect, it } from 'vitest'
import { CORES_DAS_CARTAS, NOME_DO_CORINGA } from '../engine/constantes'
import {
  agruparCartas,
  descreverCartas,
  corDeFundoDaCarta,
  corDoTextoSobre,
  nomeDaCarta,
} from './cartas'

describe('nome e cor das cartas', () => {
  it('usa o nome da região para cartas de cor e Estepe para o coringa', () => {
    expect(nomeDaCarta('AM')).toBe('Amazônia')
    expect(nomeDaCarta('MA')).toBe('Mata Atlântica')
    expect(nomeDaCarta('CORINGA')).toBe(NOME_DO_CORINGA)
  })

  it('dá cor de fundo às cartas de região e nenhuma ao coringa', () => {
    for (const cor of CORES_DAS_CARTAS) {
      expect(corDeFundoDaCarta(cor)).toMatch(/^#[0-9A-Fa-f]{6}$/)
    }

    expect(corDeFundoDaCarta('CORINGA')).toBeNull()
  })

  it('escolhe texto escuro sobre fundo claro e claro sobre fundo escuro', () => {
    expect(corDoTextoSobre('#97C459')).toBe('#1f2937')
    expect(corDoTextoSobre('#3B6D11')).toBe('#ffffff')
  })
})

describe('agrupar cartas da mão', () => {
  it('conta cada carta, na ordem das regiões, com o Estepe por último', () => {
    const mao = ['CORINGA', 'LI', 'AM', 'LI', 'AM', 'AM'] as const

    expect(agruparCartas(mao)).toEqual([
      { carta: 'AM', quantidade: 3 },
      { carta: 'LI', quantidade: 2 },
      { carta: 'CORINGA', quantidade: 1 },
    ])
  })

  it('devolve lista vazia para mão vazia', () => {
    expect(agruparCartas([])).toEqual([])
  })
})

describe('descrever cartas', () => {
  it('lista a quantidade e o nome de cada carta', () => {
    expect(descreverCartas(['AM', 'CORINGA', 'AM'])).toBe(
      '2× Amazônia + 1× Estepe',
    )
  })

  it('devolve texto vazio quando não há cartas', () => {
    expect(descreverCartas([])).toBe('')
  })
})

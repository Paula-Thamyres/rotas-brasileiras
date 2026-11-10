import { describe, expect, it } from 'vitest'
import { avisoDaUltimaRodada } from './ultimaRodada'

describe('avisoDaUltimaRodada', () => {
  it('não avisa enquanto a última rodada não começou', () => {
    expect(avisoDaUltimaRodada(null)).toBeNull()
  })

  it('não avisa quando a partida já acabou', () => {
    expect(avisoDaUltimaRodada(0)).toBeNull()
  })

  it('informa quantas jogadas faltam', () => {
    expect(avisoDaUltimaRodada(3)).toBe(
      'Última rodada: faltam 3 jogadas para o fim.',
    )
  })

  it('usa o singular quando falta uma jogada', () => {
    expect(avisoDaUltimaRodada(1)).toBe(
      'Última rodada: faltam 1 jogada para o fim.',
    )
  })

  it('recusa valor que não é inteiro', () => {
    expect(() => avisoDaUltimaRodada(1.5)).toThrow(RangeError)
  })
})
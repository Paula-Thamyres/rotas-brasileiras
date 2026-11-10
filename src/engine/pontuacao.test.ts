import { describe, expect, it } from 'vitest'
import { pontosDaRota } from './pontuacao'

describe('pontosDaRota', () => {
  it.each([
    [1, 1],
    [2, 2],
    [3, 4],
    [4, 7],
    [5, 10],
    [6, 15],
  ])('uma rota de %i espaços vale %i pontos', (espacos, pontos) => {
    expect(pontosDaRota(espacos)).toBe(pontos)
  })
  
  it.each([0, 7, -1, 2.5, Number.NaN])(
    'recusa o tamanho inválido %s',
    (espacos) => {
      expect(() => pontosDaRota(espacos)).toThrow(RangeError)
    },
  )
})

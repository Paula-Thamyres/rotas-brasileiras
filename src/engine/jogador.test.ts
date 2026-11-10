import { describe, expect, it } from 'vitest'
import { CAMINHOES_POR_JOGADOR } from './constantes'
import { criarJogador } from './jogador'

describe('criar jogador', () => {
  it('começa com 45 caminhões, sem pontos, sem cartas, sem rotas e sem missões', () => {
    expect(criarJogador('ana', ' Ana ')).toEqual({
      id: 'ana',
      nome: 'Ana',
      caminhoes: CAMINHOES_POR_JOGADOR,
      pontos: 0,
      mao: [],
      rotas: [],
      missoes: [],
    })
  })

  it('aceita uma quantidade própria de caminhões', () => {
    expect(criarJogador('ana', 'Ana', 20).caminhoes).toBe(20)
  })

  it.each([0, -3, 2.5, Number.NaN])(
    'recusa quantidade inválida de caminhões (%j)',
    (caminhoes) => {
      expect(() => criarJogador('ana', 'Ana', caminhoes)).toThrow(RangeError)
    },
  )

  it.each(['', '   '])('recusa id vazio (%j)', (id) => {
    expect(() => criarJogador(id, 'Ana')).toThrow(RangeError)
  })

  it.each(['', '   '])('recusa nome vazio (%j)', (nome) => {
    expect(() => criarJogador('ana', nome)).toThrow(RangeError)
  })
})
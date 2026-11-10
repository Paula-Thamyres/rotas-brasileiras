import { describe, expect, it } from 'vitest'
import { MAXIMO_DE_JOGADORES } from '../engine/constantes'
import { CORES_DOS_JOGADORES, corDoJogador } from './jogadores'

describe('cores dos jogadores', () => {
  it('tem uma cor diferente para cada lugar da mesa', () => {
    expect(CORES_DOS_JOGADORES).toHaveLength(MAXIMO_DE_JOGADORES)
    expect(new Set(CORES_DOS_JOGADORES).size).toBe(MAXIMO_DE_JOGADORES)
  })

  it('devolve a cor da posição pedida', () => {
    expect(corDoJogador(0)).toBe(CORES_DOS_JOGADORES[0])
  })

  it('recusa posição fora da mesa', () => {
    expect(() => corDoJogador(-1)).toThrow(RangeError)
    expect(() => corDoJogador(MAXIMO_DE_JOGADORES)).toThrow(RangeError)
    expect(() => corDoJogador(1.5)).toThrow(RangeError)
  })
})

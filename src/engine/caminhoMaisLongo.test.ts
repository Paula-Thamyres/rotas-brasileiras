import { describe, expect, it } from 'vitest'
import type { Rota } from '../types/mapa'
import { caminhoMaisLongo } from './caminhoMaisLongo'

function rota(cidadeA: string, cidadeB: string, espacos: number): Rota {
  return { cidadeA, cidadeB, espacos, paralela: null, cor: 'GR' }
}

describe('caminho mais longo', () => {
  it('é zero sem nenhuma rota', () => {
    expect(caminhoMaisLongo([])).toBe(0)
  })

  it('é o tamanho da rota quando há só uma', () => {
    expect(caminhoMaisLongo([rota('A', 'B', 3)])).toBe(3)
  })

  it('soma rotas em sequência', () => {
    expect(caminhoMaisLongo([rota('A', 'B', 3), rota('B', 'C', 2)])).toBe(5)
  })

  it('escolhe o maior trecho quando o caminho se ramifica', () => {
    const rotas = [rota('A', 'B', 3), rota('B', 'C', 2), rota('B', 'D', 4)]

    expect(caminhoMaisLongo(rotas)).toBe(7)
  })

  it('percorre um ciclo inteiro sem repetir rota', () => {
    const rotas = [rota('A', 'B', 1), rota('B', 'C', 2), rota('C', 'A', 3)]

    expect(caminhoMaisLongo(rotas)).toBe(6)
  })

  it('passa duas vezes pela mesma cidade, sem repetir rota', () => {
    const rotas = [
      rota('A', 'B', 2),
      rota('B', 'C', 2),
      rota('C', 'A', 2),
      rota('A', 'D', 5),
    ]

    expect(caminhoMaisLongo(rotas)).toBe(11)
  })

  it('ignora rotas separadas do resto quando são menores', () => {
    const rotas = [rota('A', 'B', 6), rota('X', 'Y', 2)]

    expect(caminhoMaisLongo(rotas)).toBe(6)
  })

  it('não altera a lista recebida', () => {
    const rotas = [rota('A', 'B', 3), rota('B', 'C', 2)]
    const copia = [...rotas]

    caminhoMaisLongo(rotas)

    expect(rotas).toEqual(copia)
  })
})

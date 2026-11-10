import { describe, expect, it } from 'vitest'
import { mapa, missoes } from '../data'
import type { Rota } from '../types/mapa'
import type { Missao } from '../types/missoes'
import { missaoCumprida, saldoDeMissoes } from './missoes'

function rota(cidadeA: string, cidadeB: string, espacos = 2): Rota {
  return { cidadeA, cidadeB, espacos, paralela: null, cor: 'GR' }
}

function missao(cidades: string[], pontos = 10): Missao {
  return { tipo: 'ligacao', nome: cidades.join(' a '), cidades, pontos }
}

function menorCaminhoEmEspacos(origem: string, destino: string): number {
  const distancias = new Map<string, number>([[origem, 0]])
  const fila = [origem]

  while (fila.length > 0) {
    fila.sort((a, b) => (distancias.get(a) ?? 0) - (distancias.get(b) ?? 0))
    const atual = fila.shift() as string
    const distanciaAtual = distancias.get(atual) ?? 0

    for (const { cidadeA, cidadeB, espacos } of mapa.rotas) {
      const vizinha =
        cidadeA === atual ? cidadeB : cidadeB === atual ? cidadeA : null

      if (vizinha === null) continue

      const nova = distanciaAtual + espacos

      if (nova < (distancias.get(vizinha) ?? Number.POSITIVE_INFINITY)) {
        distancias.set(vizinha, nova)
        fila.push(vizinha)
      }
    }
  }

  return distancias.get(destino) ?? Number.POSITIVE_INFINITY
}

describe('missão cumprida', () => {
  it('vale com uma rota direta entre as cidades', () => {
    expect(missaoCumprida(missao(['A', 'B']), [rota('A', 'B')])).toBe(true)
  })

  it('vale com rotas em sequência, em qualquer direção', () => {
    const rotas = [rota('C', 'B'), rota('A', 'B')]

    expect(missaoCumprida(missao(['A', 'C']), rotas)).toBe(true)
    expect(missaoCumprida(missao(['C', 'A']), rotas)).toBe(true)
  })

  it('não vale quando as cidades estão em ligações separadas', () => {
    const rotas = [rota('A', 'B'), rota('C', 'D')]

    expect(missaoCumprida(missao(['A', 'D']), rotas)).toBe(false)
  })

  it('não vale quando uma das cidades não tem rota do jogador', () => {
    expect(missaoCumprida(missao(['A', 'Z']), [rota('A', 'B')])).toBe(false)
  })

  it('não vale sem nenhuma rota', () => {
    expect(missaoCumprida(missao(['A', 'B']), [])).toBe(false)
  })

  it('exige que todas as cidades de uma missão de região estejam ligadas', () => {
    const regiao = missao(['A', 'B', 'C'])

    expect(missaoCumprida(regiao, [rota('A', 'B'), rota('B', 'C')])).toBe(true)
    expect(missaoCumprida(regiao, [rota('A', 'B')])).toBe(false)
  })

  it('recusa missão com menos de 2 cidades', () => {
    expect(() => missaoCumprida(missao(['A']), [])).toThrow(RangeError)
  })
})

describe('saldo de missões', () => {
  it('soma as cumpridas e desconta as não cumpridas', () => {
    const feita = missao(['A', 'B'], 12)
    const naoFeita = missao(['A', 'Z'], 5)

    expect(saldoDeMissoes([feita, naoFeita], [rota('A', 'B')])).toBe(7)
  })

  it('é zero sem missões', () => {
    expect(saldoDeMissoes([], [rota('A', 'B')])).toBe(0)
  })
})

describe('missões do jogo', () => {
  it('todas podem ser cumpridas com as rotas do mapa', () => {
    for (const item of missoes) {
      expect(missaoCumprida(item, mapa.rotas)).toBe(true)
    }
  })

  it('as missões de ligação valem o menor caminho entre as duas cidades', () => {
    for (const item of missoes.filter((m) => m.tipo === 'ligacao')) {
      const [origem, destino] = item.cidades

      expect(item.pontos).toBe(menorCaminhoEmEspacos(origem, destino))
    }
  })
})

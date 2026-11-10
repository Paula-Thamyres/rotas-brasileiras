import { describe, expect, it } from 'vitest'
import { mapa } from '../../data'
import { projetar } from './projecao'
import { segmentosDaRota } from './segmentosDaRota'

const ORIGEM = { x: 0, y: 0 }
const DESTINO = { x: 100, y: 0 }

describe('segmentosDaRota', () => {
  it('divide a rota em um segmento por espaço, com margem nas cidades', () => {
    const segmentos = segmentosDaRota(ORIGEM, DESTINO, 2, null)
    const posicoesEmX = segmentos.flatMap((s) => [s.inicio.x, s.fim.x])

    expect(posicoesEmX).toEqual([10, 48, 52, 90])
  })

  it.each([1, 2, 3, 4, 5, 6])('gera %i segmentos de mesmo tamanho', (espacos) => {
    const segmentos = segmentosDaRota(
      ORIGEM,
      { x: 400, y: 0 },
      espacos,
      null,
    )
    const tamanhos = segmentos.map((s) => s.fim.x - s.inicio.x)

    expect(segmentos).toHaveLength(espacos)
    expect(new Set(tamanhos.map((t) => t.toFixed(6))).size).toBe(1)
  })

  it('afasta as duas rotas paralelas para lados opostos', () => {
    const ladoUm = segmentosDaRota(ORIGEM, DESTINO, 2, 0)
    const ladoDois = segmentosDaRota(ORIGEM, DESTINO, 2, 1)

    expect(ladoUm.map((s) => s.inicio.y)).toEqual([-5, -5])
    expect(ladoDois.map((s) => s.inicio.y)).toEqual([5, 5])
  })

  it.each([0, 1.5, -2, Number.NaN])(
    'recusa a quantidade de espaços inválida (%s)',
    (espacos) => {
      expect(() => segmentosDaRota(ORIGEM, DESTINO, espacos, null)).toThrow(
        RangeError,
      )
    },
  )

  it('recusa cidades próximas demais ou no mesmo lugar', () => {
    expect(() =>
      segmentosDaRota(ORIGEM, { x: 20, y: 0 }, 1, null),
    ).toThrow(RangeError)
    expect(() => segmentosDaRota(ORIGEM, ORIGEM, 1, null)).toThrow(RangeError)
  })

  it('consegue desenhar todas as rotas reais do mapa', () => {
    for (const rota of mapa.rotas) {
      const origem = projetar(mapa.cidades[rota.cidadeA])
      const destino = projetar(mapa.cidades[rota.cidadeB])

      expect(() =>
        segmentosDaRota(origem, destino, rota.espacos, rota.paralela),
      ).not.toThrow()
    }
  })
})

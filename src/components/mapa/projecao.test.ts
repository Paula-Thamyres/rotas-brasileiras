import { describe, expect, it } from 'vitest'
import { contorno, mapa } from '../../data'
import { ALTURA_DO_MAPA, LARGURA_DO_MAPA, projetar } from './projecao'

describe('projetar', () => {
  it('coloca o canto noroeste na margem do mapa', () => {
    expect(projetar({ lon: -74, lat: 5.5 })).toEqual({ x: 30, y: 10 })
  })

  it('converte Boa Vista para a posição esperada', () => {
    const { x, y } = projetar({ lon: -60.67, lat: 2.82 })

    expect(x).toBeCloseTo(256.61, 2)
    expect(y).toBeCloseTo(55.56, 2)
  })

  it('mantém todas as cidades e o contorno dentro da área do mapa', () => {
    const coordenadas = [
      ...Object.values(mapa.cidades),
      ...contorno.map(([lon, lat]) => ({ lon, lat })),
    ]

    for (const coordenada of coordenadas) {
      const { x, y } = projetar(coordenada)

      expect(x).toBeGreaterThanOrEqual(0)
      expect(x).toBeLessThanOrEqual(LARGURA_DO_MAPA)
      expect(y).toBeGreaterThanOrEqual(0)
      expect(y).toBeLessThanOrEqual(ALTURA_DO_MAPA)
    }
  })

  it.each([Number.NaN, Number.POSITIVE_INFINITY])(
    'recusa coordenada inválida (%s)',
    (valor) => {
      expect(() => projetar({ lon: valor, lat: 0 })).toThrow(RangeError)
      expect(() => projetar({ lon: 0, lat: valor })).toThrow(RangeError)
    },
  )
})

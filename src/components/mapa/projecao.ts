import type { Coordenada } from '../../types/mapa'

export const LARGURA_DO_MAPA = 860
export const ALTURA_DO_MAPA = 700

const MARGEM_ESQUERDA = 30
const MARGEM_SUPERIOR = 10
const PIXELS_POR_GRAU = 17
const LONGITUDE_DA_BORDA_OESTE = -74
const LATITUDE_DA_BORDA_NORTE = 5.5

export interface Ponto {
  x: number
  y: number
}

export function projetar({ lon, lat }: Coordenada): Ponto {
  if (!Number.isFinite(lon) || !Number.isFinite(lat)) {
    throw new RangeError(`Coordenada inválida: lon=${lon}, lat=${lat}.`)
  }

  return {
    x: MARGEM_ESQUERDA + (lon - LONGITUDE_DA_BORDA_OESTE) * PIXELS_POR_GRAU,
    y: MARGEM_SUPERIOR + (LATITUDE_DA_BORDA_NORTE - lat) * PIXELS_POR_GRAU,
  }
}

import type { CodigoCor } from '../../types/mapa'

export const COR_DA_ROTA: Readonly<Record<CodigoCor, string>> = {
  AM: '#3B6D11',
  CE: '#EF9F27',
  PA: '#1D9E75',
  CA: '#993C1D',
  MA: '#97C459',
  PM: '#7F77DD',
  LI: '#378ADD',
  SE: '#D4537E',
  GR: '#B4B2A9',
}

export const TEMA_DIA = {
  fundo: '#D3D1C7',
  terra: '#F1EFE8',
  estrada: '#5F5E5A',
} as const

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

export const TEMA_DO_MAPA = {
  fundo: 'var(--color-mapa-fundo)',
  terra: 'var(--color-mapa-terra)',
  estrada: 'var(--color-mapa-estrada)',
} as const

import { PONTOS_POR_TAMANHO_DA_ROTA } from './constantes'

export function pontosDaRota(espacos: number): number {
  const pontos = PONTOS_POR_TAMANHO_DA_ROTA[espacos]

  if (pontos === undefined) {
    const validos = Object.keys(PONTOS_POR_TAMANHO_DA_ROTA).join(', ')
    throw new RangeError(
      `Tamanho de rota inválido: ${espacos}. Valores aceitos: ${validos}.`,
    )
  }

  return pontos
}

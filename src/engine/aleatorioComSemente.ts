import type { Aleatorio } from './baralho'

export function aleatorioComSemente(semente: number): Aleatorio {
  let estado = semente

  return () => {
    estado = (estado + 0x6d2b79f5) | 0
    let mistura = Math.imul(estado ^ (estado >>> 15), 1 | estado)
    mistura =
      (mistura + Math.imul(mistura ^ (mistura >>> 7), 61 | mistura)) ^ mistura

    return ((mistura ^ (mistura >>> 14)) >>> 0) / 4294967296
  }
}

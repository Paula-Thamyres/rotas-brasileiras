import type { Curiosidade } from '../types/curiosidades'

export type CidadesDescobertas = Readonly<Record<string, string>>

export function validarCuriosidades(
  curiosidades: readonly Curiosidade[],
): void {
  const cidades = curiosidades.map((curiosidade) => curiosidade.cidade)

  if (new Set(cidades).size !== cidades.length) {
    throw new RangeError('Cada cidade pode ter só uma curiosidade.')
  }
}

export function curiosidadesNovas(
  curiosidades: readonly Curiosidade[],
  descobertas: CidadesDescobertas,
  cidadesDaRota: readonly string[],
): Curiosidade[] {
  return curiosidades.filter(
    (curiosidade) =>
      cidadesDaRota.includes(curiosidade.cidade) &&
      !(curiosidade.cidade in descobertas),
  )
}

export function registrarDescobertas(
  descobertas: CidadesDescobertas,
  novas: readonly Curiosidade[],
  idDoJogador: string,
): CidadesDescobertas {
  return {
    ...descobertas,
    ...Object.fromEntries(
      novas.map((curiosidade) => [curiosidade.cidade, idDoJogador]),
    ),
  }
}

export function pontosDasCuriosidades(
  curiosidades: readonly Curiosidade[],
): number {
  return curiosidades.reduce(
    (soma, curiosidade) => soma + curiosidade.pontos,
    0,
  )
}

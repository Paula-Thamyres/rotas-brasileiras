import type { Rota } from '../types/mapa'

export function caminhoMaisLongo(rotas: readonly Rota[]): number {
  const rotasDaCidade = new Map<string, number[]>()

  rotas.forEach((rota, indice) => {
    for (const cidade of [rota.cidadeA, rota.cidadeB]) {
      rotasDaCidade.set(cidade, [...(rotasDaCidade.get(cidade) ?? []), indice])
    }
  })

  const usadas = new Set<number>()

  function maisLongoAPartir(cidade: string): number {
    let melhor = 0

    for (const indice of rotasDaCidade.get(cidade) ?? []) {
      if (usadas.has(indice)) continue

      const rota = rotas[indice]
      const destino = rota.cidadeA === cidade ? rota.cidadeB : rota.cidadeA

      usadas.add(indice)
      melhor = Math.max(melhor, rota.espacos + maisLongoAPartir(destino))
      usadas.delete(indice)
    }

    return melhor
  }

  return Math.max(0, ...[...rotasDaCidade.keys()].map(maisLongoAPartir))
}

export function avisoDaUltimaRodada(
  turnosRestantes: number | null,
): string | null {
  if (turnosRestantes === null || turnosRestantes <= 0) return null

  if (!Number.isInteger(turnosRestantes)) {
    throw new RangeError(`Turnos restantes inválidos: ${turnosRestantes}.`)
  }

  const jogadas =
    turnosRestantes === 1 ? '1 jogada' : `${turnosRestantes} jogadas`

  return `Última rodada: faltam ${jogadas} para o fim.`
}
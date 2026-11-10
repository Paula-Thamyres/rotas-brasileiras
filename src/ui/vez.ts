export function instrucaoDaVez(
  cartasCompradasNoTurno: number,
  cartasPorCompra: number,
): string {
  if (!Number.isInteger(cartasCompradasNoTurno) || cartasCompradasNoTurno < 0) {
    throw new RangeError(
      `Quantidade de cartas compradas inválida: ${cartasCompradasNoTurno}.`,
    )
  }

  if (!Number.isInteger(cartasPorCompra) || cartasPorCompra < 1) {
    throw new RangeError(`Cartas por compra inválida: ${cartasPorCompra}.`)
  }

  const faltam = cartasPorCompra - cartasCompradasNoTurno

  if (cartasCompradasNoTurno === 0 || faltam <= 0) {
    return `Escolha uma ação: comprar ${cartasPorCompra} cartas, clicar numa rota do mapa para reivindicá-la ou comprar missões.`
  }

  return `Você já pegou ${cartasCompradasNoTurno} ${cartasCompradasNoTurno === 1 ? 'carta' : 'cartas'}. Pegue mais ${faltam} (do Monte ou das abertas, menos Estepe).`
}

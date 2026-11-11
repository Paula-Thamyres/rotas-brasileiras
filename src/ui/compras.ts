import type { CartaPega } from '../engine/partida'
import { nomeDaCarta } from './cartas'

export interface CompraDaVez {
  readonly jogadorId: string
  readonly nomeDoJogador: string
  readonly cartaPega: CartaPega
}

export function mensagemDaCompra(
  { nomeDoJogador, cartaPega }: CompraDaVez,
  ehAVezDeQuemComprou: boolean,
): string {
  const nomeDaCartaPega = nomeDaCarta(cartaPega.carta)

  if (ehAVezDeQuemComprou) {
    return cartaPega.origem === 'MESA'
      ? `Você pegou da mesa: ${nomeDaCartaPega}.`
      : `Veio do monte: ${nomeDaCartaPega}.`
  }

  return cartaPega.origem === 'MESA'
    ? `${nomeDoJogador} pegou da mesa: ${nomeDaCartaPega}.`
    : `${nomeDoJogador} comprou uma carta do monte.`
}

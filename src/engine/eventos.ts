import type { Evento } from '../types/eventos'
import {
  CARTAS_A_MENOS_DA_ESTRADA_LIBERADA,
  CARTAS_EXTRAS_DA_CHUVA,
  CARTAS_EXTRAS_DO_PEDAGIO,
  CARTAS_MINIMAS_PARA_UMA_ROTA,
  CARTAS_POR_COMPRA,
  CARTAS_POR_COMPRA_NO_FERIADO,
  ESPACOS_DAS_ROTAS_LONGAS,
  ESPACOS_MAXIMOS_DAS_ROTAS_CURTAS,
  ESPACOS_MINIMOS_DAS_ROTAS_DO_CEU_LIMPO,
  PONTOS_EXTRAS_DO_CEU_LIMPO,
  VALOR_DO_CORINGA_NA_BOLEIA,
} from './constantes'

export const CODIGOS_DOS_EVENTOS = {
  chuvaForte: 'chuva-forte',
  greveDeCaminhoneiros: 'greve-de-caminhoneiros',
  estradaLiberada: 'estrada-liberada',
  feriadoProlongado: 'feriado-prolongado',
  neblina: 'neblina',
  pedagio: 'pedagio',
  boleiaAmiga: 'boleia-amiga',
  ceuLimpo: 'ceu-limpo',
} as const

export type EventoAtivo = Evento | null

function ehOEvento(evento: EventoAtivo, codigo: string): boolean {
  return evento?.codigo === codigo
}

export function rotaBloqueadaPeloEvento(
  evento: EventoAtivo,
  espacos: number,
): boolean {
  return (
    ehOEvento(evento, CODIGOS_DOS_EVENTOS.greveDeCaminhoneiros) &&
    espacos >= ESPACOS_DAS_ROTAS_LONGAS
  )
}

export function cartasParaPagarARota(
  evento: EventoAtivo,
  espacos: number,
): number {
  if (
    ehOEvento(evento, CODIGOS_DOS_EVENTOS.chuvaForte) &&
    espacos >= ESPACOS_DAS_ROTAS_LONGAS
  ) {
    return espacos + CARTAS_EXTRAS_DA_CHUVA
  }

  if (
    ehOEvento(evento, CODIGOS_DOS_EVENTOS.estradaLiberada) &&
    espacos <= ESPACOS_MAXIMOS_DAS_ROTAS_CURTAS
  ) {
    return Math.max(
      CARTAS_MINIMAS_PARA_UMA_ROTA,
      espacos - CARTAS_A_MENOS_DA_ESTRADA_LIBERADA,
    )
  }

  return espacos
}

export function cartasDoPedagio(evento: EventoAtivo): number {
  return ehOEvento(evento, CODIGOS_DOS_EVENTOS.pedagio)
    ? CARTAS_EXTRAS_DO_PEDAGIO
    : 0
}

export function valorDoCoringa(evento: EventoAtivo): number {
  return ehOEvento(evento, CODIGOS_DOS_EVENTOS.boleiaAmiga)
    ? VALOR_DO_CORINGA_NA_BOLEIA
    : 1
}

export function pontosExtrasDaRota(
  evento: EventoAtivo,
  espacos: number,
): number {
  const ehRotaLonga = espacos >= ESPACOS_MINIMOS_DAS_ROTAS_DO_CEU_LIMPO

  return ehOEvento(evento, CODIGOS_DOS_EVENTOS.ceuLimpo) && ehRotaLonga
    ? PONTOS_EXTRAS_DO_CEU_LIMPO
    : 0
}

export function cartasPorCompra(evento: EventoAtivo): number {
  return ehOEvento(evento, CODIGOS_DOS_EVENTOS.feriadoProlongado)
    ? CARTAS_POR_COMPRA_NO_FERIADO
    : CARTAS_POR_COMPRA
}

export function cartasAbertasViradas(evento: EventoAtivo): boolean {
  return ehOEvento(evento, CODIGOS_DOS_EVENTOS.neblina)
}

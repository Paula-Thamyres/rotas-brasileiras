import { mapa } from '../data'
import type { Carta } from '../types/cartas'
import { COR_DA_ROTA } from '../components/mapa/cores'
import {
  CARTA_CORINGA,
  CORES_DAS_CARTAS,
  NOME_DO_CORINGA,
} from '../engine/constantes'

const LIMITE_DE_CLARIDADE = 150
const PESO_DO_VERMELHO = 299
const PESO_DO_VERDE = 587
const PESO_DO_AZUL = 114
const ESCALA_DOS_PESOS = 1000
const BASE_HEXADECIMAL = 16

export interface CartaAgrupada {
  readonly carta: Carta
  readonly quantidade: number
}

export function nomeDaCarta(carta: Carta): string {
  return carta === CARTA_CORINGA ? NOME_DO_CORINGA : mapa.nomesDasCores[carta]
}

export function corDeFundoDaCarta(carta: Carta): string | null {
  return carta === CARTA_CORINGA ? null : COR_DA_ROTA[carta]
}

export function corDoTextoSobre(fundoHexadecimal: string): string {
  const [vermelho, verde, azul] = [1, 3, 5].map((inicio) =>
    parseInt(fundoHexadecimal.slice(inicio, inicio + 2), BASE_HEXADECIMAL),
  )
  const claridade =
    (vermelho * PESO_DO_VERMELHO +
      verde * PESO_DO_VERDE +
      azul * PESO_DO_AZUL) /
    ESCALA_DOS_PESOS

  return claridade > LIMITE_DE_CLARIDADE ? '#1f2937' : '#ffffff'
}

export function agruparCartas(mao: readonly Carta[]): CartaAgrupada[] {
  const ordem: readonly Carta[] = [...CORES_DAS_CARTAS, CARTA_CORINGA]

  return ordem
    .map((carta) => ({
      carta,
      quantidade: mao.filter((daMao) => daMao === carta).length,
    }))
    .filter(({ quantidade }) => quantidade > 0)
}

export function descreverCartas(cartas: readonly Carta[]): string {
  return agruparCartas(cartas)
    .map(({ carta, quantidade }) => `${quantidade}× ${nomeDaCarta(carta)}`)
    .join(' + ')
}

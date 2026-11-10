import {
  CARTA_CORINGA,
  CARTAS_ABERTAS_NA_MESA,
  CARTAS_POR_COR,
  CORES_DAS_CARTAS,
  CORINGAS_ABERTOS_PARA_RENOVAR,
  CORINGAS_NO_BARALHO,
  MAXIMO_DE_RENOVACOES_DAS_ABERTAS,
} from './constantes'
import type { Carta } from '../types/cartas'

const CARTAS_DE_COR_PARA_RENOVAR =
  CARTAS_ABERTAS_NA_MESA - CORINGAS_ABERTOS_PARA_RENOVAR + 1

export type Aleatorio = () => number

export interface Baralho {
  readonly monte: readonly Carta[]
  readonly descarte: readonly Carta[]
  readonly abertas: readonly Carta[]
}

export interface Compra<TCarta extends Carta | null> {
  readonly baralho: Baralho
  readonly carta: TCarta
}

export function criarMonteCompleto(): Carta[] {
  const cartasDeCor = CORES_DAS_CARTAS.flatMap((cor) =>
    Array<Carta>(CARTAS_POR_COR).fill(cor),
  )
  const coringas = Array<Carta>(CORINGAS_NO_BARALHO).fill(CARTA_CORINGA)

  return [...cartasDeCor, ...coringas]
}

function sortearIndice(aleatorio: Aleatorio, limite: number): number {
  const valor = aleatorio()

  if (!Number.isFinite(valor) || valor < 0 || valor >= 1) {
    throw new RangeError(
      `O gerador aleatório precisa devolver um número de 0 até menos de 1, mas devolveu ${valor}.`,
    )
  }

  return Math.floor(valor * limite)
}

export function embaralhar<T>(
  itens: readonly T[],
  aleatorio: Aleatorio = Math.random,
): T[] {
  const resultado = [...itens]

  for (let posicao = resultado.length - 1; posicao > 0; posicao--) {
    const sorteada = sortearIndice(aleatorio, posicao + 1)
    const guardada = resultado[posicao]

    resultado[posicao] = resultado[sorteada]
    resultado[sorteada] = guardada
  }

  return resultado
}

function contarCoringas(cartas: readonly Carta[]): number {
  return cartas.filter((carta) => carta === CARTA_CORINGA).length
}

function contarCartasDeCor(baralho: Baralho): number {
  const todas = [...baralho.monte, ...baralho.descarte, ...baralho.abertas]

  return todas.length - contarCoringas(todas)
}

function reporMonteSeVazio(baralho: Baralho, aleatorio: Aleatorio): Baralho {
  if (baralho.monte.length > 0 || baralho.descarte.length === 0) {
    return baralho
  }

  return {
    ...baralho,
    monte: embaralhar(baralho.descarte, aleatorio),
    descarte: [],
  }
}

export function comprarDoMonte(
  baralho: Baralho,
  aleatorio: Aleatorio = Math.random,
): Compra<Carta | null> {
  const comMonte = reporMonteSeVazio(baralho, aleatorio)
  const [carta, ...resto] = comMonte.monte

  if (carta === undefined) {
    return { baralho: comMonte, carta: null }
  }

  return { baralho: { ...comMonte, monte: resto }, carta }
}

function completarAbertas(baralho: Baralho, aleatorio: Aleatorio): Baralho {
  let atual = baralho

  while (atual.abertas.length < CARTAS_ABERTAS_NA_MESA) {
    const { baralho: depois, carta } = comprarDoMonte(atual, aleatorio)

    if (carta === null) return depois

    atual = { ...depois, abertas: [...depois.abertas, carta] }
  }

  return atual
}

function precisaRenovarAbertas(baralho: Baralho): boolean {
  return (
    contarCoringas(baralho.abertas) >= CORINGAS_ABERTOS_PARA_RENOVAR &&
    contarCartasDeCor(baralho) >= CARTAS_DE_COR_PARA_RENOVAR
  )
}

function renovarAbertas(baralho: Baralho, aleatorio: Aleatorio): Baralho {
  let atual = completarAbertas(baralho, aleatorio)

  for (
    let tentativa = 0;
    tentativa < MAXIMO_DE_RENOVACOES_DAS_ABERTAS &&
    precisaRenovarAbertas(atual);
    tentativa++
  ) {
    atual = completarAbertas(
      {
        ...atual,
        abertas: [],
        descarte: [...atual.descarte, ...atual.abertas],
      },
      aleatorio,
    )
  }

  return atual
}

export function criarBaralho(aleatorio: Aleatorio = Math.random): Baralho {
  const inicial: Baralho = {
    monte: embaralhar(criarMonteCompleto(), aleatorio),
    descarte: [],
    abertas: [],
  }

  return renovarAbertas(inicial, aleatorio)
}

export function comprarAberta(
  baralho: Baralho,
  indice: number,
  aleatorio: Aleatorio = Math.random,
): Compra<Carta> {
  const carta = baralho.abertas[indice]

  if (!Number.isInteger(indice) || carta === undefined) {
    throw new RangeError(
      `Posição de carta aberta inválida: ${indice}. Valores aceitos: 0 a ${baralho.abertas.length - 1}.`,
    )
  }

  const { baralho: depois, carta: reposta } = comprarDoMonte(
    { ...baralho, abertas: [] },
    aleatorio,
  )
  const abertas = baralho.abertas.filter((_, posicao) => posicao !== indice)

  if (reposta !== null) abertas.splice(indice, 0, reposta)

  return {
    baralho: renovarAbertas({ ...depois, abertas }, aleatorio),
    carta,
  }
}

export function descartar(baralho: Baralho, cartas: readonly Carta[]): Baralho {
  return { ...baralho, descarte: [...baralho.descarte, ...cartas] }
}

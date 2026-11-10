import type { Jogador } from '../types/jogador'
import type { Rota } from '../types/mapa'
import type { Missao } from '../types/missoes'
import type { Partida } from './partida'
import { idDaRota, motivoDeRecusaPelaMesa } from './rotas'

export interface LigacoesDaMissao {
  readonly rotasFaltantes: readonly Rota[]
  readonly custoEmEspacos: number
}

export interface Planejador {
  readonly ligacoesDaMissao: (missao: Missao) => LigacoesDaMissao
}

interface Aresta {
  readonly peso: number
  readonly rota: Rota
}

type Arestas = Map<string, Aresta>

const MISSAO_IMPOSSIVEL: LigacoesDaMissao = {
  rotasFaltantes: [],
  custoEmEspacos: Number.POSITIVE_INFINITY,
}

function chaveDoPar(cidadeA: string, cidadeB: string): string {
  return [cidadeA, cidadeB].sort().join('|')
}

function pesoParaOJogador(
  partida: Partida,
  jogador: Jogador,
  rota: Rota,
): number | null {
  const dono = partida.donosDasRotas[idDaRota(rota)]

  if (dono !== undefined) return dono === jogador.id ? 0 : null

  const recusa = motivoDeRecusaPelaMesa({
    rota,
    jogador,
    donosDasRotas: partida.donosDasRotas,
    totalDeJogadores: partida.jogadores.length,
  })

  return recusa === null ? rota.espacos : null
}

function melhoresArestas(
  partida: Partida,
  jogador: Jogador,
  rotasDoMapa: readonly Rota[],
): Arestas {
  const arestas: Arestas = new Map()

  for (const rota of rotasDoMapa) {
    const peso = pesoParaOJogador(partida, jogador, rota)
    const chave = chaveDoPar(rota.cidadeA, rota.cidadeB)
    const atual = arestas.get(chave)

    if (peso !== null && (atual === undefined || peso < atual.peso)) {
      arestas.set(chave, { peso, rota })
    }
  }

  return arestas
}

function caminhosMaisCurtos(cidades: readonly string[], arestas: Arestas) {
  const total = cidades.length
  const indiceDaCidade = new Map(
    cidades.map((cidade, indice) => [cidade, indice]),
  )
  const distancia = new Float64Array(total * total).fill(Infinity)
  const proximo = new Int32Array(total * total).fill(-1)

  function posicao(origem: number, destino: number): number {
    return origem * total + destino
  }

  for (let indice = 0; indice < total; indice++) {
    distancia[posicao(indice, indice)] = 0
  }

  for (const [par, { peso }] of arestas) {
    const [cidadeA, cidadeB] = par.split('|')
    const a = indiceDaCidade.get(cidadeA)!
    const b = indiceDaCidade.get(cidadeB)!

    distancia[posicao(a, b)] = peso
    distancia[posicao(b, a)] = peso
    proximo[posicao(a, b)] = b
    proximo[posicao(b, a)] = a
  }

  for (let meio = 0; meio < total; meio++) {
    for (let origem = 0; origem < total; origem++) {
      for (let destino = 0; destino < total; destino++) {
        const porMeio =
          distancia[posicao(origem, meio)] + distancia[posicao(meio, destino)]

        if (porMeio < distancia[posicao(origem, destino)]) {
          distancia[posicao(origem, destino)] = porMeio
          proximo[posicao(origem, destino)] = proximo[posicao(origem, meio)]
        }
      }
    }
  }

  return {
    distancia: (origem: string, destino: string) =>
      distancia[
        posicao(indiceDaCidade.get(origem)!, indiceDaCidade.get(destino)!)
      ],
    caminho(origem: string, destino: string): string[] {
      const cidadesDoCaminho = [origem]
      const alvo = indiceDaCidade.get(destino)!
      let atual = indiceDaCidade.get(origem)!

      while (atual !== alvo) {
        atual = proximo[posicao(atual, alvo)]
        cidadesDoCaminho.push(cidades[atual])
      }

      return cidadesDoCaminho
    },
  }
}

export function criarPlanejador(
  partida: Partida,
  jogador: Jogador,
  rotasDoMapa: readonly Rota[],
): Planejador {
  const cidades = [
    ...new Set(rotasDoMapa.flatMap((rota) => [rota.cidadeA, rota.cidadeB])),
  ]
  const arestas = melhoresArestas(partida, jogador, rotasDoMapa)
  const caminhos = caminhosMaisCurtos(cidades, arestas)

  function pares(cidadesDaMissao: readonly string[]): [string, string][] {
    const ligadas = new Set([cidadesDaMissao[0]])
    const restantes = new Set(cidadesDaMissao.slice(1))
    const resultado: [string, string][] = []

    while (restantes.size > 0) {
      let melhor: [string, string, number] | null = null

      for (const dentro of ligadas) {
        for (const fora of restantes) {
          const distancia = caminhos.distancia(dentro, fora)

          if (melhor === null || distancia < melhor[2]) {
            melhor = [dentro, fora, distancia]
          }
        }
      }

      if (melhor === null) break

      resultado.push([melhor[0], melhor[1]])
      ligadas.add(melhor[1])
      restantes.delete(melhor[1])
    }

    return resultado
  }

  return {
    ligacoesDaMissao(missao) {
      const faltantes = new Map<string, Rota>()

      for (const [origem, destino] of pares(missao.cidades)) {
        if (!Number.isFinite(caminhos.distancia(origem, destino))) {
          return MISSAO_IMPOSSIVEL
        }

        const trajeto = caminhos.caminho(origem, destino)

        for (let indice = 1; indice < trajeto.length; indice++) {
          const aresta = arestas.get(
            chaveDoPar(trajeto[indice - 1], trajeto[indice]),
          )!

          if (aresta.peso > 0) faltantes.set(idDaRota(aresta.rota), aresta.rota)
        }
      }

      const rotasFaltantes = [...faltantes.values()]

      return {
        rotasFaltantes,
        custoEmEspacos: rotasFaltantes.reduce(
          (soma, rota) => soma + rota.espacos,
          0,
        ),
      }
    },
  }
}

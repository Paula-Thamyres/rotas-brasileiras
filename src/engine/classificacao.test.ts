import { describe, expect, it } from 'vitest'
import type { Rota } from '../types/mapa'
import type { Missao } from '../types/missoes'
import { classificacaoFinal } from './classificacao'
import { criarPartida, type ConteudoDaPartida, type Partida } from './partida'
import { idDaRota } from './rotas'
import { aleatorioComSemente } from './aleatorioComSemente'

const BONUS = 10

function rota(cidadeA: string, cidadeB: string, espacos: number): Rota {
  return { cidadeA, cidadeB, espacos, paralela: null, cor: 'GR' }
}

const curta = rota('A', 'B', 2)
const longa = rota('C', 'D', 5)
const mapaDeTeste = [curta, longa]

const missoesDeTeste: Missao[] = Array.from({ length: 6 }, (_, indice) => ({
  tipo: 'ligacao',
  nome: `Missão ${indice + 1}`,
  cidades: ['A', 'B'],
  pontos: 1,
}))

const conteudoDeTeste: ConteudoDaPartida = {
  missoes: missoesDeTeste,
  eventos: [{ codigo: 'dia-normal', nome: 'Dia normal', descricao: '' }],
  curiosidades: [],
}

interface Situacao {
  pontos: number
  rotas: Rota[]
  missoes?: Missao[]
}

function partidaEncerrada(situacao: readonly Situacao[]): Partida {
  const base = criarPartida(
    situacao.map((_, indice) => `Jogador ${indice + 1}`),
    conteudoDeTeste,
    aleatorioComSemente(1),
  )

  return {
    ...base,
    encerrada: true,
    jogadores: base.jogadores.map((jogador, indice) => ({
      ...jogador,
      pontos: situacao[indice].pontos,
      rotas: situacao[indice].rotas.map(idDaRota),
      missoes: situacao[indice].missoes ?? [],
    })),
  }
}

describe('classificação final', () => {
  it('dá 10 pontos a quem tem o caminho mais longo e ordena por pontos', () => {
    const partida = partidaEncerrada([
      { pontos: 20, rotas: [curta] },
      { pontos: 15, rotas: [longa] },
    ])
    const [primeiro, segundo] = classificacaoFinal(partida, mapaDeTeste)

    expect(primeiro.jogador.nome).toBe('Jogador 2')
    expect(primeiro.bonusCaminhoMaisLongo).toBe(BONUS)
    expect(primeiro.pontosFinais).toBe(25)
    expect(segundo.bonusCaminhoMaisLongo).toBe(0)
    expect(segundo.pontosFinais).toBe(20)
  })

  it('dá o bônus a todos os empatados no caminho mais longo', () => {
    const partida = partidaEncerrada([
      { pontos: 5, rotas: [longa] },
      { pontos: 3, rotas: [longa] },
    ])
    const classificacao = classificacaoFinal(partida, mapaDeTeste)

    expect(classificacao.map((item) => item.bonusCaminhoMaisLongo)).toEqual([
      BONUS,
      BONUS,
    ])
  })

  it('não dá bônus quando ninguém tem rota', () => {
    const partida = partidaEncerrada([
      { pontos: 0, rotas: [] },
      { pontos: 0, rotas: [] },
    ])

    for (const item of classificacaoFinal(partida, mapaDeTeste)) {
      expect(item.bonusCaminhoMaisLongo).toBe(0)
    }
  })

  it('só existe com a partida encerrada', () => {
    const emAndamento = criarPartida(
      ['Ana', 'Bia'],
      conteudoDeTeste,
      aleatorioComSemente(1),
    )

    expect(() => classificacaoFinal(emAndamento, mapaDeTeste)).toThrow(
      RangeError,
    )
  })

  it('recusa rota do jogador que não existe no mapa', () => {
    const partida = partidaEncerrada([
      { pontos: 0, rotas: [rota('X', 'Y', 1)] },
      { pontos: 0, rotas: [] },
    ])

    expect(() => classificacaoFinal(partida, mapaDeTeste)).toThrow(RangeError)
  })

  it('soma as missões cumpridas e desconta as não cumpridas', () => {
    const feita: Missao = {
      ...missoesDeTeste[0],
      cidades: ['A', 'B'],
      pontos: 12,
    }
    const naoFeita: Missao = {
      ...missoesDeTeste[1],
      cidades: ['A', 'Z'],
      pontos: 5,
    }
    const partida = partidaEncerrada([
      { pontos: 10, rotas: [curta], missoes: [feita, naoFeita] },
      { pontos: 10, rotas: [] },
    ])
    const [primeiro] = classificacaoFinal(partida, mapaDeTeste)

    expect(primeiro.pontosDeMissoes).toBe(7)
    expect(primeiro.pontosFinais).toBe(10 + BONUS + 7)
  })
})

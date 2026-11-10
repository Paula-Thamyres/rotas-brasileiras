import { describe, expect, it } from 'vitest'
import { curiosidades, eventos, mapa, missoes } from '../data'
import type { Carta } from '../types/cartas'
import type { Rota } from '../types/mapa'
import { aleatorioComSemente } from './aleatorioComSemente'
import { classificacaoFinal } from './classificacao'
import { jogarVezDoComputador } from './computador'
import {
  criarPartida,
  jogadorDaVez,
  type ConteudoDaPartida,
  type Partida,
} from './partida'
import { CORES_DAS_CARTAS, MISSOES_MINIMAS_NO_INICIO } from './constantes'

const LIMITE_DE_TURNOS_POR_PARTIDA = 600
const QUANTIDADE_DE_PARTIDAS_SIMULADAS = 12

const conteudo: ConteudoDaPartida = { missoes, eventos, curiosidades }

const rotaManausSantarem = mapa.rotas.find(
  (rota) => rota.cidadeA === 'Manaus' && rota.cidadeB === 'Santarém',
) as Rota

function novaPartida(totalDeJogadores = 2, semente = 1): Partida {
  const nomes = Array.from(
    { length: totalDeJogadores },
    (_, indice) => `Computador ${indice + 1}`,
  )

  return criarPartida(nomes, conteudo, aleatorioComSemente(semente))
}

function jogar(partida: Partida, aleatorio = aleatorioComSemente(7)) {
  const jogada = jogarVezDoComputador(partida, mapa.rotas, aleatorio)

  if (jogada === null) throw new Error('O computador não achou jogada.')

  return jogada
}

function emJogo(partida: Partida): Partida {
  let atual = partida

  while (atual.fase === 'ESCOLHA_INICIAL_DE_MISSOES') {
    atual = jogar(atual).partida
  }

  return atual
}

function comMaoDaVez(partida: Partida, mao: readonly Carta[]): Partida {
  return {
    ...partida,
    jogadores: partida.jogadores.map((jogador, indice) =>
      indice === partida.indiceDaVez ? { ...jogador, mao } : jogador,
    ),
  }
}

describe('escolha de missões do computador', () => {
  it('fica só com o mínimo e devolve o resto ao monte', () => {
    const inicial = novaPartida()
    const depois = jogar(inicial).partida

    expect(depois.jogadores[0].missoes).toHaveLength(MISSOES_MINIMAS_NO_INICIO)
    expect(jogadorDaVez(depois).nome).toBe('Computador 2')
  })

  it('completa a fase inicial de todos os jogadores', () => {
    const partida = emJogo(novaPartida(3))

    expect(partida.fase).toBe('EM_JOGO')

    for (const jogador of partida.jogadores) {
      expect(jogador.missoes.length).toBeGreaterThanOrEqual(
        MISSOES_MINIMAS_NO_INICIO,
      )
    }
  })

  it('descreve o que escolheu', () => {
    expect(jogar(novaPartida()).descricao).toBe('ficou com 2 missões')
  })
})

describe('turno do computador', () => {
  it('compra cartas e passa a vez quando não consegue pagar rota nenhuma', () => {
    const partida = comMaoDaVez(emJogo(novaPartida()), [])
    const jogada = jogar(partida)

    expect(jogada.descricao).toMatch(/^comprou \d+ cartas?$/)
    expect(jogadorDaVez(jogada.partida).id).not.toBe(jogadorDaVez(partida).id)
  })

  it('reivindica uma rota quando consegue pagar', () => {
    const partida = emJogo(novaPartida())
    const rica = comMaoDaVez(
      partida,
      CORES_DAS_CARTAS.flatMap((cor) => Array<Carta>(8).fill(cor)),
    )
    const jogada = jogar(rica)
    const dono = jogadorDaVez(rica).id

    expect(jogada.descricao).toMatch(/^reivindicou /)
    expect(Object.values(jogada.partida.donosDasRotas)).toContain(dono)
  })

  it('não reivindica rota pelo computador que não consegue pagar', () => {
    const partida = comMaoDaVez(emJogo(novaPartida()), ['AM'])
    const jogada = jogar(partida)

    expect(Object.keys(jogada.partida.donosDasRotas)).toEqual([])
  })

  it('devolve nulo quando a partida já acabou', () => {
    const encerrada: Partida = { ...novaPartida(), encerrada: true }

    expect(jogarVezDoComputador(encerrada, mapa.rotas)).toBeNull()
  })

  it('não toca na rota que já tem dono', () => {
    const partida = emJogo(novaPartida())
    const rica = comMaoDaVez(partida, Array<Carta>(12).fill('AM'))
    const ocupada: Partida = {
      ...rica,
      donosDasRotas: { 'Manaus-Santarém-unica': 'jogador-2' },
    }
    const jogada = jogar(ocupada)

    expect(jogada.partida.donosDasRotas['Manaus-Santarém-unica']).toBe(
      'jogador-2',
    )
    expect(rotaManausSantarem.cidadeA).toBe('Manaus')
  })
})

describe('partidas inteiras só de computadores', () => {
  function jogarAteOFim(totalDeJogadores: number, semente: number): Partida {
    const aleatorio = aleatorioComSemente(semente)
    let partida = novaPartida(totalDeJogadores, semente)
    let turnos = 0

    while (!partida.encerrada) {
      if (turnos++ > LIMITE_DE_TURNOS_POR_PARTIDA) {
        throw new Error(`A partida ${semente} não terminou.`)
      }

      partida = jogar(partida, aleatorio).partida
    }

    return partida
  }

  it.each(
    Array.from({ length: QUANTIDADE_DE_PARTIDAS_SIMULADAS }, (_, indice) => ({
      semente: indice + 1,
      jogadores: (indice % 4) + 2,
    })),
  )(
    'termina a partida $semente com $jogadores jogadores e classifica todos',
    ({ semente, jogadores }) => {
      const final = jogarAteOFim(jogadores, semente)
      const classificacao = classificacaoFinal(final, mapa.rotas)

      expect(classificacao).toHaveLength(jogadores)
      expect(Object.keys(final.donosDasRotas).length).toBeGreaterThan(0)
    },
  )
})

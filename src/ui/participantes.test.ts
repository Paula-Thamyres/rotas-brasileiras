import { describe, expect, it } from 'vitest'
import { curiosidades, eventos, missoes } from '../data'
import { criarPartida, type Partida } from '../engine/partida'
import {
  jogadorDoPainel,
  motivoDeParticipantesInvalidos,
  nomeDoComputador,
} from './participantes'

const pessoa = (nome: string) => ({ nome, computador: false })
const computador = (nome: string) => ({ nome, computador: true })

function partidaDeQuatro(indiceDaVez: number): Partida {
  const inicial = criarPartida(['Ana', 'Bia', 'Caio', 'Duda'], {
    missoes,
    eventos,
    curiosidades,
  })

  return { ...inicial, indiceDaVez }
}

describe('validação dos participantes', () => {
  it('aceita uma pessoa contra o computador', () => {
    expect(
      motivoDeParticipantesInvalidos([
        pessoa('Ana'),
        computador('Computador 1'),
      ]),
    ).toBeNull()
  })

  it('recusa mesa só de computadores', () => {
    expect(
      motivoDeParticipantesInvalidos([computador('A'), computador('B')]),
    ).not.toBeNull()
  })

  it('aplica as regras de nomes também aos computadores', () => {
    expect(
      motivoDeParticipantesInvalidos([pessoa('Ana'), computador('ana')]),
    ).not.toBeNull()
    expect(
      motivoDeParticipantesInvalidos([pessoa('Ana'), computador('')]),
    ).not.toBeNull()
  })

  it('numera os computadores a partir da posição pedida', () => {
    expect(nomeDoComputador(2)).toBe('Computador 2')
  })
})

describe('jogador mostrado no painel', () => {
  const computadores = new Set(['jogador-2', 'jogador-3'])

  it('mostra o jogador da vez quando é uma pessoa', () => {
    expect(jogadorDoPainel(partidaDeQuatro(3), computadores).nome).toBe('Duda')
  })

  it('na vez do computador, mostra a pessoa que jogou antes', () => {
    expect(jogadorDoPainel(partidaDeQuatro(1), computadores).nome).toBe('Ana')
    expect(jogadorDoPainel(partidaDeQuatro(2), computadores).nome).toBe('Ana')
  })

  it('volta ao fim da mesa quando a pessoa anterior está no começo', () => {
    const soAPrimeira = new Set(['jogador-1', 'jogador-2', 'jogador-3'])

    expect(jogadorDoPainel(partidaDeQuatro(1), soAPrimeira).nome).toBe('Duda')
  })
})

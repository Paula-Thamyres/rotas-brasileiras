import { describe, expect, it } from 'vitest'
import { CAMINHOES_PARA_ULTIMA_RODADA } from '../engine/constantes'
import {
  caminhoesDaDuracao,
  DURACAO_PADRAO,
  DURACOES_DA_PARTIDA,
  NOME_DA_DURACAO,
} from './duracao'

describe('duração da partida', () => {
  it('começa na partida normal, com 45 caminhões', () => {
    expect(DURACAO_PADRAO).toBe('NORMAL')
    expect(caminhoesDaDuracao('NORMAL')).toBe(45)
  })

  it('a partida rápida tem menos caminhões, mas ainda deixa a partida começar', () => {
    const rapida = caminhoesDaDuracao('RAPIDA')

    expect(rapida).toBeLessThan(caminhoesDaDuracao('NORMAL'))
    expect(rapida).toBeGreaterThan(CAMINHOES_PARA_ULTIMA_RODADA)
  })

  it('tem um nome para cada duração', () => {
    expect(
      DURACOES_DA_PARTIDA.every((duracao) => NOME_DA_DURACAO[duracao] !== ''),
    ).toBe(true)
  })
})
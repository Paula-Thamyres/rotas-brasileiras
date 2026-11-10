import { describe, expect, it } from 'vitest'
import { eventos } from '../data'
import { PASSOS_DO_TUTORIAL } from './tutorial'

const textoDoTutorial = PASSOS_DO_TUTORIAL.flatMap(
  ({ paragrafos }) => paragrafos,
).join(' ')

describe('PASSOS_DO_TUTORIAL', () => {
  it('tem passos com título único e ao menos um parágrafo', () => {
    const titulos = PASSOS_DO_TUTORIAL.map(({ titulo }) => titulo)

    expect(new Set(titulos).size).toBe(titulos.length)
    expect(
      PASSOS_DO_TUTORIAL.every(
        ({ titulo, paragrafos }) =>
          titulo.trim() !== '' && paragrafos.length > 0,
      ),
    ).toBe(true)
  })

  it('usa os valores reais das regras', () => {
    expect(textoDoTutorial).toContain('45')
    expect(textoDoTutorial).toContain('1 = 1')
    expect(textoDoTutorial).toContain('6 = 15')
    expect(textoDoTutorial).toContain('Estepe')
  })

  it('segue a ordem da partida, do começo ao fim', () => {
    const titulos = PASSOS_DO_TUTORIAL.map(({ titulo }) => titulo)

    expect(titulos[0]).toBe('O objetivo')
    expect(titulos[1]).toBe('Começando a partida')
    expect(titulos[titulos.length - 1]).toBe('Como o jogo termina')
  })

  it('explica a janela que mostra a jogada do computador', () => {
    expect(textoDoTutorial).toContain('Entendi')
  })

  it('explica a partida rápida', () => {
    expect(textoDoTutorial).toContain('partida rápida')
    expect(textoDoTutorial).toContain('20 caminhões')
  })

  it('explica a escolha inicial de missões com o mínimo real', () => {
    const passo = PASSOS_DO_TUTORIAL.find(
      ({ titulo }) => titulo === 'Começando a partida',
    )

    expect(passo?.paragrafos.join(' ')).toContain('no mínimo 2')
  })

  it('lista todos os eventos do jogo', () => {
    expect(eventos.every(({ nome }) => textoDoTutorial.includes(nome))).toBe(
      true,
    )
  })

  it('não aponta mais a mão para a coluna da direita', () => {
    expect(textoDoTutorial).not.toContain('coluna da direita, na')
    expect(textoDoTutorial).toContain('faixa de baixo')
  })

  it('explica o fim do jogo e o botão de jogar de novo', () => {
    expect(textoDoTutorial).toContain('última rodada')
    expect(textoDoTutorial).toContain('Jogar de novo')
  })
})
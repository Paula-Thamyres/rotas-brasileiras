import { describe, expect, it } from 'vitest'
import { PASSOS_DO_TUTORIAL } from './tutorial'

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
    const texto = PASSOS_DO_TUTORIAL.flatMap(
      ({ paragrafos }) => paragrafos,
    ).join(' ')

    expect(texto).toContain('45')
    expect(texto).toContain('1 = 1')
    expect(texto).toContain('6 = 15')
    expect(texto).toContain('Estepe')
  })
})

import { describe, expect, it } from 'vitest'
import { instrucaoDaVez } from './vez'

describe('instrucaoDaVez', () => {
  it('lista as três ações no começo da vez', () => {
    const texto = instrucaoDaVez(0, 2)

    expect(texto).toContain('comprar 2 cartas')
    expect(texto).toContain('rota')
    expect(texto).toContain('missões')
  })

  it('pede a carta que falta depois da primeira compra', () => {
    expect(instrucaoDaVez(1, 2)).toBe(
      'Você já pegou 1 carta. Pegue mais 1 (do Monte ou das abertas, menos Estepe).',
    )
  })

  it('usa o plural quando já pegou mais de uma carta', () => {
    expect(instrucaoDaVez(2, 3)).toContain('Você já pegou 2 cartas')
    expect(instrucaoDaVez(2, 3)).toContain('Pegue mais 1')
  })

  it('volta à instrução inicial se não falta nenhuma carta', () => {
    expect(instrucaoDaVez(2, 2)).toContain('Escolha uma ação')
  })

  it.each([-1, 1.5, Number.NaN])('rejeita compras inválidas: %s', (valor) => {
    expect(() => instrucaoDaVez(valor, 2)).toThrow(RangeError)
  })

  it.each([0, 1.5, -2])('rejeita cartas por compra inválidas: %s', (valor) => {
    expect(() => instrucaoDaVez(0, valor)).toThrow(RangeError)
  })
})

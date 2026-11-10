import { describe, expect, it } from 'vitest'
import { descricaoDaMissao } from './missoes'

describe('descrição da missão', () => {
  it('lista as cidades que precisam ficar ligadas', () => {
    expect(
      descricaoDaMissao({
        tipo: 'regiao',
        nome: 'Capitais do Sul',
        cidades: ['Curitiba', 'Florianópolis', 'Porto Alegre'],
        pontos: 5,
      }),
    ).toBe('Curitiba · Florianópolis · Porto Alegre')
  })
})

import { describe, expect, it } from 'vitest'
import { CARTA_CORINGA } from '../engine/constantes'
import { mensagemDaCompra, type CompraDaVez } from './compras'

function compra(
  carta: CompraDaVez['cartaPega']['carta'],
  origem: CompraDaVez['cartaPega']['origem'],
): CompraDaVez {
  return { jogadorId: 'j1', nomeDoJogador: 'Ana', cartaPega: { carta, origem } }
}

describe('mensagemDaCompra', () => {
  it('diz qual carta aberta o jogador pegou da mesa', () => {
    expect(mensagemDaCompra(compra('AM', 'MESA'), true)).toBe(
      'Você pegou da mesa: Amazônia.',
    )
  })

  it('diz qual carta veio do monte para quem comprou', () => {
    expect(mensagemDaCompra(compra('MA', 'MONTE'), true)).toBe(
      'Veio do monte: Mata Atlântica.',
    )
  })

  it('chama o Estepe pelo nome', () => {
    expect(mensagemDaCompra(compra(CARTA_CORINGA, 'MESA'), true)).toBe(
      'Você pegou da mesa: Estepe.',
    )
  })

  it('mostra o nome de quem pegou quando a vez já passou', () => {
    expect(mensagemDaCompra(compra('CE', 'MESA'), false)).toBe(
      'Ana pegou da mesa: Cerrado.',
    )
  })

  it('não revela a carta do monte para os outros jogadores', () => {
    expect(mensagemDaCompra(compra('CE', 'MONTE'), false)).toBe(
      'Ana comprou uma carta do monte.',
    )
  })
})

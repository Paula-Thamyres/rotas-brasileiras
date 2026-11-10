import { describe, expect, it } from 'vitest'
import type { Evento } from '../types/eventos'
import {
  cartasAbertasViradas,
  cartasDoPedagio,
  cartasParaPagarARota,
  cartasPorCompra,
  CODIGOS_DOS_EVENTOS,
  pontosExtrasDaRota,
  rotaBloqueadaPeloEvento,
  valorDoCoringa,
} from './eventos'

const ROTA_CURTA = 1
const ROTA_DE_DOIS = 2
const ROTA_MEDIA = 3
const ROTA_LONGA = 4
const ROTA_DE_CINCO = 5
const ROTA_DE_SEIS = 6

function evento(codigo: string): Evento {
  return { codigo, nome: codigo, descricao: codigo }
}

const semEvento = null
const eventoSemEfeito = evento('dia-normal')

describe('custo da rota em cartas', () => {
  it('chuva forte cobra 1 carta a mais nas rotas de 4 ou mais espaços', () => {
    const chuva = evento(CODIGOS_DOS_EVENTOS.chuvaForte)

    expect(cartasParaPagarARota(chuva, ROTA_MEDIA)).toBe(3)
    expect(cartasParaPagarARota(chuva, ROTA_LONGA)).toBe(5)
    expect(cartasParaPagarARota(chuva, ROTA_DE_SEIS)).toBe(7)
  })

  it('estrada liberada tira 1 carta das rotas de 1 e 2 espaços, mínimo 1', () => {
    const liberada = evento(CODIGOS_DOS_EVENTOS.estradaLiberada)

    expect(cartasParaPagarARota(liberada, ROTA_CURTA)).toBe(1)
    expect(cartasParaPagarARota(liberada, ROTA_DE_DOIS)).toBe(1)
    expect(cartasParaPagarARota(liberada, ROTA_MEDIA)).toBe(3)
  })

  it('sem efeito de custo, cobra um número de cartas igual aos espaços', () => {
    for (const ativo of [semEvento, eventoSemEfeito]) {
      expect(cartasParaPagarARota(ativo, ROTA_LONGA)).toBe(ROTA_LONGA)
    }
  })
})

describe('greve de caminhoneiros', () => {
  const greve = evento(CODIGOS_DOS_EVENTOS.greveDeCaminhoneiros)

  it('bloqueia rotas de 4 ou mais espaços', () => {
    expect(rotaBloqueadaPeloEvento(greve, ROTA_LONGA)).toBe(true)
    expect(rotaBloqueadaPeloEvento(greve, ROTA_DE_SEIS)).toBe(true)
  })

  it('libera rotas menores e não bloqueia sem greve', () => {
    expect(rotaBloqueadaPeloEvento(greve, ROTA_MEDIA)).toBe(false)
    expect(rotaBloqueadaPeloEvento(semEvento, ROTA_DE_SEIS)).toBe(false)
  })
})

describe('pedágio', () => {
  it('exige 1 carta extra só durante o pedágio', () => {
    expect(cartasDoPedagio(evento(CODIGOS_DOS_EVENTOS.pedagio))).toBe(1)
    expect(cartasDoPedagio(semEvento)).toBe(0)
    expect(cartasDoPedagio(eventoSemEfeito)).toBe(0)
  })
})

describe('boleia amiga', () => {
  it('faz cada Estepe valer 2 cartas', () => {
    expect(valorDoCoringa(evento(CODIGOS_DOS_EVENTOS.boleiaAmiga))).toBe(2)
  })

  it('mantém o Estepe valendo 1 nos outros dias', () => {
    expect(valorDoCoringa(semEvento)).toBe(1)
    expect(valorDoCoringa(eventoSemEfeito)).toBe(1)
  })
})

describe('céu limpo', () => {
  const ceuLimpo = evento(CODIGOS_DOS_EVENTOS.ceuLimpo)

  it('dá 2 pontos a mais nas rotas de 5 e 6 espaços', () => {
    expect(pontosExtrasDaRota(ceuLimpo, ROTA_DE_CINCO)).toBe(2)
    expect(pontosExtrasDaRota(ceuLimpo, ROTA_DE_SEIS)).toBe(2)
  })

  it('não dá pontos a mais nas rotas menores nem em outros dias', () => {
    expect(pontosExtrasDaRota(ceuLimpo, ROTA_LONGA)).toBe(0)
    expect(pontosExtrasDaRota(semEvento, ROTA_DE_SEIS)).toBe(0)
  })
})

describe('feriado prolongado', () => {
  it('libera a compra de até 3 cartas por turno', () => {
    expect(cartasPorCompra(evento(CODIGOS_DOS_EVENTOS.feriadoProlongado))).toBe(
      3,
    )
  })

  it('mantém 2 cartas por turno nos outros dias', () => {
    expect(cartasPorCompra(semEvento)).toBe(2)
    expect(cartasPorCompra(eventoSemEfeito)).toBe(2)
  })
})

describe('neblina', () => {
  it('vira as cartas abertas só durante a neblina', () => {
    expect(cartasAbertasViradas(evento(CODIGOS_DOS_EVENTOS.neblina))).toBe(true)
    expect(cartasAbertasViradas(semEvento)).toBe(false)
    expect(cartasAbertasViradas(eventoSemEfeito)).toBe(false)
  })
})

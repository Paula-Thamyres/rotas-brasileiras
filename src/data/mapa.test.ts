import { describe, expect, it } from 'vitest'
import {
  CARTAS_POR_COR,
  CORINGAS_NO_BARALHO,
  PONTOS_POR_TAMANHO_DA_ROTA,
} from '../engine/constantes'
import { CODIGOS_DOS_EVENTOS } from '../engine/eventos'
import { curiosidades, eventos, mapa, missoes } from './index'

const TOTAL_DE_CIDADES = 36
const TOTAL_DE_ROTAS = 100
const TOTAL_DE_ESPACOS = 295
const TOTAL_DE_MISSOES = 30
const TOTAL_DE_EVENTOS = 8
const TOTAL_DE_CARTAS_DO_BARALHO = 110
const CODIGO_DA_COR_CINZA = 'GR'

const nomesDasCidades = Object.keys(mapa.cidades)

describe('dados do mapa', () => {
  it('tem o número esperado de cidades, rotas e espaços', () => {
    const espacos = mapa.rotas.reduce((soma, rota) => soma + rota.espacos, 0)

    expect(nomesDasCidades).toHaveLength(TOTAL_DE_CIDADES)
    expect(mapa.rotas).toHaveLength(TOTAL_DE_ROTAS)
    expect(espacos).toBe(TOTAL_DE_ESPACOS)
  })

  it('liga apenas cidades que existem', () => {
    for (const rota of mapa.rotas) {
      expect(nomesDasCidades).toContain(rota.cidadeA)
      expect(nomesDasCidades).toContain(rota.cidadeB)
    }
  })

  it('não deixa nenhuma cidade sem rota', () => {
    const comRota = new Set(
      mapa.rotas.flatMap((rota) => [rota.cidadeA, rota.cidadeB]),
    )

    expect([...comRota].sort()).toEqual([...nomesDasCidades].sort())
  })

  it('usa só tamanhos de rota que têm pontuação', () => {
    const tamanhosValidos = Object.keys(PONTOS_POR_TAMANHO_DA_ROTA).map(Number)

    for (const rota of mapa.rotas) {
      expect(tamanhosValidos).toContain(rota.espacos)
    }
  })

  it('usa só cores que têm nome', () => {
    for (const rota of mapa.rotas) {
      expect(mapa.nomesDasCores[rota.cor]).toBeDefined()
    }
  })
})

describe('missões', () => {
  it('tem o número esperado de missões, com nomes diferentes', () => {
    const nomes = new Set(missoes.map((missao) => missao.nome))

    expect(missoes).toHaveLength(TOTAL_DE_MISSOES)
    expect(nomes.size).toBe(TOTAL_DE_MISSOES)
  })

  it('usa apenas cidades que existem', () => {
    for (const missao of missoes) {
      for (const cidade of missao.cidades) {
        expect(nomesDasCidades).toContain(cidade)
      }
    }
  })
})

describe('curiosidades', () => {
  it('tem exatamente uma curiosidade para cada cidade', () => {
    const cidades = curiosidades.map((curiosidade) => curiosidade.cidade)

    expect([...cidades].sort()).toEqual([...nomesDasCidades].sort())
  })
})

describe('eventos', () => {
  it('tem o número esperado de eventos, com códigos e nomes diferentes', () => {
    const codigos = new Set(eventos.map((evento) => evento.codigo))
    const nomes = new Set(eventos.map((evento) => evento.nome))

    expect(eventos).toHaveLength(TOTAL_DE_EVENTOS)
    expect(codigos.size).toBe(TOTAL_DE_EVENTOS)
    expect(nomes.size).toBe(TOTAL_DE_EVENTOS)
  })

  it('tem regra implementada no motor para todos os códigos', () => {
    const codigosDoMotor = Object.values(CODIGOS_DOS_EVENTOS).sort()
    const codigosDosDados = eventos.map((evento) => evento.codigo).sort()

    expect(codigosDosDados).toEqual(codigosDoMotor)
  })

  it('descreve o efeito de todos os eventos', () => {
    for (const evento of eventos) {
      expect(evento.descricao.trim()).not.toBe('')
    }
  })
})

describe('baralho', () => {
  it('soma as cartas de cada cor com os coringas', () => {
    const coresDeCarta = Object.keys(mapa.nomesDasCores).filter(
      (codigo) => codigo !== CODIGO_DA_COR_CINZA,
    )
    const total = coresDeCarta.length * CARTAS_POR_COR + CORINGAS_NO_BARALHO

    expect(total).toBe(TOTAL_DE_CARTAS_DO_BARALHO)
  })
})

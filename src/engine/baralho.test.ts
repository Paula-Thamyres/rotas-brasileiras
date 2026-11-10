import { describe, expect, it } from 'vitest'
import type { Carta } from '../types/cartas'
import {
  comprarAberta,
  comprarDoMonte,
  criarBaralho,
  criarMonteCompleto,
  descartar,
  embaralhar,
  type Aleatorio,
  type Baralho,
} from './baralho'
import {
  CARTA_CORINGA,
  CARTAS_ABERTAS_NA_MESA,
  CARTAS_POR_COR,
  CORES_DAS_CARTAS,
  CORINGAS_ABERTOS_PARA_RENOVAR,
  CORINGAS_NO_BARALHO,
} from './constantes'

const TOTAL_DE_CARTAS = 110
const QUANTIDADE_DE_SEMENTES = 200

function aleatorioComSemente(semente: number): Aleatorio {
  let estado = semente

  return () => {
    estado = (estado + 0x6d2b79f5) | 0
    let mistura = Math.imul(estado ^ (estado >>> 15), 1 | estado)
    mistura =
      (mistura + Math.imul(mistura ^ (mistura >>> 7), 61 | mistura)) ^ mistura

    return ((mistura ^ (mistura >>> 14)) >>> 0) / 4294967296
  }
}

function contar(cartas: readonly Carta[], alvo: Carta): number {
  return cartas.filter((carta) => carta === alvo).length
}

function totalDeCartas(baralho: Baralho): number {
  return baralho.monte.length + baralho.descarte.length + baralho.abertas.length
}

function coringasAbertos(baralho: Baralho): number {
  return contar(baralho.abertas, CARTA_CORINGA)
}

describe('monte completo', () => {
  it('tem 110 cartas: 12 de cada cor e 14 coringas', () => {
    const monte = criarMonteCompleto()

    expect(monte).toHaveLength(TOTAL_DE_CARTAS)
    expect(contar(monte, CARTA_CORINGA)).toBe(CORINGAS_NO_BARALHO)

    for (const cor of CORES_DAS_CARTAS) {
      expect(contar(monte, cor)).toBe(CARTAS_POR_COR)
    }
  })
})

describe('embaralhar', () => {
  it('mantém as mesmas cartas e não altera a lista original', () => {
    const original = criarMonteCompleto()
    const copia = [...original]
    const embaralhado = embaralhar(original, aleatorioComSemente(1))

    expect(original).toEqual(copia)
    expect([...embaralhado].sort()).toEqual([...original].sort())
    expect(embaralhado).not.toEqual(original)
  })

  it('dá o mesmo resultado com o mesmo gerador aleatório', () => {
    const monte = criarMonteCompleto()

    expect(embaralhar(monte, aleatorioComSemente(7))).toEqual(
      embaralhar(monte, aleatorioComSemente(7)),
    )
  })

  it('aceita lista vazia e lista de uma carta', () => {
    expect(embaralhar([], aleatorioComSemente(1))).toEqual([])
    expect(embaralhar(['AM'], aleatorioComSemente(1))).toEqual(['AM'])
  })

  it.each([-0.1, 1, 2, Number.NaN, Number.POSITIVE_INFINITY])(
    'recusa gerador que devolve %s',
    (valor) => {
      expect(() => embaralhar(['AM', 'CE'], () => valor)).toThrow(RangeError)
    },
  )
})

describe('criar baralho', () => {
  it('abre 5 cartas e não perde nenhuma', () => {
    const baralho = criarBaralho(aleatorioComSemente(3))

    expect(baralho.abertas).toHaveLength(CARTAS_ABERTAS_NA_MESA)
    expect(totalDeCartas(baralho)).toBe(TOTAL_DE_CARTAS)
  })

  it('nunca começa com 3 ou mais coringas abertos', () => {
    for (let semente = 0; semente < QUANTIDADE_DE_SEMENTES; semente++) {
      const baralho = criarBaralho(aleatorioComSemente(semente))

      expect(coringasAbertos(baralho)).toBeLessThan(
        CORINGAS_ABERTOS_PARA_RENOVAR,
      )
      expect(totalDeCartas(baralho)).toBe(TOTAL_DE_CARTAS)
    }
  })
})

describe('comprar do monte', () => {
  it('entrega a carta do topo e tira ela do monte', () => {
    const baralho: Baralho = {
      monte: ['AM', 'CE', 'PA'],
      descarte: [],
      abertas: [],
    }
    const { baralho: depois, carta } = comprarDoMonte(baralho)

    expect(carta).toBe('AM')
    expect(depois.monte).toEqual(['CE', 'PA'])
    expect(baralho.monte).toEqual(['AM', 'CE', 'PA'])
  })

  it('embaralha o descarte de volta no monte quando o monte acaba', () => {
    const baralho: Baralho = {
      monte: [],
      descarte: ['AM', 'CE', 'PA'],
      abertas: [],
    }
    const { baralho: depois, carta } = comprarDoMonte(
      baralho,
      aleatorioComSemente(5),
    )

    expect(carta).not.toBeNull()
    expect(depois.descarte).toEqual([])
    expect(depois.monte).toHaveLength(2)
    expect([carta, ...depois.monte].sort()).toEqual(['AM', 'CE', 'PA'])
  })

  it('devolve null quando monte e descarte estão vazios', () => {
    const baralho: Baralho = { monte: [], descarte: [], abertas: ['AM'] }
    const { baralho: depois, carta } = comprarDoMonte(baralho)

    expect(carta).toBeNull()
    expect(depois).toEqual(baralho)
  })
})

describe('comprar carta aberta', () => {
  it('entrega a carta escolhida e repõe no mesmo lugar com uma do monte', () => {
    const baralho: Baralho = {
      monte: ['SE', 'LI'],
      descarte: [],
      abertas: ['AM', 'CE', 'PA', 'CA', 'MA'],
    }
    const { baralho: depois, carta } = comprarAberta(baralho, 2)

    expect(carta).toBe('PA')
    expect(depois.abertas).toEqual(['AM', 'CE', 'SE', 'CA', 'MA'])
    expect(depois.monte).toEqual(['LI'])
  })

  it('renova as 5 abertas quando entram 3 coringas', () => {
    const baralho: Baralho = {
      monte: [CARTA_CORINGA, 'LI', 'LI', 'LI', 'LI', 'LI', 'SE', 'SE'],
      descarte: [],
      abertas: ['AM', CARTA_CORINGA, CARTA_CORINGA, 'CE', 'PA'],
    }
    const { baralho: depois } = comprarAberta(baralho, 0)

    expect(depois.abertas).toHaveLength(CARTAS_ABERTAS_NA_MESA)
    expect(coringasAbertos(depois)).toBeLessThan(CORINGAS_ABERTOS_PARA_RENOVAR)
    expect(contar(depois.descarte, CARTA_CORINGA)).toBeGreaterThanOrEqual(
      CORINGAS_ABERTOS_PARA_RENOVAR,
    )
  })

  it('não renova quando não há cartas de cor suficientes para evitar 3 coringas', () => {
    const baralho: Baralho = {
      monte: [CARTA_CORINGA],
      descarte: [],
      abertas: ['AM', CARTA_CORINGA, CARTA_CORINGA, CARTA_CORINGA, 'CE'],
    }
    const { baralho: depois } = comprarAberta(baralho, 0)

    expect(depois.abertas).toEqual([
      CARTA_CORINGA,
      CARTA_CORINGA,
      CARTA_CORINGA,
      CARTA_CORINGA,
      'CE',
    ])
    expect(depois.descarte).toEqual([])
  })

  it('deixa a mesa com menos de 5 cartas quando não há mais o que repor', () => {
    const baralho: Baralho = {
      monte: [],
      descarte: [],
      abertas: ['AM', 'CE', 'PA'],
    }
    const { baralho: depois, carta } = comprarAberta(baralho, 1)

    expect(carta).toBe('CE')
    expect(depois.abertas).toEqual(['AM', 'PA'])
  })

  it.each([-1, 5, 1.5, Number.NaN])('recusa a posição %s', (posicao) => {
    const baralho = criarBaralho(aleatorioComSemente(2))

    expect(() => comprarAberta(baralho, posicao)).toThrow(RangeError)
  })
})

describe('descartar', () => {
  it('põe as cartas no descarte sem alterar o baralho original', () => {
    const baralho: Baralho = { monte: [], descarte: ['AM'], abertas: [] }
    const depois = descartar(baralho, ['CE', CARTA_CORINGA])

    expect(depois.descarte).toEqual(['AM', 'CE', CARTA_CORINGA])
    expect(baralho.descarte).toEqual(['AM'])
  })
})

describe('partida inteira', () => {
  it('nunca perde nem cria cartas ao comprar e descartar', () => {
    const aleatorio = aleatorioComSemente(11)
    let baralho = criarBaralho(aleatorio)
    const mao: Carta[] = []

    for (let rodada = 0; rodada < 300; rodada++) {
      const escolhida = rodada % 3 === 0 ? 'monte' : 'aberta'

      if (escolhida === 'monte') {
        const { baralho: depois, carta } = comprarDoMonte(baralho, aleatorio)
        baralho = depois
        if (carta !== null) mao.push(carta)
      } else if (baralho.abertas.length > 0) {
        const { baralho: depois, carta } = comprarAberta(baralho, 0, aleatorio)
        baralho = depois
        mao.push(carta)
      }

      if (mao.length >= 4) baralho = descartar(baralho, mao.splice(0, 4))

      expect(totalDeCartas(baralho) + mao.length).toBe(TOTAL_DE_CARTAS)
    }
  })
})

import { describe, expect, it } from 'vitest'
import { mapa } from '../data'
import type { Carta } from '../types/cartas'
import type { Evento } from '../types/eventos'
import type { Jogador } from '../types/jogador'
import type { Rota } from '../types/mapa'
import { CAMINHOES_POR_JOGADOR, CARTA_CORINGA } from './constantes'
import { CODIGOS_DOS_EVENTOS } from './eventos'
import { criarJogador } from './jogador'
import { idDaRota, reivindicarRota, type DonosDasRotas } from './rotas'

const TOTAL_DE_ROTAS = 100
const MESA_DE_TRES = 3
const MESA_DE_QUATRO = 4

const rotaVerde: Rota = {
  cidadeA: 'Manaus',
  cidadeB: 'Porto Velho',
  espacos: 4,
  paralela: null,
  cor: 'AM',
}

const rotaCinza: Rota = {
  cidadeA: 'Marabá',
  cidadeB: 'Brasília',
  espacos: 6,
  paralela: null,
  cor: 'GR',
}

const rotaDupla0: Rota = {
  cidadeA: 'Brasília',
  cidadeB: 'Goiânia',
  espacos: 1,
  paralela: 0,
  cor: 'CE',
}

const rotaDupla1: Rota = { ...rotaDupla0, paralela: 1, cor: 'GR' }

function jogadorComMao(mao: readonly Carta[], id = 'ana'): Jogador {
  return { ...criarJogador(id, id), mao }
}

function cartas(cor: Carta, quantidade: number): Carta[] {
  return Array<Carta>(quantidade).fill(cor)
}

describe('reivindicar rota colorida', () => {
  it('cobra as cartas, tira os caminhões, soma pontos e registra o dono', () => {
    const jogador = jogadorComMao([...cartas('AM', 5), 'CE'])
    const resultado = reivindicarRota({
      rota: rotaVerde,
      jogador,
      donosDasRotas: {},
      totalDeJogadores: MESA_DE_TRES,
    })

    expect(resultado).toEqual({
      valida: true,
      jogador: {
        ...jogador,
        caminhoes: CAMINHOES_POR_JOGADOR - 4,
        pontos: 7,
        mao: ['AM', 'CE'],
        rotas: [idDaRota(rotaVerde)],
      },
      donosDasRotas: { [idDaRota(rotaVerde)]: 'ana' },
      cartasPagas: cartas('AM', 4),
    })
  })

  it('completa com coringas quando faltam cartas da cor', () => {
    const jogador = jogadorComMao([
      'AM',
      'AM',
      CARTA_CORINGA,
      CARTA_CORINGA,
      'CE',
    ])
    const resultado = reivindicarRota({
      rota: rotaVerde,
      jogador,
      donosDasRotas: {},
      totalDeJogadores: MESA_DE_TRES,
    })

    expect(resultado).toMatchObject({
      valida: true,
      cartasPagas: ['AM', 'AM', CARTA_CORINGA, CARTA_CORINGA],
    })
    expect(resultado.valida && resultado.jogador.mao).toEqual(['CE'])
  })

  it('usa a quantidade de coringas escolhida, mesmo havendo cartas da cor', () => {
    const jogador = jogadorComMao([...cartas('AM', 4), CARTA_CORINGA])
    const resultado = reivindicarRota({
      rota: rotaVerde,
      jogador,
      donosDasRotas: {},
      totalDeJogadores: MESA_DE_TRES,
      coringasUsados: 1,
    })

    expect(resultado).toMatchObject({
      valida: true,
      cartasPagas: ['AM', 'AM', 'AM', CARTA_CORINGA],
    })
    expect(resultado.valida && resultado.jogador.mao).toEqual(['AM'])
  })

  it('aceita pagar só com coringas', () => {
    const jogador = jogadorComMao(cartas(CARTA_CORINGA, 4))
    const resultado = reivindicarRota({
      rota: rotaVerde,
      jogador,
      donosDasRotas: {},
      totalDeJogadores: MESA_DE_TRES,
    })

    expect(resultado.valida).toBe(true)
  })

  it('recusa cor diferente da rota', () => {
    const resultado = reivindicarRota({
      rota: rotaVerde,
      jogador: jogadorComMao(cartas('CE', 4)),
      donosDasRotas: {},
      totalDeJogadores: MESA_DE_TRES,
      cor: 'CE',
    })

    expect(resultado).toEqual({ valida: false, motivo: 'COR_INCORRETA' })
  })

  it('recusa quando faltam cartas', () => {
    const resultado = reivindicarRota({
      rota: rotaVerde,
      jogador: jogadorComMao([...cartas('AM', 3), 'CE']),
      donosDasRotas: {},
      totalDeJogadores: MESA_DE_TRES,
    })

    expect(resultado).toEqual({ valida: false, motivo: 'CARTAS_INSUFICIENTES' })
  })

  it('recusa quando faltam caminhões', () => {
    const jogador = { ...jogadorComMao(cartas('AM', 4)), caminhoes: 3 }
    const resultado = reivindicarRota({
      rota: rotaVerde,
      jogador,
      donosDasRotas: {},
      totalDeJogadores: MESA_DE_TRES,
    })

    expect(resultado).toEqual({
      valida: false,
      motivo: 'CAMINHOES_INSUFICIENTES',
    })
  })

  it('recusa rota que já tem dono', () => {
    const donos: DonosDasRotas = { [idDaRota(rotaVerde)]: 'bia' }
    const resultado = reivindicarRota({
      rota: rotaVerde,
      jogador: jogadorComMao(cartas('AM', 4)),
      donosDasRotas: donos,
      totalDeJogadores: MESA_DE_TRES,
    })

    expect(resultado).toEqual({ valida: false, motivo: 'ROTA_JA_REIVINDICADA' })
  })

  it.each([-1, 1.5, 5, 2, Number.NaN])(
    'recusa %s coringas quando a conta não fecha',
    (coringasUsados) => {
      const resultado = reivindicarRota({
        rota: rotaVerde,
        jogador: jogadorComMao([...cartas('AM', 4), CARTA_CORINGA]),
        donosDasRotas: {},
        totalDeJogadores: MESA_DE_TRES,
        coringasUsados,
      })

      expect(resultado.valida).toBe(false)
    },
  )

  it('não altera o jogador nem os donos recebidos', () => {
    const jogador = jogadorComMao(cartas('AM', 4))
    const donos: DonosDasRotas = {}

    reivindicarRota({
      rota: rotaVerde,
      jogador,
      donosDasRotas: donos,
      totalDeJogadores: MESA_DE_TRES,
    })

    expect(jogador.mao).toHaveLength(4)
    expect(jogador.caminhoes).toBe(CAMINHOES_POR_JOGADOR)
    expect(donos).toEqual({})
  })
})

describe('reivindicar rota cinza', () => {
  it('exige que o jogador escolha a cor', () => {
    const resultado = reivindicarRota({
      rota: rotaCinza,
      jogador: jogadorComMao(cartas('CA', 6)),
      donosDasRotas: {},
      totalDeJogadores: MESA_DE_TRES,
    })

    expect(resultado).toEqual({ valida: false, motivo: 'COR_OBRIGATORIA' })
  })

  it('aceita qualquer cor, desde que seja uma só', () => {
    const jogador = jogadorComMao([...cartas('CA', 5), CARTA_CORINGA])
    const resultado = reivindicarRota({
      rota: rotaCinza,
      jogador,
      donosDasRotas: {},
      totalDeJogadores: MESA_DE_TRES,
      cor: 'CA',
    })

    expect(resultado).toMatchObject({
      valida: true,
      cartasPagas: [...cartas('CA', 5), CARTA_CORINGA],
    })
    expect(resultado.valida && resultado.jogador.pontos).toBe(15)
  })
})

describe('rotas duplas', () => {
  const donosComPrimeiraDeBia: DonosDasRotas = {
    [idDaRota(rotaDupla0)]: 'bia',
  }

  it('bloqueia a segunda rota em mesa de 2 ou 3 jogadores', () => {
    const resultado = reivindicarRota({
      rota: rotaDupla1,
      jogador: jogadorComMao(['AM']),
      donosDasRotas: donosComPrimeiraDeBia,
      totalDeJogadores: MESA_DE_TRES,
      cor: 'AM',
    })

    expect(resultado).toEqual({
      valida: false,
      motivo: 'PARALELA_BLOQUEADA_PARA_ESTA_MESA',
    })
  })

  it('libera a segunda rota para outro jogador em mesa de 4 ou 5', () => {
    const resultado = reivindicarRota({
      rota: rotaDupla1,
      jogador: jogadorComMao(['AM']),
      donosDasRotas: donosComPrimeiraDeBia,
      totalDeJogadores: MESA_DE_QUATRO,
      cor: 'AM',
    })

    expect(resultado.valida).toBe(true)
  })

  it('nunca deixa o mesmo jogador ficar com as duas rotas', () => {
    const resultado = reivindicarRota({
      rota: rotaDupla1,
      jogador: jogadorComMao(['AM'], 'bia'),
      donosDasRotas: donosComPrimeiraDeBia,
      totalDeJogadores: MESA_DE_QUATRO,
      cor: 'AM',
    })

    expect(resultado).toEqual({
      valida: false,
      motivo: 'PARALELA_DO_MESMO_JOGADOR',
    })
  })

  it('permite a primeira rota normalmente', () => {
    const resultado = reivindicarRota({
      rota: rotaDupla0,
      jogador: jogadorComMao(['CE']),
      donosDasRotas: {},
      totalDeJogadores: MESA_DE_TRES,
    })

    expect(resultado.valida).toBe(true)
  })
})

describe('quantidade de jogadores', () => {
  it.each([0, 1, 6, 2.5, Number.NaN])(
    'recusa mesa de %s jogadores',
    (total) => {
      expect(() =>
        reivindicarRota({
          rota: rotaVerde,
          jogador: jogadorComMao(cartas('AM', 4)),
          donosDasRotas: {},
          totalDeJogadores: total,
        }),
      ).toThrow(RangeError)
    },
  )
})

function evento(codigo: string): Evento {
  return { codigo, nome: codigo, descricao: codigo }
}

function pedirComEvento(
  codigo: string,
  mao: readonly Carta[],
  extras: Partial<Parameters<typeof reivindicarRota>[0]> = {},
  rota: Rota = rotaVerde,
) {
  return reivindicarRota({
    rota,
    jogador: jogadorComMao(mao),
    donosDasRotas: {},
    totalDeJogadores: MESA_DE_TRES,
    evento: evento(codigo),
    ...extras,
  })
}

describe('reivindicar rota durante um evento', () => {
  it('chuva forte: rota de 4 espaços custa 5 cartas e dá os pontos de 4', () => {
    const resultado = pedirComEvento(
      CODIGOS_DOS_EVENTOS.chuvaForte,
      cartas('AM', 5),
    )

    expect(resultado).toMatchObject({
      valida: true,
      cartasPagas: cartas('AM', 5),
      jogador: { caminhoes: CAMINHOES_POR_JOGADOR - 4, pontos: 7, mao: [] },
    })
  })

  it('chuva forte: recusa se faltar a carta extra', () => {
    const resultado = pedirComEvento(
      CODIGOS_DOS_EVENTOS.chuvaForte,
      cartas('AM', 4),
    )

    expect(resultado).toEqual({ valida: false, motivo: 'CARTAS_INSUFICIENTES' })
  })

  it('estrada liberada: rota de 2 espaços custa 1 carta', () => {
    const rota: Rota = { ...rotaVerde, espacos: 2 }
    const resultado = pedirComEvento(
      CODIGOS_DOS_EVENTOS.estradaLiberada,
      ['AM', 'CE'],
      {},
      rota,
    )

    expect(resultado).toMatchObject({
      valida: true,
      cartasPagas: ['AM'],
      jogador: { caminhoes: CAMINHOES_POR_JOGADOR - 2, pontos: 2, mao: ['CE'] },
    })
  })

  it('greve de caminhoneiros: recusa rota de 4 espaços e aceita a de 3', () => {
    const maoCheia = cartas('AM', 6)
    const rotaDeTres: Rota = { ...rotaVerde, espacos: 3 }

    expect(
      pedirComEvento(CODIGOS_DOS_EVENTOS.greveDeCaminhoneiros, maoCheia),
    ).toEqual({ valida: false, motivo: 'GREVE_DE_CAMINHONEIROS' })
    expect(
      pedirComEvento(
        CODIGOS_DOS_EVENTOS.greveDeCaminhoneiros,
        maoCheia,
        {},
        rotaDeTres,
      ).valida,
    ).toBe(true)
  })

  it('céu limpo: rota de 6 espaços rende 2 pontos a mais', () => {
    const resultado = pedirComEvento(
      CODIGOS_DOS_EVENTOS.ceuLimpo,
      cartas('PA', 6),
      { cor: 'PA' },
      rotaCinza,
    )

    expect(resultado).toMatchObject({ valida: true, jogador: { pontos: 17 } })
  })

  describe('pedágio', () => {
    const mao: Carta[] = [...cartas('AM', 4), 'CE']

    it('cobra a carta extra escolhida, de qualquer cor', () => {
      const resultado = pedirComEvento(CODIGOS_DOS_EVENTOS.pedagio, mao, {
        cartaDoPedagio: 'CE',
      })

      expect(resultado).toMatchObject({
        valida: true,
        cartasPagas: [...cartas('AM', 4), 'CE'],
        jogador: { mao: [], pontos: 7 },
      })
    })

    it('aceita o Estepe como carta do pedágio', () => {
      const resultado = pedirComEvento(
        CODIGOS_DOS_EVENTOS.pedagio,
        [...cartas('AM', 4), CARTA_CORINGA],
        { cartaDoPedagio: CARTA_CORINGA, coringasUsados: 0 },
      )

      expect(resultado).toMatchObject({ valida: true, jogador: { mao: [] } })
    })

    it('recusa sem escolher a carta do pedágio', () => {
      expect(pedirComEvento(CODIGOS_DOS_EVENTOS.pedagio, mao)).toEqual({
        valida: false,
        motivo: 'CARTA_DO_PEDAGIO_OBRIGATORIA',
      })
    })

    it('recusa carta do pedágio que não sobra na mão', () => {
      expect(
        pedirComEvento(CODIGOS_DOS_EVENTOS.pedagio, mao, {
          cartaDoPedagio: 'PA',
        }),
      ).toEqual({ valida: false, motivo: 'CARTA_DO_PEDAGIO_INDISPONIVEL' })
    })

    it('recusa usar para o pedágio uma carta que já paga a rota', () => {
      expect(
        pedirComEvento(CODIGOS_DOS_EVENTOS.pedagio, cartas('AM', 4), {
          cartaDoPedagio: 'AM',
        }),
      ).toEqual({ valida: false, motivo: 'CARTA_DO_PEDAGIO_INDISPONIVEL' })
    })
  })

  describe('boleia amiga', () => {
    const boleia = CODIGOS_DOS_EVENTOS.boleiaAmiga

    it('cada Estepe paga 2 espaços', () => {
      const resultado = pedirComEvento(boleia, ['AM', 'AM', CARTA_CORINGA])

      expect(resultado).toMatchObject({
        valida: true,
        cartasPagas: ['AM', 'AM', CARTA_CORINGA],
        jogador: { mao: [] },
      })
    })

    it('usa só Estepes quando a mão não tem cartas da cor', () => {
      const resultado = pedirComEvento(boleia, [CARTA_CORINGA, CARTA_CORINGA])

      expect(resultado).toMatchObject({
        valida: true,
        cartasPagas: [CARTA_CORINGA, CARTA_CORINGA],
      })
    })

    it('aceita um Estepe a mais para fechar uma rota de espaços ímpares', () => {
      const rotaDeTres: Rota = { ...rotaVerde, espacos: 3 }
      const resultado = pedirComEvento(
        boleia,
        [CARTA_CORINGA, CARTA_CORINGA],
        {},
        rotaDeTres,
      )

      expect(resultado).toMatchObject({
        valida: true,
        cartasPagas: [CARTA_CORINGA, CARTA_CORINGA],
      })
    })

    it('recusa mais Estepes do que o necessário', () => {
      const resultado = pedirComEvento(boleia, cartas(CARTA_CORINGA, 3), {
        coringasUsados: 3,
      })

      expect(resultado).toEqual({
        valida: false,
        motivo: 'QUANTIDADE_DE_CORINGAS_INVALIDA',
      })
    })

    it('recusa quando as cartas não cobrem os espaços', () => {
      const resultado = pedirComEvento(boleia, ['AM', CARTA_CORINGA])

      expect(resultado).toEqual({
        valida: false,
        motivo: 'CARTAS_INSUFICIENTES',
      })
    })
  })

  it('um evento sem efeito mantém as regras normais', () => {
    const resultado = pedirComEvento('dia-normal', cartas('AM', 4))

    expect(resultado).toMatchObject({
      valida: true,
      cartasPagas: cartas('AM', 4),
    })
  })
})

describe('identificação das rotas do mapa', () => {
  it('dá um id diferente para cada uma das 100 rotas', () => {
    const ids = new Set(mapa.rotas.map(idDaRota))

    expect(ids.size).toBe(TOTAL_DE_ROTAS)
  })

  it('todo par de rotas duplas tem as duas metades no mapa', () => {
    const ids = new Set(mapa.rotas.map(idDaRota))

    for (const rota of mapa.rotas.filter((r) => r.paralela !== null)) {
      const irma = { ...rota, paralela: rota.paralela === 0 ? 1 : 0 } as Rota

      expect(ids).toContain(idDaRota(irma))
    }
  })
})

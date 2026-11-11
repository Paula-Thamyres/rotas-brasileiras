import { describe, expect, it } from 'vitest'
import type { Carta } from '../types/cartas'
import type { Curiosidade } from '../types/curiosidades'
import type { Evento } from '../types/eventos'
import type { Rota } from '../types/mapa'
import type { Missao } from '../types/missoes'
import {
  comprarCartaAberta,
  comprarCartaDoMonte,
  comprarMissoes,
  criarPartida,
  escolherMissoes,
  eventoDaPartida,
  jogadorDaVez,
  periodoDoDia,
  rodadaDaPartida,
  reivindicarRotaDaVez,
  type ConteudoDaPartida,
  type Partida,
  type ResultadoDaAcao,
} from './partida'
import {
  CAMINHOES_PARA_ULTIMA_RODADA,
  CAMINHOES_POR_JOGADOR,
  CARTA_CORINGA,
  CARTAS_ABERTAS_NA_MESA,
  CARTAS_INICIAIS_POR_JOGADOR,
  MISSOES_MINIMAS_NO_INICIO,
  MISSOES_OFERECIDAS_NO_INICIO,
  MISSOES_OFERECIDAS_NO_TURNO,
} from './constantes'
import { CODIGOS_DOS_EVENTOS } from './eventos'
import { idDaRota } from './rotas'
import { aleatorioComSemente } from './aleatorioComSemente'

const TOTAL_DE_CARTAS = 110
const QUANTIDADE_DE_SEMENTES = 50
const TOTAL_DE_MISSOES_DE_TESTE = 20

const rotaCurta: Rota = {
  cidadeA: 'Manaus',
  cidadeB: 'Santarém',
  espacos: 2,
  paralela: null,
  cor: 'AM',
}

function criarMissoesDeTeste(quantidade: number): Missao[] {
  return Array.from({ length: quantidade }, (_, indice) => ({
    tipo: 'ligacao' as const,
    nome: `Missão ${indice + 1}`,
    cidades: ['A', 'B'],
    pontos: indice + 1,
  }))
}

const eventoNeutro: Evento = {
  codigo: 'dia-normal',
  nome: 'Dia normal',
  descricao: 'Sem efeito.',
}

const curiosidadeDeManaus: Curiosidade = {
  cidade: 'Manaus',
  fato: 'Fato de teste.',
  fonte: 'https://exemplo.com',
  pontos: 1,
}

function criarConteudoDeTeste(
  sobrescrita: Partial<ConteudoDaPartida> = {},
): ConteudoDaPartida {
  return {
    missoes: criarMissoesDeTeste(TOTAL_DE_MISSOES_DE_TESTE),
    eventos: [eventoNeutro],
    curiosidades: [],
    ...sobrescrita,
  }
}

const conteudoDeTeste = criarConteudoDeTeste()

function novaPartidaComEvento(codigo: string, nomes = ['Ana', 'Bia']): Partida {
  const evento: Evento = { codigo, nome: codigo, descricao: codigo }

  return novaPartida(nomes, criarConteudoDeTeste({ eventos: [evento] }))
}

function novaPartidaComCuriosidades(): Partida {
  return novaPartida(
    ['Ana', 'Bia'],
    criarConteudoDeTeste({ curiosidades: [curiosidadeDeManaus] }),
  )
}

function partidaNaEscolhaInicial(
  nomes = ['Ana', 'Bia'],
  conteudo = conteudoDeTeste,
): Partida {
  return criarPartida(nomes, conteudo, aleatorioComSemente(1))
}

function nomesDaOferta(partida: Partida): string[] {
  return (partida.oferta?.missoes ?? []).map((missao) => missao.nome)
}

function novaPartida(
  nomes = ['Ana', 'Bia'],
  conteudo = conteudoDeTeste,
): Partida {
  let partida = partidaNaEscolhaInicial(nomes, conteudo)

  while (partida.fase === 'ESCOLHA_INICIAL_DE_MISSOES') {
    partida = aceitar(
      escolherMissoes(
        partida,
        nomesDaOferta(partida).slice(0, MISSOES_MINIMAS_NO_INICIO),
      ),
    )
  }

  return partida
}

function aceitar(resultado: ResultadoDaAcao): Partida {
  if (!resultado.valida) {
    throw new Error(`Ação recusada: ${resultado.motivo}`)
  }

  return resultado.partida
}

function jogarTurnoDeCompra(partida: Partida): Partida {
  return aceitar(comprarCartaDoMonte(aceitar(comprarCartaDoMonte(partida))))
}

function totalDeMissoes(partida: Partida): number {
  const nasMaos = partida.jogadores.reduce(
    (soma, jogador) => soma + jogador.missoes.length,
    0,
  )

  return (
    partida.monteDeMissoes.length +
    (partida.oferta?.missoes.length ?? 0) +
    nasMaos
  )
}

function totalDeCartas(partida: Partida): number {
  const { monte, descarte, abertas } = partida.baralho
  const nasMaos = partida.jogadores.reduce(
    (soma, jogador) => soma + jogador.mao.length,
    0,
  )

  return monte.length + descarte.length + abertas.length + nasMaos
}

function comMaoDaVez(partida: Partida, mao: readonly Carta[]): Partida {
  return {
    ...partida,
    jogadores: partida.jogadores.map((jogador, indice) =>
      indice === partida.indiceDaVez ? { ...jogador, mao } : jogador,
    ),
  }
}

function comCaminhoesDaVez(partida: Partida, caminhoes: number): Partida {
  return {
    ...partida,
    jogadores: partida.jogadores.map((jogador, indice) =>
      indice === partida.indiceDaVez ? { ...jogador, caminhoes } : jogador,
    ),
  }
}

function comAbertas(partida: Partida, abertas: readonly Carta[]): Partida {
  return { ...partida, baralho: { ...partida.baralho, abertas } }
}

describe('criar partida', () => {
  it('dá 4 cartas e 45 caminhões a cada jogador e abre 5 cartas na mesa', () => {
    const partida = novaPartida(['Ana', 'Bia', 'Caio'])

    expect(partida.jogadores).toHaveLength(3)
    expect(partida.baralho.abertas).toHaveLength(CARTAS_ABERTAS_NA_MESA)

    for (const jogador of partida.jogadores) {
      expect(jogador.mao).toHaveLength(CARTAS_INICIAIS_POR_JOGADOR)
      expect(jogador.caminhoes).toBe(CAMINHOES_POR_JOGADOR)
    }

    expect(totalDeCartas(partida)).toBe(TOTAL_DE_CARTAS)
  })

  it('começa na vez do primeiro jogador, sem compra em andamento e sem fim', () => {
    const partida = novaPartida()

    expect(jogadorDaVez(partida).nome).toBe('Ana')
    expect(partida.cartasCompradasNoTurno).toBe(0)
    expect(partida.turnosRestantes).toBeNull()
    expect(partida.encerrada).toBe(false)
  })

  it.each([[[]], [['Ana']], [['A', 'B', 'C', 'D', 'E', 'F']]])(
    'recusa quantidade inválida de jogadores (%j)',
    (nomes) => {
      expect(() => criarPartida(nomes, conteudoDeTeste)).toThrow(RangeError)
    },
  )

  it('usa a quantidade de caminhões pedida para a partida', () => {
    const partida = criarPartida(
      ['Ana', 'Bia'],
      conteudoDeTeste,
      aleatorioComSemente(1),
      20,
    )

    expect(partida.jogadores.map(({ caminhoes }) => caminhoes)).toEqual([
      20, 20,
    ])
  })

  it.each([0, CAMINHOES_PARA_ULTIMA_RODADA, 20.5, Number.NaN])(
    'recusa caminhões que não deixam a partida começar (%j)',
    (caminhoes) => {
      expect(() =>
        criarPartida(
          ['Ana', 'Bia'],
          conteudoDeTeste,
          aleatorioComSemente(1),
          caminhoes,
        ),
      ).toThrow(RangeError)
    },
  )

  it('recusa nomes repetidos, ignorando maiúsculas e espaços', () => {
    expect(() => criarPartida(['Ana', ' ana '], conteudoDeTeste)).toThrow(
      RangeError,
    )
  })

  it('recusa nome vazio', () => {
    expect(() => criarPartida(['Ana', '  '], conteudoDeTeste)).toThrow(
      RangeError,
    )
  })

  it('recusa quando não há missões suficientes para a primeira escolha', () => {
    const poucas = criarMissoesDeTeste(5)

    expect(() =>
      criarPartida(['Ana', 'Bia'], criarConteudoDeTeste({ missoes: poucas })),
    ).toThrow(RangeError)
  })

  it('recusa missões com nomes repetidos', () => {
    const repetidas = criarMissoesDeTeste(6).map((missao) => ({
      ...missao,
      nome: 'Igual',
    }))

    expect(() =>
      criarPartida(
        ['Ana', 'Bia'],
        criarConteudoDeTeste({ missoes: repetidas }),
      ),
    ).toThrow(RangeError)
  })
})

describe('comprar cartas', () => {
  it('passa a vez depois de duas compras do monte', () => {
    const partida = novaPartida()
    const primeira = aceitar(comprarCartaDoMonte(partida))

    expect(jogadorDaVez(primeira).nome).toBe('Ana')
    expect(primeira.cartasCompradasNoTurno).toBe(1)

    const segunda = aceitar(comprarCartaDoMonte(primeira))

    expect(jogadorDaVez(segunda).nome).toBe('Bia')
    expect(segunda.cartasCompradasNoTurno).toBe(0)
    expect(segunda.jogadores[0].mao).toHaveLength(
      CARTAS_INICIAIS_POR_JOGADOR + 2,
    )
    expect(totalDeCartas(segunda)).toBe(TOTAL_DE_CARTAS)
  })

  it('aceita uma carta aberta e uma do monte no mesmo turno', () => {
    const partida = comAbertas(novaPartida(), ['AM', 'CE', 'PA', 'CA', 'MA'])
    const primeira = aceitar(comprarCartaAberta(partida, 0))
    const segunda = aceitar(comprarCartaDoMonte(primeira))

    expect(jogadorDaVez(segunda).nome).toBe('Bia')
    expect(totalDeCartas(segunda)).toBe(TOTAL_DE_CARTAS)
  })

  it('encerra o turno ao pegar um coringa aberto', () => {
    const partida = comAbertas(novaPartida(), [
      CARTA_CORINGA,
      'CE',
      'PA',
      'CA',
      'MA',
    ])
    const depois = aceitar(comprarCartaAberta(partida, 0))

    expect(jogadorDaVez(depois).nome).toBe('Bia')
    expect(depois.jogadores[0].mao).toContain(CARTA_CORINGA)
  })

  it('recusa coringa aberto como segunda compra', () => {
    const partida = comAbertas(novaPartida(), [
      CARTA_CORINGA,
      'CE',
      'PA',
      'CA',
      'MA',
    ])
    const primeira = aceitar(comprarCartaAberta(partida, 1))
    const resultado = comprarCartaAberta(primeira, 0)

    expect(resultado).toEqual({
      valida: false,
      motivo: 'CORINGA_ABERTO_NA_SEGUNDA_COMPRA',
    })
  })

  it('informa a carta pega da mesa e a carta que veio do monte', () => {
    const partida = comAbertas(novaPartida(), ['AM', 'CE', 'PA', 'CA', 'MA'])
    const daMesa = comprarCartaAberta(partida, 1)
    const doMonte = comprarCartaDoMonte(partida)

    expect(daMesa.valida && daMesa.cartaPega).toEqual({
      carta: 'CE',
      origem: 'MESA',
    })
    expect(doMonte.valida && doMonte.cartaPega).toEqual({
      carta: partida.baralho.monte[0],
      origem: 'MONTE',
    })
  })

  it('informa a carta pega mesmo quando a compra passa a vez', () => {
    const partida = comAbertas(novaPartida(), [
      CARTA_CORINGA,
      'CE',
      'PA',
      'CA',
      'MA',
    ])
    const resultado = comprarCartaAberta(partida, 0)

    expect(resultado.valida && resultado.cartaPega).toEqual({
      carta: CARTA_CORINGA,
      origem: 'MESA',
    })
  })

  it('recusa posição inválida da carta aberta', () => {
    expect(() => comprarCartaAberta(novaPartida(), 9)).toThrow(RangeError)
  })

  it('recusa comprar do monte quando não sobra nenhuma carta', () => {
    const partida: Partida = {
      ...novaPartida(),
      baralho: { monte: [], descarte: [], abertas: [] },
    }

    expect(comprarCartaDoMonte(partida)).toEqual({
      valida: false,
      motivo: 'SEM_CARTAS_PARA_COMPRAR',
    })
  })

  it('passa a vez sozinha quando a segunda carta não existe', () => {
    const partida: Partida = {
      ...novaPartida(),
      baralho: { monte: ['AM'], descarte: [], abertas: [] },
    }
    const depois = aceitar(comprarCartaDoMonte(partida))

    expect(jogadorDaVez(depois).nome).toBe('Bia')
  })
})

describe('reivindicar rota na vez', () => {
  const partidaComCartas = comMaoDaVez(novaPartida(), ['AM', 'AM', 'CE'])

  it('registra a rota, manda as cartas pagas ao descarte e passa a vez', () => {
    const depois = aceitar(
      reivindicarRotaDaVez(partidaComCartas, { rota: rotaCurta }),
    )

    expect(depois.donosDasRotas).toEqual({
      [idDaRota(rotaCurta)]: 'jogador-1',
    })
    expect(depois.jogadores[0].mao).toEqual(['CE'])
    expect(depois.jogadores[0].pontos).toBe(2)
    expect(depois.baralho.descarte).toEqual(['AM', 'AM'])
    expect(jogadorDaVez(depois).nome).toBe('Bia')
  })

  it('recusa no meio de uma compra de cartas', () => {
    const emCompra = aceitar(comprarCartaDoMonte(partidaComCartas))
    const resultado = reivindicarRotaDaVez(emCompra, { rota: rotaCurta })

    expect(resultado).toEqual({ valida: false, motivo: 'COMPRA_EM_ANDAMENTO' })
  })

  it('repassa o motivo quando a rota não vale', () => {
    const semCartas = comMaoDaVez(novaPartida(), ['CE'])
    const resultado = reivindicarRotaDaVez(semCartas, { rota: rotaCurta })

    expect(resultado).toEqual({ valida: false, motivo: 'CARTAS_INSUFICIENTES' })
  })

  it('não altera a partida recebida', () => {
    reivindicarRotaDaVez(partidaComCartas, { rota: rotaCurta })

    expect(partidaComCartas.donosDasRotas).toEqual({})
    expect(partidaComCartas.jogadores[0].mao).toHaveLength(3)
  })
})

describe('fim de jogo', () => {
  it('abre a última rodada quando alguém termina o turno com 2 caminhões ou menos', () => {
    const quase = comCaminhoesDaVez(
      comMaoDaVez(novaPartida(['Ana', 'Bia', 'Caio']), ['AM', 'AM']),
      4,
    )
    const depois = aceitar(reivindicarRotaDaVez(quase, { rota: rotaCurta }))

    expect(depois.jogadores[0].caminhoes).toBe(2)
    expect(depois.turnosRestantes).toBe(3)
    expect(depois.encerrada).toBe(false)
  })

  it('dá mais um turno para todos, inclusive quem abriu a última rodada, e encerra', () => {
    const quase = comCaminhoesDaVez(
      comMaoDaVez(novaPartida(['Ana', 'Bia', 'Caio']), ['AM', 'AM']),
      4,
    )
    let partida = aceitar(reivindicarRotaDaVez(quase, { rota: rotaCurta }))
    const quemJogou: string[] = []

    while (!partida.encerrada) {
      quemJogou.push(jogadorDaVez(partida).nome)
      partida = jogarTurnoDeCompra(partida)
    }

    expect(quemJogou).toEqual(['Bia', 'Caio', 'Ana'])
  })

  it('não abre outra última rodada se mais alguém ficar com poucos caminhões', () => {
    const quase = comCaminhoesDaVez(
      comMaoDaVez(novaPartida(['Ana', 'Bia', 'Caio']), ['AM', 'AM']),
      4,
    )
    const aberta = aceitar(reivindicarRotaDaVez(quase, { rota: rotaCurta }))
    const outraRota: Rota = { ...rotaCurta, cidadeB: 'Porto Velho' }
    const segunda = comCaminhoesDaVez(comMaoDaVez(aberta, ['AM', 'AM']), 2)
    const depois = aceitar(reivindicarRotaDaVez(segunda, { rota: outraRota }))

    expect(depois.turnosRestantes).toBe(2)
  })

  it('recusa qualquer ação depois do fim', () => {
    const fim: Partida = { ...novaPartida(), encerrada: true }

    expect(comprarCartaDoMonte(fim)).toEqual({
      valida: false,
      motivo: 'PARTIDA_ENCERRADA',
    })
    expect(comprarCartaAberta(fim, 0)).toEqual({
      valida: false,
      motivo: 'PARTIDA_ENCERRADA',
    })
    expect(reivindicarRotaDaVez(fim, { rota: rotaCurta })).toEqual({
      valida: false,
      motivo: 'PARTIDA_ENCERRADA',
    })
  })
})

describe('partida inteira', () => {
  it('nunca perde nem cria cartas em partidas com várias sementes', () => {
    for (let semente = 0; semente < QUANTIDADE_DE_SEMENTES; semente++) {
      const aleatorio = aleatorioComSemente(semente)
      let partida = novaPartida(['Ana', 'Bia', 'Caio'])

      for (let jogada = 0; jogada < 60; jogada++) {
        const resultado =
          jogada % 2 === 0
            ? comprarCartaDoMonte(partida, aleatorio)
            : comprarCartaAberta(partida, 0, aleatorio)

        if (resultado.valida) partida = resultado.partida

        expect(totalDeCartas(partida)).toBe(TOTAL_DE_CARTAS)
      }
    }
  })
})

describe('escolha inicial de missões', () => {
  it('começa oferecendo 3 missões ao primeiro jogador', () => {
    const partida = partidaNaEscolhaInicial()

    expect(partida.fase).toBe('ESCOLHA_INICIAL_DE_MISSOES')
    expect(jogadorDaVez(partida).nome).toBe('Ana')
    expect(partida.oferta?.missoes).toHaveLength(MISSOES_OFERECIDAS_NO_INICIO)
    expect(partida.oferta?.minimoParaManter).toBe(MISSOES_MINIMAS_NO_INICIO)
  })

  it('bloqueia as outras ações até todos escolherem', () => {
    const partida = partidaNaEscolhaInicial()
    const bloqueada = {
      valida: false,
      motivo: 'ESCOLHA_DE_MISSOES_PENDENTE',
    }

    expect(comprarCartaDoMonte(partida)).toEqual(bloqueada)
    expect(comprarCartaAberta(partida, 0)).toEqual(bloqueada)
    expect(reivindicarRotaDaVez(partida, { rota: rotaCurta })).toEqual(
      bloqueada,
    )
    expect(comprarMissoes(partida)).toEqual(bloqueada)
  })

  it('passa a oferta ao próximo jogador e devolve as recusadas ao fim do monte', () => {
    const partida = partidaNaEscolhaInicial()
    const [primeira, segunda, recusada] = nomesDaOferta(partida)
    const depois = aceitar(escolherMissoes(partida, [primeira, segunda]))

    expect(jogadorDaVez(depois).nome).toBe('Bia')
    expect(depois.jogadores[0].missoes.map((m) => m.nome)).toEqual([
      primeira,
      segunda,
    ])
    expect(depois.monteDeMissoes.at(-1)?.nome).toBe(recusada)
    expect(nomesDaOferta(depois)).not.toContain(recusada)
  })

  it('começa o jogo na vez do primeiro jogador depois que todos escolhem', () => {
    const partida = novaPartida(['Ana', 'Bia', 'Caio'])

    expect(partida.fase).toBe('EM_JOGO')
    expect(partida.oferta).toBeNull()
    expect(jogadorDaVez(partida).nome).toBe('Ana')

    for (const jogador of partida.jogadores) {
      expect(jogador.missoes.length).toBeGreaterThanOrEqual(
        MISSOES_MINIMAS_NO_INICIO,
      )
    }

    expect(totalDeMissoes(partida)).toBe(TOTAL_DE_MISSOES_DE_TESTE)
  })

  it('recusa ficar com menos do mínimo', () => {
    const partida = partidaNaEscolhaInicial()
    const [primeira] = nomesDaOferta(partida)

    expect(escolherMissoes(partida, [primeira])).toEqual({
      valida: false,
      motivo: 'MISSOES_A_MENOS_DO_MINIMO',
    })
  })

  it('recusa missão que não foi oferecida', () => {
    const partida = partidaNaEscolhaInicial()

    expect(() => escolherMissoes(partida, ['Inventada', 'Outra'])).toThrow(
      RangeError,
    )
  })

  it('recusa escolher quando não há oferta pendente', () => {
    expect(escolherMissoes(novaPartida(), [])).toEqual({
      valida: false,
      motivo: 'NENHUMA_ESCOLHA_DE_MISSOES_PENDENTE',
    })
  })
})

describe('comprar missões no turno', () => {
  it('oferece 3 missões sem passar a vez e bloqueia as outras ações', () => {
    const depois = aceitar(comprarMissoes(novaPartida()))

    expect(depois.oferta?.missoes).toHaveLength(MISSOES_OFERECIDAS_NO_TURNO)
    expect(jogadorDaVez(depois).nome).toBe('Ana')
    expect(comprarCartaDoMonte(depois)).toEqual({
      valida: false,
      motivo: 'ESCOLHA_DE_MISSOES_PENDENTE',
    })
  })

  it('passa a vez depois da escolha e fica com ao menos uma missão', () => {
    const partida = novaPartida()
    const antes = partida.jogadores[0].missoes.length
    const oferecida = aceitar(comprarMissoes(partida))
    const [escolhida, ...recusadas] = nomesDaOferta(oferecida)
    const depois = aceitar(escolherMissoes(oferecida, [escolhida]))

    expect(jogadorDaVez(depois).nome).toBe('Bia')
    expect(depois.jogadores[0].missoes).toHaveLength(antes + 1)
    expect(depois.monteDeMissoes.slice(-2).map((m) => m.nome)).toEqual(
      recusadas,
    )
    expect(totalDeMissoes(depois)).toBe(TOTAL_DE_MISSOES_DE_TESTE)
  })

  it('recusa escolher nenhuma missão', () => {
    const oferecida = aceitar(comprarMissoes(novaPartida()))

    expect(escolherMissoes(oferecida, [])).toEqual({
      valida: false,
      motivo: 'MISSOES_A_MENOS_DO_MINIMO',
    })
  })

  it('recusa no meio de uma compra de cartas', () => {
    const emCompra = aceitar(comprarCartaDoMonte(novaPartida()))

    expect(comprarMissoes(emCompra)).toEqual({
      valida: false,
      motivo: 'COMPRA_EM_ANDAMENTO',
    })
  })

  it('recusa quando não restam missões no monte', () => {
    const semMissoes: Partida = { ...novaPartida(), monteDeMissoes: [] }

    expect(comprarMissoes(semMissoes)).toEqual({
      valida: false,
      motivo: 'SEM_MISSOES_PARA_COMPRAR',
    })
  })

  it('oferece só as que sobraram, com mínimo de uma', () => {
    const ultima = criarMissoesDeTeste(1)
    const partida: Partida = { ...novaPartida(), monteDeMissoes: ultima }
    const depois = aceitar(comprarMissoes(partida))

    expect(depois.oferta?.missoes).toHaveLength(1)
    expect(depois.oferta?.minimoParaManter).toBe(1)
  })

  it('recusa comprar missões depois do fim', () => {
    const fim: Partida = { ...novaPartida(), encerrada: true }

    expect(comprarMissoes(fim)).toEqual({
      valida: false,
      motivo: 'PARTIDA_ENCERRADA',
    })
  })
})

describe('ciclo de dia e noite com eventos', () => {
  const nomes = ['Ana', 'Bia']
  const eventosDoCiclo: Evento[] = [
    { codigo: 'evento-1', nome: 'Um', descricao: 'Um' },
    { codigo: 'evento-2', nome: 'Dois', descricao: 'Dois' },
    { codigo: 'evento-3', nome: 'Três', descricao: 'Três' },
  ]
  const partidaDoCiclo = novaPartida(
    nomes,
    criarConteudoDeTeste({ eventos: eventosDoCiclo }),
  )

  function jogarTurnos(partida: Partida, quantidade: number): Partida {
    let atual = partida

    for (let turno = 0; turno < quantidade; turno++) {
      atual = jogarTurnoDeCompra(atual)
    }

    return atual
  }

  it('começa de dia, já com o evento do primeiro amanhecer', () => {
    expect(partidaDoCiclo.turnosJogados).toBe(0)
    expect(periodoDoDia(partidaDoCiclo)).toBe('DIA')
    expect(eventosDoCiclo.map((e) => e.codigo)).toContain(
      eventoDaPartida(partidaDoCiclo).codigo,
    )
  })

  it('a noite começa depois de uma rodada e o evento continua o mesmo', () => {
    const noite = jogarTurnos(partidaDoCiclo, nomes.length)

    expect(periodoDoDia(noite)).toBe('NOITE')
    expect(eventoDaPartida(noite)).toEqual(eventoDaPartida(partidaDoCiclo))
  })

  it('amanhece depois de duas rodadas, com um evento novo', () => {
    const manha = jogarTurnos(partidaDoCiclo, nomes.length * 2)

    expect(periodoDoDia(manha)).toBe('DIA')
    expect(eventoDaPartida(manha)).not.toEqual(eventoDaPartida(partidaDoCiclo))
  })

  it('passa por todos os eventos antes de repetir algum', () => {
    const codigos = eventosDoCiclo.map(
      (_, dia) =>
        eventoDaPartida(jogarTurnos(partidaDoCiclo, dia * nomes.length * 2))
          .codigo,
    )
    const repetido = eventoDaPartida(
      jogarTurnos(partidaDoCiclo, eventosDoCiclo.length * nomes.length * 2),
    )

    expect(new Set(codigos).size).toBe(eventosDoCiclo.length)
    expect(repetido.codigo).toBe(codigos[0])
  })

  it('o tamanho do dia acompanha o número de jogadores', () => {
    const trio = novaPartida(
      ['Ana', 'Bia', 'Caio'],
      criarConteudoDeTeste({ eventos: eventosDoCiclo }),
    )

    expect(periodoDoDia(jogarTurnos(trio, 2))).toBe('DIA')
    expect(periodoDoDia(jogarTurnos(trio, 3))).toBe('NOITE')
    expect(periodoDoDia(jogarTurnos(trio, 6))).toBe('DIA')
  })

  it('conta as rodadas a partir da primeira, uma a cada volta da mesa', () => {
    const umaVolta = jogarTurnos(partidaDoCiclo, nomes.length)

    expect(rodadaDaPartida(partidaDoCiclo)).toBe(1)
    expect(rodadaDaPartida(jogarTurnos(partidaDoCiclo, 1))).toBe(1)
    expect(rodadaDaPartida(umaVolta)).toBe(2)
  })

  it('recusa criar partida sem eventos', () => {
    expect(() =>
      criarPartida(nomes, criarConteudoDeTeste({ eventos: [] })),
    ).toThrow(RangeError)
  })
})

describe('efeitos dos eventos na partida', () => {
  it('neblina: recusa comprar carta aberta e deixa comprar do monte', () => {
    const neblina = novaPartidaComEvento(CODIGOS_DOS_EVENTOS.neblina)

    expect(comprarCartaAberta(neblina, 0)).toEqual({
      valida: false,
      motivo: 'CARTAS_ABERTAS_VIRADAS',
    })
    expect(comprarCartaDoMonte(neblina).valida).toBe(true)
  })

  it('neblina: sem outra carta no monte, a vez passa mesmo com abertas na mesa', () => {
    const neblina = novaPartidaComEvento(CODIGOS_DOS_EVENTOS.neblina)
    const monteComUmaCarta: Partida = {
      ...neblina,
      baralho: { ...neblina.baralho, monte: ['AM'], descarte: [] },
    }
    const depois = aceitar(comprarCartaDoMonte(monteComUmaCarta))

    expect(jogadorDaVez(depois).nome).toBe('Bia')
  })

  it('feriado prolongado: o turno só acaba na terceira carta', () => {
    const feriado = novaPartidaComEvento(CODIGOS_DOS_EVENTOS.feriadoProlongado)
    const primeira = aceitar(comprarCartaDoMonte(feriado))
    const segunda = aceitar(comprarCartaDoMonte(primeira))
    const terceira = aceitar(comprarCartaDoMonte(segunda))

    expect(jogadorDaVez(segunda).nome).toBe('Ana')
    expect(jogadorDaVez(terceira).nome).toBe('Bia')
    expect(terceira.jogadores[0].mao).toHaveLength(
      CARTAS_INICIAIS_POR_JOGADOR + 3,
    )
  })

  it('feriado prolongado: o Estepe aberto ainda encerra o turno', () => {
    const feriado = comAbertas(
      novaPartidaComEvento(CODIGOS_DOS_EVENTOS.feriadoProlongado),
      [CARTA_CORINGA, 'AM', 'AM', 'CE', 'CE'],
    )
    const depois = aceitar(comprarCartaAberta(feriado, 0))

    expect(jogadorDaVez(depois).nome).toBe('Bia')
  })

  it('greve de caminhoneiros: recusa rota de 4 espaços pelo turno da vez', () => {
    const greve = comMaoDaVez(
      novaPartidaComEvento(CODIGOS_DOS_EVENTOS.greveDeCaminhoneiros),
      Array<Carta>(6).fill('AM'),
    )
    const rotaLonga: Rota = { ...rotaCurta, espacos: 4 }

    expect(reivindicarRotaDaVez(greve, { rota: rotaLonga })).toEqual({
      valida: false,
      motivo: 'GREVE_DE_CAMINHONEIROS',
    })
  })

  it('pedágio: a carta extra vai ao descarte junto com as da rota', () => {
    const pedagio = comMaoDaVez(
      novaPartidaComEvento(CODIGOS_DOS_EVENTOS.pedagio),
      ['AM', 'AM', 'CE'],
    )
    const depois = aceitar(
      reivindicarRotaDaVez(pedagio, { rota: rotaCurta, cartaDoPedagio: 'CE' }),
    )

    expect(depois.jogadores[0].mao).toEqual([])
    expect(depois.baralho.descarte).toEqual(['AM', 'AM', 'CE'])
  })

  it('céu limpo: soma os pontos extras da rota longa à pontuação do jogador', () => {
    const ceuLimpo = comMaoDaVez(
      novaPartidaComEvento(CODIGOS_DOS_EVENTOS.ceuLimpo),
      Array<Carta>(5).fill('AM'),
    )
    const rotaDeCinco: Rota = { ...rotaCurta, espacos: 5 }
    const depois = aceitar(
      reivindicarRotaDaVez(ceuLimpo, { rota: rotaDeCinco }),
    )

    expect(depois.jogadores[0].pontos).toBe(12)
  })
})

describe('curiosidades das cidades', () => {
  const rotaDeManaus: Rota = rotaCurta

  function reivindicarComMao(partida: Partida): ResultadoDaAcao {
    return reivindicarRotaDaVez(comMaoDaVez(partida, ['AM', 'AM']), {
      rota: rotaDeManaus,
    })
  }

  it('dá 1 ponto e a curiosidade a quem liga a cidade primeiro', () => {
    const resultado = reivindicarComMao(novaPartidaComCuriosidades())

    expect(resultado.valida && resultado.curiosidades).toEqual([
      curiosidadeDeManaus,
    ])
    expect(aceitar(resultado).jogadores[0].pontos).toBe(2 + 1)
    expect(aceitar(resultado).cidadesDescobertas).toEqual({
      Manaus: 'jogador-1',
    })
  })

  it('não dá a curiosidade de novo a quem liga a mesma cidade depois', () => {
    const primeira = aceitar(reivindicarComMao(novaPartidaComCuriosidades()))
    const outraRota: Rota = {
      ...rotaCurta,
      cidadeB: 'Porto Velho',
    }
    const segunda = reivindicarRotaDaVez(comMaoDaVez(primeira, ['AM', 'AM']), {
      rota: outraRota,
    })

    expect(segunda.valida && segunda.curiosidades).toEqual([])
    expect(aceitar(segunda).jogadores[1].pontos).toBe(2)
  })

  it('não dá pontos de curiosidade quando a cidade não tem curiosidade', () => {
    const resultado = reivindicarComMao(novaPartida())

    expect(resultado.valida && resultado.curiosidades).toEqual([])
    expect(aceitar(resultado).jogadores[0].pontos).toBe(2)
  })

  it('recusa curiosidades repetidas para a mesma cidade', () => {
    expect(() =>
      criarPartida(
        ['Ana', 'Bia'],
        criarConteudoDeTeste({
          curiosidades: [curiosidadeDeManaus, curiosidadeDeManaus],
        }),
      ),
    ).toThrow(RangeError)
  })
})
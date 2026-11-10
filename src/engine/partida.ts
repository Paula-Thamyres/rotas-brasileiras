import type { Carta, CorDaCarta } from '../types/cartas'
import type { Curiosidade } from '../types/curiosidades'
import type { Evento } from '../types/eventos'
import type { Jogador } from '../types/jogador'
import type { Rota } from '../types/mapa'
import type { Missao } from '../types/missoes'
import {
  comprarAberta,
  comprarDoMonte,
  criarBaralho,
  descartar,
  embaralhar,
  type Aleatorio,
  type Baralho,
} from './baralho'
import {
  CAMINHOES_PARA_ULTIMA_RODADA,
  CAMINHOES_POR_JOGADOR,
  CARTA_CORINGA,
  CARTAS_INICIAIS_POR_JOGADOR,
  MAXIMO_DE_JOGADORES,
  MINIMO_DE_JOGADORES,
  MISSOES_MINIMAS_NO_INICIO,
  MISSOES_MINIMAS_NO_TURNO,
  MISSOES_OFERECIDAS_NO_INICIO,
  MISSOES_OFERECIDAS_NO_TURNO,
  RODADAS_POR_PERIODO_DO_DIA,
} from './constantes'
import {
  curiosidadesNovas,
  pontosDasCuriosidades,
  registrarDescobertas,
  validarCuriosidades,
  type CidadesDescobertas,
} from './curiosidades'
import { cartasAbertasViradas, cartasPorCompra } from './eventos'
import { criarJogador } from './jogador'
import {
  aplicarEscolha,
  sacarOferta,
  type OfertaDeMissoes,
} from './ofertaDeMissoes'
import {
  reivindicarRota,
  type DonosDasRotas,
  type MotivoDaRecusa,
} from './rotas'

export type FaseDaPartida = 'ESCOLHA_INICIAL_DE_MISSOES' | 'EM_JOGO'

export type PeriodoDoDia = 'DIA' | 'NOITE'

export interface ConteudoDaPartida {
  readonly missoes: readonly Missao[]
  readonly eventos: readonly Evento[]
  readonly curiosidades: readonly Curiosidade[]
}

export interface Partida {
  readonly jogadores: readonly Jogador[]
  readonly baralho: Baralho
  readonly donosDasRotas: DonosDasRotas
  readonly indiceDaVez: number
  readonly cartasCompradasNoTurno: number
  readonly turnosRestantes: number | null
  readonly encerrada: boolean
  readonly fase: FaseDaPartida
  readonly monteDeMissoes: readonly Missao[]
  readonly oferta: OfertaDeMissoes | null
  readonly ordemDosEventos: readonly Evento[]
  readonly turnosJogados: number
  readonly curiosidades: readonly Curiosidade[]
  readonly cidadesDescobertas: CidadesDescobertas
}

export type MotivoDaRecusaDaAcao =
  | MotivoDaRecusa
  | 'PARTIDA_ENCERRADA'
  | 'COMPRA_EM_ANDAMENTO'
  | 'SEM_CARTAS_PARA_COMPRAR'
  | 'CORINGA_ABERTO_NA_SEGUNDA_COMPRA'
  | 'ESCOLHA_DE_MISSOES_PENDENTE'
  | 'NENHUMA_ESCOLHA_DE_MISSOES_PENDENTE'
  | 'SEM_MISSOES_PARA_COMPRAR'
  | 'MISSOES_A_MENOS_DO_MINIMO'
  | 'CARTAS_ABERTAS_VIRADAS'

export type ResultadoDaAcao =
  | {
      readonly valida: true
      readonly partida: Partida
      readonly curiosidades?: readonly Curiosidade[]
    }
  | { readonly valida: false; readonly motivo: MotivoDaRecusaDaAcao }

export interface PedidoDeRota {
  readonly rota: Rota
  readonly cor?: CorDaCarta
  readonly coringasUsados?: number
  readonly cartaDoPedagio?: Carta
}

function validarNomes(nomes: readonly string[]): void {
  if (
    nomes.length < MINIMO_DE_JOGADORES ||
    nomes.length > MAXIMO_DE_JOGADORES
  ) {
    throw new RangeError(
      `Quantidade de jogadores inválida: ${nomes.length}. Valores aceitos: ${MINIMO_DE_JOGADORES} a ${MAXIMO_DE_JOGADORES}.`,
    )
  }

  const normalizados = nomes.map((nome) => nome.trim().toLowerCase())

  if (new Set(normalizados).size !== nomes.length) {
    throw new RangeError('Os jogadores precisam ter nomes diferentes.')
  }
}

function validarCaminhoes(caminhoesPorJogador: number): void {
  if (
    !Number.isInteger(caminhoesPorJogador) ||
    caminhoesPorJogador <= CAMINHOES_PARA_ULTIMA_RODADA
  ) {
    throw new RangeError(
      `Caminhões por jogador inválidos: ${caminhoesPorJogador}. É preciso ter mais de ${CAMINHOES_PARA_ULTIMA_RODADA}.`,
    )
  }
}

function validarEventos(eventos: readonly Evento[]): void {
  if (eventos.length === 0) {
    throw new RangeError('É preciso ao menos um evento para a partida.')
  }
}

function validarMissoes(missoes: readonly Missao[], totalDeJogadores: number) {
  const necessarias = totalDeJogadores * MISSOES_OFERECIDAS_NO_INICIO

  if (missoes.length < necessarias) {
    throw new RangeError(
      `Missões insuficientes: ${missoes.length}. São necessárias ao menos ${necessarias} para ${totalDeJogadores} jogadores.`,
    )
  }

  if (new Set(missoes.map((missao) => missao.nome)).size !== missoes.length) {
    throw new RangeError('As missões precisam ter nomes diferentes.')
  }
}

function distribuirCartasIniciais(
  baralho: Baralho,
  jogadores: readonly Jogador[],
  aleatorio: Aleatorio,
): { baralho: Baralho; jogadores: Jogador[] } {
  let atual = baralho
  const comMao = jogadores.map((jogador) => {
    const mao = [...jogador.mao]

    for (let n = 0; n < CARTAS_INICIAIS_POR_JOGADOR; n++) {
      const { baralho: depois, carta } = comprarDoMonte(atual, aleatorio)
      atual = depois
      if (carta !== null) mao.push(carta)
    }

    return { ...jogador, mao }
  })

  return { baralho: atual, jogadores: comMao }
}

export function criarPartida(
  nomes: readonly string[],
  conteudo: ConteudoDaPartida,
  aleatorio: Aleatorio = Math.random,
  caminhoesPorJogador: number = CAMINHOES_POR_JOGADOR,
): Partida {
  validarNomes(nomes)
  validarCaminhoes(caminhoesPorJogador)
  validarMissoes(conteudo.missoes, nomes.length)
  validarEventos(conteudo.eventos)
  validarCuriosidades(conteudo.curiosidades)

  const jogadores = nomes.map((nome, indice) =>
    criarJogador(`jogador-${indice + 1}`, nome, caminhoesPorJogador),
  )
  const distribuicao = distribuirCartasIniciais(
    criarBaralho(aleatorio),
    jogadores,
    aleatorio,
  )

  return proporOferta(
    {
      ...distribuicao,
      donosDasRotas: {},
      indiceDaVez: 0,
      cartasCompradasNoTurno: 0,
      turnosRestantes: null,
      encerrada: false,
      fase: 'ESCOLHA_INICIAL_DE_MISSOES',
      monteDeMissoes: embaralhar(conteudo.missoes, aleatorio),
      oferta: null,
      ordemDosEventos: embaralhar(conteudo.eventos, aleatorio),
      turnosJogados: 0,
      curiosidades: conteudo.curiosidades,
      cidadesDescobertas: {},
    },
    MISSOES_OFERECIDAS_NO_INICIO,
    MISSOES_MINIMAS_NO_INICIO,
  )
}

function proporOferta(
  partida: Partida,
  quantidade: number,
  minimoParaManter: number,
): Partida {
  const { oferta, resto } = sacarOferta(
    partida.monteDeMissoes,
    quantidade,
    minimoParaManter,
  )

  return { ...partida, monteDeMissoes: resto, oferta }
}

export function jogadorDaVez(partida: Partida): Jogador {
  return partida.jogadores[partida.indiceDaVez]
}

function turnosPorPeriodo(partida: Partida): number {
  return partida.jogadores.length * RODADAS_POR_PERIODO_DO_DIA
}

export function eventoDaPartida(partida: Partida): Evento {
  const turnosPorDia = turnosPorPeriodo(partida) * 2
  const amanheceres = Math.floor(partida.turnosJogados / turnosPorDia)

  return partida.ordemDosEventos[amanheceres % partida.ordemDosEventos.length]
}

export function rodadaDaPartida(partida: Partida): number {
  return Math.floor(partida.turnosJogados / partida.jogadores.length) + 1
}

export function periodoDoDia(partida: Partida): PeriodoDoDia {
  const turnosPorDia = turnosPorPeriodo(partida) * 2
  const noPeriodoDoDia = partida.turnosJogados % turnosPorDia

  return noPeriodoDoDia < turnosPorPeriodo(partida) ? 'DIA' : 'NOITE'
}

function recusar(motivo: MotivoDaRecusaDaAcao): ResultadoDaAcao {
  return { valida: false, motivo }
}

function motivoDeBloqueio(partida: Partida): MotivoDaRecusaDaAcao | null {
  if (partida.encerrada) return 'PARTIDA_ENCERRADA'
  if (partida.oferta !== null) return 'ESCOLHA_DE_MISSOES_PENDENTE'

  return null
}

function trocarJogadorDaVez(partida: Partida, jogador: Jogador): Jogador[] {
  return partida.jogadores.map((atual, indice) =>
    indice === partida.indiceDaVez ? jogador : atual,
  )
}

function proximosTurnosRestantes(partida: Partida): number | null {
  if (partida.turnosRestantes !== null) return partida.turnosRestantes - 1

  const iniciaUltimaRodada =
    jogadorDaVez(partida).caminhoes <= CAMINHOES_PARA_ULTIMA_RODADA

  return iniciaUltimaRodada ? partida.jogadores.length : null
}

function encerrarTurno(partida: Partida): Partida {
  const turnosRestantes = proximosTurnosRestantes(partida)

  return {
    ...partida,
    indiceDaVez: (partida.indiceDaVez + 1) % partida.jogadores.length,
    cartasCompradasNoTurno: 0,
    turnosJogados: partida.turnosJogados + 1,
    turnosRestantes,
    encerrada: turnosRestantes === 0,
  }
}

function aindaHaCartasParaComprar(
  baralho: Baralho,
  abertasViradas: boolean,
): boolean {
  const haAbertasParaComprar =
    !abertasViradas && baralho.abertas.some((carta) => carta !== CARTA_CORINGA)

  return (
    baralho.monte.length > 0 ||
    baralho.descarte.length > 0 ||
    haAbertasParaComprar
  )
}

function registrarCompra(
  partida: Partida,
  baralho: Baralho,
  carta: Carta,
  encerraOTurno: boolean,
): Partida {
  const jogador = jogadorDaVez(partida)
  const comCarta: Partida = {
    ...partida,
    baralho,
    jogadores: trocarJogadorDaVez(partida, {
      ...jogador,
      mao: [...jogador.mao, carta],
    }),
    cartasCompradasNoTurno: partida.cartasCompradasNoTurno + 1,
  }
  const evento = eventoDaPartida(partida)
  const completouACompra =
    comCarta.cartasCompradasNoTurno >= cartasPorCompra(evento)
  const semCartasParaComprar = !aindaHaCartasParaComprar(
    baralho,
    cartasAbertasViradas(evento),
  )

  return encerraOTurno || completouACompra || semCartasParaComprar
    ? encerrarTurno(comCarta)
    : comCarta
}

export function comprarCartaDoMonte(
  partida: Partida,
  aleatorio: Aleatorio = Math.random,
): ResultadoDaAcao {
  const bloqueio = motivoDeBloqueio(partida)
  if (bloqueio !== null) return recusar(bloqueio)

  const { baralho, carta } = comprarDoMonte(partida.baralho, aleatorio)

  if (carta === null) return recusar('SEM_CARTAS_PARA_COMPRAR')

  return {
    valida: true,
    partida: registrarCompra(partida, baralho, carta, false),
  }
}

export function comprarCartaAberta(
  partida: Partida,
  indice: number,
  aleatorio: Aleatorio = Math.random,
): ResultadoDaAcao {
  const bloqueio = motivoDeBloqueio(partida)
  if (bloqueio !== null) return recusar(bloqueio)
  if (cartasAbertasViradas(eventoDaPartida(partida))) {
    return recusar('CARTAS_ABERTAS_VIRADAS')
  }

  const ehCoringa = partida.baralho.abertas[indice] === CARTA_CORINGA

  if (ehCoringa && partida.cartasCompradasNoTurno > 0) {
    return recusar('CORINGA_ABERTO_NA_SEGUNDA_COMPRA')
  }

  const { baralho, carta } = comprarAberta(partida.baralho, indice, aleatorio)

  return {
    valida: true,
    partida: registrarCompra(partida, baralho, carta, ehCoringa),
  }
}

export function reivindicarRotaDaVez(
  partida: Partida,
  pedido: PedidoDeRota,
): ResultadoDaAcao {
  const bloqueio = motivoDeBloqueio(partida)
  if (bloqueio !== null) return recusar(bloqueio)
  if (partida.cartasCompradasNoTurno > 0) return recusar('COMPRA_EM_ANDAMENTO')

  const resultado = reivindicarRota({
    ...pedido,
    jogador: jogadorDaVez(partida),
    donosDasRotas: partida.donosDasRotas,
    totalDeJogadores: partida.jogadores.length,
    evento: eventoDaPartida(partida),
  })

  if (!resultado.valida) return recusar(resultado.motivo)

  const descobertas = curiosidadesNovas(
    partida.curiosidades,
    partida.cidadesDescobertas,
    [pedido.rota.cidadeA, pedido.rota.cidadeB],
  )
  const jogador: Jogador = {
    ...resultado.jogador,
    pontos: resultado.jogador.pontos + pontosDasCuriosidades(descobertas),
  }

  return {
    valida: true,
    curiosidades: descobertas,
    partida: encerrarTurno({
      ...partida,
      jogadores: trocarJogadorDaVez(partida, jogador),
      baralho: descartar(partida.baralho, resultado.cartasPagas),
      donosDasRotas: resultado.donosDasRotas,
      cidadesDescobertas: registrarDescobertas(
        partida.cidadesDescobertas,
        descobertas,
        jogador.id,
      ),
    }),
  }
}

export function comprarMissoes(partida: Partida): ResultadoDaAcao {
  const bloqueio = motivoDeBloqueio(partida)
  if (bloqueio !== null) return recusar(bloqueio)
  if (partida.cartasCompradasNoTurno > 0) return recusar('COMPRA_EM_ANDAMENTO')
  if (partida.monteDeMissoes.length === 0) {
    return recusar('SEM_MISSOES_PARA_COMPRAR')
  }

  return {
    valida: true,
    partida: proporOferta(
      partida,
      MISSOES_OFERECIDAS_NO_TURNO,
      MISSOES_MINIMAS_NO_TURNO,
    ),
  }
}

function passarEscolhaInicialAoProximo(partida: Partida): Partida {
  const eraOUltimo = partida.indiceDaVez === partida.jogadores.length - 1

  if (eraOUltimo) return { ...partida, fase: 'EM_JOGO', indiceDaVez: 0 }

  return proporOferta(
    { ...partida, indiceDaVez: partida.indiceDaVez + 1 },
    MISSOES_OFERECIDAS_NO_INICIO,
    MISSOES_MINIMAS_NO_INICIO,
  )
}

export function escolherMissoes(
  partida: Partida,
  nomesMantidos: readonly string[],
): ResultadoDaAcao {
  if (partida.encerrada) return recusar('PARTIDA_ENCERRADA')
  if (partida.oferta === null) {
    return recusar('NENHUMA_ESCOLHA_DE_MISSOES_PENDENTE')
  }

  const escolha = aplicarEscolha(partida.oferta, nomesMantidos)

  if (!escolha.valida) return recusar('MISSOES_A_MENOS_DO_MINIMO')

  const jogador = jogadorDaVez(partida)
  const comEscolha: Partida = {
    ...partida,
    jogadores: trocarJogadorDaVez(partida, {
      ...jogador,
      missoes: [...jogador.missoes, ...escolha.mantidas],
    }),
    monteDeMissoes: [...partida.monteDeMissoes, ...escolha.devolvidas],
    oferta: null,
  }

  return {
    valida: true,
    partida:
      partida.fase === 'ESCOLHA_INICIAL_DE_MISSOES'
        ? passarEscolhaInicialAoProximo(comEscolha)
        : encerrarTurno(comEscolha),
  }
}
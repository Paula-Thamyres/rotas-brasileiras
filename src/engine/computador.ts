import type { Carta, CorDaCarta } from '../types/cartas'
import type { Jogador } from '../types/jogador'
import type { Rota } from '../types/mapa'
import {
  CAMINHOES_MINIMOS_PARA_BUSCAR_MISSOES,
  CARTA_CORINGA,
  CODIGO_DA_COR_CINZA,
  CORES_DAS_CARTAS,
  MAXIMO_DE_COMPRAS_POR_TURNO_DO_COMPUTADOR,
} from './constantes'
import { cartasAbertasViradas } from './eventos'
import { missaoCumprida } from './missoes'
import {
  comprarCartaAberta,
  comprarCartaDoMonte,
  comprarMissoes,
  escolherMissoes,
  eventoDaPartida,
  jogadorDaVez,
  reivindicarRotaDaVez,
  type Partida,
} from './partida'
import { criarPlanejador, type LigacoesDaMissao } from './planejamento'
import { planosDeReivindicacao, type PlanoDeReivindicacao } from './planos'
import { pontosDaRota } from './pontuacao'
import { idDaRota } from './rotas'
import type { Missao } from '../types/missoes'
import type { Aleatorio } from './baralho'

const DESCRICAO_DO_CORINGA_ABERTO = 'pegou um Estepe aberto'

export interface JogadaDoComputador {
  readonly partida: Partida
  readonly descricao: string
}

interface MissaoPendente {
  readonly missao: Missao
  readonly ligacoes: LigacoesDaMissao
}

interface RotaDesejada {
  readonly rota: Rota
  readonly prioridade: number
}

function contar(cartas: readonly Carta[], alvo: Carta): number {
  return cartas.filter((carta) => carta === alvo).length
}

function rotasDoJogador(
  jogador: Jogador,
  rotasDoMapa: readonly Rota[],
): Rota[] {
  return rotasDoMapa.filter((rota) => jogador.rotas.includes(idDaRota(rota)))
}

function aproveitamento({ missao, ligacoes }: MissaoPendente): number {
  if (!Number.isFinite(ligacoes.custoEmEspacos)) return 0
  if (ligacoes.custoEmEspacos === 0) return Number.POSITIVE_INFINITY

  return missao.pontos / ligacoes.custoEmEspacos
}

function porAproveitamento(a: MissaoPendente, b: MissaoPendente): number {
  const diferenca = aproveitamento(b) - aproveitamento(a)

  if (diferenca !== 0 && !Number.isNaN(diferenca)) return diferenca

  return b.missao.pontos - a.missao.pontos
}

function avaliarMissoes(
  partida: Partida,
  jogador: Jogador,
  missoes: readonly Missao[],
  rotasDoMapa: readonly Rota[],
): MissaoPendente[] {
  const planejador = criarPlanejador(partida, jogador, rotasDoMapa)

  return missoes.map((missao) => ({
    missao,
    ligacoes: planejador.ligacoesDaMissao(missao),
  }))
}

function escolherAsMissoes(
  partida: Partida,
  rotasDoMapa: readonly Rota[],
): JogadaDoComputador | null {
  const { oferta } = partida

  if (oferta === null) return null

  const melhores = avaliarMissoes(
    partida,
    jogadorDaVez(partida),
    oferta.missoes,
    rotasDoMapa,
  )
    .sort(porAproveitamento)
    .slice(0, oferta.minimoParaManter)
  const resultado = escolherMissoes(
    partida,
    melhores.map(({ missao }) => missao.nome),
  )

  if (!resultado.valida) return null

  const quantidade = melhores.length

  return {
    partida: resultado.partida,
    descricao: `ficou com ${quantidade} ${quantidade === 1 ? 'missão' : 'missões'}`,
  }
}

function rotasDesejadas(pendentes: readonly MissaoPendente[]): RotaDesejada[] {
  const prioridades = new Map<string, RotaDesejada>()

  for (const pendente of pendentes) {
    const { rotasFaltantes, custoEmEspacos } = pendente.ligacoes

    if (!Number.isFinite(custoEmEspacos)) continue

    for (const rota of rotasFaltantes) {
      const id = idDaRota(rota)
      const anterior = prioridades.get(id)?.prioridade ?? 0

      prioridades.set(id, {
        rota,
        prioridade: anterior + pendente.missao.pontos / custoEmEspacos,
      })
    }
  }

  return [...prioridades.values()].sort(
    (a, b) => b.prioridade - a.prioridade || b.rota.espacos - a.rota.espacos,
  )
}

function ordemDoPlano(mao: readonly Carta[]) {
  const valorDaCartaDoPedagio = (carta: Carta | null): number => {
    if (carta === null) return 0
    if (carta === CARTA_CORINGA) return 1_000

    return -contar(mao, carta)
  }

  return (a: PlanoDeReivindicacao, b: PlanoDeReivindicacao): number =>
    a.coringasUsados - b.coringasUsados ||
    valorDaCartaDoPedagio(a.cartaDoPedagio) -
      valorDaCartaDoPedagio(b.cartaDoPedagio)
}

function reivindicar(
  partida: Partida,
  rota: Rota,
  planos: readonly PlanoDeReivindicacao[],
): JogadaDoComputador | null {
  const [plano] = [...planos].sort(ordemDoPlano(jogadorDaVez(partida).mao))
  const resultado = reivindicarRotaDaVez(partida, {
    rota,
    cor: plano.cor,
    coringasUsados: plano.coringasUsados,
    cartaDoPedagio: plano.cartaDoPedagio ?? undefined,
  })

  if (!resultado.valida) return null

  const descobertas = resultado.curiosidades ?? []
  const curiosidade =
    descobertas.length > 0
      ? ` e descobriu a curiosidade de ${descobertas.map((c) => c.cidade).join(' e ')}`
      : ''

  return {
    partida: resultado.partida,
    descricao: `reivindicou ${rota.cidadeA} a ${rota.cidadeB}${curiosidade}`,
  }
}

function melhorRotaParaReivindicar(
  partida: Partida,
  desejadas: readonly RotaDesejada[],
  rotasDoMapa: readonly Rota[],
  semMissoesPendentes: boolean,
): { rota: Rota; planos: PlanoDeReivindicacao[] } | null {
  const candidatas = semMissoesPendentes
    ? [...rotasDoMapa]
        .sort((a, b) => pontosDaRota(b.espacos) - pontosDaRota(a.espacos))
        .map((rota) => ({ rota }))
    : desejadas

  for (const { rota } of candidatas) {
    const planos = planosDeReivindicacao(partida, rota)

    if (planos.length > 0) return { rota, planos }
  }

  return null
}

function corDesejada(
  alvo: Rota | undefined,
  mao: readonly Carta[],
): CorDaCarta | null {
  if (alvo === undefined) return null
  if (alvo.cor !== CODIGO_DA_COR_CINZA) return alvo.cor

  return (
    [...CORES_DAS_CARTAS].sort((a, b) => contar(mao, b) - contar(mao, a))[0] ??
    null
  )
}

function indiceDaCartaAberta(
  partida: Partida,
  cor: CorDaCarta | null,
): number | null {
  const { abertas } = partida.baralho
  const primeiraCompra = partida.cartasCompradasNoTurno === 0
  const daCor = cor === null ? -1 : abertas.indexOf(cor)
  const coringa = primeiraCompra ? abertas.indexOf(CARTA_CORINGA) : -1

  if (daCor !== -1) return daCor

  return coringa === -1 ? null : coringa
}

function qualquerCartaAberta(partida: Partida): number | null {
  const { abertas } = partida.baralho
  const primeiraCompra = partida.cartasCompradasNoTurno === 0
  const indice = abertas.findIndex(
    (carta) => primeiraCompra || carta !== CARTA_CORINGA,
  )

  return indice === -1 ? null : indice
}

function comprarCartas(
  inicial: Partida,
  alvo: Rota | undefined,
  aleatorio: Aleatorio,
): JogadaDoComputador | null {
  const vezInicial = inicial.turnosJogados
  const viradas = cartasAbertasViradas(eventoDaPartida(inicial))
  let atual = inicial
  let compradas = 0
  let pegouCoringaAberto = false

  while (
    atual.turnosJogados === vezInicial &&
    compradas < MAXIMO_DE_COMPRAS_POR_TURNO_DO_COMPUTADOR
  ) {
    const cor = corDesejada(alvo, jogadorDaVez(atual).mao)
    const indice = viradas ? null : indiceDaCartaAberta(atual, cor)
    const resultado =
      indice === null
        ? comprarCartaDoMonte(atual, aleatorio)
        : comprarCartaAberta(atual, indice, aleatorio)
    const ultimoRecurso = viradas ? null : qualquerCartaAberta(atual)
    const comprada =
      resultado.valida || ultimoRecurso === null
        ? resultado
        : comprarCartaAberta(atual, ultimoRecurso, aleatorio)
    const indiceComprado = resultado.valida ? indice : ultimoRecurso
    const cartaAberta =
      indiceComprado === null ? null : atual.baralho.abertas[indiceComprado]

    if (!comprada.valida) break

    pegouCoringaAberto = cartaAberta === CARTA_CORINGA
    atual = comprada.partida
    compradas++
  }

  if (compradas === 0) return null

  return {
    partida: atual,
    descricao: pegouCoringaAberto
      ? DESCRICAO_DO_CORINGA_ABERTO
      : `comprou ${compradas} ${compradas === 1 ? 'carta' : 'cartas'}`,
  }
}

function comprarEEscolherMissoes(
  partida: Partida,
  rotasDoMapa: readonly Rota[],
): JogadaDoComputador | null {
  const oferecida = comprarMissoes(partida)

  if (!oferecida.valida) return null

  const escolha = escolherAsMissoes(oferecida.partida, rotasDoMapa)

  return escolha === null
    ? null
    : {
        partida: escolha.partida,
        descricao: `comprou missões e ${escolha.descricao}`,
      }
}

function jogarTurno(
  partida: Partida,
  rotasDoMapa: readonly Rota[],
  aleatorio: Aleatorio,
): JogadaDoComputador | null {
  const jogador = jogadorDaVez(partida)
  const proprias = rotasDoJogador(jogador, rotasDoMapa)
  const pendentes = avaliarMissoes(
    partida,
    jogador,
    jogador.missoes,
    rotasDoMapa,
  ).filter(({ missao }) => !missaoCumprida(missao, proprias))
  const desejadas = rotasDesejadas(pendentes)
  const querMaisMissoes =
    pendentes.length === 0 &&
    partida.monteDeMissoes.length > 0 &&
    jogador.caminhoes >= CAMINHOES_MINIMOS_PARA_BUSCAR_MISSOES

  if (querMaisMissoes) {
    const comMissoes = comprarEEscolherMissoes(partida, rotasDoMapa)

    if (comMissoes !== null) return comMissoes
  }

  const escolhida = melhorRotaParaReivindicar(
    partida,
    desejadas,
    rotasDoMapa,
    pendentes.length === 0,
  )
  const reivindicada =
    escolhida === null
      ? null
      : reivindicar(partida, escolhida.rota, escolhida.planos)

  return (
    reivindicada ??
    comprarCartas(partida, desejadas[0]?.rota, aleatorio) ??
    comprarEEscolherMissoes(partida, rotasDoMapa)
  )
}

export function jogarVezDoComputador(
  partida: Partida,
  rotasDoMapa: readonly Rota[],
  aleatorio: Aleatorio = Math.random,
): JogadaDoComputador | null {
  if (partida.encerrada) return null
  if (partida.oferta !== null) {
    return escolherAsMissoes(partida, rotasDoMapa)
  }

  return jogarTurno(partida, rotasDoMapa, aleatorio)
}

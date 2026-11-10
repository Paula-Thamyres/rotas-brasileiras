import type { Carta, CorDaCarta } from '../types/cartas'
import type { Jogador } from '../types/jogador'
import type { Evento } from '../types/eventos'
import type { Rota } from '../types/mapa'
import {
  CARTA_CORINGA,
  CODIGO_DA_COR_CINZA,
  JOGADORES_PARA_USAR_AS_DUAS_ROTAS_DUPLAS,
  MAXIMO_DE_JOGADORES,
  MINIMO_DE_JOGADORES,
} from './constantes'
import {
  cartasDoPedagio,
  cartasParaPagarARota,
  pontosExtrasDaRota,
  rotaBloqueadaPeloEvento,
  valorDoCoringa,
} from './eventos'
import { pontosDaRota } from './pontuacao'

export type DonosDasRotas = Readonly<Record<string, string>>

export type MotivoDaRecusa =
  | 'ROTA_JA_REIVINDICADA'
  | 'PARALELA_DO_MESMO_JOGADOR'
  | 'PARALELA_BLOQUEADA_PARA_ESTA_MESA'
  | 'CAMINHOES_INSUFICIENTES'
  | 'COR_OBRIGATORIA'
  | 'COR_INCORRETA'
  | 'QUANTIDADE_DE_CORINGAS_INVALIDA'
  | 'CARTAS_INSUFICIENTES'
  | 'GREVE_DE_CAMINHONEIROS'
  | 'CARTA_DO_PEDAGIO_OBRIGATORIA'
  | 'CARTA_DO_PEDAGIO_INDISPONIVEL'

export interface PedidoDeReivindicacao {
  readonly rota: Rota
  readonly jogador: Jogador
  readonly donosDasRotas: DonosDasRotas
  readonly totalDeJogadores: number
  readonly cor?: CorDaCarta
  readonly coringasUsados?: number
  readonly evento?: Evento | null
  readonly cartaDoPedagio?: Carta
}

export type ResultadoDaReivindicacao =
  | {
      readonly valida: true
      readonly jogador: Jogador
      readonly donosDasRotas: DonosDasRotas
      readonly cartasPagas: readonly Carta[]
    }
  | { readonly valida: false; readonly motivo: MotivoDaRecusa }

type Pagamento =
  | { readonly valido: true; readonly cartas: readonly Carta[] }
  | { readonly valido: false; readonly motivo: MotivoDaRecusa }

export function idDaRota(rota: Rota): string {
  return `${rota.cidadeA}-${rota.cidadeB}-${rota.paralela ?? 'unica'}`
}

function idDaRotaParalela(rota: Rota): string | null {
  if (rota.paralela === null) return null

  return idDaRota({ ...rota, paralela: rota.paralela === 0 ? 1 : 0 })
}

function recusar(motivo: MotivoDaRecusa): ResultadoDaReivindicacao {
  return { valida: false, motivo }
}

function contar(cartas: readonly Carta[], alvo: Carta): number {
  return cartas.filter((carta) => carta === alvo).length
}

function removerCartas(
  mao: readonly Carta[],
  pagas: readonly Carta[],
): Carta[] {
  const restante = [...mao]

  for (const carta of pagas) {
    restante.splice(restante.indexOf(carta), 1)
  }

  return restante
}

function validarTotalDeJogadores(totalDeJogadores: number): void {
  const valido =
    Number.isInteger(totalDeJogadores) &&
    totalDeJogadores >= MINIMO_DE_JOGADORES &&
    totalDeJogadores <= MAXIMO_DE_JOGADORES

  if (!valido) {
    throw new RangeError(
      `Quantidade de jogadores inválida: ${totalDeJogadores}. Valores aceitos: ${MINIMO_DE_JOGADORES} a ${MAXIMO_DE_JOGADORES}.`,
    )
  }
}

export function motivoDeRecusaPelaMesa(
  pedido: PedidoDeReivindicacao,
): MotivoDaRecusa | null {
  const { rota, jogador, donosDasRotas, totalDeJogadores } = pedido

  if (idDaRota(rota) in donosDasRotas) return 'ROTA_JA_REIVINDICADA'

  const idParalela = idDaRotaParalela(rota)
  const donoDaParalela =
    idParalela === null ? undefined : donosDasRotas[idParalela]

  if (donoDaParalela === undefined) return null
  if (donoDaParalela === jogador.id) return 'PARALELA_DO_MESMO_JOGADOR'

  if (totalDeJogadores < JOGADORES_PARA_USAR_AS_DUAS_ROTAS_DUPLAS) {
    return 'PARALELA_BLOQUEADA_PARA_ESTA_MESA'
  }

  return null
}

type CorEscolhida =
  | { readonly valida: true; readonly cor: CorDaCarta }
  | { readonly valida: false; readonly motivo: MotivoDaRecusa }

function escolherCor(
  rota: Rota,
  corPedida: CorDaCarta | undefined,
): CorEscolhida {
  if (rota.cor === CODIGO_DA_COR_CINZA) {
    return corPedida === undefined
      ? { valida: false, motivo: 'COR_OBRIGATORIA' }
      : { valida: true, cor: corPedida }
  }

  if (corPedida !== undefined && corPedida !== rota.cor) {
    return { valida: false, motivo: 'COR_INCORRETA' }
  }

  return { valida: true, cor: rota.cor }
}

function cartasDaRota(pedido: PedidoDeReivindicacao): Pagamento {
  const { rota, jogador, cor: corPedida, coringasUsados } = pedido
  const evento = pedido.evento ?? null
  const escolha = escolherCor(rota, corPedida)

  if (!escolha.valida) return { valido: false, motivo: escolha.motivo }

  const { cor } = escolha
  const custo = cartasParaPagarARota(evento, rota.espacos)
  const valor = valorDoCoringa(evento)
  const cartasDaCor = contar(jogador.mao, cor)
  const coringasNaMao = contar(jogador.mao, CARTA_CORINGA)
  const maximoDeCoringas = Math.ceil(custo / valor)
  const coringas =
    coringasUsados ?? Math.max(0, Math.ceil((custo - cartasDaCor) / valor))

  if (
    !Number.isInteger(coringas) ||
    coringas < 0 ||
    coringas > maximoDeCoringas
  ) {
    return { valido: false, motivo: 'QUANTIDADE_DE_CORINGAS_INVALIDA' }
  }

  const cartasDeCorUsadas = Math.max(0, custo - coringas * valor)

  if (cartasDeCorUsadas > cartasDaCor || coringas > coringasNaMao) {
    return { valido: false, motivo: 'CARTAS_INSUFICIENTES' }
  }

  return {
    valido: true,
    cartas: [
      ...Array<Carta>(cartasDeCorUsadas).fill(cor),
      ...Array<Carta>(coringas).fill(CARTA_CORINGA),
    ],
  }
}

function adicionarPedagio(
  pedido: PedidoDeReivindicacao,
  pagamento: Pagamento,
): Pagamento {
  if (!pagamento.valido || cartasDoPedagio(pedido.evento ?? null) === 0) {
    return pagamento
  }

  const { cartaDoPedagio, jogador } = pedido

  if (cartaDoPedagio === undefined) {
    return { valido: false, motivo: 'CARTA_DO_PEDAGIO_OBRIGATORIA' }
  }

  const sobra = removerCartas(jogador.mao, pagamento.cartas)

  if (!sobra.includes(cartaDoPedagio)) {
    return { valido: false, motivo: 'CARTA_DO_PEDAGIO_INDISPONIVEL' }
  }

  return { valido: true, cartas: [...pagamento.cartas, cartaDoPedagio] }
}

function montarPagamento(pedido: PedidoDeReivindicacao): Pagamento {
  return adicionarPedagio(pedido, cartasDaRota(pedido))
}

export function reivindicarRota(
  pedido: PedidoDeReivindicacao,
): ResultadoDaReivindicacao {
  const { rota, jogador, donosDasRotas, totalDeJogadores } = pedido

  validarTotalDeJogadores(totalDeJogadores)

  const motivoDaMesa = motivoDeRecusaPelaMesa(pedido)
  if (motivoDaMesa !== null) return recusar(motivoDaMesa)

  if (rotaBloqueadaPeloEvento(pedido.evento ?? null, rota.espacos)) {
    return recusar('GREVE_DE_CAMINHONEIROS')
  }

  if (jogador.caminhoes < rota.espacos) {
    return recusar('CAMINHOES_INSUFICIENTES')
  }

  const pagamento = montarPagamento(pedido)
  if (!pagamento.valido) return recusar(pagamento.motivo)

  const id = idDaRota(rota)

  return {
    valida: true,
    jogador: {
      ...jogador,
      caminhoes: jogador.caminhoes - rota.espacos,
      pontos:
        jogador.pontos +
        pontosDaRota(rota.espacos) +
        pontosExtrasDaRota(pedido.evento ?? null, rota.espacos),
      mao: removerCartas(jogador.mao, pagamento.cartas),
      rotas: [...jogador.rotas, id],
    },
    donosDasRotas: { ...donosDasRotas, [id]: jogador.id },
    cartasPagas: pagamento.cartas,
  }
}

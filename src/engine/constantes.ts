import type { CorDaCarta } from '../types/cartas'

export const CAMINHOES_POR_JOGADOR = 45

export const CAMINHOES_NA_PARTIDA_RAPIDA = 20

export const CAMINHOES_PARA_ULTIMA_RODADA = 2

export const PONTOS_CAMINHO_MAIS_LONGO = 10

export const PONTOS_POR_TAMANHO_DA_ROTA: Readonly<Record<number, number>> = {
  1: 1,
  2: 2,
  3: 4,
  4: 7,
  5: 10,
  6: 15,
}

export const NOME_DO_CORINGA = 'Estepe'

export const CORINGAS_NO_BARALHO = 14

export const CARTAS_POR_COR = 12

export const CARTAS_ABERTAS_NA_MESA = 5

export const CARTA_CORINGA = 'CORINGA'

export const CORES_DAS_CARTAS: readonly CorDaCarta[] = [
  'AM',
  'CE',
  'PA',
  'CA',
  'MA',
  'PM',
  'LI',
  'SE',
]

export const CORINGAS_ABERTOS_PARA_RENOVAR = 3

export const MAXIMO_DE_RENOVACOES_DAS_ABERTAS = 20

export const MINIMO_DE_JOGADORES = 2

export const MAXIMO_DE_JOGADORES = 5

export const JOGADORES_PARA_USAR_AS_DUAS_ROTAS_DUPLAS = 4

export const CODIGO_DA_COR_CINZA = 'GR'

export const CARTAS_INICIAIS_POR_JOGADOR = 4

export const CARTAS_POR_COMPRA = 2

export const MISSOES_OFERECIDAS_NO_INICIO = 3

export const MISSOES_MINIMAS_NO_INICIO = 2

export const MISSOES_OFERECIDAS_NO_TURNO = 3

export const MISSOES_MINIMAS_NO_TURNO = 1

export const MINIMO_DE_CIDADES_DA_MISSAO = 2

export const ESPACOS_DAS_ROTAS_LONGAS = 4

export const ESPACOS_MAXIMOS_DAS_ROTAS_CURTAS = 2

export const ESPACOS_MINIMOS_DAS_ROTAS_DO_CEU_LIMPO = 5

export const PONTOS_EXTRAS_DO_CEU_LIMPO = 2

export const CARTAS_EXTRAS_DA_CHUVA = 1

export const CARTAS_A_MENOS_DA_ESTRADA_LIBERADA = 1

export const CARTAS_MINIMAS_PARA_UMA_ROTA = 1

export const CARTAS_EXTRAS_DO_PEDAGIO = 1

export const CARTAS_POR_COMPRA_NO_FERIADO = 3

export const VALOR_DO_CORINGA_NA_BOLEIA = 2

export const RODADAS_POR_PERIODO_DO_DIA = 1

export const CAMINHOES_MINIMOS_PARA_BUSCAR_MISSOES = 15

export const MAXIMO_DE_COMPRAS_POR_TURNO_DO_COMPUTADOR = 5

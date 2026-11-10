import type { MotivoDaRecusaDaAcao } from '../engine/partida'

export const MENSAGENS_DE_RECUSA: Readonly<
  Record<MotivoDaRecusaDaAcao, string>
> = {
  ROTA_JA_REIVINDICADA: 'Essa rota já tem dono.',
  PARALELA_DO_MESMO_JOGADOR:
    'Você já tem a outra pista dessa rota. Escolha outra.',
  PARALELA_BLOQUEADA_PARA_ESTA_MESA:
    'Com menos de 4 jogadores, só uma das pistas da rota dupla é usada.',
  CAMINHOES_INSUFICIENTES: 'Você não tem caminhões suficientes para essa rota.',
  COR_OBRIGATORIA: 'Escolha a cor das cartas para pagar essa rota cinza.',
  COR_INCORRETA: 'Essas cartas não são da cor da rota.',
  QUANTIDADE_DE_CORINGAS_INVALIDA: 'Quantidade de Estepes inválida.',
  CARTAS_INSUFICIENTES: 'Você não tem cartas suficientes para pagar essa rota.',
  GREVE_DE_CAMINHONEIROS:
    'Greve de caminhoneiros: ninguém reivindica rotas de 4 ou mais espaços.',
  CARTA_DO_PEDAGIO_OBRIGATORIA: 'Escolha a carta extra do pedágio.',
  CARTA_DO_PEDAGIO_INDISPONIVEL:
    'Essa carta não está disponível para o pedágio.',
  PARTIDA_ENCERRADA: 'A partida já terminou.',
  COMPRA_EM_ANDAMENTO:
    'Você já começou a comprar cartas. Termine a compra antes.',
  SEM_CARTAS_PARA_COMPRAR: 'Não há mais cartas para comprar.',
  CORINGA_ABERTO_NA_SEGUNDA_COMPRA:
    'Estepe aberto só pode ser pego como primeira compra do turno.',
  ESCOLHA_DE_MISSOES_PENDENTE: 'Termine a escolha das missões primeiro.',
  NENHUMA_ESCOLHA_DE_MISSOES_PENDENTE: 'Não há missões para escolher agora.',
  SEM_MISSOES_PARA_COMPRAR: 'Não há mais missões no monte.',
  MISSOES_A_MENOS_DO_MINIMO: 'Escolha mais missões para continuar.',
  CARTAS_ABERTAS_VIRADAS:
    'Neblina: as cartas abertas estão viradas. Compre do monte.',
}

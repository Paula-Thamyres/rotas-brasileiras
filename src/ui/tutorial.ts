import {
  CAMINHOES_PARA_ULTIMA_RODADA,
  CAMINHOES_POR_JOGADOR,
  CARTAS_POR_COMPRA,
  JOGADORES_PARA_USAR_AS_DUAS_ROTAS_DUPLAS,
  NOME_DO_CORINGA,
  PONTOS_CAMINHO_MAIS_LONGO,
  PONTOS_POR_TAMANHO_DA_ROTA,
} from '../engine/constantes'

export interface PassoDoTutorial {
  readonly titulo: string
  readonly paragrafos: readonly string[]
}

const TABELA_DE_PONTOS = Object.entries(PONTOS_POR_TAMANHO_DA_ROTA)
  .map(([espacos, pontos]) => `${espacos} = ${pontos}`)
  .join(', ')

export const PASSOS_DO_TUTORIAL: readonly PassoDoTutorial[] = [
  {
    titulo: 'O objetivo',
    paragrafos: [
      'Você é dono de uma frota de caminhões e precisa ligar cidades do Brasil construindo rotas.',
      'Cada rota construída dá pontos. Quem tiver mais pontos no fim da partida vence.',
    ],
  },
  {
    titulo: 'Uma ação por vez',
    paragrafos: [
      'Na sua vez, você faz apenas uma destas ações:',
      `1. Comprar ${CARTAS_POR_COMPRA} cartas.`,
      '2. Reivindicar uma rota no mapa.',
      '3. Comprar missões.',
      'Depois disso, a vez passa para o próximo jogador. O aviso no topo da tela mostra de quem é a vez.',
    ],
  },
  {
    titulo: 'Comprar cartas',
    paragrafos: [
      `Pegue ${CARTAS_POR_COMPRA} cartas por vez, do Monte (às cegas) ou das cartas abertas.`,
      `A carta ${NOME_DO_CORINGA} (listrada) vale como qualquer cor. Se pegar uma ${NOME_DO_CORINGA} aberta, ela gasta a vez inteira, então não dá para pegá-la como segunda carta.`,
      'Suas cartas aparecem em "Sua mão", na coluna da direita.',
    ],
  },
  {
    titulo: 'Reivindicar uma rota',
    paragrafos: [
      'Clique numa rota livre do mapa. Para construí-la, pague com cartas da cor dela, uma por espaço.',
      `Rotas cinza aceitam qualquer cor, desde que todas as cartas sejam da mesma. A ${NOME_DO_CORINGA} substitui qualquer carta.`,
      `Cada espaço usa 1 caminhão. Você começa com ${CAMINHOES_POR_JOGADOR}.`,
      `Pontos por tamanho da rota (espaços = pontos): ${TABELA_DE_PONTOS}.`,
      `Em rotas paralelas (duas linhas entre as mesmas cidades), cada uma tem um dono. Com menos de ${JOGADORES_PARA_USAR_AS_DUAS_ROTAS_DUPLAS} jogadores, só uma delas pode ser usada.`,
      'Para reivindicar, você não pode ter comprado cartas na mesma vez.',
    ],
  },
  {
    titulo: 'Missões',
    paragrafos: [
      'Cada missão pede para ligar duas cidades, ou uma região inteira, com as suas rotas.',
      'No fim do jogo, missão cumprida soma os pontos dela. Missão não cumprida subtrai.',
      'Você pode comprar mais missões na sua vez, mas só fique com as que consegue cumprir.',
    ],
  },
  {
    titulo: 'Dia, noite e eventos',
    paragrafos: [
      'A barra no topo mostra se é dia ou noite e qual evento está valendo.',
      'Cada evento muda uma regra por um tempo, por exemplo deixar algumas rotas mais baratas ou bloquear as rotas longas. Leia a descrição dele antes de jogar.',
    ],
  },
  {
    titulo: 'Curiosidades',
    paragrafos: [
      'O primeiro jogador que construir uma rota que toca uma cidade descobre uma curiosidade sobre ela e ganha 1 ponto extra.',
    ],
  },
  {
    titulo: 'Como o jogo termina',
    paragrafos: [
      `Quando alguém fica com ${CAMINHOES_PARA_ULTIMA_RODADA} caminhões ou menos, todos jogam mais uma vez e a partida acaba.`,
      `Quem tiver o maior caminho contínuo de rotas ganha ${PONTOS_CAMINHO_MAIS_LONGO} pontos extras.`,
    ],
  },
]

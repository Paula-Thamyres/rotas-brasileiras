import { eventos } from '../data'
import {
  CAMINHOES_NA_PARTIDA_RAPIDA,
  CAMINHOES_PARA_ULTIMA_RODADA,
  CAMINHOES_POR_JOGADOR,
  CARTAS_INICIAIS_POR_JOGADOR,
  CARTAS_POR_COMPRA,
  JOGADORES_PARA_USAR_AS_DUAS_ROTAS_DUPLAS,
  MISSOES_MINIMAS_NO_INICIO,
  MISSOES_MINIMAS_NO_TURNO,
  MISSOES_OFERECIDAS_NO_INICIO,
  MISSOES_OFERECIDAS_NO_TURNO,
  NOME_DO_CORINGA,
  PONTOS_CAMINHO_MAIS_LONGO,
  PONTOS_POR_TAMANHO_DA_ROTA,
  RODADAS_POR_PERIODO_DO_DIA,
} from '../engine/constantes'

export type IlustracaoDoPasso = 'ESQUEMA_DA_TELA'

export interface PassoDoTutorial {
  readonly titulo: string
  readonly paragrafos: readonly string[]
  readonly ilustracao?: IlustracaoDoPasso
}

const TABELA_DE_PONTOS = Object.entries(PONTOS_POR_TAMANHO_DA_ROTA)
  .map(([espacos, pontos]) => `${espacos} = ${pontos}`)
  .join(', ')

const RODADAS_POR_DIA_COMPLETO = RODADAS_POR_PERIODO_DO_DIA * 2

const LISTA_DE_EVENTOS = eventos.map(
  ({ nome, descricao }) => `${nome}: ${descricao}`,
)

export const PASSOS_DO_TUTORIAL: readonly PassoDoTutorial[] = [
  {
    titulo: 'O objetivo',
    paragrafos: [
      'Você é dono de uma frota de caminhões e precisa ligar cidades do Brasil construindo rotas.',
      'Cada rota construída dá pontos. Quem tiver mais pontos no fim da partida vence.',
    ],
  },
  {
    titulo: 'Começando a partida',
    paragrafos: [
      `Cada jogador começa com ${CARTAS_INICIAIS_POR_JOGADOR} cartas e ${CAMINHOES_POR_JOGADOR} caminhões.`,
      `Na tela inicial você escolhe a duração: na partida rápida cada jogador começa com ${CAMINHOES_NA_PARTIDA_RAPIDA} caminhões, e o jogo termina bem antes.`,
      `Antes da primeira jogada, aparece uma janela com ${MISSOES_OFERECIDAS_NO_INICIO} missões. Marque as que quer manter (no mínimo ${MISSOES_MINIMAS_NO_INICIO}) e clique no botão para confirmar. O botão só acende quando você marca o suficiente.`,
      'Os jogadores escolhem um de cada vez. O computador escolhe sozinho.',
    ],
  },
  {
    titulo: 'Onde fica cada coisa',
    paragrafos: [
      'No topo ficam a rodada, o período (dia ou noite), o evento em vigor e este botão "Como jogar".',
      'A faixa colorida logo abaixo diz de quem é a vez e o que fazer agora.',
      'À esquerda estão os jogadores, com pontos, caminhões, cartas e missões. No centro fica o mapa. À direita ficam as suas missões.',
      'Embaixo ficam o Monte e as cartas abertas, a sua mão e as ações da vez.',
    ],
    ilustracao: 'ESQUEMA_DA_TELA',
  },
  {
    titulo: 'Uma ação por vez',
    paragrafos: [
      'Na sua vez, você faz apenas uma destas ações:',
      `1. Comprar ${CARTAS_POR_COMPRA} cartas.`,
      '2. Reivindicar uma rota no mapa.',
      '3. Comprar missões.',
      'Depois disso, a vez passa para o próximo jogador. Quando o computador joga, uma janela mostra o que ele fez. Clique em "Entendi" para continuar.',
    ],
  },
  {
    titulo: 'Comprar cartas',
    paragrafos: [
      `Pegue ${CARTAS_POR_COMPRA} cartas por vez, do Monte (às cegas) ou das cartas abertas. Basta clicar na carta que quer.`,
      `A carta ${NOME_DO_CORINGA} (listrada) vale como qualquer cor. Se pegar uma ${NOME_DO_CORINGA} aberta, ela gasta a vez inteira, então não dá para pegá-la como segunda carta.`,
      'Suas cartas aparecem em "Sua mão", na faixa de baixo.',
    ],
  },
  {
    titulo: 'Reivindicar uma rota',
    paragrafos: [
      'Clique numa rota livre do mapa. Abre uma janela para você escolher como pagar: a cor das cartas e quantos Estepes usar. A janela mostra o que você vai gastar.',
      'Confirme em "Reivindicar". A rota passa a ter a cor do seu jogador, e os pontos entram na hora.',
      `Rotas coloridas pedem cartas da cor delas, uma por espaço. Rotas cinza aceitam qualquer cor, desde que todas as cartas sejam da mesma. O ${NOME_DO_CORINGA} substitui qualquer carta.`,
      `Cada espaço usa 1 caminhão.`,
      `Pontos por tamanho da rota (espaços = pontos): ${TABELA_DE_PONTOS}.`,
      `Em rotas paralelas (duas linhas entre as mesmas cidades), cada uma tem um dono. Com menos de ${JOGADORES_PARA_USAR_AS_DUAS_ROTAS_DUPLAS} jogadores, só uma delas pode ser usada.`,
      'Se não der para construir a rota, o jogo explica o motivo em vermelho, na faixa de baixo, e a vez continua com você.',
      'Para reivindicar, você não pode ter comprado cartas na mesma vez.',
    ],
  },
  {
    titulo: 'Missões',
    paragrafos: [
      'Cada missão pede para ligar duas cidades, ou uma região inteira, com as suas rotas. As suas missões ficam na coluna da direita.',
      'No fim do jogo, missão cumprida soma os pontos dela. Missão não cumprida subtrai.',
      `Na sua vez você pode comprar mais missões: o jogo mostra ${MISSOES_OFERECIDAS_NO_TURNO} e você mantém pelo menos ${MISSOES_MINIMAS_NO_TURNO}. As que você devolve voltam para o monte.`,
      'Só fique com as que consegue cumprir.',
    ],
  },
  {
    titulo: 'Dia, noite e eventos',
    paragrafos: [
      `O período muda a cada ${RODADAS_POR_PERIODO_DO_DIA === 1 ? 'rodada' : `${RODADAS_POR_PERIODO_DO_DIA} rodadas`}, entre dia e noite, e as cores da tela acompanham.`,
      `A cada dia completo (${RODADAS_POR_DIA_COMPLETO} rodadas) entra um novo evento, que muda uma regra. O evento em vigor aparece no topo. Os eventos possíveis são:`,
      ...LISTA_DE_EVENTOS,
    ],
  },
  {
    titulo: 'Curiosidades',
    paragrafos: [
      'O primeiro jogador que construir uma rota que toca uma cidade descobre uma curiosidade sobre ela e ganha 1 ponto extra.',
      'A curiosidade aparece numa janela. Leia e clique para continuar.',
    ],
  },
  {
    titulo: 'Como o jogo termina',
    paragrafos: [
      `Quando alguém fica com ${CAMINHOES_PARA_ULTIMA_RODADA} caminhões ou menos, começa a última rodada: o topo da tela avisa e todos jogam mais uma vez.`,
      `No fim, as missões são contadas e quem tiver o maior caminho contínuo de rotas ganha ${PONTOS_CAMINHO_MAIS_LONGO} pontos extras.`,
      'A tela final mostra a classificação com o detalhe dos pontos de cada jogador. Em caso de empate, os jogadores dividem a posição. Para começar outra partida, clique em "Jogar de novo".',
    ],
  },
]
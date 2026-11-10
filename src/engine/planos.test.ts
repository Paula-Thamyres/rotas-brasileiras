import { describe, expect, it } from 'vitest'
import type { Carta } from '../types/cartas'
import type { Rota } from '../types/mapa'
import type { Missao } from '../types/missoes'
import { aleatorioComSemente } from './aleatorioComSemente'
import { CODIGOS_DOS_EVENTOS } from './eventos'
import { criarPartida, type Partida } from './partida'
import { planosDeReivindicacao } from './planos'

const TOTAL_DE_MISSOES_DE_TESTE = 12

const missoes: Missao[] = Array.from(
  { length: TOTAL_DE_MISSOES_DE_TESTE },
  (_, indice) => ({
    tipo: 'ligacao',
    nome: `Missão ${indice + 1}`,
    cidades: ['A', 'B'],
    pontos: 1,
  }),
)

const rotaAmazonia: Rota = {
  cidadeA: 'Manaus',
  cidadeB: 'Santarém',
  espacos: 2,
  paralela: null,
  cor: 'AM',
}

const rotaCinza: Rota = { ...rotaAmazonia, cor: 'GR' }

function partidaEmJogo(
  mao: readonly Carta[],
  codigoDoEvento = 'dia-normal',
): Partida {
  const inicial = criarPartida(
    ['Ana', 'Bia'],
    {
      missoes,
      eventos: [{ codigo: codigoDoEvento, nome: 'Evento', descricao: '' }],
      curiosidades: [],
    },
    aleatorioComSemente(1),
  )

  return {
    ...inicial,
    fase: 'EM_JOGO',
    oferta: null,
    jogadores: inicial.jogadores.map((jogador, indice) =>
      indice === 0 ? { ...jogador, mao } : jogador,
    ),
  }
}

describe('planos para reivindicar uma rota', () => {
  it('rota colorida: um plano por quantidade de Estepes que serve', () => {
    const planos = planosDeReivindicacao(
      partidaEmJogo(['AM', 'AM', 'CORINGA']),
      rotaAmazonia,
    )

    expect(planos.map((plano) => plano.coringasUsados)).toEqual([0, 1])
    expect(planos[0].cartasPagas).toEqual(['AM', 'AM'])
  })

  it('só oferece os planos que a mão consegue pagar', () => {
    const planos = planosDeReivindicacao(
      partidaEmJogo(['AM', 'CORINGA']),
      rotaAmazonia,
    )

    expect(planos).toEqual([
      expect.objectContaining({
        coringasUsados: 1,
        cartasPagas: ['AM', 'CORINGA'],
      }),
    ])
  })

  it('rota cinza: oferece cada cor que a mão consegue pagar', () => {
    const planos = planosDeReivindicacao(
      partidaEmJogo(['AM', 'AM', 'CE', 'CE']),
      rotaCinza,
    )

    expect(planos.map((plano) => plano.cor)).toEqual(['AM', 'CE'])
  })

  it('devolve lista vazia quando não dá para pagar', () => {
    expect(planosDeReivindicacao(partidaEmJogo(['CE']), rotaAmazonia)).toEqual(
      [],
    )
  })

  it('devolve lista vazia quando a rota já tem dono', () => {
    const partida: Partida = {
      ...partidaEmJogo(['AM', 'AM']),
      donosDasRotas: { 'Manaus-Santarém-unica': 'jogador-2' },
    }

    expect(planosDeReivindicacao(partida, rotaAmazonia)).toEqual([])
  })

  it('devolve lista vazia no meio de uma compra, com escolha pendente ou no fim', () => {
    const base = partidaEmJogo(['AM', 'AM'])

    expect(
      planosDeReivindicacao(
        { ...base, cartasCompradasNoTurno: 1 },
        rotaAmazonia,
      ),
    ).toEqual([])
    expect(
      planosDeReivindicacao({ ...base, encerrada: true }, rotaAmazonia),
    ).toEqual([])
    expect(
      planosDeReivindicacao(
        { ...base, oferta: { missoes: [], minimoParaManter: 1 } },
        rotaAmazonia,
      ),
    ).toEqual([])
  })

  it('pedágio: oferece cada carta que sobra para a carta extra', () => {
    const planos = planosDeReivindicacao(
      partidaEmJogo(['AM', 'AM', 'CE', 'PA'], CODIGOS_DOS_EVENTOS.pedagio),
      rotaAmazonia,
    )
    const cartasDoPedagio = planos
      .filter((plano) => plano.coringasUsados === 0)
      .map((plano) => plano.cartaDoPedagio)

    expect(cartasDoPedagio).toEqual(['CE', 'PA'])
  })

  it('greve de caminhoneiros: nenhuma rota longa é reivindicável', () => {
    const rotaLonga: Rota = { ...rotaAmazonia, espacos: 4 }
    const partida = partidaEmJogo(
      Array<Carta>(6).fill('AM'),
      CODIGOS_DOS_EVENTOS.greveDeCaminhoneiros,
    )

    expect(planosDeReivindicacao(partida, rotaLonga)).toEqual([])
  })

  it('boleia amiga: cada Estepe cobre 2 espaços', () => {
    const planos = planosDeReivindicacao(
      partidaEmJogo(['CORINGA'], CODIGOS_DOS_EVENTOS.boleiaAmiga),
      rotaAmazonia,
    )

    expect(planos).toEqual([
      expect.objectContaining({ coringasUsados: 1, cartasPagas: ['CORINGA'] }),
    ])
  })
})

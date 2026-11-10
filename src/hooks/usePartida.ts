import { useCallback, useEffect, useState } from 'react'
import { curiosidades, eventos, mapa, missoes } from '../data'
import { jogarVezDoComputador } from '../engine/computador'
import {
  criarPartida,
  jogadorDaVez,
  type Partida,
  type ResultadoDaAcao,
} from '../engine/partida'
import type { Curiosidade } from '../types/curiosidades'
import { MENSAGENS_DE_RECUSA } from '../ui/mensagens'
import type { ParticipanteDaPartida } from '../ui/participantes'

export const ATRASO_DA_JOGADA_DO_COMPUTADOR_EM_MS = 1200

const MENSAGEM_DO_COMPUTADOR_SEM_JOGADA =
  'O computador não encontrou uma jogada possível.'

export type AcaoDaPartida = (partida: Partida) => ResultadoDaAcao

export interface DescobertaDeCuriosidades {
  readonly nomeDoJogador: string
  readonly curiosidades: readonly Curiosidade[]
}

export interface UsoDaPartida {
  readonly partida: Partida | null
  readonly aviso: string | null
  readonly descoberta: DescobertaDeCuriosidades | null
  readonly idsDosComputadores: ReadonlySet<string>
  readonly jogadaDoComputador: string | null
  readonly iniciar: (participantes: readonly ParticipanteDaPartida[]) => void
  readonly executar: (acao: AcaoDaPartida) => void
  readonly dispensarDescoberta: () => void
  readonly reiniciar: () => void
}

const SEM_COMPUTADORES: ReadonlySet<string> = new Set()

export function usePartida(): UsoDaPartida {
  const [partida, setPartida] = useState<Partida | null>(null)
  const [aviso, setAviso] = useState<string | null>(null)
  const [descoberta, setDescoberta] = useState<DescobertaDeCuriosidades | null>(
    null,
  )
  const [idsDosComputadores, setIdsDosComputadores] =
    useState<ReadonlySet<string>>(SEM_COMPUTADORES)
  const [jogadaDoComputador, setJogadaDoComputador] = useState<string | null>(
    null,
  )

  useEffect(() => {
    if (partida === null || partida.encerrada || descoberta !== null) return

    const jogador = jogadorDaVez(partida)

    if (!idsDosComputadores.has(jogador.id)) return

    const temporizador = setTimeout(() => {
      const jogada = jogarVezDoComputador(partida, mapa.rotas)

      if (jogada === null) {
        setAviso(MENSAGEM_DO_COMPUTADOR_SEM_JOGADA)
        return
      }

      setPartida(jogada.partida)
      setJogadaDoComputador(`${jogador.nome} ${jogada.descricao}`)
    }, ATRASO_DA_JOGADA_DO_COMPUTADOR_EM_MS)

    return () => clearTimeout(temporizador)
  }, [partida, descoberta, idsDosComputadores])

  const iniciar = useCallback(
    (participantes: readonly ParticipanteDaPartida[]) => {
      const nova = criarPartida(
        participantes.map(({ nome }) => nome),
        { missoes, eventos, curiosidades },
      )

      setPartida(nova)
      setIdsDosComputadores(
        new Set(
          nova.jogadores
            .filter((_, indice) => participantes[indice].computador)
            .map((jogador) => jogador.id),
        ),
      )
      setAviso(null)
      setDescoberta(null)
      setJogadaDoComputador(null)
    },
    [],
  )

  const executar = useCallback(
    (acao: AcaoDaPartida) => {
      if (partida === null) return
      if (idsDosComputadores.has(jogadorDaVez(partida).id)) return

      const resultado = acao(partida)

      if (!resultado.valida) {
        setAviso(MENSAGENS_DE_RECUSA[resultado.motivo])
        return
      }

      setPartida(resultado.partida)
      setAviso(null)
      setJogadaDoComputador(null)

      if (
        resultado.curiosidades !== undefined &&
        resultado.curiosidades.length > 0
      ) {
        setDescoberta({
          nomeDoJogador: jogadorDaVez(partida).nome,
          curiosidades: resultado.curiosidades,
        })
      }
    },
    [partida, idsDosComputadores],
  )

  const dispensarDescoberta = useCallback(() => setDescoberta(null), [])

  const reiniciar = useCallback(() => {
    setPartida(null)
    setAviso(null)
    setDescoberta(null)
    setIdsDosComputadores(SEM_COMPUTADORES)
    setJogadaDoComputador(null)
  }, [])

  return {
    partida,
    aviso,
    descoberta,
    idsDosComputadores,
    jogadaDoComputador,
    iniciar,
    executar,
    dispensarDescoberta,
    reiniciar,
  }
}

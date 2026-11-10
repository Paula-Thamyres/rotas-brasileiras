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
import { caminhoesDaDuracao, type DuracaoDaPartida } from '../ui/duracao'
import type { ParticipanteDaPartida } from '../ui/participantes'

export const ATRASO_DA_JOGADA_DO_COMPUTADOR_EM_MS = 2500

const MENSAGEM_DO_COMPUTADOR_SEM_JOGADA =
  'O computador nÃ£o encontrou uma jogada possÃ­vel.'

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
  readonly jogadasDosComputadores: readonly string[]
  readonly avisoDaJogadaAberto: boolean
  readonly iniciar: (
    participantes: readonly ParticipanteDaPartida[],
    duracao: DuracaoDaPartida,
  ) => void
  readonly executar: (acao: AcaoDaPartida) => void
  readonly dispensarDescoberta: () => void
  readonly dispensarAvisoDaJogada: () => void
  readonly reiniciar: () => void
}

const SEM_COMPUTADORES: ReadonlySet<string> = new Set()
const SEM_JOGADAS: readonly string[] = []

export function usePartida(): UsoDaPartida {
  const [partida, setPartida] = useState<Partida | null>(null)
  const [aviso, setAviso] = useState<string | null>(null)
  const [descoberta, setDescoberta] = useState<DescobertaDeCuriosidades | null>(
    null,
  )
  const [idsDosComputadores, setIdsDosComputadores] =
    useState<ReadonlySet<string>>(SEM_COMPUTADORES)
  const [jogadasDosComputadores, setJogadasDosComputadores] =
    useState<readonly string[]>(SEM_JOGADAS)
  const [avisoDaJogadaAberto, setAvisoDaJogadaAberto] = useState(false)

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
      setAvisoDaJogadaAberto(true)
      setJogadasDosComputadores((atuais) => [
        ...atuais,
        `${jogador.nome} ${jogada.descricao}`,
      ])
    }, ATRASO_DA_JOGADA_DO_COMPUTADOR_EM_MS)

    return () => clearTimeout(temporizador)
  }, [partida, descoberta, idsDosComputadores])

  const iniciar = useCallback(
    (
      participantes: readonly ParticipanteDaPartida[],
      duracao: DuracaoDaPartida,
    ) => {
      const nova = criarPartida(
        participantes.map(({ nome }) => nome),
        { missoes, eventos, curiosidades },
        undefined,
        caminhoesDaDuracao(duracao),
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
      setJogadasDosComputadores(SEM_JOGADAS)
      setAvisoDaJogadaAberto(false)
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
      setJogadasDosComputadores(SEM_JOGADAS)
      setAvisoDaJogadaAberto(false)

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

  const dispensarAvisoDaJogada = useCallback(
    () => setAvisoDaJogadaAberto(false),
    [],
  )

  const reiniciar = useCallback(() => {
    setPartida(null)
    setAviso(null)
    setDescoberta(null)
    setIdsDosComputadores(SEM_COMPUTADORES)
    setJogadasDosComputadores(SEM_JOGADAS)
    setAvisoDaJogadaAberto(false)
  }, [])

  return {
    partida,
    aviso,
    descoberta,
    idsDosComputadores,
    jogadasDosComputadores,
    avisoDaJogadaAberto,
    iniciar,
    executar,
    dispensarDescoberta,
    dispensarAvisoDaJogada,
    reiniciar,
  }
}
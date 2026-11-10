import { useState, type SyntheticEvent } from 'react'
import {
  MAXIMO_DE_JOGADORES,
  MINIMO_DE_JOGADORES,
} from '../../engine/constantes'
import { corDoJogador } from '../../ui/jogadores'
import { BotaoComoJogar } from '../tutorial/ComoJogar'
import { TAMANHO_MAXIMO_DO_NOME } from '../../ui/nomes'
import {
  motivoDeParticipantesInvalidos,
  nomeDoComputador,
  type ParticipanteDaPartida,
} from '../../ui/participantes'

interface TelaInicialProps {
  readonly onIniciar: (participantes: readonly ParticipanteDaPartida[]) => void
}

const PARTICIPANTES_INICIAIS: readonly ParticipanteDaPartida[] = [
  { nome: '', computador: false },
  { nome: nomeDoComputador(1), computador: true },
]

function proximoNomeLivre(participantes: readonly ParticipanteDaPartida[]) {
  const nomesUsados = new Set(participantes.map(({ nome }) => nome))
  let posicao = 1

  while (nomesUsados.has(nomeDoComputador(posicao))) posicao++

  return nomeDoComputador(posicao)
}

export function TelaInicial({ onIniciar }: TelaInicialProps) {
  const [participantes, setParticipantes] = useState(PARTICIPANTES_INICIAIS)
  const [erro, setErro] = useState<string | null>(null)

  function alterar(indice: number, mudanca: Partial<ParticipanteDaPartida>) {
    setParticipantes((atuais) =>
      atuais.map((atual, i) =>
        i === indice ? { ...atual, ...mudanca } : atual,
      ),
    )
    setErro(null)
  }

  function trocarTipo(indice: number, computador: boolean) {
    const atual = participantes[indice]
    const nomePadrao = proximoNomeLivre(participantes)
    const nome =
      computador && atual.nome.trim() === ''
        ? nomePadrao
        : !computador && atual.nome.startsWith('Computador')
          ? ''
          : atual.nome

    alterar(indice, { computador, nome })
  }

  function remover(indice: number) {
    setParticipantes((atuais) => atuais.filter((_, i) => i !== indice))
    setErro(null)
  }

  function adicionar() {
    setParticipantes((atuais) => [...atuais, { nome: '', computador: false }])
    setErro(null)
  }

  function enviar(evento: SyntheticEvent<HTMLFormElement>) {
    evento.preventDefault()

    const motivo = motivoDeParticipantesInvalidos(participantes)

    if (motivo !== null) {
      setErro(motivo)
      return
    }

    onIniciar(
      participantes.map(({ nome, computador }) => ({
        nome: nome.trim(),
        computador,
      })),
    )
  }

  return (
    <main className="flex min-h-screen items-center justify-center p-4">
      <form
        onSubmit={enviar}
        className="w-full max-w-md space-y-4 rounded-2xl border border-slate-700 bg-slate-800 p-6"
      >
        <h1 className="text-3xl font-bold">Rotas Brasileiras</h1>
        <p className="text-sm text-slate-400">
          De {MINIMO_DE_JOGADORES} a {MAXIMO_DE_JOGADORES} jogadores. Cada vaga
          pode ser uma pessoa ou o computador.
        </p>
        <ul className="space-y-2">
          {participantes.map((participante, indice) => (
            <li key={indice} className="flex items-center gap-2">
              <span
                aria-hidden="true"
                className="h-4 w-4 shrink-0 rounded-full"
                style={{ background: corDoJogador(indice) }}
              />
              <input
                type="text"
                value={participante.nome}
                maxLength={TAMANHO_MAXIMO_DO_NOME}
                placeholder={`Jogador ${indice + 1}`}
                aria-label={`Nome do jogador ${indice + 1}`}
                onChange={(evento) =>
                  alterar(indice, { nome: evento.target.value })
                }
                className="min-w-0 flex-1 rounded-lg border border-slate-600 bg-slate-900 px-3 py-2"
              />
              <select
                value={participante.computador ? 'computador' : 'pessoa'}
                aria-label={`Tipo do jogador ${indice + 1}`}
                onChange={(evento) =>
                  trocarTipo(indice, evento.target.value === 'computador')
                }
                className="rounded-lg border border-slate-600 bg-slate-900 px-2 py-2 text-sm"
              >
                <option value="pessoa">Pessoa</option>
                <option value="computador">Computador</option>
              </select>
              {participantes.length > MINIMO_DE_JOGADORES && (
                <button
                  type="button"
                  aria-label={`Remover jogador ${indice + 1}`}
                  onClick={() => remover(indice)}
                  className="cursor-pointer rounded-lg px-2 py-1 text-slate-400 hover:text-white"
                >
                  Remover
                </button>
              )}
            </li>
          ))}
        </ul>
        {participantes.length < MAXIMO_DE_JOGADORES && (
          <button
            type="button"
            onClick={adicionar}
            className="cursor-pointer text-sm text-amber-300 hover:underline"
          >
            Adicionar jogador
          </button>
        )}
        {erro !== null && (
          <p
            role="alert"
            className="rounded-lg bg-red-950 p-2 text-sm text-red-200"
          >
            {erro}
          </p>
        )}
        <button
          type="submit"
          className="w-full cursor-pointer rounded-lg bg-amber-400 px-4 py-2 font-bold text-slate-900"
        >
          Começar partida
        </button>
        <div className="flex justify-center">
          <BotaoComoJogar />
        </div>
      </form>
    </main>
  )
}

import { useState } from 'react'
import { pontosExtrasDaRota } from '../../engine/eventos'
import type { PlanoDeReivindicacao } from '../../engine/planos'
import { pontosDaRota } from '../../engine/pontuacao'
import type { Carta } from '../../types/cartas'
import type { Evento } from '../../types/eventos'
import type { Rota } from '../../types/mapa'
import { descreverCartas, nomeDaCarta } from '../../ui/cartas'
import {
  opcoesDePagamento,
  planoEscolhido,
  type EscolhaDePagamento,
} from '../../ui/pagamento'

interface PagamentoDaRotaProps {
  readonly rota: Rota
  readonly planos: readonly PlanoDeReivindicacao[]
  readonly evento: Evento
  readonly onConfirmar: (plano: PlanoDeReivindicacao) => void
  readonly onCancelar: () => void
}

interface GrupoDeOpcoesProps<T> {
  readonly titulo: string
  readonly opcoes: readonly T[]
  readonly escolhida: T | undefined
  readonly rotulo: (opcao: T) => string
  readonly onEscolher: (opcao: T) => void
}

function GrupoDeOpcoes<T>({
  titulo,
  opcoes,
  escolhida,
  rotulo,
  onEscolher,
}: GrupoDeOpcoesProps<T>) {
  if (opcoes.length < 2) return null

  return (
    <fieldset className="mt-4">
      <legend className="mb-2 text-sm font-semibold">{titulo}</legend>
      <div className="flex flex-wrap gap-2">
        {opcoes.map((opcao) => (
          <label
            key={rotulo(opcao)}
            className="cursor-pointer rounded-lg border border-slate-600 bg-slate-900 px-3 py-1.5 text-sm has-checked:border-amber-400 has-checked:bg-slate-700"
          >
            <input
              type="radio"
              name={titulo}
              checked={escolhida === opcao}
              onChange={() => onEscolher(opcao)}
              className="sr-only"
            />
            {rotulo(opcao)}
          </label>
        ))}
      </div>
    </fieldset>
  )
}

function rotuloDeEstepes(quantidade: number): string {
  return quantidade === 1 ? '1 Estepe' : `${quantidade} Estepes`
}

function rotuloDoPedagio(carta: Carta | null): string {
  return carta === null ? 'Nenhuma' : nomeDaCarta(carta)
}

export function PagamentoDaRota({
  rota,
  planos,
  evento,
  onConfirmar,
  onCancelar,
}: PagamentoDaRotaProps) {
  const [escolha, setEscolha] = useState<EscolhaDePagamento>({})
  const opcoes = opcoesDePagamento(planos, escolha)
  const plano = planoEscolhido(planos, escolha)
  const pontos =
    pontosDaRota(rota.espacos) + pontosExtrasDaRota(evento, rota.espacos)

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="titulo-do-pagamento"
      className="fixed inset-0 z-10 flex items-center justify-center bg-slate-950/80 p-4"
    >
      <div className="w-full max-w-md rounded-2xl border border-slate-600 bg-slate-800 p-6 shadow-xl">
        <h2 id="titulo-do-pagamento" className="text-xl font-bold">
          {rota.cidadeA} a {rota.cidadeB}
        </h2>
        <p className="mt-1 text-sm text-slate-400">
          {rota.espacos} espaços · vale {pontos} pontos
        </p>
        <GrupoDeOpcoes
          titulo="Cor das cartas"
          opcoes={opcoes.cores}
          escolhida={escolha.cor}
          rotulo={nomeDaCarta}
          onEscolher={(cor) => setEscolha({ cor })}
        />
        <GrupoDeOpcoes
          titulo="Estepes usados"
          opcoes={opcoes.coringas}
          escolhida={escolha.coringas}
          rotulo={rotuloDeEstepes}
          onEscolher={(coringas) => setEscolha({ cor: escolha.cor, coringas })}
        />
        <GrupoDeOpcoes
          titulo="Carta extra do pedágio"
          opcoes={opcoes.pedagios}
          escolhida={escolha.pedagio}
          rotulo={rotuloDoPedagio}
          onEscolher={(pedagio) => setEscolha({ ...escolha, pedagio })}
        />
        <p className="mt-5 min-h-6 text-sm">
          {plano === null ? (
            'Escolha como pagar.'
          ) : (
            <>
              Você paga: <strong>{descreverCartas(plano.cartasPagas)}</strong>
              {plano.cartaDoPedagio !== null && (
                <>
                  {' '}
                  + pedágio:{' '}
                  <strong>{nomeDaCarta(plano.cartaDoPedagio)}</strong>
                </>
              )}
            </>
          )}
        </p>
        <div className="mt-4 flex gap-2">
          <button
            type="button"
            onClick={onCancelar}
            className="flex-1 cursor-pointer rounded-lg bg-slate-600 px-4 py-2 font-bold hover:bg-slate-500"
          >
            Cancelar
          </button>
          <button
            type="button"
            disabled={plano === null}
            onClick={() => plano !== null && onConfirmar(plano)}
            className="flex-1 cursor-pointer rounded-lg bg-amber-400 px-4 py-2 font-bold text-slate-900 disabled:cursor-not-allowed disabled:bg-slate-600 disabled:text-slate-400"
          >
            Reivindicar
          </button>
        </div>
      </div>
    </div>
  )
}

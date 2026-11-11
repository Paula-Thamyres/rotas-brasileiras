import { useState } from 'react'
import type { OfertaDeMissoes } from '../../engine/ofertaDeMissoes'
import { descricaoDaMissao } from '../../ui/missoes'

interface EscolhaDeMissoesProps {
  readonly nomeDoJogador: string
  readonly oferta: OfertaDeMissoes
  readonly onConfirmar: (nomesMantidos: readonly string[]) => void
  readonly onVoltarAoInicio: () => void
}

interface ConfirmacaoDeSaidaProps {
  readonly onContinuar: () => void
  readonly onSair: () => void
}

function ConfirmacaoDeSaida({ onContinuar, onSair }: ConfirmacaoDeSaidaProps) {
  return (
    <div className="mt-5 rounded-lg border border-borda bg-interno p-4">
      <p className="font-semibold">Sair da partida?</p>
      <p className="mt-1 text-sm text-suave">Você perde o jogo atual.</p>
      <div className="mt-3 flex gap-2">
        <button
          type="button"
          onClick={onContinuar}
          className="flex-1 cursor-pointer rounded-lg border border-suave px-4 py-2 font-semibold"
        >
          Continuar jogando
        </button>
        <button
          type="button"
          onClick={onSair}
          className="flex-1 cursor-pointer rounded-lg bg-red-500 px-4 py-2 font-bold text-white"
        >
          Sair da partida
        </button>
      </div>
    </div>
  )
}

export function EscolhaDeMissoes({
  nomeDoJogador,
  oferta,
  onConfirmar,
  onVoltarAoInicio,
}: EscolhaDeMissoesProps) {
  const [escolhidas, setEscolhidas] = useState<ReadonlySet<string>>(new Set())
  const [confirmandoSaida, setConfirmandoSaida] = useState(false)
  const [vendoOMapa, setVendoOMapa] = useState(false)
  const faltam = oferta.minimoParaManter - escolhidas.size
  const total = oferta.missoes.length
  const rotuloDoBotao =
    faltam > 0
      ? `Manter ${escolhidas.size} de ${total} · marque pelo menos ${oferta.minimoParaManter}`
      : `Manter ${escolhidas.size} de ${total}`

  function alternar(nome: string) {
    setEscolhidas((atuais) => {
      const proximas = new Set(atuais)

      if (!proximas.delete(nome)) proximas.add(nome)

      return proximas
    })
  }

  if (vendoOMapa) {
    return (
      <div
        role="region"
        aria-label="Escolha de missões em pausa"
        className="fixed inset-x-0 bottom-4 z-10 mx-auto flex w-fit max-w-[calc(100%-2rem)] flex-wrap items-center gap-3 rounded-xl border-2 border-destaque bg-painel px-4 py-3 shadow-xl"
      >
        <p className="text-sm">
          {nomeDoJogador}, olhe o mapa com calma. Suas missões estão guardadas.
        </p>
        <button
          type="button"
          onClick={() => setVendoOMapa(false)}
          className="cursor-pointer rounded-lg bg-destaque px-4 py-2 text-sm font-bold text-sobre-destaque"
        >
          Voltar para escolher missões
        </button>
      </div>
    )
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="titulo-da-escolha-de-missoes"
      className="fixed inset-0 z-10 flex items-center justify-center bg-sombra/80 p-4"
    >
      <div className="w-full max-w-lg rounded-2xl border border-borda bg-painel p-6 shadow-xl">
        <h2 id="titulo-da-escolha-de-missoes" className="text-xl font-bold">
          {nomeDoJogador}, escolha suas missões
        </h2>
        <p className="mt-1 text-sm text-suave">
          Missão é ligar as cidades indicadas com as suas rotas.
        </p>
        <p className="mt-1 text-sm text-suave">
          Marque pelo menos {oferta.minimoParaManter} para manter.
        </p>
        <button
          type="button"
          onClick={() => setVendoOMapa(true)}
          className="mt-3 w-full cursor-pointer rounded-lg border border-destaque px-4 py-2 text-sm font-semibold"
        >
          Ver o mapa antes de escolher
        </button>
        <ul className="mt-4 space-y-2">
          {oferta.missoes.map((missao) => (
            <li key={missao.nome}>
              <label className="flex cursor-pointer items-start gap-3 rounded-lg border border-borda bg-interno p-3 has-checked:border-destaque">
                <input
                  type="checkbox"
                  checked={escolhidas.has(missao.nome)}
                  onChange={() => alternar(missao.nome)}
                  className="mt-1 h-4 w-4 accent-destaque"
                />
                <span>
                  <span className="block font-semibold">{missao.nome}</span>
                  <span className="block text-xs text-suave">
                    {descricaoDaMissao(missao)}
                  </span>
                  <span className="block text-xs">
                    <span className="text-ganho">
                      +{missao.pontos} se ligar
                    </span>
                    {' · '}
                    <span className="text-perda">
                      -{missao.pontos} se não ligar
                    </span>
                  </span>
                </span>
              </label>
            </li>
          ))}
        </ul>
        {confirmandoSaida ? (
          <ConfirmacaoDeSaida
            onContinuar={() => setConfirmandoSaida(false)}
            onSair={onVoltarAoInicio}
          />
        ) : (
          <>
            <button
              type="button"
              disabled={faltam > 0}
              onClick={() => onConfirmar([...escolhidas])}
              className="mt-5 w-full cursor-pointer rounded-lg bg-destaque px-4 py-2 font-bold text-sobre-destaque disabled:cursor-not-allowed disabled:bg-borda disabled:text-suave"
            >
              {rotuloDoBotao}
            </button>
            <button
              type="button"
              onClick={() => setConfirmandoSaida(true)}
              className="mt-3 w-full cursor-pointer text-sm text-suave hover:text-texto"
            >
              Voltar ao início
            </button>
          </>
        )}
      </div>
    </div>
  )
}
import { useEffect, useState } from 'react'
import { PASSOS_DO_TUTORIAL } from '../../ui/tutorial'

interface ComoJogarProps {
  readonly onFechar: () => void
}

function ComoJogar({ onFechar }: ComoJogarProps) {
  const [indice, setIndice] = useState(0)
  const passo = PASSOS_DO_TUTORIAL[indice]
  const ehPrimeiro = indice === 0
  const ehUltimo = indice === PASSOS_DO_TUTORIAL.length - 1

  useEffect(() => {
    function fecharComEsc(evento: KeyboardEvent) {
      if (evento.key === 'Escape') onFechar()
    }

    window.addEventListener('keydown', fecharComEsc)
    return () => window.removeEventListener('keydown', fecharComEsc)
  }, [onFechar])

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="titulo-do-tutorial"
      className="fixed inset-0 z-30 flex items-center justify-center bg-sombra/80 p-4"
    >
      <div className="w-full max-w-lg rounded-2xl border border-borda bg-painel p-6 shadow-xl">
        <p className="text-xs font-semibold tracking-wider text-suave uppercase">
          Como jogar · {indice + 1} de {PASSOS_DO_TUTORIAL.length}
        </p>
        <h2 id="titulo-do-tutorial" className="mt-1 text-xl font-bold">
          {passo.titulo}
        </h2>
        <div className="mt-4 min-h-40 space-y-3 text-sm leading-relaxed">
          {passo.paragrafos.map((paragrafo) => (
            <p key={paragrafo}>{paragrafo}</p>
          ))}
        </div>
        <div className="mt-5 flex items-center justify-between gap-2">
          <button
            type="button"
            onClick={onFechar}
            className="cursor-pointer text-sm text-suave hover:text-texto"
          >
            Fechar
          </button>
          <div className="flex gap-2">
            <button
              type="button"
              disabled={ehPrimeiro}
              onClick={() => setIndice(indice - 1)}
              className="cursor-pointer rounded-lg bg-botao px-4 py-2 text-sm font-bold hover:bg-botao-hover disabled:cursor-not-allowed disabled:opacity-40"
            >
              Voltar
            </button>
            <button
              type="button"
              onClick={ehUltimo ? onFechar : () => setIndice(indice + 1)}
              className="cursor-pointer rounded-lg bg-destaque px-4 py-2 text-sm font-bold text-sobre-destaque"
            >
              {ehUltimo ? 'Entendi' : 'Próximo'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export function BotaoComoJogar() {
  const [aberto, setAberto] = useState(false)

  return (
    <>
      <button
        type="button"
        onClick={() => setAberto(true)}
        className="cursor-pointer rounded-lg border border-destaque-texto px-3 py-1 text-sm font-bold text-destaque-texto hover:bg-destaque hover:text-sobre-destaque"
      >
        Como jogar
      </button>
      {aberto && <ComoJogar onFechar={() => setAberto(false)} />}
    </>
  )
}

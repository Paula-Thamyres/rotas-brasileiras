import { useEffect, useRef } from 'react'

interface AvisoDasJogadasProps {
  readonly jogadas: readonly string[]
  readonly onFechar: () => void
}

export function AvisoDasJogadas({ jogadas, onFechar }: AvisoDasJogadasProps) {
  const botao = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    botao.current?.focus()
  }, [])

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="titulo-do-aviso-das-jogadas"
      className="fixed inset-0 z-20 flex items-center justify-center bg-sombra/80 p-4"
    >
      <div className="w-full max-w-md rounded-2xl border-2 border-destaque bg-painel p-6 shadow-xl">
        <h2 id="titulo-do-aviso-das-jogadas" className="text-xl font-bold">
          {jogadas.length === 1
            ? 'O computador jogou'
            : 'Os computadores jogaram'}
        </h2>
        <ul className="mt-4 space-y-2 text-lg">
          {jogadas.map((jogada, indice) => (
            <li key={`${indice}-${jogada}`}>{jogada}</li>
          ))}
        </ul>
        <button
          ref={botao}
          type="button"
          onClick={onFechar}
          className="mt-5 w-full cursor-pointer rounded-lg bg-destaque px-4 py-2 font-bold text-sobre-destaque"
        >
          Entendi
        </button>
      </div>
    </div>
  )
}
import { useEffect, useRef } from 'react'
import { UltimasJogadas } from './UltimasJogadas'

interface FaixaDoResultadoProps {
  readonly mensagem: string
  readonly jogadasDosComputadores: readonly string[]
}

export function FaixaDoResultado({
  mensagem,
  jogadasDosComputadores,
}: FaixaDoResultadoProps) {
  const faixa = useRef<HTMLElement>(null)

  useEffect(() => {
    faixa.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }, [])

  return (
    <section
      ref={faixa}
      role="status"
      aria-live="polite"
      className="rounded-xl border-2 border-destaque bg-aviso px-4 py-3 text-sobre-aviso"
    >
      <p className="text-sm font-bold tracking-wide uppercase">Fim de jogo</p>
      <p className="text-xl font-bold">{mensagem}</p>
      <UltimasJogadas jogadas={jogadasDosComputadores} />
    </section>
  )
}
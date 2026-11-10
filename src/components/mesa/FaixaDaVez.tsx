import { UltimasJogadas } from './UltimasJogadas'

interface FaixaDaVezProps {
  readonly nomeDaVez: string
  readonly vezDoComputador: boolean
  readonly instrucao: string
  readonly corDoJogador: string
  readonly jogadasDosComputadores: readonly string[]
}

export function FaixaDaVez({
  nomeDaVez,
  vezDoComputador,
  instrucao,
  corDoJogador,
  jogadasDosComputadores,
}: FaixaDaVezProps) {
  const classes = vezDoComputador
    ? 'border-suave bg-borda'
    : 'border-destaque bg-aviso text-sobre-aviso'

  return (
    <section
      role="status"
      aria-live="polite"
      className={`flex items-start gap-3 rounded-xl border-2 px-4 py-3 ${classes}`}
    >
      <span
        aria-hidden="true"
        className="mt-1 h-5 w-5 shrink-0 rounded-full border-2 border-white"
        style={{ background: corDoJogador }}
      />
      {vezDoComputador ? (
        <div>
          <p className="text-lg font-bold">
            Vez de {nomeDaVez}
            <span className="ml-2 text-sm font-normal text-suave">
              Aguarde, o computador está jogando...
            </span>
          </p>
          <UltimasJogadas jogadas={jogadasDosComputadores} />
        </div>
      ) : (
        <div>
          <p className="text-lg font-bold">Sua vez, {nomeDaVez}!</p>
          <p className="text-sm">{instrucao}</p>
          <UltimasJogadas jogadas={jogadasDosComputadores} />
        </div>
      )}
    </section>
  )
}
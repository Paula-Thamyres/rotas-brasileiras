interface FaixaDaVezProps {
  readonly nomeDaVez: string
  readonly vezDoComputador: boolean
  readonly instrucao: string
  readonly corDoJogador: string
}

export function FaixaDaVez({
  nomeDaVez,
  vezDoComputador,
  instrucao,
  corDoJogador,
}: FaixaDaVezProps) {
  const classes = vezDoComputador
    ? 'border-suave bg-borda'
    : 'border-destaque bg-aviso text-sobre-aviso'

  return (
    <section
      role="status"
      aria-live="polite"
      className={`flex items-center gap-3 rounded-xl border-2 px-4 py-3 ${classes}`}
    >
      <span
        aria-hidden="true"
        className="h-5 w-5 shrink-0 rounded-full border-2 border-white"
        style={{ background: corDoJogador }}
      />
      {vezDoComputador ? (
        <p className="text-lg font-bold">
          Vez de {nomeDaVez}
          <span className="ml-2 text-sm font-normal text-suave">
            Aguarde, o computador está jogando...
          </span>
        </p>
      ) : (
        <div>
          <p className="text-lg font-bold">Sua vez, {nomeDaVez}!</p>
          <p className="text-sm">{instrucao}</p>
        </div>
      )}
    </section>
  )
}

interface AcoesDaVezProps {
  readonly aviso: string | null
  readonly onComprarMissoes: () => void
}

export function AcoesDaVez({ aviso, onComprarMissoes }: AcoesDaVezProps) {
  return (
    <section aria-label="Ações da vez" className="space-y-2">
      {aviso !== null && (
        <p
          role="alert"
          className="rounded-lg bg-red-950 p-2 text-sm text-red-200"
        >
          {aviso}
        </p>
      )}
      <p className="text-sm text-suave">
        Para reivindicar uma rota, clique nela no mapa.
      </p>
      <button
        type="button"
        onClick={onComprarMissoes}
        className="w-full cursor-pointer rounded-lg bg-botao px-3 py-2 text-sm font-bold hover:bg-botao-hover"
      >
        Comprar missões
      </button>
    </section>
  )
}
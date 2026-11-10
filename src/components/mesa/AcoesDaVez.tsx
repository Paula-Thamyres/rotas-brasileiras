interface AcoesDaVezProps {
  readonly aviso: string | null
  readonly jogadaDoComputador: string | null
  readonly onComprarMissoes: () => void
}

export function AcoesDaVez({
  aviso,
  jogadaDoComputador,
  onComprarMissoes,
}: AcoesDaVezProps) {
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
      {jogadaDoComputador !== null && (
        <p className="rounded-lg bg-slate-900 p-2 text-sm">
          {jogadaDoComputador}
        </p>
      )}
      <p className="text-xs text-slate-400">
        Para reivindicar uma rota, clique nela no mapa.
      </p>
      <button
        type="button"
        onClick={onComprarMissoes}
        className="w-full cursor-pointer rounded-lg bg-slate-600 px-3 py-2 text-sm font-bold hover:bg-slate-500"
      >
        Comprar missões
      </button>
    </section>
  )
}

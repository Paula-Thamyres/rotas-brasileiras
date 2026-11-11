interface AcoesDaVezProps {
  readonly compra: string | null
  readonly onComprarMissoes: () => void
}

export function AcoesDaVez({ compra, onComprarMissoes }: AcoesDaVezProps) {
  return (
    <section aria-label="Ações da vez" className="space-y-2">
      {compra !== null && (
        <p
          role="status"
          className="rounded-lg border border-destaque bg-interno p-2 text-sm font-semibold"
        >
          {compra}
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
import type { Baralho } from '../../engine/baralho'
import { CartaNaMesa } from '../cartas/CartaNaMesa'

interface CartasDaMesaProps {
  readonly baralho: Baralho
  readonly abertasViradas: boolean
  readonly onComprarDoMonte: () => void
  readonly onComprarAberta: (indice: number) => void
}

export function CartasDaMesa({
  baralho,
  abertasViradas,
  onComprarDoMonte,
  onComprarAberta,
}: CartasDaMesaProps) {
  return (
    <section aria-label="Cartas da mesa">
      <h2 className="mb-2 text-xs font-semibold tracking-wider text-suave uppercase">
        Cartas abertas
      </h2>
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={onComprarDoMonte}
          className="flex h-24 w-16 cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-white bg-monte text-xs font-bold text-white shadow-md transition hover:-translate-y-1 focus-visible:outline-2 focus-visible:outline-destaque"
        >
          Monte
          <span className="text-sm">{baralho.monte.length}</span>
        </button>
        {baralho.abertas.map((carta, indice) => (
          <CartaNaMesa
            key={indice}
            carta={carta}
            virada={abertasViradas}
            onEscolher={() => onComprarAberta(indice)}
          />
        ))}
      </div>
    </section>
  )
}

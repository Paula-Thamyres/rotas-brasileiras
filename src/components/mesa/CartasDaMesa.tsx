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
      <h2 className="mb-2 text-xs font-semibold tracking-wider text-slate-400 uppercase">
        Cartas abertas
      </h2>
      <div className="grid grid-cols-3 gap-2">
        <button
          type="button"
          onClick={onComprarDoMonte}
          className="flex h-20 w-14 cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-white bg-slate-600 text-[10px] font-bold text-white shadow-md transition hover:-translate-y-1 focus-visible:outline-2 focus-visible:outline-amber-300"
        >
          Monte
          <span className="text-xs">{baralho.monte.length}</span>
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

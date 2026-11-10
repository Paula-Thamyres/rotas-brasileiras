import type { Carta } from '../../types/cartas'
import { agruparCartas } from '../../ui/cartas'
import { CartaNaMesa } from '../cartas/CartaNaMesa'

interface MaoDoJogadorProps {
  readonly mao: readonly Carta[]
}

export function MaoDoJogador({ mao }: MaoDoJogadorProps) {
  const grupos = agruparCartas(mao)

  return (
    <section aria-label="Sua mão">
      <h2 className="mb-2 text-xs font-semibold tracking-wider text-slate-400 uppercase">
        Sua mão
      </h2>
      {grupos.length === 0 ? (
        <p className="text-sm text-slate-400">Você não tem cartas.</p>
      ) : (
        <div className="grid grid-cols-4 gap-x-2 gap-y-3">
          {grupos.map(({ carta, quantidade }) => (
            <CartaNaMesa key={carta} carta={carta} quantidade={quantidade} />
          ))}
        </div>
      )}
    </section>
  )
}

import type { Carta } from '../../types/cartas'
import {
  corDeFundoDaCarta,
  corDoTextoSobre,
  nomeDaCarta,
} from '../../ui/cartas'

interface CartaNaMesaProps {
  readonly carta: Carta
  readonly virada?: boolean
  readonly quantidade?: number
  readonly onEscolher?: () => void
}

const FUNDO_DO_CORINGA =
  'repeating-linear-gradient(45deg, #ffffff, #ffffff 6px, #d1d5db 6px, #d1d5db 12px)'
const FUNDO_DA_CARTA_VIRADA = '#475569'

function estiloDaCarta(carta: Carta, virada: boolean) {
  if (virada) return { background: FUNDO_DA_CARTA_VIRADA, color: '#ffffff' }

  const fundo = corDeFundoDaCarta(carta)

  return fundo === null
    ? { background: FUNDO_DO_CORINGA, color: '#1f2937' }
    : { background: fundo, color: corDoTextoSobre(fundo) }
}

export function CartaNaMesa({
  carta,
  virada = false,
  quantidade,
  onEscolher,
}: CartaNaMesaProps) {
  const rotulo = virada ? 'Carta virada' : nomeDaCarta(carta)
  const conteudo = (
    <>
      <span className="px-1 text-center text-xs leading-tight font-bold">
        {virada ? '?' : rotulo}
      </span>
      {quantidade !== undefined && (
        <span className="absolute -top-2 -right-2 rounded-full bg-sombra px-1.5 text-sm font-bold text-white ring-2 ring-white">
          {quantidade}
        </span>
      )}
    </>
  )
  const classes =
    'relative flex h-24 w-16 items-center justify-center rounded-lg border-2 border-white shadow-md'

  if (onEscolher === undefined) {
    return (
      <div className={classes} style={estiloDaCarta(carta, virada)}>
        {conteudo}
      </div>
    )
  }

  return (
    <button
      type="button"
      aria-label={rotulo}
      onClick={onEscolher}
      className={`${classes} cursor-pointer transition hover:-translate-y-1 focus-visible:outline-2 focus-visible:outline-destaque`}
      style={estiloDaCarta(carta, virada)}
    >
      {conteudo}
    </button>
  )
}

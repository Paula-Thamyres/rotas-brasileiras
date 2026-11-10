import type { DescobertaDeCuriosidades } from '../../hooks/usePartida'

interface CuriosidadeDescobertaProps {
  readonly descoberta: DescobertaDeCuriosidades
  readonly onFechar: () => void
}

export function CuriosidadeDescoberta({
  descoberta,
  onFechar,
}: CuriosidadeDescobertaProps) {
  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="titulo-da-curiosidade"
      className="fixed inset-0 z-20 flex items-center justify-center bg-slate-950/80 p-4"
    >
      <div className="w-full max-w-md rounded-2xl border border-slate-600 bg-slate-800 p-6 shadow-xl">
        <h2 id="titulo-da-curiosidade" className="text-xl font-bold">
          {descoberta.nomeDoJogador} descobriu uma curiosidade
        </h2>
        <ul className="mt-4 space-y-4">
          {descoberta.curiosidades.map((curiosidade) => (
            <li key={curiosidade.cidade}>
              <p className="font-semibold">
                {curiosidade.cidade} · +{curiosidade.pontos}{' '}
                {curiosidade.pontos === 1 ? 'ponto' : 'pontos'}
              </p>
              <p className="mt-1 text-sm">{curiosidade.fato}</p>
              <a
                href={curiosidade.fonte}
                target="_blank"
                rel="noreferrer"
                className="mt-1 inline-block text-xs text-amber-300 hover:underline"
              >
                Fonte
              </a>
            </li>
          ))}
        </ul>
        <button
          type="button"
          onClick={onFechar}
          className="mt-5 w-full cursor-pointer rounded-lg bg-amber-400 px-4 py-2 font-bold text-slate-900"
        >
          Continuar
        </button>
      </div>
    </div>
  )
}

import type { DescobertaDeCuriosidades } from '../../hooks/usePartida'
import { nomeDoSite } from '../../ui/fontes'

interface CuriosidadeDescobertaProps {
  readonly descoberta: DescobertaDeCuriosidades
  readonly onFechar: () => void
}

interface FonteDaCuriosidadeProps {
  readonly endereco: string
}

function FonteDaCuriosidade({ endereco }: FonteDaCuriosidadeProps) {
  const site = nomeDoSite(endereco)

  if (site === null) {
    return <p className="mt-1 text-sm text-suave">Fonte: {endereco}</p>
  }

  return (
    <p className="mt-1 text-sm text-suave">
      Fonte:{' '}
      <a
        href={endereco}
        target="_blank"
        rel="noreferrer"
        className="font-semibold text-destaque-texto underline"
      >
        {site}
      </a>
    </p>
  )
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
      className="fixed inset-0 z-20 flex items-center justify-center bg-sombra/80 p-4"
    >
      <div className="w-full max-w-md rounded-2xl border border-borda bg-painel p-6 shadow-xl">
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
              <FonteDaCuriosidade endereco={curiosidade.fonte} />
            </li>
          ))}
        </ul>
        <button
          type="button"
          onClick={onFechar}
          className="mt-5 w-full cursor-pointer rounded-lg bg-destaque px-4 py-2 font-bold text-sobre-destaque"
        >
          Continuar
        </button>
      </div>
    </div>
  )
}

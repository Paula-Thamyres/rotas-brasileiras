interface BlocoProps {
  readonly rotulo: string
  readonly className?: string
}

function Bloco({ rotulo, className = '' }: BlocoProps) {
  return (
    <div
      className={`flex items-center justify-center rounded-md border border-borda bg-interno px-2 py-2 text-center text-xs font-semibold ${className}`}
    >
      {rotulo}
    </div>
  )
}

export function EsquemaDaTela() {
  return (
    <figure
      aria-label="Esquema da tela do jogo"
      className="mt-4 grid grid-cols-[1fr_2fr_1fr] gap-1.5"
    >
      <Bloco rotulo="Rodada · dia ou noite · evento" className="col-span-3" />
      <Bloco
        rotulo="De quem é a vez e o que fazer"
        className="col-span-3 border-destaque bg-aviso text-sobre-aviso"
      />
      <Bloco rotulo="Jogadores" className="h-24" />
      <Bloco rotulo="Mapa" className="h-24 bg-mapa-terra text-fundo" />
      <Bloco rotulo="Suas missões" className="h-24" />
      <Bloco
        rotulo="Monte e cartas abertas · Sua mão · Ações"
        className="col-span-3"
      />
    </figure>
  )
}
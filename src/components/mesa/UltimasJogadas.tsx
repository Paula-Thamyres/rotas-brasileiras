interface UltimasJogadasProps {
  readonly jogadas: readonly string[]
}

export function UltimasJogadas({ jogadas }: UltimasJogadasProps) {
  if (jogadas.length === 0) return null

  return (
    <div className="mt-2 text-sm">
      <p className="font-semibold">Últimas jogadas</p>
      <ul>
        {jogadas.map((jogada, indice) => (
          <li key={`${indice}-${jogada}`}>{jogada}</li>
        ))}
      </ul>
    </div>
  )
}
import type { KeyboardEvent } from 'react'
import { contorno, mapa } from '../../data'
import { idDaRota, type DonosDasRotas } from '../../engine/rotas'
import type { Jogador } from '../../types/jogador'
import type { Rota } from '../../types/mapa'
import { corDoJogador } from '../../ui/jogadores'
import { COR_DA_ROTA, TEMA_DIA } from './cores'
import { ALTURA_DO_MAPA, LARGURA_DO_MAPA, projetar } from './projecao'
import { posicaoDoNome } from './posicaoDoNome'
import { segmentosDaRota } from './segmentosDaRota'

const ESPESSURA_DO_CONTORNO_DA_ROTA = 10
const ESPESSURA_DA_ROTA = 7
const ESPESSURA_DA_AREA_DE_CLIQUE = 18
const RAIO_DA_CIDADE = 5
const TAMANHO_DO_NOME_DA_CIDADE = 11

const pontosDoContorno = contorno
  .map(([lon, lat]) => {
    const { x, y } = projetar({ lon, lat })
    return `${x},${y}`
  })
  .join(' ')

interface MapaProps {
  readonly donosDasRotas: DonosDasRotas
  readonly jogadores: readonly Jogador[]
  readonly onEscolherRota: (rota: Rota) => void
}

function acionarComTeclado(
  evento: KeyboardEvent<SVGGElement>,
  acao: () => void,
) {
  if (evento.key === 'Enter' || evento.key === ' ') {
    evento.preventDefault()
    acao()
  }
}

export function Mapa({ donosDasRotas, jogadores, onEscolherRota }: MapaProps) {
  function corDoDono(idDoDono: string | undefined): string | null {
    const indice = jogadores.findIndex((jogador) => jogador.id === idDoDono)

    return indice === -1 ? null : corDoJogador(indice)
  }

  return (
    <svg
      viewBox={`0 0 ${LARGURA_DO_MAPA} ${ALTURA_DO_MAPA}`}
      role="img"
      aria-label="Mapa do Brasil com as cidades e as rotas do jogo"
      className="h-auto w-full"
    >
      <rect
        width={LARGURA_DO_MAPA}
        height={ALTURA_DO_MAPA}
        fill={TEMA_DIA.fundo}
      />
      <polygon points={pontosDoContorno} fill={TEMA_DIA.terra} />

      {mapa.rotas.map((rota) => {
        const origem = projetar(mapa.cidades[rota.cidadeA])
        const destino = projetar(mapa.cidades[rota.cidadeB])
        const segmentos = segmentosDaRota(
          origem,
          destino,
          rota.espacos,
          rota.paralela,
        )
        const id = idDaRota(rota)
        const corDoDonoDaRota = corDoDono(donosDasRotas[id])
        const livre = corDoDonoDaRota === null
        const nomeDaRota = `${rota.cidadeA} a ${rota.cidadeB}, ${rota.espacos} espaços`

        return (
          <g
            key={id}
            role={livre ? 'button' : 'img'}
            tabIndex={livre ? 0 : undefined}
            aria-label={livre ? `Reivindicar ${nomeDaRota}` : nomeDaRota}
            className={
              livre
                ? 'cursor-pointer outline-none hover:brightness-125 focus-visible:brightness-125'
                : ''
            }
            onClick={livre ? () => onEscolherRota(rota) : undefined}
            onKeyDown={
              livre
                ? (evento) =>
                    acionarComTeclado(evento, () => onEscolherRota(rota))
                : undefined
            }
          >
            {segmentos.map(({ inicio, fim }, indice) => (
              <g key={indice}>
                <line
                  x1={inicio.x}
                  y1={inicio.y}
                  x2={fim.x}
                  y2={fim.y}
                  stroke={TEMA_DIA.estrada}
                  strokeWidth={ESPESSURA_DO_CONTORNO_DA_ROTA}
                />
                <line
                  x1={inicio.x}
                  y1={inicio.y}
                  x2={fim.x}
                  y2={fim.y}
                  stroke={corDoDonoDaRota ?? COR_DA_ROTA[rota.cor]}
                  strokeWidth={ESPESSURA_DA_ROTA}
                />
                {livre && (
                  <line
                    x1={inicio.x}
                    y1={inicio.y}
                    x2={fim.x}
                    y2={fim.y}
                    stroke="transparent"
                    strokeWidth={ESPESSURA_DA_AREA_DE_CLIQUE}
                  />
                )}
              </g>
            ))}
          </g>
        )
      })}

      {Object.entries(mapa.cidades).map(([nome, coordenada]) => {
        const { x, y } = projetar(coordenada)
        const { deslocamentoX, deslocamentoY, alinhamento } =
          posicaoDoNome(nome)

        return (
          <g key={nome}>
            <circle
              cx={x}
              cy={y}
              r={RAIO_DA_CIDADE}
              fill={TEMA_DIA.terra}
              stroke={TEMA_DIA.estrada}
              strokeWidth={2}
            />
            <text
              x={x + deslocamentoX}
              y={y + deslocamentoY}
              textAnchor={alinhamento}
              fontSize={TAMANHO_DO_NOME_DA_CIDADE}
              fill={TEMA_DIA.estrada}
              stroke={TEMA_DIA.terra}
              strokeWidth={3}
              paintOrder="stroke"
            >
              {nome}
            </text>
          </g>
        )
      })}
    </svg>
  )
}

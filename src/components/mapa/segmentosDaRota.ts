import type { Ponto } from './projecao'

export interface Segmento {
  inicio: Ponto
  fim: Ponto
}

const MARGEM_NAS_CIDADES = 8
const FOLGA_ENTRE_ESPACOS = 4
const DESLOCAMENTO_DA_ROTA_PARALELA = 5

function ladoDaRota(paralela: 0 | 1 | null): number {
  if (paralela === null) return 0
  return paralela === 0 ? -1 : 1
}

export function segmentosDaRota(
  origem: Ponto,
  destino: Ponto,
  espacos: number,
  paralela: 0 | 1 | null,
): Segmento[] {
  if (!Number.isInteger(espacos) || espacos < 1) {
    throw new RangeError(`Quantidade de espaços inválida: ${espacos}.`)
  }

  const dx = destino.x - origem.x
  const dy = destino.y - origem.y
  const distancia = Math.hypot(dx, dy)
  const comprimentoDoEspaco = (distancia - 2 * MARGEM_NAS_CIDADES) / espacos

  if (comprimentoDoEspaco <= FOLGA_ENTRE_ESPACOS) {
    throw new RangeError('As cidades estão próximas demais para desenhar a rota.')
  }

  const direcao = { x: dx / distancia, y: dy / distancia }
  const deslocamento = ladoDaRota(paralela) * DESLOCAMENTO_DA_ROTA_PARALELA

  function pontoNaRota(distanciaDaOrigem: number): Ponto {
    return {
      x: origem.x + direcao.x * distanciaDaOrigem - direcao.y * deslocamento,
      y: origem.y + direcao.y * distanciaDaOrigem + direcao.x * deslocamento,
    }
  }

  return Array.from({ length: espacos }, (_, indice) => {
    const inicio = MARGEM_NAS_CIDADES + indice * comprimentoDoEspaco
    return {
      inicio: pontoNaRota(inicio + FOLGA_ENTRE_ESPACOS / 2),
      fim: pontoNaRota(inicio + comprimentoDoEspaco - FOLGA_ENTRE_ESPACOS / 2),
    }
  })
}

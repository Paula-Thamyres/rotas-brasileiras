import { MAXIMO_DE_JOGADORES, MINIMO_DE_JOGADORES } from '../engine/constantes'

export const TAMANHO_MAXIMO_DO_NOME = 20

export function motivoDeNomesInvalidos(
  nomes: readonly string[],
): string | null {
  if (
    nomes.length < MINIMO_DE_JOGADORES ||
    nomes.length > MAXIMO_DE_JOGADORES
  ) {
    return `Jogue com ${MINIMO_DE_JOGADORES} a ${MAXIMO_DE_JOGADORES} pessoas.`
  }

  const limpos = nomes.map((nome) => nome.trim())

  if (limpos.some((nome) => nome === '')) {
    return 'Preencha o nome de todos os jogadores.'
  }

  if (limpos.some((nome) => nome.length > TAMANHO_MAXIMO_DO_NOME)) {
    return `Use no máximo ${TAMANHO_MAXIMO_DO_NOME} letras em cada nome.`
  }

  const normalizados = limpos.map((nome) => nome.toLowerCase())

  if (new Set(normalizados).size !== limpos.length) {
    return 'Os jogadores precisam ter nomes diferentes.'
  }

  return null
}

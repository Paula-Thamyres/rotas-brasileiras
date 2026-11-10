import type { Classificacao } from '../engine/classificacao'

function descreverPontos(quantidade: number): string {
  return `${quantidade} ${quantidade === 1 ? 'ponto' : 'pontos'}`
}

function juntarNomes(nomes: readonly string[]): string {
  if (nomes.length === 1) return nomes[0]

  return `${nomes.slice(0, -1).join(', ')} e ${nomes[nomes.length - 1]}`
}

export function vencedoresDaClassificacao(
  classificacao: readonly Classificacao[],
): Classificacao[] {
  if (classificacao.length === 0) {
    throw new RangeError('A classificação não pode estar vazia.')
  }

  const melhorPontuacao = classificacao[0].pontosFinais

  return classificacao.filter(
    ({ pontosFinais }) => pontosFinais === melhorPontuacao,
  )
}

export function mensagemDoResultado(
  classificacao: readonly Classificacao[],
): string {
  const vencedores = vencedoresDaClassificacao(classificacao)
  const nomes = vencedores.map(({ jogador }) => jogador.nome)
  const pontos = descreverPontos(vencedores[0].pontosFinais)

  return vencedores.length === 1
    ? `${nomes[0]} venceu com ${pontos}.`
    : `Empate entre ${juntarNomes(nomes)}, com ${pontos} cada.`
}

export function posicoesDaClassificacao(
  classificacao: readonly Classificacao[],
): number[] {
  return classificacao.map(
    ({ pontosFinais }) =>
      classificacao.findIndex((outra) => outra.pontosFinais === pontosFinais) +
      1,
  )
}

export function saldoComSinal(valor: number): string {
  return valor > 0 ? `+${valor}` : String(valor)
}
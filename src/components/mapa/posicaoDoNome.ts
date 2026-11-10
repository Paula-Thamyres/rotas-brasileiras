export type LadoDoNome = 'direita' | 'esquerda' | 'acima'

export interface PosicaoDoNome {
  deslocamentoX: number
  deslocamentoY: number
  alinhamento: 'start' | 'end' | 'middle'
}

const AFASTAMENTO_LATERAL = 9
const AFASTAMENTO_SUPERIOR = 10
const AJUSTE_VERTICAL_LATERAL = 4

const POSICAO_DO_LADO: Readonly<Record<LadoDoNome, PosicaoDoNome>> = {
  direita: {
    deslocamentoX: AFASTAMENTO_LATERAL,
    deslocamentoY: AJUSTE_VERTICAL_LATERAL,
    alinhamento: 'start',
  },
  esquerda: {
    deslocamentoX: -AFASTAMENTO_LATERAL,
    deslocamentoY: AJUSTE_VERTICAL_LATERAL,
    alinhamento: 'end',
  },
  acima: {
    deslocamentoX: 0,
    deslocamentoY: -AFASTAMENTO_SUPERIOR,
    alinhamento: 'middle',
  },
}

const LADO_DAS_CIDADES: Readonly<Record<string, LadoDoNome>> = {
  Brasília: 'acima',
  Barreiras: 'acima',
  Cuiabá: 'acima',
  'Belo Horizonte': 'acima',
  Palmas: 'esquerda',
  Goiânia: 'esquerda',
  Uberlândia: 'esquerda',
  'Ribeirão Preto': 'esquerda',
  'Campo Grande': 'esquerda',
  Corumbá: 'esquerda',
  Curitiba: 'esquerda',
  'Foz do Iguaçu': 'esquerda',
}

export function posicaoDoNome(cidade: string): PosicaoDoNome {
  return POSICAO_DO_LADO[LADO_DAS_CIDADES[cidade] ?? 'direita']
}

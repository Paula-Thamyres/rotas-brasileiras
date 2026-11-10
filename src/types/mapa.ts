export type CodigoCor =
  | 'AM'
  | 'CE'
  | 'PA'
  | 'CA'
  | 'MA'
  | 'PM'
  | 'LI'
  | 'SE'
  | 'GR'

export interface Coordenada {
  lon: number
  lat: number
}

export interface Rota {
  cidadeA: string
  cidadeB: string
  espacos: number
  /** null: rota única. 0 ou 1: qual das duas rotas paralelas entre as mesmas cidades. */
  paralela: 0 | 1 | null
  cor: CodigoCor
}

export interface DadosMapa {
  cidades: Record<string, Coordenada>
  rotas: Rota[]
  nomesDasCores: Record<CodigoCor, string>
}

/** Pontos [lon, lat] que desenham o contorno do Brasil. */
export type Contorno = Array<[number, number]>

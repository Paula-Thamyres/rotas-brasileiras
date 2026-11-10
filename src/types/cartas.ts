import type { CodigoCor } from './mapa'

export type CorDaCarta = Exclude<CodigoCor, 'GR'>

export type Carta = CorDaCarta | 'CORINGA'

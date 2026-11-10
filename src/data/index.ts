import contornoJson from './contorno.json'
import curiosidadesJson from './curiosidades.json'
import eventosJson from './eventos.json'
import mapaJson from './mapa.json'
import missoesJson from './missoes.json'
import type { Curiosidade } from '../types/curiosidades'
import type { Evento } from '../types/eventos'
import type { Contorno, DadosMapa } from '../types/mapa'
import type { Missao } from '../types/missoes'

export const mapa = mapaJson as DadosMapa
export const contorno = contornoJson as Contorno
export const missoes = missoesJson as Missao[]
export const curiosidades = curiosidadesJson as Curiosidade[]
export const eventos = eventosJson as Evento[]

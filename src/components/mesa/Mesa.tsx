import { useState } from 'react'
import {
  comprarCartaAberta,
  comprarCartaDoMonte,
  comprarMissoes,
  escolherMissoes,
  eventoDaPartida,
  jogadorDaVez,
  periodoDoDia,
  reivindicarRotaDaVez,
  rodadaDaPartida,
  type Partida,
} from '../../engine/partida'
import { planosDeReivindicacao } from '../../engine/planos'
import { cartasAbertasViradas, cartasPorCompra } from '../../engine/eventos'
import type {
  AcaoDaPartida,
  DescobertaDeCuriosidades,
} from '../../hooks/usePartida'
import type { Rota } from '../../types/mapa'
import { corDoJogador } from '../../ui/jogadores'
import { jogadorDoPainel } from '../../ui/participantes'
import { instrucaoDaVez } from '../../ui/vez'
import { Mapa } from '../mapa/Mapa'
import { AcoesDaVez } from './AcoesDaVez'
import { BarraDoDia } from './BarraDoDia'
import { CartasDaMesa } from './CartasDaMesa'
import { CuriosidadeDescoberta } from './CuriosidadeDescoberta'
import { EscolhaDeMissoes } from './EscolhaDeMissoes'
import { FaixaDaVez } from './FaixaDaVez'
import { MaoDoJogador } from './MaoDoJogador'
import { MissoesDoJogador } from './MissoesDoJogador'
import { PagamentoDaRota } from './PagamentoDaRota'
import { PainelDosJogadores } from './PainelDosJogadores'

interface MesaProps {
  readonly partida: Partida
  readonly aviso: string | null
  readonly descoberta: DescobertaDeCuriosidades | null
  readonly idsDosComputadores: ReadonlySet<string>
  readonly jogadaDoComputador: string | null
  readonly onExecutar: (acao: AcaoDaPartida) => void
  readonly onDispensarDescoberta: () => void
  readonly onVoltarAoInicio: () => void
}

const CLASSES_DO_PAINEL =
  'rounded-xl border border-borda bg-painel p-3 space-y-4'

const CLASSES_DA_FAIXA_DE_CARTAS =
  'flex flex-wrap items-start gap-x-8 gap-y-4 rounded-xl border border-borda bg-painel p-3'

export function Mesa({
  partida,
  aviso,
  descoberta,
  idsDosComputadores,
  jogadaDoComputador,
  onExecutar,
  onDispensarDescoberta,
  onVoltarAoInicio,
}: MesaProps) {
  const [rotaEscolhida, setRotaEscolhida] = useState<Rota | null>(null)
  const jogador = jogadorDaVez(partida)
  const vezDoComputador = idsDosComputadores.has(jogador.id)
  const dono = jogadorDoPainel(partida, idsDosComputadores)
  const evento = eventoDaPartida(partida)

  function escolherRota(rota: Rota) {
    if (vezDoComputador) return

    if (planosDeReivindicacao(partida, rota).length === 0) {
      onExecutar((atual) => reivindicarRotaDaVez(atual, { rota }))
      return
    }

    setRotaEscolhida(rota)
  }

  return (
    <div className="mx-auto flex min-h-screen max-w-[1400px] flex-col gap-3 p-3">
      <BarraDoDia
        rodada={rodadaDaPartida(partida)}
        periodo={periodoDoDia(partida)}
        evento={evento}
      />
      <FaixaDaVez
        nomeDaVez={jogador.nome}
        vezDoComputador={vezDoComputador}
        instrucao={instrucaoDaVez(
          partida.cartasCompradasNoTurno,
          cartasPorCompra(evento),
        )}
        corDoJogador={corDoJogador(partida.indiceDaVez)}
      />
      <div className="grid gap-3 min-[900px]:grid-cols-[200px_1fr_200px]">
        <aside className={CLASSES_DO_PAINEL}>
          <PainelDosJogadores
            jogadores={partida.jogadores}
            indiceDaVez={partida.indiceDaVez}
            idsDosComputadores={idsDosComputadores}
          />
        </aside>
        <main className="overflow-hidden rounded-xl border border-borda bg-painel p-2">
          <Mapa
            donosDasRotas={partida.donosDasRotas}
            jogadores={partida.jogadores}
            onEscolherRota={escolherRota}
          />
        </main>
        <aside className={CLASSES_DO_PAINEL}>
          <MissoesDoJogador missoes={dono.missoes} />
        </aside>
      </div>
      <div className={CLASSES_DA_FAIXA_DE_CARTAS}>
        <CartasDaMesa
          baralho={partida.baralho}
          abertasViradas={cartasAbertasViradas(evento)}
          onComprarDoMonte={() =>
            onExecutar((atual) => comprarCartaDoMonte(atual))
          }
          onComprarAberta={(indice) =>
            onExecutar((atual) => comprarCartaAberta(atual, indice))
          }
        />
        <MaoDoJogador mao={dono.mao} />
        <div className="w-60">
          <AcoesDaVez
            aviso={aviso}
            jogadaDoComputador={jogadaDoComputador}
            onComprarMissoes={() => onExecutar(comprarMissoes)}
          />
        </div>
      </div>
      {rotaEscolhida !== null && !vezDoComputador && (
        <PagamentoDaRota
          rota={rotaEscolhida}
          planos={planosDeReivindicacao(partida, rotaEscolhida)}
          evento={evento}
          onCancelar={() => setRotaEscolhida(null)}
          onConfirmar={(plano) => {
            onExecutar((atual) =>
              reivindicarRotaDaVez(atual, {
                rota: rotaEscolhida,
                cor: plano.cor,
                coringasUsados: plano.coringasUsados,
                cartaDoPedagio: plano.cartaDoPedagio ?? undefined,
              }),
            )
            setRotaEscolhida(null)
          }}
        />
      )}
      {partida.oferta !== null && !vezDoComputador && (
        <EscolhaDeMissoes
          key={partida.oferta.missoes.map((missao) => missao.nome).join('|')}
          nomeDoJogador={jogador.nome}
          oferta={partida.oferta}
          onVoltarAoInicio={onVoltarAoInicio}
          onConfirmar={(nomes) =>
            onExecutar((atual) => escolherMissoes(atual, nomes))
          }
        />
      )}
      {descoberta !== null && (
        <CuriosidadeDescoberta
          descoberta={descoberta}
          onFechar={onDispensarDescoberta}
        />
      )}
    </div>
  )
}

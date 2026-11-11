import { TelaInicial } from './components/inicio/TelaInicial'
import { Mesa } from './components/mesa/Mesa'
import { periodoDoDia } from './engine/partida'
import { usePartida } from './hooks/usePartida'

function App() {
  const {
    partida,
    aviso,
    descoberta,
    idsDosComputadores,
    jogadasDosComputadores,
    avisoDaJogadaAberto,
    compraDaVez,
    iniciar,
    executar,
    dispensarDescoberta,
    dispensarAvisoDaJogada,
    reiniciar,
  } = usePartida()

  const periodo = partida === null ? 'NOITE' : periodoDoDia(partida)

  return (
    <div data-periodo={periodo} className="min-h-screen bg-fundo text-texto">
      {partida === null ? (
        <TelaInicial onIniciar={iniciar} />
      ) : (
        <Mesa
          partida={partida}
          aviso={aviso}
          descoberta={descoberta}
          idsDosComputadores={idsDosComputadores}
          jogadasDosComputadores={jogadasDosComputadores}
          avisoDaJogadaAberto={avisoDaJogadaAberto}
          compraDaVez={compraDaVez}
          onExecutar={executar}
          onDispensarDescoberta={dispensarDescoberta}
          onDispensarAvisoDaJogada={dispensarAvisoDaJogada}
          onVoltarAoInicio={reiniciar}
        />
      )}
    </div>
  )
}

export default App
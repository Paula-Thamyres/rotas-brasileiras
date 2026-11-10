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
    jogadaDoComputador,
    iniciar,
    executar,
    dispensarDescoberta,
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
          jogadaDoComputador={jogadaDoComputador}
          onExecutar={executar}
          onDispensarDescoberta={dispensarDescoberta}
          onVoltarAoInicio={reiniciar}
        />
      )}
    </div>
  )
}

export default App

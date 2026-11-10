import { TelaInicial } from './components/inicio/TelaInicial'
import { Mesa } from './components/mesa/Mesa'
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

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100">
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

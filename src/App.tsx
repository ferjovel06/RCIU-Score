import { useState } from 'react';
import { AboutScore } from './components/AboutScore';
import { AppHeader } from './components/AppHeader';
import { FactorSelector } from './components/FactorSelector';
import { ResultsPanel } from './components/ResultsPanel';
import { UpdateNotice } from './components/UpdateNotice';
import { useCalculatorTool } from './hooks/useCalculatorTool';
import { usePwaStatus } from './hooks/usePwaStatus';
import { calculateExtendedScore, type FactorId } from './score';

export function App() {
  const [selected, setSelected] = useState<FactorId[]>([]);
  const [smoking, setSmoking] = useState(false);
  const { needRefresh, updateServiceWorker } = usePwaStatus();

  useCalculatorTool(setSelected, setSmoking);

  const extendedScore = calculateExtendedScore(selected, smoking);

  function toggleFactor(id: FactorId, checked: boolean) {
    setSelected(current => checked ? [...current, id] : current.filter(item => item !== id));
  }

  function resetCalculator() {
    setSelected([]);
    setSmoking(false);
  }

  return <main className="shell">
    <article className="calculator">
      <AppHeader />
      <div className="workspace">
        <FactorSelector
          selected={selected}
          smoking={smoking}
          onFactorChange={toggleFactor}
          onSmokingChange={setSmoking}
        />
        <ResultsPanel score={extendedScore} onReset={resetCalculator} />
      </div>
      <AboutScore />
      <footer>Calculadora de referencia para investigación. No sustituye el juicio clínico ni establece recomendaciones de manejo.</footer>
      <UpdateNotice visible={needRefresh} onUpdate={() => void updateServiceWorker(true)} />
    </article>
    <p className="bottom-note">ARAGON-FGR <span>·</span> Prototipo de investigación</p>
  </main>;
}

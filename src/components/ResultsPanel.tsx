import type { calculateExtendedScore } from '../score';
import { GrowthGraphic } from './GrowthGraphic';
import { ScoreRanges } from './ScoreRanges';

interface ResultsPanelProps {
  score: ReturnType<typeof calculateExtendedScore>;
  onReset: () => void;
}

export function ResultsPanel({ score, onReset }: ResultsPanelProps) {
  const result = score.original;

  return <aside className="results-column">
    <GrowthGraphic total={score.total} original={result.total} smokingPoints={score.smokingPoints} />
    <section className={`result ${result.level}`} aria-label="Resultado del score" aria-live="polite" aria-atomic="true">
      <div className="result-top">
        <p className="eyebrow">RESULTADO</p>
        <span>0–14 puntos</span>
      </div>
      <div className="numbers">
        <div>
          <p>Total ampliado</p>
          <div className="score-number">{String(score.total).padStart(2, '0')}<span>/14</span></div>
        </div>
        <div className="probability">
          <p>Tabla original<br />(sin tabaquismo)</p>
          <strong>{result.probability}</strong>
        </div>
      </div>
      <div className="meter" aria-hidden="true">{Array.from({ length: 14 }, (_, index) =>
        <span key={index} className={index < score.total ? 'filled' : ''} />)}
      </div>
      <p className="original-label">Modelo original: {result.total}/13 puntos · sin tabaquismo</p>
      <div className="classification">
        <span aria-hidden="true">{result.level === 'low' ? '✓' : '!'}</span>
        {result.label}
      </div>
      <p className="result-copy">{result.total === 0
        ? 'No se han seleccionado factores del score. Un puntaje de cero no descarta RCIU.'
        : 'Clasificación del puntaje según la tabla 3 del documento ARAGON-FGR.'}</p>
      {result.tableClassification &&
        <p className="table-note">La tabla 4 denomina «muy alto» al rango de 10–13 puntos.</p>}
      <p className="probability-note">El total ampliado no tiene una probabilidad ni una clasificación de riesgo establecidas. El porcentaje y la categoría mostrados corresponden exclusivamente al score original (tabla 4 y tabla 3).</p>
    </section>
    <button className="reset" onClick={onReset}>
      <span aria-hidden="true">↺</span>
      Reiniciar calculadora
    </button>
    <ScoreRanges />
  </aside>;
}

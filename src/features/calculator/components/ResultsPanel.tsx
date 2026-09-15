import type { RiskBand } from '../types/scoreModel.types';
import type { ScoreResult } from '../utils/calculateScore';
import { GrowthGraphic } from './GrowthGraphic';
import { ScoreRanges } from './ScoreRanges';

interface ResultsPanelProps {
  score: ScoreResult;
  riskBands: RiskBand[];
  unknownCount: number;
  submissionStatus:
    | 'idle'
    | 'submitting'
    | 'success'
    | 'error';
  submissionMessage?: string;
  onSubmit: () => void;
  onReset: () => void;
}

export function ResultsPanel({
  score,
  riskBands,
  unknownCount,
  submissionStatus,
  submissionMessage,
  onSubmit,
  onReset,
}: ResultsPanelProps) {
  return (
    <aside className="results-column">
      <GrowthGraphic
        extendedTotal={score.extendedTotal}
        extendedMaximum={score.extendedMaximum}
        originalTotal={score.originalTotal}
        originalMaximum={score.originalMaximum}
        additionalTotal={score.additionalTotal}
      />

      <section
        className={`result ${score.riskLevel}`}
        aria-label="Resultado del score"
        aria-live="polite"
        aria-atomic="true"
      >
        <div className="result-top">
          <p className="eyebrow">RESULTADO</p>

          <span>
            0–{score.extendedMaximum} puntos
          </span>
        </div>

        <div className="numbers">
          <div>
            <p>Total ampliado</p>

            <div className="score-number">
              {String(score.extendedTotal).padStart(
                2,
                '0',
              )}

              <span>
                /{score.extendedMaximum}
              </span>
            </div>
          </div>

          <div className="probability">
            <p>
              Tabla original
              <br />
              (sin factores adicionales)
            </p>

            <strong>
              {score.probabilityLabel}
            </strong>
          </div>
        </div>

        <div className="meter" aria-hidden="true">
          {Array.from(
            { length: score.extendedMaximum },
            (_, index) => (
              <span
                key={index}
                className={
                  index < score.extendedTotal
                    ? 'filled'
                    : ''
                }
              />
            ),
          )}
        </div>

        <p className="original-label">
          Modelo original: {score.originalTotal}/
          {score.originalMaximum} puntos
        </p>

        <div className="classification">
          <span aria-hidden="true">
            {score.riskLevel === 'low'
              ? '✓'
              : '!'}
          </span>

          {score.riskLabel}
        </div>

        <p className="result-copy">
          {score.originalTotal === 0
            ? 'No hay factores presentes en el score original. Un puntaje de cero no descarta RCIU.'
            : 'Clasificación correspondiente al puntaje del modelo original.'}
        </p>

        {score.tableClassification && (
          <p className="table-note">
            Clasificación en la tabla de
            referencia:{' '}
            {score.tableClassification}
          </p>
        )}

        {unknownCount > 0 && (
          <p>
            Resultado preliminar: quedan{' '}
            {unknownCount} respuestas desconocidas.
          </p>
        )}

        <p className="probability-note">
          El porcentaje y la categoría mostrados
          corresponden al score original. Los
          factores adicionales aumentan el total
          ampliado, pero no modifican esa estimación.
        </p>
      </section>

      <button
        type="button"
        className="submit-assessment"
        disabled={
          submissionStatus === 'submitting' ||
          submissionStatus === 'success'
        }
        onClick={onSubmit}
      >
        {submissionStatus === 'submitting'
          ? 'Guardando evaluación...'
          : submissionStatus === 'success'
          ? 'Evaluación guardada'
          : 'Guardar evaluación'}
      </button>

      {submissionStatus === 'success' && (
        <p
          className="submission-status success"
          role="status"
        >
          La evaluación y su resultado fueron guardados.
        </p>
      )}

      {submissionStatus === 'error' && (
        <p
          className="submission-status error"
          role="alert"
        >
          {submissionMessage}
        </p>
      )}

      <button
        type="button"
        className="reset"
        onClick={onReset}
      >
        <span aria-hidden="true">↺</span>
        Reiniciar calculadora
      </button>

      <ScoreRanges bands={riskBands} />
    </aside>
  );
}

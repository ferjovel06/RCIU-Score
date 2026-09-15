import type {
  AssessmentAnswers,
  AssessmentResponse,
} from '../types/assessment.types';

import type {
  FactorCode,
  ScoreFactor,
} from '../types/scoreModel.types';

interface FactorSelectorProps {
  factors: ScoreFactor[];
  answers: AssessmentAnswers;
  onAnswerChange: (
    factorCode: FactorCode,
    response: AssessmentResponse,
  ) => void;
}

export function FactorSelector({
  factors,
  answers,
  onAnswerChange,
}: FactorSelectorProps) {
  const originalFactors = factors.filter(
    factor => factor.source === 'original',
  );

  const additionalFactors = factors.filter(
    factor => factor.source === 'literature',
  );

  const answeredCount = originalFactors.filter(
    factor =>
      answers[factor.code] !== 'unknown',
  ).length;

  function renderFactor(factor: ScoreFactor) {
    const response = answers[factor.code];

    return (
      <div
        className={`factor ${response === 'yes' ? 'selected' : ''
          }`}
        key={factor.id}
      >
        <fieldset>
          <legend>{factor.label}</legend>

          <label>
            <input
              type="radio"
              name={factor.code}
              value="yes"
              checked={response === 'yes'}
              onChange={() =>
                onAnswerChange(factor.code, 'yes')
              }
            />
            Sí
          </label>

          <label>
            <input
              type="radio"
              name={factor.code}
              value="no"
              checked={response === 'no'}
              onChange={() =>
                onAnswerChange(factor.code, 'no')
              }
            />
            No
          </label>

          <label>
            <input
              type="radio"
              name={factor.code}
              value="unknown"
              checked={response === 'unknown'}
              onChange={() =>
                onAnswerChange(
                  factor.code,
                  'unknown',
                )
              }
            />
            Desconocido
          </label>
        </fieldset>

        <strong>+{factor.points}</strong>
      </div>
    );
  }

  return (
    <section
      className="inputs"
      aria-labelledby="factors-title"
    >
      <div className="section-heading">
        <h2 id="factors-title">
          Factores maternos
        </h2>

        <span>
          {answeredCount} de {originalFactors.length}
        </span>
      </div>

      <p className="instruction">
        Selecciona la respuesta para cada factor.
      </p>

      <div className="factor-list">
        {originalFactors.map(renderFactor)}
      </div>

      {additionalFactors.length > 0 && (
        <div className="additional">
          <h2>Factores adicionales</h2>

          <p>
            No incluidos en el score original.
          </p>

          <div className="factor-list">
            {additionalFactors.map(renderFactor)}
          </div>
        </div>
      )}
    </section>
  );
}

import type { ScoreModelDefinition } from '../types/scoreModel.types';
import type { AssessmentAnswers } from '../types/assessment.types';

export interface ScoreResult {
  originalTotal: number;
  additionalTotal: number;
  extendedTotal: number;
  originalMaximum: number;
  extendedMaximum: number;
  probabilityLabel: string;
  riskLevel: string;
  riskLabel: string;
  tableClassification: string | null;
}

export function calculateScore(
  model: ScoreModelDefinition,
  answers: AssessmentAnswers,
): ScoreResult {
  const originalFactors = model.factors.filter(
    factor => factor.source === 'original',
  );

  const additionalFactors = model.factors.filter(
    factor => factor.source === 'literature',
  );

  const originalTotal = originalFactors.reduce(
    (total, factor) =>
      total +
      (answers[factor.code] === 'yes'
        ? factor.points
        : 0),
    0,
  );

  const additionalTotal = additionalFactors.reduce(
    (total, factor) =>
      total +
      (answers[factor.code] === 'yes'
        ? factor.points
        : 0),
    0,
  );

  const extendedTotal =
    originalTotal + additionalTotal;

  const probability =
    model.probabilityReferences.find(
      reference =>
        reference.score === originalTotal,
    );

  const riskBand = model.riskBands.find(
    band =>
      originalTotal >= band.minimumScore &&
      originalTotal <= band.maximumScore,
  );

  if (!probability || !riskBand) {
    throw new Error(
      'Score model definition is incomplete',
    );
  }

  return {
    originalTotal,
    additionalTotal,
    extendedTotal,
    originalMaximum: model.originalMaximum,
    extendedMaximum: model.extendedMaximum,
    probabilityLabel: probability.probabilityLabel,
    riskLevel: riskBand.riskLevel,
    riskLabel: riskBand.label,
    tableClassification:
      riskBand.tableClassification,
  };
}

export function scoreToGraphicY(
  total: number,
  maximum: number,
): number {
  if (
    !Number.isFinite(total) ||
    !Number.isFinite(maximum) ||
    maximum <= 0 ||
    total < 0 ||
    total > maximum
  ) {
    throw new Error('Score outside valid range');
  }

  return 59 + (total / maximum) * 99;
}

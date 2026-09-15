import { test } from 'node:test';
import assert from 'node:assert/strict';
import type { AssessmentAnswers } from '../src/features/calculator/types/assessment.types.ts';
import {
  calculateScore,
  scoreToGraphicY,
} from '../src/features/calculator/utils/calculateScore.ts';
import { scoreModel } from './fixtures/scoreModel.ts';

const originalFactors = scoreModel.factors.filter(
  factor => factor.source === 'original',
);

function answersForMask(mask: number): AssessmentAnswers {
  return Object.fromEntries(
    scoreModel.factors.map((factor, index) => [
      factor.code,
      index < originalFactors.length && mask & (1 << index)
        ? 'yes'
        : 'no',
    ]),
  );
}

test('all 128 original-factor combinations follow the dynamic model', () => {
  const seen = new Set<number>();

  for (let mask = 0; mask < 128; mask++) {
    const answers = answersForMask(mask);
    const expected = originalFactors.reduce(
      (total, factor, index) =>
        total + (mask & (1 << index) ? factor.points : 0),
      0,
    );
    const result = calculateScore(scoreModel, answers);

    seen.add(result.originalTotal);
    assert.equal(result.originalTotal, expected);
    assert.equal(
      result.probabilityLabel,
      scoreModel.probabilityReferences[expected].probabilityLabel,
    );
    assert.equal(
      result.riskLevel,
      expected <= 2 ? 'low' : expected <= 5 ? 'moderate' : 'high',
    );
    assert.equal(
      result.tableClassification,
      expected >= 10 ? 'Muy alto' : null,
    );
  }

  assert.equal(seen.size, 14);
});

test('literature factors affect only the extended total', () => {
  const answers = answersForMask(0);
  answers.smoking = 'yes';

  const result = calculateScore(scoreModel, answers);

  assert.equal(result.originalTotal, 0);
  assert.equal(result.additionalTotal, 1);
  assert.equal(result.extendedTotal, 1);
  assert.equal(result.probabilityLabel, '~3 %');
});

test('graphic marker moves continuously across the model range', () => {
  assert.equal(scoreToGraphicY(0, 14), 59);
  assert.equal(scoreToGraphicY(7, 14), 108.5);
  assert.equal(scoreToGraphicY(14, 14), 158);

  for (let score = 1; score <= 14; score++) {
    assert.ok(
      scoreToGraphicY(score, 14) >
        scoreToGraphicY(score - 1, 14),
    );
  }

  assert.throws(
    () => scoreToGraphicY(-1, 14),
    /outside valid range/,
  );
  assert.throws(
    () => scoreToGraphicY(15, 14),
    /outside valid range/,
  );
});

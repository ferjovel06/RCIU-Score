import { test } from 'node:test';
import assert from 'node:assert/strict';
import { calculateScore } from '../src/score.ts';

const clinicalCases = [
  ['aborto', 3], ['rciu', 2], ['cesarea', 1], ['saf', 3], ['lupus', 1], ['preeclampsia', 2], ['neumopatia', 1],
] as const;
const expectedProbability = ['~3 %','~5 %','~8 %','~15 %','~22 %','~30 %','~40 %','~52 %','~65 %','~75 %','>85 %','>85 %','>85 %','>85 %'];
test('all 128 combinations follow source weights, thresholds and probability table', () => {
  const seen = new Set<number>();
  for (let mask = 0; mask < 128; mask++) {
    const present = clinicalCases.filter((_, index) => mask & (1 << index));
    const expected = present.reduce((sum, [, weight]) => sum + weight, 0);
    const result = calculateScore(present.map(([id]) => id));
    seen.add(result.total);
    assert.equal(result.total, expected);
    assert.equal(result.probability, expectedProbability[expected]);
    assert.equal(result.level, expected <= 2 ? 'low' : expected <= 5 ? 'moderate' : 'high');
    assert.equal(result.tableClassification, expected >= 10 ? 'Muy alto' : null);
  }
  assert.equal(seen.size, 14);
});
test('pilot PDF example: abortion, preeclampsia and chronic lung disease', () => {
  const result = calculateScore(['aborto','preeclampsia','neumopatia']);
  assert.equal(result.total, 6);
  assert.equal(result.label, 'Riesgo alto');
  assert.equal(result.probability, '~40 %');
});
test('duplicate factors cannot inflate the score', () => assert.equal(calculateScore(['aborto','aborto']).total, 3));
test('unknown factors including smoking cannot enter the core score', () => {
  assert.throws(() => calculateScore(['smoking']), /no reconocido/);
});

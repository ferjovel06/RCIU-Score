import { test } from 'node:test';
import assert from 'node:assert/strict';
import type { AssessmentAnswers } from '../src/features/calculator/types/assessment.types.ts';
import { buildAssessmentSubmission } from '../src/features/calculator/utils/buildAssessmentSubmission.ts';
import { parseAssessmentResult } from '../src/features/calculator/utils/parseAssessmentResult.ts';
import { scoreModel } from './fixtures/scoreModel.ts';

const answers: AssessmentAnswers = {
  aborto: 'yes',
  rciu: 'no',
  cesarea: 'unknown',
  saf: 'no',
  lupus: 'no',
  preeclampsia: 'yes',
  neumopatia: 'unknown',
  smoking: 'yes',
};

test('builds a complete submission without client-calculated results', () => {
  const submission = buildAssessmentSubmission({
    model: scoreModel,
    answers,
    assessmentId: 'assessment-id',
    clientCreatedAt: '2026-09-14T00:00:00.000Z',
  });

  assert.equal(submission.assessmentId, 'assessment-id');
  assert.equal(submission.modelId, scoreModel.id);
  assert.equal(submission.modelCode, 'ARAGON_FGR');
  assert.equal(submission.modelVersion, '0.2');
  assert.equal(
    submission.definitionChecksum,
    scoreModel.definitionChecksum,
  );
  assert.equal(submission.answers.length, 8);
  assert.equal('result' in submission, false);
  assert.equal('total' in submission, false);
});

test('serializes one answer per factor in model order', () => {
  const submission = buildAssessmentSubmission({
    model: scoreModel,
    answers,
  });

  assert.deepEqual(
    submission.answers.map(answer => answer.factorCode),
    scoreModel.factors.map(factor => factor.code),
  );
  assert.equal(
    submission.answers.find(answer => answer.factorCode === 'aborto')
      ?.response,
    'yes',
  );
  assert.equal(
    submission.answers.find(answer => answer.factorCode === 'smoking')
      ?.response,
    'yes',
  );
});

test('validates the authoritative assessment result response', () => {
  const result = parseAssessmentResult({
    assessmentId: 'assessment-id',
    originalTotal: 5,
    additionalTotal: 1,
    extendedTotal: 6,
    originalRiskLevel: 'moderate',
    originalRiskLabel: 'Riesgo moderado',
    originalProbabilityLabel: '~30 %',
    tableClassification: null,
    calculatedAt: '2026-09-14T00:00:00.000Z',
  });

  assert.equal(result.extendedTotal, 6);
  assert.equal(result.tableClassification, null);

  assert.throws(
    () => parseAssessmentResult({
      ...result,
      originalTotal: '5',
    }),
    /originalTotal must be an integer/,
  );
});

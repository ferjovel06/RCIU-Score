import { test } from 'node:test';
import assert from 'node:assert/strict';
import { buildAssessmentSubmission } from '../src/models/assessment.ts';

test('builds a complete, versioned submission without client-calculated results', () => {
  const submission = buildAssessmentSubmission({
    selected: ['aborto', 'preeclampsia'],
    smoking: true,
    assessmentId: '018f47de-6d6a-7d22-a95a-aea4e7c02011',
    clientCreatedAt: '2026-09-13T12:00:00.000Z',
  });

  assert.equal(submission.modelCode, 'ARAGON_FGR');
  assert.equal(submission.modelVersion, '0.2');
  assert.equal(submission.answers.length, 8);
  assert.deepEqual(submission.answers.map(answer => answer.factorCode), [
    'aborto',
    'rciu',
    'cesarea',
    'saf',
    'lupus',
    'preeclampsia',
    'neumopatia',
    'smoking',
  ]);
  assert.equal(submission.answers.find(answer => answer.factorCode === 'aborto')?.response, 'yes');
  assert.equal(submission.answers.find(answer => answer.factorCode === 'rciu')?.response, 'no');
  assert.equal(submission.answers.find(answer => answer.factorCode === 'smoking')?.response, 'yes');
  assert.equal('result' in submission, false);
  assert.equal('total' in submission, false);
});

test('duplicate selected factors still produce one answer per factor', () => {
  const submission = buildAssessmentSubmission({
    selected: ['aborto', 'aborto'],
    smoking: false,
    assessmentId: '018f47de-6d6a-7d22-a95a-aea4e7c02012',
  });

  assert.equal(submission.answers.filter(answer => answer.factorCode === 'aborto').length, 1);
  assert.equal(submission.answers.find(answer => answer.factorCode === 'smoking')?.response, 'no');
});

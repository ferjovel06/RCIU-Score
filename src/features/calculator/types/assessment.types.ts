import type { FactorCode } from './scoreModel.types';

export type AssessmentResponse =
  | 'yes'
  | 'no'
  | 'unknown';

export type AssessmentAnswers = Record<
  FactorCode,
  AssessmentResponse
>;

export interface AssessmentAnswerSubmission {
  factorCode: FactorCode;
  response: AssessmentResponse;
}

export interface CreateAssessmentSubmission {
  assessmentId: string;
  modelId: string;
  modelCode: string;
  modelVersion: string;
  definitionChecksum: string;
  clientCreatedAt: string;
  answers: AssessmentAnswerSubmission[];
}

export interface AssessmentResult {
  assessmentId: string;
  originalTotal: number;
  additionalTotal: number;
  extendedTotal: number;
  originalRiskLevel: string;
  originalRiskLabel: string;
  originalProbabilityLabel: string;
  tableClassification: string | null;
  calculatedAt: string;
}


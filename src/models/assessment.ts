import {
  SCORE_MODEL_CODE,
  SCORE_MODEL_VERSION,
  factors,
  type FactorId,
} from '../score.ts';

export const additionalFactorId = 'smoking' as const;

export type AssessmentFactorId = FactorId | typeof additionalFactorId;
export type AssessmentResponse = 'yes' | 'no' | 'unknown';

export interface AssessmentAnswerSubmission {
  factorCode: AssessmentFactorId;
  response: AssessmentResponse;
}

export interface CreateAssessmentSubmission {
  assessmentId: string;
  modelCode: typeof SCORE_MODEL_CODE;
  modelVersion: typeof SCORE_MODEL_VERSION;
  clientCreatedAt: string;
  answers: AssessmentAnswerSubmission[];
}

export interface AssessmentResult {
  assessmentId: string;
  originalTotal: number;
  additionalTotal: number;
  extendedTotal: number;
  originalRiskLevel: 'low' | 'moderate' | 'high';
  originalRiskLabel: string;
  originalProbabilityLabel: string;
  tableClassification: string | null;
  calculatedAt: string;
}

interface BuildAssessmentSubmissionOptions {
  selected: readonly FactorId[];
  smoking: boolean;
  assessmentId?: string;
  clientCreatedAt?: string;
}

export function buildAssessmentSubmission({
  selected,
  smoking,
  assessmentId = globalThis.crypto.randomUUID(),
  clientCreatedAt = new Date().toISOString(),
}: BuildAssessmentSubmissionOptions): CreateAssessmentSubmission {
  const selectedFactors = new Set(selected);

  return {
    assessmentId,
    modelCode: SCORE_MODEL_CODE,
    modelVersion: SCORE_MODEL_VERSION,
    clientCreatedAt,
    answers: [
      ...factors.map(factor => ({
        factorCode: factor.id,
        response: selectedFactors.has(factor.id) ? 'yes' as const : 'no' as const,
      })),
      {
        factorCode: additionalFactorId,
        response: smoking ? 'yes' : 'no',
      },
    ],
  };
}

import type {
  AssessmentAnswers,
  CreateAssessmentSubmission,
} from '../types/assessment.types';
import type { ScoreModelDefinition } from '../types/scoreModel.types';

interface BuildAssessmentSubmissionOptions {
  model: ScoreModelDefinition;
  answers: AssessmentAnswers;
  assessmentId?: string;
  clientCreatedAt?: string;
}

export function buildAssessmentSubmission({
  model,
  answers,
  assessmentId = globalThis.crypto.randomUUID(),
  clientCreatedAt = new Date().toISOString(),
}: BuildAssessmentSubmissionOptions): CreateAssessmentSubmission {
  return {
    assessmentId,
    modelId: model.id,
    modelCode: model.code,
    modelVersion: model.version,
    definitionChecksum: model.definitionChecksum,
    clientCreatedAt,
    answers: model.factors.map(factor => ({
      factorCode: factor.code,
      response: answers[factor.code],
    })),
  };
}

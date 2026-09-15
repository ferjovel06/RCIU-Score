import { env } from '@/core/config/env';
import type {
  AssessmentResult,
  CreateAssessmentSubmission,
} from '../types/assessment.types';
import { isObject } from '../utils/runtimeValidation';
import { parseAssessmentResult } from '../utils/parseAssessmentResult';

export async function submitAssessment(
  submission: CreateAssessmentSubmission,
  signal?: AbortSignal,
): Promise<AssessmentResult> {
  const response = await fetch(
    `${env.supabaseUrl}/functions/v1/submit-assessment`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(submission),
      signal,
    },
  );

  let data: unknown;

  try {
    data = await response.json();
  } catch {
    throw new Error(
      `Could not submit assessment: HTTP ${response.status}`,
    );
  }

  if (!response.ok) {
    const message =
      isObject(data) && typeof data.error === 'string'
        ? data.error
        : `HTTP ${response.status}`;

    throw new Error(
      `Could not submit assessment: ${message}`,
    );
  }

  return parseAssessmentResult(data);
}

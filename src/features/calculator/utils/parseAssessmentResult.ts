import type { AssessmentResult } from '../types/assessment.types';
import {
  isObject,
  readInteger,
  readNullableString,
  readString,
} from './runtimeValidation.ts';

export function parseAssessmentResult(
  value: unknown,
): AssessmentResult {
  if (!isObject(value)) {
    throw new Error(
      'Assessment result must be an object',
    );
  }

  return {
    assessmentId: readString(value, 'assessmentId'),
    originalTotal: readInteger(value, 'originalTotal'),
    additionalTotal: readInteger(value, 'additionalTotal'),
    extendedTotal: readInteger(value, 'extendedTotal'),
    originalRiskLevel: readString(
      value,
      'originalRiskLevel',
    ),
    originalRiskLabel: readString(
      value,
      'originalRiskLabel',
    ),
    originalProbabilityLabel: readString(
      value,
      'originalProbabilityLabel',
    ),
    tableClassification: readNullableString(
      value,
      'tableClassification',
    ),
    calculatedAt: readString(value, 'calculatedAt'),
  };
}

import { useEffect, useRef, useState } from 'react';
import { submitAssessment } from '../services/assessmentApi';
import type {
  AssessmentAnswers,
  AssessmentResult,
} from '../types/assessment.types';
import type { ScoreModelDefinition } from '../types/scoreModel.types';
import { buildAssessmentSubmission } from '../utils/buildAssessmentSubmission';

type SubmissionState =
  | { status: 'idle' }
  | { status: 'submitting' }
  | { status: 'success'; result: AssessmentResult }
  | { status: 'error'; message: string };

export function useAssessmentSubmission() {
  const [state, setState] = useState<SubmissionState>({
    status: 'idle',
  });
  const controllerRef = useRef<AbortController | null>(null);

  useEffect(() => {
    return () => controllerRef.current?.abort();
  }, []);

  async function submit(
    model: ScoreModelDefinition,
    answers: AssessmentAnswers,
    assessmentId: string,
  ) {
    controllerRef.current?.abort();
    const controller = new AbortController();
    controllerRef.current = controller;
    setState({ status: 'submitting' });

    try {
      const result = await submitAssessment(
        buildAssessmentSubmission({
          model,
          answers,
          assessmentId,
        }),
        controller.signal,
      );

      if (!controller.signal.aborted) {
        setState({ status: 'success', result });
      }
    } catch (error) {
      if (!controller.signal.aborted) {
        setState({
          status: 'error',
          message:
            error instanceof Error
              ? error.message
              : 'Unknown submission error',
        });
      }
    }
  }

  function reset() {
    controllerRef.current?.abort();
    controllerRef.current = null;
    setState({ status: 'idle' });
  }

  return {
    ...state,
    submit,
    reset,
  };
}

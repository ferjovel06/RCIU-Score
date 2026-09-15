import { UpdateNotice } from '@/shared/components/feedback/UpdateNotice';
import { usePwaStatus } from '@/shared/hooks/usePwaStatus';
import { AboutScore } from '../components/AboutScore';
import { AppHeader } from '../components/AppHeader';
import { FactorSelector } from '../components/FactorSelector';
import { ResultsPanel } from '../components/ResultsPanel';
import { useAssessmentForm } from '../hooks/useAssessmentForm';
import { useAssessmentSubmission } from '../hooks/useAssessmentSubmission';
import { useScoreModel } from '../hooks/useScoreModel';
import type {
  AssessmentResponse,
} from '../types/assessment.types';
import type {
  FactorCode,
  ScoreModelDefinition,
} from '../types/scoreModel.types';
import { calculateScore } from '../utils/calculateScore';

export function CalculatorPage() {
  const modelState = useScoreModel();

  if (modelState.status === 'loading') {
    return (
      <main className="shell">
        <p>Cargando modelo del score...</p>
      </main>
    );
  }

  if (modelState.status === 'error') {
    return (
      <main className="shell">
        <p>
          No se pudo cargar el modelo:{' '}
          {modelState.message}
        </p>
      </main>
    );
  }

  return (
    <Calculator
      key={modelState.model.definitionChecksum}
      model={modelState.model}
    />
  );
}

interface CalculatorProps {
  model: ScoreModelDefinition;
}

function Calculator({
  model,
}: CalculatorProps) {
  const assessment = useAssessmentForm(model);
  const submission = useAssessmentSubmission();

  const score = calculateScore(
    model,
    assessment.answers,
  );

  const {
    needRefresh,
    updateServiceWorker,
  } = usePwaStatus();

  function handleAnswerChange(
    factorCode: FactorCode,
    response: AssessmentResponse,
  ) {
    submission.reset();
    assessment.setAnswer(factorCode, response);
  }

  function handleReset() {
    submission.reset();
    assessment.resetAssessment();
  }

  function handleSubmit() {
    void submission.submit(
      model,
      assessment.answers,
      assessment.assessmentId,
    );
  }

  return (
    <main className="shell">
      <article className="calculator">
        <AppHeader />

        <div className="workspace">
          <FactorSelector
            factors={model.factors}
            answers={assessment.answers}
            onAnswerChange={handleAnswerChange}
          />

          <ResultsPanel
            score={score}
            riskBands={model.riskBands}
            unknownCount={assessment.unknownCount}
            submissionStatus={submission.status}
            submissionMessage={
              submission.status === 'error'
                ? submission.message
                : undefined
            }
            onSubmit={handleSubmit}
            onReset={handleReset}
          />
        </div>

        <AboutScore model={model} />

        <footer>
          Calculadora de referencia para
          investigación. No sustituye el juicio
          clínico ni establece recomendaciones de
          manejo.
        </footer>

        <UpdateNotice
          visible={needRefresh}
          onUpdate={() =>
            void updateServiceWorker(true)
          }
        />
      </article>

      <p className="bottom-note">
        {model.code}
        <span>·</span>
        Versión {model.version}
      </p>
    </main>
  );
}

import { useState } from 'react';
import type {
    FactorCode,
    ScoreModelDefinition,
} from '../types/scoreModel.types';
import type {
    AssessmentAnswers,
    AssessmentResponse,
} from '../types/assessment.types';

function createInitialAnswers(
    model: ScoreModelDefinition,
): AssessmentAnswers {
    return Object.fromEntries(
        model.factors.map(factor => [
            factor.code,
            'unknown',
        ]),
    ) as AssessmentAnswers;
}

export function useAssessmentForm(
    model: ScoreModelDefinition,
) {
    const [answers, setAnswers] = useState(
        () => createInitialAnswers(model),
    );

    const [assessmentId, setAssessmentId] = useState(
        () => crypto.randomUUID(),
    );

    const unknownCount = Object.values(answers)
        .filter(
            response => response === 'unknown',
        )
        .length;

    function setAnswer(
        factorCode: FactorCode,
        response: AssessmentResponse,
    ) {
        setAnswers(current => ({
            ...current,
            [factorCode]: response,
        }));
        setAssessmentId(crypto.randomUUID());
    }

    function resetAssessment() {
        setAnswers(createInitialAnswers(model));
        setAssessmentId(crypto.randomUUID());
    }

    return {
        answers,
        unknownCount,
        assessmentId,
        setAnswer,
        resetAssessment,
    };
}

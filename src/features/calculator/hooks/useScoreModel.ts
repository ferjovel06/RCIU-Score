import { useEffect, useState } from 'react';
import { fetchActiveScoreModel } from '../services/scoreModelApi';
import type { ScoreModelDefinition } from '../types/scoreModel.types';

type ScoreModelState =
    | { status: 'loading' }
    | { status: 'ready'; model: ScoreModelDefinition }
    | { status: 'error'; message: string };

export function useScoreModel(): ScoreModelState {
    const [state, setState] = useState<ScoreModelState>({
        status: 'loading',
    });

    useEffect(() => {
        const controller = new AbortController();

        async function loadModel() {
            try {
                const model = await fetchActiveScoreModel(
                    'ARAGON_FGR',
                    controller.signal,
                );

                if (!controller.signal.aborted) {
                    setState({
                        status: 'ready',
                        model,
                    });
                }
            } catch (error) {
                if (!controller.signal.aborted) {
                    setState({
                        status: 'error',
                        message:
                            error instanceof Error
                                ? error.message
                                : 'Unknown error',
                    });
                }
            }
        }

        void loadModel();

        return () => {
            controller.abort();
        };
    }, []);

    return state;
}

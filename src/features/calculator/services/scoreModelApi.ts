import { env } from '@/core/config/env';
import {
    parseScoreModelDefinition,
    type ScoreModelDefinition,
} from '../types/scoreModel.types';

export async function fetchActiveScoreModel(
    code: string,
    signal?: AbortSignal,
): Promise<ScoreModelDefinition> {
    const url = new URL(
        `${env.supabaseUrl}/functions/v1/score-model`,
    );

    url.searchParams.set('code', code);

    const response = await fetch(url, { signal });

    if (!response.ok) {
        throw new Error(
            `Could not load score model: HTTP ${response.status}`,
        );
    }

    const data: unknown = await response.json();

    return parseScoreModelDefinition(data);
}

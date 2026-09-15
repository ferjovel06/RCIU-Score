import {
    isObject,
    readInteger,
    readNullableString,
    readString,
} from '../utils/runtimeValidation';

export type FactorCode = string;

export interface ScoreFactor {
    id: string;
    code: FactorCode;
    label: string;
    points: number;
    source: 'original' | 'literature';
    displayOrder: number;
}

export interface ProbabilityReference {
    score: number;
    probabilityLabel: string;
}

export interface RiskBand {
    code: string;
    riskLevel: string;
    label: string;
    minimumScore: number;
    maximumScore: number;
    tableClassification: string | null;
    displayOrder: number;
}

export interface ScoreModelDefinition {
    id: string;
    code: string;
    version: string;
    algorithmType: string;
    originalMaximum: number;
    extendedMaximum: number;
    definitionChecksum: string;
    factors: ScoreFactor[];
    probabilityReferences: ProbabilityReference[];
    riskBands: RiskBand[];
}

function parseFactor(value: unknown): ScoreFactor {
    if (!isObject(value)) {
        throw new Error('Factor must be an object');
    }

    const source = readString(value, 'source');

    if (source !== 'original' && source !== 'literature') {
        throw new Error(
            'Factor source must be original or literature',
        );
    }

    const points = readInteger(value, 'points');

    if (points < 0) {
        throw new Error('Factor points cannot be negative');
    }

    const displayOrder = readInteger(value, 'displayOrder');

    if (displayOrder < 0) {
        throw new Error('Factor displayOrder cannot be negative');
    }

    return {
        id: readString(value, 'id'),
        code: readString(value, 'code'),
        label: readString(value, 'label'),
        points,
        source,
        displayOrder,
    };
}

function parseProbabilityReference(
    value: unknown,
): ProbabilityReference {
    if (!isObject(value)) {
        throw new Error(
            'Probability reference must be an object',
        );
    }

    const score = readInteger(value, 'score');

    if (score < 0) {
        throw new Error(
            'Probability score cannot be negative',
        );
    }

    return {
        score,
        probabilityLabel: readString(
            value,
            'probabilityLabel',
        ),
    };
}

function parseRiskBand(value: unknown): RiskBand {
    if (!isObject(value)) {
        throw new Error('Risk band must be an object');
    }

    const minimumScore = readInteger(
        value,
        'minimumScore',
    );

    const maximumScore = readInteger(
        value,
        'maximumScore',
    );

    const displayOrder = readInteger(
        value,
        'displayOrder',
    );

    if (minimumScore < 0) {
        throw new Error(
            'Risk-band minimum cannot be negative',
        );
    }

    if (maximumScore < minimumScore) {
        throw new Error(
            'Risk-band maximum cannot be below minimum',
        );
    }

    if (displayOrder < 0) {
        throw new Error(
            'Risk-band display order cannot be negative',
        );
    }

    return {
        code: readString(value, 'code'),
        riskLevel: readString(value, 'riskLevel'),
        label: readString(value, 'label'),
        minimumScore,
        maximumScore,
        tableClassification: readNullableString(
            value,
            'tableClassification',
        ),
        displayOrder,
    };
}

function validateModelRules(
    model: ScoreModelDefinition,
): void {
    if (model.originalMaximum < 0) {
        throw new Error(
            'Model original maximum cannot be negative',
        );
    }

    if (model.extendedMaximum < model.originalMaximum) {
        throw new Error(
            'Model extended maximum cannot be below original maximum',
        );
    }

    const factorIds = new Set<string>();
    const factorCodes = new Set<FactorCode>();

    for (const factor of model.factors) {
        if (factorIds.has(factor.id)) {
            throw new Error(
                `Duplicate factor id: ${factor.id}`,
            );
        }

        if (factorCodes.has(factor.code)) {
            throw new Error(
                `Duplicate factor code: ${factor.code}`,
            );
        }

        factorIds.add(factor.id);
        factorCodes.add(factor.code);
    }
}

export function parseScoreModelDefinition(
    value: unknown,
): ScoreModelDefinition {
    if (!isObject(value)) {
        throw new Error(
            'Score model definition must be an object',
        );
    }

    if (!Array.isArray(value.factors)) {
        throw new Error('factors must be an array');
    }

    if (!Array.isArray(value.probabilityReferences)) {
        throw new Error(
            'probabilityReferences must be an array',
        );
    }

    if (!Array.isArray(value.riskBands)) {
        throw new Error('riskBands must be an array');
    }

    const algorithmType = readString(
        value,
        'algorithmType',
    );

    if (algorithmType !== 'additive_points_v1') {
        throw new Error(
            `Unsupported algorithm: ${algorithmType}`,
        );
    }

    const originalMaximum = readInteger(
        value,
        'originalMaximum',
    );

    const extendedMaximum = readInteger(
        value,
        'extendedMaximum',
    );

    const model: ScoreModelDefinition = {
        id: readString(value, 'id'),
        code: readString(value, 'code'),
        version: readString(value, 'version'),
        algorithmType,
        originalMaximum,
        extendedMaximum,
        definitionChecksum: readString(
            value,
            'definitionChecksum',
        ),
        factors: value.factors.map(parseFactor),
        probabilityReferences:
            value.probabilityReferences.map(
                parseProbabilityReference,
            ),
        riskBands: value.riskBands.map(parseRiskBand),
    };

    validateModelRules(model);

    return model;
}

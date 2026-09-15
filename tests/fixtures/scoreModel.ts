import type { ScoreModelDefinition } from '../../src/features/calculator/types/scoreModel.types.ts';

const factorDefinitions = [
  ['aborto', 3, 'original'],
  ['rciu', 2, 'original'],
  ['cesarea', 1, 'original'],
  ['saf', 3, 'original'],
  ['lupus', 1, 'original'],
  ['preeclampsia', 2, 'original'],
  ['neumopatia', 1, 'original'],
  ['smoking', 1, 'literature'],
] as const;

const probabilityLabels = [
  '~3 %', '~5 %', '~8 %', '~15 %', '~22 %', '~30 %', '~40 %',
  '~52 %', '~65 %', '~75 %', '>85 %', '>85 %', '>85 %', '>85 %',
];

export const scoreModel = {
  id: '00000000-0000-4000-8000-000000000020',
  code: 'ARAGON_FGR',
  version: '0.2',
  algorithmType: 'additive_points_v1',
  originalMaximum: 13,
  extendedMaximum: 14,
  definitionChecksum:
    '86e852a87448c8660fea90074002e3119b60f31a76f3ee6daf1e0a7cc06baad4',
  factors: factorDefinitions.map(
    ([code, points, source], index) => ({
      id: `factor-${index + 1}`,
      code,
      label: code,
      points,
      source,
      displayOrder: index + 1,
    }),
  ),
  probabilityReferences: probabilityLabels.map(
    (probabilityLabel, score) => ({ score, probabilityLabel }),
  ),
  riskBands: [
    {
      code: 'low', riskLevel: 'low', label: 'Riesgo bajo',
      minimumScore: 0, maximumScore: 2,
      tableClassification: null, displayOrder: 1,
    },
    {
      code: 'moderate', riskLevel: 'moderate', label: 'Riesgo moderado',
      minimumScore: 3, maximumScore: 5,
      tableClassification: null, displayOrder: 2,
    },
    {
      code: 'high', riskLevel: 'high', label: 'Riesgo alto',
      minimumScore: 6, maximumScore: 9,
      tableClassification: null, displayOrder: 3,
    },
    {
      code: 'very_high', riskLevel: 'high', label: 'Riesgo alto',
      minimumScore: 10, maximumScore: 13,
      tableClassification: 'Muy alto', displayOrder: 4,
    },
  ],
} satisfies ScoreModelDefinition;

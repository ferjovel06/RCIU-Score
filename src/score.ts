export const SCORE_VERSION = 'ARAGON-FGR · extensión experimental con tabaquismo · v0.2';
export const factors = [
  { id: 'aborto', label: 'Antecedente de aborto', points: 3 },
  { id: 'rciu', label: 'RCIU previo', points: 2 },
  { id: 'cesarea', label: 'Cesárea previa', points: 1 },
  { id: 'saf', label: 'Síndrome antifosfolípido', points: 3 },
  { id: 'lupus', label: 'Lupus eritematoso sistémico', points: 1 },
  { id: 'preeclampsia', label: 'Preeclampsia', points: 2 },
  { id: 'neumopatia', label: 'Neumopatía crónica', points: 1 },
] as const;
export type FactorId = typeof factors[number]['id'];
export const probabilities = ['~3 %', '~5 %', '~8 %', '~15 %', '~22 %', '~30 %', '~40 %', '~52 %', '~65 %', '~75 %', '>85 %', '>85 %', '>85 %', '>85 %'];
export function calculateScore(ids: readonly string[]) {
  if (ids.some(id => !factors.some(f => f.id === id))) throw new Error('Factor no reconocido');
  const total = factors.reduce((sum, f) => sum + (ids.includes(f.id) ? f.points : 0), 0);
  const level = total < 3 ? 'low' : total < 6 ? 'moderate' : 'high';
  return { total, probability: probabilities[total], level, label: level === 'low' ? 'Riesgo bajo' : level === 'moderate' ? 'Riesgo moderado' : 'Riesgo alto', tableClassification: total >= 10 ? 'Muy alto' : null };
}

export function calculateExtendedScore(ids: readonly string[], smoking: boolean) {
  const original = calculateScore(ids);
  return { original, smokingPoints: smoking ? 1 : 0, total: original.total + (smoking ? 1 : 0), maximum: 14 };
}

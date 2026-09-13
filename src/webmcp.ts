import { calculateExtendedScore, factors, type FactorId } from './score';
type Registry = { registerTool: (tool: object, options: { signal: AbortSignal }) => void | Promise<void> };
export function registerCalculatorTool(setFactors: (ids: FactorId[], smoking: boolean) => void) {
  const context = (document as Document & { modelContext?: Registry }).modelContext;
  if (!context?.registerTool) return;
  const lifecycle = new AbortController();
  try {
    void Promise.resolve(context.registerTool({
      name: 'set_research_score_factors', title: 'Configurar factores del score',
      description: 'Replace the calculator selections and return the research score. Updates only this page; stores no patient record.',
      inputSchema: { type: 'object', properties: { factors: { type: 'array', items: { type: 'string', enum: factors.map(f => f.id) }, uniqueItems: true }, smoking: { type: 'boolean' } }, required: ['factors','smoking'], additionalProperties: false },
      annotations: { readOnlyHint: false, untrustedContentHint: false },
      execute(input: unknown) {
        if (!input || typeof input !== 'object' || Array.isArray(input)) throw new Error('Se requiere un objeto');
        const value = input as Record<string,unknown>;
        if (Object.keys(value).some(k => !['factors','smoking'].includes(k)) || !Array.isArray(value.factors) || value.factors.some(id => typeof id !== 'string') || typeof value.smoking !== 'boolean') throw new Error('Factores o tabaquismo inválidos');
        if (new Set(value.factors).size !== value.factors.length) throw new Error('Factores duplicados');
        const result = calculateExtendedScore(value.factors, value.smoking);
        setFactors(value.factors as FactorId[], value.smoking);
        return {...result, smoking: value.smoking, probabilitySource: 'Probability and risk category apply only to original score, excluding smoking; extended total has no established probability or risk thresholds'};
      },
    }, {signal:lifecycle.signal})).catch(() => {});
  } catch { /* Ordinary browsers may not support this experimental registry. */ }
  return () => lifecycle.abort();
}

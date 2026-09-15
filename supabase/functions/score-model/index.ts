import { withSupabase } from 'npm:@supabase/server@^1';

export default {
  fetch: withSupabase(
    { auth: 'none' },

    async (request, context) => {
      if (request.method !== 'GET') {
        return Response.json(
          { error: 'Method not allowed' },
          {
            status: 405,
            headers: {
              Allow: 'GET',
            },
          },
        );
      }

      const url = new URL(request.url);
      const modelCode =
        url.searchParams.get('code') ?? 'ARAGON_FGR';

      if (!/^[A-Z0-9_]{1,64}$/.test(modelCode)) {
        return Response.json(
          { error: 'Invalid model code' },
          { status: 400 },
        );
      }

      const { data, error } = await context.supabaseAdmin
        .from('score_models')
        .select(`
          id,
          code,
          version,
          algorithm_type,
          original_maximum,
          extended_maximum,
          definition_checksum,
          score_factors (
            id,
            code,
            label,
            points,
            source,
            display_order
          ),
          score_probability_references (
            score,
            probability_label,
            display_order
          ),
          score_risk_bands (
            code,
            risk_level,
            label,
            minimum_score,
            maximum_score,
            table_classification,
            display_order
          )
        `)
        .eq('code', modelCode)
        .eq('status', 'active')
        .maybeSingle();

      if (error) {
        console.error('Could not load score model:', error);

        return Response.json(
          { error: 'Could not load score model' },
          { status: 500 },
        );
      }

      if (!data) {
        return Response.json(
          { error: 'Active score model not found' },
          { status: 404 },
        );
      }

      const factors = [...data.score_factors]
        .sort((a, b) => a.display_order - b.display_order)
        .map((factor) => ({
          id: factor.id,
          code: factor.code,
          label: factor.label,
          points: factor.points,
          source: factor.source,
          displayOrder: factor.display_order,
        }));

      const probabilityReferences = [
        ...data.score_probability_references,
      ]
        .sort((a, b) => a.display_order - b.display_order)
        .map((reference) => ({
          score: reference.score,
          probabilityLabel: reference.probability_label,
        }));

      const riskBands = [...data.score_risk_bands]
        .sort((a, b) => a.display_order - b.display_order)
        .map((band) => ({
          code: band.code,
          riskLevel: band.risk_level,
          label: band.label,
          minimumScore: band.minimum_score,
          maximumScore: band.maximum_score,
          tableClassification: band.table_classification,
          displayOrder: band.display_order,
        }));

      return Response.json(
        {
          id: data.id,
          code: data.code,
          version: data.version,
          algorithmType: data.algorithm_type,
          originalMaximum: data.original_maximum,
          extendedMaximum: data.extended_maximum,
          definitionChecksum: data.definition_checksum,
          factors,
          probabilityReferences,
          riskBands,
        },
        {
          headers: {
            'Cache-Control':
              'public, max-age=300, stale-while-revalidate=86400',
          },
        },
      );
    },
  ),
};

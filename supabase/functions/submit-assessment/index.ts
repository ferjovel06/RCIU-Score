import { withSupabase } from 'npm:@supabase/server@^1';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers':
    'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

function jsonResponse(
  body: unknown,
  status: number,
): Response {
  return Response.json(body, {
    status,
    headers: {
      ...corsHeaders,
      'Cache-Control': 'no-store',
    },
  });
}

function isObject(
  value: unknown,
): value is Record<string, unknown> {
  return typeof value === 'object' &&
    value !== null &&
    !Array.isArray(value);
}

export default {
  fetch: withSupabase(
    { auth: 'none' },

    async (request, context) => {
      if (request.method === 'OPTIONS') {
        return new Response(null, {
          status: 204,
          headers: corsHeaders,
        });
      }

      if (request.method !== 'POST') {
        return jsonResponse(
          { error: 'Method not allowed' },
          405,
        );
      }

      let body: unknown;

      try {
        body = await request.json();
      } catch {
        return jsonResponse(
          { error: 'Request body must be valid JSON' },
          400,
        );
      }

      if (!isObject(body) || !Array.isArray(body.answers)) {
        return jsonResponse(
          { error: 'Invalid assessment submission' },
          400,
        );
      }

      const { data, error } = await context.supabaseAdmin.rpc(
        'submit_assessment',
        {
          p_assessment_id: body.assessmentId,
          p_model_id: body.modelId,
          p_model_code: body.modelCode,
          p_model_version: body.modelVersion,
          p_definition_checksum: body.definitionChecksum,
          p_client_created_at: body.clientCreatedAt,
          p_answers: body.answers,
        },
      );

      if (error) {
        const status = error.code === '23505'
          ? 409
          : error.code === '22023' || error.code === '22P02'
          ? 400
          : 500;

        if (status === 500) {
          console.error('Could not submit assessment:', error);
        }

        return jsonResponse(
          {
            error: status === 409
              ? 'Assessment has already been submitted'
              : status === 400
              ? error.message
              : 'Could not submit assessment',
          },
          status,
        );
      }

      return jsonResponse(data, 201);
    },
  ),
};

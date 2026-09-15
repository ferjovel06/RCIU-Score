create or replace function public.submit_assessment(
  p_assessment_id uuid,
  p_model_id uuid,
  p_model_code text,
  p_model_version text,
  p_definition_checksum text,
  p_client_created_at timestamptz,
  p_answers jsonb
)
returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_model public.score_models%rowtype;
  v_factor_count integer;
  v_answer_count integer;
  v_distinct_answer_count integer;
  v_original_total integer;
  v_additional_total integer;
  v_extended_total integer;
  v_probability_label text;
  v_risk_level text;
  v_risk_label text;
  v_table_classification text;
  v_calculated_at timestamptz := now();
begin
  if jsonb_typeof(p_answers) is distinct from 'array' then
    raise exception using
      errcode = '22023',
      message = 'answers must be an array';
  end if;

  select model.*
  into v_model
  from public.score_models as model
  where model.id = p_model_id
    and model.code = p_model_code
    and model.version = p_model_version
    and model.definition_checksum = p_definition_checksum
    and (
      model.status = 'active'
      or (
        model.status = 'retired'
        and model.accept_submissions_until is not null
        and now() <= model.accept_submissions_until
      )
    );

  if not found then
    raise exception using
      errcode = '22023',
      message = 'score model is invalid or no longer accepts submissions';
  end if;

  if exists (
    select 1
    from jsonb_array_elements(p_answers) as item(answer)
    where jsonb_typeof(answer) is distinct from 'object'
      or jsonb_typeof(answer -> 'factorCode') is distinct from 'string'
      or jsonb_typeof(answer -> 'response') is distinct from 'string'
      or answer ->> 'response' not in ('yes', 'no', 'unknown')
  ) then
    raise exception using
      errcode = '22023',
      message = 'each answer must contain a valid factorCode and response';
  end if;

  select count(*)
  into v_factor_count
  from public.score_factors
  where model_id = p_model_id;

  select
    count(*),
    count(distinct answer ->> 'factorCode')
  into v_answer_count, v_distinct_answer_count
  from jsonb_array_elements(p_answers) as item(answer);

  if v_answer_count <> v_factor_count
    or v_distinct_answer_count <> v_factor_count
    or exists (
      select 1
      from jsonb_array_elements(p_answers) as item(answer)
      where not exists (
        select 1
        from public.score_factors as factor
        where factor.model_id = p_model_id
          and factor.code = answer ->> 'factorCode'
      )
    )
  then
    raise exception using
      errcode = '22023',
      message = 'answers do not match the score model factors';
  end if;

  insert into public.assessments (
    id,
    model_id,
    client_created_at
  )
  values (
    p_assessment_id,
    p_model_id,
    p_client_created_at
  );

  insert into public.assessment_answers (
    assessment_id,
    model_id,
    factor_id,
    response,
    factor_points_snapshot,
    points_awarded
  )
  select
    p_assessment_id,
    p_model_id,
    factor.id,
    answer ->> 'response',
    factor.points,
    case
      when answer ->> 'response' = 'yes' then factor.points
      else 0
    end
  from jsonb_array_elements(p_answers) as item(answer)
  join public.score_factors as factor
    on factor.model_id = p_model_id
   and factor.code = answer ->> 'factorCode';

  select
    coalesce(sum(answer.points_awarded)
      filter (where factor.source = 'original'), 0),
    coalesce(sum(answer.points_awarded)
      filter (where factor.source = 'literature'), 0)
  into v_original_total, v_additional_total
  from public.assessment_answers as answer
  join public.score_factors as factor
    on factor.model_id = answer.model_id
   and factor.id = answer.factor_id
  where answer.assessment_id = p_assessment_id;

  v_extended_total := v_original_total + v_additional_total;

  select reference.probability_label
  into v_probability_label
  from public.score_probability_references as reference
  where reference.model_id = p_model_id
    and reference.score = v_original_total;

  select
    band.risk_level,
    band.label,
    band.table_classification
  into
    v_risk_level,
    v_risk_label,
    v_table_classification
  from public.score_risk_bands as band
  where band.model_id = p_model_id
    and v_original_total between band.minimum_score and band.maximum_score;

  if v_probability_label is null or v_risk_level is null then
    raise exception using
      errcode = '22023',
      message = 'score model definition is incomplete';
  end if;

  insert into public.assessment_results (
    assessment_id,
    model_id,
    original_total,
    additional_total,
    extended_total,
    original_risk_level,
    original_risk_label,
    original_probability_label,
    table_classification,
    calculated_at
  )
  values (
    p_assessment_id,
    p_model_id,
    v_original_total,
    v_additional_total,
    v_extended_total,
    v_risk_level,
    v_risk_label,
    v_probability_label,
    v_table_classification,
    v_calculated_at
  );

  return jsonb_build_object(
    'assessmentId', p_assessment_id,
    'originalTotal', v_original_total,
    'additionalTotal', v_additional_total,
    'extendedTotal', v_extended_total,
    'originalRiskLevel', v_risk_level,
    'originalRiskLabel', v_risk_label,
    'originalProbabilityLabel', v_probability_label,
    'tableClassification', v_table_classification,
    'calculatedAt', v_calculated_at
  );
end;
$$;

revoke all on function public.submit_assessment(
  uuid,
  uuid,
  text,
  text,
  text,
  timestamptz,
  jsonb
) from public, anon, authenticated;

grant execute on function public.submit_assessment(
  uuid,
  uuid,
  text,
  text,
  text,
  timestamptz,
  jsonb
) to service_role;

begin;

alter table public.score_models
  add column algorithm_type text,
  add column published_at timestamptz,
  add column retired_at timestamptz,
  add column accept_submissions_until timestamptz,
  add column definition_checksum text;

update public.score_models
set
  algorithm_type = 'additive_points_v1',
  published_at = activated_at,
  definition_checksum = '86e852a87448c8660fea90074002e3119b60f31a76f3ee6daf1e0a7cc06baad4'
where code = 'ARAGON_FGR'
  and version = '0.2';

alter table public.score_models
  alter column algorithm_type set not null,
  add constraint score_models_algorithm_type_not_blank
    check (btrim(algorithm_type) <> ''),
  add constraint score_models_definition_checksum_format
    check (
      definition_checksum is null
      or definition_checksum ~ '^[0-9a-f]{64}$'
    ),
  add constraint score_models_publication_lifecycle
    check (
      (status = 'draft' and published_at is null and retired_at is null)
      or (
        status = 'active'
        and published_at is not null
        and retired_at is null
        and definition_checksum is not null
      )
      or (
        status = 'retired'
        and published_at is not null
        and retired_at is not null
        and definition_checksum is not null
      )
    ),
  add constraint score_models_submission_window
    check (
      accept_submissions_until is null
      or (
        published_at is not null
        and accept_submissions_until >= published_at
      )
    );

comment on column public.score_models.algorithm_type is
  'Selects the trusted calculation implementation; it is not executable database content.';

comment on column public.score_models.definition_checksum is
  'SHA-256 of the canonical JSON model definition returned to clients; array order follows display_order.';

comment on column public.score_models.accept_submissions_until is
  'Null allows submissions indefinitely; otherwise submissions for this version close at this instant.';

create table public.score_probability_references (
  model_id uuid not null references public.score_models (id) on delete restrict,
  score smallint not null check (score >= 0),
  probability_label text not null check (btrim(probability_label) <> ''),
  display_order smallint not null check (display_order >= 0),
  primary key (model_id, score),
  unique (model_id, display_order)
);

create table public.score_risk_bands (
  id uuid primary key,
  model_id uuid not null references public.score_models (id) on delete restrict,
  code text not null check (btrim(code) <> ''),
  risk_level text not null check (btrim(risk_level) <> ''),
  label text not null check (btrim(label) <> ''),
  minimum_score smallint not null check (minimum_score >= 0),
  maximum_score smallint not null check (maximum_score >= minimum_score),
  table_classification text,
  display_order smallint not null check (display_order >= 0),
  unique (model_id, code),
  unique (model_id, display_order),
  unique (model_id, minimum_score),
  unique (model_id, maximum_score),
  check (table_classification is null or btrim(table_classification) <> '')
);

alter table public.assessment_results
  drop constraint assessment_results_original_risk_level_check,
  add constraint assessment_results_original_risk_level_not_blank
    check (btrim(original_risk_level) <> '');

comment on table public.score_probability_references is
  'Display probabilities for the validated original score only.';

comment on table public.score_risk_bands is
  'Inclusive, ordered score intervals for risk labels and source-table classifications.';

insert into public.score_probability_references (
  model_id,
  score,
  probability_label,
  display_order
)
values
  ('00000000-0000-4000-8000-000000000020', 0, '~3 %', 0),
  ('00000000-0000-4000-8000-000000000020', 1, '~5 %', 1),
  ('00000000-0000-4000-8000-000000000020', 2, '~8 %', 2),
  ('00000000-0000-4000-8000-000000000020', 3, '~15 %', 3),
  ('00000000-0000-4000-8000-000000000020', 4, '~22 %', 4),
  ('00000000-0000-4000-8000-000000000020', 5, '~30 %', 5),
  ('00000000-0000-4000-8000-000000000020', 6, '~40 %', 6),
  ('00000000-0000-4000-8000-000000000020', 7, '~52 %', 7),
  ('00000000-0000-4000-8000-000000000020', 8, '~65 %', 8),
  ('00000000-0000-4000-8000-000000000020', 9, '~75 %', 9),
  ('00000000-0000-4000-8000-000000000020', 10, '>85 %', 10),
  ('00000000-0000-4000-8000-000000000020', 11, '>85 %', 11),
  ('00000000-0000-4000-8000-000000000020', 12, '>85 %', 12),
  ('00000000-0000-4000-8000-000000000020', 13, '>85 %', 13);

insert into public.score_risk_bands (
  id,
  model_id,
  code,
  risk_level,
  label,
  minimum_score,
  maximum_score,
  table_classification,
  display_order
)
values
  (
    '00000000-0000-4000-8200-000000000001',
    '00000000-0000-4000-8000-000000000020',
    'low',
    'low',
    'Riesgo bajo',
    0,
    2,
    null,
    1
  ),
  (
    '00000000-0000-4000-8200-000000000002',
    '00000000-0000-4000-8000-000000000020',
    'moderate',
    'moderate',
    'Riesgo moderado',
    3,
    5,
    null,
    2
  ),
  (
    '00000000-0000-4000-8200-000000000003',
    '00000000-0000-4000-8000-000000000020',
    'high',
    'high',
    'Riesgo alto',
    6,
    9,
    null,
    3
  ),
  (
    '00000000-0000-4000-8200-000000000004',
    '00000000-0000-4000-8000-000000000020',
    'very_high',
    'high',
    'Riesgo alto',
    10,
    13,
    'Muy alto',
    4
  );

alter table public.score_probability_references enable row level security;
alter table public.score_risk_bands enable row level security;

revoke all on table public.score_probability_references from anon, authenticated;
revoke all on table public.score_risk_bands from anon, authenticated;

grant select on table public.score_probability_references to service_role;
grant select on table public.score_risk_bands to service_role;

commit;

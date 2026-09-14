create table public.score_models (
  id uuid primary key,
  code text not null,
  version text not null,
  status text not null check (status in ('draft', 'active', 'retired')),
  original_maximum smallint not null check (original_maximum >= 0),
  extended_maximum smallint not null check (extended_maximum >= original_maximum),
  created_at timestamptz not null default now(),
  activated_at timestamptz,
  unique (code, version),
  check (btrim(code) <> ''),
  check (btrim(version) <> ''),
  check (
    (status = 'draft' and activated_at is null)
    or (status in ('active', 'retired') and activated_at is not null)
  )
);

create unique index idx_score_models_one_active_version
on public.score_models (code)
where status = 'active';

create table public.score_factors (
  id uuid primary key,
  model_id uuid not null references public.score_models (id) on delete restrict,
  code text not null,
  label text not null,
  points smallint not null check (points >= 0),
  source text not null check (source in ('original', 'literature')),
  display_order smallint not null check (display_order >= 0),
  unique (model_id, code),
  unique (model_id, display_order),
  unique (model_id, id),
  check (btrim(code) <> ''),
  check (btrim(label) <> '')
);

create table public.assessments (
  id uuid primary key,
  model_id uuid not null references public.score_models (id) on delete restrict,
  created_by uuid references auth.users (id) on delete set null,
  client_created_at timestamptz not null,
  received_at timestamptz not null default now(),
  status text not null default 'completed' check (status in ('completed', 'voided')),
  voided_at timestamptz,
  voided_by uuid references auth.users (id) on delete set null,
  unique (id, model_id),
  check (
    (status = 'completed' and voided_at is null and voided_by is null)
    or (status = 'voided' and voided_at is not null)
  )
);

create table public.assessment_answers (
  assessment_id uuid not null,
  model_id uuid not null,
  factor_id uuid not null,
  response text not null check (response in ('yes', 'no', 'unknown')),
  factor_points_snapshot smallint not null check (factor_points_snapshot >= 0),
  points_awarded smallint not null check (points_awarded >= 0),
  primary key (assessment_id, factor_id),
  foreign key (assessment_id, model_id)
    references public.assessments (id, model_id) on delete cascade,
  foreign key (model_id, factor_id)
    references public.score_factors (model_id, id) on delete restrict,
  check (
    (response = 'yes' and points_awarded = factor_points_snapshot)
    or (response in ('no', 'unknown') and points_awarded = 0)
  )
);

create table public.assessment_results (
  assessment_id uuid primary key,
  model_id uuid not null,
  original_total smallint not null check (original_total >= 0),
  additional_total smallint not null check (additional_total >= 0),
  extended_total smallint not null check (extended_total >= 0),
  original_risk_level text not null check (original_risk_level in ('low', 'moderate', 'high')),
  original_risk_label text not null,
  original_probability_label text not null,
  table_classification text,
  calculated_at timestamptz not null default now(),
  foreign key (assessment_id, model_id)
    references public.assessments (id, model_id) on delete cascade,
  check (extended_total = original_total + additional_total),
  check (btrim(original_risk_label) <> ''),
  check (btrim(original_probability_label) <> '')
);

create index idx_assessments_received_at
on public.assessments (received_at desc);

create index idx_assessments_created_by_received_at
on public.assessments (created_by, received_at desc)
where created_by is not null;

create index idx_assessment_answers_factor_response
on public.assessment_answers (factor_id, response);

alter table public.score_models enable row level security;
alter table public.score_factors enable row level security;
alter table public.assessments enable row level security;
alter table public.assessment_answers enable row level security;
alter table public.assessment_results enable row level security;

revoke all on table public.score_models from anon, authenticated;
revoke all on table public.score_factors from anon, authenticated;
revoke all on table public.assessments from anon, authenticated;
revoke all on table public.assessment_answers from anon, authenticated;
revoke all on table public.assessment_results from anon, authenticated;

grant select on table public.score_models to service_role;
grant select on table public.score_factors to service_role;
grant select, insert, update, delete on table public.assessments to service_role;
grant select, insert, update, delete on table public.assessment_answers to service_role;
grant select, insert, update, delete on table public.assessment_results to service_role;

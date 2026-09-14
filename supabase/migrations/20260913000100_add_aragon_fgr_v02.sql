insert into public.score_models (
  id,
  code,
  version,
  status,
  original_maximum,
  extended_maximum,
  activated_at
)
values (
  '00000000-0000-4000-8000-000000000020',
  'ARAGON_FGR',
  '0.2',
  'active',
  13,
  14,
  now()
);

insert into public.score_factors (
  id,
  model_id,
  code,
  label,
  points,
  source,
  display_order
)
values
  ('00000000-0000-4000-8100-000000000001', '00000000-0000-4000-8000-000000000020', 'aborto', 'Antecedente de aborto', 3, 'original', 1),
  ('00000000-0000-4000-8100-000000000002', '00000000-0000-4000-8000-000000000020', 'rciu', 'RCIU previo', 2, 'original', 2),
  ('00000000-0000-4000-8100-000000000003', '00000000-0000-4000-8000-000000000020', 'cesarea', 'Cesárea previa', 1, 'original', 3),
  ('00000000-0000-4000-8100-000000000004', '00000000-0000-4000-8000-000000000020', 'saf', 'Síndrome antifosfolípido', 3, 'original', 4),
  ('00000000-0000-4000-8100-000000000005', '00000000-0000-4000-8000-000000000020', 'lupus', 'Lupus eritematoso sistémico', 1, 'original', 5),
  ('00000000-0000-4000-8100-000000000006', '00000000-0000-4000-8000-000000000020', 'preeclampsia', 'Preeclampsia', 2, 'original', 6),
  ('00000000-0000-4000-8100-000000000007', '00000000-0000-4000-8000-000000000020', 'neumopatia', 'Neumopatía crónica', 1, 'original', 7),
  ('00000000-0000-4000-8100-000000000008', '00000000-0000-4000-8000-000000000020', 'smoking', 'Tabaquismo materno activo', 1, 'literature', 8);

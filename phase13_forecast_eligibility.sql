-- EMS Phase 13: explicitly mark new purchases eligible for forecasting.
-- Existing rows remain false and are retained as historical reference only.
-- Apply in the TEST Supabase project first. Do not run in production until the full migration is reviewed.
alter table public.purchases
  add column if not exists forecast_eligible boolean not null default false;

comment on column public.purchases.forecast_eligible is
  'True only for purchases entered after forecasting launch; historical rows remain excluded from prediction training.';

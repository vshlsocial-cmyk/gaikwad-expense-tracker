-- EMS Phase 14: additive product identity fields.
-- Safe for the existing project: no rows are deleted or rewritten.
-- Apply to the connected database only after reviewing this migration.
alter table public.purchases add column if not exists brand text;
alter table public.purchases add column if not exists variant text;
alter table public.purchases add column if not exists pack_size text;

comment on column public.purchases.brand is 'Optional brand identity; blank means unspecified.';
comment on column public.purchases.variant is 'Optional product variant/flavour/type; blank means unspecified.';
comment on column public.purchases.pack_size is 'Optional descriptive package identity; not automatically converted to mass or volume.';

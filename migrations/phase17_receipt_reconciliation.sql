-- Receipt reconciliation fields. Safe additive migration; does not rewrite historical amounts.
alter table public.purchases add column if not exists item_subtotal numeric;
alter table public.purchases add column if not exists receipt_total numeric;
alter table public.purchases add column if not exists receipt_items_total numeric;
alter table public.purchases add column if not exists receipt_adjustment numeric not null default 0;
alter table public.purchases add column if not exists receipt_adjustment_type text;

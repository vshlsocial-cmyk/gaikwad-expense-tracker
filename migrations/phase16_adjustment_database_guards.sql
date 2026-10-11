-- Enforce linked return/refund limits in the database, including concurrent writes.
create or replace function public.enforce_purchase_adjustment_limits()
returns trigger language plpgsql security invoker set search_path = public as $$
declare p public.purchases%rowtype; returned_before numeric; refunded_before numeric;
begin
  select * into p from public.purchases where id = new.purchase_id for update;
  if not found then raise exception 'Linked purchase does not exist'; end if;
  if p.user_id <> new.user_id then raise exception 'Adjustment owner must match purchase owner'; end if;
  select coalesce(sum(quantity_returned), 0), coalesce(sum(refund_amount), 0)
    into returned_before, refunded_before
  from public.purchase_adjustments
  where purchase_id = new.purchase_id and user_id = new.user_id
    and (tg_op = 'INSERT' or id <> new.id);
  if returned_before + new.quantity_returned > p.quantity then
    raise exception 'Total returned quantity cannot exceed purchased quantity (%)', p.quantity;
  end if;
  if refunded_before + new.refund_amount > p.amount then
    raise exception 'Total refunds cannot exceed purchase amount (%)', p.amount;
  end if;
  return new;
end; $$;

drop trigger if exists purchase_adjustments_limits_guard on public.purchase_adjustments;
create trigger purchase_adjustments_limits_guard before insert or update on public.purchase_adjustments
for each row execute function public.enforce_purchase_adjustment_limits();

create or replace function public.prevent_purchase_edit_below_adjustments()
returns trigger language plpgsql security invoker set search_path = public as $$
declare returned_total numeric; refunded_total numeric;
begin
  if new.quantity is distinct from old.quantity or new.amount is distinct from old.amount then
    select coalesce(sum(quantity_returned), 0), coalesce(sum(refund_amount), 0)
      into returned_total, refunded_total
    from public.purchase_adjustments where purchase_id = old.id and user_id = old.user_id;
    if new.quantity < returned_total then raise exception 'Purchase quantity cannot be less than already returned quantity (%)', returned_total; end if;
    if new.amount < refunded_total then raise exception 'Purchase amount cannot be less than already refunded amount (%)', refunded_total; end if;
  end if;
  return new;
end; $$;

drop trigger if exists purchases_adjustment_edit_guard on public.purchases;
create trigger purchases_adjustment_edit_guard before update of quantity, amount on public.purchases
for each row execute function public.prevent_purchase_edit_below_adjustments();

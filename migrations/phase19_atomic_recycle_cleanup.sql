-- Phase 19: atomic recycle-bin cleanup.
-- Invoker rights preserve the caller's RLS and auth.uid() scope.
-- A function call runs in one transaction: any error rolls back all deletes.
create or replace function public.cleanup_expired_ems_purchases(p_retention_days integer)
returns integer
language plpgsql
security invoker
set search_path = public
as $$
declare
  v_purchase_id bigint;
  v_removed integer := 0;
  v_rows integer := 0;
begin
  if auth.uid() is null then
    raise exception 'Authentication required';
  end if;
  if p_retention_days not in (7, 30, 90) then
    raise exception 'Retention must be 7, 30, or 90 days';
  end if;

  for v_purchase_id in
    select p.id
    from public.purchases p
    where p.user_id = auth.uid()
      and p.deleted_at is not null
      and p.deleted_at <= now() - make_interval(days => p_retention_days)
    order by p.id
    for update
  loop
    delete from public.purchase_adjustments a
    where a.user_id = auth.uid()
      and a.purchase_id = v_purchase_id;

    delete from public.purchases p
    where p.user_id = auth.uid()
      and p.id = v_purchase_id
      and p.deleted_at is not null
      and p.deleted_at <= now() - make_interval(days => p_retention_days);

    get diagnostics v_rows = row_count;
    v_removed := v_removed + v_rows;
  end loop;

  return v_removed;
end;
$$;

revoke all on function public.cleanup_expired_ems_purchases(integer) from public, anon;
grant execute on function public.cleanup_expired_ems_purchases(integer) to authenticated;

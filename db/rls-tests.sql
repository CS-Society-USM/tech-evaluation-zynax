-- Run in the SQL editor of a test project after applying schema.sql.
-- Fixtures are transaction-local and ROLLBACK leaves no users or notes behind.
begin;
create temporary table test_identity (name text, id uuid) on commit drop;
insert into test_identity values ('alice', gen_random_uuid()), ('bob', gen_random_uuid());
grant select on test_identity to authenticated;
insert into auth.users (id, instance_id, aud, role, email, created_at, updated_at)
select id, '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated',
  'rls-' || id || '@example.com', now(), now() from test_identity;
select set_config('request.jwt.claims',
  json_build_object('sub', (select id from test_identity where name = 'alice'), 'role', 'authenticated')::text, true);
set local role authenticated;
insert into public.notes (user_id, title, content)
values ((select id from test_identity where name = 'alice'), 'Transaction-only RLS fixture', 'Private');
do $$
begin
  assert (select count(*) from public.notes) = 1, 'Owner can see own note';
  update public.notes set title = 'Owner edited';
  assert (select count(*) from public.notes where title = 'Owner edited') = 1, 'Owner can update';
  begin
    update public.notes set user_id = (select id from test_identity where name = 'bob');
    raise exception 'Owner reassignment was unexpectedly permitted';
  exception when insufficient_privilege then null;
  end;
  begin
    update public.notes set content = '   ';
    raise exception 'Blank content was unexpectedly permitted';
  exception when check_violation then null;
  end;
end $$;
reset role;
select set_config('request.jwt.claims',
  json_build_object('sub', (select id from test_identity where name = 'bob'), 'role', 'authenticated')::text, true);
set local role authenticated;
do $$
declare changed integer;
begin
  assert (select count(*) from public.notes) = 0, 'Other user cannot read';
  update public.notes set title = 'Unauthorized';
  get diagnostics changed = row_count;
  assert changed = 0, 'Other user cannot update';
  delete from public.notes;
  get diagnostics changed = row_count;
  assert changed = 0, 'Other user cannot delete';
  begin
    insert into public.notes (user_id, title, content)
    values ((select id from test_identity where name = 'alice'), 'Forged', 'Forged');
    raise exception 'Forged ownership was unexpectedly permitted';
  exception when insufficient_privilege then null;
  end;
end $$;
reset role;
set local role anon;
do $$
begin
  begin
    perform id from public.notes;
    raise exception 'Guest could read notes';
  exception when insufficient_privilege then null;
  end;
end $$;
reset role;
select 'PASS: owner CRUD access, cross-user denial, forged ownership, immutable owner, blank content, guest denial' as result;
rollback;

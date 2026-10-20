-- Stillnote: the database, rather than client filtering, enforces ownership.
create table public.notes (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  title text not null check (char_length(title) <= 120 and title ~ '[^[:space:]]'),
  content text not null check (char_length(content) <= 20000 and content ~ '[^[:space:]]'),
  color text not null default 'paper' check (color in ('paper', 'sage', 'peach', 'lavender', 'sky')),
  pinned boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index notes_owner_updated_idx on public.notes (user_id, updated_at desc, id);
alter table public.notes enable row level security;
alter table public.notes force row level security;

create policy "Read own notes" on public.notes for select to authenticated
  using ((select auth.uid()) = user_id);
create policy "Create own notes" on public.notes for insert to authenticated
  with check ((select auth.uid()) = user_id);
create policy "Update own notes" on public.notes for update to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);
create policy "Delete own notes" on public.notes for delete to authenticated
  using ((select auth.uid()) = user_id);

-- Explicit column grants prevent clients from changing ownership or timestamps.
revoke all on public.notes from anon, authenticated;
grant select, delete on public.notes to authenticated;
grant insert (user_id, title, content, color, pinned) on public.notes to authenticated;
grant update (title, content, color, pinned) on public.notes to authenticated;

create function public.set_note_updated_at()
returns trigger language plpgsql security invoker set search_path = '' as $$
begin
  new.updated_at := clock_timestamp();
  return new;
end;
$$;
revoke all on function public.set_note_updated_at() from public, anon, authenticated;
create trigger notes_updated_at before update on public.notes
  for each row execute function public.set_note_updated_at();

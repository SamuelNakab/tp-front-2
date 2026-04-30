create table if not exists public.habits (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text not null,
  completed boolean not null default false,
  user_id uuid not null references auth.users(id) on delete cascade,
  created_at timestamptz not null default now()
);

alter table public.habits enable row level security;

create policy "Users can read their own habits"
on public.habits
for select
to authenticated
using (auth.uid() = user_id);

create policy "Users can insert their own habits"
on public.habits
for insert
to authenticated
with check (auth.uid() = user_id);

create policy "Users can update their own habits"
on public.habits
for update
to authenticated
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

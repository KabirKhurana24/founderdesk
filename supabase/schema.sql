-- Run this entire file in Supabase Dashboard → SQL Editor.
create extension if not exists pgcrypto;

create table if not exists public.actions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references auth.users(id) on delete cascade,
  title text not null check (char_length(title) between 1 and 500),
  owner text,
  business text,
  due_date date,
  priority text not null default 'medium' check (priority in ('low','medium','high')),
  status text not null default 'open' check (status in ('open','in_progress','done','blocked')),
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create table if not exists public.projects (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references auth.users(id) on delete cascade,
  name text not null,
  business text,
  status text not null default 'in_progress' check (status in ('planned','in_progress','blocked','completed')),
  owner text,
  due_date date,
  budget numeric(12,2),
  created_at timestamptz not null default now()
);
create table if not exists public.invoices (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references auth.users(id) on delete cascade,
  client text not null,
  business text,
  amount numeric(12,2) not null default 0,
  due_date date,
  status text not null default 'pending' check (status in ('pending','overdue','paid')),
  created_at timestamptz not null default now()
);

alter table public.actions enable row level security;
alter table public.projects enable row level security;
alter table public.invoices enable row level security;
drop policy if exists "Users manage own actions" on public.actions;
create policy "Users manage own actions" on public.actions for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
drop policy if exists "Users manage own projects" on public.projects;
create policy "Users manage own projects" on public.projects for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
drop policy if exists "Users manage own invoices" on public.invoices;
create policy "Users manage own invoices" on public.invoices for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- Optional demo rows: run while signed in as your test user by replacing USER_UUID below.
-- Find your user UUID in Supabase → Authentication → Users.
-- insert into public.actions(user_id,title,owner,business,due_date,priority,status,notes) values
-- ('USER_UUID','Send revised proposal to client','Aarav','Roven Studio',current_date - 1,'high','open','Waiting for approval'),
-- ('USER_UUID','Confirm shoot schedule','Maya','BrickLens',current_date + 1,'medium','open','Share call sheet');

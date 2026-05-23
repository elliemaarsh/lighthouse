-- Partner (non-carrying) daily health log — run in Supabase SQL editor
-- user_id is the app's local install UUID (not auth.users)

create table if not exists partner_logs (
  id uuid default gen_random_uuid() primary key,
  user_id uuid not null,
  date date not null,
  sleep_hours numeric,
  sleep_minutes integer,
  exercise_active boolean,
  exercise_minutes integer,
  exercise_types text[] default '{}',
  heat_level text check (heat_level in ('low', 'medium', 'high')),
  substances text[] default '{}',
  alcohol_drinks integer,
  stress_level integer check (stress_level between 1 and 5),
  notes text,
  created_at timestamptz default now(),
  unique (user_id, date)
);

create index if not exists partner_logs_user_date_idx on partner_logs (user_id, date desc);

alter table partner_logs enable row level security;

create policy "partner_logs_select" on partner_logs for select using (true);
create policy "partner_logs_insert" on partner_logs for insert with check (true);
create policy "partner_logs_update" on partner_logs for update using (true);

-- Lighthouse Community forum tables (run in Supabase SQL editor)

create table if not exists community_profiles (
  id uuid default gen_random_uuid() primary key,
  user_id uuid unique not null,
  username text unique not null,
  created_at timestamptz default now()
);

create table if not exists community_posts (
  id uuid default gen_random_uuid() primary key,
  user_id uuid,
  username text not null,
  title text not null,
  body text,
  tags text[] default '{}',
  helpful_count integer default 0,
  reply_count integer default 0,
  created_at timestamptz default now()
);

create table if not exists community_replies (
  id uuid default gen_random_uuid() primary key,
  post_id uuid references community_posts(id) on delete cascade,
  user_id uuid,
  username text not null,
  body text not null,
  helpful_count integer default 0,
  created_at timestamptz default now()
);

create table if not exists community_helpful (
  id uuid default gen_random_uuid() primary key,
  user_id uuid not null,
  post_id uuid references community_posts(id) on delete cascade,
  reply_id uuid references community_replies(id) on delete cascade,
  created_at timestamptz default now(),
  unique (user_id, post_id),
  unique (user_id, reply_id)
);

-- RLS: enable and allow anon read/write for local dev (tighten for production)
alter table community_profiles enable row level security;
alter table community_posts enable row level security;
alter table community_replies enable row level security;
alter table community_helpful enable row level security;

create policy "community_profiles_all" on community_profiles for all using (true) with check (true);
create policy "community_posts_all" on community_posts for all using (true) with check (true);
create policy "community_replies_all" on community_replies for all using (true) with check (true);
create policy "community_helpful_all" on community_helpful for all using (true) with check (true);

-- Realtime (enable in Dashboard → Database → Replication for community_posts)

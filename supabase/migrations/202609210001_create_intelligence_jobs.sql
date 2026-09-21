create table if not exists public.intelligence_jobs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  topic text not null check (char_length(topic) between 2 and 100),
  time_range text not null,
  target_market text not null,
  source_language text not null,
  status text not null default 'queued' check (status in ('queued', 'running', 'completed', 'failed')),
  report text,
  sources jsonb not null default '[]'::jsonb,
  valid_source_count integer not null default 0,
  error_message text,
  created_at timestamptz not null default now(),
  started_at timestamptz,
  completed_at timestamptz
);

alter table public.intelligence_jobs enable row level security;

create policy "users create their own intelligence jobs"
on public.intelligence_jobs for insert to authenticated
with check (auth.uid() = user_id);

create policy "users read their own intelligence jobs"
on public.intelligence_jobs for select to authenticated
using (auth.uid() = user_id);

create index if not exists intelligence_jobs_user_created_idx
on public.intelligence_jobs (user_id, created_at desc);

create table if not exists public.leads (
  id            uuid primary key default gen_random_uuid(),
  created_at    timestamptz not null default now(),
  name          text not null,
  email         text not null,
  business_name text not null,
  industry      text not null,
  message       text,
  ai_summary    text,
  ai_category   text
);

alter table public.leads enable row level security;

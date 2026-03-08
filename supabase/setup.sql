-- LeadFlow — Supabase setup script
-- Run this in your Supabase project: SQL Editor → New Query → Run

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

-- Only the service role (server-side) can read or write leads.
-- Disable all public access.
alter table public.leads enable row level security;

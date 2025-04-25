
-- Create enum for agent types
create type agent_type as enum ('audience', 'content', 'seo', 'social', 'email', 'analytics');

-- Create enum for strategy status
create type strategy_status as enum ('draft', 'in_progress', 'completed');

-- Create strategies table
create table if not exists public.strategies (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text,
  status strategy_status not null default 'draft',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Create agents table
create table if not exists public.agents (
  id uuid primary key default gen_random_uuid(),
  strategy_id uuid references public.strategies(id) on delete cascade,
  name text not null,
  type agent_type not null,
  description text,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

-- Create agent_results table
create table if not exists public.agent_results (
  id uuid primary key default gen_random_uuid(),
  agent_id uuid references public.agents(id) on delete cascade,
  strategy_id uuid references public.strategies(id) on delete cascade,
  content text not null,
  metadata jsonb,
  created_at timestamptz not null default now()
);

-- Add RLS policies
alter table public.strategies enable row level security;
alter table public.agents enable row level security;
alter table public.agent_results enable row level security;

-- Create updated_at trigger function
create or replace function handle_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

-- Add updated_at trigger to strategies table
create trigger handle_strategies_updated_at
  before update on public.strategies
  for each row
  execute function handle_updated_at();

-- Enable access for authenticated users
create policy "Enable all access for authenticated users" on public.strategies
  for all using (auth.role() = 'authenticated');

create policy "Enable all access for authenticated users" on public.agents
  for all using (auth.role() = 'authenticated');

create policy "Enable all access for authenticated users" on public.agent_results
  for all using (auth.role() = 'authenticated');

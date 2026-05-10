-- RunLog database schema for Supabase
-- Run this in your Supabase SQL editor after setting up your project.

-- Enable the pgcrypto extension for UUID generation
create extension if not exists "pgcrypto";

-- ── Runs ─────────────────────────────────────────────────────────────────

create table if not exists runs (
  id            uuid        primary key default gen_random_uuid(),
  date          date        not null,
  duration_seconds integer  not null check (duration_seconds > 0),
  distance      numeric(10, 2) not null check (distance > 0),
  unit          text        not null check (unit in ('miles', 'km')),
  notes         text,
  created_at    timestamptz not null default now()
);

create index runs_date_idx on runs (date desc);

-- ── Goals ────────────────────────────────────────────────────────────────

create table if not exists goals (
  id               uuid        primary key default gen_random_uuid(),
  name             text        not null,
  target_distance  numeric(10, 2) not null check (target_distance > 0),
  unit             text        not null check (unit in ('miles', 'km')),
  start_date       date        not null,
  end_date         date        not null check (end_date >= start_date),
  created_at       timestamptz not null default now()
);

-- ── Race Records ──────────────────────────────────────────────────────────

create table if not exists race_records (
  id            uuid        primary key default gen_random_uuid(),
  race_name     text        not null,
  race_type     text        not null check (race_type in ('5k', '10k', 'half_marathon', 'marathon', 'custom')),
  date          date        not null,
  time_seconds  integer     not null check (time_seconds > 0),
  distance      numeric(10, 2),
  unit          text        check (unit in ('miles', 'km')),
  location      text,
  notes         text,
  created_at    timestamptz not null default now()
);

create index race_records_type_time_idx on race_records (race_type, time_seconds asc);

-- ── Permissions & Row Level Security ─────────────────────────────────────
-- Anyone can read. Only authenticated users (you) can write.
-- Run these after creating your account via Supabase Auth.

alter table runs           enable row level security;
alter table goals          enable row level security;
alter table race_records   enable row level security;

-- Public read
create policy "public_read_runs"    on runs           for select using (true);
create policy "public_read_goals"   on goals          for select using (true);
create policy "public_read_records" on race_records   for select using (true);

-- Authenticated write
create policy "auth_insert_runs"    on runs           for insert to authenticated with check (true);
create policy "auth_update_runs"    on runs           for update to authenticated using (true);
create policy "auth_delete_runs"    on runs           for delete to authenticated using (true);

create policy "auth_insert_goals"   on goals          for insert to authenticated with check (true);
create policy "auth_update_goals"   on goals          for update to authenticated using (true);
create policy "auth_delete_goals"   on goals          for delete to authenticated using (true);

create policy "auth_insert_records" on race_records   for insert to authenticated with check (true);
create policy "auth_update_records" on race_records   for update to authenticated using (true);
create policy "auth_delete_records" on race_records   for delete to authenticated using (true);

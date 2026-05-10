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

-- ── Row Level Security (optional — enable if you add auth) ────────────────
-- alter table runs enable row level security;
-- alter table goals enable row level security;
-- alter table race_records enable row level security;

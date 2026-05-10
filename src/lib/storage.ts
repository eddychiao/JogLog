// Storage layer — currently backed by localStorage.
// To migrate to Supabase, replace each function body with the corresponding
// supabase.from('table').select/insert/update/delete call from src/lib/supabase.ts.

import type { Run, Goal, RaceRecord } from '../types';

const KEYS = {
  RUNS: 'runlog_runs',
  GOALS: 'runlog_goals',
  RECORDS: 'runlog_records',
};

function load<T>(key: string): T[] {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function persist<T>(key: string, items: T[]): void {
  localStorage.setItem(key, JSON.stringify(items));
}

// ── Runs ────────────────────────────────────────────────

export function getRuns(): Run[] {
  return load<Run>(KEYS.RUNS).sort((a, b) => b.date.localeCompare(a.date));
}

export function addRun(run: Run): void {
  const runs = load<Run>(KEYS.RUNS);
  persist(KEYS.RUNS, [...runs, run]);
}

export function updateRun(run: Run): void {
  const runs = load<Run>(KEYS.RUNS);
  persist(KEYS.RUNS, runs.map(r => (r.id === run.id ? run : r)));
}

export function deleteRun(id: string): void {
  persist(KEYS.RUNS, load<Run>(KEYS.RUNS).filter(r => r.id !== id));
}

// ── Goals ───────────────────────────────────────────────

export function getGoals(): Goal[] {
  return load<Goal>(KEYS.GOALS).sort((a, b) => b.created_at.localeCompare(a.created_at));
}

export function addGoal(goal: Goal): void {
  const goals = load<Goal>(KEYS.GOALS);
  persist(KEYS.GOALS, [...goals, goal]);
}

export function updateGoal(goal: Goal): void {
  const goals = load<Goal>(KEYS.GOALS);
  persist(KEYS.GOALS, goals.map(g => (g.id === goal.id ? goal : g)));
}

export function deleteGoal(id: string): void {
  persist(KEYS.GOALS, load<Goal>(KEYS.GOALS).filter(g => g.id !== id));
}

// ── Race Records ─────────────────────────────────────────

export function getRaceRecords(): RaceRecord[] {
  return load<RaceRecord>(KEYS.RECORDS).sort((a, b) => b.date.localeCompare(a.date));
}

export function addRaceRecord(record: RaceRecord): void {
  const records = load<RaceRecord>(KEYS.RECORDS);
  persist(KEYS.RECORDS, [...records, record]);
}

export function updateRaceRecord(record: RaceRecord): void {
  const records = load<RaceRecord>(KEYS.RECORDS);
  persist(KEYS.RECORDS, records.map(r => (r.id === record.id ? record : r)));
}

export function deleteRaceRecord(id: string): void {
  persist(KEYS.RECORDS, load<RaceRecord>(KEYS.RECORDS).filter(r => r.id !== id));
}

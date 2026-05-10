import type { Run, Goal, RaceRecord } from '../types';
import { supabase } from './supabase';

// Supabase returns numeric(10,2) columns as strings — cast them back.
function parseRun(r: Record<string, unknown>): Run {
  return { ...r, distance: Number(r.distance) } as Run;
}
function parseGoal(g: Record<string, unknown>): Goal {
  return { ...g, target_distance: Number(g.target_distance) } as Goal;
}
function parseRecord(r: Record<string, unknown>): RaceRecord {
  return { ...r, distance: r.distance != null ? Number(r.distance) : undefined } as RaceRecord;
}

// ── Runs ─────────────────────────────────────────────────────────────────

export async function getRuns(): Promise<Run[]> {
  const { data, error } = await supabase
    .from('runs')
    .select('*')
    .order('date', { ascending: false });
  if (error) throw error;
  return (data ?? []).map(parseRun);
}

export async function addRun(run: Run): Promise<void> {
  const { error } = await supabase.from('runs').insert(run);
  if (error) throw error;
}

export async function updateRun(run: Run): Promise<void> {
  const { error } = await supabase.from('runs').update(run).eq('id', run.id);
  if (error) throw error;
}

export async function deleteRun(id: string): Promise<void> {
  const { error } = await supabase.from('runs').delete().eq('id', id);
  if (error) throw error;
}

// ── Goals ────────────────────────────────────────────────────────────────

export async function getGoals(): Promise<Goal[]> {
  const { data, error } = await supabase
    .from('goals')
    .select('*')
    .order('created_at', { ascending: false });
  if (error) throw error;
  return (data ?? []).map(parseGoal);
}

export async function addGoal(goal: Goal): Promise<void> {
  const { error } = await supabase.from('goals').insert(goal);
  if (error) throw error;
}

export async function updateGoal(goal: Goal): Promise<void> {
  const { error } = await supabase.from('goals').update(goal).eq('id', goal.id);
  if (error) throw error;
}

export async function deleteGoal(id: string): Promise<void> {
  const { error } = await supabase.from('goals').delete().eq('id', id);
  if (error) throw error;
}

// ── Race Records ──────────────────────────────────────────────────────────

export async function getRaceRecords(): Promise<RaceRecord[]> {
  const { data, error } = await supabase
    .from('race_records')
    .select('*')
    .order('date', { ascending: false });
  if (error) throw error;
  return (data ?? []).map(parseRecord);
}

export async function addRaceRecord(record: RaceRecord): Promise<void> {
  const { error } = await supabase.from('race_records').insert(record);
  if (error) throw error;
}

export async function updateRaceRecord(record: RaceRecord): Promise<void> {
  const { error } = await supabase.from('race_records').update(record).eq('id', record.id);
  if (error) throw error;
}

export async function deleteRaceRecord(id: string): Promise<void> {
  const { error } = await supabase.from('race_records').delete().eq('id', id);
  if (error) throw error;
}

import { createContext, useContext, useState, useCallback, useEffect } from 'react';
import type { ReactNode } from 'react';
import type { Run, Goal, RaceRecord } from '../types';
import * as storage from '../lib/storage';

interface AppState {
  runs: Run[];
  goals: Goal[];
  raceRecords: RaceRecord[];
  loading: boolean;
  addRun: (run: Run) => Promise<void>;
  updateRun: (run: Run) => Promise<void>;
  deleteRun: (id: string) => Promise<void>;
  addGoal: (goal: Goal) => Promise<void>;
  updateGoal: (goal: Goal) => Promise<void>;
  deleteGoal: (id: string) => Promise<void>;
  addRaceRecord: (record: RaceRecord) => Promise<void>;
  updateRaceRecord: (record: RaceRecord) => Promise<void>;
  deleteRaceRecord: (id: string) => Promise<void>;
}

const AppContext = createContext<AppState | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [runs, setRuns] = useState<Run[]>([]);
  const [goals, setGoals] = useState<Goal[]>([]);
  const [raceRecords, setRaceRecords] = useState<RaceRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      storage.getRuns(),
      storage.getGoals(),
      storage.getRaceRecords(),
    ])
      .then(([r, g, rr]) => {
        setRuns(r);
        setGoals(g);
        setRaceRecords(rr);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  // Mutations use optimistic local updates so the UI responds instantly,
  // then the Supabase call persists in the background.

  const addRun = useCallback(async (run: Run) => {
    setRuns(prev => [run, ...prev].sort((a, b) => b.date.localeCompare(a.date)));
    await storage.addRun(run);
  }, []);

  const updateRun = useCallback(async (run: Run) => {
    setRuns(prev => prev.map(r => (r.id === run.id ? run : r)));
    await storage.updateRun(run);
  }, []);

  const deleteRun = useCallback(async (id: string) => {
    setRuns(prev => prev.filter(r => r.id !== id));
    await storage.deleteRun(id);
  }, []);

  const addGoal = useCallback(async (goal: Goal) => {
    setGoals(prev => [goal, ...prev]);
    await storage.addGoal(goal);
  }, []);

  const updateGoal = useCallback(async (goal: Goal) => {
    setGoals(prev => prev.map(g => (g.id === goal.id ? goal : g)));
    await storage.updateGoal(goal);
  }, []);

  const deleteGoal = useCallback(async (id: string) => {
    setGoals(prev => prev.filter(g => g.id !== id));
    await storage.deleteGoal(id);
  }, []);

  const addRaceRecord = useCallback(async (record: RaceRecord) => {
    setRaceRecords(prev => [record, ...prev]);
    await storage.addRaceRecord(record);
  }, []);

  const updateRaceRecord = useCallback(async (record: RaceRecord) => {
    setRaceRecords(prev => prev.map(r => (r.id === record.id ? record : r)));
    await storage.updateRaceRecord(record);
  }, []);

  const deleteRaceRecord = useCallback(async (id: string) => {
    setRaceRecords(prev => prev.filter(r => r.id !== id));
    await storage.deleteRaceRecord(id);
  }, []);

  if (loading) {
    return (
      <div className="app-loading">
        <div className="app-loading-spinner" />
        <p>Loading…</p>
      </div>
    );
  }

  return (
    <AppContext.Provider
      value={{
        runs, goals, raceRecords, loading,
        addRun, updateRun, deleteRun,
        addGoal, updateGoal, deleteGoal,
        addRaceRecord, updateRaceRecord, deleteRaceRecord,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp(): AppState {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used inside AppProvider');
  return ctx;
}

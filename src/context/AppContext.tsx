import { createContext, useContext, useState, useCallback } from 'react';
import type { ReactNode } from 'react';
import type { Run, Goal, RaceRecord } from '../types';
import * as storage from '../lib/storage';

interface AppState {
  runs: Run[];
  goals: Goal[];
  raceRecords: RaceRecord[];
  addRun: (run: Run) => void;
  updateRun: (run: Run) => void;
  deleteRun: (id: string) => void;
  addGoal: (goal: Goal) => void;
  updateGoal: (goal: Goal) => void;
  deleteGoal: (id: string) => void;
  addRaceRecord: (record: RaceRecord) => void;
  updateRaceRecord: (record: RaceRecord) => void;
  deleteRaceRecord: (id: string) => void;
}

const AppContext = createContext<AppState | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [runs, setRuns] = useState<Run[]>(() => storage.getRuns());
  const [goals, setGoals] = useState<Goal[]>(() => storage.getGoals());
  const [raceRecords, setRaceRecords] = useState<RaceRecord[]>(() => storage.getRaceRecords());

  const addRun = useCallback((run: Run) => {
    storage.addRun(run);
    setRuns(storage.getRuns());
  }, []);

  const updateRun = useCallback((run: Run) => {
    storage.updateRun(run);
    setRuns(storage.getRuns());
  }, []);

  const deleteRun = useCallback((id: string) => {
    storage.deleteRun(id);
    setRuns(storage.getRuns());
  }, []);

  const addGoal = useCallback((goal: Goal) => {
    storage.addGoal(goal);
    setGoals(storage.getGoals());
  }, []);

  const updateGoal = useCallback((goal: Goal) => {
    storage.updateGoal(goal);
    setGoals(storage.getGoals());
  }, []);

  const deleteGoal = useCallback((id: string) => {
    storage.deleteGoal(id);
    setGoals(storage.getGoals());
  }, []);

  const addRaceRecord = useCallback((record: RaceRecord) => {
    storage.addRaceRecord(record);
    setRaceRecords(storage.getRaceRecords());
  }, []);

  const updateRaceRecord = useCallback((record: RaceRecord) => {
    storage.updateRaceRecord(record);
    setRaceRecords(storage.getRaceRecords());
  }, []);

  const deleteRaceRecord = useCallback((id: string) => {
    storage.deleteRaceRecord(id);
    setRaceRecords(storage.getRaceRecords());
  }, []);

  return (
    <AppContext.Provider
      value={{
        runs, goals, raceRecords,
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

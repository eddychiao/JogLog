export interface Run {
  id: string;
  date: string;
  duration_seconds: number;
  distance: number;
  unit: 'miles' | 'km';
  notes?: string;
  created_at: string;
}

export interface Goal {
  id: string;
  name: string;
  target_distance: number;
  unit: 'miles' | 'km';
  start_date: string;
  end_date: string;
  created_at: string;
}

export type RaceType = '5k' | '10k' | 'half_marathon' | 'marathon' | 'custom';

export interface RaceRecord {
  id: string;
  race_name: string;
  race_type: RaceType;
  date: string;
  time_seconds: number;
  distance?: number;
  unit?: 'miles' | 'km';
  location?: string;
  notes?: string;
  created_at: string;
}

export const RACE_TYPE_LABELS: Record<RaceType, string> = {
  '5k': '5K',
  '10k': '10K',
  'half_marathon': 'Half Marathon',
  'marathon': 'Marathon',
  'custom': 'Custom',
};

export const RACE_TYPE_DISTANCES: Partial<Record<RaceType, { miles: number; km: number }>> = {
  '5k': { miles: 3.1069, km: 5 },
  '10k': { miles: 6.2137, km: 10 },
  'half_marathon': { miles: 13.1094, km: 21.0975 },
  'marathon': { miles: 26.2188, km: 42.195 },
};

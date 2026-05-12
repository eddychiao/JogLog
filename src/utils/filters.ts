import type { Run } from '../types';
import { toMiles } from './helpers';

export type FilterOperator = '<=' | '>=';
export type FilterField = 'distance' | 'duration';
export type DistanceUnit = 'miles' | 'km';

export interface DateRangeFilter {
  id: string;
  type: 'date_range';
  from: string;
  to: string;
}

export interface ComparisonFilter {
  id: string;
  type: 'comparison';
  field: FilterField;
  operator: FilterOperator;
  value: string;
  unit: DistanceUnit;
}

// Union type — extend here when adding new filter variants
export type FilterRow = DateRangeFilter | ComparisonFilter;

export function makeFilter(type: FilterRow['type']): FilterRow {
  const id = crypto.randomUUID();
  if (type === 'date_range') {
    return { id, type: 'date_range', from: '', to: '' };
  }
  return { id, type: 'comparison', field: 'distance', operator: '>=', value: '', unit: 'miles' };
}

export function applyFilters(runs: Run[], filters: FilterRow[]): Run[] {
  if (filters.length === 0) return runs;
  return runs.filter(run => {
    for (const filter of filters) {
      if (filter.type === 'date_range') {
        if (filter.from && run.date < filter.from) return false;
        if (filter.to && run.date > filter.to) return false;
      } else if (filter.type === 'comparison') {
        const val = parseFloat(filter.value);
        if (!filter.value || isNaN(val)) continue;

        if (filter.field === 'distance') {
          const runMiles = toMiles(run.distance, run.unit);
          const filterMiles = filter.unit === 'km' ? val * 0.621371 : val;
          if (filter.operator === '<=' && runMiles > filterMiles) return false;
          if (filter.operator === '>=' && runMiles < filterMiles) return false;
        } else if (filter.field === 'duration') {
          // value entered in minutes
          const filterSeconds = val * 60;
          if (filter.operator === '<=' && run.duration_seconds > filterSeconds) return false;
          if (filter.operator === '>=' && run.duration_seconds < filterSeconds) return false;
        }
      }
    }
    return true;
  });
}

export function countActiveFilters(filters: FilterRow[]): number {
  return filters.filter(f => {
    if (f.type === 'date_range') return !!(f.from || f.to);
    if (f.type === 'comparison') return !!f.value;
    return false;
  }).length;
}

import type { Run } from '../types';
import { formatDuration, formatPace, formatPaceKm, toKm, toMiles } from './helpers';

function escapeCsvField(value: string): string {
  if (/[",\n]/.test(value)) {
    return `"${value.replace(/"/g, '""')}"`;
  }
  return value;
}

export function runsToCsv(runs: Run[]): string {
  const headers = ['Date', 'Distance', 'Unit', 'Duration', 'Pace', 'Notes'];
  const rows = runs.map(run => {
    const pace =
      run.unit === 'miles'
        ? formatPace(run.duration_seconds, toMiles(run.distance, run.unit))
        : formatPaceKm(run.duration_seconds, toKm(run.distance, run.unit));

    return [
      run.date,
      String(run.distance),
      run.unit,
      formatDuration(run.duration_seconds),
      pace,
      run.notes ?? '',
    ]
      .map(escapeCsvField)
      .join(',');
  });

  // Leading BOM so Excel opens UTF-8 CSVs correctly
  return '﻿' + [headers.join(','), ...rows].join('\n');
}

export function downloadCsv(filename: string, csv: string): void {
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

import {
  LineChart, Line, BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer,
} from 'recharts';
import type { Run } from '../types';
import { toMiles, paceSecondsPerMile, formatShortDate } from '../utils/helpers';
import './Charts.css';

interface PaceChartProps {
  runs: Run[];
}

export function PaceChart({ runs }: PaceChartProps) {
  const data = [...runs]
    .sort((a, b) => a.date.localeCompare(b.date))
    .slice(-20)
    .map(run => {
      const miles = toMiles(run.distance, run.unit);
      const paceSecPerMile = paceSecondsPerMile(run.duration_seconds, miles);
      return {
        date: formatShortDate(run.date),
        pace: paceSecPerMile > 0 ? parseFloat((paceSecPerMile / 60).toFixed(2)) : null,
      };
    })
    .filter(d => d.pace !== null);

  if (data.length < 2) {
    return (
      <div className="chart-placeholder">
        <p>Log at least 2 runs to see your pace trend.</p>
      </div>
    );
  }

  return (
    <div className="chart-container">
      <ResponsiveContainer width="100%" height={180}>
        <LineChart data={data} margin={{ top: 4, right: 8, left: -20, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
          <XAxis dataKey="date" tick={{ fontSize: 11, fill: 'var(--text-muted)' }} />
          <YAxis
            tick={{ fontSize: 11, fill: 'var(--text-muted)' }}
            domain={['dataMin - 0.5', 'dataMax + 0.5']}
            tickFormatter={v => `${Math.floor(v)}:${String(Math.round((v % 1) * 60)).padStart(2, '0')}`}
          />
          <Tooltip
            formatter={(v: unknown) => {
              const n = typeof v === 'number' ? v : 0;
              const min = Math.floor(n);
              const sec = Math.round((n - min) * 60);
              return [`${min}:${String(sec).padStart(2, '0')} /mi`, 'Pace'];
            }}
            contentStyle={{ fontSize: 13, borderRadius: 8, border: '1px solid var(--border)' }}
          />
          <Line
            type="monotone"
            dataKey="pace"
            stroke="var(--primary)"
            strokeWidth={2.5}
            dot={{ r: 4, fill: 'var(--primary)', strokeWidth: 0 }}
            activeDot={{ r: 6 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

interface WeeklyDistanceChartProps {
  runs: Run[];
}

export function WeeklyDistanceChart({ runs }: WeeklyDistanceChartProps) {
  const weekMap: Record<string, number> = {};

  runs.forEach(run => {
    const date = new Date(run.date + 'T00:00:00');
    const dayOfWeek = date.getDay();
    const monday = new Date(date);
    monday.setDate(date.getDate() - ((dayOfWeek + 6) % 7));
    const weekKey = monday.toISOString().split('T')[0];
    const miles = toMiles(run.distance, run.unit);
    weekMap[weekKey] = (weekMap[weekKey] ?? 0) + miles;
  });

  const data = Object.entries(weekMap)
    .sort(([a], [b]) => a.localeCompare(b))
    .slice(-12)
    .map(([date, miles]) => ({
      week: formatShortDate(date),
      miles: parseFloat(miles.toFixed(1)),
    }));

  if (data.length === 0) {
    return (
      <div className="chart-placeholder">
        <p>No runs logged yet.</p>
      </div>
    );
  }

  return (
    <div className="chart-container">
      <ResponsiveContainer width="100%" height={180}>
        <BarChart data={data} margin={{ top: 4, right: 8, left: -20, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
          <XAxis dataKey="week" tick={{ fontSize: 11, fill: 'var(--text-muted)' }} />
          <YAxis tick={{ fontSize: 11, fill: 'var(--text-muted)' }} />
          <Tooltip
            formatter={(v: unknown) => [`${typeof v === 'number' ? v : 0} mi`, 'Distance']}
            contentStyle={{ fontSize: 13, borderRadius: 8, border: '1px solid var(--border)' }}
          />
          <Bar dataKey="miles" fill="var(--primary)" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

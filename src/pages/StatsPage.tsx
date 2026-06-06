import { useMemo, useState } from 'react';
import { useApp } from '../context/AppContext';
import Header from '../components/Header';
import StatsCard from '../components/StatsCard';
import { PaceChart, WeeklyDistanceChart } from '../components/Charts';
import { toMiles, formatPace, formatDuration, paceSecondsPerMile, currentYear } from '../utils/helpers';
import './StatsPage.css';

type TimeRange = '30d' | '90d' | 'year' | 'all';

const RANGE_LABELS: Record<TimeRange, string> = {
  '30d': '30 Days',
  '90d': '90 Days',
  'year': 'This Year',
  'all': 'All Time',
};

function getCutoffDate(range: TimeRange): string | null {
  if (range === 'all') return null;
  if (range === 'year') return `${currentYear()}-01-01`;
  const days = range === '30d' ? 30 : 90;
  const d = new Date();
  d.setDate(d.getDate() - days);
  return d.toISOString().split('T')[0];
}

function computeLongestStreak(dates: string[]): number {
  if (dates.length === 0) return 0;
  const sorted = [...new Set(dates)].sort();
  let max = 1, current = 1;
  for (let i = 1; i < sorted.length; i++) {
    const prev = new Date(sorted[i - 1] + 'T00:00:00');
    const curr = new Date(sorted[i] + 'T00:00:00');
    const diffDays = Math.round((curr.getTime() - prev.getTime()) / 86400000);
    if (diffDays === 1) {
      current++;
      if (current > max) max = current;
    } else {
      current = 1;
    }
  }
  return max;
}

export default function StatsPage() {
  const { runs } = useApp();
  const [range, setRange] = useState<TimeRange>('year');

  const { filteredRuns, stats } = useMemo(() => {
    if (runs.length === 0) return { filteredRuns: [], stats: null };

    const cutoff = getCutoffDate(range);
    const filtered = cutoff ? runs.filter(r => r.date >= cutoff) : runs;

    if (filtered.length === 0) return { filteredRuns: filtered, stats: null };

    const totalMiles = filtered.reduce((s, r) => s + toMiles(r.distance, r.unit), 0);
    const totalSeconds = filtered.reduce((s, r) => s + r.duration_seconds, 0);
    const avgDistance = totalMiles / filtered.length;

    const startDate = cutoff
      ? new Date(cutoff + 'T00:00:00')
      : new Date(filtered[filtered.length - 1].date + 'T00:00:00');
    const weeks = Math.max(1, (Date.now() - startDate.getTime()) / (7 * 86400000));
    const avgWeeklyMiles = totalMiles / weeks;

    const paces = filtered
      .map(r => ({ pace: paceSecondsPerMile(r.duration_seconds, toMiles(r.distance, r.unit)), run: r }))
      .filter(p => p.pace > 0);

    const bestPaceEntry = paces.length > 0 ? paces.reduce((a, b) => (a.pace < b.pace ? a : b)) : null;
    const avgPaceSeconds = paces.length > 0 ? paces.reduce((s, p) => s + p.pace, 0) / paces.length : 0;

    const longestRun = filtered.reduce((a, b) =>
      toMiles(a.distance, a.unit) > toMiles(b.distance, b.unit) ? a : b,
    );

    // Streaks are always computed on all runs since they track continuity from today
    let currentStreak = 0;
    const allRunDates = new Set(runs.map(r => r.date));
    const checkDate = new Date();
    while (allRunDates.has(checkDate.toISOString().split('T')[0])) {
      currentStreak++;
      checkDate.setDate(checkDate.getDate() - 1);
    }
    const longestStreak = computeLongestStreak(runs.map(r => r.date));

    return {
      filteredRuns: filtered,
      stats: {
        totalMiles,
        totalRuns: filtered.length,
        totalSeconds,
        avgDistance,
        avgWeeklyMiles,
        bestPace: bestPaceEntry
          ? formatPace(bestPaceEntry.run.duration_seconds, toMiles(bestPaceEntry.run.distance, bestPaceEntry.run.unit))
          : '--:--',
        avgPace: avgPaceSeconds > 0 ? formatPace(Math.round(avgPaceSeconds), 1) : '--:--',
        longestMiles: toMiles(longestRun.distance, longestRun.unit),
        currentStreak,
        longestStreak,
      },
    };
  }, [runs, range]);

  return (
    <>
      <Header title="Stats" />
      <div className="page">
        {runs.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">📊</div>
            <p>Log some runs to see your stats!</p>
          </div>
        ) : (
          <>
            <div className="time-range-picker">
              {(['30d', '90d', 'year', 'all'] as TimeRange[]).map(r => (
                <button
                  key={r}
                  className={`time-range-btn${range === r ? ' active' : ''}`}
                  onClick={() => setRange(r)}
                >
                  {RANGE_LABELS[r]}
                </button>
              ))}
            </div>

            {!stats ? (
              <div className="empty-state">
                <div className="empty-state-icon">🏃</div>
                <p>No runs in this period.</p>
              </div>
            ) : (
              <>
                <div className="stats-grid-2">
                  <StatsCard label="Total Miles" value={stats.totalMiles.toFixed(1)} icon="🗺️" accent />
                  <StatsCard label="Avg / Week" value={`${stats.avgWeeklyMiles.toFixed(1)} mi`} icon="📅" />
                  <StatsCard label="Total Runs" value={String(stats.totalRuns)} icon="🏃" />
                  <StatsCard label="Avg Distance" value={`${stats.avgDistance.toFixed(2)} mi`} icon="📏" />
                  <StatsCard label="Best Pace" value={stats.bestPace} icon="⚡" />
                  <StatsCard label="Avg Pace" value={stats.avgPace} icon="📈" />
                  <StatsCard label="Longest Run" value={`${stats.longestMiles.toFixed(2)} mi`} icon="🛣️" />
                  <StatsCard label="Total Time" value={formatDuration(stats.totalSeconds)} icon="⏱️" />
                </div>

                <div className="stats-row-2">
                  <StatsCard label="Current Streak" value={`${stats.currentStreak}d`} icon="🔥" />
                  <StatsCard label="Longest Streak" value={`${stats.longestStreak}d`} icon="🏆" />
                </div>

                <div className="charts-row">
                  <section className="chart-section">
                    <h2 className="section-title">Pace Trend</h2>
                    <div className="card chart-card">
                      <PaceChart runs={filteredRuns} />
                    </div>
                  </section>

                  <section className="chart-section">
                    <h2 className="section-title">Weekly Distance</h2>
                    <div className="card chart-card">
                      <WeeklyDistanceChart runs={filteredRuns} />
                    </div>
                  </section>
                </div>
              </>
            )}
          </>
        )}
      </div>
    </>
  );
}

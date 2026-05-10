import { useMemo } from 'react';
import { useApp } from '../context/AppContext';
import Header from '../components/Header';
import StatsCard from '../components/StatsCard';
import { PaceChart, WeeklyDistanceChart } from '../components/Charts';
import { toMiles, formatPace, formatDuration, paceSecondsPerMile, startOfYear, currentYear } from '../utils/helpers';
import './StatsPage.css';

export default function StatsPage() {
  const { runs } = useApp();

  const stats = useMemo(() => {
    if (runs.length === 0) return null;

    const yearStart = startOfYear(currentYear());
    const yearRuns = runs.filter(r => r.date >= yearStart);

    const totalMiles = runs.reduce((s, r) => s + toMiles(r.distance, r.unit), 0);
    const yearMiles = yearRuns.reduce((s, r) => s + toMiles(r.distance, r.unit), 0);
    const totalSeconds = runs.reduce((s, r) => s + r.duration_seconds, 0);

    const paces = runs
      .map(r => ({ pace: paceSecondsPerMile(r.duration_seconds, toMiles(r.distance, r.unit)), run: r }))
      .filter(p => p.pace > 0);

    const bestPace = paces.length > 0 ? paces.reduce((a, b) => (a.pace < b.pace ? a : b)) : null;
    const avgPaceSeconds = paces.length > 0 ? paces.reduce((s, p) => s + p.pace, 0) / paces.length : 0;

    const longestRun = runs.reduce((a, b) =>
      toMiles(a.distance, a.unit) > toMiles(b.distance, b.unit) ? a : b,
    );

    let currentStreak = 0;
    const runDates = new Set(runs.map(r => r.date));
    const checkDate = new Date();
    while (runDates.has(checkDate.toISOString().split('T')[0])) {
      currentStreak++;
      checkDate.setDate(checkDate.getDate() - 1);
    }

    return {
      totalMiles,
      yearMiles,
      totalRuns: runs.length,
      totalSeconds,
      bestPace: bestPace ? formatPace(bestPace.run.duration_seconds, toMiles(bestPace.run.distance, bestPace.run.unit)) : '--:--',
      avgPace: avgPaceSeconds > 0 ? formatPace(Math.round(avgPaceSeconds), 1) : '--:--',
      longestMiles: toMiles(longestRun.distance, longestRun.unit),
      currentStreak,
    };
  }, [runs]);

  return (
    <>
      <Header title="Stats" />
      <div className="page">
        {!stats ? (
          <div className="empty-state">
            <div className="empty-state-icon">📊</div>
            <p>Log some runs to see your stats!</p>
          </div>
        ) : (
          <>
            <div className="stats-grid-2">
              <StatsCard label="Total Miles" value={stats.totalMiles.toFixed(1)} icon="🗺️" accent />
              <StatsCard label="This Year" value={`${stats.yearMiles.toFixed(1)} mi`} icon="📅" />
              <StatsCard label="Total Runs" value={String(stats.totalRuns)} icon="🏃" />
              <StatsCard label="Total Time" value={formatDuration(stats.totalSeconds)} icon="⏱️" />
              <StatsCard label="Best Pace" value={stats.bestPace} icon="⚡" />
              <StatsCard label="Avg Pace" value={stats.avgPace} icon="📈" />
              <StatsCard label="Longest Run" value={`${stats.longestMiles.toFixed(2)} mi`} icon="🛣️" />
              <StatsCard label="Current Streak" value={`${stats.currentStreak}d`} icon="🔥" />
            </div>

            <section className="chart-section">
              <h2 className="section-title">Pace Trend</h2>
              <div className="card chart-card">
                <PaceChart runs={runs} />
              </div>
            </section>

            <section className="chart-section">
              <h2 className="section-title">Weekly Distance</h2>
              <div className="card chart-card">
                <WeeklyDistanceChart runs={runs} />
              </div>
            </section>
          </>
        )}
      </div>
    </>
  );
}

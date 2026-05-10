import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import Header from '../components/Header';
import StatsCard from '../components/StatsCard';
import RunList from '../components/RunList';
import GoalCard from '../components/GoalCard';
import { toMiles, formatPace, today, startOfYear, currentYear } from '../utils/helpers';
import './Dashboard.css';

export default function Dashboard() {
  const { runs, goals } = useApp();

  const stats = useMemo(() => {
    const now = new Date();
    const yearStart = startOfYear(currentYear());
    const weekStart = new Date(now);
    weekStart.setDate(now.getDate() - now.getDay());
    const weekStartStr = weekStart.toISOString().split('T')[0];

    let weekMiles = 0;
    let monthMiles = 0;
    let yearMiles = 0;
    const monthStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;

    for (const run of runs) {
      const miles = toMiles(run.distance, run.unit);
      if (run.date >= yearStart) yearMiles += miles;
      if (run.date.startsWith(monthStr)) monthMiles += miles;
      if (run.date >= weekStartStr) weekMiles += miles;
    }

    let bestPaceStr = '--:--';
    let bestPaceRun = null as typeof runs[0] | null;
    for (const run of runs) {
      if (!bestPaceRun) { bestPaceRun = run; continue; }
      const miles = toMiles(run.distance, run.unit);
      const bestMiles = toMiles(bestPaceRun.distance, bestPaceRun.unit);
      if (miles > 0 && run.duration_seconds / miles < bestPaceRun.duration_seconds / bestMiles) {
        bestPaceRun = run;
      }
    }
    if (bestPaceRun) {
      const m = toMiles(bestPaceRun.distance, bestPaceRun.unit);
      bestPaceStr = formatPace(bestPaceRun.duration_seconds, m);
    }

    return { weekMiles, monthMiles, yearMiles, bestPaceStr, totalRuns: runs.length };
  }, [runs]);

  const activeGoals = goals.filter(g => g.end_date >= today()).slice(0, 2);
  const recentRuns = runs.slice(0, 5);

  return (
    <>
      <Header title="RunLog" subtitle="Track your miles" />
      <div className="page">
        <div className="dashboard-hero">
          <div className="hero-stat">
            <span className="hero-value">{stats.yearMiles.toFixed(1)}</span>
            <span className="hero-label">Miles this year</span>
          </div>
          <div className="hero-divider" />
          <div className="hero-stat">
            <span className="hero-value">{stats.totalRuns}</span>
            <span className="hero-label">Total runs</span>
          </div>
        </div>

        <div className="stats-grid">
          <StatsCard label="This Week" value={`${stats.weekMiles.toFixed(1)} mi`} icon="📅" />
          <StatsCard label="This Month" value={`${stats.monthMiles.toFixed(1)} mi`} icon="📆" />
          <StatsCard label="Best Pace" value={stats.bestPaceStr} icon="⚡" />
        </div>

        {activeGoals.length > 0 && (
          <section>
            <div className="section-header">
              <h2 className="section-title">Active Goals</h2>
              <Link to="/goals" className="section-link">See all</Link>
            </div>
            {activeGoals.map(goal => (
              <GoalCard key={goal.id} goal={goal} runs={runs} />
            ))}
          </section>
        )}

        <section>
          <div className="section-header">
            <h2 className="section-title">Recent Runs</h2>
            <Link to="/log" className="section-link">See all</Link>
          </div>
          <RunList runs={recentRuns} limit={5} />
        </section>

        <Link to="/log" className="fab">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
        </Link>
      </div>
    </>
  );
}

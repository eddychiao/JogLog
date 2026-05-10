import type { Goal, Run } from '../types';
import { toMiles, daysRemaining, weeksRemaining, formatDate } from '../utils/helpers';
import './GoalCard.css';

interface GoalCardProps {
  goal: Goal;
  runs: Run[];
  onDelete?: (id: string) => void;
}

export default function GoalCard({ goal, runs, onDelete }: GoalCardProps) {
  const relevantRuns = runs.filter(
    r => r.date >= goal.start_date && r.date <= goal.end_date,
  );

  const completedMiles = relevantRuns.reduce((sum, r) => sum + toMiles(r.distance, r.unit), 0);
  const targetMiles = goal.unit === 'km' ? goal.target_distance * 0.621371 : goal.target_distance;
  const progress = Math.min(100, (completedMiles / targetMiles) * 100);
  const remaining = Math.max(0, targetMiles - completedMiles);
  const days = daysRemaining(goal.end_date);
  const weeks = weeksRemaining(goal.end_date);
  const perWeek = weeks > 0 ? remaining / weeks : remaining;
  const perDay = days > 0 ? remaining / days : remaining;
  const done = completedMiles >= targetMiles;

  const displayUnit = goal.unit;
  const completedDisplay = displayUnit === 'km'
    ? (completedMiles / 0.621371).toFixed(1)
    : completedMiles.toFixed(1);
  const remainingDisplay = displayUnit === 'km'
    ? (remaining / 0.621371).toFixed(1)
    : remaining.toFixed(1);
  const perWeekDisplay = displayUnit === 'km'
    ? (perWeek / 0.621371).toFixed(1)
    : perWeek.toFixed(1);
  const perDayDisplay = displayUnit === 'km'
    ? (perDay / 0.621371).toFixed(1)
    : perDay.toFixed(1);

  return (
    <div className={`goal-card card${done ? ' goal-card--done' : ''}`}>
      <div className="goal-card-header">
        <div>
          <h3 className="goal-name">{goal.name}</h3>
          <p className="goal-dates">
            {formatDate(goal.start_date)} – {formatDate(goal.end_date)}
          </p>
        </div>
        {done && <span className="goal-done-badge">✓ Done!</span>}
        {onDelete && !done && (
          <button
            className="btn btn-secondary btn-sm"
            onClick={() => onDelete(goal.id)}
          >
            ✕
          </button>
        )}
      </div>

      <div className="goal-progress-row">
        <span className="goal-progress-label">
          {completedDisplay} / {goal.target_distance} {displayUnit}
        </span>
        <span className="goal-progress-pct">{progress.toFixed(0)}%</span>
      </div>

      <div className="goal-progress-bar">
        <div
          className="goal-progress-fill"
          style={{ width: `${progress}%` }}
        />
      </div>

      {!done && days > 0 && (
        <div className="goal-projections">
          <div className="goal-projection">
            <span className="goal-projection-value">{remainingDisplay} {displayUnit}</span>
            <span className="goal-projection-label">remaining</span>
          </div>
          <div className="goal-projection">
            <span className="goal-projection-value">{perWeekDisplay} {displayUnit}</span>
            <span className="goal-projection-label">/ week needed</span>
          </div>
          <div className="goal-projection">
            <span className="goal-projection-value">{perDayDisplay} {displayUnit}</span>
            <span className="goal-projection-label">/ day needed</span>
          </div>
        </div>
      )}
    </div>
  );
}

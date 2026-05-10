import { useState } from 'react';
import type { Run } from '../types';
import { formatDate, formatDuration, formatPace, formatPaceKm, toMiles, toKm } from '../utils/helpers';
import './RunList.css';

interface RunListProps {
  runs: Run[];
  onEdit?: (run: Run) => void;
  onDelete?: (id: string) => void;
  limit?: number;
}

export default function RunList({ runs, onEdit, onDelete, limit }: RunListProps) {
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);

  const displayed = limit ? runs.slice(0, limit) : runs;

  if (displayed.length === 0) {
    return (
      <div className="empty-state">
        <div className="empty-state-icon">🏃</div>
        <p>No runs logged yet. Start tracking!</p>
      </div>
    );
  }

  function handleDelete(id: string) {
    if (confirmDelete === id) {
      onDelete?.(id);
      setConfirmDelete(null);
    } else {
      setConfirmDelete(id);
    }
  }

  return (
    <div className="run-list">
      {displayed.map(run => {
        const miles = toMiles(run.distance, run.unit);
        const km = toKm(run.distance, run.unit);
        const pace = run.unit === 'miles'
          ? formatPace(run.duration_seconds, miles)
          : formatPaceKm(run.duration_seconds, km);

        return (
          <div key={run.id} className="run-card card">
            <div className="run-card-header">
              <span className="run-date">{formatDate(run.date)}</span>
              <span className="run-distance-badge">
                {run.distance} {run.unit}
              </span>
            </div>
            <div className="run-stats">
              <div className="run-stat">
                <span className="run-stat-value">{formatDuration(run.duration_seconds)}</span>
                <span className="run-stat-label">Time</span>
              </div>
              <div className="run-stat-divider" />
              <div className="run-stat">
                <span className="run-stat-value">{pace}</span>
                <span className="run-stat-label">Pace</span>
              </div>
              <div className="run-stat-divider" />
              <div className="run-stat">
                <span className="run-stat-value">{miles.toFixed(2)}</span>
                <span className="run-stat-label">Miles</span>
              </div>
            </div>
            {run.notes && <p className="run-notes-text">{run.notes}</p>}
            {(onEdit || onDelete) && (
              <div className="run-card-actions">
                {onEdit && (
                  <button className="btn btn-secondary btn-sm" onClick={() => onEdit(run)}>
                    Edit
                  </button>
                )}
                {onDelete && (
                  <button
                    className={`btn btn-sm ${confirmDelete === run.id ? 'btn-danger' : 'btn-secondary'}`}
                    onClick={() => handleDelete(run.id)}
                  >
                    {confirmDelete === run.id ? 'Confirm?' : 'Delete'}
                  </button>
                )}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

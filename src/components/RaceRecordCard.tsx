import type { RaceRecord } from '../types';
import { RACE_TYPE_LABELS, RACE_TYPE_DISTANCES } from '../types';
import { formatDuration, formatDate, toMiles, formatPace } from '../utils/helpers';
import './RaceRecord.css';

interface RaceRecordCardProps {
  record: RaceRecord;
  isBest?: boolean;
  onDelete?: (id: string) => void;
}

export default function RaceRecordCard({ record, isBest, onDelete }: RaceRecordCardProps) {
  const stdDist = RACE_TYPE_DISTANCES[record.race_type];
  let paceStr = '--:--';

  if (stdDist) {
    paceStr = formatPace(record.time_seconds, stdDist.miles);
  } else if (record.distance && record.unit) {
    const miles = toMiles(record.distance, record.unit);
    paceStr = formatPace(record.time_seconds, miles);
  }

  return (
    <div className={`race-card card${isBest ? ' race-card--best' : ''}`}>
      <div className="race-card-header">
        <div>
          <div className="race-type-badge">{RACE_TYPE_LABELS[record.race_type]}</div>
          <h3 className="race-name">{record.race_name}</h3>
          {record.location && <p className="race-location">{record.location}</p>}
        </div>
        <div className="race-card-right">
          {isBest && <span className="race-best-badge">🏆 PR</span>}
          {onDelete && (
            <button className="btn btn-secondary btn-sm" onClick={() => onDelete(record.id)}>✕</button>
          )}
        </div>
      </div>

      <div className="race-stats">
        <div className="race-stat">
          <span className="race-stat-value">{formatDuration(record.time_seconds)}</span>
          <span className="race-stat-label">Finish Time</span>
        </div>
        <div className="run-stat-divider" />
        <div className="race-stat">
          <span className="race-stat-value">{paceStr}</span>
          <span className="race-stat-label">Avg Pace</span>
        </div>
        <div className="run-stat-divider" />
        <div className="race-stat">
          <span className="race-stat-value">{formatDate(record.date)}</span>
          <span className="race-stat-label">Date</span>
        </div>
      </div>

      {record.notes && <p className="race-notes">{record.notes}</p>}
    </div>
  );
}

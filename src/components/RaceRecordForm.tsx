import { useState } from 'react';
import type { RaceRecord, RaceType } from '../types';
import { RACE_TYPE_LABELS } from '../types';
import { generateId, today, secondsFromHMS, hmsFromSeconds } from '../utils/helpers';
import './GoalForm.css';

interface RaceRecordFormProps {
  onSubmit: (record: RaceRecord) => void;
  initialRecord?: RaceRecord | null;
  onCancel?: () => void;
}

const RACE_TYPES: RaceType[] = ['5k', '10k', 'half_marathon', 'marathon', 'murph', 'custom'];

export default function RaceRecordForm({ onSubmit, initialRecord, onCancel }: RaceRecordFormProps) {
  const [raceName, setRaceName] = useState(initialRecord?.race_name ?? '');
  const [raceType, setRaceType] = useState<RaceType>(initialRecord?.race_type ?? '5k');
  const [date, setDate] = useState(initialRecord?.date ?? today());
  const [hours, setHours] = useState(() => {
    if (!initialRecord) return '0';
    return String(hmsFromSeconds(initialRecord.time_seconds).h);
  });
  const [minutes, setMinutes] = useState(() => {
    if (!initialRecord) return '';
    return String(hmsFromSeconds(initialRecord.time_seconds).m);
  });
  const [secs, setSecs] = useState(() => {
    if (!initialRecord) return '';
    return String(hmsFromSeconds(initialRecord.time_seconds).s);
  });
  const [distance, setDistance] = useState(initialRecord?.distance?.toString() ?? '');
  const [unit, setUnit] = useState<'miles' | 'km'>(initialRecord?.unit ?? 'miles');
  const [location, setLocation] = useState(initialRecord?.location ?? '');
  const [notes, setNotes] = useState(initialRecord?.notes ?? '');

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const totalSeconds = secondsFromHMS(
      parseInt(hours) || 0,
      parseInt(minutes) || 0,
      parseInt(secs) || 0,
    );
    if (totalSeconds === 0) return;

    onSubmit({
      id: initialRecord?.id ?? generateId(),
      race_name: raceName.trim(),
      race_type: raceType,
      date,
      time_seconds: totalSeconds,
      distance: raceType === 'custom' && distance ? parseFloat(distance) : undefined,
      unit: raceType === 'custom' && distance ? unit : undefined,
      location: location.trim() || undefined,
      notes: notes.trim() || undefined,
      created_at: initialRecord?.created_at ?? new Date().toISOString(),
    });

    if (!initialRecord) {
      setRaceName('');
      setRaceType('5k');
      setDate(today());
      setHours('0');
      setMinutes('');
      setSecs('');
      setDistance('');
      setLocation('');
      setNotes('');
      onCancel?.();
    }
  }

  return (
    <form className="goal-form card" onSubmit={handleSubmit}>
      <h2 className="form-heading">{initialRecord ? 'Edit Record' : 'Add Race Record'}</h2>

      <div className="form-group">
        <label className="form-label">Race Name</label>
        <input
          type="text"
          className="form-input"
          placeholder="e.g. Boston Marathon 2025"
          value={raceName}
          onChange={e => setRaceName(e.target.value)}
          required
        />
      </div>

      <div className="form-row">
        <div className="form-group">
          <label className="form-label">Race Type</label>
          <select
            className="form-input"
            value={raceType}
            onChange={e => setRaceType(e.target.value as RaceType)}
          >
            {RACE_TYPES.map(t => (
              <option key={t} value={t}>{RACE_TYPE_LABELS[t]}</option>
            ))}
          </select>
        </div>
        <div className="form-group">
          <label className="form-label">Date</label>
          <input
            type="date"
            className="form-input"
            value={date}
            max={today()}
            onChange={e => setDate(e.target.value)}
            required
          />
        </div>
      </div>

      <div className="form-group">
        <label className="form-label">Finish Time</label>
        <div className="duration-row">
          <div className="duration-field">
            <input type="number" className="form-input duration-input" placeholder="0" min="0" value={hours} onChange={e => setHours(e.target.value)} />
            <span className="duration-unit">h</span>
          </div>
          <div className="duration-field">
            <input type="number" className="form-input duration-input" placeholder="00" min="0" max="59" value={minutes} onChange={e => setMinutes(e.target.value)} required />
            <span className="duration-unit">m</span>
          </div>
          <div className="duration-field">
            <input type="number" className="form-input duration-input" placeholder="00" min="0" max="59" value={secs} onChange={e => setSecs(e.target.value)} />
            <span className="duration-unit">s</span>
          </div>
        </div>
      </div>

      {raceType === 'custom' && (
        <div className="form-row">
          <div className="form-group" style={{ flex: 2 }}>
            <label className="form-label">Distance</label>
            <input
              type="number"
              className="form-input"
              placeholder="0.0"
              step="0.01"
              min="0"
              value={distance}
              onChange={e => setDistance(e.target.value)}
            />
          </div>
          <div className="form-group" style={{ flex: 1 }}>
            <label className="form-label">Unit</label>
            <select className="form-input" value={unit} onChange={e => setUnit(e.target.value as 'miles' | 'km')}>
              <option value="miles">Miles</option>
              <option value="km">KM</option>
            </select>
          </div>
        </div>
      )}

      <div className="form-group">
        <label className="form-label">Location (optional)</label>
        <input
          type="text"
          className="form-input"
          placeholder="City, State"
          value={location}
          onChange={e => setLocation(e.target.value)}
        />
      </div>

      <div className="form-group">
        <label className="form-label">Notes (optional)</label>
        <textarea
          className="form-input run-notes"
          placeholder="How did it go?"
          value={notes}
          onChange={e => setNotes(e.target.value)}
          rows={2}
        />
      </div>

      <div className="form-actions">
        {onCancel && (
          <button type="button" className="btn btn-secondary" onClick={onCancel}>
            Cancel
          </button>
        )}
        <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>
          {initialRecord ? 'Save Changes' : 'Add Record'}
        </button>
      </div>
    </form>
  );
}

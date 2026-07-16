import { useState, useEffect } from 'react';
import type { Run } from '../types';
import { generateId, today, secondsFromHMS, hmsFromSeconds } from '../utils/helpers';
import './RunForm.css';

interface RunFormProps {
  onSubmit: (run: Run) => Promise<void>;
  initialRun?: Run | null;
  onCancel?: () => void;
}

export default function RunForm({ onSubmit, initialRun, onCancel }: RunFormProps) {
  const [date, setDate] = useState(today());
  const [hours, setHours] = useState('0');
  const [minutes, setMinutes] = useState('');
  const [seconds, setSeconds] = useState('');
  const [distance, setDistance] = useState('');
  const [unit, setUnit] = useState<'miles' | 'km'>('miles');
  const [notes, setNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (initialRun) {
      setDate(initialRun.date);
      const { h, m, s } = hmsFromSeconds(initialRun.duration_seconds);
      setHours(String(h));
      setMinutes(String(m));
      setSeconds(String(s));
      setDistance(String(initialRun.distance));
      setUnit(initialRun.unit);
      setNotes(initialRun.notes ?? '');
    }
  }, [initialRun]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (date > today()) return;
    const totalSeconds = secondsFromHMS(
      parseInt(hours) || 0,
      parseInt(minutes) || 0,
      parseInt(seconds) || 0,
    );
    if (totalSeconds === 0 || !distance) return;

    const run: Run = {
      id: initialRun?.id ?? generateId(),
      date,
      duration_seconds: totalSeconds,
      distance: parseFloat(distance),
      unit,
      notes: notes.trim() || undefined,
      created_at: initialRun?.created_at ?? new Date().toISOString(),
    };

    setSubmitting(true);
    try {
      await onSubmit(run);
      if (!initialRun) {
        setDate(today());
        setHours('0');
        setMinutes('');
        setSeconds('');
        setDistance('');
        setNotes('');
      }
    } catch {
      // Keep the entered values so the user can retry; parent shows the error banner.
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form className={`run-form card ${submitting ? 'is-submitting' : ''}`} onSubmit={handleSubmit}>
      <h2 className="form-heading">{initialRun ? 'Edit Run' : 'Log a Run'}</h2>

      <div className="form-group">
        <label className="form-label">Date</label>
        <input
          type="date"
          className="form-input"
          value={date}
          onChange={e => setDate(e.target.value)}
          max={today()}
          required
        />
      </div>

      <div className="form-group">
        <label className="form-label">Duration</label>
        <div className="duration-row">
          <div className="duration-field">
            <input
              type="number"
              className="form-input duration-input"
              placeholder="0"
              min="0"
              max="23"
              value={hours}
              onChange={e => setHours(e.target.value)}
            />
            <span className="duration-unit">h</span>
          </div>
          <div className="duration-field">
            <input
              type="number"
              className="form-input duration-input"
              placeholder="00"
              min="0"
              max="59"
              value={minutes}
              onChange={e => setMinutes(e.target.value)}
              required
            />
            <span className="duration-unit">m</span>
          </div>
          <div className="duration-field">
            <input
              type="number"
              className="form-input duration-input"
              placeholder="00"
              min="0"
              max="59"
              value={seconds}
              onChange={e => setSeconds(e.target.value)}
            />
            <span className="duration-unit">s</span>
          </div>
        </div>
      </div>

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
            required
          />
        </div>
        <div className="form-group" style={{ flex: 1 }}>
          <label className="form-label">Unit</label>
          <select
            className="form-input"
            value={unit}
            onChange={e => setUnit(e.target.value as 'miles' | 'km')}
          >
            <option value="miles">Miles</option>
            <option value="km">KM</option>
          </select>
        </div>
      </div>

      <div className="form-group">
        <label className="form-label">Notes (optional)</label>
        <textarea
          className="form-input run-notes"
          placeholder="How did it feel? Any details..."
          value={notes}
          onChange={e => setNotes(e.target.value)}
          rows={2}
        />
      </div>

      <div className="form-actions">
        {onCancel && (
          <button type="button" className="btn btn-secondary" onClick={onCancel} disabled={submitting}>
            Cancel
          </button>
        )}
        <button type="submit" className="btn btn-primary" style={{ flex: 1 }} disabled={submitting}>
          {submitting ? 'Saving…' : initialRun ? 'Save Changes' : 'Log Run'}
        </button>
      </div>
    </form>
  );
}

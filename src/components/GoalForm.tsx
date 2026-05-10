import { useState } from 'react';
import type { Goal } from '../types';
import { generateId, startOfYear, endOfYear, currentYear } from '../utils/helpers';
import './GoalForm.css';

interface GoalFormProps {
  onSubmit: (goal: Goal) => void;
  onCancel?: () => void;
}

export default function GoalForm({ onSubmit, onCancel }: GoalFormProps) {
  const year = currentYear();
  const [name, setName] = useState('');
  const [target, setTarget] = useState('');
  const [unit, setUnit] = useState<'miles' | 'km'>('miles');
  const [startDate, setStartDate] = useState(startOfYear(year));
  const [endDate, setEndDate] = useState(endOfYear(year));

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name || !target) return;

    onSubmit({
      id: generateId(),
      name: name.trim(),
      target_distance: parseFloat(target),
      unit,
      start_date: startDate,
      end_date: endDate,
      created_at: new Date().toISOString(),
    });

    setName('');
    setTarget('');
    setUnit('miles');
    setStartDate(startOfYear(year));
    setEndDate(endOfYear(year));
    onCancel?.();
  }

  return (
    <form className="goal-form card" onSubmit={handleSubmit}>
      <h2 className="form-heading">New Goal</h2>

      <div className="form-group">
        <label className="form-label">Goal Name</label>
        <input
          type="text"
          className="form-input"
          placeholder="e.g. Run 200 miles this year"
          value={name}
          onChange={e => setName(e.target.value)}
          required
        />
      </div>

      <div className="form-row">
        <div className="form-group" style={{ flex: 2 }}>
          <label className="form-label">Target Distance</label>
          <input
            type="number"
            className="form-input"
            placeholder="200"
            min="0"
            step="0.1"
            value={target}
            onChange={e => setTarget(e.target.value)}
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

      <div className="form-row">
        <div className="form-group">
          <label className="form-label">Start Date</label>
          <input
            type="date"
            className="form-input"
            value={startDate}
            onChange={e => setStartDate(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label className="form-label">End Date</label>
          <input
            type="date"
            className="form-input"
            value={endDate}
            min={startDate}
            onChange={e => setEndDate(e.target.value)}
            required
          />
        </div>
      </div>

      <div className="form-actions">
        {onCancel && (
          <button type="button" className="btn btn-secondary" onClick={onCancel}>
            Cancel
          </button>
        )}
        <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>
          Create Goal
        </button>
      </div>
    </form>
  );
}

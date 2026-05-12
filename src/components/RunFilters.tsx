import { useState } from 'react';
import type { FilterRow, FilterField, FilterOperator, DistanceUnit } from '../utils/filters';
import { makeFilter, countActiveFilters } from '../utils/filters';
import './RunFilters.css';

interface RunFiltersProps {
  filters: FilterRow[];
  onChange: (filters: FilterRow[]) => void;
}

export default function RunFilters({ filters, onChange }: RunFiltersProps) {
  const [open, setOpen] = useState(false);
  const activeCount = countActiveFilters(filters);

  function addFilter(type: FilterRow['type']) {
    onChange([...filters, makeFilter(type)]);
  }

  function removeFilter(id: string) {
    const next = filters.filter(f => f.id !== id);
    onChange(next);
    if (next.length === 0) setOpen(false);
  }

  function updateFilter(updated: FilterRow) {
    onChange(filters.map(f => (f.id === updated.id ? updated : f)));
  }

  return (
    <div className="run-filters">
      <div className="filter-bar">
        <button
          className={`filter-toggle ${activeCount > 0 ? 'filter-toggle--active' : ''}`}
          onClick={() => setOpen(o => !o)}
          aria-expanded={open}
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <line x1="4" y1="6" x2="20" y2="6" />
            <line x1="8" y1="12" x2="16" y2="12" />
            <line x1="11" y1="18" x2="13" y2="18" />
          </svg>
          Filter
          {activeCount > 0 && <span className="filter-badge">{activeCount}</span>}
          <svg
            className={`filter-chevron ${open ? 'filter-chevron--open' : ''}`}
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
          >
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </button>

        {activeCount > 0 && (
          <button className="filter-clear" onClick={() => onChange([])}>
            Clear
          </button>
        )}
      </div>

      {open && (
        <div className="filter-panel">
          {filters.length === 0 ? (
            <p className="filter-empty">No filters yet. Add one below.</p>
          ) : (
            <div className="filter-rows">
              {filters.map(filter => (
                <FilterRowEditor
                  key={filter.id}
                  filter={filter}
                  onChange={updateFilter}
                  onRemove={() => removeFilter(filter.id)}
                />
              ))}
            </div>
          )}

          <div className="filter-add-row">
            <span className="filter-add-label">Add:</span>
            <button className="filter-add-btn" onClick={() => addFilter('date_range')}>
              Date Range
            </button>
            <button className="filter-add-btn" onClick={() => addFilter('comparison')}>
              Distance / Duration
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

interface FilterRowEditorProps {
  filter: FilterRow;
  onChange: (filter: FilterRow) => void;
  onRemove: () => void;
}

function FilterRowEditor({ filter, onChange, onRemove }: FilterRowEditorProps) {
  if (filter.type === 'date_range') {
    return (
      <div className="filter-row">
        <div className="filter-row-header">
          <span className="filter-row-label">Date Range</span>
          <button className="filter-remove-btn" onClick={onRemove} aria-label="Remove filter">
            ×
          </button>
        </div>
        <div className="filter-date-inputs">
          <div className="filter-date-field">
            <label className="filter-field-label">From</label>
            <input
              type="date"
              className="filter-input"
              value={filter.from}
              onChange={e => onChange({ ...filter, from: e.target.value })}
            />
          </div>
          <div className="filter-date-field">
            <label className="filter-field-label">To</label>
            <input
              type="date"
              className="filter-input"
              value={filter.to}
              onChange={e => onChange({ ...filter, to: e.target.value })}
            />
          </div>
        </div>
      </div>
    );
  }

  if (filter.type === 'comparison') {
    return (
      <div className="filter-row">
        <div className="filter-row-header">
          <span className="filter-row-label">Comparison</span>
          <button className="filter-remove-btn" onClick={onRemove} aria-label="Remove filter">
            ×
          </button>
        </div>
        <div className="filter-comparison-inputs">
          <select
            className="filter-select"
            value={filter.field}
            onChange={e => onChange({ ...filter, field: e.target.value as FilterField })}
          >
            <option value="distance">Distance</option>
            <option value="duration">Duration</option>
          </select>
          <select
            className="filter-select filter-select--operator"
            value={filter.operator}
            onChange={e => onChange({ ...filter, operator: e.target.value as FilterOperator })}
          >
            <option value=">=">≥</option>
            <option value="<=">≤</option>
          </select>
          <input
            type="number"
            className="filter-input filter-input--value"
            placeholder={filter.field === 'distance' ? '0.0' : 'mins'}
            min="0"
            step={filter.field === 'distance' ? '0.1' : '1'}
            value={filter.value}
            onChange={e => onChange({ ...filter, value: e.target.value })}
          />
          {filter.field === 'distance' ? (
            <select
              className="filter-select filter-select--unit"
              value={filter.unit}
              onChange={e => onChange({ ...filter, unit: e.target.value as DistanceUnit })}
            >
              <option value="miles">mi</option>
              <option value="km">km</option>
            </select>
          ) : (
            <span className="filter-unit-label">min</span>
          )}
        </div>
      </div>
    );
  }

  return null;
}

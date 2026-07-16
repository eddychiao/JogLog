import { useState, useMemo, useEffect } from 'react';
import type { Run } from '../types';
import { useApp } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';
import Header from '../components/Header';
import RunForm from '../components/RunForm';
import RunList from '../components/RunList';
import RunFilters from '../components/RunFilters';
import Banner from '../components/Banner';
import type { FilterRow } from '../utils/filters';
import { applyFilters } from '../utils/filters';
import './LogRun.css';

const RUNS_PER_PAGE = 20;

export default function LogRun() {
  const { runs, addRun, updateRun, deleteRun } = useApp();
  const { user } = useAuth();
  const [editing, setEditing] = useState<Run | null>(null);
  const [filters, setFilters] = useState<FilterRow[]>([]);
  const [page, setPage] = useState(1);
  const [banner, setBanner] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const filteredRuns = useMemo(() => applyFilters(runs, filters), [runs, filters]);
  const totalPages = Math.max(1, Math.ceil(filteredRuns.length / RUNS_PER_PAGE));
  const pagedRuns = filteredRuns.slice((page - 1) * RUNS_PER_PAGE, page * RUNS_PER_PAGE);

  // Reset to page 1 whenever filters change
  useEffect(() => { setPage(1); }, [filters]);

  async function handleSubmit(run: Run) {
    const wasEditing = editing !== null;
    try {
      if (wasEditing) {
        await updateRun(run);
        setEditing(null);
      } else {
        await addRun(run);
      }
      setBanner({
        type: 'success',
        message: wasEditing ? 'Run updated successfully.' : 'Run logged successfully.',
      });
    } catch {
      setBanner({ type: 'error', message: "Couldn't save your run. Please try again." });
      throw new Error('Failed to save run');
    }
  }

  async function handleDelete(id: string) {
    try {
      await deleteRun(id);
      setBanner({ type: 'success', message: 'Run deleted successfully.' });
    } catch {
      setBanner({ type: 'error', message: "Couldn't delete run. Please try again." });
    }
  }

  return (
    <>
      <Header title="Log a Run" />
      <div className="page">
        {user ? (
          <>
            {banner && (
              <Banner
                type={banner.type}
                message={banner.message}
                onDismiss={() => setBanner(null)}
              />
            )}
            <RunForm
              onSubmit={handleSubmit}
              initialRun={editing}
              onCancel={editing ? () => setEditing(null) : undefined}
            />
          </>
        ) : (
          <div className="auth-nudge card">
            <span>🔒</span>
            <p>Sign in to log and edit runs.</p>
          </div>
        )}

        <div className="history-header">
          <h2 className="section-title">All Runs</h2>
          {filteredRuns.length !== runs.length && (
            <span className="history-count">{filteredRuns.length} of {runs.length}</span>
          )}
          {filteredRuns.length === runs.length && runs.length > 0 && (
            <span className="history-count">{runs.length} total</span>
          )}
        </div>

        <RunFilters filters={filters} onChange={setFilters} />

        <RunList
          runs={pagedRuns}
          onEdit={user ? setEditing : undefined}
          onDelete={user ? handleDelete : undefined}
          showYearHeaders
        />

        {totalPages > 1 && (
          <div className="pagination">
            <button
              className="pagination-btn"
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
            >
              ← Prev
            </button>
            <span className="pagination-info">
              {page} / {totalPages}
            </span>
            <button
              className="pagination-btn"
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
            >
              Next →
            </button>
          </div>
        )}
      </div>
    </>
  );
}

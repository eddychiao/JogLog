import { useState } from 'react';
import type { Run } from '../types';
import { useApp } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';
import Header from '../components/Header';
import RunForm from '../components/RunForm';
import RunList from '../components/RunList';
import './LogRun.css';

export default function LogRun() {
  const { runs, addRun, updateRun, deleteRun } = useApp();
  const { user } = useAuth();
  const [editing, setEditing] = useState<Run | null>(null);

  function handleSubmit(run: Run) {
    if (editing) {
      updateRun(run);
      setEditing(null);
    } else {
      addRun(run);
    }
  }

  return (
    <>
      <Header title="Log a Run" />
      <div className="page">
        {user ? (
          <RunForm
            onSubmit={handleSubmit}
            initialRun={editing}
            onCancel={editing ? () => setEditing(null) : undefined}
          />
        ) : (
          <div className="auth-nudge card">
            <span>🔒</span>
            <p>Sign in to log and edit runs.</p>
          </div>
        )}

        <h2 className="section-title" style={{ marginTop: 16 }}>All Runs</h2>
        <RunList
          runs={runs}
          onEdit={user ? setEditing : undefined}
          onDelete={user ? deleteRun : undefined}
        />
      </div>
    </>
  );
}

import { useState } from 'react';
import type { Run } from '../types';
import { useApp } from '../context/AppContext';
import Header from '../components/Header';
import RunForm from '../components/RunForm';
import RunList from '../components/RunList';
import './LogRun.css';

export default function LogRun() {
  const { runs, addRun, updateRun, deleteRun } = useApp();
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
        <RunForm
          onSubmit={handleSubmit}
          initialRun={editing}
          onCancel={editing ? () => setEditing(null) : undefined}
        />

        <h2 className="section-title" style={{ marginTop: 8 }}>All Runs</h2>
        <RunList
          runs={runs}
          onEdit={setEditing}
          onDelete={deleteRun}
        />
      </div>
    </>
  );
}

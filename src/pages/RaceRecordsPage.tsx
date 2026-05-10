import { useState } from 'react';
import type { RaceRecord, RaceType } from '../types';
import { RACE_TYPE_LABELS, RACE_TYPE_DISTANCES } from '../types';
import { useApp } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';
import Header from '../components/Header';
import RaceRecordCard from '../components/RaceRecordCard';
import RaceRecordForm from '../components/RaceRecordForm';
import './RaceRecordsPage.css';

const STANDARD_TYPES: RaceType[] = ['5k', '10k', 'half_marathon', 'marathon'];

export default function RaceRecordsPage() {
  const { raceRecords, addRaceRecord, updateRaceRecord, deleteRaceRecord } = useApp();
  const { user } = useAuth();
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<RaceRecord | null>(null);

  function handleSubmit(record: RaceRecord) {
    if (editing) {
      updateRaceRecord(record);
      setEditing(null);
    } else {
      addRaceRecord(record);
      setShowForm(false);
    }
  }

  const customRecords = raceRecords
    .filter(r => r.race_type === 'custom')
    .sort((a, b) => a.time_seconds - b.time_seconds);

  return (
    <>
      <Header title="Race Records" />
      <div className="page">
        {user ? (
          showForm || editing ? (
            <RaceRecordForm
              onSubmit={handleSubmit}
              initialRecord={editing}
              onCancel={() => { setShowForm(false); setEditing(null); }}
            />
          ) : (
            <button className="btn btn-primary btn-full goals-add-btn" onClick={() => setShowForm(true)}>
              + Add Race Record
            </button>
          )
        ) : (
          <div className="auth-nudge card">
            <span>🔒</span>
            <p>Sign in to add and edit race records.</p>
          </div>
        )}

        {raceRecords.length === 0 && (
          <div className="empty-state">
            <div className="empty-state-icon">🏆</div>
            <p>Log your first race to track your personal records!</p>
          </div>
        )}

        {STANDARD_TYPES.map(type => {
          const typeRecords = raceRecords
            .filter(r => r.race_type === type)
            .sort((a, b) => a.time_seconds - b.time_seconds);
          if (typeRecords.length === 0) return null;

          return (
            <section key={type} className="records-section">
              <div className="records-section-header">
                <h2 className="section-title">{RACE_TYPE_LABELS[type]}</h2>
                {RACE_TYPE_DISTANCES[type] && (
                  <span className="records-distance">
                    {RACE_TYPE_DISTANCES[type]!.km} km / {RACE_TYPE_DISTANCES[type]!.miles.toFixed(2)} mi
                  </span>
                )}
              </div>
              {typeRecords.map((record, idx) => (
                <RaceRecordCard
                  key={record.id}
                  record={record}
                  isBest={idx === 0}
                  onEdit={user ? setEditing : undefined}
                  onDelete={user ? deleteRaceRecord : undefined}
                />
              ))}
            </section>
          );
        })}

        {customRecords.length > 0 && (
          <section className="records-section">
            <h2 className="section-title">Custom Races</h2>
            {customRecords.map((record, idx) => (
              <RaceRecordCard
                key={record.id}
                record={record}
                isBest={idx === 0}
                onDelete={deleteRaceRecord}
              />
            ))}
          </section>
        )}
      </div>
    </>
  );
}

import { useState } from 'react';
import { useApp } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';
import Header from '../components/Header';
import GoalForm from '../components/GoalForm';
import GoalCard from '../components/GoalCard';
import { today } from '../utils/helpers';
import './GoalsPage.css';

export default function GoalsPage() {
  const { goals, runs, addGoal, deleteGoal } = useApp();
  const { user } = useAuth();
  const [showForm, setShowForm] = useState(false);

  const activeGoals = goals.filter(g => g.end_date >= today());
  const pastGoals = goals.filter(g => g.end_date < today());

  return (
    <>
      <Header title="Goals" />
      <div className="page">
        {user ? (
          showForm ? (
            <GoalForm onSubmit={g => { addGoal(g); setShowForm(false); }} onCancel={() => setShowForm(false)} />
          ) : (
            <button className="btn btn-primary btn-full goals-add-btn" onClick={() => setShowForm(true)}>
              + New Goal
            </button>
          )
        ) : (
          <div className="auth-nudge card">
            <span>🔒</span>
            <p>Sign in to add and manage goals.</p>
          </div>
        )}

        {goals.length === 0 && (
          <div className="empty-state">
            <div className="empty-state-icon">🎯</div>
            <p>Set a goal to stay motivated!</p>
          </div>
        )}

        {activeGoals.length > 0 && (
          <section>
            <h2 className="section-title">Active Goals</h2>
            {activeGoals.map(goal => (
              <GoalCard
                key={goal.id}
                goal={goal}
                runs={runs}
                onDelete={user ? deleteGoal : undefined}
              />
            ))}
          </section>
        )}

        {pastGoals.length > 0 && (
          <section className="past-goals-section">
            <h2 className="section-title">Past Goals</h2>
            {pastGoals.map(goal => (
              <GoalCard
                key={goal.id}
                goal={goal}
                runs={runs}
                onDelete={user ? deleteGoal : undefined}
              />
            ))}
          </section>
        )}
      </div>
    </>
  );
}

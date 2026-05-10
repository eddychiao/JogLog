import { useState } from 'react';
import { useApp } from '../context/AppContext';
import Header from '../components/Header';
import GoalForm from '../components/GoalForm';
import GoalCard from '../components/GoalCard';
import { today } from '../utils/helpers';
import './GoalsPage.css';

export default function GoalsPage() {
  const { goals, runs, addGoal, deleteGoal } = useApp();
  const [showForm, setShowForm] = useState(false);

  const activeGoals = goals.filter(g => g.end_date >= today());
  const pastGoals = goals.filter(g => g.end_date < today());

  return (
    <>
      <Header title="Goals" />
      <div className="page">
        {showForm ? (
          <GoalForm onSubmit={g => { addGoal(g); setShowForm(false); }} onCancel={() => setShowForm(false)} />
        ) : (
          <button className="btn btn-primary btn-full goals-add-btn" onClick={() => setShowForm(true)}>
            + New Goal
          </button>
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
                onDelete={deleteGoal}
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
                onDelete={deleteGoal}
              />
            ))}
          </section>
        )}
      </div>
    </>
  );
}

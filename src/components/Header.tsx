import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import LoginModal from './LoginModal';
import './Header.css';

interface HeaderProps {
  title: string;
  subtitle?: string;
}

export default function Header({ title, subtitle }: HeaderProps) {
  const { user, signOut } = useAuth();
  const [showLogin, setShowLogin] = useState(false);

  return (
    <>
      <header className="app-header">
        <div className="header-content">
          <div className="header-logo">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 10C3 7 5 6 9 6.5L12 6L16 7C19 8 21 10 22 13V16"/>
              <line x1="3" y1="10" x2="3" y2="16"/>
              <path d="M2 16H22V18a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V16"/>
              <line x1="10" y1="10.5" x2="16" y2="9"/>
            </svg>
          </div>
          <div>
            <h1 className="header-title">{title}</h1>
            {subtitle && <p className="header-subtitle">{subtitle}</p>}
          </div>
        </div>

        <div className="header-auth">
          {user ? (
            <button className="auth-btn auth-btn--in" onClick={signOut} title="Sign out">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                <circle cx="12" cy="7" r="4"/>
              </svg>
              <span className="auth-label">Sign out</span>
            </button>
          ) : (
            <button className="auth-btn auth-btn--out" onClick={() => setShowLogin(true)} title="Sign in">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
              </svg>
              <span className="auth-label">Sign in</span>
            </button>
          )}
        </div>
      </header>

      {showLogin && <LoginModal onClose={() => setShowLogin(false)} />}
    </>
  );
}

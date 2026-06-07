import { useState, useRef, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import LoginModal from './LoginModal';
import { useThemeColor, THEME_PRESETS } from '../hooks/useThemeColor';
import './Header.css';

interface HeaderProps {
  title: string;
  subtitle?: string;
}

export default function Header({ title, subtitle }: HeaderProps) {
  const { user, signOut } = useAuth();
  const [showLogin, setShowLogin] = useState(false);
  const [showColorPicker, setShowColorPicker] = useState(false);
  const { setColor, currentColor } = useThemeColor();
  const pickerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (pickerRef.current && !pickerRef.current.contains(e.target as Node)) {
        setShowColorPicker(false);
      }
    }
    if (showColorPicker) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showColorPicker]);

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
          <div className="color-picker-wrapper" ref={pickerRef}>
            <button
              className="color-picker-btn"
              onClick={() => setShowColorPicker(v => !v)}
              title="Theme color"
              aria-label="Change theme color"
            >
              <span className="color-picker-dot" style={{ background: currentColor }} />
              <PaletteIcon />
            </button>
            {showColorPicker && (
              <div className="color-picker-popover">
                <p className="color-picker-label">Theme color</p>
                <div className="color-picker-swatches">
                  {THEME_PRESETS.map(({ label, color }) => (
                    <button
                      key={color}
                      className={`color-swatch${color.toLowerCase() === currentColor.toLowerCase() ? ' active' : ''}`}
                      style={{ background: color }}
                      onClick={() => { setColor(color); setShowColorPicker(false); }}
                      title={label}
                    />
                  ))}
                </div>
                <label className="color-custom-row">
                  <span className="color-custom-label">Custom</span>
                  <input
                    type="color"
                    className="color-custom-input"
                    defaultValue={currentColor}
                    onChange={e => setColor(e.target.value)}
                  />
                </label>
              </div>
            )}
          </div>

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

function PaletteIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="13.5" cy="6.5" r="1.5"/>
      <circle cx="17.5" cy="10.5" r="1.5"/>
      <circle cx="8.5" cy="7.5" r="1.5"/>
      <circle cx="6.5" cy="12.5" r="1.5"/>
      <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.554C21.965 6.012 17.461 2 12 2z"/>
    </svg>
  );
}

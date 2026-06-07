import { useCallback } from 'react';

const STORAGE_KEY = 'joglog-theme-color';
export const DEFAULT_COLOR = '#FC4C02';

export const THEME_PRESETS = [
  { label: 'Strava', color: '#FC4C02' },
  { label: 'Red', color: '#DC2626' },
  { label: 'Blue', color: '#2563EB' },
  { label: 'Purple', color: '#7C3AED' },
  { label: 'Emerald', color: '#059669' },
  { label: 'Pink', color: '#DB2777' },
];

function hexToRgb(hex: string): [number, number, number] | null {
  const m = /^#([0-9a-f]{6})$/i.exec(hex);
  if (!m) return null;
  return [
    parseInt(m[1].slice(0, 2), 16),
    parseInt(m[1].slice(2, 4), 16),
    parseInt(m[1].slice(4, 6), 16),
  ];
}

function darkenHex(hex: string, amount = 0.14): string {
  const rgb = hexToRgb(hex);
  if (!rgb) return hex;
  const f = 1 - amount;
  return '#' + rgb.map(c => Math.round(c * f).toString(16).padStart(2, '0')).join('');
}

export function applyThemeColor(hex: string) {
  const rgb = hexToRgb(hex);
  if (!rgb) return;
  const [r, g, b] = rgb;
  const root = document.documentElement;
  root.style.setProperty('--primary', hex);
  root.style.setProperty('--primary-rgb', `${r}, ${g}, ${b}`);
  root.style.setProperty('--primary-dark', darkenHex(hex));
  root.style.setProperty('--primary-light', `rgba(${r}, ${g}, ${b}, 0.1)`);
}

export function getSavedColor(): string {
  return localStorage.getItem(STORAGE_KEY) || DEFAULT_COLOR;
}

export function useThemeColor() {
  const setColor = useCallback((hex: string) => {
    localStorage.setItem(STORAGE_KEY, hex);
    applyThemeColor(hex);
  }, []);

  return { setColor, currentColor: getSavedColor() };
}

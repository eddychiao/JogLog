export function formatDuration(seconds: number): string {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  if (h > 0) {
    return `${h}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  }
  return `${m}:${s.toString().padStart(2, '0')}`;
}

export function formatPace(durationSeconds: number, distanceMiles: number): string {
  if (!distanceMiles || distanceMiles === 0) return '--:--';
  const paceSeconds = durationSeconds / distanceMiles;
  const paceMin = Math.floor(paceSeconds / 60);
  const paceSec = Math.round(paceSeconds % 60);
  return `${paceMin}:${paceSec.toString().padStart(2, '0')} /mi`;
}

export function formatPaceKm(durationSeconds: number, distanceKm: number): string {
  if (!distanceKm || distanceKm === 0) return '--:--';
  const paceSeconds = durationSeconds / distanceKm;
  const paceMin = Math.floor(paceSeconds / 60);
  const paceSec = Math.round(paceSeconds % 60);
  return `${paceMin}:${paceSec.toString().padStart(2, '0')} /km`;
}

export function paceSecondsPerMile(durationSeconds: number, distanceMiles: number): number {
  if (!distanceMiles || distanceMiles === 0) return 0;
  return durationSeconds / distanceMiles;
}

export function toMiles(distance: number, unit: 'miles' | 'km'): number {
  return unit === 'km' ? distance * 0.621371 : distance;
}

export function toKm(distance: number, unit: 'miles' | 'km'): number {
  return unit === 'miles' ? distance * 1.60934 : distance;
}

export function generateId(): string {
  return crypto.randomUUID();
}

export function formatDate(dateStr: string): string {
  const [year, month, day] = dateStr.split('-').map(Number);
  const date = new Date(year, month - 1, day);
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

export function formatShortDate(dateStr: string): string {
  const [year, month, day] = dateStr.split('-').map(Number);
  const date = new Date(year, month - 1, day);
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

export function today(): string {
  return new Date().toISOString().split('T')[0];
}

export function currentYear(): number {
  return new Date().getFullYear();
}

export function startOfYear(year: number): string {
  return `${year}-01-01`;
}

export function endOfYear(year: number): string {
  return `${year}-12-31`;
}

export function daysRemaining(endDate: string): number {
  const end = new Date(endDate + 'T00:00:00');
  const now = new Date();
  const diff = end.getTime() - now.getTime();
  return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
}

export function weeksRemaining(endDate: string): number {
  return Math.max(0, daysRemaining(endDate) / 7);
}

export function secondsFromHMS(h: number, m: number, s: number): number {
  return h * 3600 + m * 60 + s;
}

export function hmsFromSeconds(totalSeconds: number): { h: number; m: number; s: number } {
  const h = Math.floor(totalSeconds / 3600);
  const m = Math.floor((totalSeconds % 3600) / 60);
  const s = totalSeconds % 60;
  return { h, m, s };
}

import './StatsCard.css';

interface StatsCardProps {
  label: string;
  value: string;
  sub?: string;
  accent?: boolean;
  icon?: string;
}

export default function StatsCard({ label, value, sub, accent, icon }: StatsCardProps) {
  return (
    <div className={`stats-card card${accent ? ' stats-card--accent' : ''}`}>
      {icon && <span className="stats-icon">{icon}</span>}
      <div className="stats-value">{value}</div>
      <div className="stats-label">{label}</div>
      {sub && <div className="stats-sub">{sub}</div>}
    </div>
  );
}

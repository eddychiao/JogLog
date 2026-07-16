import { useEffect, useState } from 'react';
import './Banner.css';

interface BannerProps {
  type: 'success' | 'error';
  message: string;
  onDismiss: () => void;
  duration?: number;
}

export default function Banner({ type, message, onDismiss, duration = 3000 }: BannerProps) {
  const [closing, setClosing] = useState(false);

  useEffect(() => {
    const closeTimer = setTimeout(() => setClosing(true), duration);
    return () => clearTimeout(closeTimer);
  }, [duration]);

  useEffect(() => {
    if (!closing) return;
    const removeTimer = setTimeout(onDismiss, 200);
    return () => clearTimeout(removeTimer);
  }, [closing, onDismiss]);

  return (
    <div className={`banner banner-${type} ${closing ? 'banner-closing' : ''}`}>
      <span className="banner-icon">{type === 'success' ? '✓' : '⚠'}</span>
      <span>{message}</span>
    </div>
  );
}

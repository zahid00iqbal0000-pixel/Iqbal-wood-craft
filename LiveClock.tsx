import React, { useState, useEffect } from 'react';
import { Clock, Calendar } from 'lucide-react';

interface LiveClockProps {
  className?: string;
  variant?: 'compact' | 'full';
}

export const LiveClock: React.FC<LiveClockProps> = ({ className = '', variant = 'compact' }) => {
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setNow(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const timeString = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  const dateString = now.toLocaleDateString([], { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' });

  if (variant === 'full') {
    return (
      <div className={`flex items-center gap-3 bg-stone-950/80 border border-stone-800 px-3.5 py-1.5 rounded-xl text-xs ${className}`}>
        <div className="flex items-center gap-1.5 text-amber-300">
          <Calendar className="w-3.5 h-3.5" />
          <span className="font-medium">{dateString}</span>
        </div>
        <div className="w-px h-3.5 bg-stone-800"></div>
        <div className="flex items-center gap-1.5 text-stone-200 font-mono">
          <Clock className="w-3.5 h-3.5 text-[#d4af37]" />
          <span>{timeString}</span>
        </div>
      </div>
    );
  }

  return (
    <div className={`flex items-center gap-2 text-xs font-mono text-stone-300 ${className}`}>
      <Clock className="w-3.5 h-3.5 text-[#d4af37] animate-pulse" />
      <span>{dateString} • {timeString}</span>
    </div>
  );
};

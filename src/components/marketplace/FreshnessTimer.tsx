import { useEffect, useState } from 'react';
import { Clock } from 'lucide-react';

interface FreshnessTimerProps {
  harvestDate: string;
}

export default function FreshnessTimer({ harvestDate }: FreshnessTimerProps) {
  const [elapsed, setElapsed] = useState('');

  useEffect(() => {
    const calc = () => {
      const now = new Date();
      const match = harvestDate.trim().match(/^(\d{1,2})-([A-Za-z]{3})[,\s]+(\d{4})$/);
      if (!match) return;
      const monthMap: Record<string, number> = { Jan: 0, Feb: 1, Mar: 2, Apr: 3, May: 4, Jun: 5, Jul: 6, Aug: 7, Sep: 8, Oct: 9, Nov: 10, Dec: 11 };
      const harvested = new Date(parseInt(match[3], 10), monthMap[match[2]] ?? 0, parseInt(match[1], 10), 6, 0);
      const diff = Math.max(0, now.getTime() - harvested.getTime());
      const hours = Math.floor(diff / 3600000);
      if (hours < 24) setElapsed(`${hours}h ago`);
      else setElapsed(`${Math.floor(hours / 24)}d ${hours % 24}h ago`);
    };
    calc();
    const timer = setInterval(calc, 60000);
    return () => clearInterval(timer);
  }, [harvestDate]);

  const fresh = elapsed.includes('h') && !elapsed.includes('d') && parseInt(elapsed) < 24;

  return (
    <span
      className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[8px] font-bold border ${
        fresh ? 'bg-emerald-500/15 text-emerald-300 border-emerald-400/30' : 'bg-amber-500/15 text-amber-300 border-amber-400/30'
      }`}
      title={`Harvested ${elapsed}`}
    >
      <Clock className="w-2.5 h-2.5" />
      {elapsed || 'Just now'}
    </span>
  );
}

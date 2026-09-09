import { getProductSeason, isCurrentlyInSeason } from '../../data/seasonalData';
import { Sun, CloudRain, Snowflake, Flower2, Clock } from 'lucide-react';

const SEASON_ICONS: Record<string, React.ReactNode> = {
  'year-round': <Clock className="w-3 h-3" />,
  summer: <Sun className="w-3 h-3" />,
  monsoon: <CloudRain className="w-3 h-3" />,
  winter: <Snowflake className="w-3 h-3" />,
  spring: <Flower2 className="w-3 h-3" />,
};

interface SeasonalTagProps {
  productId: string;
}

export default function SeasonalTag({ productId }: SeasonalTagProps) {
  const info = getProductSeason(productId);
  const inSeason = isCurrentlyInSeason(productId);

  return (
    <span
      className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[8px] font-bold border ${info.bgColor} ${info.color} ${
        !inSeason ? 'opacity-50' : ''
      }`}
      title={`${info.label} (${info.months})${inSeason ? ' — In Season' : ' — Off Season'}`}
    >
      {SEASON_ICONS[info.season]}
      {inSeason ? info.label : `Off-${info.label}`}
    </span>
  );
}

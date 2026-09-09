import { Star } from 'lucide-react';

interface StarRatingProps {
  rating: number;
  maxStars?: number;
  size?: 'sm' | 'md' | 'lg';
  showValue?: boolean;
  interactive?: boolean;
  onRate?: (rating: number) => void;
}

const SIZE_MAP = { sm: 'w-3 h-3', md: 'w-4 h-4', lg: 'w-5 h-5' };

export default function StarRating({ rating, maxStars = 5, size = 'sm', showValue = false, interactive = false, onRate }: StarRatingProps) {
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: maxStars }, (_, i) => {
        const filled = i < Math.floor(rating);
        const partial = !filled && i < rating;
        return (
          <button
            key={i}
            type="button"
            disabled={!interactive}
            onClick={() => interactive && onRate?.(i + 1)}
            className={`relative ${interactive ? 'cursor-pointer hover:scale-125 transition-transform' : 'cursor-default'}`}
          >
            <Star className={`${SIZE_MAP[size]} ${filled ? 'fill-soil-gold text-soil-gold' : partial ? 'fill-soil-gold/50 text-soil-gold' : 'text-white/20'}`} />
          </button>
        );
      })}
      {showValue && rating > 0 && (
        <span className="text-[10px] font-bold text-soil-gold ml-1">{rating.toFixed(1)}</span>
      )}
    </div>
  );
}

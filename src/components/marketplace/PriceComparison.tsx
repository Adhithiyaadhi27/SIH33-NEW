import { GlassCard } from '../ui/primitives';
import { mockProducts } from '../../data/mockProducts';
import { GitCompare } from 'lucide-react';
import StarRating from './StarRating';
import { useMarketplaceStore } from '../../store/marketplaceStore';

interface PriceComparisonProps {
  productName: string;
}

const SUPPLIER_VARIANTS: Array<{ name: string; location: string; priceModifier: number; rating: number }> = [
  { name: 'GreenValley FPO', location: 'Madurai, TN', priceModifier: 0, rating: 4.8 },
  { name: 'Nilgiris FPO', location: 'Ooty, TN', priceModifier: -2, rating: 4.6 },
  { name: 'Sahyadri Co-op', location: 'Nashik, MH', priceModifier: 3, rating: 4.5 },
  { name: 'Himachal Collective', location: 'Kinnaur, HP', priceModifier: 15, rating: 4.9 },
  { name: 'Ratnagiri FPO', location: 'Ratnagiri, MH', priceModifier: 5, rating: 4.7 },
  { name: 'Ooty Co-op', location: 'Ooty, TN', priceModifier: -1, rating: 4.4 },
];

export default function PriceComparison({ productName }: PriceComparisonProps) {
  const addToCart = useMarketplaceStore((s) => s.addToCart);
  const baseProduct = mockProducts.find((p) => p.name === productName);
  if (!baseProduct) return null;

  const basePrice = baseProduct.price;
  const variants = SUPPLIER_VARIANTS
    .map((s) => ({
      ...s,
      price: Math.max(1, basePrice + s.priceModifier),
    }))
    .sort((a, b) => a.price - b.price);

  return (
    <GlassCard className="p-4 space-y-3">
      <div className="flex items-center gap-2">
        <GitCompare className="w-4 h-4 text-soil-gold" />
        <h3 className="font-display font-bold text-sm text-text-primary">Price Comparison — {productName}</h3>
      </div>
      <div className="space-y-2">
        {variants.map((v) => {
          const cheapest = variants[0].price === v.price;
          return (
            <div key={v.name} className={`flex items-center gap-3 p-2 rounded-xl transition ${cheapest ? 'bg-emerald-500/10 border border-emerald-400/30' : 'bg-white/5 hover:bg-white/8'}`}>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-bold text-text-primary">{v.name}</span>
                  {cheapest && <span className="text-[8px] font-bold bg-emerald-500/20 text-emerald-300 px-1.5 py-0.5 rounded-full">BEST PRICE</span>}
                </div>
                <div className="text-[9px] text-text-muted">{v.location} · <StarRating rating={v.rating} size="sm" showValue /></div>
              </div>
              <div className="text-right shrink-0">
                <div className={`font-extrabold text-sm ${cheapest ? 'text-emerald-400' : 'text-soil-gold'}`}>₹{v.price.toFixed(2)}</div>
                <div className="text-[9px] text-text-muted">/kg</div>
              </div>
              <button
                onClick={() => addToCart({ id: `${baseProduct.id}_${v.name}`, name: `${productName} (${v.name})`, price: v.price, unit: 'kg', image: baseProduct.image, grade: baseProduct.grade })}
                className="px-2 py-1 rounded-lg bg-soil-emerald/30 text-emerald-300 text-[9px] font-bold hover:bg-soil-emerald/50 transition cursor-pointer shrink-0"
              >
                Add
              </button>
            </div>
          );
        })}
      </div>
    </GlassCard>
  );
}

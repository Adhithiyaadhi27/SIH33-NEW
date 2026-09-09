import { PackageSearch, ShoppingCart } from 'lucide-react';
import { type MockProduct } from '../../data/mockProducts';
import { useMarketplaceStore } from '../../store/marketplaceStore';
import StarRating from './StarRating';
import { useReviewStore } from '../../store/reviewStore';

interface SubstitutionSuggestionProps {
  outOfStockProduct: MockProduct;
  allProducts: MockProduct[];
}

export default function SubstitutionSuggestion({ outOfStockProduct, allProducts }: SubstitutionSuggestionProps) {
  const addToCart = useMarketplaceStore((s) => s.addToCart);
  const { getAverageRating } = useReviewStore();

  const suggestions = allProducts
    .filter(
      (p) =>
        p.id !== outOfStockProduct.id &&
        p.category === outOfStockProduct.category &&
        p.availableQty > 0 &&
        Math.abs(p.price - outOfStockProduct.price) / outOfStockProduct.price < 0.4,
    )
    .slice(0, 3);

  if (suggestions.length === 0) return null;

  return (
    <div className="glass-panel-sm p-3 space-y-2">
      <div className="flex items-center gap-1.5">
        <PackageSearch className="w-3.5 h-3.5 text-soil-gold" />
        <span className="text-[10px] font-bold text-soil-gold">Similar alternatives available</span>
      </div>
      <div className="space-y-2">
        {suggestions.map((p) => {
          const avgRating = getAverageRating(p.id);
          return (
            <div key={p.id} className="flex items-center gap-3 p-2 rounded-xl bg-white/5 hover:bg-white/8 transition">
              <img src={p.image} alt={p.name} className="w-10 h-10 rounded-lg object-cover shrink-0" />
              <div className="flex-1 min-w-0">
                <div className="text-[11px] font-bold text-text-primary truncate">{p.name}</div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold text-soil-gold">₹{p.price}/{p.unit}</span>
                  {avgRating > 0 && <StarRating rating={avgRating} size="sm" />}
                </div>
              </div>
              <button
                onClick={() => addToCart({ id: p.id, name: p.name, price: p.price, unit: p.unit, image: p.image, grade: p.grade })}
                className="p-1.5 rounded-lg bg-soil-emerald/30 text-emerald-300 hover:bg-soil-emerald/50 transition cursor-pointer"
                title="Add to Cart"
              >
                <ShoppingCart className="w-3.5 h-3.5" />
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}

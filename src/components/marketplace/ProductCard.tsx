import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingCart, ShieldCheck, Zap, Check, TrendingUp, TrendingDown, Heart, Package, Clock } from 'lucide-react';
import type { MockProduct } from '../../data/mockProducts';
import { useMarketplaceStore } from '../../store/marketplaceStore';
import { useWishlistStore } from '../../store/wishlistStore';
import { useReviewStore } from '../../store/reviewStore';
import StarRating from './StarRating';
import SeasonalTag from './SeasonalTag';
import BulkOrderModal from './BulkOrderModal';
import ReviewSection from './ReviewSection';
import SubstitutionSuggestion from './SubstitutionSuggestion';
import FreshnessTimer from './FreshnessTimer';
import PriceComparison from './PriceComparison';

interface ProductCardProps {
  product: MockProduct;
  allProducts?: MockProduct[];
}

export default function ProductCard({ product, allProducts = [] }: ProductCardProps) {
  const addToCart = useMarketplaceStore((s) => s.addToCart);
  const { toggleWishlist, isWishlisted } = useWishlistStore();
  const { getAverageRating } = useReviewStore();
  const [added, setAdded] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [bulkOpen, setBulkOpen] = useState(false);
  const prevPrice = useRef(product.price);
  const [delta, setDelta] = useState<{ up: boolean; amount: number } | null>(null);

  const wishlisted = isWishlisted(product.id);
  const avgRating = getAverageRating(product.id);
  const outOfStock = product.availableQty === 0;

  useEffect(() => {
    if (product.price === prevPrice.current) return;
    const diff = product.price - prevPrice.current;
    prevPrice.current = product.price;
    setDelta({ up: diff > 0, amount: Math.abs(diff) });
    const timer = setTimeout(() => setDelta(null), 2500);
    return () => clearTimeout(timer);
  }, [product.price]);

  const handleAdd = () => {
    if (outOfStock) return;
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      unit: product.unit,
      image: product.image,
      grade: product.grade,
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 1200);
  };

  const handleWishlist = () => {
    toggleWishlist({
      id: product.id,
      name: product.name,
      price: product.price,
      unit: product.unit,
      image: product.image,
      grade: product.grade,
      category: product.category,
      supplier: product.supplier,
      location: product.location,
    });
  };

  return (
    <div className="glass-panel-sm overflow-hidden group hover:border-soil-gold/40 transition-all duration-300 hover:-translate-y-1 flex flex-col justify-between">
      {/* Image */}
      <div className="relative h-40 overflow-hidden bg-soil-deep/60">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
        <div className="absolute top-2.5 left-2.5 right-2.5 flex justify-between items-start">
          <div className="flex flex-col gap-1.5">
            {product.brand && (
              <div className="flex items-center gap-1 bg-soil-emerald/90 backdrop-blur px-2 py-1 rounded-full text-[9px] font-bold text-white">
                <ShieldCheck className="w-3 h-3 text-soil-gold" />
                Farm Passport Verified
              </div>
            )}
            <div className="flex items-center gap-1 bg-black/50 backdrop-blur px-2 py-1 rounded-full text-[9px] font-bold text-soil-gold">
              <Zap className="w-3 h-3" /> Live Pricing
              <span className="relative flex h-1.5 w-1.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-400" />
              </span>
            </div>
          </div>
          <div className="flex items-center gap-1.5">
            <SeasonalTag productId={product.id} />
            <button
              onClick={handleWishlist}
              className="p-1.5 rounded-full bg-black/50 backdrop-blur transition cursor-pointer hover:bg-red-500/30"
              title={wishlisted ? 'Remove from Wishlist' : 'Save to Wishlist'}
            >
              <Heart className={`w-3.5 h-3.5 transition ${wishlisted ? 'fill-red-400 text-red-400' : 'text-white/70'}`} />
            </button>
          </div>
        </div>
        <div className="absolute bottom-2 left-2 right-2 flex justify-between items-center text-white text-[10px] font-semibold">
          <span className="bg-black/40 px-1.5 py-0.5 rounded">Grade {product.grade}</span>
          <span className={`bg-black/40 px-1.5 py-0.5 rounded ${outOfStock ? 'text-red-400' : ''}`}>
            {outOfStock ? 'Out of Stock' : `${product.availableQty} available`}
          </span>
        </div>
      </div>

      {/* Body */}
      <div className="p-3.5 space-y-2.5 flex-1 flex flex-col">
        <div>
          <div className="flex items-center justify-between">
            <h4 className="font-display font-bold text-sm text-text-primary">{product.name}</h4>
            {avgRating > 0 && <StarRating rating={avgRating} size="sm" showValue />}
          </div>
          <p className="text-[10px] text-text-muted">{product.location} · {product.supplier}</p>
          <div className="flex items-center gap-1.5 mt-1">
            <FreshnessTimer harvestDate={product.harvestDate} />
          </div>
        </div>

        <div className="flex items-baseline justify-between gap-2">
          <div>
            <AnimatePresence mode="popLayout">
              <motion.span
                key={product.price}
                initial={{ color: '#FAD48A', scale: 1.15 }}
                animate={{ color: '#F6BD60', scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.4 }}
                className="text-xl font-extrabold text-soil-gold inline-block"
              >
                ₹{product.price.toFixed(2)}
              </motion.span>
            </AnimatePresence>
            <span className="text-xs text-text-muted">/{product.unit}</span>
          </div>
          <div className="flex items-center gap-2">
            <AnimatePresence>
              {delta && (
                <motion.span
                  key={`${delta.up}-${delta.amount}-${product.price}`}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.3 }}
                  className={`flex items-center gap-0.5 text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
                    delta.up ? 'bg-emerald-500/15 text-emerald-400' : 'bg-red-500/15 text-red-400'
                  }`}
                >
                  {delta.up ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                  ₹{delta.amount.toFixed(2)}
                </motion.span>
              )}
            </AnimatePresence>
            <span className="text-[10px] text-text-muted">{product.availability}</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 mt-auto pt-1">
          <button
            onClick={handleAdd}
            disabled={outOfStock}
            className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-xs font-bold transition cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed ${
              outOfStock
                ? 'bg-white/10 text-text-muted'
                : added
                  ? 'bg-emerald-600 text-white'
                  : 'bg-gradient-to-r from-soil-emerald to-soil-leaf text-white hover:brightness-110'
            }`}
          >
            {outOfStock ? (
              'Out of Stock'
            ) : added ? (
              <><Check className="w-3.5 h-3.5" /> Added</>
            ) : (
              <><ShoppingCart className="w-3.5 h-3.5" /> Add to Cart</>
            )}
          </button>
          {product.minBulkQty && (
            <button
              onClick={() => setBulkOpen(true)}
              className="flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl text-xs font-bold text-soil-gold border border-soil-gold/40 bg-soil-gold/10 hover:bg-soil-gold/20 hover:brightness-110 transition cursor-pointer"
              title={`Bulk order (min ${product.minBulkQty}kg)`}
            >
              <Package className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Bulk</span>
            </button>
          )}
        </div>

        {/* Expand Reviews */}
        <button
          onClick={() => setShowDetails(!showDetails)}
          className="text-[10px] font-bold text-soil-gold/70 hover:text-soil-gold transition cursor-pointer text-left"
        >
          {showDetails ? '▲ Hide details' : '▼ Reviews & details'}
        </button>

        {/* Expandable Section */}
        <AnimatePresence>
          {showDetails && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden space-y-3"
            >
              <ReviewSection productId={product.id} />
              <PriceComparison productName={product.name} />
              {outOfStock && allProducts.length > 0 && (
                <SubstitutionSuggestion outOfStockProduct={product} allProducts={allProducts} />
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Bulk Order Modal */}
      {product.minBulkQty && (
        <BulkOrderModal
          open={bulkOpen}
          onClose={() => setBulkOpen(false)}
          productId={product.id}
          productName={product.name}
          productImage={product.image}
          originalPrice={product.price}
          minBulkQty={product.minBulkQty}
        />
      )}
    </div>
  );
}

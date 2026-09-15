import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { X, Minus, Plus, ShoppingCart, MapPin, ShieldCheck, Package, Leaf } from 'lucide-react';
import type { MockProduct } from '../../data/mockProducts';
import { mockProducts } from '../../data/mockProducts';
import { useMarketplaceStore } from '../../store/marketplaceStore';
import { useFlashDealStore } from '../../store/flashDealStore';
import { useNotificationStore } from '../../store/notificationStore';
import { useAuthStore } from '../../store/authStore';
import { GlassButton } from '../ui/primitives';
import SeasonalTag from './SeasonalTag';
import FreshnessTimer from './FreshnessTimer';
import PriceComparison from './PriceComparison';
import ReviewSection from './ReviewSection';
import SubstitutionSuggestion from './SubstitutionSuggestion';
import BulkOrderModal from './BulkOrderModal';

interface ProductDetailsModalProps {
  product: MockProduct;
  onClose: () => void;
}

export default function ProductDetailsModal({ product, onClose }: ProductDetailsModalProps) {
  const addToCart = useMarketplaceStore((s) => s.addToCart);
  const deal = useFlashDealStore((s) => s.deals[product.id]);
  const pushToast = useNotificationStore((s) => s.pushToast);
  const user = useAuthStore((s) => s.user);
  const [qty, setQty] = useState(1);
  const [bulkOpen, setBulkOpen] = useState(false);

  const canBuy = user?.role === 'CONSUMER';
  const outOfStock = product.availableQty === 0;
  const displayPrice = deal ? deal.price : product.price;

  const clampQty = (next: number) => Math.min(Math.max(1, next), Math.max(1, product.availableQty));

  const addProduct = () => {
    if (outOfStock) return;
    Array.from({ length: qty }).forEach(() =>
      addToCart({
        id: product.id,
        name: product.name,
        price: displayPrice,
        unit: product.unit,
        image: product.image,
        grade: product.grade,
      }),
    );
    pushToast({ title: 'Added to cart', message: `${qty} × ${product.name} added (₹${(displayPrice * qty).toFixed(2)})`, type: 'success' });
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[120] flex items-center justify-center p-3 sm:p-6"
        role="dialog"
        aria-modal="true"
        aria-label={`${product.name} details`}
      >
        <div className="absolute inset-0 bg-black/70 backdrop-blur-md" onClick={onClose} />

        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 16 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 16 }}
          transition={{ type: 'spring', stiffness: 300, damping: 28 }}
          className="relative w-full max-w-3xl glass-panel overflow-y-auto max-h-[92vh] scrollbar-none"
        >
          {/* Header image */}
          <div className="relative h-44 sm:h-56">
            <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-soil-deep via-soil-deep/30 to-transparent" />
            <button
              onClick={onClose}
              className="absolute top-3 right-3 p-2 rounded-xl bg-black/50 backdrop-blur text-white hover:bg-black/70 transition cursor-pointer"
              aria-label="Close details"
            >
              <X className="w-4 h-4" />
            </button>
            <div className="absolute bottom-3 left-3 flex flex-wrap items-center gap-1.5">
              <span className="flex items-center gap-1 px-2 py-1 rounded-full bg-black/50 backdrop-blur text-[10px] font-bold text-text-primary">
                <Leaf className="w-3 h-3 text-soil-gold" /> {product.category}
              </span>
              <span className="px-2 py-1 rounded-full bg-black/50 backdrop-blur text-[10px] font-bold text-soil-goldSoft">
                {product.grade}
              </span>
              {product.brand && (
                <span className="flex items-center gap-1 px-2 py-1 rounded-full bg-soil-emerald/90 backdrop-blur text-[10px] font-bold text-white">
                  <ShieldCheck className="w-3 h-3" /> Farm Passport Verified
                </span>
              )}
            </div>
          </div>

          <div className="p-5 sm:p-6 space-y-5">
            {/* Title + price */}
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div className="min-w-0">
                <h2 className="font-display font-extrabold text-xl sm:text-2xl text-text-primary">{product.name}</h2>
                <p className="text-[11px] text-text-muted mt-1 flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-soil-gold shrink-0" /> {product.location} · {product.supplier}
                </p>
                <div className="flex flex-wrap items-center gap-2 mt-2">
                  <SeasonalTag productId={product.id} />
                  {product.harvestDate && <FreshnessTimer harvestDate={product.harvestDate} />}
                </div>
              </div>
              <div className="text-right shrink-0">
                {deal && (
                  <div className="text-[11px] font-semibold text-red-300">
                    <span className="line-through text-text-muted">₹{deal.originalPrice.toFixed(2)}</span>
                    <span className="ml-1.5 bg-gradient-to-r from-red-500 to-orange-400 px-1.5 py-0.5 rounded text-white font-bold">
                      FLASH {deal.discountPct}% OFF
                    </span>
                  </div>
                )}
                <div className="font-display font-extrabold text-3xl text-soil-gold">
                  ₹{displayPrice.toFixed(2)}
                  <span className="text-sm text-text-muted font-semibold">/{product.unit}</span>
                </div>
                <div className={`text-[11px] font-bold mt-1 ${outOfStock ? 'text-red-400' : product.availableQty < 50 ? 'text-amber-300' : 'text-emerald-400'}`}>
                  {outOfStock ? 'Currently out of stock' : `${product.availableQty.toLocaleString()} ${product.unit} in stock`}
                </div>
              </div>
            </div>

            {/* Action row */}
            <div className="flex flex-wrap items-center gap-3">
              <div className="flex items-center gap-2 glass-panel-sm px-2 py-1.5">
                <button
                  onClick={() => setQty(clampQty(qty - 1))}
                  className="w-8 h-8 rounded-lg glass-button flex items-center justify-center cursor-pointer"
                  aria-label="Decrease quantity"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <span className="w-10 text-center font-extrabold text-sm text-soil-gold">{qty}</span>
                <button
                  onClick={() => setQty(clampQty(qty + 1))}
                  disabled={outOfStock || qty >= product.availableQty}
                  className="w-8 h-8 rounded-lg glass-button flex items-center justify-center cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                  aria-label="Increase quantity"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>
              <GlassButton
                variant="green"
                onClick={addProduct}
                disabled={outOfStock || !canBuy}
                title={canBuy ? undefined : 'Only consumers can place marketplace orders'}
                className="flex-1 sm:flex-none justify-center items-center gap-1.5"
              >
                <ShoppingCart className="w-4 h-4" /> {canBuy ? `Add to Cart · ₹${(displayPrice * qty).toFixed(2)}` : 'Consumer checkout only'}
              </GlassButton>
              {product.minBulkQty && (
                <GlassButton variant="ghost" onClick={() => setBulkOpen(true)} className="justify-center items-center gap-1.5">
                  <Package className="w-4 h-4" /> Bulk (min {product.minBulkQty}{product.unit})
                </GlassButton>
              )}
              <Link to="/cart" className="text-[11px] font-bold text-soil-gold hover:underline px-1">
                View Cart →
              </Link>
            </div>

            {/* Alternative suggestions when unavailable */}
            {outOfStock && <SubstitutionSuggestion outOfStockProduct={product} allProducts={mockProducts} />}

            {/* Price comparison across suppliers */}
            <PriceComparison productName={product.name} />

            {/* Ratings & reviews */}
            <div className="space-y-3">
              <h3 className="font-display font-bold text-sm text-text-primary flex items-center gap-2">
                <Package className="w-4 h-4 text-soil-gold" /> Ratings &amp; Reviews
              </h3>
              <ReviewSection productId={product.id} />
            </div>
          </div>

          {product.minBulkQty && (
            <BulkOrderModal
              open={bulkOpen}
              onClose={() => setBulkOpen(false)}
              productId={product.id}
              productName={product.name}
              productImage={product.image}
              originalPrice={displayPrice}
              minBulkQty={product.minBulkQty}
            />
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
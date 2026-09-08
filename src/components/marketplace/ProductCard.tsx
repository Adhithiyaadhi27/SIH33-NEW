import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingCart, ShieldCheck, Zap, Check, TrendingUp, TrendingDown } from 'lucide-react';
import type { MockProduct } from '../../data/mockProducts';
import { useMarketplaceStore } from '../../store/marketplaceStore';
import useTranslation from '../../services/useTranslation';
import CheckoutModal from '../payment/CheckoutModal';

export default function ProductCard({ product }: { product: MockProduct }) {
  const addToCart = useMarketplaceStore((s) => s.addToCart);
  const { t } = useTranslation();
  const [added, setAdded] = useState(false);
  const [buyNow, setBuyNow] = useState(false);
  const prevPrice = useRef(product.price);
  const [delta, setDelta] = useState<{ up: boolean; amount: number } | null>(null);

  // Detect a live price tick and flash a direction badge
  useEffect(() => {
    if (product.price === prevPrice.current) return;
    const diff = product.price - prevPrice.current;
    prevPrice.current = product.price;
    setDelta({ up: diff > 0, amount: Math.abs(diff) });
    const timer = setTimeout(() => setDelta(null), 2500);
    return () => clearTimeout(timer);
  }, [product.price]);

  const handleAdd = () => {
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

  return (
    <div className="glass-panel-sm overflow-hidden group hover:border-soil-gold/40 transition-all duration-300 hover:-translate-y-1 flex flex-col justify-between">
      {/* Image */}
      <div className="relative h-40 overflow-hidden bg-soil-deep/60">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
        {product.brand && (
          <div className="absolute top-2.5 left-2.5 flex items-center gap-1 bg-soil-emerald/90 backdrop-blur px-2 py-1 rounded-full text-[9px] font-bold text-white">
            <ShieldCheck className="w-3 h-3 text-soil-gold" />
            {t('marketplace.farm_passport_verified')}
          </div>
        )}
        <div className="absolute top-2.5 right-2.5 flex items-center gap-1 bg-black/50 backdrop-blur px-2 py-1 rounded-full text-[9px] font-bold text-soil-gold">
          <Zap className="w-3 h-3" /> {t('marketplace.live_pricing')}
          <span className="relative flex h-1.5 w-1.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-400" />
          </span>
        </div>
        <div className="absolute bottom-2 left-2 right-2 flex justify-between text-white text-[10px] font-semibold">
          <span>{t('marketplace.grade')} {product.grade}</span>
          <span className="bg-black/40 px-1.5 py-0.5 rounded">{t('marketplace.available', { qty: product.availableQty })}</span>
        </div>
      </div>

      {/* Body */}
      <div className="p-3.5 space-y-2.5 flex-1 flex flex-col">
        <div>
          <h4 className="font-display font-bold text-sm text-text-primary">{product.name}</h4>
          <p className="text-[10px] text-text-muted">{product.location} · {product.supplier}</p>
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

        <div className="flex items-center gap-2 mt-auto pt-1">
          <button
            onClick={handleAdd}
            className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
              added
                ? 'bg-emerald-600 text-white'
                : 'bg-gradient-to-r from-soil-emerald to-soil-leaf text-white hover:brightness-110'
            }`}
          >
            {added ? <Check className="w-3.5 h-3.5" /> : <ShoppingCart className="w-3.5 h-3.5" />}
            {added ? t('marketplace.added') : t('marketplace.add_to_cart')}
          </button>
          <button
            onClick={() => setBuyNow(true)}
            className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold text-soil-gold border border-soil-gold/40 bg-soil-gold/10 hover:bg-soil-gold/20 hover:brightness-110 transition cursor-pointer"
            title={t('marketplace.buy_now')}
          >
            <Zap className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">{t('marketplace.buy_now')}</span>
          </button>
        </div>
      </div>

      <CheckoutModal
        open={buyNow}
        onClose={() => setBuyNow(false)}
        items={[{ productId: product.id, name: product.name, unit: product.unit, quantity: 1, price: product.price, image: product.image, grade: product.grade }]}
      />
    </div>
  );
}
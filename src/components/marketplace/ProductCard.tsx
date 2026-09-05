import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingCart, ShieldCheck, Zap, Check } from 'lucide-react';
import type { MockProduct } from '../../data/mockProducts';
import { useMarketplaceStore } from '../../store/marketplaceStore';

export default function ProductCard({ product }: { product: MockProduct }) {
  const addToCart = useMarketplaceStore((s) => s.addToCart);
  const [added, setAdded] = useState(false);

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
            {product.brand}
          </div>
        )}
        <div className="absolute top-2.5 right-2.5 flex items-center gap-1 bg-black/50 backdrop-blur px-2 py-1 rounded-full text-[9px] font-bold text-soil-gold">
          <Zap className="w-3 h-3" /> Live Pricing
        </div>
        <div className="absolute bottom-2 left-2 right-2 flex justify-between text-white text-[10px] font-semibold">
          <span>{product.grade}</span>
          <span className="bg-black/40 px-1.5 py-0.5 rounded">{product.availableQty} kg avail</span>
        </div>
      </div>

      {/* Body */}
      <div className="p-3.5 space-y-2.5 flex-1 flex flex-col">
        <div>
          <h4 className="font-display font-bold text-sm text-text-primary">{product.name}</h4>
          <p className="text-[10px] text-text-muted">{product.location} · {product.supplier}</p>
        </div>

        <div className="flex items-baseline justify-between">
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
          <span className="text-[10px] text-text-muted">{product.availability}</span>
        </div>

        <button
          onClick={handleAdd}
          className={`mt-auto w-full flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
            added
              ? 'bg-emerald-600 text-white'
              : 'bg-gradient-to-r from-soil-emerald to-soil-leaf text-white hover:brightness-110'
          }`}
        >
          {added ? <Check className="w-3.5 h-3.5" /> : <ShoppingCart className="w-3.5 h-3.5" />}
          {added ? 'Added!' : 'Add to Cart'}
        </button>
      </div>
    </div>
  );
}
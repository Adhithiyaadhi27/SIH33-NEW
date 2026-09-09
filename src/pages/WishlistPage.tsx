import { Link } from 'react-router-dom';
import { Heart, Trash2, ShoppingBag, ShoppingCart } from 'lucide-react';
import { useWishlistStore } from '../store/wishlistStore';
import { useMarketplaceStore } from '../store/marketplaceStore';
import { GlassCard, FadeIn } from '../components/ui/primitives';
import { useState } from 'react';

export default function WishlistPage() {
  const { items, removeWishlist, clearWishlist } = useWishlistStore();
  const addToCart = useMarketplaceStore((s) => s.addToCart);
  const [addedIds, setAddedIds] = useState<Set<string>>(new Set());

  const handleAddToCart = (item: typeof items[0]) => {
    addToCart({ id: item.id, name: item.name, price: item.price, unit: item.unit, image: item.image, grade: item.grade });
    setAddedIds((prev) => new Set(prev).add(item.id));
    setTimeout(() => setAddedIds((prev) => { const n = new Set(prev); n.delete(item.id); return n; }), 1200);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-24 space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display font-extrabold text-2xl text-text-primary">My Wishlist</h1>
          <p className="text-xs text-text-muted mt-1">{items.length} saved items</p>
        </div>
        <div className="flex gap-2">
          {items.length > 0 && (
            <button onClick={clearWishlist} className="text-[10px] font-bold text-red-400 hover:text-red-300 cursor-pointer">
              Clear All
            </button>
          )}
          <Link to="/marketplace" className="text-[10px] font-bold text-soil-gold hover:underline">Browse Marketplace →</Link>
        </div>
      </div>

      {items.length === 0 ? (
        <GlassCard className="p-12 text-center space-y-3">
          <div className="flex justify-center text-soil-gold"><Heart className="w-10 h-10" /></div>
          <h3 className="font-display font-bold text-lg text-text-primary">Your wishlist is empty</h3>
          <p className="text-xs text-text-muted max-w-sm mx-auto">Save products you love and get notified about price drops.</p>
          <Link to="/marketplace" className="inline-flex items-center gap-1.5 text-xs font-bold text-soil-gold hover:underline">
            Browse Marketplace →
          </Link>
        </GlassCard>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {items.map((item) => (
            <FadeIn key={item.id}>
              <GlassCard className="p-4 space-y-3">
                <div className="relative h-32 rounded-xl overflow-hidden bg-soil-deep/60">
                  <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                  <button
                    onClick={() => removeWishlist(item.id)}
                    className="absolute top-2 right-2 p-1.5 rounded-full bg-black/50 text-red-400 hover:bg-red-500/30 transition cursor-pointer"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
                <div>
                  <h4 className="font-bold text-sm text-text-primary">{item.name}</h4>
                  <p className="text-[10px] text-text-muted">{item.location} · {item.supplier}</p>
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-extrabold text-soil-gold">₹{item.price.toFixed(2)}<span className="text-[10px] font-normal text-text-muted">/{item.unit}</span></span>
                  <button
                    onClick={() => handleAddToCart(item)}
                    className={`flex items-center gap-1 px-3 py-1.5 rounded-xl text-[10px] font-bold transition cursor-pointer ${
                      addedIds.has(item.id)
                        ? 'bg-emerald-600 text-white'
                        : 'bg-gradient-to-r from-soil-emerald to-soil-leaf text-white hover:brightness-110'
                    }`}
                  >
                    <ShoppingCart className="w-3 h-3" />
                    {addedIds.has(item.id) ? 'Added' : 'Add to Cart'}
                  </button>
                </div>
              </GlassCard>
            </FadeIn>
          ))}
        </div>
      )}
    </div>
  );
}

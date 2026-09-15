import { useState } from 'react';
import { ShoppingCart, ShieldCheck, Check, Heart, Zap, Eye } from 'lucide-react';
import type { MockProduct } from '../../data/mockProducts';
import { useMarketplaceStore } from '../../store/marketplaceStore';
import { useWishlistStore } from '../../store/wishlistStore';
import { useFlashDealStore } from '../../store/flashDealStore';
import { useAuthStore } from '../../store/authStore';

interface ProductCardProps {
  product: MockProduct;
  allProducts?: MockProduct[];
  onViewDetail?: (product: MockProduct) => void;
}

export default function ProductCard({ product, onViewDetail }: ProductCardProps) {
  const addToCart = useMarketplaceStore((s) => s.addToCart);
  const inCartQty = useMarketplaceStore((s) => s.cart.find((i) => i.id === product.id)?.quantity ?? 0);
  const { toggleWishlist, isWishlisted } = useWishlistStore();
  const deal = useFlashDealStore((s) => s.deals[product.id]);
  const user = useAuthStore((s) => s.user);
  const [added, setAdded] = useState(false);

  const wishlisted = isWishlisted(product.id);
  const outOfStock = product.availableQty === 0;
  const displayPrice = deal ? deal.price : product.price;

  const canBuy = user?.role === 'CONSUMER';
  const maxedInCart = canBuy && inCartQty >= product.availableQty;

  const handleAdd = () => {
    if (outOfStock || !canBuy) return;
    addToCart({
      id: product.id,
      name: product.name,
      price: displayPrice,
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
      price: displayPrice,
      unit: product.unit,
      image: product.image,
      grade: product.grade,
      category: product.category,
      supplier: product.supplier,
      location: product.location,
    });
  };

  const addDisabled = outOfStock || !canBuy || maxedInCart;
  const addLabel = outOfStock
    ? 'Out of Stock'
    : !canBuy
      ? user
        ? `${user.role.replace('_', ' ').toLowerCase()} — browsing only`
        : 'Sign in to order'
      : maxedInCart
        ? 'Max in cart'
        : added
          ? 'Added'
          : 'Add to Cart';
  const addHint = !canBuy
    ? user
      ? 'Only consumers can place marketplace orders'
      : 'Sign in as a Consumer to add items to your cart'
    : maxedInCart
      ? `All ${product.availableQty} ${product.unit} are already in your cart`
      : undefined;

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
            {deal && (
              <div className="flex items-center gap-1 bg-gradient-to-r from-red-500 to-orange-400 backdrop-blur px-2 py-1 rounded-full text-[9px] font-bold text-white shadow-glow-gold">
                <Zap className="w-3 h-3 animate-pulse" />
                FLASH {deal.discountPct}% OFF
              </div>
            )}
          </div>
          <button
            onClick={handleWishlist}
            className="p-1.5 rounded-full bg-black/50 backdrop-blur transition cursor-pointer hover:bg-red-500/30"
            title={wishlisted ? 'Remove from Wishlist' : 'Save to Wishlist'}
          >
            <Heart className={`w-3.5 h-3.5 transition ${wishlisted ? 'fill-red-400 text-red-400' : 'text-white/70'}`} />
          </button>
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
          <h4 className="font-display font-bold text-sm text-text-primary">{product.name}</h4>
          <p className="text-[10px] text-text-muted">{product.location} · {product.supplier}</p>
        </div>

        <div className="flex items-baseline justify-between gap-2">
          <div>
            {deal && (
              <div className="text-[11px] font-semibold text-red-300">
                <span className="line-through text-text-muted">₹{deal.originalPrice.toFixed(2)}</span>
                <span className="ml-1">Flash ₹</span>
              </div>
            )}
            <span className="text-xl font-extrabold text-soil-gold">₹{displayPrice.toFixed(2)}</span>
            <span className="text-xs text-text-muted">/{product.unit}</span>
          </div>
          <span className="text-[10px] text-text-muted">{product.availability}</span>
        </div>

        {deal && (
          <div className="text-[9px] leading-relaxed text-text-muted/80 -mt-1.5">
            <span className="text-red-300 font-bold">Reroute deal · </span>
            {deal.reason}
            <span className="text-soil-gold font-semibold"> · Ends in {deal.expiresIn}</span>
          </div>
        )}

        {/* Add to Cart */}
        <div className="mt-auto pt-1 space-y-1.5">
          {canBuy && inCartQty > 0 && (
            <div className="flex items-center gap-1.5 text-[10px] font-bold text-emerald-300 bg-emerald-500/10 border border-emerald-400/25 px-2 py-1 rounded-lg">
              <ShoppingCart className="w-3 h-3" /> {inCartQty} in cart
            </div>
          )}
          <button
            onClick={handleAdd}
            disabled={addDisabled}
            title={addHint}
            className={`w-full flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-xs font-bold transition cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed ${
              addDisabled
                ? 'bg-white/10 text-text-muted'
                : added
                  ? 'bg-emerald-600 text-white'
                  : 'bg-gradient-to-r from-soil-emerald to-soil-leaf text-white hover:brightness-110'
            }`}
          >
            {addDisabled ? (
              addLabel
            ) : added ? (
              <><Check className="w-3.5 h-3.5" /> Added</>
            ) : (
              <><ShoppingCart className="w-3.5 h-3.5" /> Add to Cart</>
            )}
          </button>
          {onViewDetail && (
            <button
              onClick={() => onViewDetail(product)}
              className="w-full flex items-center justify-center gap-1 py-1.5 rounded-xl text-[10px] font-bold text-soil-gold border border-soil-gold/30 hover:bg-soil-gold/10 transition cursor-pointer"
            >
              <Eye className="w-3 h-3" /> View Details
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

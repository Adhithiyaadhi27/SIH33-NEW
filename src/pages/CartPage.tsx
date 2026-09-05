import { useMarketplaceStore } from '../store/marketplaceStore';
import { GlassCard, GlassButton } from '../components/ui/primitives';
import { Trash2, ShoppingBag, ArrowDown } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useNotificationStore } from '../store/notificationStore';

export default function CartPage() {
  const { cart, removeFromCart, updateQuantity, clearCart, totalItems, totalValue } = useMarketplaceStore();
  const pushToast = useNotificationStore((s) => s.pushToast);

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-24 space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display font-extrabold text-2xl text-text-primary">Your Market Basket</h1>
          <p className="text-xs text-text-muted mt-1">{totalItems()} items · ₹{totalValue().toFixed(2)}</p>
        </div>
        <Link to="/marketplace">
          <GlassButton variant="glass">Continue Shopping</GlassButton>
        </Link>
      </div>

      {cart.length === 0 ? (
        <GlassCard className="p-12 text-center space-y-3">
          <div className="flex justify-center text-soil-gold"><ShoppingBag className="w-10 h-10" /></div>
          <h3 className="font-display font-bold text-lg text-text-primary">Your basket is empty</h3>
          <p className="text-xs text-text-muted max-w-sm mx-auto">
            Browse the marketplace and add fresh verified produce.
          </p>
          <div className="pt-2">
            <Link to="/marketplace" className="inline-flex items-center gap-1.5 text-xs font-bold text-soil-gold hover:underline">
              Explore Marketplace <ArrowDown className="w-3.5 h-3.5" />
            </Link>
          </div>
        </GlassCard>
      ) : (
        <div className="space-y-3">
          {cart.map((item) => (
            <GlassCard key={item.id} className="p-4 flex items-center gap-4">
              <img src={item.image} alt={item.name} className="w-16 h-16 rounded-xl object-cover" />
              <div className="flex-1 min-w-0">
                <div className="font-bold text-sm text-text-primary">{item.name}</div>
                <div className="text-[11px] text-text-muted">{item.grade} · ₹{item.price.toFixed(2)}/{item.unit}</div>
                <div className="flex items-center gap-2 mt-2">
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                    className="w-7 h-7 rounded-lg glass-button flex items-center justify-center text-sm cursor-pointer"
                  >
                    −
                  </button>
                  <span className="text-sm font-bold text-soil-gold w-6 text-center">{item.quantity}</span>
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    className="w-7 h-7 rounded-lg glass-button flex items-center justify-center text-sm cursor-pointer"
                  >
                    +
                  </button>
                </div>
              </div>
              <div className="text-right shrink-0">
                <div className="font-extrabold text-soil-gold">₹{(item.price * item.quantity).toFixed(2)}</div>
                <button
                  onClick={() => removeFromCart(item.id)}
                  className="mt-2 text-text-muted hover:text-red-400 transition cursor-pointer"
                  title="Remove"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </GlassCard>
          ))}

          <GlassCard className="p-5 flex flex-wrap items-center justify-between gap-3">
            <div>
              <div className="text-xs text-text-muted">Total</div>
              <div className="font-display font-extrabold text-2xl text-soil-gold">₹{totalValue().toFixed(2)}</div>
            </div>
            <div className="flex gap-3">
              <GlassButton variant="ghost" onClick={clearCart}>Clear</GlassButton>
              <GlassButton
                variant="green"
                onClick={() =>
                  pushToast({
                    title: 'Order Placed',
                    message: 'Your produce order has been received successfully.',
                    type: 'success',
                  })
                }
              >
                Checkout
              </GlassButton>
            </div>
          </GlassCard>
        </div>
      )}
    </div>
  );
}
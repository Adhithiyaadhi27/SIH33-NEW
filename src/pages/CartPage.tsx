import { useState, useRef } from 'react';
import { useMarketplaceStore } from '../store/marketplaceStore';
import { useOrderTrackingStore, type TrackedOrder } from '../store/orderTrackingStore';
import { useInventoryStore } from '../store/inventoryStore';
import { useFarmerProductsStore } from '../store/farmerProductsStore';
import { useNotificationStore } from '../store/notificationStore';
import { useAuthStore } from '../store/authStore';
import { GlassCard, GlassButton } from '../components/ui/primitives';
import { Trash2, ShoppingBag, ArrowDown, Plus, MapPin } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import CheckoutModal, { type CheckoutItem } from '../components/payment/CheckoutModal';
import DeliverySchedule from '../components/checkout/DeliverySchedule';
import { DELIVERY_SLOTS, buildDeliveryDates } from '../data/deliverySchedule';
import LoyaltyWidget from '../components/loyalty/LoyaltyWidget';

export default function CartPage() {
  const navigate = useNavigate();
  const { cart, removeFromCart, updateQuantity, clearCart, totalItems, totalValue } = useMarketplaceStore();
  const addOrder = useOrderTrackingStore((s) => s.addOrder);
  const reduceStock = useInventoryStore((s) => s.reduceStock);
  const reduceFarmerStock = useFarmerProductsStore((s) => s.reduceStock);
  const inventory = useInventoryStore((s) => s.items);
  const pushToast = useNotificationStore((s) => s.pushToast);
  const user = useAuthStore((s) => s.user);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [checkoutItems, setCheckoutItems] = useState<CheckoutItem[]>([]);
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [deliveryAddress, setDeliveryAddress] = useState<string>(
    () => `${user?.location ?? 'Consumer pickup'} — Main Market, Chennai`,
  );
  const placedOrderRef = useRef(false);

  const selectedDateLabel = buildDeliveryDates().find((d) => d.id === selectedDate)?.label ?? selectedDate;
  const selectedSlotLabel = DELIVERY_SLOTS.find((s) => s.id === selectedSlot)?.label ?? selectedSlot;

  const stockOf = (id: string) => inventory.find((i) => i.id === id)?.quantity ?? 0;

  const openCheckout = () => {
    const overStock = cart.filter((item) => {
      const inv = inventory.find((i) => i.id === item.id);
      return inv && item.quantity > inv.quantity;
    });
    if (overStock.length > 0) {
      pushToast({
        title: 'Insufficient stock',
        message: `${overStock.map((i) => i.name).join(', ')} exceed available stock. Please reduce quantity.`,
        type: 'error',
      });
      return;
    }
    if (!deliveryAddress.trim()) {
      pushToast({ title: 'Missing delivery address', message: 'Please enter where your order should be delivered.', type: 'error' });
      return;
    }
    setCheckoutItems(
      cart.map((item) => ({
        productId: item.id,
        name: item.name,
        unit: item.unit,
        quantity: item.quantity,
        price: item.price,
        image: item.image,
        grade: item.grade,
      })),
    );
    setCheckoutOpen(true);
  };

  const handlePaid = (order: Record<string, unknown>) => {
    const first = cart[0];
    if (order?.id) {
      cart.forEach((item) => {
        reduceStock(item.id, item.quantity);
        reduceFarmerStock(item.id, item.quantity);
      });
      const tracked: TrackedOrder = {
        id: String(order.id),
        productName: first ? `${first.name}${cart.length > 1 ? ` +${cart.length - 1} more` : ''}` : 'Produce order',
        productImage: first?.image ?? '',
        status: 'confirmed',
        currentLat: 13.0827,
        currentLng: 80.2707,
        destinationLat: 13.0827,
        destinationLng: 80.2707,
        driverName: 'Carrier assigned at dispatch',
        driverPhone: '',
        vehicleNo: '—',
        eta: selectedSlotLabel ? `${selectedDateLabel ?? 'Selected date'} · ${selectedSlotLabel}` : 'Scheduled',
        total: Number(order.total ?? totalValue()),
        orderDate: new Date().toLocaleDateString([], { day: '2-digit', month: 'short', year: 'numeric' }),
        deliveryAddress: deliveryAddress.trim(),
        paymentStatus: String(order.paymentStatus ?? 'PAID'),
        userId: user?.id,
        items: cart.map((i) => ({
          productId: i.id,
          name: i.name,
          quantity: i.quantity,
          unit: i.unit,
          price: i.price,
          lineTotal: i.price * i.quantity,
        })),
        events: [
          {
            time: new Date().toLocaleString([], { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' }),
            location: deliveryAddress.trim(),
            status: 'Order Confirmed',
            lat: 13.0827,
            lng: 80.2707,
          },
        ],
      };
      addOrder(tracked);
      placedOrderRef.current = true;
    }
    clearCart();
    setCheckoutOpen(false);
    setSelectedSlot(null);
    setSelectedDate(null);
  };

  const handleCloseCheckout = () => {
    const justPlaced = placedOrderRef.current;
    placedOrderRef.current = false;
    setCheckoutOpen(false);
    if (justPlaced) {
      navigate('/tracking');
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-24 space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display font-extrabold text-2xl text-text-primary">Your Cart</h1>
          <p className="text-xs text-text-muted mt-1">{totalItems()} {totalItems() === 1 ? 'item' : 'items'} · ₹{totalValue().toFixed(2)}</p>
        </div>
        <Link to="/marketplace">
          <GlassButton variant="glass">
            <span className="flex items-center gap-1.5"><Plus className="w-3.5 h-3.5" /> Add More Items</span>
          </GlassButton>
        </Link>
      </div>

      {cart.length === 0 ? (
        <GlassCard className="p-12 text-center space-y-3">
          <div className="flex justify-center text-soil-gold"><ShoppingBag className="w-10 h-10" /></div>
          <h3 className="font-display font-bold text-lg text-text-primary">Your cart is empty</h3>
          <p className="text-xs text-text-muted max-w-sm mx-auto">
            Add fresh produce from verified FPOs to get started.
          </p>
          <div className="pt-2">
            <Link to="/marketplace" className="inline-flex items-center gap-1.5 text-xs font-bold text-soil-gold hover:underline">
              Explore Marketplace <ArrowDown className="w-3.5 h-3.5" />
            </Link>
          </div>
        </GlassCard>
      ) : (
        <div className="grid lg:grid-cols-3 gap-4">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-3">
            {cart.map((item) => {
              const maxQty = stockOf(item.id);
              const atMax = maxQty > 0 && item.quantity >= maxQty;
              return (
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
                        disabled={atMax}
                        title={atMax ? `Only ${maxQty} ${item.unit} in stock` : 'Increase quantity'}
                        className="w-7 h-7 rounded-lg glass-button flex items-center justify-center text-sm cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
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
              );
            })}

            {/* Delivery Schedule */}
            <GlassCard className="p-4">
              <h3 className="font-display font-bold text-sm text-text-primary mb-3">Delivery Schedule</h3>
              <div className="space-y-1.5 mb-3">
                <label className="text-[11px] font-bold text-soil-gold uppercase tracking-wide">Delivery Address</label>
                <div className="relative">
                  <MapPin className="w-3.5 h-3.5 text-soil-gold absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    value={deliveryAddress}
                    onChange={(e) => setDeliveryAddress(e.target.value)}
                    placeholder="Enter a full delivery address"
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-white/5 border border-white/15 text-sm text-text-primary placeholder-text-muted focus:outline-none focus:border-soil-gold/50"
                  />
                </div>
              </div>
              <DeliverySchedule
                selectedSlot={selectedSlot}
                selectedDate={selectedDate}
                onSelectSlot={setSelectedSlot}
                onSelectDate={setSelectedDate}
              />
            </GlassCard>

            {/* Add More Items */}
            <button
              onClick={() => navigate('/marketplace')}
              className="w-full flex items-center justify-center gap-2 p-3 rounded-xl bg-white/5 border border-dashed border-white/20 text-sm font-semibold text-text-muted hover:text-soil-gold hover:border-soil-gold/40 transition cursor-pointer"
            >
              <Plus className="w-4 h-4" /> Add More Items to Cart
            </button>
          </div>

          {/* Sidebar */}
          <div className="space-y-3">
            <GlassCard className="p-5 space-y-3">
              <div className="text-xs text-text-muted">Total</div>
              <div className="font-display font-extrabold text-2xl text-soil-gold">₹{totalValue().toFixed(2)}</div>
              {selectedSlot && (
                <div className="text-[10px] text-emerald-400 font-bold">Delivery: {selectedDateLabel} · {selectedSlotLabel} slot selected</div>
              )}
              <div className="flex gap-3">
                <GlassButton variant="ghost" onClick={clearCart}>Clear</GlassButton>
                <GlassButton variant="green" onClick={openCheckout} disabled={!selectedDate || !selectedSlot}>
                  Checkout
                </GlassButton>
              </div>
              {(!selectedDate || !selectedSlot) && (
                <p className="text-[9px] text-amber-400">Select a delivery date and time slot to checkout</p>
              )}
            </GlassCard>

            {/* Loyalty Widget */}
            <GlassCard className="p-4">
              <LoyaltyWidget />
            </GlassCard>
          </div>
        </div>
      )}

      <CheckoutModal
        open={checkoutOpen}
        onClose={handleCloseCheckout}
        items={checkoutItems}
        onSuccess={handlePaid}
        deliveryAddress={deliveryAddress.trim()}
        userId={user?.id}
        customerName={user?.name}
        customerPhone={user?.phone ?? ''}
      />
    </div>
  );
}

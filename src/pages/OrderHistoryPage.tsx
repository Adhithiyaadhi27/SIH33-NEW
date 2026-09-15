import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowLeft,
  Package,
  Clock,
  Truck,
  IndianRupee,
  MapPin,
  CreditCard,
  ShoppingBag,
  Search,
} from 'lucide-react';
import { GlassCard, GlassBadge, FadeIn } from '../components/ui/primitives';
import { SkeletonList } from '../components/ui/skeleton';
import { usePageLoading } from '../hooks/usePageLoading';
import { useOrderTrackingStore } from '../store/orderTrackingStore';
import { useAuthStore } from '../store/authStore';

const FILTERS = ['All', 'Active', 'Delivered'] as const;

export default function OrderHistoryPage() {
  const loading = usePageLoading();
  const [filter, setFilter] = useState<(typeof FILTERS)[number]>('All');
  const [query, setQuery] = useState('');
  const allOrders = useOrderTrackingStore((s) => s.orders);
  const user = useAuthStore((s) => s.user);

  const allTracked = allOrders.filter((o) => !o.userId || o.userId === user?.id);

  const filtered = allTracked.filter((o) => {
    const okFilter =
      filter === 'All' || (filter === 'Active' && o.status !== 'delivered') || (filter === 'Delivered' && o.status === 'delivered');
    const okQuery = !query || o.id.toLowerCase().includes(query.toLowerCase()) || o.productName.toLowerCase().includes(query.toLowerCase());
    return okFilter && okQuery;
  });

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-24">
        <SkeletonList count={5} />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-24 space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <GlassBadge gold>Order History</GlassBadge>
          <h1 className="font-display font-extrabold text-2xl text-text-primary mt-2">My Orders</h1>
          <p className="text-xs text-text-muted mt-1">
            All your marketplace purchases, delivered &amp; in transit — {allTracked.length} total
          </p>
        </div>
        <Link
          to="/marketplace"
          className="flex items-center gap-1 text-[10px] font-bold text-soil-gold hover:underline"
        >
          <ArrowLeft className="w-3 h-3" /> Back to Marketplace
        </Link>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <div className="relative max-w-sm w-full">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by order ID or product…"
            className="w-full pl-9 pr-3 py-2 rounded-xl bg-white/5 border border-white/10 text-xs text-text-primary placeholder:text-text-muted outline-none focus:border-soil-gold/40"
          />
        </div>
        <div className="flex items-center gap-1.5">
          {FILTERS.map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1.5 rounded-xl text-[11px] font-bold transition cursor-pointer ${
                filter === f ? 'bg-soil-gold/25 text-soil-gold' : 'bg-white/5 text-text-muted hover:bg-white/10'
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <FadeIn>
          <GlassCard className="p-12 text-center space-y-3">
            <div className="flex justify-center text-soil-gold"><ShoppingBag className="w-10 h-10" /></div>
            <h3 className="font-display font-bold text-lg text-text-primary">
              {allTracked.length === 0 ? 'No orders yet' : 'No matching orders'}
            </h3>
            <p className="text-xs text-text-muted max-w-sm mx-auto">
              {allTracked.length === 0
                ? `Browse the marketplace and place your first order${user ? `, ${user.name.split(' ')[0]}` : ''}.`
                : 'Try a different filter or search term.'}
            </p>
            <Link
              to="/marketplace"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-[11px] font-bold text-soil-gold bg-soil-gold/15 border border-soil-gold/30 hover:bg-soil-gold/25 transition"
            >
              <ShoppingBag className="w-3.5 h-3.5" /> Go to Marketplace
            </Link>
          </GlassCard>
        </FadeIn>
      ) : (
        <div className="space-y-3">
          {filtered.map((o) => {
            const delivered = o.status === 'delivered';
            const lines = o.items && o.items.length > 0 ? o.items : [];
            return (
              <FadeIn key={o.id}>
                <GlassCard hover className="p-4 sm:p-5 space-y-3">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div className="flex items-center gap-3 min-w-0">
                      <img src={o.productImage} alt="" className="w-12 h-12 rounded-xl object-cover shrink-0" />
                      <div className="min-w-0">
                        <div className="font-bold text-sm text-text-primary truncate">{o.productName}</div>
                        <div className="text-[10px] text-text-muted">{o.id} · {o.orderDate ?? '—'}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold capitalize ${
                        delivered
                          ? 'bg-emerald-500/15 text-emerald-300'
                          : o.status === 'confirmed' || o.status === 'processing'
                            ? 'bg-soil-gold/15 text-soil-gold'
                            : 'bg-purple-500/15 text-purple-300'
                      }`}>
                        {o.status.replace('_', ' ')}
                      </span>
                      <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold ${
                        o.paymentStatus === 'PAID' ? 'bg-emerald-500/15 text-emerald-300' : 'bg-white/10 text-text-muted'
                      }`}>
                        {o.paymentStatus ?? 'PAID'}
                      </span>
                    </div>
                  </div>

                  {lines.length > 0 && (
                    <div className="space-y-1 border-t border-white/5 pt-2.5">
                      {lines.map((it) => (
                        <div key={it.productId} className="flex items-center justify-between text-[11px]">
                          <span className="flex items-center gap-1.5 text-text-primary">
                            <Package className="w-3 h-3 text-soil-gold" /> {it.name} × {it.quantity} {it.unit}
                          </span>
                          <span className="font-bold text-text-secondary">₹{it.lineTotal.toFixed(2)}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  <div className="flex flex-wrap items-center justify-between gap-2 border-t border-white/5 pt-2.5 text-[10px] text-text-muted">
                    <div className="flex flex-wrap items-center gap-3">
                      <span className="flex items-center gap-1"><Truck className="w-3 h-3 text-soil-gold" /> {o.driverName}</span>
                      <span className="flex items-center gap-1"><IndianRupee className="w-3 h-3 text-soil-gold" /> {(o.total ?? 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
                      <span className="flex items-center gap-1"><Clock className="w-3 h-3 text-soil-gold" /> ETA {o.eta}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      {!delivered && (
                        <Link to="/tracking" className="flex items-center gap-1 font-bold text-soil-gold hover:underline">
                          Track <ArrowLeft className="w-3 h-3 rotate-180" />
                        </Link>
                      )}
                      <span className="flex items-center gap-1"><MapPin className="w-3 h-3 text-soil-gold" /> {o.deliveryAddress ?? '—'}</span>
                      <span className="flex items-center gap-1"><CreditCard className="w-3 h-3 text-soil-gold" /> {o.paymentMethod ?? '—'}</span>
                    </div>
                  </div>
                </GlassCard>
              </FadeIn>
            );
          })}
        </div>
      )}
    </div>
  );
}
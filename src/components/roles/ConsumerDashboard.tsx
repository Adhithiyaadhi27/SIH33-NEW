import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ShoppingCart,
  IndianRupee,
  PackageCheck,
  Truck,
  Store,
  ShoppingBag,
  Route,
  Bell,
  ArrowRight,
  Plus,
  Clock,
  ChevronRight,
} from 'lucide-react';
import { motion } from 'framer-motion';
import { GlassCard, MetricTile, GlassBadge, GlassButton, FadeIn, DemoDataBadge } from '../ui/primitives';
import { DashboardSkeleton } from '../ui/skeleton';
import { usePageLoading } from '../../hooks/usePageLoading';
import { mockProducts } from '../../data/mockProducts';
import { useMarketplaceStore } from '../../store/marketplaceStore';
import { useOrderTrackingStore } from '../../store/orderTrackingStore';
import { useAuthStore } from '../../store/authStore';

const FEATURED = mockProducts.slice(0, 9);

const STATUS_COLORS: Record<string, string> = {
  confirmed: 'bg-soil-gold/20 text-soil-gold border border-soil-gold/30',
  processing: 'bg-blue-500/20 text-blue-300 border border-blue-400/30',
  dispatched: 'bg-purple-500/20 text-purple-300 border border-purple-400/30',
  in_transit: 'bg-soil-emerald/20 text-soil-mint border border-soil-emerald/30',
  delivered: 'bg-emerald-500/20 text-emerald-300 border border-emerald-400/30',
};

const QUICK_ACTIONS = [
  { label: 'Browse Marketplace', icon: Store, to: '/marketplace', accent: 'text-soil-gold' },
  { label: 'My Cart', icon: ShoppingBag, to: '/cart', accent: 'text-soil-mint' },
  { label: 'Order Tracking', icon: Route, to: '/tracking', accent: 'text-purple-300' },
  { label: 'Notifications', icon: Bell, to: '/notifications', accent: 'text-blue-300' },
] as const;

export default function ConsumerDashboard() {
  const [showAllFeatured, setShowAllFeatured] = useState(false);
  const loading = usePageLoading();

  const addToCart = useMarketplaceStore((s) => s.addToCart);
  const cartCount = useMarketplaceStore((s) => s.totalItems());
  const cartValue = useMarketplaceStore((s) => s.totalValue());

  const user = useAuthStore((s) => s.user);
  const orders = useOrderTrackingStore((s) => s.orders).filter((o) => !o.userId || o.userId === user?.id);
  const activeOrders = orders.filter((o) => o.status !== 'delivered');
  const recentDeliveries = orders.filter((o) => o.status === 'delivered');

  const displayProducts = showAllFeatured ? FEATURED : FEATURED.slice(0, 6);

  if (loading) {
    return (
      <div>
        <DashboardSkeleton metricCount={4} listCount={2} />
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <GlassBadge gold>Consumer</GlassBadge>
          <h1 className="font-display font-extrabold text-2xl text-text-primary mt-2">
            Consumer Dashboard
          </h1>
          <p className="text-xs text-text-muted">
            Fresh produce at your fingertips — browse, buy, and track deliveries
          </p>
        </div>
        <DemoDataBadge />
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <MetricTile
          label="Cart Items"
          value={String(cartCount)}
          icon={<ShoppingCart className="w-5 h-5" />}
          accent="text-soil-gold"
        />
        <MetricTile
          label="Cart Value"
          value={`₹${cartValue.toFixed(0)}`}
          icon={<IndianRupee className="w-5 h-5" />}
          accent="text-soil-mint"
        />
        <MetricTile
          label="Active Orders"
          value={String(activeOrders.length)}
          icon={<Truck className="w-5 h-5" />}
          accent="text-purple-300"
        />
        <MetricTile
          label="Recent Deliveries"
          value={String(recentDeliveries.length)}
          icon={<PackageCheck className="w-5 h-5" />}
          accent="text-emerald-300"
        />
      </div>

      {/* Featured Products */}
      <FadeIn delay={0.05}>
        <GlassCard className="p-5 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Store className="w-4 h-4 text-soil-gold" />
              <h2 className="font-display font-bold text-base text-text-primary">
                Featured Products
              </h2>
            </div>
            <Link
              to="/marketplace"
              className="flex items-center gap-1 text-[11px] font-bold text-soil-gold hover:underline"
            >
              View All in Marketplace <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {displayProducts.map((p) => (
              <motion.div
                key={p.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                className="glass-panel-sm p-3 flex gap-3"
              >
                <img
                  src={p.image}
                  alt={p.name}
                  className="w-16 h-16 rounded-xl object-cover shrink-0"
                />
                <div className="flex-1 min-w-0 flex flex-col justify-between">
                  <div>
                    <div className="font-bold text-sm text-text-primary truncate">
                      {p.name}
                    </div>
                    <div className="text-[10px] text-text-muted">
                      {p.location} · {p.grade}
                    </div>
                  </div>
                  <div className="flex items-center justify-between mt-1">
                    <span className="font-extrabold text-soil-gold text-sm">
                      ₹{p.price.toFixed(0)}
                      <span className="text-[10px] font-semibold text-text-muted ml-0.5">
                        /{p.unit}
                      </span>
                    </span>
                    <GlassButton
                      variant="green"
                      className="!px-3 !py-1.5 !text-[10px] !rounded-xl"
                      onClick={() =>
                        addToCart({
                          id: p.id,
                          name: p.name,
                          price: p.price,
                          unit: p.unit,
                          image: p.image,
                          grade: p.grade,
                        })
                      }
                    >
                      <Plus className="w-3 h-3 mr-1 inline" />
                      Add
                    </GlassButton>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {FEATURED.length > 6 && !showAllFeatured && (
            <div className="text-center pt-1">
              <GlassButton
                variant="ghost"
                className="!text-[11px]"
                onClick={() => setShowAllFeatured(true)}
              >
                Show More <ChevronRight className="w-3.5 h-3.5 ml-1 inline" />
              </GlassButton>
            </div>
          )}
        </GlassCard>
      </FadeIn>

      {/* My Recent Orders */}
      <FadeIn delay={0.1}>
        <GlassCard className="p-5 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Truck className="w-4 h-4 text-soil-gold" />
              <h2 className="font-display font-bold text-base text-text-primary">
                My Recent Orders
              </h2>
            </div>
            <div className="flex items-center gap-3">
              <Link
                to="/orders"
                className="flex items-center gap-1 text-[11px] font-bold text-soil-mint hover:underline"
              >
                Full History <ArrowRight className="w-3.5 h-3.5" />
              </Link>
              <Link
                to="/tracking"
                className="flex items-center gap-1 text-[11px] font-bold text-soil-gold hover:underline"
              >
                Track Order <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          {orders.length === 0 ? (
            <div className="text-center py-8">
              <div className="text-2xl mb-2">📦</div>
              <div className="font-bold text-text-primary text-sm">No orders yet</div>
              <p className="text-[11px] text-text-muted mt-1">
                Browse the marketplace to place your first order
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              {orders.map((o) => (
                <div
                  key={o.id}
                  className="glass-panel-sm px-3.5 py-3 flex flex-wrap items-center justify-between gap-3"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <img
                      src={o.productImage}
                      alt={o.productName}
                      className="w-9 h-9 rounded-lg object-cover shrink-0"
                    />
                    <div className="min-w-0">
                      <div className="font-bold text-sm text-text-primary truncate">
                        {o.productName}
                      </div>
                      <div className="text-[10px] text-text-muted">{o.id}</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    <span
                      className={`px-2 py-0.5 rounded-full text-[9px] font-bold capitalize ${
                        STATUS_COLORS[o.status] ?? 'bg-white/10 text-text-muted'
                      }`}
                    >
                      {o.status.replace('_', ' ')}
                    </span>
                    <div className="flex items-center gap-1 text-[10px] text-text-muted">
                      <Clock className="w-3 h-3" />
                      ETA: {o.eta}
                    </div>
                    <Link
                      to="/tracking"
                      className="flex items-center gap-1 text-[10px] font-bold text-soil-gold hover:underline"
                    >
                      Track <ArrowRight className="w-3 h-3" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </GlassCard>
      </FadeIn>

      {/* Quick Actions */}
      <FadeIn delay={0.15}>
        <GlassCard className="p-5 space-y-3">
          <div className="flex items-center gap-2">
            <PackageCheck className="w-4 h-4 text-soil-gold" />
            <h2 className="font-display font-bold text-base text-text-primary">
              Quick Actions
            </h2>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {QUICK_ACTIONS.map((action) => (
              <Link key={action.label} to={action.to}>
                <motion.div
                  whileHover={{ y: -2 }}
                  className="glass-panel-sm p-4 flex flex-col items-center gap-2.5 cursor-pointer text-center group"
                >
                  <div className={`w-10 h-10 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center ${action.accent} group-hover:bg-white/10 transition`}>
                    <action.icon className="w-5 h-5" />
                  </div>
                  <span className="text-xs font-semibold text-text-primary">
                    {action.label}
                  </span>
                </motion.div>
              </Link>
            ))}
          </div>
        </GlassCard>
      </FadeIn>
    </div>
  );
}

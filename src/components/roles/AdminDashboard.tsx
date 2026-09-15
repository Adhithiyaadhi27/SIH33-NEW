import { useState, type FormEvent } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Users,
  Sprout,
  Package,
  ClipboardList,
  IndianRupee,
  Activity,
  Bell,
  Settings,
  ShieldCheck,
  Pencil,
  Trash2,
  Search,
  Send,
  CheckCircle2,
  TrendingUp,
  Truck,
  UserPlus,
  Wallet,
  AlertTriangle,
  Mail,
  BarChart3,
  Globe,
  Save,
  MapPin,
  Clock,
  ArrowRight,
  ShoppingCart,
  X,
  Check,
  type LucideIcon,
} from 'lucide-react';
import { GlassCard, MetricTile, GlassBadge, GlassButton, FadeIn, DemoDataBadge } from '../ui/primitives';
import { DashboardSkeleton } from '../ui/skeleton';
import { usePageLoading } from '../../hooks/usePageLoading';
import { mockProducts, type MockProduct } from '../../data/mockProducts';
import { mockOrders, type MockOrder } from '../../data/mockOrders';
import { useNotificationStore } from '../../store/notificationStore';
import { useOrderTrackingStore, type TrackedOrder } from '../../store/orderTrackingStore';
import { DEMO_USERS } from '../../store/authStore';

type TabId = 'users' | 'products' | 'orders' | 'notifications' | 'settings';

const VALID_TABS: TabId[] = ['users', 'products', 'orders', 'notifications', 'settings'];

const TABS: { id: TabId; label: string; icon: LucideIcon }[] = [
  { id: 'users', label: 'Users', icon: Users },
  { id: 'products', label: 'Products', icon: Package },
  { id: 'orders', label: 'Orders', icon: ClipboardList },
  { id: 'notifications', label: 'Notifications', icon: Bell },
  { id: 'settings', label: 'Settings', icon: Settings },
];

interface PlatformUser {
  id: string;
  name: string;
  email: string;
  role: string;
  location: string;
  org?: string;
}

const PLATFORM_USERS: PlatformUser[] = [
  ...DEMO_USERS.map((u) => ({
    id: u.id,
    name: u.name,
    email: u.email,
    role: u.role,
    location: u.location ?? '—',
    org: u.organization,
  })),
  { id: 'demo_farmer_2', name: 'Farmer Lakshmi', email: 'lakshmi@maanvasam.com', role: 'FARMER', location: 'Coimbatore', org: 'GreenValley FPO' },
  { id: 'demo_farmer_3', name: 'Farmer Ravi', email: 'ravi@maanvasam.com', role: 'FARMER', location: 'Nashik', org: 'Sahyadri Co-op' },
  { id: 'demo_consumer_2', name: 'Consumer Meera', email: 'meera@maanvasam.com', role: 'CONSUMER', location: 'Bengaluru' },
  { id: 'demo_logistics', name: 'Fleet Manager Arjun', email: 'arjun@maanvasam.com', role: 'LOGISTICS', location: 'Chennai' },
];

const STATUS_COLORS: Record<MockOrder['status'], string> = {
  PENDING: 'bg-amber-400/15 text-amber-300 border border-amber-300/30',
  AGGREGATING: 'bg-soil-gold/20 text-soil-goldSoft border border-soil-gold/30',
  IN_TRANSIT: 'bg-emerald-500/15 text-emerald-300 border border-emerald-400/30',
  DELIVERED: 'bg-white/10 text-text-secondary border border-white/15',
};

const STATUS_ETAS: Record<MockOrder['status'], string> = {
  PENDING: 'Day after',
  AGGREGATING: 'Tomorrow 9:00 AM',
  IN_TRANSIT: 'Today 4:30 PM',
  DELIVERED: 'Delivered',
};

const ORDER_FLOW: MockOrder['status'][] = ['PENDING', 'AGGREGATING', 'IN_TRANSIT', 'DELIVERED'];

const ONLINE_ORDER_FLOW: TrackedOrder['status'][] = ['confirmed', 'processing', 'dispatched', 'in_transit', 'delivered'];

const ONLINE_STATUS_BADGE: Record<TrackedOrder['status'] | string, string> = {
  confirmed: 'bg-amber-400/15 text-amber-300 border border-amber-300/30',
  processing: 'bg-soil-gold/20 text-soil-goldSoft border border-soil-gold/30',
  dispatched: 'bg-sky-500/15 text-sky-300 border border-sky-400/30',
  in_transit: 'bg-emerald-500/15 text-emerald-300 border border-emerald-400/30',
  delivered: 'bg-white/10 text-text-secondary border border-white/15',
};

const ONLINE_STATUS_LABEL: Record<TrackedOrder['status'], string> = {
  confirmed: 'Order Confirmed',
  processing: 'Preparing',
  dispatched: 'Dispatched',
  in_transit: 'Out for Delivery',
  delivered: 'Delivered',
};

function PaymentBadge({ status }: { status: string }) {
  const paid = /^PAID/i.test(String(status ?? ''));
  return (
    <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold ${
      paid ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-400/30' : 'bg-amber-500/15 text-amber-300 border border-amber-400/30'
    }`}>
      {paid ? 'Paid' : status || 'Payment Pending'}
    </span>
  );
}

function RoleBadge({ role }: { role: string }) {
  const styles: Record<string, string> = {
    ADMIN: 'bg-soil-gold/20 text-soil-goldSoft border border-soil-gold/30',
    FARMER: 'bg-emerald-500/15 text-emerald-300 border border-emerald-400/30',
    CONSUMER: 'bg-white/10 text-text-secondary border border-white/20',
    LOGISTICS: 'bg-sky-500/15 text-sky-300 border border-sky-400/30',
  };
  return (
    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold capitalize ${styles[role] ?? styles.CONSUMER}`}>
      {role.toLowerCase()}
    </span>
  );
}

function StatusBadge({ status }: { status: MockOrder['status'] }) {
  return (
    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${STATUS_COLORS[status]}`}>{status.replace('_', ' ')}</span>
  );
}

function StockMeter({ qty }: { qty: number }) {
  const pct = Math.min(100, Math.round((qty / 1000) * 100));
  const barColor = qty < 250 ? 'bg-red-400' : qty < 500 ? 'bg-amber-300' : 'bg-emerald-400';
  return (
    <div>
      <div className="flex items-center justify-between text-[10px]">
        <span className="text-text-muted">Stock level</span>
        <span className={`font-bold ${qty < 250 ? 'text-red-300' : 'text-text-primary'}`}>{qty.toLocaleString()} units</span>
      </div>
      <div className="h-1.5 rounded-full bg-white/10 overflow-hidden mt-1">
        <div className={`h-full rounded-full transition-all duration-500 ${barColor}`} style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}

function Toggle({ on, onClick, label }: { on: boolean; onClick: () => void; label?: string }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className={`relative w-10 h-[22px] rounded-full transition-colors cursor-pointer shrink-0 ${
        on ? 'bg-emerald-500 shadow-glow-emerald' : 'bg-white/15 border border-white/15'
      }`}
    >
      <span
        className={`absolute top-0.5 left-0.5 h-[14px] w-[14px] rounded-full bg-white transition-transform ${
          on ? 'translate-x-[18px]' : ''
        }`}
      />
    </button>
  );
}

function initials(name: string) {
  return name
    .split(' ')
    .filter(Boolean)
    .map((p) => p[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();
}

export default function AdminDashboard() {
  const pushToast = useNotificationStore((s) => s.pushToast);
  const navigate = useNavigate();
  const loading = usePageLoading();
  const [searchParams, setSearchParams] = useSearchParams();

  const tabParam = searchParams.get('tab');
  const activeTab: TabId = VALID_TABS.includes(tabParam as TabId) ? (tabParam as TabId) : 'users';

  const setActiveTab = (id: TabId) => {
    setSearchParams(id === 'users' ? {} : { tab: id }, { replace: true });
  };

  const roleParam = searchParams.get('role');
  const roleFilter = roleParam === 'farmers' ? 'FARMER' : roleParam === 'consumers' ? 'CONSUMER' : null;

  const setRoleFilter = (value: 'farmers' | 'consumers' | null) => {
    const params: Record<string, string> = {};
    if (activeTab !== 'users') params.tab = activeTab;
    if (value) params.role = value;
    setSearchParams(params, { replace: true });
  };

  const [hiddenSections, setHiddenSections] = useState<Record<string, boolean>>({ activity: false });

  const [products, setProducts] = useState<MockProduct[]>(mockProducts);
  const [productQuery, setProductQuery] = useState('');
  const filteredProducts = products.filter((p) => `${p.name} ${p.supplier} ${p.category}`.toLowerCase().includes(productQuery.toLowerCase()));

  const [orders, setOrders] = useState<MockOrder[]>(mockOrders);

  const onlineOrders = useOrderTrackingStore((s) => s.orders);
  const updateTrackedStatus = useOrderTrackingStore((s) => s.updateStatus);

  const advanceOnlineOrder = (id: string) => {
    const order = onlineOrders.find((o) => o.id === id);
    if (!order) return;
    const idx = ONLINE_ORDER_FLOW.indexOf(order.status);
    const next = ONLINE_ORDER_FLOW[idx + 1];
    if (next) {
      updateTrackedStatus(id, next);
      pushToast({ title: `Order ${id} advanced`, message: `Status → ${ONLINE_STATUS_LABEL[next]}`, type: 'success' });
    }
  };

  const [userQuery, setUserQuery] = useState('');
  const [suspended, setSuspended] = useState<Set<string>>(new Set());
  const filteredUsers = PLATFORM_USERS.filter((u) => {
    const matchesRole = roleFilter ? u.role === roleFilter : true;
    const matchesQuery = `${u.name} ${u.email} ${u.role}`.toLowerCase().includes(userQuery.toLowerCase());
    return matchesRole && matchesQuery;
  });

  const [notifSettings, setNotifSettings] = useState<Record<string, boolean>>({
    new_users: true,
    new_orders: true,
    payments: true,
    disputes: true,
    system: true,
    digest: false,
  });
  const [broadcasts, setBroadcasts] = useState<{ id: string; text: string; time: string }[]>([]);
  const [draft, setDraft] = useState('');

  const [settings, setSettings] = useState<{ maintenance: boolean; registrations: boolean; autoBackup: boolean; locale: string; mapProvider: string }>(() => {
    try {
      const saved = localStorage.getItem('admin_settings');
      const fallback = { maintenance: false, registrations: true, autoBackup: true, locale: 'en', mapProvider: 'osm' };
      if (!saved) return fallback;
      const parsed = JSON.parse(saved) as Partial<typeof fallback>;
      return { ...fallback, ...parsed, locale: typeof parsed.locale === 'string' ? parsed.locale : 'en', mapProvider: typeof parsed.mapProvider === 'string' ? parsed.mapProvider : 'osm' };
    } catch {
      return { maintenance: false, registrations: true, autoBackup: true, locale: 'en', mapProvider: 'osm' };
    }
  });

  const [productForm, setProductForm] = useState({ name: '', category: 'Vegetables', price: '', unit: 'kg', availableQty: '', availability: 'Ready Stock' });
  const [productEditingId, setProductEditingId] = useState<string | null>(null);
  const [showProductForm, setShowProductForm] = useState(false);
  const [productSaveError, setProductSaveError] = useState('');

  const totalInventoryValue = products.reduce((sum, p) => sum + p.price * p.availableQty, 0);

  const metrics = [
    { label: 'Total Users', value: '1,240', icon: <Users className="w-5 h-5" /> },
    { label: 'Active Farmers', value: '860', icon: <Sprout className="w-5 h-5" />, accent: 'text-soil-mint' },
    { label: 'Total Products', value: String(products.length), icon: <Package className="w-5 h-5" /> },
    { label: 'Active Orders', value: '188', icon: <ClipboardList className="w-5 h-5" />, accent: 'text-soil-gold' },
    { label: 'Revenue (₹)', value: `₹${(totalInventoryValue / 100000).toFixed(1)}L`, icon: <IndianRupee className="w-5 h-5" />, accent: 'text-soil-emerald' },
    { label: 'Platform Health', value: '99.8%', icon: <Activity className="w-5 h-5" />, accent: 'text-soil-mint' },
  ];

  const quickActions: { label: string; icon: LucideIcon; tab: TabId | null; onClick: () => void }[] = [
    { label: 'Manage Users', icon: Users, tab: 'users', onClick: () => setActiveTab('users') },
    { label: 'Manage Products', icon: Package, tab: 'products', onClick: () => setActiveTab('products') },
    {
      label: 'View Reports',
      icon: BarChart3,
      tab: null,
      onClick: () => navigate('/admin/analytics'),
    },
    { label: 'Platform Settings', icon: Settings, tab: 'settings', onClick: () => setActiveTab('settings') },
  ];

  const activityFeed = [
    { time: '09:41 AM', tag: 'New User', text: 'Consumer Priya registered from Chennai', icon: UserPlus, color: 'text-soil-gold' },
    { time: '09:32 AM', tag: 'New Order', text: 'ORD-2026-8813 · 2,500 kg Onion placed', icon: Package, color: 'text-soil-mint' },
    { time: '09:18 AM', tag: 'Payment', text: '₹1,25,000 escrow cleared to Ratnagiri FPO', icon: Wallet, color: 'text-emerald-300' },
    { time: '08:55 AM', tag: 'Product', text: 'Tomato inventory refreshed · 500 kg listed', icon: TrendingUp, color: 'text-soil-gold' },
    { time: '08:40 AM', tag: 'Verification', text: 'GreenValley FPO re-verified · 12 farmers onboarded', icon: ShieldCheck, color: 'text-soil-mint' },
    { time: '08:22 AM', tag: 'Logistics', text: 'Cold-chain truck TN-01 departed Madurai hub', icon: Truck, color: 'text-text-primary' },
    { time: '08:05 AM', tag: 'System', text: 'Automatic backup completed · uptime at 99.8%', icon: Activity, color: 'text-soil-goldSoft' },
  ];

  const notificationChannels = [
    { id: 'new_users', label: 'New user signups', desc: 'Farmer, buyer and consumer registrations', icon: UserPlus },
    { id: 'new_orders', label: 'New platform orders', desc: 'Bulk and retail order placement alerts', icon: ClipboardList },
    { id: 'payments', label: 'Payments & settlements', desc: 'Payment clearing, refunds, escrow releases', icon: Wallet },
    { id: 'disputes', label: 'Disputes & escalations', desc: 'Quality disputes raised against orders', icon: AlertTriangle },
    { id: 'system', label: 'System health alerts', desc: 'Uptime drops, API latency, storage warnings', icon: Activity },
    { id: 'digest', label: 'Daily admin digest', desc: 'Summary of platform activity every morning', icon: Mail },
  ];

  const toggleNotif = (id: string) => {
    setNotifSettings((prev) => ({ ...prev, [id]: !prev[id] }));
    pushToast({ title: 'Setting updated', message: `Notifications ${!notifSettings[id] ? 'enabled' : 'paused'} for the channel`, type: 'success' });
  };

  const sendBroadcast = () => {
    if (!draft.trim()) return;
    const now = new Date();
    setBroadcasts((prev) => [
      { id: `bc_${Date.now()}`, text: draft.trim(), time: now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) },
      ...prev,
    ]);
    setDraft('');
    pushToast({ title: 'Broadcast sent', message: 'Announcement pushed to all active users', type: 'success' });
  };

  const openCreateProduct = () => {
    setProductForm({ name: '', category: 'Vegetables', price: '', unit: 'kg', availableQty: '', availability: 'Ready Stock' });
    setProductEditingId(null);
    setProductSaveError('');
    setShowProductForm(true);
  };

  const openEditProduct = (p: MockProduct) => {
    setProductForm({ name: p.name, category: p.category, price: String(p.price), unit: p.unit, availableQty: String(p.availableQty), availability: p.availability });
    setProductEditingId(p.id);
    setProductSaveError('');
    setShowProductForm(true);
  };

  const saveProduct = (e: FormEvent) => {
    e.preventDefault();
    const price = parseFloat(productForm.price);
    const availableQty = parseInt(productForm.availableQty, 10);
    if (!productForm.name.trim() || isNaN(price) || price <= 0) {
      setProductSaveError('Enter a product name and a valid price.');
      return;
    }
    if (isNaN(availableQty) || availableQty < 0) {
      setProductSaveError('Enter a valid available quantity.');
      return;
    }
    if (productEditingId) {
      setProducts((prev) => prev.map((p) => (p.id === productEditingId ? { ...p, name: productForm.name.trim(), category: productForm.category, price, unit: productForm.unit, availableQty, availability: productForm.availability } : p)));
      pushToast({ title: 'Product updated', message: `${productForm.name.trim()} saved to marketplace`, type: 'success' });
    } else {
      const id = `prod_${Date.now().toString(36)}`;
      setProducts((prev) => [...prev, {
        id,
        name: productForm.name.trim(),
        category: productForm.category,
        price,
        unit: productForm.unit,
        grade: 'Grade A',
        supplier: 'Maanvasam Marketplace',
        location: 'Tamil Nadu',
        harvestDate: new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }),
        availability: productForm.availability,
        availableQty,
        image: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&w=600&q=80',
      }]);
      pushToast({ title: 'Product listed', message: `${productForm.name.trim()} is now live in the marketplace`, type: 'success' });
    }
    setShowProductForm(false);
  };

  const handleEditProduct = (id: string) => {
    const p = products.find((x) => x.id === id);
    if (p) openEditProduct(p);
  };

  const handleDeleteProduct = (id: string, name: string) => {
    if (!window.confirm(`Delete "${name}" from the marketplace? This cannot be undone.`)) return;
    setProducts((prev) => prev.filter((p) => p.id !== id));
    pushToast({ title: 'Product removed', message: `${name} deleted from marketplace`, type: 'error' });
  };

  const advanceOrder = (id: string) => {
    setOrders((prev) =>
      prev.map((o) => {
        if (o.id !== id) return o;
        const idx = ORDER_FLOW.indexOf(o.status);
        if (idx >= ORDER_FLOW.length - 1) return o;
        const next = ORDER_FLOW[idx + 1];
        pushToast({ title: 'Order updated', message: `${o.id} → ${next.replace('_', ' ')}`, type: 'success' });
        return { ...o, status: next, eta: STATUS_ETAS[next] };
      })
    );
  };

  const toggleSuspend = (u: PlatformUser) => {
    setSuspended((prev) => {
      const next = new Set(prev);
      if (next.has(u.id)) {
        next.delete(u.id);
        pushToast({ title: 'User re-activated', message: `${u.name} can access the platform again`, type: 'success' });
      } else {
        next.add(u.id);
        pushToast({ title: 'User suspended', message: `${u.name}'s access has been revoked`, type: 'error' });
      }
      return next;
    });
  };

  const toggleSetting = (key: keyof typeof settings) =>
    setSettings((prev) => ({ ...prev, [key]: !prev[key] }));

  const saveSettings = () => {
    localStorage.setItem('admin_settings', JSON.stringify(settings));
    pushToast({ title: 'Settings saved', message: 'Configuration changes published to the platform', type: 'success' });
  };

  if (loading) {
    return <DashboardSkeleton metricCount={6} listCount={3} />;
  }

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
        <div>
          <GlassBadge gold>
            <ShieldCheck className="w-3 h-3" /> Administrator
          </GlassBadge>
          <h1 className="font-display font-extrabold text-2xl text-text-primary mt-2">Admin Dashboard</h1>
          <p className="text-xs text-text-muted">Full platform management access</p>
        </div>
        <div className="flex items-center gap-2 text-[10px] font-bold text-emerald-400">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
          All systems operational
        </div>
      </div>

      {/* Metrics */}
      <div className="flex items-center justify-between gap-2 mb-3">
        <p className="text-[11px] text-text-muted">Platform overview at a glance</p>
        <DemoDataBadge />
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {metrics.map((m, i) => (
          <FadeIn key={m.label} delay={i * 0.04}>
            <MetricTile label={m.label} value={m.value} icon={m.icon} accent={m.accent} />
          </FadeIn>
        ))}
      </div>

      {/* Quick actions */}
      <FadeIn delay={0.1}>
        <div className="glass-panel-sm p-3 grid grid-cols-2 lg:grid-cols-4 gap-2.5">
          {quickActions.map((a) => (
            <GlassButton key={a.label} variant={a.tab === activeTab ? 'green' : 'glass'} onClick={a.onClick} className="flex items-center justify-center gap-2">
              <a.icon className="w-4 h-4" /> {a.label}
            </GlassButton>
          ))}
        </div>
      </FadeIn>

      {/* Management tabs */}
      <FadeIn delay={0.14}>
        <GlassCard className="p-5" hover={false}>
          <div className="flex flex-wrap items-center gap-1.5 mb-5 overflow-x-auto scrollbar-none">
            {TABS.map((t) => {
              const active = activeTab === t.id;
              return (
                <button
                  key={t.id}
                  onClick={() => setActiveTab(t.id)}
                  className={`relative flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition cursor-pointer whitespace-nowrap ${
                    active ? 'text-soil-base' : 'text-text-muted hover:text-text-primary'
                  }`}
                >
                  {active && (
                    <motion.span
                      layoutId="admin-tab-pill"
                      className="absolute inset-0 rounded-xl bg-gradient-to-r from-soil-gold to-soil-goldSoft shadow-glow-gold"
                      transition={{ type: 'spring', stiffness: 400, damping: 32 }}
                    />
                  )}
                  <t.icon className="w-3.5 h-3.5 relative z-10" />
                  <span className="relative z-10">{t.label}</span>
                </button>
              );
            })}
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.25 }}
              className="min-h-[320px]"
            >
              {/* USERS TAB */}
              {activeTab === 'users' && (
                <div className="space-y-3">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div className="relative max-w-sm w-full sm:w-auto sm:flex-1">
                      <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
                      <input
                        value={userQuery}
                        onChange={(e) => setUserQuery(e.target.value)}
                        placeholder="Search users, emails, roles…"
                        className="w-full pl-9 pr-3 py-2 rounded-xl bg-white/5 border border-white/10 text-xs text-text-primary placeholder:text-text-muted outline-none focus:border-soil-gold/40"
                      />
                    </div>
                    <div className="flex items-center gap-1.5">
                      {([
                        { id: null, label: 'All' },
                        { id: 'farmers', label: 'Farmers' },
                        { id: 'consumers', label: 'Consumers' },
                      ] as const).map((chip) => (
                        <button
                          key={String(chip.id)}
                          onClick={() => setRoleFilter(chip.id)}
                          className={`px-3 py-1.5 rounded-xl text-[11px] font-bold transition cursor-pointer ${
                            roleFilter === (chip.id === 'farmers' ? 'FARMER' : chip.id === 'consumers' ? 'CONSUMER' : null)
                              ? 'bg-soil-gold/25 text-soil-gold'
                              : 'bg-white/5 text-text-muted hover:bg-white/10'
                          }`}
                        >
                          {chip.label}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="glass-panel-sm divide-y divide-white/5 overflow-x-auto">
                    <div className="grid grid-cols-[2fr_1fr_1fr_1fr] gap-3 px-4 py-2.5 text-[10px] font-bold uppercase tracking-wider text-text-muted">
                      <span>User</span>
                      <span>Role</span>
                      <span>Location</span>
                      <span className="text-right">Status</span>
                    </div>
                    {filteredUsers.map((u) => {
                      const isSuspended = suspended.has(u.id);
                      return (
                        <div key={u.id} className="grid grid-cols-[2fr_1fr_1fr_1fr] gap-3 items-center px-4 py-3">
                          <div className="flex items-center gap-3 min-w-0">
                            <div
                              className={`w-9 h-9 rounded-xl flex items-center justify-center text-[11px] font-extrabold shrink-0 ${
                                u.role === 'ADMIN'
                                  ? 'bg-soil-gold/20 text-soil-goldSoft'
                                  : u.role === 'FARMER'
                                    ? 'bg-emerald-500/20 text-emerald-300'
                                    : 'bg-white/10 text-text-secondary'
                              }`}
                            >
                              {initials(u.name)}
                            </div>
                            <div className="min-w-0">
                              <div className="text-xs font-bold text-text-primary truncate">{u.name}</div>
                              <div className="text-[10px] text-text-muted truncate">{u.email}</div>
                              {u.org && <div className="text-[10px] text-soil-mint truncate">{u.org}</div>}
                            </div>
                          </div>
                          <div><RoleBadge role={u.role} /></div>
                          <div className="flex items-center gap-1 text-[11px] text-text-secondary">
                            <MapPin className="w-3 h-3 text-text-muted shrink-0" /> {u.location}
                          </div>
                          <div className="flex items-center justify-end gap-2">
                            {isSuspended ? (
                              <span className="text-[10px] font-bold text-red-300">Suspended</span>
                            ) : (
                              <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-400">
                                <CheckCircle2 className="w-3 h-3" /> Active
                              </span>
                            )}
                            <GlassButton variant="ghost" onClick={() => toggleSuspend(u)} className="!px-2.5 !py-1 text-[10px]">
                              {isSuspended ? 'Restore' : 'Suspend'}
                            </GlassButton>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  <p className="text-[10px] text-text-muted">Showing {filteredUsers.length} of {PLATFORM_USERS.length} platform accounts</p>
                </div>
              )}

              {/* PRODUCTS TAB */}
              {activeTab === 'products' && (
                <div className="space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                    <div className="relative max-w-sm w-full">
                      <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
                      <input
                        value={productQuery}
                        onChange={(e) => setProductQuery(e.target.value)}
                        placeholder="Search products…"
                        className="w-full pl-9 pr-3 py-2 rounded-xl bg-white/5 border border-white/10 text-xs text-text-primary placeholder:text-text-muted outline-none focus:border-soil-gold/40"
                      />
                    </div>
                    <GlassButton variant="gold" onClick={openCreateProduct}>
                      + New Listing
                    </GlassButton>
                  </div>
                  <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-3 max-h-[520px] overflow-y-auto pr-1 scrollbar-none">
                    {filteredProducts.map((p, i) => (
                      <motion.div
                        key={p.id}
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.02, duration: 0.3 }}
                        className="glass-panel-sm p-3 space-y-2.5"
                      >
                        <div className="flex items-center gap-3">
                          <img src={p.image} alt={p.name} className="w-16 h-16 rounded-xl object-cover border border-white/10" />
                          <div className="min-w-0 flex-1">
                            <div className="text-xs font-bold text-text-primary truncate">{p.name}</div>
                            <div className="text-[10px] text-text-muted truncate">{p.supplier}</div>
                            <div className="flex items-center gap-1.5 mt-1 flex-wrap">
                              <span className="px-1.5 py-0.5 rounded-md bg-white/10 text-[9px] font-bold text-text-secondary">{p.category}</span>
                              <span className="px-1.5 py-0.5 rounded-md bg-soil-gold/15 text-[9px] font-bold text-soil-goldSoft">{p.grade}</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center justify-between">
                          <div>
                            <span className="font-display font-extrabold text-base text-soil-gold">₹{p.price}</span>
                            <span className="text-[10px] text-text-muted">/{p.unit}</span>
                          </div>
                          <div className="flex items-center gap-1 text-[10px] text-text-muted">
                            <MapPin className="w-3 h-3" /> {p.location}
                          </div>
                        </div>
                        <StockMeter qty={p.availableQty} />
                        <div className="flex items-center gap-2 pt-1">
                          <GlassButton variant="glass" onClick={() => handleEditProduct(p.id)} className="flex-1 !py-1.5 !text-[10px] flex items-center justify-center gap-1.5">
                            <Pencil className="w-3 h-3" /> Edit
                          </GlassButton>
                          <GlassButton variant="ghost" onClick={() => handleDeleteProduct(p.id, p.name)} className="!px-3 !py-1.5 !text-[10px] flex items-center justify-center gap-1.5 !text-red-300">
                            <Trash2 className="w-3 h-3" /> Delete
                          </GlassButton>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}

              {/* ORDERS TAB */}
              {activeTab === 'orders' && (
                <div className="space-y-4">
                  <section className="space-y-2.5">
                    <div className="flex items-center gap-2">
                      <ShoppingCart className="w-4 h-4 text-soil-gold" />
                      <h2 className="text-xs font-bold uppercase tracking-wider text-text-muted">Consumer Orders</h2>
                      <span className="px-1.5 py-0.5 rounded-full bg-soil-gold/20 text-[9px] font-bold text-soil-gold">{onlineOrders.length}</span>
                    </div>
                    {onlineOrders.length === 0 ? (
                      <div className="glass-panel-sm px-4 py-6 text-center text-[11px] text-text-muted">
                        No consumer orders yet — orders placed on the website will appear here.
                      </div>
                    ) : (
                      onlineOrders.map((o) => {
                        const isComplete = o.status === 'delivered';
                        const stepIndex = ONLINE_ORDER_FLOW.indexOf(o.status);
                        return (
                          <div key={o.id} className="glass-panel-sm px-4 py-3.5 space-y-3">
                            <div className="flex flex-wrap items-center justify-between gap-3">
                              <div className="flex items-center gap-3 min-w-0">
                                <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${isComplete ? 'bg-emerald-500/15' : 'bg-soil-gold/15'}`}>
                                  {isComplete ? <CheckCircle2 className="w-4 h-4 text-emerald-300" /> : <Truck className="w-4 h-4 text-soil-gold" />}
                                </div>
                                <div className="min-w-0">
                                  <div className="text-xs font-bold text-text-primary">{o.productName}</div>
                                  <div className="flex flex-wrap items-center gap-1 text-[10px] text-text-muted mt-0.5">
                                    <MapPin className="w-3 h-3 text-soil-gold shrink-0" />
                                    <span className="truncate">{o.deliveryAddress}</span>
                                  </div>
                                  <div className="text-[10px] text-text-muted mt-0.5">{o.id} · {o.orderDate}</div>
                                </div>
                              </div>
                              <div className="flex flex-wrap items-center gap-2">
                                <span className="text-[11px] font-extrabold text-soil-gold">₹{o.total.toFixed(2)}</span>
                                <PaymentBadge status={o.paymentStatus} />
                                <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold ${ONLINE_STATUS_BADGE[o.status]}`}>
                                  {ONLINE_STATUS_LABEL[o.status]}
                                </span>
                              </div>
                            </div>
                            {!isComplete && (
                              <div className="flex items-center justify-between border-t border-white/5 pt-2.5">
                                <span className="text-[9px] font-bold uppercase tracking-wider text-text-muted">
                                  Step {stepIndex + 1} / {ONLINE_ORDER_FLOW.length}
                                </span>
                                <GlassButton variant={o.status === 'in_transit' ? 'green' : 'glass'} onClick={() => advanceOnlineOrder(o.id)} className="!py-1.5 !text-[10px]">
                                  Advance → {ONLINE_STATUS_LABEL[ONLINE_ORDER_FLOW[stepIndex + 1]]}
                                </GlassButton>
                              </div>
                            )}
                          </div>
                        );
                      })
                    )}
                  </section>

                  <section className="space-y-2.5">
                    <div className="flex items-center gap-2">
                      <ClipboardList className="w-4 h-4 text-soil-gold" />
                      <h2 className="text-xs font-bold uppercase tracking-wider text-text-muted">B2B Consignments</h2>
                      <span className="px-1.5 py-0.5 rounded-full bg-soil-gold/20 text-[9px] font-bold text-soil-gold">{orders.length}</span>
                    </div>
                    {orders.map((o) => {
                      const isComplete = o.status === 'DELIVERED';
                      return (
                        <div key={o.id} className="glass-panel-sm px-4 py-3.5 space-y-3">
                          <div className="flex flex-wrap items-center justify-between gap-3">
                            <div className="flex items-center gap-3 min-w-0">
                              <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${isComplete ? 'bg-emerald-500/15' : 'bg-soil-gold/15'}`}>
                                {isComplete ? <CheckCircle2 className="w-4 h-4 text-emerald-300" /> : <Truck className="w-4 h-4 text-soil-gold" />}
                              </div>
                              <div className="min-w-0">
                                <div className="text-xs font-bold text-text-primary">
                                  {o.product} <span className="text-text-muted font-semibold">· {o.quantityKg.toLocaleString()} kg</span>
                                </div>
                                <div className="flex flex-wrap items-center gap-1 text-[10px] text-text-muted mt-0.5">
                                  <span className="font-bold text-text-secondary">{o.from}</span>
                                  <ArrowRight className="w-3 h-3 text-soil-gold" />
                                  <span className="font-bold text-text-secondary">{o.to}</span>
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <StatusBadge status={o.status} />
                              <span className="flex items-center gap-1 text-[10px] text-text-muted">
                                <Clock className="w-3 h-3" /> ETA {o.eta}
                              </span>
                            </div>
                          </div>
                          {!isComplete && (
                            <div className="flex items-center justify-between border-t border-white/5 pt-2.5">
                              <span className="text-[9px] font-bold uppercase tracking-wider text-text-muted">{o.id}</span>
                              <GlassButton variant={o.status === 'IN_TRANSIT' ? 'green' : 'glass'} onClick={() => advanceOrder(o.id)} className="!py-1.5 !text-[10px]">
                                Advance → {ORDER_FLOW[ORDER_FLOW.indexOf(o.status) + 1].replace('_', ' ')}
                              </GlassButton>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </section>
                </div>
              )}

              {/* NOTIFICATIONS TAB */}
              {activeTab === 'notifications' && (
                <div className="space-y-4">
                  <div className="glass-panel-sm p-4 space-y-3">
                    <div className="text-xs font-bold text-text-primary">Send platform broadcast</div>
                    <div className="flex items-center gap-2">
                      <input
                        value={draft}
                        onChange={(e) => setDraft(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && sendBroadcast()}
                        placeholder="Announcement for all users… (live demo)"
                        className="flex-1 px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-xs text-text-primary placeholder:text-text-muted outline-none focus:border-soil-gold/40"
                      />
                      <GlassButton variant="green" onClick={sendBroadcast} className="flex items-center gap-1.5">
                        <Send className="w-3.5 h-3.5" /> Send
                      </GlassButton>
                    </div>
                    {broadcasts.length > 0 && (
                      <div className="space-y-1.5">
                        {broadcasts.map((b) => (
                          <div key={b.id} className="flex items-center justify-between gap-2 bg-soil-deep/40 rounded-lg px-3 py-2 text-[11px]">
                            <span className="text-text-secondary truncate">{b.text}</span>
                            <span className="text-[10px] text-text-muted shrink-0">{b.time}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                  <div className="space-y-2">
                    {notificationChannels.map((c) => (
                      <div key={c.id} className="glass-panel-sm px-4 py-3 flex items-center justify-between gap-3">
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="w-9 h-9 rounded-xl bg-soil-gold/15 border border-soil-gold/20 flex items-center justify-center shrink-0">
                            <c.icon className="w-4 h-4 text-soil-gold" />
                          </div>
                          <div className="min-w-0">
                            <div className="text-xs font-bold text-text-primary">{c.label}</div>
                            <div className="text-[10px] text-text-muted">{c.desc}</div>
                          </div>
                        </div>
                        <Toggle on={notifSettings[c.id]} onClick={() => toggleNotif(c.id)} label={c.label} />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* SETTINGS TAB */}
              {activeTab === 'settings' && (
                <div className="space-y-4 max-w-2xl">
                  <div className="glass-panel-sm p-4 space-y-3">
                    <div className="flex items-center gap-2 text-xs font-bold text-text-primary">
                      <Activity className="w-4 h-4 text-soil-gold" /> Platform Controls
                    </div>
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <div className="text-[11px] font-bold text-text-secondary">Maintenance mode</div>
                        <div className="text-[10px] text-text-muted">Temporarily restrict user-facing operations</div>
                      </div>
                      <Toggle on={settings.maintenance} onClick={() => toggleSetting('maintenance')} label="Maintenance mode" />
                    </div>
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <div className="text-[11px] font-bold text-text-secondary">Open registrations</div>
                        <div className="text-[10px] text-text-muted">Allow new farmer / consumer signups</div>
                      </div>
                      <Toggle on={settings.registrations} onClick={() => toggleSetting('registrations')} label="Open registrations" />
                    </div>
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <div className="text-[11px] font-bold text-text-secondary">Automatic backups</div>
                        <div className="text-[10px] text-text-muted">Nightly snapshot of listings & orders</div>
                      </div>
                      <Toggle on={settings.autoBackup} onClick={() => toggleSetting('autoBackup')} label="Automatic backups" />
                    </div>
                  </div>
                  <div className="glass-panel-sm p-4 space-y-4">
                    <div className="flex items-center gap-2 text-xs font-bold text-text-primary">
                      <Globe className="w-4 h-4 text-soil-gold" /> Regional & Language
                    </div>
                    <div className="flex flex-wrap items-center gap-2">
                      {[
                        { key: 'en', label: 'English' },
                        { key: 'hi', label: 'हिन्दी' },
                        { key: 'ta', label: 'தமிழ்' },
                        { key: 'te', label: 'తెలుగు' },
                      ].map((l) => (
                        <button
                          key={l.key}
                          onClick={() => setSettings((prev) => ({ ...prev, locale: l.key }))}
                          className={`px-3 py-1.5 rounded-xl text-[11px] font-bold transition cursor-pointer ${
                            settings.locale === l.key
                              ? 'bg-soil-gold/20 text-soil-goldSoft border border-soil-gold/40'
                              : 'bg-white/5 text-text-muted border border-white/10 hover:text-text-primary'
                          }`}
                        >
                          {l.label}
                        </button>
                      ))}
                    </div>
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <div className="text-[11px] font-bold text-text-secondary">Map data provider</div>
                        <div className="text-[10px] text-text-muted">Source used for aggregation & tracking maps</div>
                      </div>
                      <select
                        value={settings.mapProvider}
                        onChange={(e) => setSettings((prev) => ({ ...prev, mapProvider: e.target.value }))}
                        className="px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 text-[11px] font-bold text-text-primary outline-none focus:border-soil-gold/40 cursor-pointer"
                      >
                        <option value="osm" className="bg-soil-deep">OpenStreetMap</option>
                        <option value="mm" className="bg-soil-deep">Maanvasam Maps</option>
                        <option value="isro" className="bg-soil-deep">ISRO Geo</option>
                      </select>
                    </div>
                  </div>
                  <GlassButton variant="green" onClick={saveSettings} className="flex items-center gap-2">
                    <Save className="w-4 h-4" /> Save configuration
                  </GlassButton>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </GlassCard>
      </FadeIn>

      {/* Recent activity */}
      <FadeIn delay={0.18}>
        <GlassCard className="p-5 sm:p-6" hover={false}>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="font-display font-extrabold text-lg text-text-primary">Recent Activity</h2>
              <p className="text-xs text-text-muted mt-0.5">Latest platform events across users, orders & payments</p>
            </div>
            <GlassButton
              variant="ghost"
              onClick={() => {
                setHiddenSections((prev) => ({ ...prev, activity: !prev.activity }));
                pushToast({ title: hiddenSections.activity ? 'Feed shown' : 'Feed hidden', message: 'Section visibility toggled', type: 'info' });
              }}
              className="!px-3 !py-1.5 !text-[10px]"
            >
              {hiddenSections.activity ? 'Show' : 'Hide'}
            </GlassButton>
          </div>
          {!hiddenSections.activity && (
            <div className="relative">
              <div className="absolute left-[5px] top-1 bottom-1 w-px bg-white/10" />
              <div className="space-y-3">
                {activityFeed.map((a, i) => (
                  <motion.div
                    key={a.tag + a.time}
                    initial={{ opacity: 0, x: -14 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05, duration: 0.35 }}
                    className="flex items-start gap-3 relative"
                  >
                    <span className={`relative z-10 w-[11px] h-[11px] rounded-full mt-1 shrink-0 ${a.color} bg-soil-deep border-[3px] border-current`} />
                    <div className="glass-panel-sm flex-1 px-3.5 py-2.5 flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-center gap-2.5 min-w-0">
                        <span className={`shrink-0 ${a.color}`}><a.icon className="w-3.5 h-3.5" /></span>
                        <span className="text-[10px] font-extrabold uppercase tracking-wider text-text-muted shrink-0">{a.tag}</span>
                        <span className="text-[11px] font-semibold text-text-primary truncate">{a.text}</span>
                      </div>
                      <span className="text-[10px] text-text-muted shrink-0">{a.time}</span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          )}
        </GlassCard>
      </FadeIn>

      {/* Product add / edit form */}
      <AnimatePresence>
        {showProductForm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-soil-deep/70 backdrop-blur-md"
            onClick={() => setShowProductForm(false)}
          >
            <motion.div
              initial={{ scale: 0.96, y: 12 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.96, y: 12 }}
              transition={{ type: 'spring', stiffness: 320, damping: 28 }}
              className="w-full max-w-lg glass-panel p-5 sm:p-6 space-y-4 max-h-[90vh] overflow-y-auto scrollbar-none"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-display font-extrabold text-lg text-text-primary">
                    {productEditingId ? 'Edit Listing' : 'New Listing'}
                  </h3>
                  <p className="text-xs text-text-muted">{productEditingId ? 'Update the marketplace product details' : 'List a new product in the marketplace'}</p>
                </div>
                <button onClick={() => setShowProductForm(false)} className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-text-muted transition cursor-pointer">
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={saveProduct} className="space-y-3">
                <div className="grid sm:grid-cols-2 gap-3">
                  <div className="sm:col-span-2 space-y-1">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-text-muted">Product name</label>
                    <input
                      value={productForm.name}
                      onChange={(e) => setProductForm((prev) => ({ ...prev, name: e.target.value }))}
                      placeholder="e.g. Madurai Mango"
                      className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-xs text-text-primary placeholder:text-text-muted outline-none focus:border-soil-gold/40"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-text-muted">Category</label>
                    <select
                      value={productForm.category}
                      onChange={(e) => setProductForm((prev) => ({ ...prev, category: e.target.value }))}
                      className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-xs text-text-primary outline-none focus:border-soil-gold/40 cursor-pointer"
                    >
                      {['Vegetables', 'Fruits', 'Grains', 'Dairy', 'Spices', 'Pulses', 'Other'].map((c) => (
                        <option key={c} value={c} className="bg-soil-deep">{c}</option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-text-muted">Unit</label>
                    <select
                      value={productForm.unit}
                      onChange={(e) => setProductForm((prev) => ({ ...prev, unit: e.target.value }))}
                      className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-xs text-text-primary outline-none focus:border-soil-gold/40 cursor-pointer"
                    >
                      {['kg', 'g', 'dozen', 'litre', 'bag', 'box'].map((u) => (
                        <option key={u} value={u} className="bg-soil-deep">{u}</option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-text-muted">Price (₹)</label>
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={productForm.price}
                      onChange={(e) => setProductForm((prev) => ({ ...prev, price: e.target.value }))}
                      placeholder="e.g. 45"
                      className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-xs text-text-primary placeholder:text-text-muted outline-none focus:border-soil-gold/40"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-text-muted">Available qty</label>
                    <input
                      type="number"
                      min="0"
                      value={productForm.availableQty}
                      onChange={(e) => setProductForm((prev) => ({ ...prev, availableQty: e.target.value }))}
                      placeholder="e.g. 200"
                      className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-xs text-text-primary placeholder:text-text-muted outline-none focus:border-soil-gold/40"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-text-muted">Availability</label>
                    <select
                      value={productForm.availability}
                      onChange={(e) => setProductForm((prev) => ({ ...prev, availability: e.target.value }))}
                      className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-xs text-text-primary outline-none focus:border-soil-gold/40 cursor-pointer"
                    >
                      {['Ready Stock', 'Pre-order', 'Seasonal'].map((a) => (
                        <option key={a} value={a} className="bg-soil-deep">{a}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {productSaveError && (
                  <div className="flex items-center gap-1.5 text-[11px] font-bold text-red-300">
                    <AlertTriangle className="w-3.5 h-3.5" /> {productSaveError}
                  </div>
                )}

                <div className="flex items-center justify-end gap-2 pt-1">
                  <GlassButton variant="ghost" onClick={() => setShowProductForm(false)}>Cancel</GlassButton>
                  <GlassButton variant="green" className="flex items-center gap-1.5">
                    <Check className="w-4 h-4" /> {productEditingId ? 'Save changes' : 'List product'}
                  </GlassButton>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
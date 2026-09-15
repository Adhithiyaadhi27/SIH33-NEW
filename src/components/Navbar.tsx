import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Sprout, ChevronDown, Bell, ShoppingBag, Menu, X, LogOut, LogIn, LayoutDashboard, Package, Plus, ShoppingCart, Truck, BarChart3, Settings, Users, ClipboardList, Home, Search } from 'lucide-react';
import type { RoleName } from '../store/roleStore';
import { useMarketplaceStore } from '../store/marketplaceStore';
import { useAuthStore } from '../store/authStore';
import { useNotificationReadStore } from '../store/notificationReadStore';
import { ROLE_NOTIFICATIONS } from './notifications/notificationData';
import useTranslation from '../services/useTranslation';
import LoginModal from './registration/LoginModal';
import NotificationsCenter from './notifications/NotificationsCenter';

const NAV_ITEMS: Record<RoleName, Array<{ label: string; icon: typeof LayoutDashboard; path: string }>> = {
  ADMIN: [
    { label: 'Dashboard', icon: LayoutDashboard, path: '/admin' },
    { label: 'Farmers', icon: Users, path: '/admin?tab=users&role=farmers' },
    { label: 'Consumers', icon: Users, path: '/admin?tab=users&role=consumers' },
    { label: 'Products', icon: Package, path: '/admin?tab=products' },
    { label: 'Orders', icon: ClipboardList, path: '/admin?tab=orders' },
    { label: 'Analytics', icon: BarChart3, path: '/admin/analytics' },
    { label: 'Notifications', icon: Bell, path: '/admin?tab=notifications' },
    { label: 'Settings', icon: Settings, path: '/admin?tab=settings' },
  ],
  FARMER: [
    { label: 'Dashboard', icon: LayoutDashboard, path: '/farmer' },
    { label: 'Browse Marketplace', icon: Home, path: '/marketplace' },
    { label: 'My Products', icon: Package, path: '/farmer?section=products' },
    { label: 'Add Product', icon: Plus, path: '/farmer?action=add' },
    { label: 'Orders', icon: ClipboardList, path: '/farmer?section=orders' },
    { label: 'Earnings', icon: BarChart3, path: '/farmer?section=orders' },
    { label: 'Notifications', icon: Bell, path: '/notifications' },
  ],
  CONSUMER: [
    { label: 'Home', icon: Home, path: '/consumer' },
    { label: 'Marketplace', icon: Search, path: '/marketplace' },
    { label: 'Cart', icon: ShoppingCart, path: '/cart' },
    { label: 'My Orders', icon: ClipboardList, path: '/orders' },
    { label: 'Delivery Tracking', icon: Truck, path: '/tracking' },
  ],
};

const ROLE_ROUTES: Record<RoleName, string> = {
  ADMIN: '/admin',
  FARMER: '/farmer',
  CONSUMER: '/consumer',
};

export default function Navbar() {
  const { totalItems } = useMarketplaceStore();
  const { user, logout } = useAuthStore();
  const unread = useNotificationReadStore((s) => s.read);
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [openRole, setOpenRole] = useState<string | null>(null);
  const [notifOpen, setNotifOpen] = useState(false);

  const handleSignOut = () => {
    logout();
    setMobileOpen(false);
    setOpenRole(null);
    navigate('/');
  };

  const navItems = user ? NAV_ITEMS[user.role as RoleName] || NAV_ITEMS.CONSUMER : [];

  const userNotifications = user ? ROLE_NOTIFICATIONS[(user.role as RoleName) in ROLE_NOTIFICATIONS ? (user.role as RoleName) : 'CONSUMER'] ?? [] : [];
  const unreadCount = userNotifications.filter((n) => !unread[n.id]).length;

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 px-2 sm:px-4 lg:px-5 pt-2 sm:pt-3">
        <div className="max-w-[1600px] mx-auto glass-panel rounded-xl sm:rounded-2xl px-3 sm:px-4 py-2 sm:py-2.5 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2.5 group shrink-0">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-soil-emerald to-soil-leaf flex items-center justify-center text-white shadow-glow-emerald">
              <Sprout className="w-5 h-5 animate-leaf-sway" />
            </div>
            <div className="leading-tight">
              <span className="font-display font-extrabold text-sm sm:text-base text-text-primary tracking-tight">MANN VASSAM</span>
              <span className="hidden md:block text-[9px] uppercase tracking-widest text-soil-gold font-bold">{t('hero.tagline')}</span>
            </div>
          </Link>

          {/* Role-specific navigation */}
          {user && (
            <nav className="hidden lg:flex items-center gap-0.5">
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.label}
                    onClick={() => navigate(item.path)}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-text-secondary hover:text-text-primary hover:bg-white/10 transition cursor-pointer"
                  >
                    <Icon className="w-3.5 h-3.5" />
                    {item.label}
                  </button>
                );
              })}
            </nav>
          )}

          {/* Right actions */}
          <div className="flex items-center gap-1.5">
            {user && user.role === 'CONSUMER' && (
              <Link
                to="/cart"
                className="relative p-2 text-text-secondary hover:text-text-primary hover:bg-white/10 rounded-xl transition cursor-pointer"
                title="Cart"
              >
                <ShoppingBag className="w-5 h-5" />
                {totalItems() > 0 && (
                  <span className="absolute -top-1 -right-1 bg-soil-gold text-soil-base text-[9px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
                    {totalItems()}
                  </span>
                )}
              </Link>
            )}

            {user && (
              <div className="relative">
                <button
                  onClick={() => { setNotifOpen(!notifOpen); setOpenRole(null); }}
                  className="relative p-2 text-text-secondary hover:text-text-primary hover:bg-white/10 rounded-xl transition cursor-pointer"
                  title="Notifications"
                >
                  <Bell className="w-5 h-5" />
                  {unreadCount > 0 && <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-soil-gold animate-pulse" />}
                </button>
                <NotificationsCenter open={notifOpen} onClose={() => setNotifOpen(false)} />
              </div>
            )}

            {user ? (
              <div className="relative">
                <button
                  onClick={() => setOpenRole(openRole === 'user' ? null : 'user')}
                  className="hidden sm:flex items-center gap-2 pl-1.5 pr-3 py-1 rounded-full bg-white/5 border border-white/15 hover:border-soil-gold/40 transition cursor-pointer"
                >
                  <span className="w-6 h-6 rounded-full bg-gradient-to-tr from-soil-emerald to-soil-leaf flex items-center justify-center text-[10px] font-bold text-white">
                    {user.name.charAt(0).toUpperCase()}
                  </span>
                  <span className="text-[11px] font-bold text-text-primary max-w-[90px] truncate">{user.name}</span>
                  <ChevronDown className="w-3 h-3 text-text-muted" />
                </button>
                {openRole === 'user' && (
                  <div className="absolute right-0 mt-2 w-56 glass-panel p-2 z-50">
                    <div className="px-3 py-1.5 text-[10px] text-text-muted truncate">{user.email}</div>
                    <div className="px-3 py-1 text-[11px] font-bold text-soil-gold">{user.role}</div>
                    <div className="glass-divider my-1" />
                    <button
                      onClick={() => { setOpenRole(null); navigate(ROLE_ROUTES[user.role as RoleName] || '/'); }}
                      className="w-full text-left px-3 py-2 rounded-xl text-xs font-semibold text-text-primary hover:bg-white/10 cursor-pointer"
                    >
                      My Dashboard
                    </button>
                    <button
                      onClick={handleSignOut}
                      className="w-full flex items-center gap-2 text-left px-3 py-2 rounded-xl text-xs text-text-muted hover:bg-white/10 hover:text-red-300 cursor-pointer"
                    >
                      <LogOut className="w-3.5 h-3.5" /> Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={() => setShowLogin(true)}
                className="hidden sm:flex items-center gap-1.5 px-3 py-2 rounded-full text-xs font-bold text-soil-gold border border-soil-gold/50 hover:bg-soil-gold/10 transition cursor-pointer"
              >
                <LogIn className="w-3.5 h-3.5" />
                Login
              </button>
            )}

            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="lg:hidden p-2 text-text-primary rounded-xl cursor-pointer"
            >
              {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="lg:hidden mt-2 glass-panel p-3 rounded-2xl space-y-1"
            >
              {user && navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.label}
                    onClick={() => { navigate(item.path); setMobileOpen(false); }}
                    className="flex items-center gap-2 w-full text-left px-3 py-2.5 rounded-xl text-sm font-semibold text-text-primary hover:bg-white/10 cursor-pointer"
                  >
                    <Icon className="w-4 h-4" />
                    {item.label}
                  </button>
                );
              })}
              <div className="glass-divider my-1" />
              {user ? (
                <>
                  <div className="px-3 py-2 text-[11px] text-text-muted">
                    Signed in as <span className="text-soil-gold font-bold">{user.name}</span> ({user.role})
                  </div>
                  <button
                    onClick={handleSignOut}
                    className="flex w-full items-center gap-2 px-3 py-2 text-xs text-text-muted hover:text-red-300 cursor-pointer"
                  >
                    <LogOut className="w-3.5 h-3.5" /> Sign Out
                  </button>
                </>
              ) : (
                <button
                  onClick={() => { setShowLogin(true); setMobileOpen(false); }}
                  className="block w-full text-left px-3 py-2.5 rounded-xl text-sm font-semibold text-soil-gold border border-soil-gold/40 hover:bg-soil-gold/10 cursor-pointer"
                >
                  <span className="flex items-center gap-2">
                    <LogIn className="w-3.5 h-3.5" /> Login
                  </span>
                </button>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {showLogin && <LoginModal onClose={() => setShowLogin(false)} />}
    </>
  );
}

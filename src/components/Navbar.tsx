import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Sprout, ChevronDown, Bell, ShoppingBag, Heart, MessageSquare, Menu, X, User, LogOut, LogIn } from 'lucide-react';
import { useRoleStore, type RoleName } from '../store/roleStore';
import { useMarketplaceStore } from '../store/marketplaceStore';
import { useWishlistStore } from '../store/wishlistStore';
import { useNegotiationStore } from '../store/negotiationStore';
import { useAuthStore } from '../store/authStore';
import useTranslation from '../services/useTranslation';
import api from '../services/api';
import RegistrationModal from './registration/RegistrationModal';
import LoginModal from './registration/LoginModal';
import LanguageToggle from './LanguageToggle';

const roles: RoleName[] = ['FPO', 'Consumer', 'Bulk Buyer', 'Logistics', 'Admin'];

const roleRoute: Record<RoleName, string> = {
  FPO: '/fpo',
  Consumer: '/consumer',
  'Bulk Buyer': '/bulk-buyer',
  Logistics: '/logistics',
  Admin: '/admin',
};

const tRoleKey: Record<RoleName, string> = {
  FPO: 'navbar.fpo',
  Consumer: 'navbar.consumer',
  'Bulk Buyer': 'navbar.bulk_buyer',
  Logistics: 'navbar.logistics',
  Admin: 'navbar.admin',
};

interface NavNotification {
  id: string;
  role: string;
  type: string;
  title: string;
  message: string;
  time: string;
  read?: boolean;
}

export default function Navbar() {
  const { activeRole, setActiveRole } = useRoleStore();
  const { totalItems } = useMarketplaceStore();
  const { items: wishlistItems } = useWishlistStore();
  const { negotiations } = useNegotiationStore();
  const { user, logout } = useAuthStore();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openRole, setOpenRole] = useState<string | null>(null);
  const [showRegistration, setShowRegistration] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [notifications, setNotifications] = useState<NavNotification[]>([]);

  const toggleNotifications = () => {
    const next = !notifOpen;
    setNotifOpen(next);
    setOpenRole(null);
    if (next && notifications.length === 0) {
      api
        .get('/notifications')
        .then((res) => {
          if (res.data?.notifications?.length) setNotifications(res.data.notifications);
        })
        .catch(() => {
          /* keep empty state when backend is down */
        });
    }
  };

  const handleSignOut = () => {
    logout();
    setMobileOpen(false);
    setOpenRole(null);
    navigate('/');
  };

  const handleRoleSelect = (role: RoleName) => {
    setActiveRole(role);
    setOpenRole(null);
    navigate(roleRoute[role]);
  };

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 px-2 sm:px-4 lg:px-5 pt-2 sm:pt-3">
        <div className="max-w-[1600px] mx-auto glass-panel rounded-xl sm:rounded-2xl px-3 sm:px-4 py-2 sm:py-2.5 flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 group shrink-0">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-soil-emerald to-soil-leaf flex items-center justify-center text-white shadow-glow-emerald">
              <Sprout className="w-5 h-5 animate-leaf-sway" />
            </div>
            <div className="leading-tight">
              <span className="font-display font-extrabold text-sm sm:text-base text-text-primary tracking-tight">
                MANN VASSAM
              </span>
              <span className="hidden md:block text-[9px] uppercase tracking-widest text-soil-gold font-bold">
                {t('hero.tagline')}
              </span>
            </div>
          </Link>

          {/* Role navigation with dropdowns */}
          <nav className="hidden lg:flex items-center gap-0.5">
            {roles.map((role) => {
              const label = t(tRoleKey[role]);
              return (
                <div key={role} className="relative">
                  <button
                    onClick={() => setOpenRole(openRole === role ? null : role)}
                    className={`flex items-center gap-1 px-3 py-2 rounded-xl text-xs font-semibold transition cursor-pointer ${
                      activeRole === role ? 'bg-white/15 text-soil-gold' : 'text-text-secondary hover:text-text-primary hover:bg-white/10'
                    }`}
                  >
                    {label}
                    <ChevronDown className="w-3 h-3 opacity-60" />
                  </button>
                  <AnimatePresence>
                    {openRole === role && (
                      <motion.div
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 8 }}
                        className="absolute left-0 mt-2 w-56 glass-panel p-2 z-50"
                      >
                        <div className="px-3 py-1.5 text-[10px] uppercase font-bold text-soil-gold tracking-wider">
                          {t('navbar.cockpit', { role: label })}
                        </div>
                        <button
                          onClick={() => handleRoleSelect(role)}
                          className="w-full text-left px-3 py-2 rounded-xl text-xs font-semibold text-text-primary hover:bg-white/10 cursor-pointer"
                        >
                          {t('navbar.open_dashboard', { role: label })}
                        </button>
            <button
              onClick={() => { setOpenRole(null); navigate('/marketplace'); }}
              className="w-full text-left px-3 py-2 rounded-xl text-xs text-text-muted hover:bg-white/10 hover:text-text-primary cursor-pointer"
            >
              Browse Marketplace
            </button>
          </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  })}
</nav>

{/* Services dropdown */}
<div className="hidden lg:flex items-center gap-0.5 relative">
  <button
    onClick={() => setOpenRole(openRole === 'services' ? null : 'services')}
    className={`flex items-center gap-1 px-3 py-2 rounded-xl text-xs font-semibold transition cursor-pointer ${
      openRole === 'services' ? 'bg-white/15 text-soil-gold' : 'text-text-secondary hover:text-text-primary hover:bg-white/10'
    }`}
  >
    Services
    <ChevronDown className="w-3 h-3 opacity-60" />
  </button>
  <AnimatePresence>
    {openRole === 'services' && (
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 8 }}
        className="absolute left-0 top-full mt-2 w-56 glass-panel p-2 z-50"
      >
        <button onClick={() => { setOpenRole(null); navigate('/tracking'); }} className="w-full text-left px-3 py-2 rounded-xl text-xs text-text-muted hover:bg-white/10 hover:text-text-primary cursor-pointer">Order Tracking</button>
        <button onClick={() => { setOpenRole(null); navigate('/subscriptions'); }} className="w-full text-left px-3 py-2 rounded-xl text-xs text-text-muted hover:bg-white/10 hover:text-text-primary cursor-pointer">Subscriptions</button>
        <button onClick={() => { setOpenRole(null); navigate('/schemes'); }} className="w-full text-left px-3 py-2 rounded-xl text-xs text-text-muted hover:bg-white/10 hover:text-text-primary cursor-pointer">Govt Schemes</button>
        <button onClick={() => { setOpenRole(null); navigate('/disputes'); }} className="w-full text-left px-3 py-2 rounded-xl text-xs text-text-muted hover:bg-white/10 hover:text-text-primary cursor-pointer">Dispute Resolution</button>
        <button onClick={() => { setOpenRole(null); navigate('/inventory'); }} className="w-full text-left px-3 py-2 rounded-xl text-xs text-text-muted hover:bg-white/10 hover:text-text-primary cursor-pointer">Farm Inventory</button>
        <button onClick={() => { setOpenRole(null); navigate('/revenue'); }} className="w-full text-left px-3 py-2 rounded-xl text-xs text-text-muted hover:bg-white/10 hover:text-text-primary cursor-pointer">Revenue Analytics</button>
      </motion.div>
    )}
  </AnimatePresence>
</div>

          {/* Right actions */}
          <div className="flex items-center gap-1.5">
            {/* Language toggle */}
            <LanguageToggle />

            <div className="relative">
              <button
                onClick={toggleNotifications}
                className="relative p-2 text-text-secondary hover:text-text-primary hover:bg-white/10 rounded-xl transition cursor-pointer"
                title="Notifications"
              >
                <Bell className="w-5 h-5" />
                <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-soil-gold animate-pulse" />
              </button>
              <AnimatePresence>
                {notifOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 8, scale: 0.96 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 8, scale: 0.96 }}
                    transition={{ duration: 0.15 }}
                    className="absolute right-0 mt-2 w-80 glass-panel p-2 z-50"
                  >
                    <div className="px-3 py-1.5 text-[10px] uppercase font-bold text-soil-gold tracking-wider flex items-center justify-between">
                      Notifications
                      <button
                        onClick={() => setNotifOpen(false)}
                        className="text-text-muted hover:text-text-primary cursor-pointer"
                        title="Close"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    {notifications.length === 0 ? (
                      <div className="px-3 py-6 text-center text-[11px] text-text-muted">
                        No notifications yet. Live alerts will appear here.
                      </div>
                    ) : (
                      <div className="space-y-1 max-h-80 overflow-y-auto pr-1">
                        {notifications.map((n) => (
                          <div key={n.id} className={`px-3 py-2 rounded-xl text-xs ${n.read ? 'bg-white/5' : 'bg-white/10 border border-soil-gold/20'}`}>
                            <div className="font-bold text-text-primary">{n.title}</div>
                            <p className="text-[10px] text-text-muted mt-0.5 leading-relaxed">{n.message}</p>
                            <div className="text-[9px] text-soil-gold mt-1">{n.time}</div>
                          </div>
                        ))}
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <Link
              to="/wishlist"
              className="relative p-2 text-text-secondary hover:text-text-primary hover:bg-white/10 rounded-xl transition cursor-pointer"
              title="Wishlist"
            >
              <Heart className="w-5 h-5" />
              {wishlistItems.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[8px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
                  {wishlistItems.length}
                </span>
              )}
            </Link>

            <Link
              to="/negotiations"
              className="relative p-2 text-text-secondary hover:text-text-primary hover:bg-white/10 rounded-xl transition cursor-pointer"
              title="Negotiations"
            >
              <MessageSquare className="w-5 h-5" />
              {negotiations.filter((n) => n.status === 'countered' || n.status === 'open').length > 0 && (
                <span className="absolute -top-1 -right-1 bg-soil-gold text-soil-base text-[8px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
                  {negotiations.filter((n) => n.status === 'countered' || n.status === 'open').length}
                </span>
              )}
            </Link>

            <Link
              to="/cart"
              className="flex items-center gap-2 text-text-secondary hover:text-text-primary hover:bg-white/10 rounded-xl px-2.5 py-1.5 transition cursor-pointer"
              title="Cart"
            >
              <div className="relative">
                <ShoppingBag className="w-5 h-5" />
                {totalItems() > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 bg-soil-gold text-soil-base text-[9px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
                    {totalItems()}
                  </span>
                )}
              </div>
            </Link>

            {/* Auth (login / user menu) */}
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
                <AnimatePresence>
                  {openRole === 'user' && (
                    <motion.div
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 8 }}
                      className="absolute right-0 mt-2 w-56 glass-panel p-2 z-50"
                    >
                      <div className="px-3 py-1.5 text-[10px] text-text-muted truncate">{user.email}</div>
                      <div className="px-3 py-1 text-[11px] font-bold text-soil-gold">{user.role}</div>
                      <div className="glass-divider my-1" />
                      <button
                        onClick={() => { setOpenRole(null); navigate(roleRoute[user.role as RoleName] ?? '/'); }}
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
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <>
                <button
                  onClick={() => setShowLogin(true)}
                  className="hidden sm:flex items-center gap-1.5 px-3 py-2 rounded-full text-xs font-bold text-soil-gold border border-soil-gold/50 hover:bg-soil-gold/10 transition cursor-pointer"
                >
                  <LogIn className="w-3.5 h-3.5" />
                  Login
                </button>
                <button
                  onClick={() => setShowRegistration(true)}
                  className="hidden sm:flex items-center gap-1.5 bg-gradient-to-r from-soil-emerald to-soil-leaf text-white pl-5 pr-4 py-2 rounded-full text-xs font-bold shadow-glow-emerald hover:brightness-110 transition cursor-pointer"
                >
                  <User className="w-3.5 h-3.5" />
                  {t('navbar.registration')}
                </button>
              </>
            )}

            {/* Mobile menu toggle */}
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
              {roles.map((role) => (
                <button
                  key={role}
                  onClick={() => { handleRoleSelect(role); setMobileOpen(false); }}
                  className="block w-full text-left px-3 py-2.5 rounded-xl text-sm font-semibold text-text-primary hover:bg-white/10 cursor-pointer"
                >
                  {t(tRoleKey[role])}
                </button>
              ))}
              <div className="glass-divider my-1" />
              <button
                onClick={() => { navigate('/wishlist'); setMobileOpen(false); }}
                className="block w-full text-left px-3 py-2.5 rounded-xl text-sm font-semibold text-text-primary hover:bg-white/10 cursor-pointer"
              >
                Wishlist {wishlistItems.length > 0 && <span className="text-red-400">({wishlistItems.length})</span>}
              </button>
              <button
                onClick={() => { navigate('/negotiations'); setMobileOpen(false); }}
                className="block w-full text-left px-3 py-2.5 rounded-xl text-sm font-semibold text-text-primary hover:bg-white/10 cursor-pointer"
              >
                Negotiations {negotiations.filter((n) => n.status === 'countered' || n.status === 'open').length > 0 && <span className="text-soil-gold">({negotiations.filter((n) => n.status === 'countered' || n.status === 'open').length})</span>}
              </button>
              <div className="glass-divider my-1" />
              <button
                onClick={() => { navigate('/tracking'); setMobileOpen(false); }}
                className="block w-full text-left px-3 py-2.5 rounded-xl text-sm font-semibold text-text-primary hover:bg-white/10 cursor-pointer"
              >
                Order Tracking
              </button>
              <button
                onClick={() => { navigate('/subscriptions'); setMobileOpen(false); }}
                className="block w-full text-left px-3 py-2.5 rounded-xl text-sm font-semibold text-text-primary hover:bg-white/10 cursor-pointer"
              >
                Subscriptions
              </button>
              <button
                onClick={() => { navigate('/schemes'); setMobileOpen(false); }}
                className="block w-full text-left px-3 py-2.5 rounded-xl text-sm font-semibold text-text-primary hover:bg-white/10 cursor-pointer"
              >
                Govt Schemes
              </button>
              <button
                onClick={() => { navigate('/disputes'); setMobileOpen(false); }}
                className="block w-full text-left px-3 py-2.5 rounded-xl text-sm font-semibold text-text-primary hover:bg-white/10 cursor-pointer"
              >
                Dispute Resolution
              </button>
              <div className="glass-divider my-1" />
              {user ? (
                <div className="px-3 py-2 text-[11px] text-text-muted">
                  Signed in as <span className="text-soil-gold font-bold">{user.name}</span> ({user.role})
                </div>
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
              <button
                onClick={handleSignOut}
                className="flex w-full items-center gap-2 px-3 py-2 text-xs text-text-muted hover:text-red-300 cursor-pointer"
              >
                <LogOut className="w-3.5 h-3.5" /> {t('navbar.sign_out')}
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {showRegistration && <RegistrationModal onClose={() => setShowRegistration(false)} />}
      {showLogin && <LoginModal onClose={() => setShowLogin(false)} />}
    </>
  );
}

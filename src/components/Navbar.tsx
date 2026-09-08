import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Sprout, ChevronDown, Bell, ShoppingBag, Menu, X, User, LogOut } from 'lucide-react';
import { useRoleStore, type RoleName } from '../store/roleStore';
import { useMarketplaceStore } from '../store/marketplaceStore';
import useTranslation from '../services/useTranslation';
import RegistrationModal from './registration/RegistrationModal';
import LanguageToggle from './LanguageToggle';

const roles: RoleName[] = ['Farmer', 'FPO', 'Consumer', 'Bulk Buyer', 'Logistics', 'Admin'];

const roleRoute: Record<RoleName, string> = {
  Farmer: '/farmer',
  FPO: '/fpo',
  Consumer: '/consumer',
  'Bulk Buyer': '/bulk-buyer',
  Logistics: '/logistics',
  Admin: '/admin',
};

const tRoleKey: Record<RoleName, string> = {
  Farmer: 'navbar.farmer',
  FPO: 'navbar.fpo',
  Consumer: 'navbar.consumer',
  'Bulk Buyer': 'navbar.bulk_buyer',
  Logistics: 'navbar.logistics',
  Admin: 'navbar.admin',
};

export default function Navbar() {
  const { activeRole, setActiveRole } = useRoleStore();
  const { totalItems } = useMarketplaceStore();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openRole, setOpenRole] = useState<string | null>(null);
  const [showRegistration, setShowRegistration] = useState(false);

  const handleRoleSelect = (role: RoleName) => {
    setActiveRole(role);
    setOpenRole(null);
    navigate(roleRoute[role]);
  };

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 px-3 sm:px-5 pt-3">
        <div className="max-w-[1600px] mx-auto glass-panel rounded-2xl px-4 py-2.5 flex items-center justify-between">
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
                          {t('navbar.browse_marketplace')}
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </nav>

          {/* Right actions */}
          <div className="flex items-center gap-2">
            {/* Language toggle */}
            <LanguageToggle />

            <button
              className="relative p-2 text-text-secondary hover:text-text-primary hover:bg-white/10 rounded-xl transition cursor-pointer"
              title="Notifications"
            >
              <Bell className="w-5 h-5" />
              <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-soil-gold animate-pulse" />
            </button>

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

            {/* Dynamic Registration CTA */}
            <button
              onClick={() => setShowRegistration(true)}
              className="hidden sm:flex items-center gap-1.5 bg-gradient-to-r from-soil-emerald to-soil-leaf text-white pl-5 pr-4 py-2 rounded-full text-xs font-bold shadow-glow-emerald hover:brightness-110 transition cursor-pointer"
            >
              <User className="w-3.5 h-3.5" />
              {t('navbar.registration')}
            </button>

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
              <button
                onClick={() => { setShowRegistration(true); setMobileOpen(false); }}
                className="block w-full text-left px-3 py-2.5 rounded-xl text-sm font-bold text-soil-base bg-gradient-to-r from-soil-emerald to-soil-leaf cursor-pointer"
              >
                {t('navbar.registration')}
              </button>
              <div className="flex items-center gap-2 px-3 py-2 text-xs text-text-muted">
                <LogOut className="w-3.5 h-3.5" /> {t('navbar.sign_out')}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {showRegistration && <RegistrationModal onClose={() => setShowRegistration(false)} />}
    </>
  );
}
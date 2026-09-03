import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  Sprout,
  ShoppingBag,
  Bell,
  User,
  Menu,
  X,
  Sparkles,
  MapPin,
  ChevronDown,
  LogOut,
  Sliders,
  ShieldCheck
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useNotifications } from '../context/NotificationContext';

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { currentUser, role, logout, switchRolePersona, availablePersonas } = useAuth();
  const { totalItemsCount, total, setIsDrawerOpen } = useCart();
  const { notifications, unreadCount, markAllAsRead } = useNotifications();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [roleMenuOpen, setRoleMenuOpen] = useState(false);
  const [notifMenuOpen, setNotifMenuOpen] = useState(false);

  const isActive = (path) => location.pathname === path;

  return (
    <header className="sticky top-0 z-40 bg-[#FBFCF8]/95 backdrop-blur-md border-b border-nature-soft/40 transition-all shadow-nature-sm">
      {/* Top Agricultural Live Corridor Ticker Bar (Deep Green Gradient #1B4332 -> #2D6A4F) */}
      <div className="bg-gradient-to-r from-nature-primary via-nature-hover to-nature-leaf text-white text-xs py-1.5 px-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-2 overflow-hidden whitespace-nowrap">
            <span className="inline-flex items-center gap-1 bg-white/20 px-2.5 py-0.5 rounded-full font-bold text-[11px] text-nature-cream">
              <Sparkles className="w-3 h-3 text-nature-harvest" /> AI Live Corridors
            </span>
            <span className="hidden sm:inline text-nature-pale text-[11px]">
              Madurai Tomato (+4,500 kg Surplus) &rarr; Chennai Deficit (+1,800 kg Needed) | Cold fleet active on NH-45
            </span>
          </div>
          <div className="flex items-center gap-3 text-[11px] font-medium">
            <span className="hidden md:inline text-nature-cream/80">24x7 Mandi Desk: 1800-425-AGRI</span>
            <div className="relative">
              <button
                onClick={() => setRoleMenuOpen(!roleMenuOpen)}
                className="flex items-center gap-1.5 bg-white/20 hover:bg-white/30 px-3 py-1 rounded-xl transition font-semibold text-white cursor-pointer"
                title="Switch demo persona"
              >
                <Sliders className="w-3 h-3 text-nature-harvest" />
                <span>Demo Role: <strong className="text-nature-cream underline">{role}</strong></span>
                <ChevronDown className="w-3 h-3" />
              </button>

              {roleMenuOpen && (
                <div className="absolute right-0 mt-2 w-60 bg-nature-card text-nature-text rounded-basket shadow-nature-lg border border-nature-soft/40 p-2.5 z-50 text-xs animate-in fade-in zoom-in-95">
                  <div className="px-2 py-1 text-[10px] uppercase font-bold text-nature-earth tracking-wider">
                    Switch Stakeholder (Live Demo)
                  </div>
                  {availablePersonas.map((p) => (
                    <button
                      key={p.id}
                      onClick={() => {
                        switchRolePersona(p.role);
                        setRoleMenuOpen(false);
                        navigate('/dashboard');
                      }}
                      className={`w-full text-left px-3 py-2 rounded-xl flex items-center justify-between transition cursor-pointer my-0.5 ${
                        currentUser?.id === p.id
                          ? 'bg-nature-pale font-bold text-nature-primary'
                          : 'hover:bg-nature-bgSoft text-nature-text'
                      }`}
                    >
                      <div>
                        <div className="font-semibold">{p.name.split('(')[0]}</div>
                        <div className="text-[10px] text-nature-earth">{p.role}</div>
                      </div>
                      {currentUser?.id === p.id && (
                        <span className="w-2 h-2 rounded-full bg-nature-primary"></span>
                      )}
                    </button>
                  ))}
                  <div className="border-t border-nature-soft/40 my-1 pt-1 text-[10px] text-nature-earth px-2 font-medium">
                    Farmers are managed under FPO co-operatives
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo with sprout badge */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-nature-primary to-nature-leaf flex items-center justify-center text-white shadow-nature group-hover:scale-105 transition">
              <Sprout className="w-6 h-6 text-white animate-leaf-sway" />
            </div>
            <div>
              <span className="font-display font-extrabold text-xl sm:text-2xl text-nature-primary tracking-tight">
                AgriDirect <span className="text-nature-leaf">AI</span>
              </span>
              <span className="hidden sm:block text-[9px] uppercase tracking-widest text-nature-earth font-bold">
                Smart Agricultural Supply Chain
              </span>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden lg:flex items-center gap-1">
            <Link
              to="/marketplace"
              className={`px-3 py-2 rounded-xl text-xs sm:text-sm font-semibold transition ${
                isActive('/marketplace')
                  ? 'bg-nature-pale text-nature-primary'
                  : 'text-nature-text hover:text-nature-primary hover:bg-nature-bgSoft'
              }`}
            >
              🥦 Marketplace
            </Link>

            <Link
              to="/buyer-requirements"
              className={`px-3 py-2 rounded-xl text-xs sm:text-sm font-medium transition ${
                isActive('/buyer-requirements')
                  ? 'bg-nature-pale text-nature-primary font-bold'
                  : 'text-nature-text hover:text-nature-primary hover:bg-nature-bgSoft'
              }`}
            >
              Buyers Market
            </Link>

            <Link
              to="/supply-map"
              className={`px-3 py-2 rounded-xl text-xs sm:text-sm font-medium transition ${
                isActive('/supply-map')
                  ? 'bg-nature-pale text-nature-primary font-bold'
                  : 'text-nature-text hover:text-nature-primary hover:bg-nature-bgSoft'
              }`}
            >
              Live Supply Map
            </Link>

            <Link
              to="/ai-insights"
              className={`px-3 py-2 rounded-xl text-xs sm:text-sm font-medium flex items-center gap-1.5 transition ${
                isActive('/ai-insights')
                  ? 'bg-nature-pale text-nature-primary font-bold'
                  : 'text-nature-text hover:text-nature-primary hover:bg-nature-bgSoft'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-nature-ai" /> AI Insights
            </Link>

            <Link
              to="/produce-passport"
              className={`px-3 py-2 rounded-xl text-xs sm:text-sm font-medium transition ${
                isActive('/produce-passport')
                  ? 'bg-nature-pale text-nature-primary font-bold'
                  : 'text-nature-text hover:text-nature-primary hover:bg-nature-bgSoft'
              }`}
            >
              Produce Passport
            </Link>

            <Link
              to="/how-it-works"
              className={`px-3 py-2 rounded-xl text-xs sm:text-sm font-medium transition ${
                isActive('/how-it-works')
                  ? 'bg-nature-pale text-nature-primary font-bold'
                  : 'text-nature-text hover:text-nature-primary hover:bg-nature-bgSoft'
              }`}
            >
              How It Works
            </Link>
          </nav>

          {/* Right Actions: Notifications, Basket, Dashboard */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Notifications Bell */}
            <div className="relative">
              <button
                onClick={() => setNotifMenuOpen(!notifMenuOpen)}
                className="p-2 text-nature-text hover:text-nature-primary hover:bg-nature-bgSoft rounded-xl transition relative cursor-pointer"
                title="Notifications"
              >
                <Bell className="w-5 h-5" />
                {unreadCount > 0 && (
                  <span className="absolute top-1 right-1 w-4 h-4 bg-nature-tomato text-white text-[10px] font-bold rounded-full flex items-center justify-center animate-pulse">
                    {unreadCount}
                  </span>
                )}
              </button>

              {notifMenuOpen && (
                <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-nature-card rounded-basket shadow-nature-lg border border-nature-soft/40 p-3.5 z-50 animate-in fade-in zoom-in-95">
                  <div className="flex items-center justify-between pb-2 border-b border-nature-soft/30">
                    <span className="font-bold text-sm text-nature-primary">Smart Supply Alerts</span>
                    <button
                      onClick={markAllAsRead}
                      className="text-xs text-nature-leaf font-semibold hover:underline cursor-pointer"
                    >
                      Mark all read
                    </button>
                  </div>
                  <div className="max-h-72 overflow-y-auto space-y-2 py-2">
                    {notifications.map((n) => (
                      <div
                        key={n.id}
                        className={`p-2.5 rounded-xl border text-xs transition ${
                          n.read ? 'bg-nature-bgSoft/60 border-nature-soft/30' : 'bg-nature-pale/80 border-nature-soft'
                        }`}
                      >
                        <div className="font-semibold text-nature-primary flex items-center justify-between">
                          <span>{n.title}</span>
                          <span className="text-[10px] text-nature-earth">{n.time}</span>
                        </div>
                        <p className="text-nature-text/80 mt-1">{n.message}</p>
                      </div>
                    ))}
                  </div>
                  <Link
                    to="/notifications"
                    onClick={() => setNotifMenuOpen(false)}
                    className="block text-center py-2 text-xs font-bold text-nature-primary hover:bg-nature-pale rounded-xl mt-1"
                  >
                    View All Notifications &rarr;
                  </Link>
                </div>
              )}
            </div>

            {/* Produce Basket Button */}
            <button
              onClick={() => setIsDrawerOpen(true)}
              className="flex items-center gap-2 bg-nature-pale/90 hover:bg-nature-pale border border-nature-soft/60 text-nature-primary px-3.5 py-2 rounded-2xl text-xs sm:text-sm font-bold transition shadow-nature-sm cursor-pointer"
              title="View Fresh Basket"
            >
              <div className="relative">
                <ShoppingBag className="w-4 h-4 text-nature-leaf" />
                {totalItemsCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-nature-tomato text-white text-[9px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
                    {totalItemsCount}
                  </span>
                )}
              </div>
              <span>₹{total}</span>
            </button>

            {/* Dashboard CTA */}
            {currentUser ? (
              <Link
                to="/dashboard"
                className="flex items-center gap-2 bg-nature-primary text-white hover:bg-nature-hover px-4 py-2 rounded-2xl text-xs sm:text-sm font-bold shadow-nature transition cursor-pointer"
              >
                <User className="w-4 h-4" />
                <span className="hidden sm:inline">Dashboard</span>
              </Link>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className="text-xs sm:text-sm font-bold text-nature-primary hover:text-nature-leaf px-3 py-2"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="bg-nature-primary hover:bg-nature-hover text-white px-4 py-2 rounded-2xl text-xs sm:text-sm font-bold shadow-nature transition"
                >
                  Register
                </Link>
              </div>
            )}

            {/* Mobile Hamburger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 text-nature-primary rounded-xl cursor-pointer"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-nature-soft/40 bg-nature-card px-4 pt-2 pb-6 space-y-2">
          <Link
            to="/marketplace"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3.5 py-2.5 rounded-xl text-sm font-bold text-nature-primary hover:bg-nature-pale"
          >
            🥦 Unified Marketplace
          </Link>
          <Link
            to="/buyer-requirements"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3.5 py-2 rounded-xl text-xs font-semibold text-nature-text hover:bg-nature-bgSoft"
          >
            Buyers Marketplace & Reverse Bids
          </Link>
          <Link
            to="/supply-map"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3.5 py-2 rounded-xl text-xs font-semibold text-nature-text hover:bg-nature-bgSoft"
          >
            Live Supply Heat Map
          </Link>
          <Link
            to="/ai-insights"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3.5 py-2 rounded-xl text-xs font-semibold text-nature-text hover:bg-nature-bgSoft"
          >
            AI Insights & Quality Grading
          </Link>
          <Link
            to="/produce-passport"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3.5 py-2 rounded-xl text-xs font-semibold text-nature-text hover:bg-nature-bgSoft"
          >
            Digital Produce Passport
          </Link>
          <Link
            to="/how-it-works"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3.5 py-2 rounded-xl text-xs font-semibold text-nature-text hover:bg-nature-bgSoft"
          >
            How It Works
          </Link>
          <Link
            to="/support"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3.5 py-2 rounded-xl text-xs font-semibold text-nature-text hover:bg-nature-bgSoft"
          >
            Support & Grievances
          </Link>
        </div>
      )}
    </header>
  );
}

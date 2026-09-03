import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  ShoppingBag,
  Package,
  Layers,
  Truck,
  Sparkles,
  QrCode,
  Bell,
  User,
  Users,
  ShieldCheck,
  LifeBuoy,
  LogOut,
  Sliders
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function Sidebar() {
  const location = useLocation();
  const { role, logout, currentUser, switchRolePersona, availablePersonas } = useAuth();

  const isActive = (path) => location.pathname === path;

  // Nav links customized strictly per role
  const getNavLinks = () => {
    const common = [
      { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
      { name: 'Marketplace', path: '/marketplace', icon: ShoppingBag },
      { name: 'Orders', path: '/orders', icon: Package }
    ];

    if (role === 'FPO') {
      return [
        ...common,
        { name: 'Warehouse & Stock', path: '/inventory', icon: Layers },
        { name: 'Produce Passports', path: '/produce-passport', icon: QrCode },
        { name: 'AI Insights', path: '/ai-insights', icon: Sparkles },
        { name: 'Notifications', path: '/notifications', icon: Bell },
        { name: 'FPO Profile', path: '/profile', icon: User }
      ];
    } else if (role === 'Bulk Buyer') {
      return [
        ...common,
        { name: 'Buyer Demands (RFP)', path: '/buyer-requirements', icon: Layers },
        { name: 'Produce Passports', path: '/produce-passport', icon: QrCode },
        { name: 'Supply Heat Map', path: '/supply-map', icon: Sparkles },
        { name: 'Notifications', path: '/notifications', icon: Bell },
        { name: 'Company Profile', path: '/profile', icon: User }
      ];
    } else if (role === 'Logistics Partner') {
      return [
        ...common,
        { name: 'Logistics Fleet', path: '/logistics', icon: Truck },
        { name: 'Route & Heat Map', path: '/supply-map', icon: Sparkles },
        { name: 'Proof of Delivery (PoD)', path: '/logistics', icon: ShieldCheck },
        { name: 'Notifications', path: '/notifications', icon: Bell },
        { name: 'Fleet Profile', path: '/profile', icon: User }
      ];
    } else if (role === 'Admin') {
      return [
        ...common,
        { name: 'Warehouse Inventory', path: '/inventory', icon: Layers },
        { name: 'AI & Waste Radar', path: '/ai-insights', icon: Sparkles },
        { name: 'Supply Heat Map', path: '/supply-map', icon: Sparkles },
        { name: 'Logistics Corridors', path: '/logistics', icon: Truck },
        { name: 'Support Tickets', path: '/support', icon: LifeBuoy },
        { name: 'System Settings', path: '/profile', icon: User }
      ];
    }

    // Consumer default
    return [
      ...common,
      { name: 'Produce Passports', path: '/produce-passport', icon: QrCode },
      { name: 'Supply Map', path: '/supply-map', icon: Sparkles },
      { name: 'Support Desk', path: '/support', icon: LifeBuoy },
      { name: 'Notifications', path: '/notifications', icon: Bell },
      { name: 'My Profile', path: '/profile', icon: User }
    ];
  };

  const navLinks = getNavLinks();

  return (
    <aside className="w-64 bg-white border-r border-gray-200 hidden md:flex flex-col justify-between shrink-0 min-h-[calc(100vh-4rem)] p-4">
      <div className="space-y-6">
        {/* User Card */}
        <div className="p-3 bg-agri-soft/80 border border-agri-bright/20 rounded-2xl flex items-center gap-3">
          <img
            src={currentUser?.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80"}
            alt={currentUser?.name}
            className="w-10 h-10 rounded-xl object-cover border border-agri-bright/40"
          />
          <div className="min-w-0">
            <h4 className="font-bold text-xs text-gray-900 truncate">
              {currentUser?.name?.split('(')[0] || 'Agricultural Partner'}
            </h4>
            <span className="text-[10px] font-bold text-agri-deep bg-agri-pale px-2 py-0.5 rounded-full inline-block mt-0.5">
              {role}
            </span>
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="space-y-1">
          {navLinks.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.path);
            return (
              <Link
                key={item.name}
                to={item.path}
                className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition ${
                  active
                    ? 'bg-agri-deep text-white shadow-sm'
                    : 'text-gray-600 hover:text-agri-dark hover:bg-agri-soft'
                }`}
              >
                <Icon className={`w-4 h-4 ${active ? 'text-white' : 'text-gray-400'}`} />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Footer / Switcher in Sidebar */}
      <div className="pt-4 border-t border-gray-100 space-y-2">
        <div className="text-[10px] text-gray-400 uppercase font-bold px-2">Demo Role Evaluator</div>
        <select
          value={role}
          onChange={(e) => switchRolePersona(e.target.value)}
          className="w-full text-xs font-semibold bg-gray-50 border border-gray-200 rounded-xl p-2 text-gray-700 cursor-pointer focus:ring-2 focus:ring-agri-deep"
        >
          {availablePersonas.map((p) => (
            <option key={p.id} value={p.role}>
              Switch to: {p.role}
            </option>
          ))}
        </select>

        <button
          onClick={logout}
          className="w-full flex items-center gap-2 px-3 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50 rounded-xl transition cursor-pointer"
        >
          <LogOut className="w-4 h-4" />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
}

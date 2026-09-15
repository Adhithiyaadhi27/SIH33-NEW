import HeroSection from '../components/hero/HeroSection';
import Marketplace from '../components/marketplace/Marketplace';
import { FadeIn } from '../components/ui/primitives';
import { useAuthStore } from '../store/authStore';
import { useNavigate } from 'react-router-dom';
import { LayoutDashboard, Search, ShoppingCart, Truck, Package, ClipboardList, BarChart3 } from 'lucide-react';

export default function Home() {
  const user = useAuthStore((s) => s.user);
  const navigate = useNavigate();

  const ROLE_ROUTES = { ADMIN: '/admin', FARMER: '/farmer', CONSUMER: '/consumer' } as const;
  const role = (user?.role as keyof typeof ROLE_ROUTES) ?? null;
  const dashboardRoute = role ? ROLE_ROUTES[role] : '/';

  const quickActions = [
    { icon: Search, label: 'Browse Products', action: () => navigate('/marketplace') },
    ...(role === 'CONSUMER'
      ? [
          { icon: ShoppingCart, label: 'My Cart', action: () => navigate('/cart') },
          { icon: Truck, label: 'Track Orders', action: () => navigate('/tracking') },
        ]
      : []),
    ...(role === 'FARMER'
      ? [
          { icon: Package, label: 'My Products', action: () => navigate('/farmer?section=products') },
          { icon: ClipboardList, label: 'Orders', action: () => navigate('/farmer?section=orders') },
        ]
      : []),
    ...(role === 'ADMIN'
      ? [
          { icon: BarChart3, label: 'Analytics', action: () => navigate('/admin/analytics') },
          { icon: ClipboardList, label: 'Orders', action: () => navigate('/admin?tab=orders') },
        ]
      : []),
    { icon: LayoutDashboard, label: 'Dashboard', action: () => navigate(dashboardRoute) },
  ];

  return (
    <div className="bg-agri-forest min-h-screen">
      <HeroSection />

      <main id="dashboard" className="relative mt-2 lg:mt-4 max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 pb-8 space-y-5">
        {/* Quick Access for logged-in users */}
        {user && (
          <FadeIn>
            <div className="glass-panel p-5 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="font-display font-extrabold text-lg text-text-primary">
                    Welcome, {user.name}!
                  </h2>
                  <p className="text-xs text-text-muted">{user.role} Portal</p>
                </div>
                <button
                  onClick={() => navigate(dashboardRoute)}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-soil-gold to-soil-goldSoft text-soil-base text-xs font-bold hover:brightness-110 transition cursor-pointer"
                >
                  <LayoutDashboard className="w-4 h-4" /> Go to Dashboard
                </button>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {quickActions.map((item) => {
                  const Icon = item.icon;
                  return (
                    <button
                      key={item.label}
                      onClick={item.action}
                      className="glass-panel-sm p-3 flex flex-col items-center gap-2 text-center hover:border-soil-gold/40 transition cursor-pointer"
                    >
                      <Icon className="w-5 h-5 text-soil-gold" />
                      <span className="text-xs font-semibold text-text-primary">{item.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </FadeIn>
        )}

        {/* Marketplace Section */}
        <FadeIn delay={0.1}>
          <div id="marketplace" className="w-full">
            <Marketplace />
          </div>
        </FadeIn>
      </main>
    </div>
  );
}

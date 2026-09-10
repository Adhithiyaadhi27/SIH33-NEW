import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ToastContainer from './components/notifications/Toast';
import { useI18nInit } from './services/useTranslation';

// Pages
import Home from './pages/Home';

const MarketplacePage = lazy(() => import('./pages/MarketplacePage'));
const CartPage = lazy(() => import('./pages/CartPage'));
const WishlistPage = lazy(() => import('./pages/WishlistPage'));
const NegotiationsPage = lazy(() => import('./pages/NegotiationsPage'));
const OrderTrackingPage = lazy(() => import('./pages/TrackingPage'));
const SubscriptionPage = lazy(() => import('./pages/SubscriptionPage'));
const GovSchemesPage = lazy(() => import('./pages/GovSchemesPage'));
const FarmInventoryPage = lazy(() => import('./pages/FarmInventoryPage'));
const RevenueAnalyticsPage = lazy(() => import('./pages/RevenueAnalyticsPage'));
const DisputePage = lazy(() => import('./pages/DisputePage'));
const RegistrationPage = lazy(() => import('./pages/RegistrationPage'));
const AnalyticsPage = lazy(() => import('./pages/AnalyticsPage'));
const SettingsPage = lazy(() => import('./pages/SettingsPage'));
const { FarmerPage, GenericRolePage } = { FarmerPage: lazy(() => import('./pages/RolePages').then((m) => ({ default: m.FarmerPage }))), GenericRolePage: lazy(() => import('./pages/RolePages').then((m) => ({ default: m.GenericRolePage }))) };
const LogisticsPage = lazy(() => import('./pages/LogisticsPage'));

const queryClient = new QueryClient();

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouterWrapper />
    </QueryClientProvider>
  );
}

function Loader() {
  return (
    <div className="flex items-center justify-center min-h-[40vh]">
      <div className="w-10 h-10 rounded-2xl border-2 border-white/10 border-t-soil-gold animate-spin" />
    </div>
  );
}

function BrowserRouterWrapper() {
  useI18nInit();
  return (
    <Router>
      <div className="min-h-screen flex flex-col font-sans">
        <Navbar />
        <ToastContainer />

        <main className="flex-1">
          <Suspense fallback={<Loader />}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/marketplace" element={<MarketplacePage />} />
              <Route path="/cart" element={<CartPage />} />
              <Route path="/wishlist" element={<WishlistPage />} />
              <Route path="/negotiations" element={<NegotiationsPage />} />
              <Route path="/tracking" element={<OrderTrackingPage />} />
              <Route path="/subscriptions" element={<SubscriptionPage />} />
              <Route path="/schemes" element={<GovSchemesPage />} />
              <Route path="/inventory" element={<FarmInventoryPage />} />
              <Route path="/revenue" element={<RevenueAnalyticsPage />} />
              <Route path="/disputes" element={<DisputePage />} />
              <Route path="/registration" element={<RegistrationPage />} />
              <Route path="/analytics" element={<AnalyticsPage />} />
              <Route path="/settings" element={<SettingsPage />} />
              <Route path="/farmer" element={<FarmerPage />} />
              <Route path="/fpo" element={<GenericRolePage role="FPO" tagline="Farmer aggregation, batch pooling, inventory & demand" />} />
              <Route path="/consumer" element={<GenericRolePage role="Consumer" tagline="Marketplace discovery, cart, orders & delivery tracking" />} />
              <Route path="/bulk-buyer" element={<GenericRolePage role="Bulk Buyer" tagline="Bulk marketplace, RFPs, supplier comparison & contracts" />} />
              <Route path="/logistics" element={<LogisticsPage />} />
              <Route path="/admin" element={<GenericRolePage role="Admin" tagline="User management, verification, analytics & settings" />} />
              <Route path="/orders" element={<GenericRolePage role="Consumer" tagline="Your live produce orders" />} />

              {/* Fallback */}
              <Route path="*" element={<Home />} />
            </Routes>
          </Suspense>
        </main>

        <Footer />
      </div>
    </Router>
  );
}

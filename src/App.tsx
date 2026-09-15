import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ToastContainer from './components/notifications/Toast';
import ErrorBoundary from './components/ErrorBoundary';
import { useI18nInit } from './services/useTranslation';
import ProtectedRoute, { AccessDenied } from './components/auth/ProtectedRoute';
import { useAuthStore } from './store/authStore';

import Home from './pages/Home';

const MarketplacePage = lazy(() => import('./pages/MarketplacePage'));
const CartPage = lazy(() => import('./pages/CartPage'));
const OrderTrackingPage = lazy(() => import('./pages/TrackingPage'));
const NotificationsPage = lazy(() => import('./pages/NotificationsPage'));
const OrderHistoryPage = lazy(() => import('./pages/OrderHistoryPage'));

const FarmerDashboard = lazy(() => import('./components/roles/FarmerDashboard'));
const ConsumerDashboard = lazy(() => import('./components/roles/ConsumerDashboard'));
const AdminDashboard = lazy(() => import('./components/roles/AdminDashboard'));
const AnalyticsPage = lazy(() => import('./pages/AnalyticsPage'));
const RevenueAnalyticsPage = lazy(() => import('./pages/RevenueAnalyticsPage'));

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

function RoleRedirect() {
  const user = useAuthStore((s) => s.user);
  if (!user) return <Home />;
  const route = user.role === 'ADMIN' ? '/admin' : user.role === 'FARMER' ? '/farmer' : '/consumer';
  return <Navigate to={route} replace />;
}

function BrowserRouterWrapper() {
  useI18nInit();
  return (
    <Router>
      <ErrorBoundary>
        <div className="min-h-screen flex flex-col bg-soil-base font-sans">
          <Navbar />
          <ToastContainer />

          <main className="flex-1">
            <Suspense fallback={<Loader />}>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/access-denied" element={<AccessDenied />} />

                {/* Public routes */}
                <Route path="/marketplace" element={<MarketplacePage />} />

                {/* Consumer routes */}
                <Route path="/consumer" element={<ProtectedRoute allowedRoles={['CONSUMER']}><ConsumerDashboard /></ProtectedRoute>} />
                <Route path="/cart" element={<ProtectedRoute allowedRoles={['CONSUMER']}><CartPage /></ProtectedRoute>} />
                <Route path="/orders" element={<ProtectedRoute allowedRoles={['CONSUMER']}><OrderHistoryPage /></ProtectedRoute>} />
                <Route path="/tracking" element={<ProtectedRoute allowedRoles={['CONSUMER', 'ADMIN']}><OrderTrackingPage /></ProtectedRoute>} />
                <Route path="/notifications" element={<ProtectedRoute><NotificationsPage /></ProtectedRoute>} />

                {/* Farmer routes */}
                <Route path="/farmer" element={<ProtectedRoute allowedRoles={['FARMER']}><FarmerDashboard /></ProtectedRoute>} />

                {/* Admin routes */}
                <Route path="/admin" element={<ProtectedRoute allowedRoles={['ADMIN']}><AdminDashboard /></ProtectedRoute>} />
                <Route path="/admin/analytics" element={<ProtectedRoute allowedRoles={['ADMIN']}><AnalyticsPage /></ProtectedRoute>} />
                <Route path="/admin/revenue-analytics" element={<ProtectedRoute allowedRoles={['ADMIN']}><RevenueAnalyticsPage /></ProtectedRoute>} />

                {/* Role-based redirect from legacy routes */}
                <Route path="/fpo" element={<Navigate to="/farmer" replace />} />
                <Route path="/bulk-buyer" element={<Navigate to="/admin" replace />} />
                <Route path="/logistics" element={<Navigate to="/admin" replace />} />

                {/* Fallback */}
                <Route path="*" element={<RoleRedirect />} />
              </Routes>
            </Suspense>
          </main>

          <Footer />
        </div>
      </ErrorBoundary>
    </Router>
  );
}

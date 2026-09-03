import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { NotificationProvider } from './context/NotificationContext';

import Navbar from './components/Navbar';
import Footer from './components/Footer';
import CartDrawer from './components/CartDrawer';

// Public Pages
import Home from './pages/Home';
import Marketplace from './pages/Marketplace';
import BuyerRequirements from './pages/BuyerRequirements';
import SupplyMapPage from './pages/SupplyMapPage';
import About from './pages/About';
import HowItWorks from './pages/HowItWorks';
import SupportPage from './pages/SupportPage';

// Auth Pages
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import VerifyEmail from './pages/auth/VerifyEmail';
import PasswordReset from './pages/auth/PasswordReset';

// Authenticated Pages
import Dashboard from './pages/dashboard/Dashboard';
import OrdersPage from './pages/OrdersPage';
import InventoryPage from './pages/InventoryPage';
import AIInsightsPage from './pages/AIInsightsPage';
import LogisticsPage from './pages/LogisticsPage';
import ProducePassportPage from './pages/ProducePassportPage';
import NotificationsPage from './pages/NotificationsPage';
import ProfilePage from './pages/ProfilePage';

// System Pages
import NotFound from './pages/system/NotFound';
import PaymentFailed from './pages/system/PaymentFailed';
import RefundPage from './pages/system/RefundPage';
import AccessDenied from './pages/system/AccessDenied';
import Maintenance from './pages/system/Maintenance';

// Protected Route Guard
function ProtectedRoute({ children, allowedRoles }) {
  const { currentUser, role } = useAuth();

  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(role)) {
    return <Navigate to="/access-denied" replace />;
  }

  return children;
}

export default function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <NotificationProvider>
          <Router>
            <div className="min-h-screen flex flex-col bg-[#F8FAF5] font-sans selection:bg-agri-bright selection:text-white">
              {/* Main Navigation Bar */}
              <Navbar />

              {/* Slide-over Produce Cart Drawer */}
              <CartDrawer />

              {/* Main Page Content */}
              <main className="flex-1">
                <Routes>
                  {/* Public Pages */}
                  <Route path="/" element={<Home />} />
                  <Route path="/marketplace" element={<Marketplace />} />
                  <Route path="/products" element={<Marketplace />} />
                  <Route path="/buyer-requirements" element={<BuyerRequirements />} />
                  <Route path="/supply-map" element={<SupplyMapPage />} />
                  <Route path="/about" element={<About />} />
                  <Route path="/how-it-works" element={<HowItWorks />} />
                  <Route path="/support" element={<SupportPage />} />

                  {/* Auth Pages */}
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register />} />
                  <Route path="/verify-email" element={<VerifyEmail />} />
                  <Route path="/password-reset" element={<PasswordReset />} />
                  <Route path="/forgot-password" element={<PasswordReset />} />

                  {/* Authenticated Routes */}
                  <Route
                    path="/dashboard"
                    element={
                      <ProtectedRoute>
                        <Dashboard />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/orders"
                    element={
                      <ProtectedRoute>
                        <OrdersPage />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/inventory"
                    element={
                      <ProtectedRoute allowedRoles={['FPO', 'Admin', 'Bulk Buyer']}>
                        <InventoryPage />
                      </ProtectedRoute>
                    }
                  />
                  <Route path="/ai-insights" element={<AIInsightsPage />} />
                  <Route
                    path="/logistics"
                    element={
                      <ProtectedRoute allowedRoles={['Logistics Partner', 'Admin', 'FPO']}>
                        <LogisticsPage />
                      </ProtectedRoute>
                    }
                  />
                  <Route path="/produce-passport" element={<ProducePassportPage />} />
                  <Route path="/produce-passport/:batchId" element={<ProducePassportPage />} />
                  <Route
                    path="/notifications"
                    element={
                      <ProtectedRoute>
                        <NotificationsPage />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/profile"
                    element={
                      <ProtectedRoute>
                        <ProfilePage />
                      </ProtectedRoute>
                    }
                  />

                  {/* System & Error Pages */}
                  <Route path="/404" element={<NotFound />} />
                  <Route path="/payment-failed" element={<PaymentFailed />} />
                  <Route path="/refund" element={<RefundPage />} />
                  <Route path="/access-denied" element={<AccessDenied />} />
                  <Route path="/maintenance" element={<Maintenance />} />

                  {/* Wildcard 404 Catch-All */}
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </main>

              {/* Site Footer */}
              <Footer />
            </div>
          </Router>
        </NotificationProvider>
      </CartProvider>
    </AuthProvider>
  );
}

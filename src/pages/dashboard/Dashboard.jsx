import React from 'react';
import { useAuth } from '../../context/AuthContext';
import Sidebar from './Sidebar';
import FPODashboard from './FPODashboard';
import ConsumerDashboard from './ConsumerDashboard';
import BulkBuyerDashboard from './BulkBuyerDashboard';
import LogisticsDashboard from './LogisticsDashboard';
import AdminDashboard from './AdminDashboard';

export default function Dashboard() {
  const { role } = useAuth();

  // Render role-specific dashboard strictly
  const renderDashboardView = () => {
    switch (role) {
      case 'FPO':
        return <FPODashboard />;
      case 'Bulk Buyer':
        return <BulkBuyerDashboard />;
      case 'Logistics Partner':
        return <LogisticsDashboard />;
      case 'Admin':
        return <AdminDashboard />;
      case 'Consumer':
      default:
        return <ConsumerDashboard />;
    }
  };

  return (
    <div className="flex min-h-[calc(100vh-4rem)] bg-[#F8FAF5]">
      {/* Role-tailored Desktop Sidebar */}
      <Sidebar />

      {/* Main Authenticated Content Area */}
      <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto overflow-x-hidden">
        {renderDashboardView()}
      </main>
    </div>
  );
}

import React from 'react';
import { ShoppingBag, Package, Truck, QrCode, Clock, ArrowRight, Heart } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { INITIAL_ORDERS } from '../../services/mockData';

export default function ConsumerDashboard() {
  const { currentUser } = useAuth();
  const orders = INITIAL_ORDERS;

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-agri-dark to-agri-leaf text-white p-6 rounded-3xl shadow-lg flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold text-agri-mint uppercase tracking-wider">
            Consumer Household Pantry
          </span>
          <h1 className="font-display font-bold text-2xl mt-1">
            Welcome back, {currentUser?.name || 'Priya'}!
          </h1>
          <p className="text-xs text-agri-pale mt-0.5">
            Your fresh farm harvests delivered in 45 mins with 100% Produce Passport verification.
          </p>
        </div>

        <Link
          to="/marketplace"
          className="bg-white text-agri-dark hover:bg-agri-pale font-bold px-4 py-2.5 rounded-xl text-xs transition shadow flex items-center gap-1.5 self-start sm:self-auto"
        >
          <ShoppingBag className="w-4 h-4 text-agri-deep" />
          <span>Shop Fresh Catalog</span>
        </Link>
      </div>

      {/* Active Order Live Tracker Card */}
      {orders.length > 0 && (
        <div className="bg-white rounded-3xl border border-gray-200 p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-gray-100">
            <div>
              <span className="text-[10px] font-mono font-bold bg-agri-pale text-agri-dark px-2 py-0.5 rounded">
                Active Order: {orders[0].id}
              </span>
              <h3 className="font-bold text-base text-gray-900 mt-1">
                Farm Dispatch en route to Anna Nagar, Chennai
              </h3>
            </div>
            <span className="text-xs font-bold text-emerald-800 bg-emerald-100 px-3 py-1 rounded-full animate-pulse">
              {orders[0].orderStatus}
            </span>
          </div>

          {/* Delivery Timeline Progress */}
          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs text-gray-500">
              <span>Carrier: {orders[0].logisticsPartner}</span>
              <span>Estimated Delivery: {orders[0].estimatedDelivery}</span>
            </div>

            <div className="grid grid-cols-4 gap-2 text-center text-xs pt-1">
              {['Confirmed', 'Packed at FPO', 'In Cold Transit', 'Delivered'].map((step, i) => (
                <div key={step} className="space-y-1">
                  <div className={`h-2 rounded-full ${i <= 2 ? 'bg-agri-deep' : 'bg-gray-200'}`} />
                  <span className={`text-[10px] font-semibold ${i <= 2 ? 'text-agri-dark font-bold' : 'text-gray-400'}`}>
                    {step}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-2 flex items-center justify-between text-xs">
            <Link to="/orders" className="text-agri-deep font-bold hover:underline">
              View Detailed Timeline & Digital Invoice &rarr;
            </Link>
            <Link
              to="/produce-passport"
              className="bg-gray-50 hover:bg-agri-pale text-gray-700 font-bold px-3 py-1.5 rounded-xl border border-gray-200 flex items-center gap-1"
            >
              <QrCode className="w-3.5 h-3.5 text-agri-leaf" />
              <span>Verify Batch Passport</span>
            </Link>
          </div>
        </div>
      )}

      {/* Quick Re-Order Favorites */}
      <div className="space-y-3">
        <h3 className="font-display font-bold text-base text-gray-900">
          Seasonal Favorites From Your Verified FPOs
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { name: "Country Tomato", price: "₹25/kg", grade: "Grade A", origin: "Madurai FPO", img: "https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&w=400&q=80" },
            { name: "Ooty Potato", price: "₹30/kg", grade: "Grade A", origin: "Nilgiris FPO", img: "https://images.unsplash.com/photo-1518977676601-b53f82aba655?auto=format&fit=crop&w=400&q=80" },
            { name: "Kinnaur Apples", price: "₹145/kg", grade: "Grade A", origin: "Himachal FPO", img: "https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?auto=format&fit=crop&w=400&q=80" }
          ].map((item, idx) => (
            <div key={idx} className="bg-white rounded-2xl border border-gray-200 p-3 flex items-center gap-3 shadow-sm hover:shadow-md transition">
              <img src={item.img} alt={item.name} className="w-16 h-16 rounded-xl object-cover" />
              <div className="flex-1 min-w-0 text-xs">
                <div className="font-bold text-gray-900 truncate">{item.name}</div>
                <div className="text-gray-500">{item.origin}</div>
                <div className="font-bold text-agri-deep mt-1">{item.price} &bull; <span className="text-agri-leaf">{item.grade}</span></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

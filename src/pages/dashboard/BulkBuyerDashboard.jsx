import React from 'react';
import { Layers, Truck, DollarSign, ShieldCheck, Plus, Sparkles, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import SmartAggregationWidget from '../../components/SmartAggregationWidget';

export default function BulkBuyerDashboard() {
  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="bg-gradient-to-r from-agri-dark via-amber-950 to-agri-earth text-white p-6 rounded-3xl shadow-lg flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold text-agri-cream uppercase tracking-wider">
            Commercial Bulk Procurement Portal
          </span>
          <h1 className="font-display font-bold text-2xl mt-1">
            Evergreen Supermarkets Pvt Ltd
          </h1>
          <p className="text-xs text-agri-cream/80 mt-0.5">
            Procuring 25+ metric tonnes monthly across Tamil Nadu, Karnataka & Maharashtra corridors.
          </p>
        </div>

        <Link
          to="/buyer-requirements"
          className="bg-white text-agri-dark hover:bg-agri-soft font-bold px-4 py-2.5 rounded-xl text-xs transition shadow flex items-center gap-1.5 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4 text-agri-earth" />
          <span>Post New RFP</span>
        </Link>
      </div>

      {/* Procurement Metrics */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
          <span className="text-xs text-gray-500 block">Active Contracts</span>
          <strong className="text-2xl font-display text-agri-dark">3 Orders</strong>
          <span className="text-[10px] text-emerald-600 block mt-0.5">100% Escrow Protected</span>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
          <span className="text-xs text-gray-500 block">Monthly Inflow</span>
          <strong className="text-2xl font-display text-agri-deep">18,500 kg</strong>
          <span className="text-[10px] text-agri-leaf block mt-0.5">Consolidated from 4 FPOs</span>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
          <span className="text-xs text-gray-500 block">Procurement Savings</span>
          <strong className="text-2xl font-display text-agri-earth">₹42,800</strong>
          <span className="text-[10px] text-amber-700 block mt-0.5">vs Traditional APMC Mandi</span>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
          <span className="text-xs text-gray-500 block">Average Quality Grade</span>
          <strong className="text-2xl font-display text-emerald-700">95.2% A</strong>
          <span className="text-[10px] text-gray-400 block mt-0.5">Verified by Computer Vision</span>
        </div>
      </div>

      {/* Multi-Supplier Smart Aggregation Interactive Module */}
      <SmartAggregationWidget requirement={{ product: "Nashik Red Onion", quantity: 5000 }} />
    </div>
  );
}

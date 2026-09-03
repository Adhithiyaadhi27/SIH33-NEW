import React, { useState } from 'react';
import {
  Users,
  Layers,
  Sprout,
  TrendingUp,
  AlertTriangle,
  QrCode,
  ShieldCheck,
  Plus,
  ArrowRight,
  Sparkles
} from 'lucide-react';
import { Link } from 'react-router-dom';
import SmartAggregationWidget from '../../components/SmartAggregationWidget';

export default function FPODashboard() {
  const [activeTab, setActiveTab] = useState('farmers'); // 'farmers', 'inventory', 'aggregation'

  const memberFarmers = [
    { name: "M. Murugesan", plot: "Alanganallur Plot 4B", crop: "Heritage Tomato", acreage: "2.4 Acres", soil: "Red Loamy", lastYield: "800 kg", status: "Active" },
    { name: "S. Chelladurai", plot: "Vadipatti Plot 12C", crop: "Heritage Tomato", acreage: "3.1 Acres", soil: "Alluvial", lastYield: "700 kg", status: "Active" },
    { name: "P. Kalyani", plot: "Usilampatti Plot 3A", crop: "Heritage Tomato", acreage: "1.8 Acres", soil: "Red Loamy", lastYield: "500 kg", status: "Active" },
    { name: "K. Chinnasamy", plot: "Melur Plot 7F", crop: "Desi Ladyfinger", acreage: "2.0 Acres", soil: "Black Clay", lastYield: "450 kg", status: "Harvesting" }
  ];

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-agri-dark to-agri-deep text-white p-6 rounded-3xl shadow-lg flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold text-agri-mint uppercase tracking-wider">
            FPO Supply-Side Governance Center
          </span>
          <h1 className="font-display font-bold text-2xl mt-1">
            Madurai GreenValley Farmers Producer Co-op
          </h1>
          <p className="text-xs text-agri-pale mt-0.5">
            Managing 340 smallholder farmers across Madurai, Dindigul & Theni belts.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            to="/produce-passport"
            className="bg-white/20 hover:bg-white/30 text-white px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5"
          >
            <QrCode className="w-4 h-4 text-agri-harvest" />
            <span>Generate Passport</span>
          </Link>
          <Link
            to="/marketplace"
            className="bg-agri-leaf hover:bg-agri-mint text-white px-4 py-2 rounded-xl text-xs font-bold shadow transition"
          >
            Catalog View
          </Link>
        </div>
      </div>

      {/* KPI Stats Strip */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
          <span className="text-xs text-gray-500 block">Registered Farmers</span>
          <strong className="text-2xl font-display text-agri-dark">340</strong>
          <span className="text-[10px] text-emerald-600 block mt-0.5">100% Land GPS Mapped</span>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
          <span className="text-xs text-gray-500 block">Aggregated Warehouse Stock</span>
          <strong className="text-2xl font-display text-agri-deep">14,200 kg</strong>
          <span className="text-[10px] text-agri-leaf block mt-0.5">Stored at 12.4°C Hub</span>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
          <span className="text-xs text-gray-500 block">Active Commercial RFPs</span>
          <strong className="text-2xl font-display text-agri-earth">4 Bids</strong>
          <span className="text-[10px] text-amber-700 block mt-0.5">Average Margin: +24%</span>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
          <span className="text-xs text-gray-500 block">FPO Reliability Score</span>
          <strong className="text-2xl font-display text-emerald-700">94 / 100</strong>
          <span className="text-[10px] text-gray-400 block mt-0.5">Tier-1 Certified Co-op</span>
        </div>
      </div>

      {/* Tabs: Member Farmer Management & Aggregation Pool */}
      <div className="flex items-center gap-2 border-b border-gray-200 pb-2">
        <button
          onClick={() => setActiveTab('farmers')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
            activeTab === 'farmers'
              ? 'bg-agri-dark text-white'
              : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
          }`}
        >
          🌾 Member Farmers ({memberFarmers.length})
        </button>
        <button
          onClick={() => setActiveTab('aggregation')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
            activeTab === 'aggregation'
              ? 'bg-agri-dark text-white'
              : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
          }`}
        >
          🤝 Multi-Farmer Smart Aggregation
        </button>
      </div>

      {/* Farmer Member Management (PRD Section 6 & 28: No standalone farmer dashboard, managed under FPO) */}
      {activeTab === 'farmers' && (
        <div className="bg-white rounded-3xl border border-gray-200 p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-display font-bold text-base text-gray-900">
                Consolidated Farmer Member Register
              </h3>
              <p className="text-xs text-gray-500">
                Smallholder farmers managed directly by GreenValley FPO Co-op governance.
              </p>
            </div>
            <button
              onClick={() => alert("Farmer onboarding modal")}
              className="bg-agri-deep hover:bg-agri-dark text-white px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Enroll New Farmer</span>
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-gray-50 text-gray-500 uppercase text-[10px] font-bold">
                <tr>
                  <th className="p-3">Farmer Name</th>
                  <th className="p-3">Plot GPS & Land Record</th>
                  <th className="p-3">Primary Crop</th>
                  <th className="p-3">Soil Type</th>
                  <th className="p-3">Recent Batch Yield</th>
                  <th className="p-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-gray-700">
                {memberFarmers.map((farmer, i) => (
                  <tr key={i} className="hover:bg-agri-soft/40 transition">
                    <td className="p-3 font-bold text-gray-900">{farmer.name}</td>
                    <td className="p-3 font-mono text-[11px] text-gray-500">{farmer.plot} ({farmer.acreage})</td>
                    <td className="p-3 font-semibold text-agri-dark">{farmer.crop}</td>
                    <td className="p-3">{farmer.soil}</td>
                    <td className="p-3 font-bold text-agri-leaf">{farmer.lastYield}</td>
                    <td className="p-3">
                      <span className="bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full font-bold text-[10px]">
                        {farmer.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Smart Aggregation tab */}
      {activeTab === 'aggregation' && (
        <SmartAggregationWidget requirement={{ product: "Heritage Tomato", quantity: 5000 }} />
      )}
    </div>
  );
}

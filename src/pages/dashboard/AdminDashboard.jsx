import React, { useState } from 'react';
import {
  ShieldAlert,
  Users,
  Package,
  Layers,
  Sparkles,
  Activity,
  DollarSign,
  AlertTriangle,
  LifeBuoy,
  CheckCircle2,
  Lock
} from 'lucide-react';
import { USERS, INITIAL_PRODUCTS } from '../../services/mockData';

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('stakeholders'); // 'stakeholders', 'operations', 'escrow', 'anomalies'

  return (
    <div className="space-y-6">
      {/* Admin Header */}
      <div className="bg-gradient-to-r from-gray-950 via-slate-900 to-agri-dark text-white p-6 rounded-3xl shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 bg-rose-900/60 border border-rose-500/40 text-rose-300 text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full">
            <Lock className="w-3 h-3" /> Master Admin Platform Governance
          </div>
          <h1 className="font-display font-bold text-2xl">
            System Administration & Ecosystem Oversight
          </h1>
          <p className="text-xs text-gray-400">
            Governing FPO co-operatives, buyer escrows, AI waste radar, and dispute resolutions.
          </p>
        </div>

        <div className="bg-white/10 p-3 rounded-2xl text-xs text-center border border-white/15">
          <span className="text-agri-pale text-[11px] block">Total Platform GMV</span>
          <strong className="text-2xl text-white font-display">₹1.84 Cr</strong>
        </div>
      </div>

      {/* Admin KPI Ribbon */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-sm">
          <span className="text-xs text-gray-500 block">Verified FPOs</span>
          <strong className="text-2xl font-display text-gray-900">42 Clusters</strong>
          <span className="text-[10px] text-emerald-600 block mt-0.5">3,480 Farmers Linked</span>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-sm">
          <span className="text-xs text-gray-500 block">Commercial Bulk Buyers</span>
          <strong className="text-2xl font-display text-gray-900">128 Enterprises</strong>
          <span className="text-[10px] text-agri-leaf block mt-0.5">Supermarkets & Processors</span>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-sm">
          <span className="text-xs text-gray-500 block">Escrow Funds Locked</span>
          <strong className="text-2xl font-display text-agri-deep">₹24,80,000</strong>
          <span className="text-[10px] text-blue-600 block mt-0.5">Released on Digital PoD</span>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-sm">
          <span className="text-xs text-gray-500 block">Disputes Active</span>
          <strong className="text-2xl font-display text-rose-600">1 Case</strong>
          <span className="text-[10px] text-gray-400 block mt-0.5">Assigned to Madurai Auditor</span>
        </div>
      </div>

      {/* Admin Tabs */}
      <div className="flex items-center gap-2 border-b border-gray-200 pb-2">
        {[
          { id: 'stakeholders', label: '👥 Users & Stakeholders' },
          { id: 'operations', label: '🥦 Catalog & Batches' },
          { id: 'escrow', label: '💰 Payments & Escrow' },
          { id: 'anomalies', label: '⚠️ AI Anomaly Surveillance' }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
              activeTab === tab.id
                ? 'bg-gray-900 text-white shadow-sm'
                : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab 1: Stakeholders */}
      {activeTab === 'stakeholders' && (
        <div className="bg-white rounded-3xl border border-gray-200 p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-display font-bold text-base text-gray-900">
              Registered Stakeholders Matrix
            </h3>
            <span className="text-xs text-gray-400">Strict RBAC Authorization Active</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-gray-50 text-gray-500 uppercase text-[10px] font-bold">
                <tr>
                  <th className="p-3">User</th>
                  <th className="p-3">Role</th>
                  <th className="p-3">City / Hub</th>
                  <th className="p-3">Contact</th>
                  <th className="p-3">Auth Verification</th>
                  <th className="p-3">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-gray-700">
                {USERS.map((u) => (
                  <tr key={u.id} className="hover:bg-gray-50 transition">
                    <td className="p-3 font-bold text-gray-900">{u.name}</td>
                    <td className="p-3">
                      <span className="bg-agri-pale text-agri-dark px-2.5 py-0.5 rounded-full font-bold text-[10px]">
                        {u.role}
                      </span>
                    </td>
                    <td className="p-3">{u.city}, {u.state}</td>
                    <td className="p-3 font-mono text-[11px]">{u.phone}</td>
                    <td className="p-3">
                      <span className="text-emerald-700 font-semibold flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Verified
                      </span>
                    </td>
                    <td className="p-3">
                      <button
                        onClick={() => alert(`Reviewing credentials for ${u.name}`)}
                        className="text-agri-deep hover:underline font-semibold"
                      >
                        Inspect Audit Log
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 2: Catalog & Batches */}
      {activeTab === 'operations' && (
        <div className="bg-white rounded-3xl border border-gray-200 p-6 shadow-sm space-y-4">
          <h3 className="font-display font-bold text-base text-gray-900">
            Active Catalog Batches & Quality Passports
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-gray-50 text-gray-500 uppercase text-[10px] font-bold">
                <tr>
                  <th className="p-3">Batch ID</th>
                  <th className="p-3">Produce</th>
                  <th className="p-3">FPO Supplier</th>
                  <th className="p-3">Available Qty</th>
                  <th className="p-3">AI Grade</th>
                  <th className="p-3">Base Price</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-gray-700">
                {INITIAL_PRODUCTS.map((p) => (
                  <tr key={p.id} className="hover:bg-gray-50 transition">
                    <td className="p-3 font-mono font-bold text-agri-leaf">{p.batchId}</td>
                    <td className="p-3 font-bold text-gray-900">{p.name}</td>
                    <td className="p-3">{p.supplier}</td>
                    <td className="p-3 font-semibold">{p.availableQty} {p.unit}</td>
                    <td className="p-3">
                      <span className="bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded font-bold">
                        {p.grade}
                      </span>
                    </td>
                    <td className="p-3 font-bold text-agri-dark">₹{p.price}/{p.unit}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 3: Escrow */}
      {activeTab === 'escrow' && (
        <div className="bg-white rounded-3xl border border-gray-200 p-6 shadow-sm space-y-4">
          <h3 className="font-display font-bold text-base text-gray-900">
            Automated Agricultural Escrow Vault
          </h3>
          <p className="text-xs text-gray-500">
            Funds deposited by bulk buyers are locked securely and released only after digital Proof of Delivery and quality verification.
          </p>
          <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200 flex items-center justify-between text-xs">
            <div>
              <span className="font-bold text-emerald-900">Contract ORD-2026-5501 (Evergreen Mart & Sahyadri FPO)</span>
              <p className="text-emerald-700">Escrow Locked: ₹1,36,000 for 5,000 kg Nashik Red Onion</p>
            </div>
            <button
              onClick={() => alert("Manual administrative release triggered after PoD validation.")}
              className="bg-emerald-700 text-white font-bold px-3 py-1.5 rounded-xl hover:bg-emerald-800 transition cursor-pointer"
            >
              Authorize Release
            </button>
          </div>
        </div>
      )}

      {/* Tab 4: Anomalies */}
      {activeTab === 'anomalies' && (
        <div className="bg-white rounded-3xl border border-gray-200 p-6 shadow-sm space-y-4">
          <h3 className="font-display font-bold text-base text-gray-900">
            AI Operational Fraud & Weighbridge Anomaly Feeds
          </h3>
          <div className="p-4 bg-amber-50 rounded-2xl border border-amber-200 space-y-2 text-xs text-amber-950">
            <div className="flex items-center justify-between font-bold">
              <span>Depot 3 Intake Variance (Nashik)</span>
              <span className="bg-amber-200 px-2 py-0.5 rounded text-[10px]">Variance Warning</span>
            </div>
            <p>Reported weighbridge intake 14,200 kg vs. aggregate dispatch manifest 12,800 kg (+10.9% variance).</p>
            <span className="text-[10px] text-gray-500 block">Status: Under Investigation by Logistics Auditor</span>
          </div>
        </div>
      )}
    </div>
  );
}

import React, { useState } from 'react';
import { Layers, AlertTriangle, ShieldCheck, Sparkles, Filter, Plus } from 'lucide-react';
import { INITIAL_PRODUCTS } from '../services/mockData';

export default function InventoryPage() {
  const [products] = useState(INITIAL_PRODUCTS);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <div className="bg-gradient-to-r from-agri-dark to-agri-leaf text-white rounded-3xl p-6 sm:p-8 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display font-bold text-2xl sm:text-3xl">
            Warehouse & Aggregated Stock Inventory
          </h1>
          <p className="text-xs sm:text-sm text-agri-pale/90 mt-0.5">
            Cold storage holdings, shelf-life decay monitoring, and ready stock metrics
          </p>
        </div>
        <button
          onClick={() => alert("Add inventory batch modal")}
          className="bg-white text-agri-dark hover:bg-agri-pale font-bold px-4 py-2 rounded-xl text-xs transition shadow flex items-center gap-1.5 cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-4 h-4 text-agri-deep" />
          <span>Intake New Batch</span>
        </button>
      </div>

      {/* Inventory Table */}
      <div className="bg-white rounded-3xl border border-gray-200 p-6 shadow-sm space-y-4">
        <h3 className="font-display font-bold text-base text-gray-900">
          Current Live Stock Across Regional Packhouses
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-gray-50 text-gray-500 uppercase text-[10px] font-bold">
              <tr>
                <th className="p-3">Produce & Batch</th>
                <th className="p-3">Hub Location</th>
                <th className="p-3">Available Stock</th>
                <th className="p-3">Stock Age</th>
                <th className="p-3">Perishability Risk</th>
                <th className="p-3">Quality Grade</th>
                <th className="p-3">Base Price</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-gray-700">
              {products.map((p) => (
                <tr key={p.id} className="hover:bg-agri-soft/40 transition">
                  <td className="p-3">
                    <div className="font-bold text-gray-900">{p.name}</div>
                    <span className="font-mono text-[10px] text-agri-leaf">{p.batchId}</span>
                  </td>
                  <td className="p-3">{p.location}</td>
                  <td className="p-3 font-bold text-agri-deep">{p.availableQty.toLocaleString()} {p.unit}</td>
                  <td className="p-3">{p.stockAgeDays} days (Max {p.shelfLifeDays}d)</td>
                  <td className="p-3">
                    <span className={`px-2.5 py-0.5 rounded-full font-bold text-[10px] ${
                      p.wasteRisk === 'High' ? 'bg-rose-100 text-rose-800' : p.wasteRisk === 'Medium' ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-800'
                    }`}>
                      {p.wasteRisk} Risk
                    </span>
                  </td>
                  <td className="p-3">
                    <span className="bg-agri-pale text-agri-dark px-2 py-0.5 rounded font-bold">
                      {p.grade}
                    </span>
                  </td>
                  <td className="p-3 font-bold">₹{p.price}/{p.unit}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

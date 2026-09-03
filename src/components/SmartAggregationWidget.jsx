import React, { useState } from 'react';
import { Layers, CheckCircle2, ArrowRight, ShieldCheck, Sparkles, Scale, RefreshCw } from 'lucide-react';
import { api } from '../services/api';

export default function SmartAggregationWidget({ requirement, onComplete }) {
  const [targetQty, setTargetQty] = useState(requirement?.quantity || 5000);
  const [productName, setProductName] = useState(requirement?.product || 'Tomato');
  const [isMatching, setIsMatching] = useState(false);
  const [aggregationData, setAggregationData] = useState(() => ({
    targetQuantity: 5000,
    fulfilledQuantity: 5000,
    isFulfilled: true,
    suppliersCount: 3,
    averagePricePerKg: 24.40,
    aggregateReliability: 94.5,
    selectedSuppliers: [
      {
        supplierName: "Farmer M. Murugesan (Plot 4B)",
        type: "Farmer (under FPO)",
        location: "Alanganallur, Madurai",
        allocatedQuantity: 1000,
        pricePerKg: 24.50,
        reliabilityScore: 95,
        allocationRatio: 20
      },
      {
        supplierName: "Farmer S. Chelladurai (Plot 12C)",
        type: "Farmer (under FPO)",
        location: "Vadipatti, Madurai",
        allocatedQuantity: 1500,
        pricePerKg: 25.00,
        reliabilityScore: 92,
        allocationRatio: 30
      },
      {
        supplierName: "GreenValley FPO Central Warehouse",
        type: "FPO Co-op Hub",
        location: "Madurai Logistics Park",
        allocatedQuantity: 2500,
        pricePerKg: 24.00,
        reliabilityScore: 96,
        allocationRatio: 50
      }
    ]
  }));

  const handleRunAggregation = async (qty = targetQty) => {
    setIsMatching(true);
    try {
      const res = await api.matchAggregation({ quantity: qty, product: productName });
      setAggregationData(res.aggregation);
      if (onComplete) onComplete(res.aggregation);
    } catch (err) {
      console.error(err);
    } finally {
      setIsMatching(false);
    }
  };

  return (
    <div className="bg-white rounded-3xl border border-agri-bright/30 p-6 shadow-xl space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-gray-100">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-agri-leaf uppercase tracking-wider mb-1">
            <Sparkles className="w-4 h-4 text-agri-harvest" /> AI Multi-Supplier Smart Aggregation
          </div>
          <h3 className="font-display text-xl font-bold text-agri-dark">
            Autonomous Multi-Farmer Lot Combiner
          </h3>
          <p className="text-xs text-gray-500">
            Fulfills large commercial orders by intelligently consolidating smallholder farmers through FPO governance.
          </p>
        </div>

        {/* Input Target */}
        <div className="flex items-center gap-2 bg-agri-soft p-2 rounded-2xl border border-agri-bright/20">
          <label className="text-xs font-semibold text-gray-700 pl-2">Target:</label>
          <input
            type="number"
            value={targetQty}
            onChange={(e) => setTargetQty(Number(e.target.value))}
            className="w-24 px-2.5 py-1 text-sm font-bold bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-agri-deep"
            step="500"
          />
          <span className="text-xs font-bold text-agri-dark pr-2">kg</span>
          <button
            onClick={() => handleRunAggregation(targetQty)}
            disabled={isMatching}
            className="bg-agri-deep hover:bg-agri-dark text-white px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1 cursor-pointer disabled:opacity-50"
          >
            {isMatching ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : 'Re-Match'}
          </button>
        </div>
      </div>

      {/* Progress & Formula Visualization: 1,000 + 1,500 + 2,500 = 5,000 kg */}
      <div className="bg-gradient-to-br from-agri-dark via-agri-deep to-agri-leaf text-white p-5 rounded-2xl shadow-md space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
          <span className="font-semibold text-agri-pale">Smart Combination Equation:</span>
          <div className="bg-white/10 px-3 py-1 rounded-full font-mono text-xs font-bold text-agri-mint">
            {aggregationData.selectedSuppliers.map((s) => `${s.allocatedQuantity.toLocaleString()}kg`).join(' + ')} = {aggregationData.fulfilledQuantity.toLocaleString()} kg
          </div>
        </div>

        {/* Visual Multi-Segment Bar */}
        <div className="w-full bg-black/30 h-5 rounded-full overflow-hidden flex p-0.5 gap-1">
          {aggregationData.selectedSuppliers.map((s, idx) => {
            const colors = ['bg-emerald-400', 'bg-agri-mint', 'bg-teal-300', 'bg-lime-400'];
            return (
              <div
                key={idx}
                style={{ width: `${s.allocationRatio || 33}%` }}
                className={`${colors[idx % colors.length]} h-full rounded-full transition-all duration-700 relative group cursor-pointer`}
                title={`${s.supplierName}: ${s.allocatedQuantity} kg`}
              />
            );
          })}
        </div>

        {/* KPI Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 text-center text-xs">
          <div className="bg-white/10 p-2 rounded-xl">
            <span className="text-agri-pale text-[11px] block">Aggregated Yield</span>
            <span className="font-bold text-base text-white">{aggregationData.fulfilledQuantity.toLocaleString()} kg</span>
          </div>
          <div className="bg-white/10 p-2 rounded-xl">
            <span className="text-agri-pale text-[11px] block">Combined Suppliers</span>
            <span className="font-bold text-base text-white">{aggregationData.suppliersCount} Partners</span>
          </div>
          <div className="bg-white/10 p-2 rounded-xl">
            <span className="text-agri-pale text-[11px] block">Avg Blended Price</span>
            <span className="font-bold text-base text-agri-harvest">₹{aggregationData.averagePricePerKg}/kg</span>
          </div>
          <div className="bg-white/10 p-2 rounded-xl">
            <span className="text-agri-pale text-[11px] block">Trust Reliability</span>
            <span className="font-bold text-base text-white">{aggregationData.aggregateReliability}/100</span>
          </div>
        </div>
      </div>

      {/* Supplier Contribution List */}
      <div className="space-y-3">
        <h4 className="font-display font-bold text-sm text-agri-dark">
          Consolidated Supplier Allocation Breakdown
        </h4>
        <div className="space-y-2">
          {aggregationData.selectedSuppliers.map((supplier, idx) => (
            <div
              key={idx}
              className="flex flex-col sm:flex-row sm:items-center justify-between p-3.5 bg-gray-50 hover:bg-agri-soft/60 rounded-2xl border border-gray-200 transition gap-3"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-agri-pale text-agri-dark font-bold text-xs flex items-center justify-center">
                  #{idx + 1}
                </div>
                <div>
                  <h5 className="font-bold text-sm text-gray-900">{supplier.supplierName}</h5>
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <span className="bg-gray-200 px-2 py-0.5 rounded text-[10px] font-semibold">{supplier.type}</span>
                    <span>📍 {supplier.location}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between sm:justify-end gap-5 text-xs">
                <div>
                  <span className="text-gray-400 block text-[10px]">Supplying</span>
                  <strong className="text-sm text-agri-deep">{supplier.allocatedQuantity.toLocaleString()} kg</strong>
                </div>
                <div>
                  <span className="text-gray-400 block text-[10px]">Price</span>
                  <strong className="text-sm text-gray-800">₹{supplier.pricePerKg}/kg</strong>
                </div>
                <div>
                  <span className="text-gray-400 block text-[10px]">Reliability</span>
                  <span className="font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
                    {supplier.reliabilityScore}/100
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

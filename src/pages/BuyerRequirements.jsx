import React, { useState, useEffect } from 'react';
import {
  Plus,
  Layers,
  Sparkles,
  MapPin,
  Calendar,
  DollarSign,
  ShieldCheck,
  CheckCircle2,
  XCircle,
  Clock,
  ArrowRight,
  TrendingDown
} from 'lucide-react';
import { api } from '../services/api';
import SmartAggregationWidget from '../components/SmartAggregationWidget';

export default function BuyerRequirements() {
  const [requirements, setRequirements] = useState([]);
  const [selectedReq, setSelectedReq] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showAggregationModal, setShowAggregationModal] = useState(false);
  const [formData, setFormData] = useState({
    product: 'Nashik Red Onion',
    category: 'Vegetables',
    quantity: 5000,
    budgetMin: 25,
    budgetMax: 28,
    targetDate: '2026-09-10',
    destination: 'Chennai Central Cold Hub, TN'
  });

  useEffect(() => {
    loadRequirements();
  }, []);

  const loadRequirements = async () => {
    try {
      const res = await api.getRequirements();
      setRequirements(res.requirements || []);
      if (res.requirements && res.requirements.length > 0) {
        setSelectedReq(res.requirements[0]);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleCreateSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.createRequirement(formData);
      setRequirements([res.requirement, ...requirements]);
      setSelectedReq(res.requirement);
      setShowCreateModal(false);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-amber-900 via-agri-earth to-agri-dark text-white rounded-3xl p-6 sm:p-10 shadow-xl relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2 max-w-2xl">
          <div className="inline-flex items-center gap-1.5 bg-white/20 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider text-agri-cream">
            <TrendingDown className="w-3.5 h-3.5 text-agri-harvest" /> Reverse Bidding & Procurement Hub
          </div>
          <h1 className="font-display font-extrabold text-2xl sm:text-4xl tracking-tight">
            Buyers Marketplace & Bulk RFP
          </h1>
          <p className="text-xs sm:text-sm text-agri-cream/90 leading-relaxed">
            Post commercial procurement requirements directly to regional FPOs. Receive competitive reverse bids, compare quality certificates, and combine multi-farmer lots with AI Smart Aggregation.
          </p>
        </div>

        <button
          onClick={() => setShowCreateModal(true)}
          className="bg-white hover:bg-agri-soft text-agri-dark px-5 py-3 rounded-2xl font-bold text-xs sm:text-sm shadow-md transition flex items-center gap-2 cursor-pointer shrink-0 self-start md:self-auto"
        >
          <Plus className="w-4 h-4 text-agri-deep" />
          <span>Publish New Requirement</span>
        </button>
      </div>

      {/* Main Layout: Requirements List on Left, Active Bids / Aggregation on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Requirements Cards */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-display font-bold text-base text-gray-900">
              Published Demands ({requirements.length})
            </h2>
            <span className="text-xs text-agri-leaf font-semibold">Active RFPs</span>
          </div>

          <div className="space-y-3">
            {requirements.map((req) => (
              <div
                key={req.id}
                onClick={() => setSelectedReq(req)}
                className={`p-4 rounded-2xl border transition cursor-pointer ${
                  selectedReq?.id === req.id
                    ? 'bg-agri-soft/80 border-agri-deep shadow-md ring-2 ring-agri-deep/10'
                    : 'bg-white border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-agri-leaf">
                      {req.category}
                    </span>
                    <h3 className="font-bold text-sm text-gray-900">
                      {req.quantity.toLocaleString()} kg {req.product}
                    </h3>
                  </div>
                  <span className="text-[11px] font-bold px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800">
                    {req.bidsCount || (req.bids ? req.bids.length : 0)} Bids
                  </span>
                </div>

                <div className="mt-3 space-y-1 text-xs text-gray-600">
                  <div className="flex items-center gap-1">
                    <DollarSign className="w-3.5 h-3.5 text-gray-400" />
                    <span>Target Budget: ₹{req.budgetMin} – ₹{req.budgetMax} / kg</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-gray-400" />
                    <span className="truncate">{req.destination}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-gray-400" />
                    <span>Needed by {req.targetDate}</span>
                  </div>
                </div>

                <div className="mt-3 pt-2 border-t border-gray-100 flex items-center justify-between text-[11px]">
                  <span className="text-gray-400">{req.buyerName}</span>
                  <span className="font-bold text-agri-deep flex items-center gap-1">
                    <Sparkles className="w-3 h-3" /> Match: {req.matchingScore || 92}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Detailed Reverse Bids & Multi-Supplier Smart Aggregation */}
        <div className="lg:col-span-2 space-y-6">
          {selectedReq ? (
            <div className="bg-white rounded-3xl border border-gray-200 p-6 shadow-sm space-y-6">
              {/* Selected Requirement Detail Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-gray-100">
                <div>
                  <span className="text-xs font-mono font-bold text-agri-leaf bg-agri-pale px-2.5 py-1 rounded-full">
                    {selectedReq.id} &bull; {selectedReq.status}
                  </span>
                  <h2 className="font-display font-extrabold text-2xl text-agri-dark mt-2">
                    {selectedReq.quantity.toLocaleString()} kg {selectedReq.product} Procurement
                  </h2>
                  <p className="text-xs text-gray-500 mt-1">
                    Published by {selectedReq.buyerName} for delivery at {selectedReq.destination}
                  </p>
                </div>

                <button
                  onClick={() => setShowAggregationModal(!showAggregationModal)}
                  className="bg-agri-deep hover:bg-agri-dark text-white px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-sm cursor-pointer shrink-0"
                >
                  <Layers className="w-4 h-4 text-agri-mint" />
                  <span>{showAggregationModal ? 'Hide Aggregation View' : 'Run Smart Aggregation'}</span>
                </button>
              </div>

              {/* Dynamic Smart Aggregation View */}
              {showAggregationModal && (
                <div className="animate-in fade-in zoom-in-95">
                  <SmartAggregationWidget requirement={selectedReq} />
                </div>
              )}

              {/* Reverse Bids Received */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-display font-bold text-base text-gray-900">
                    Live Supplier Bids ({selectedReq.bids?.length || 0})
                  </h3>
                  <span className="text-xs text-gray-500">
                    Sorted by lowest quote & reliability score
                  </span>
                </div>

                {selectedReq.bids && selectedReq.bids.length > 0 ? (
                  <div className="space-y-3">
                    {selectedReq.bids.map((bid) => (
                      <div
                        key={bid.bidId}
                        className="p-4 rounded-2xl border border-gray-200 hover:border-agri-bright/50 bg-gray-50/70 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition"
                      >
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <h4 className="font-bold text-sm text-gray-900">{bid.supplierName}</h4>
                            <span className="text-[10px] bg-white border border-gray-200 px-2 py-0.5 rounded font-semibold text-gray-600">
                              {bid.supplierRole}
                            </span>
                            <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                              {bid.grade}
                            </span>
                          </div>
                          <div className="flex items-center gap-3 text-xs text-gray-500">
                            <span>📍 {bid.location} ({bid.distanceKm} km transit)</span>
                            <span className="flex items-center gap-1 font-semibold text-agri-deep">
                              <ShieldCheck className="w-3.5 h-3.5 text-agri-leaf" /> {bid.reliabilityScore}/100 Reliability
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center justify-between sm:justify-end gap-5">
                          <div className="text-right">
                            <span className="text-xs text-gray-400 block">Offered Quantity</span>
                            <strong className="text-sm text-gray-900">{bid.quantityOffered.toLocaleString()} kg</strong>
                          </div>
                          <div className="text-right">
                            <span className="text-xs text-gray-400 block">Price Bid</span>
                            <strong className="text-base text-agri-deep">₹{bid.pricePerKg}/kg</strong>
                          </div>
                          <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${
                            bid.status === 'ACCEPTED'
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-rose-100 text-rose-800'
                          }`}>
                            {bid.status}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-8 text-center bg-gray-50 rounded-2xl border border-dashed border-gray-300">
                    <p className="text-xs text-gray-500">AI Supplier Discovery is actively matching regional FPOs for this RFP.</p>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="p-12 text-center bg-white rounded-3xl border border-gray-200">
              <p className="text-sm text-gray-500">Select an RFP on the left to inspect reverse bids.</p>
            </div>
          )}
        </div>
      </div>

      {/* Create Requirement Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden border border-agri-bright/30 my-8">
            <div className="bg-agri-dark text-white p-5">
              <h3 className="font-display font-bold text-xl">Publish Commercial Requirement</h3>
              <p className="text-xs text-agri-pale mt-0.5">Directly broadcast to verified FPO clusters</p>
            </div>

            <form onSubmit={handleCreateSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Produce Name</label>
                <input
                  type="text"
                  required
                  value={formData.product}
                  onChange={(e) => setFormData({ ...formData, product: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-xl text-xs focus:ring-2 focus:ring-agri-deep"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Required Quantity (kg)</label>
                  <input
                    type="number"
                    required
                    min="100"
                    value={formData.quantity}
                    onChange={(e) => setFormData({ ...formData, quantity: Number(e.target.value) })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-xl text-xs focus:ring-2 focus:ring-agri-deep"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Category</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-xl text-xs focus:ring-2 focus:ring-agri-deep"
                  >
                    <option value="Vegetables">Vegetables</option>
                    <option value="Fruits">Fruits</option>
                    <option value="Grains">Grains</option>
                    <option value="Pulses">Pulses</option>
                    <option value="Spices">Spices</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Min Budget (₹/kg)</label>
                  <input
                    type="number"
                    value={formData.budgetMin}
                    onChange={(e) => setFormData({ ...formData, budgetMin: Number(e.target.value) })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-xl text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Max Budget (₹/kg)</label>
                  <input
                    type="number"
                    value={formData.budgetMax}
                    onChange={(e) => setFormData({ ...formData, budgetMax: Number(e.target.value) })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-xl text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Target Delivery Date</label>
                  <input
                    type="date"
                    required
                    value={formData.targetDate}
                    onChange={(e) => setFormData({ ...formData, targetDate: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-xl text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Destination Hub</label>
                  <input
                    type="text"
                    required
                    value={formData.destination}
                    onChange={(e) => setFormData({ ...formData, destination: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-xl text-xs"
                  />
                </div>
              </div>

              <div className="pt-3 flex justify-end gap-2 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 border border-gray-300 rounded-xl text-xs font-semibold text-gray-700 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-agri-deep hover:bg-agri-dark text-white rounded-xl text-xs font-bold shadow transition cursor-pointer"
                >
                  Broadcast RFP
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

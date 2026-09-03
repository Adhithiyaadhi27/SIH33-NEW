import React, { useState } from 'react';
import {
  QrCode,
  Search,
  ShieldCheck,
  MapPin,
  Calendar,
  CheckCircle2,
  Download,
  Truck,
  Layers,
  Sparkles
} from 'lucide-react';
import PassportModal from '../components/PassportModal';
import { INITIAL_PASSPORT } from '../services/mockData';

export default function ProducePassportPage() {
  const [searchBatch, setSearchBatch] = useState('AGR-2026-1024');
  const [passport, setPassport] = useState(INITIAL_PASSPORT);
  const [showModal, setShowModal] = useState(false);

  const handleLookup = (e) => {
    e.preventDefault();
    if (!searchBatch) return;
    // Load or generate passport for searched batch
    setPassport({
      ...INITIAL_PASSPORT,
      batchId: searchBatch.toUpperCase()
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Banner */}
      <div className="bg-gradient-to-r from-agri-dark via-agri-deep to-teal-950 text-white rounded-3xl p-6 sm:p-10 shadow-xl relative overflow-hidden">
        <div className="max-w-3xl space-y-2">
          <div className="inline-flex items-center gap-1.5 bg-white/20 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider text-agri-mint">
            <ShieldCheck className="w-3.5 h-3.5" /> Blockchain-Backed Digital Traceability
          </div>
          <h1 className="font-display font-extrabold text-2xl sm:text-4xl tracking-tight">
            🏷️ Digital Produce Passport Registry
          </h1>
          <p className="text-xs sm:text-sm text-agri-pale/90 leading-relaxed">
            Verify the complete journey of your agricultural harvest from exact farmer plot GPS coordinates to cold packhouses, temperature-controlled highway haulage, and final delivery.
          </p>
        </div>
      </div>

      {/* Search Batch Bar */}
      <form onSubmit={handleLookup} className="flex gap-2 max-w-xl mx-auto">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-3.5" />
          <input
            type="text"
            placeholder="Enter Batch ID (e.g. AGR-2026-1024)..."
            value={searchBatch}
            onChange={(e) => setSearchBatch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-2xl text-xs sm:text-sm focus:ring-2 focus:ring-agri-deep shadow-sm"
          />
        </div>
        <button
          type="submit"
          className="bg-agri-deep hover:bg-agri-dark text-white px-5 py-2.5 rounded-2xl text-xs font-bold transition shadow cursor-pointer shrink-0"
        >
          Lookup Batch
        </button>
      </form>

      {/* Passport Certificate Card */}
      {passport && (
        <div className="bg-white rounded-3xl border border-agri-bright/30 p-6 sm:p-8 shadow-xl max-w-4xl mx-auto space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-gray-100">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold bg-agri-pale text-agri-dark px-3 py-1 rounded-full">
                  Batch: {passport.batchId}
                </span>
                <span className="text-xs font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> {passport.verificationStatus}
                </span>
              </div>
              <h2 className="font-display font-bold text-2xl text-agri-dark mt-2">
                {passport.product} &bull; <span className="text-agri-leaf">{passport.grade}</span>
              </h2>
              <p className="text-xs text-gray-500 mt-0.5">
                Variety: {passport.variety} &bull; Aggregate Yield: {passport.quantity}
              </p>
            </div>

            <button
              onClick={() => setShowModal(true)}
              className="bg-agri-pale hover:bg-agri-bright/30 text-agri-dark border border-agri-bright/40 px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition cursor-pointer self-start sm:self-auto"
            >
              <QrCode className="w-4 h-4 text-agri-deep" />
              <span>Inspect Full QR Modal</span>
            </button>
          </div>

          {/* Key Entities Row */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100 space-y-1">
              <span className="text-[10px] uppercase font-bold text-gray-400 block">Origin & GPS</span>
              <div className="font-bold text-sm text-gray-900">{passport.origin}</div>
              <p className="text-[11px] text-gray-500 font-mono">
                {passport.gpsCoordinates.latitude}° N, {passport.gpsCoordinates.longitude}° E
              </p>
            </div>

            <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100 space-y-1">
              <span className="text-[10px] uppercase font-bold text-gray-400 block">Consolidating FPO</span>
              <div className="font-bold text-sm text-gray-900">{passport.fpo.name}</div>
              <p className="text-[11px] text-gray-500">Manager: {passport.fpo.manager}</p>
            </div>

            <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100 space-y-1">
              <span className="text-[10px] uppercase font-bold text-gray-400 block">Cold Chain Telemetry</span>
              <div className="font-bold text-sm text-agri-deep">{passport.warehouse.name}</div>
              <p className="text-[11px] text-gray-500">
                Temp: {passport.warehouse.temperature} &bull; Humidity: {passport.warehouse.humidity}
              </p>
            </div>
          </div>

          {/* Timeline */}
          <div className="space-y-4">
            <h3 className="font-display font-bold text-base text-agri-dark">
              Traceability Journey Sequence
            </h3>
            <div className="space-y-4 border-l-2 border-agri-bright/40 ml-4 pl-5">
              {passport.timeline.map((step, idx) => (
                <div key={idx} className="relative text-xs">
                  <span className={`absolute -left-[27px] top-1 w-3.5 h-3.5 rounded-full border-2 border-white ${
                    step.status === 'COMPLETED' ? 'bg-agri-deep' : step.status === 'IN_TRANSIT' ? 'bg-agri-harvest animate-pulse' : 'bg-gray-300'
                  }`} />
                  <div className="flex items-center justify-between font-bold text-gray-900">
                    <span>{step.step}</span>
                    <span className="text-[10px] text-gray-400 font-mono">{step.timestamp}</span>
                  </div>
                  <div className="text-gray-500 text-[11px] mt-0.5">{step.location}</div>
                  <p className="text-gray-600 mt-1">{step.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {showModal && (
        <PassportModal
          passport={passport}
          onClose={() => setShowModal(false)}
        />
      )}
    </div>
  );
}

import React, { useState } from 'react';
import { Truck, MapPin, CheckCircle2, Upload, Camera, Navigation, DollarSign } from 'lucide-react';
import { api } from '../../services/api';

export default function LogisticsDashboard() {
  const [podUploaded, setPodUploaded] = useState(false);
  const [status, setStatus] = useState('IN_TRANSIT');

  const handlePoDUpload = () => {
    setPodUploaded(true);
    setStatus('DELIVERED');
  };

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="bg-gradient-to-r from-gray-900 via-agri-dark to-teal-900 text-white p-6 rounded-3xl shadow-lg flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold text-agri-mint uppercase tracking-wider">
            Cold Fleet Dispatch & Corridor Dispatch
          </span>
          <h1 className="font-display font-bold text-2xl mt-1">
            Veloce Agri-Logistics (Fleet Command)
          </h1>
          <p className="text-xs text-agri-pale mt-0.5">
            Active Fleet: 18 Refrigerated Eicher & BharatBenz carriers with real-time temperature telemetry.
          </p>
        </div>
        <div className="bg-white/10 p-3 rounded-2xl text-xs text-center border border-white/15">
          <span className="text-agri-pale text-[11px] block">Dispatched Today</span>
          <strong className="text-xl text-white">42.5 Tonnes</strong>
        </div>
      </div>

      {/* Active Assignment Card */}
      <div className="bg-white rounded-3xl border border-gray-200 p-6 shadow-sm space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-gray-100">
          <div>
            <span className="text-xs font-mono font-bold bg-agri-pale text-agri-dark px-2.5 py-1 rounded">
              Assignment: LOG-ASG-8812 &bull; Order ORD-2026-5501
            </span>
            <h3 className="font-bold text-lg text-gray-900 mt-1.5">
              16-Ton Red Onion Corridor: Nashik FPO &rarr; Madhavaram DC, Chennai
            </h3>
          </div>
          <span className={`text-xs font-bold px-3 py-1 rounded-full ${
            status === 'DELIVERED' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800 animate-pulse'
          }`}>
            {status}
          </span>
        </div>

        {/* Telemetry & Vehicle Details */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          <div className="bg-gray-50 p-3 rounded-xl border border-gray-100">
            <span className="text-gray-400 block text-[10px]">Vehicle Info</span>
            <strong className="text-gray-800">MH-15-EG-8022</strong>
            <span className="text-[10px] text-gray-500 block">Refrigerated Multi-Axle</span>
          </div>

          <div className="bg-gray-50 p-3 rounded-xl border border-gray-100">
            <span className="text-gray-400 block text-[10px]">IoT Cargo Telemetry</span>
            <strong className="text-agri-deep">14.2 °C (Optimal)</strong>
            <span className="text-[10px] text-emerald-600 block">Relative Humidity 75%</span>
          </div>

          <div className="bg-gray-50 p-3 rounded-xl border border-gray-100">
            <span className="text-gray-400 block text-[10px]">Total Highway Distance</span>
            <strong className="text-gray-800">1,180 km (NH-48)</strong>
            <span className="text-[10px] text-gray-500 block">Est: 34 Hours</span>
          </div>

          <div className="bg-gray-50 p-3 rounded-xl border border-gray-100">
            <span className="text-gray-400 block text-[10px]">Trip Earnings</span>
            <strong className="text-agri-deep text-sm">₹8,500 + Toll</strong>
            <span className="text-[10px] text-emerald-600 block">Direct Mandi Payout</span>
          </div>
        </div>

        {/* Digital Proof of Delivery (PoD) Section */}
        <div className="p-4 bg-agri-soft/70 rounded-2xl border border-agri-bright/30 space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="font-bold text-xs uppercase tracking-wider text-agri-dark flex items-center gap-1.5">
              <Camera className="w-4 h-4 text-agri-leaf" /> Digital Proof of Delivery (PoD)
            </h4>
            {podUploaded && (
              <span className="text-xs font-bold text-emerald-700 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> PoD Verified & Escrow Released
              </span>
            )}
          </div>

          {podUploaded ? (
            <div className="bg-white p-3 rounded-xl border border-gray-200 text-xs flex items-center justify-between">
              <div>
                <span className="font-bold text-gray-800">Weighbridge Receipt #WB-44102</span>
                <p className="text-[11px] text-gray-500">Intake gross 16,040 kg verified at Madhavaram gate.</p>
              </div>
              <span className="text-emerald-700 font-bold">100% Match</span>
            </div>
          ) : (
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
              <p className="text-xs text-gray-600">
                Upload signed receiver stamp or weighbridge manifest to finalize delivery and trigger automated carrier payout.
              </p>
              <button
                onClick={handlePoDUpload}
                className="bg-agri-deep hover:bg-agri-dark text-white px-4 py-2 rounded-xl text-xs font-bold shadow transition flex items-center gap-1.5 cursor-pointer shrink-0"
              >
                <Upload className="w-4 h-4" />
                <span>Simulate PoD Stamp Upload</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
